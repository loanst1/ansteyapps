// Self-destruct: unregister this service worker and clear all caches
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', async () => {
  const names = await caches.keys();
  await Promise.all(names.map(n => caches.delete(n)));
  self.registration.unregister();
});
