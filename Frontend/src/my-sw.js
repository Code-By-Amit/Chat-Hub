// src/my-sw.js (or wherever you have your custom service worker)
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-precaching.prod.js'
)

workbox.precaching.cleanupOutdatedCaches()
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)


self.addEventListener('push', function (event) {
    const data = event.data.json();
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            data: data.data
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});
// import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
// cleanupOutdatedCaches()

// precacheAndRoute(self.__WB_MANIFEST)