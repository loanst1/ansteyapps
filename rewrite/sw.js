// Self-destruct: unregister this service worker and clear all caches.
// v1.0.22: no longer force-navigates clients on activate (that reload could
// loop with the page re-registering the worker). Clears caches and unregisters.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', async () => {
  const names = await caches.keys();
  await Promise.all(names.map(n => caches.delete(n)));
  self.registration.unregister();
});
