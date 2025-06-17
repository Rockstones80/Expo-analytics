import SensorCard from "@/components/SensorCard";
import { useSensor } from "@/hooks/SensorContext";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { memo, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


// Memoize the SensorCard to prevent unnecessary re-renders
const MemoizedSensorCard = memo(SensorCard);

// Memoize the status card component
const StatusCard = memo(({ lastUpdate }) => (
  <View className="bg-[#2FCA91] rounded-2xl shadow-md shadow-gray-100 p-4 mb-8 w-1/2">
    <Text className="text-lg font-bold text-white mb-3">System Status</Text>
    <View className="flex-row items-center mb-4">
      <View className="h-3 w-3 rounded-full bg-white mr-2" />
      <Text className="text-white">All systems operational</Text>
    </View>
    <Text className="text-white text-xs mt-2">Last updated: {lastUpdate}</Text>
  </View>
));
StatusCard.displayName = "StatusCard";

// Memoize the header component
const DashboardHeader = memo(
  ({ notificationsEnabled, onToggleNotifications }) => (
    <View className="justify-between flex-row items-center mb-4">
      <Text className="text-3xl font-bold text-black">Dashboard</Text>
      <View className="flex-row items-center">
        <TouchableOpacity onPress={onToggleNotifications} className="mr-4">
          <Ionicons
            name={notificationsEnabled ? "notifications" : "notifications-off"}
            size={24}
            color={notificationsEnabled ? "#2FCA91" : "#CFCFCF"}
          />
        </TouchableOpacity>
        <AntDesign name="clockcircleo" size={24} color="#CFCFCF" />
      </View>
    </View>
  )
);
DashboardHeader.displayName = "DashboardHeader";

const DashboardScreen = () => {
  const {
    sensorData,
    loading,
    error,
    lastUpdate,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useSensor();

  // Memoize sensor values to prevent unnecessary recalculations
  const sensorValues = useMemo(
    () => ({
      flowRate: {
        value: sensorData?.flowRate?.value,
        status: sensorData?.flowRate?.status,
        trend: sensorData?.flowRate?.trend,
      },
      waterPressure: {
        value: sensorData?.waterPressure?.value,
        status: sensorData?.waterPressure?.status,
        trend: sensorData?.waterPressure?.trend,
      },
      waterLevel: {
        value: sensorData?.clogDetection?.value,
        status: sensorData?.clogDetection?.status,
        trend: sensorData?.clogDetection?.trend,
      },
    }),
    [
      sensorData?.flowRate?.value,
      sensorData?.flowRate?.status,
      sensorData?.flowRate?.trend,
      sensorData?.waterPressure?.value,
      sensorData?.waterPressure?.status,
      sensorData?.waterPressure?.trend,
      sensorData?.clogDetection?.value,
      sensorData?.clogDetection?.status,
      sensorData?.clogDetection?.trend,
    ]
  );

  // Early returns for loading and error states
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
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        <View className="p-5">
          <DashboardHeader
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={() =>
              setNotificationsEnabled(!notificationsEnabled)
            }
          />

          <StatusCard lastUpdate={lastUpdate} />

          {/* Current Readings Card */}
          <Text className="text-xl font-bold text-black mb-4">
            Current Readings
          </Text>
          <View style={{ gap: 16 }} className="flex-row mb-4">
            <MemoizedSensorCard
              title="Flow Rate"
              value={sensorValues.flowRate.value}
              unit="L/min"
              icon="water"
              status={sensorValues.flowRate.status}
              trend={sensorValues.flowRate.trend}
              className="flex-1"
            />
            <MemoizedSensorCard
              title="Water Pressure"
              value={sensorValues.waterPressure.value}
              unit="kPa"
              icon="cloudscale"
              status={sensorValues.waterPressure.status}
              trend={sensorValues.waterPressure.trend}
              className="flex-1"
            />
          </View>
          <MemoizedSensorCard
            title="Water Level"
            value={sensorValues.waterLevel.value}
            unit="cm"
            icon="glass-water"
            iconType="FontAwesome6"
            status={sensorValues.waterLevel.status}
            trend={sensorValues.waterLevel.trend}
            className="mb-5"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(DashboardScreen);
