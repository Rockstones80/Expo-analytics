import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoryScreen = () => {
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

  // Function to render each history item
  const renderHistoryItem = ({ item }) => (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-800 font-medium">{item.date}</Text>
        <Text className="text-gray-600">{item.time}</Text>
      </View>
      
      <View className="flex-row mt-2">
        <View className="flex-1">
          <Text className="text-gray-500 text-xs">Temperature</Text>
          <Text className="text-blue-600 font-medium">{item.temperature}°C</Text>
        </View>
        
        <View className="flex-1">
          <Text className="text-gray-500 text-xs">Humidity</Text>
          <Text className="text-green-600 font-medium">{item.humidity}%</Text>
        </View>
        
        <View className="flex-1">
          <Text className="text-gray-500 text-xs">Pressure</Text>
          <Text className="text-purple-600 font-medium">{item.pressure} hPa</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-6">History</Text>
        
        {/* Filter options */}
        <View className="flex-row mb-4">
          <View className="bg-blue-500 rounded-full px-4 py-1 mr-2">
            <Text className="text-white">All</Text>
          </View>
          <View className="bg-white border border-gray-300 rounded-full px-4 py-1 mr-2">
            <Text className="text-gray-700">Today</Text>
          </View>
          <View className="bg-white border border-gray-300 rounded-full px-4 py-1 mr-2">
            <Text className="text-gray-700">Yesterday</Text>
          </View>
          <View className="bg-white border border-gray-300 rounded-full px-4 py-1">
            <Text className="text-gray-700">This Week</Text>
          </View>
        </View>
        
        {/* History list */}
        <FlatList
          data={historyData}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
