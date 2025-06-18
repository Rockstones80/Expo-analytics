import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

import React, { memo } from "react";
import { Text, View } from "react-native";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: string;
  iconType?: "MaterialCommunityIcons" | "FontAwesome6";
  status?: string;
  trend?: string;
  className?: string;
}

const SensorCard: React.FC<SensorCardProps> = ({
  title,
  value,
  unit,
  icon,
  iconType = "MaterialCommunityIcons",
  status = "normal",
  trend,
  className = "",
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "normal":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "normal":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "critical":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend?.toLowerCase()) {
      case "up":
        return "trending-up";
      case "down":
        return "trending-down";
      case "stable":
        return "trending-neutral";
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend?.toLowerCase()) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const IconComponent =
    iconType === "FontAwesome6" ? FontAwesome6 : MaterialCommunityIcons;
  const trendIcon = getTrendIcon(trend);

  return (
    <View
      className={`bg-white rounded-xl shadow-md shadow-gray-200 p-4 ${className}`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-[#0A1931]">{title}</Text>
        <IconComponent name={icon} size={24} color="#0A1931" />
      </View>

      <View className="flex-row items-baseline mb-2">
        <Text className="text-3xl font-bold text-[#0A1931] mr-2">{value}</Text>
        <Text className="text-lg text-gray-600">{unit}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className={`px-2 py-1 rounded-full ${getStatusBgColor(status)}`}>
          <Text className={`text-xs font-medium ${getStatusColor(status)}`}>
            {status?.toUpperCase() || "NORMAL"}
          </Text>
        </View>

        {trendIcon && (
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name={trendIcon}
              size={16}
              color={getTrendColor(trend)}
            />
            <Text className={`text-xs ml-1 ${getTrendColor(trend)}`}>
              {trend?.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(SensorCard);
