import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HistoryItemProps {
  sensorName: string;
  value: number;
  unit: string;
  status: string;
  trend?: string;
  timestamp: string;
  onPress?: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  sensorName,
  value,
  unit,
  status,
  trend,
  timestamp,
  onPress,
}) => {
  const getStatusColor = (status: string): string => {
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

  const getStatusBgColor = (status: string): string => {
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

  const getTrendIcon = (
    trend?: string
  ): keyof typeof MaterialCommunityIcons.glyphMap | null => {
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

  const getTrendColor = (trend?: string): string => {
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

  const trendIcon = getTrendIcon(trend);

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-lg border ${getStatusBgColor(
        status
      )} p-4 mb-3`}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-medium text-gray-800">
          {sensorName}
        </Text>
        <View className={`px-2 py-1 rounded-full ${getStatusBgColor(status)}`}>
          <Text className={`text-xs font-medium ${getStatusColor(status)}`}>
            {status?.toUpperCase() || "NORMAL"}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-baseline">
          <Text className="text-2xl font-bold text-gray-800 mr-2">{value}</Text>
          <Text className="text-lg text-gray-600">{unit}</Text>
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

      <Text className="text-xs text-gray-500">{timestamp}</Text>
    </TouchableOpacity>
  );
};

export default HistoryItem;
