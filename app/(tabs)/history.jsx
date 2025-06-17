import { useSensor } from "@/hooks/SensorContext";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const HistoryScreen = () => {
  const [timeFilter, setTimeFilter] = ("all");
  const [refreshing, setRefreshing] = useState(false);
  const [historySnapshots, setHistorySnapshots] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const { sensorData, loading, error } = useSensor();

  // Ref for the FlatList to control scrolling
  const flatListRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Store complete sensor snapshots whenever data updates
  useEffect(() => {
    if (sensorData && Object.keys(sensorData).length > 0) {
      const currentTime = new Date();
      const snapshot = {
        id: `snapshot-${currentTime.getTime()}-${Math.random()}`,
        timestamp: currentTime.getTime(),
        date: currentTime.toLocaleDateString(),
        time: currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        sensors: { ...sensorData },
      };

      setHistorySnapshots((prevSnapshots) => {
        const updated = [snapshot, ...prevSnapshots];
        return updated.slice(0, 50);
      });

      if (shouldAutoScroll && flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      }
    }
  }, [sensorData, shouldAutoScroll]);

  // Filter snapshots based on time selection
  const filteredSnapshots = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return historySnapshots.filter((snapshot) => {
      const snapshotDate = new Date(snapshot.timestamp);

      switch (timeFilter) {
        case "today":
          return snapshotDate >= today;
        case "yesterday":
          return snapshotDate >= yesterday && snapshotDate < today;
        case "thisWeek":
          return snapshotDate >= thisWeek;
        case "all":
        default:
          return true;
      }
    });
  }, [historySnapshots, timeFilter]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShouldAutoScroll(offsetY < 50);
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const TimeFilterButton = ({
    title,
    value,
  }) => (
    <TouchableOpacity
      onPress={() => {
        setTimeFilter(value);
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      }}
      className={`px-4 py-2 rounded-2xl shadow-md shadow-gray-100 mr-2 ${
        timeFilter === value
          ? "bg-[#2FCA91]"
          : "bg-white border border-gray-100"
      }`}
    >
      <Text
        className={`${
          timeFilter === value ? "text-white" : "text-gray-700"
        } text-sm font-medium`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
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

  const getStatusBgColor = (status) => {
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

  const renderHistorySnapshot = ({
    item,
    index,
  }) => {
    const isExpanded = expandedItems.has(item.id);
    const sensors = Object.entries(item.sensors);

    const overallStatus = sensors.reduce((worst, [, sensor]) => {
      const status = sensor.status?.toLowerCase();
      if (status === "critical") return "critical";
      if (status === "warning" && worst !== "critical") return "warning";
      if (worst === "") return status || "normal";
      return worst;
    }, "");

    return (
      <TouchableOpacity
        onPress={() => toggleExpanded(item.id)}
        className={`mx-4 mb-3 rounded-lg border ${getStatusBgColor(
          overallStatus
        )} shadow-sm`}
        activeOpacity={0.7}
      >
        {/* Header - Always Visible */}
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-gray-800">
              Reading #{filteredSnapshots.length - index}
            </Text>
            <View className="flex-row items-center">
              <View
                className={`px-2 py-1 rounded-full ${getStatusBgColor(
                  overallStatus
                )}`}
              >
                <Text
                  className={`text-xs font-medium ${getStatusColor(
                    overallStatus
                  )}`}
                >
                  {overallStatus?.toUpperCase() || "UNKNOWN"}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-gray-600">{item.date}</Text>
            <Text className="text-sm text-gray-600">{item.time}</Text>
          </View>

          {/* Summary View - Quick Overview */}
          <View className="flex-row justify-between">
            {sensors.map(([sensorName, data]) => (
              <View key={sensorName} className="flex-1 items-center">
                <Text className="text-xs text-gray-500 mb-1">{sensorName}</Text>
                <Text className="text-sm font-medium text-gray-800">
                  {data.value} {data.unit}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row justify-center mt-3">
            <Text className="text-xs text-gray-500">
              {isExpanded ? "Tap to collapse" : "Tap for details"}
            </Text>
          </View>
        </View>

        {/* Expanded Details */}
        {isExpanded && (
          <View className="border-t border-gray-200 bg-white">
            <View className="p-4">
              <Text className="text-lg font-semibold mb-4 text-gray-800">
                Detailed Breakdown
              </Text>

              {sensors.map(([sensorName, data]) => (
                <View
                  key={sensorName}
                  className="mb-4 p-3 bg-gray-50 rounded-lg"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-base font-medium text-gray-800">
                      {sensorName}
                    </Text>
                    <View
                      className={`px-2 py-1 rounded-full ${getStatusBgColor(
                        data.status
                      )}`}
                    >
                      <Text
                        className={`text-xs font-medium ${getStatusColor(
                          data.status
                        )}`}
                      >
                        {data.status?.toUpperCase() || "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-gray-800">
                      {data.value}
                    </Text>
                    <Text className="text-lg text-gray-600">{data.unit}</Text>
                  </View>

                  {data.additionalInfo && (
                    <View className="mt-2 pt-2 border-t border-gray-200">
                      <Text className="text-xs text-gray-500">
                        Additional Info: {data.additionalInfo}
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              <View className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Text className="text-sm font-medium text-blue-800 mb-1">
                  Recording Details
                </Text>
                <Text className="text-xs text-blue-600">
                  Recorded: {item.date} at {item.time}
                </Text>
                <Text className="text-xs text-blue-600">
                  Timestamp: {item.timestamp}
                </Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && historySnapshots.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2FCA91" />
          <Text className="mt-2 text-gray-600">Loading sensor history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center mb-4">Error: {error}</Text>
          <TouchableOpacity
            onPress={onRefresh}
            className="bg-[#2FCA91] px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white p-4 border-b border-gray-200">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-3xl font-bold">History</Text>
            <TouchableOpacity
              onPress={() => {
                setShouldAutoScroll(!shouldAutoScroll);
                if (!shouldAutoScroll && flatListRef.current) {
                  flatListRef.current.scrollToOffset({
                    offset: 0,
                    animated: true,
                  });
                }
              }}
              className={`px-3 py-1 rounded-full ${
                shouldAutoScroll ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  shouldAutoScroll ? "text-green-700" : "text-gray-600"
                }`}
              >
                Auto-scroll {shouldAutoScroll ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-gray-600 mb-4">
            {filteredSnapshots.length} reading
            {filteredSnapshots.length !== 1 ? "s" : ""} recorded
          </Text>

          {/* Filter options */}
          <View className="flex-row">
            <TimeFilterButton title="All" value="all" />
            <TimeFilterButton title="Today" value="today" />
            <TimeFilterButton title="Yesterday" value="yesterday" />
            <TimeFilterButton title="This Week" value="thisWeek" />
          </View>
        </View>

        {/* History List */}
        <FlatList
          ref={flatListRef}
          data={filteredSnapshots}
          renderItem={renderHistorySnapshot}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 64 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2FCA91"]}
              tintColor="#2FCA91"
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center py-16">
              <Text className="text-gray-400 text-center text-lg mb-2">
                No readings available
              </Text>
              <Text className="text-gray-400 text-center text-sm">
                Sensor data will appear here as its collected
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
