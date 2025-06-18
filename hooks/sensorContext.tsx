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

interface SensorData {
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
}

interface SensorContextType {
  sensorData: Record<string, SensorData>;
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
  refreshData: () => Promise<void>;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

const POLLING_INTERVAL = 5000; // 5 seconds

interface SensorProviderProps {
  children: React.ReactNode;
}

export const SensorProvider: React.FC<SensorProviderProps> = ({ children }) => {
  const [sensorData, setSensorData] = useState<Record<string, SensorData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
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
      const result = (await response.json()) as {
        sensors: Record<string, SensorData>;
      };
      console.log(result.sensors);

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
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSensorData]);

  const value: SensorContextType = {
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

export const useSensor = (): SensorContextType => {
  const context = useContext(SensorContext);
  if (context === undefined) {
    throw new Error("useSensor must be used within a SensorProvider");
  }
  return context;
};
