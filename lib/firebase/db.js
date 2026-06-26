import { db } from './client'
import {
  collection, doc, getDocs, getDoc,
  addDoc, setDoc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy,
} from 'firebase/firestore'

// ── Products ────────────────────────────────────────────────────────────────

export async function getProducts() {
  const snap = await getDocs(query(collection(db, 'products'), orderBy('order', 'asc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function saveProduct(data, id) {
  if (id) {
    await updateDoc(doc(db, 'products', id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id))
}

export async function seedProductsIfEmpty(staticProducts) {
  const snap = await getDocs(collection(db, 'products'))
  if (!snap.empty) return
  await Promise.all(
    staticProducts.map((p, i) =>
      setDoc(doc(db, 'products', p.id), {
        ...p,
        order: i,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    ),
  )
}

// ── Toppings ────────────────────────────────────────────────────────────────

export async function getToppingCategories() {
  const snap = await getDocs(query(collection(db, 'toppings'), orderBy('order', 'asc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function saveToppingCategory(data, id) {
  if (id) {
    await updateDoc(doc(db, 'toppings', id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, 'toppings'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteToppingCategory(id) {
  await deleteDoc(doc(db, 'toppings', id))
}

// ── Promos ──────────────────────────────────────────────────────────────────

export async function getPromos() {
  const snap = await getDocs(query(collection(db, 'promos'), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function savePromo(data, id) {
  if (id) {
    await updateDoc(doc(db, 'promos', id), { ...data, updatedAt: serverTimestamp() })
    return id
  }
  const ref = await addDoc(collection(db, 'promos'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function deletePromo(id) {
  await deleteDoc(doc(db, 'promos', id))
}

// ── Config ──────────────────────────────────────────────────────────────────

export async function getConfig() {
  const snap = await getDoc(doc(db, 'config', 'business'))
  return snap.exists() ? snap.data() : null
}

export async function saveConfig(data) {
  await setDoc(doc(db, 'config', 'business'), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

// ── Cupones / Participants ──────────────────────────────────────────────────

export async function getParticipants() {
  const snap = await getDocs(query(collection(db, 'cupones'), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
