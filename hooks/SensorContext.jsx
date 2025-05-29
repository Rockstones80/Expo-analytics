import React, { createContext, useContext, useState, useEffect } from 'react';

const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);


  const fetchSensorData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/sensors");
      const result = await response.json();
      setSensorData(result.sensors);
      setError(null);
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    sensorData,
    loading,
    error,
    lastUpdate,
    refreshData: fetchSensorData
  };

  return (
    <SensorContext.Provider value={value}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensor = () => {
  const context = useContext(SensorContext);
  if (context === undefined) {
    throw new Error('useSensor must be used within a SensorProvider');
  }
  return context;
};