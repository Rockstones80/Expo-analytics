import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';

const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use refs to track state without causing re-renders
  const fetchInProgress = useRef(false);
  const mountedRef = useRef(true);
  const retryTimeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Memoized fetch function to prevent recreation on every render
  const fetchSensorData = useCallback(async (isManualRefresh = false) => {
    // Prevent multiple simultaneous requests
    if (fetchInProgress.current) return;
    
    try {
      fetchInProgress.current = true;
      
      // Only show loading for initial load, use isRefreshing for manual refreshes
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (!sensorData || Object.keys(sensorData).length === 0) {
        setLoading(true);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch("http://localhost:5000/api/sensors", {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Only update if component is still mounted
      if (mountedRef.current) {
        // Use functional updates to avoid stale closures
        setSensorData(prevData => {
          // Only update if data actually changed
          const newData = result.sensors || {};
          if (JSON.stringify(prevData) === JSON.stringify(newData)) {
            return prevData; // Return same reference to prevent re-render
          }
          return newData;
        });
        
        setError(null);
        setLastUpdate(new Date().toLocaleString());
        
        // Clear any existing retry timeout
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
      }
    } catch (error) {
      if (mountedRef.current && error.name !== 'AbortError') {
        console.error("Error fetching sensor data:", error);
        setError(error.message);
        
        // Implement exponential backoff for retries
        retryTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            fetchSensorData();
          }
        }, 15000); // Retry after 15 seconds on error
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setIsRefreshing(false);
        fetchInProgress.current = false;
      }
    }
  }, [sensorData]);

  // Manual refresh function
  const refreshData = useCallback(() => {
    fetchSensorData(true);
  }, [fetchSensorData]);

  // Setup polling effect
  useEffect(() => {
    fetchSensorData(); // Initial fetch
    
    // Set up polling interval
    intervalRef.current = setInterval(() => {
      fetchSensorData();
    }, 5000);

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array - effect runs once

  // Handle visibility change to pause/resume polling when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Clear interval when tab is hidden
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Resume polling when tab becomes visible
        if (!intervalRef.current && mountedRef.current) {
          fetchSensorData(); // Immediate fetch when becoming visible
          intervalRef.current = setInterval(() => {
            fetchSensorData();
          }, 5000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchSensorData]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    sensorData,
    loading,
    error,
    lastUpdate,
    isRefreshing,
    refreshData
  }), [sensorData, loading, error, lastUpdate, isRefreshing, refreshData]);

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

export const useSensorData = () => {
  const { sensorData } = useSensor();
  return sensorData;
};

export const useSensorStatus = () => {
  const { loading, error, isRefreshing, lastUpdate } = useSensor();
  return { loading, error, isRefreshing, lastUpdate };
};

export const useSensorActions = () => {
  const { refreshData } = useSensor();
  return { refreshData };
};