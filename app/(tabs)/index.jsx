import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSensor } from '@/hooks/SensorContext';

const DashboardScreen = () => {
  const { sensorData, loading, error } = useSensor();
  console.log(sensorData)
  // const currentReadings = sensorData;
  // Sample data for dashboard
  const currentReadings = {
    flowRate: 68,
    waterLevel: 25.4,
    waterPressure: 1013.2,
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: "4rem" }}>
        <View className="p-5">
          <View className="justify-between flex-row items-center mb-4">
            <Text className="text-3xl font-bold text-black">Dashboard</Text>
           <AntDesign name="clockcircleo" size={24} color="#CFCFCF" />
          </View>

          {/* Status Card */}
          <View className="bg-[#2FCA91] rounded-2xl shadow-md shadow-gray-100 p-4 mb-8 w-1/2">
            <Text className="text-lg font-bold text-white mb-3">
              System Status
            </Text>
            <View className="flex-row items-center mb-4">
              <View className="h-3 w-3 rounded-full bg-white mr-2" />
              <Text className="text-white">All systems operational</Text>
            </View>
            <Text className="text-white text-xs mt-2">
              Last updated: 5 seconds ago
            </Text>
          </View>

          {/* Current Readings Card */}
          <Text className="text-xl font-bold text-black mb-4">
            Current Readings
          </Text>
          <View style={{ gap: 16 }} className="flex-row mb-4">
            <View className="bg-[#F7F7F7] p-4 flex-1 rounded-2xl shadow-md shadow-gray-100">
              <View className="flex-row justify-between items-center mb-3">
                <View className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
                  <FontAwesome5 name="water" size={20} color="#2FCA91" />
                </View>
                <Text className=" font-semibold text-[#2FCA91] text-[14px]">{sensorData?.flowRate?.value} L/min</Text>
              </View>

              <View>
                <Text className="text-[#0A1931] font-medium text-base mb-1">
                  Flow Rate
                </Text>
                <Text className="text-gray-500 text-sm"></Text>
              </View>
            </View>
            <View className="bg-[#F7F7F7] p-4 flex-1 rounded-2xl shadow-md shadow-gray-100">
              <View className="flex-row justify-between items-center mb-3">
                <View className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
                  <FontAwesome5 name="cloudscale" size={24} color="#2FCA91" />
                </View>
                <Text className="font-semibold text-[#2FCA91]">{sensorData?.waterPressure?.value} kPa</Text>
              </View>

              <View>
                <Text className="text-[#0A1931] font-medium text-base mb-1">
                  Water Pressure
                </Text>
                <Text className="text-gray-500 text-sm"></Text>
              </View>
            </View>
          </View>
          <View className="bg-[#F7F7F7] p-4 flex-1 rounded-2xl shadow-md shadow-gray-100 mb-5">
            <View className="flex-row justify-between items-center mb-3">
              <View className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
                <FontAwesome6 name="glass-water" size={24} color="#2FCA91" />
              </View>
              <Text className=" font-semibold text-[#2FCA91]">{sensorData?.clogDetection?.value} cm</Text>
            </View>

            <View>
              <Text className="text-[#0A1931] font-medium text-base mb-1">
                Water Level
              </Text>
              <Text className="text-gray-500 text-sm"></Text>
            </View>
          </View>

          {/* Quick Actions Card */}
          {/* <View className="bg-white  rounded-2xl shadow-md shadow-gray-100 p-5 mb-28 ">
            <Text className="text-lg font-semibold text-gray-700 mb-3">
              Quick Actions
            </Text>

            <View className="flex-row flex-wrap justify-between">
              <View className="bg-blue-50 rounded-lg p-3 w-[48%] mb-3">
                <Text className="text-blue-700 font-medium">
                  View Analytics
                </Text>
              </View>

              <View className="bg-green-50 rounded-lg p-3 w-[48%] mb-3">
                <Text className="text-green-700 font-medium">Export Data</Text>
              </View>

              <View className="bg-purple-50 rounded-lg p-3 w-[48%]">
                <Text className="text-purple-700 font-medium">
                  View History
                </Text>
              </View>

              <View className="bg-orange-50 rounded-lg p-3 w-[48%]">
                <Text className="text-orange-700 font-medium">Settings</Text>
              </View>
            </View>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
