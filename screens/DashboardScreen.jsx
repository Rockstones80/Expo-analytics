import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardScreen = () => {
  // Sample data for dashboard
  const currentReadings = {
    temperature: 25.4,
    humidity: 68,
    pressure: 1013.2
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800 mb-6">Dashboard</Text>
          
          {/* Current Readings Card */}
          <View className="bg-white rounded-xl shadow-md p-5 mb-4">
            <Text className="text-lg font-semibold text-gray-700 mb-3">Current Readings</Text>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Temperature</Text>
              <Text className="font-medium text-blue-600">{currentReadings.temperature}°C</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Humidity</Text>
              <Text className="font-medium text-green-600">{currentReadings.humidity}%</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Pressure</Text>
              <Text className="font-medium text-purple-600">{currentReadings.pressure} hPa</Text>
            </View>
          </View>
          
          {/* Status Card */}
          <View className="bg-white rounded-xl shadow-md p-5 mb-4">
            <Text className="text-lg font-semibold text-gray-700 mb-3">System Status</Text>
            <View className="flex-row items-center">
              <View className="h-3 w-3 rounded-full bg-green-500 mr-2" />
              <Text className="text-gray-700">All systems operational</Text>
            </View>
            <Text className="text-gray-500 text-sm mt-2">Last updated: 5 minutes ago</Text>
          </View>
          
          {/* Quick Actions Card */}
          <View className="bg-white rounded-xl shadow-md p-5">
            <Text className="text-lg font-semibold text-gray-700 mb-3">Quick Actions</Text>
            
            <View className="flex-row flex-wrap justify-between">
              <View className="bg-blue-50 rounded-lg p-3 w-[48%] mb-3">
                <Text className="text-blue-700 font-medium">View Analytics</Text>
              </View>
              
              <View className="bg-green-50 rounded-lg p-3 w-[48%] mb-3">
                <Text className="text-green-700 font-medium">Export Data</Text>
              </View>
              
              <View className="bg-purple-50 rounded-lg p-3 w-[48%]">
                <Text className="text-purple-700 font-medium">View History</Text>
              </View>
              
              <View className="bg-orange-50 rounded-lg p-3 w-[48%]">
                <Text className="text-orange-700 font-medium">Settings</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
