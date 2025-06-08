import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', function (event) {
    const data = event.data.json();
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            data: data.data,
            tag: data.data?.chatId || 'general', // Replace notifications for the same chat
            renotify: true // Will vibrate/ping again if updated
        })
    );
});

self.addEventListener('message', (event) => {
    console.log("message event triggered, :", event)
    if (event.data?.type === 'simulate-push') {
        const data = event.data.payload;
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            data: data.data
        }).then(() => {
            console.log('Notification shown');
        }).catch(err => {
            console.error('Notification error:', err);
        });
    }
});


self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});
