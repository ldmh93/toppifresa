const SITE_URL = 'https://toppifresa.vercel.app'

export default function sitemap() {
  const routes = ['', '/productos', '/promos', '/toppings', '/dinamicas', '/ubicacion']
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/promos' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/productos' ? 0.9 : 0.7,
  }))
}
