import * as Notifications from "expo-notifications";

interface Thresholds {
  warning: number;
  critical: number;
}

interface SensorThresholds {
  [key: string]: Thresholds;
}

const THRESHOLDS: SensorThresholds = {
  "Flow Rate": {
    warning: 80,
    critical: 90,
  },
  "Water Pressure": {
    warning: 70,
    critical: 85,
  },
  "Water Level": {
    warning: 75,
    critical: 90,
  },
};

export const initializeNotifications = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  await Notifications.setNotificationChannelAsync("sensor-alerts", {
    name: "Sensor Alerts",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });

  return true;
};

export const checkThresholdsAndNotify = async (
  sensorName: string,
  value: number,
  status: string
): Promise<void> => {
  const thresholds = THRESHOLDS[sensorName];
  if (!thresholds) return;

  let title = "";
  let body = "";

  if (value >= thresholds.critical) {
    title = `🚨 Critical Alert: ${sensorName}`;
    body = `${sensorName} has reached critical level: ${value}`;
  } else if (value >= thresholds.warning) {
    title = `⚠️ Warning: ${sensorName}`;
    body = `${sensorName} is approaching critical level: ${value}`;
  }

  if (title && body) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });
  }
};
