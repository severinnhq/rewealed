const fetch = require('node-fetch');
const { Expo } = require('expo-server-sdk');
require('dotenv').config();

const API_URL = process.env.API_URL;
const EXPO_PUSH_TOKEN = process.env.EXPO_PUSH_TOKEN;

let lastOrderCount = 0;
const expo = new Expo();

module.exports = async (req, res) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const orders = await response.json();
    console.log(`Fetched ${orders.length} orders`);

    if (orders.length > lastOrderCount) {
      const newOrdersCount = orders.length - lastOrderCount;
      console.log(`New orders detected: ${newOrdersCount}`);

      // Ensure the token is valid before sending
      if (!Expo.isExpoPushToken(EXPO_PUSH_TOKEN)) {
        throw new Error(`Push token ${EXPO_PUSH_TOKEN} is not a valid Expo push token`);
      }

      const message = {
        to: EXPO_PUSH_TOKEN,
        sound: 'default',
        title: 'New Order Alert!',
        body: `You have ${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''}!`,
        data: { orderCount: orders.length },
      };

      const chunks = expo.chunkPushNotifications([message]);
      const tickets = [];
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
          console.log('Push notification sent:', ticketChunk);
        } catch (error) {
          console.error('Error sending push notification:', error);
        }
      }

      lastOrderCount = orders.length;
      res.status(200).json({ message: 'New orders detected and notification sent', tickets });
    } else {
      console.log('No new orders');
      res.status(200).json({ message: 'No new orders' });
    }
  } catch (error) {
    console.error('Error checking for new orders:', error);
    res.status(500).json({ error: 'Error checking for new orders' });
  }
};

