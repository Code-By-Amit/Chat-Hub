const webpush = require('web-push');
const PushSubscription = require('../models/pushMessageSubscription.model');

webpush.setVapidDetails(
    'mailto:no-reply@yourdomain.com',  // a dummy email here
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

async function sendWebPushNotification(userId, notificationPayload) {
    const subscriptions = await PushSubscription.find({ userId }).lean();

    for (const sub of subscriptions) {
        const pushSubscription = {
            endpoint: sub.endpoint, 
            keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth }
        };
        try {
            await webpush.sendNotification(pushSubscription, JSON.stringify(notificationPayload));
        } catch (error) {
            console.error('Push failed, maybe subscription is invalid:', error.message);
        }
    }
}

module.exports = { sendWebPushNotification }
