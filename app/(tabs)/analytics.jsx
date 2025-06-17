import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const AnalyticsScreen = () => {
  const [timeframe, setTimeframe] = useState("hourly"); // 'hourly', 'daily', 'weekly'

  // Sample data for different timeframes
  const [flowRateData] = useState({
    hourly: [22.5, 23.1, 24.8, 25.3, 25.7, 24.9, 23.4],
    daily: [22.5, 23.1, 24.8, 25.3, 25.7, 24.9, 23.4],
    weekly: [22.5, 23.1, 24.8, 25.3, 25.7, 24.9, 23.4],
  });

  const [waterLevelData] = useState({
    hourly: [65, 67, 70, 72, 75, 73, 71],
    daily: [65, 67, 70, 72, 75, 73, 71],
    weekly: [65, 67, 70, 72, 75, 73, 71],
  });

  const [waterPressureData] = useState({
    hourly: [1010, 1011, 1012, 1013, 1014, 1013, 1012],
    daily: [1010, 1011, 1012, 1013, 1014, 1013, 1012],
    weekly: [1010, 1011, 1012, 1013, 1014, 1013, 1012],
  });

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 40;
  const chartHeight = 200;

  // Generate labels based on timeframe
  const generateLabels = () => {
    const labels = [];
    const now = new Date();

    switch (timeframe) {
      case "hourly":
        for (let i = 6; i >= 0; i--) {
          const hourAgo = new Date(now.getTime() - i * 60 * 60 * 1000);
          labels.push(hourAgo.getHours().toString().padStart(2, "0") + ":00");
        }
        break;
      case "daily":
        for (let i = 6; i >= 0; i--) {
          const dayAgo = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          labels.push(dayAgo.toLocaleDateString("en-US", { weekday: "short" }));
        }
        break;
      // case "weekly":
      //   for (let i = 6; i >= 0; i--) {
      //     const weekAgo = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      //     labels.push("Week " + (i + 1));
      //   }
      //   break;
    }
    return labels;
  };

  const labels = generateLabels();

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#fff",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#e0e0e0",
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "400",
    },
    // Add tooltip configuration
    propsForVerticalLabels: {
      fontSize: 10,
    },
    propsForHorizontalLabels: {
      fontSize: 10,
    },
  };

  const TimeframeButton = ({ title, value }) => (
    <TouchableOpacity
      onPress={() => setTimeframe(value)}
      className={`px-5 py-2 rounded-2xl shadow-md shadow-gray-100 mr-2 ${
        timeframe === value ? "bg-[#2FCA91]" : "bg-white border border-gray-100"
      }`}
    >
      <Text
        className={`${
          timeframe === value ? "text-white" : "text-gray-700"
        } text-sm font-medium`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const handleDataPointPress = (dataPoint, index) => {
    console.log(`Data point clicked: ${dataPoint} at index ${index}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: "6rem" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          <Text className="text-3xl font-bold text-black mb-4">Analytics</Text>

          {/* Timeframe Selector */}
          <View className="flex-row mb-8">
            <TimeframeButton title="Hourly" value="hourly" />
            <TimeframeButton title="Daily" value="daily" />
            {/* <TimeframeButton title="Weekly" value="weekly" /> */}
          </View>

          {/* Temperature Graph Card */}
          <View className="bg-white rounded-xl shadow-md shadow-gray-200 p-4 mb-6">
            <Text className="text-lg font-bold text-[#0A1931] mb-2">
              Flow Rate(L/min)
            </Text>
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: flowRateData[timeframe],
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    strokeWidth: 3,
                  },
                ],
              }}
              width={chartWidth}
              height={chartHeight}
              yAxisSuffix=""
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              }}
              bezier
              style={{
                marginVertical: 4,
                borderRadius: 16,
                marginLeft: -20,
              }}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLines={true}
              withHorizontalLines={true}
              fromZero={false}
              // onDataPointClick={handleDataPointPress}
              getDotColor={(dataPoint, dataPointIndex) => {
                const value = dataPoint;
                if (value > 25) return "red";
                if (value > 20) return "orange";
                return "blue";
              }}
              renderDotContent={({ x, y, index, indexData }) => (
                <View
                  key={`dot-${index}`}
                  style={{
                    position: "absolute",
                    top: y - 25,
                    left: x - 20,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    padding: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>
                    {indexData.toFixed(1)} L/min
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Humidity Graph Card */}
          <View className="bg-white rounded-xl shadow-md shadow-gray-200 p-4 mb-6">
            <Text className="text-lg font-bold text-[#0A1931] mb-2">
              Water Level(cm)
            </Text>
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: waterLevelData[timeframe],
                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                    strokeWidth: 3,
                  },
                ],
              }}
              width={chartWidth}
              height={chartHeight}
              yAxisSuffix=""
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              }}
              bezier
              style={{
                marginVertical: 4,
                borderRadius: 16,
                marginLeft: -20,
              }}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLines={true}
              withHorizontalLines={true}
              fromZero={false}
              // onDataPointClick={handleDataPointPress}
              getDotColor={(dataPoint, dataPointIndex) => {
                const value = dataPoint;
                if (value > 70) return "red";
                if (value > 60) return "orange";
                return "green";
              }}
              renderDotContent={({ x, y, index, indexData }) => (
                <View
                  key={`dot-${index}`}
                  style={{
                    position: "absolute",
                    top: y - 25,
                    left: x - 20,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    padding: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10 }}>
                    {indexData.toFixed(1)} cm
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Pressure Graph Card */}
          <View className="bg-white rounded-xl shadow-md shadow-gray-200 p-4 mb-4">
            <Text className="text-lg font-bold text-[#0A1931] mb-2">
              Water Pressure(kPa)
            </Text>
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: waterPressureData[timeframe],
                    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                    strokeWidth: 3,
                  },
                ],
              }}
              width={chartWidth}
              height={chartHeight}
              yAxisSuffix=""
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                decimalPlaces: 0,
              }}
              bezier
              style={{
                marginVertical: 4,
                borderRadius: 16,
                marginLeft: -20,
              }}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLines={true}
              withHorizontalLines={true}
              fromZero={false}
              // onDataPointClick={handleDataPointPress}
              getDotColor={(dataPoint, dataPointIndex) => {
                const value = dataPoint;
                if (value > 1013) return "red";
                if (value > 1010) return "orange";
                return "blue";
              }}
              renderDotContent={({ x, y, index, indexData }) => (
                <View
                  key={`dot-${index}`}
                  style={{
                    position: "absolute",
                    top: y - 25,
                    left: x - 20,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    padding: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10 }}>
                    {indexData.toFixed(1)} kPa
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;
