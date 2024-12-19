import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export async function sendPushNotification(pushToken: string, title: string, body: string) {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  const message = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { withSome: 'data' },
  };

  try {
    const ticket = await expo.sendPushNotificationsAsync([message]);
    console.log('Push notification sent:', ticket);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

