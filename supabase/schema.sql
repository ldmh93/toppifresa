-- =============================================================
--  Toppifresa — esquema de sorteos mensuales
-- =============================================================
--  Cómo aplicarlo:
--    Supabase → SQL Editor → New query → pega TODO este archivo → Run
--
--  Es idempotente: puedes volver a ejecutarlo sin romper nada.
-- =============================================================


-- -------------------------------------------------------------
--  Sorteos: uno por mes (o por el periodo que decidas)
-- -------------------------------------------------------------
create table if not exists public.sorteos (
  id          uuid primary key default gen_random_uuid(),
  premio      text not null,
  descripcion text,
  cierra_en   date,
  estado      text not null default 'abierto'
                check (estado in ('abierto', 'cerrado')),
  ganador_id  uuid,
  sorteado_en timestamptz,
  created_at  timestamptz not null default now()
);

-- Solo puede haber UN sorteo abierto a la vez. Sin esto, un doble clic en
-- "crear sorteo" partiría los registros del mes en dos bolsas distintas.
create unique index if not exists sorteos_un_solo_abierto
  on public.sorteos (estado)
  where estado = 'abierto';


-- -------------------------------------------------------------
--  Participantes
-- -------------------------------------------------------------
create table if not exists public.participantes (
  id         uuid primary key default gen_random_uuid(),
  sorteo_id  uuid not null references public.sorteos (id) on delete cascade,
  nombre     text not null check (char_length(trim(nombre)) between 2 and 80),
  -- 10 dígitos, sin lada de país: así se captura en el formulario.
  telefono   text not null check (telefono ~ '^[0-9]{10}$'),
  created_at timestamptz not null default now(),

  -- Un número = una participación por sorteo. Es la regla del sorteo aplicada
  -- en la base de datos, no en el navegador: aquí no se puede hacer trampa.
  constraint participantes_unicos_por_sorteo unique (sorteo_id, telefono)
);

create index if not exists participantes_por_sorteo
  on public.participantes (sorteo_id, created_at desc);

-- El ganador es un participante. Se declara después de crear la tabla porque
-- las dos se referencian entre sí.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'sorteos_ganador_fk'
  ) then
    alter table public.sorteos
      add constraint sorteos_ganador_fk
      foreign key (ganador_id) references public.participantes (id)
      on delete set null;
  end if;
end $$;


-- -------------------------------------------------------------
--  Seguridad (RLS)
-- -------------------------------------------------------------
--  Se activa RLS y NO se crea ninguna política. Efecto: nadie que use una
--  llave pública puede leer ni escribir estas tablas. Los nombres y los
--  WhatsApp de las clientas quedan fuera del alcance del navegador.
--
--  La app entra siempre desde el servidor con la llave service_role, que
--  ignora RLS por diseño. Por eso esa llave NO lleva el prefijo
--  NEXT_PUBLIC_ y nunca debe aparecer en el código del cliente.
-- -------------------------------------------------------------
alter table public.sorteos       enable row level security;
alter table public.participantes enable row level security;


-- -------------------------------------------------------------
--  Primer sorteo de ejemplo (solo si aún no hay ninguno)
-- -------------------------------------------------------------
insert into public.sorteos (premio, descripcion)
select '1 Toppi Grande', 'de tu elección + toppings premium'
where not exists (select 1 from public.sorteos);
