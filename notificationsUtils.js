// schedulePushNotification function in notificationUtils.js
import * as Notifications from 'expo-notifications';

// export async function schedulePushNotification(title, body, date = new Date()) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: title,
//       body: body,
//       sound: true, // Optional: set to true if you want your notifications to make a sound
//     },
//     trigger: date.getTime() > Date.now() ? date : null, // Schedule for a future time or send immediately
//   });
// }

export async function schedulePushNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: null, // This schedules the notification to be sent immediately
  });
}

// calculateNotificationIntervals function in notificationUtils.js

export function calculateNotificationIntervals(targetGlasses, currentTime) {
  const startTime = 8 * 60; // 8 AM in minutes
  const endTime = 22 * 60; // 10 PM in minutes
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const activeStart = Math.max(currentMinutes, startTime);
  const totalMinutesAvailable = endTime - activeStart;
  const interval = Math.floor(totalMinutesAvailable / targetGlasses);

  let notificationTimes = [];

  for (let i = 0; i < targetGlasses; i++) {
    let nextTimeInMinutes = activeStart + interval * i;
    notificationTimes.push({
      hours: Math.floor(nextTimeInMinutes / 60),
      minutes: nextTimeInMinutes % 60,
    });
  }

  return notificationTimes;
}

