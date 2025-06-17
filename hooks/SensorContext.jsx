import {
  checkThresholdsAndNotify,
  initializeNotifications,
} from "@/utils/notifications";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const API_URL = "http://localhost:5000";

const SensorContext = createContext();

const POLLING_INTERVAL = 5000; // 5 seconds

export const SensorProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Initialize notifications
  useEffect(() => {
    const setupNotifications = async () => {
      const enabled = await initializeNotifications();
      setNotificationsEnabled(enabled);
    };
    setupNotifications();
  }, []);

  const fetchSensorData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/sensors`);
      const result = await response.json();
      console.log(result.sensors)

      // Check thresholds and send notifications if enabled
      if (notificationsEnabled) {
        Object.entries(result.sensors).forEach(([sensorName, data]) => {
          checkThresholdsAndNotify(sensorName, data.value, data.status);
        });
      }

      setSensorData(result.sensors);
      setError(null);
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [notificationsEnabled, fetchSensorData]);

  const value = {
    sensorData,
    loading,
    error,
    lastUpdate,
    refreshData: fetchSensorData,
    notificationsEnabled,
    setNotificationsEnabled,
  };

  return (
    <SensorContext.Provider value={value}>{children}</SensorContext.Provider>
  );
};

export const useSensor = () => {
  const context = useContext(SensorContext);
  if (context === undefined) {
    throw new Error("useSensor must be used within a SensorProvider");
  }
  return context;
};
