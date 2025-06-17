import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const HistoryItem = ({ sensorName, data }) => {
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "critical":
      case "critical-low":
      case "critical-high":
        return "#FF4B4B";
      case "warning":
      case "warning-low":
      case "warning-high":
        return "#FFA500";
      case "normal":
      default:
        return "#2FCA91";
    }
  };

  // Helper function to get trend icon
  const getTrendIcon = (trend) => {
    switch (trend?.toLowerCase()) {
      case "increasing":
        return "arrow-up";
      case "decreasing":
        return "arrow-down";
      case "stable":
        return "equals";
      default:
        return null;
    }
  };

  return (
    <View className="bg-[#F7F7F7] rounded-lg shadow-lg shadow-gray-100 p-4 mb-6">
      <View className="flex-row justify-between mb-2">
        <Text className="text-[#0A1931] text-base font-medium">
          {sensorName}
        </Text>
        <Text className="text-gray-600 text-xs">{data.time}</Text>
      </View>

      <View className="flex-row mt-2">
        <View className="flex-1">
          <Text className="text-gray-500 text-xs">Value</Text>
          <Text className="text-blue-500 font-medium">
            {data.value} {data.unit}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-gray-500 text-xs">Status</Text>
          <Text
            className="font-medium"
            style={{ color: getStatusColor(data.status) }}
          >
            {data.status}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-gray-500 text-xs">Trend</Text>
          <View className="flex-row items-center">
            <Text
              className="font-medium mr-1"
              style={{ color: getStatusColor(data.status) }}
            >
              {data.trend}
            </Text>
            {data.trend && (
              <FontAwesome5
                name={getTrendIcon(data.trend)}
                size={12}
                color={getStatusColor(data.status)}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HistoryItem;
