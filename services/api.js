/**
 * API Service for fetching sensor data
 * This is a mock implementation that can be replaced with real API calls
 */

// Mock data for the dashboard
export const fetchCurrentReadings = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    temperature: 25.4,
    humidity: 68,
    pressure: 1013.2,
    lastUpdated: new Date().toISOString()
  };
};

// Mock data for analytics charts
export const fetchAnalyticsData = async (parameter, timeRange = 'month') => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Different data sets based on parameter
  const dataSets = {
    temperature: [
      { x: 1, y: 22.5 }, { x: 2, y: 23.1 }, { x: 3, y: 24.8 },
      { x: 4, y: 25.3 }, { x: 5, y: 25.7 }, { x: 6, y: 24.9 },
      { x: 7, y: 23.4 }, { x: 8, y: 22.8 }, { x: 9, y: 22.0 },
      { x: 10, y: 21.5 }, { x: 11, y: 21.8 }, { x: 12, y: 22.3 }
    ],
    humidity: [
      { x: 1, y: 65 }, { x: 2, y: 67 }, { x: 3, y: 70 },
      { x: 4, y: 72 }, { x: 5, y: 75 }, { x: 6, y: 73 },
      { x: 7, y: 71 }, { x: 8, y: 68 }, { x: 9, y: 66 },
      { x: 10, y: 64 }, { x: 11, y: 63 }, { x: 12, y: 65 }
    ],
    pressure: [
      { x: 1, y: 1010 }, { x: 2, y: 1011 }, { x: 3, y: 1012 },
      { x: 4, y: 1013 }, { x: 5, y: 1014 }, { x: 6, y: 1013 },
      { x: 7, y: 1012 }, { x: 8, y: 1011 }, { x: 9, y: 1010 },
      { x: 10, y: 1009 }, { x: 11, y: 1010 }, { x: 12, y: 1011 }
    ]
  };
  
  return dataSets[parameter] || [];
};

// Mock data for history
export const fetchHistoryData = async (filter = 'all') => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Sample history data
  const historyData = [
    {
      id: '1',
      date: '2025-05-26',
      time: '09:00 AM',
      temperature: 24.5,
      humidity: 67,
      pressure: 1012.5
    },
    {
      id: '2',
      date: '2025-05-26',
      time: '06:00 AM',
      temperature: 22.8,
      humidity: 70,
      pressure: 1013.1
    },
    {
      id: '3',
      date: '2025-05-25',
      time: '09:00 PM',
      temperature: 21.5,
      humidity: 72,
      pressure: 1014.2
    },
    {
      id: '4',
      date: '2025-05-25',
      time: '06:00 PM',
      temperature: 23.7,
      humidity: 65,
      pressure: 1013.8
    },
    {
      id: '5',
      date: '2025-05-25',
      time: '03:00 PM',
      temperature: 25.2,
      humidity: 62,
      pressure: 1012.9
    },
    {
      id: '6',
      date: '2025-05-25',
      time: '12:00 PM',
      temperature: 26.1,
      humidity: 60,
      pressure: 1012.0
    },
    {
      id: '7',
      date: '2025-05-25',
      time: '09:00 AM',
      temperature: 23.9,
      humidity: 68,
      pressure: 1011.5
    },
    {
      id: '8',
      date: '2025-05-25',
      time: '06:00 AM',
      temperature: 22.0,
      humidity: 71,
      pressure: 1010.8
    },
    {
      id: '9',
      date: '2025-05-24',
      time: '09:00 PM',
      temperature: 21.2,
      humidity: 73,
      pressure: 1011.2
    },
    {
      id: '10',
      date: '2025-05-24',
      time: '06:00 PM',
      temperature: 22.8,
      humidity: 69,
      pressure: 1012.4
    }
  ];
  
  // Apply filters if needed
  if (filter === 'today') {
    return historyData.filter(item => item.date === '2025-05-26');
  } else if (filter === 'yesterday') {
    return historyData.filter(item => item.date === '2025-05-25');
  } else if (filter === 'week') {
    return historyData; // All data is within the week in our mock
  }
  
  return historyData;
};
