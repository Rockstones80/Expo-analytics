import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Threshold values for different sensors
export const THRESHOLDS = {
  'Flow Rate': {
    warning: 80, // L/min
    critical: 100, // L/min
  },
  'Water Pressure': {
    // warning: 300, // kPa
    warning: 40, // kPa
    critical: 400, // kPa
  },
  'Water Level': {
    warning: 80, // cm
    critical: 90, // cm
  },
};

// Initialize notifications
export const initializeNotifications = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

// Check sensor values against thresholds and send notifications
export const checkThresholdsAndNotify = async (sensorName, value, status) => {
  const thresholds = THRESHOLDS[sensorName];
  if (!thresholds) return;

  let title = '';
  let body = '';

  if (status === 'critical' && value >= thresholds.critical) {
    title = `🚨 Critical ${sensorName} Alert`;
    body = `${sensorName} has reached critical level: ${value}`;
  } else if (status === 'warning' && value >= thresholds.warning) {
    title = `⚠️ ${sensorName} Warning`;
    body = `${sensorName} is approaching critical level: ${value}`;
  } else {
    return; // No notification needed
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Show immediately
  });
};