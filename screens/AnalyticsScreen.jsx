// import React, { useState } from 'react';
// import { View, Text, ScrollView, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, VictoryLegend } from 'victory-native';

// const AnalyticsScreen = () => {
//   // Sample data for the graphs
//   const [temperatureData] = useState([
//     { x: 1, y: 22.5 }, { x: 2, y: 23.1 }, { x: 3, y: 24.8 },
//     { x: 4, y: 25.3 }, { x: 5, y: 25.7 }, { x: 6, y: 24.9 },
//     { x: 7, y: 23.4 }, { x: 8, y: 22.8 }, { x: 9, y: 22.0 },
//     { x: 10, y: 21.5 }, { x: 11, y: 21.8 }, { x: 12, y: 22.3 }
//   ]);

//   const [humidityData] = useState([
//     { x: 1, y: 65 }, { x: 2, y: 67 }, { x: 3, y: 70 },
//     { x: 4, y: 72 }, { x: 5, y: 75 }, { x: 6, y: 73 },
//     { x: 7, y: 71 }, { x: 8, y: 68 }, { x: 9, y: 66 },
//     { x: 10, y: 64 }, { x: 11, y: 63 }, { x: 12, y: 65 }
//   ]);

//   const [pressureData] = useState([
//     { x: 1, y: 1010 }, { x: 2, y: 1011 }, { x: 3, y: 1012 },
//     { x: 4, y: 1013 }, { x: 5, y: 1014 }, { x: 6, y: 1013 },
//     { x: 7, y: 1012 }, { x: 8, y: 1011 }, { x: 9, y: 1010 },
//     { x: 10, y: 1009 }, { x: 11, y: 1010 }, { x: 12, y: 1011 }
//   ]);

//   const screenWidth = Dimensions.get('window').width;

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100">
//       <ScrollView className="flex-1">
//         <View className="p-4">
//           <Text className="text-2xl font-bold text-gray-800 mb-6">Analytics</Text>
          
//           {/* Temperature Graph Card */}
//           <View className="bg-white rounded-xl shadow-md p-5 mb-4">
//             <Text className="text-lg font-semibold text-gray-700 mb-3">Temperature (°C)</Text>
//             <VictoryChart
//               width={screenWidth - 50}
//               height={220}
//               theme={VictoryTheme.material}
//               domainPadding={{ x: 10 }}
//             >
//               <VictoryAxis
//                 tickValues={[1, 3, 6, 9, 12]}
//                 tickFormat={["Jan", "Mar", "Jun", "Sep", "Dec"]}
//               />
//               <VictoryAxis
//                 dependentAxis
//                 tickFormat={(t) => `${t}°C`}
//               />
//               <VictoryLine
//                 data={temperatureData}
//                 style={{
//                   data: { stroke: "#3b82f6", strokeWidth: 3 }
//                 }}
//                 animate={{
//                   duration: 2000,
//                   onLoad: { duration: 1000 }
//                 }}
//               />
//               <VictoryLegend
//                 x={screenWidth - 160}
//                 y={10}
//                 centerTitle
//                 orientation="horizontal"
//                 data={[
//                   { name: "Temperature", symbol: { fill: "#3b82f6" } }
//                 ]}
//               />
//             </VictoryChart>
//           </View>
          
//           {/* Humidity Graph Card */}
//           <View className="bg-white rounded-xl shadow-md p-5 mb-4">
//             <Text className="text-lg font-semibold text-gray-700 mb-3">Humidity (%)</Text>
//             <VictoryChart
//               width={screenWidth - 50}
//               height={220}
//               theme={VictoryTheme.material}
//               domainPadding={{ x: 10 }}
//             >
//               <VictoryAxis
//                 tickValues={[1, 3, 6, 9, 12]}
//                 tickFormat={["Jan", "Mar", "Jun", "Sep", "Dec"]}
//               />
//               <VictoryAxis
//                 dependentAxis
//                 tickFormat={(t) => `${t}%`}
//               />
//               <VictoryLine
//                 data={humidityData}
//                 style={{
//                   data: { stroke: "#10b981", strokeWidth: 3 }
//                 }}
//                 animate={{
//                   duration: 2000,
//                   onLoad: { duration: 1000 }
//                 }}
//               />
//               <VictoryLegend
//                 x={screenWidth - 140}
//                 y={10}
//                 centerTitle
//                 orientation="horizontal"
//                 data={[
//                   { name: "Humidity", symbol: { fill: "#10b981" } }
//                 ]}
//               />
//             </VictoryChart>
//           </View>
          
//           {/* Pressure Graph Card */}
//           <View className="bg-white rounded-xl shadow-md p-5 mb-4">
//             <Text className="text-lg font-semibold text-gray-700 mb-3">Pressure (hPa)</Text>
//             <VictoryChart
//               width={screenWidth - 50}
//               height={220}
//               theme={VictoryTheme.material}
//               domainPadding={{ x: 10 }}
//             >
//               <VictoryAxis
//                 tickValues={[1, 3, 6, 9, 12]}
//                 tickFormat={["Jan", "Mar", "Jun", "Sep", "Dec"]}
//               />
//               <VictoryAxis
//                 dependentAxis
//                 tickFormat={(t) => `${t}`}
//               />
//               <VictoryLine
//                 data={pressureData}
//                 style={{
//                   data: { stroke: "#8b5cf6", strokeWidth: 3 }
//                 }}
//                 animate={{
//                   duration: 2000,
//                   onLoad: { duration: 1000 }
//                 }}
//               />
//               <VictoryLegend
//                 x={screenWidth - 140}
//                 y={10}
//                 centerTitle
//                 orientation="horizontal"
//                 data={[
//                   { name: "Pressure", symbol: { fill: "#8b5cf6" } }
//                 ]}
//               />
//             </VictoryChart>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AnalyticsScreen;
