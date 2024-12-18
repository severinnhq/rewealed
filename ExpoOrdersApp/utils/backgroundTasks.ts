import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

const BACKGROUND_FETCH_TASK = 'background-fetch';

async function sendPushNotification(expoPushToken: string, title: string, body: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();
  console.log(`Background fetch started at ${new Date(now).toISOString()}`);

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const orders = await response.json();
    console.log(`Fetched ${orders.length} orders in background`);

    const lastOrderCount = parseInt(await AsyncStorage.getItem('lastOrderCount') || '0');
    console.log(`Last order count: ${lastOrderCount}`);

    if (orders.length > lastOrderCount) {
      const newOrdersCount = orders.length - lastOrderCount;
      console.log(`New orders detected in background: ${newOrdersCount}`);

      const expoPushToken = await AsyncStorage.getItem('expoPushToken');
      if (expoPushToken) {
        await sendPushNotification(
          expoPushToken,
          'New Order Alert!',
          `You have ${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''}!`
        );
        console.log('Push notification sent');
      } else {
        console.log('No Expo push token found');
      }

      await AsyncStorage.setItem('lastOrderCount', orders.length.toString());
      console.log('Last order count updated in AsyncStorage');
    } else {
      console.log('No new orders detected in background');
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background fetch failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundFetchAsync() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60, // 1 minute (for testing purposes)
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Background fetch registered successfully');
  } catch (err) {
    console.error('Background fetch failed to register:', err);
  }
}

export async function unregisterBackgroundFetchAsync() {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    console.log('Background fetch unregistered');
  } catch (err) {
    console.error('Background fetch failed to unregister:', err);
  }
}

