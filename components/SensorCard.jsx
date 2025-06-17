import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const SensorCard = ({
  title,
  value,
  unit,
  icon,
  iconType = "FontAwesome5", // 'FontAwesome5' or 'FontAwesome6'
  iconColor = "#2FCA91",
  status,
  trend,
  className = "",
}) => {
  const IconComponent =
    iconType === "FontAwesome6" ? FontAwesome6 : FontAwesome5;

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
    <View
      className={`bg-[#F7F7F7] p-4 rounded-2xl shadow-md shadow-gray-100 ${className}`}
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
          <IconComponent name={icon} size={24} color={iconColor} />
        </View>
        <View className="flex-row items-center">
          <Text
            className="font-semibold"
            style={{ color: getStatusColor(status) }}
          >
            {value} {unit}  
          </Text>
          {trend && (
            <FontAwesome5
              name={getTrendIcon(trend)}
              size={12}
              color={getStatusColor(status)}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>

      <View>
        <Text className="text-[#0A1931] font-medium text-base mb-1">
          {title}
        </Text>
        {status && (
          <Text className="text-gray-500 text-sm">Status: {status}</Text>
        )}
      </View>
    </View>
  );
};

export default SensorCard;
