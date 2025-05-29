import React, {useState, useMemo} from 'react';
import { FlatList, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSensor } from '@/hooks/SensorContext';


const HistoryScreen = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const { sensorData, loading, error } = useSensor();
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch("http://localhost:5000/api/sensors");
//         const result = await response.json();
//         setData(result.sensors);
//         setLoading(false)
//         console.log(result);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     const interval = setInterval(fetchData, 5000);

//     return () => clearInterval(interval);
// }, []);

  // Sample history data
  const filteredData = useMemo(() => {
    // const historyData = [
    //   {
    //     id: '1',
    //     date: '2025-05-28',
    //     time: '09:00 AM',
    //     flowRate: 24.5,
    //     waterLevel: 67,
    //     waterPressure: 1012.5
    //   },
    //   {
    //     id: '2',
    //     date: '2025-05-26',
    //     time: '06:00 AM',
    //     flowRate: 22.8,
    //     waterLevel: 70,
    //     waterPressure: 1013.1
    //   },
    //   {
    //     id: '3',
    //     date: '2025-05-27',
    //     time: '09:00 PM',
    //     flowRate: 21.5,
    //     waterLevel: 72,
    //     waterPressure: 1014.2
    //   },
    //   {
    //     id: '4',
    //     date: '2025-05-25',
    //     time: '06:00 PM',
    //     flowRate: 23.7,
    //     waterLevel: 65,
    //     waterPressure: 1013.8
    //   },
    //   {
    //     id: '5',
    //     date: '2025-05-25',
    //     time: '03:00 PM',
    //     flowRate: 25.2,
    //     waterLevel: 62,
    //     waterPressure: 1012.9
    //   },
    //   {
    //     id: '6',
    //     date: '2025-05-25',
    //     time: '12:00 PM',
    //     flowRate: 26.1,
    //     waterLevel: 60,
    //     waterPressure: 1012.0
    //   },
    //   {
    //     id: '7',
    //     date: '2025-05-25',
    //     time: '09:00 AM',
    //     flowRate: 23.9,
    //     waterLevel: 68,
    //     waterPressure: 1011.5
    //   },
    //   {
    //     id: '8',
    //     date: '2025-05-25',
    //     time: '06:00 AM',
    //     flowRate: 22.0,
    //     waterLevel: 71,
    //     waterPressure: 1010.8
    //   },
    //   {
    //     id: '9',
    //     date: '2025-05-24',
    //     time: '09:00 PM',
    //     flowRate: 21.2,
    //     waterLevel: 73,
    //     waterPressure: 1011.2
    //   },
    //   {
    //     id: '10',
    //     date: '2025-05-20',
    //     time: '06:00 PM',
    //     flowRate: 22.8,
    //     waterLevel: 69,
    //     waterPressure: 1012.4
    //   }
    // ];  
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // console.log(today)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    return Object.entries(sensorData).filter(([_, data]) => {
      const itemDate = new Date(data.time);
      // console.log(itemDate)
      switch (timeFilter) {
        case 'today':
          return itemDate.getFullYear() === today.getFullYear() &&
                 itemDate.getMonth() === today.getMonth() &&
                 itemDate.getDate() === today.getDate();
        case 'yesterday':
          return itemDate.getFullYear() === yesterday.getFullYear() &&
                 itemDate.getMonth() === yesterday.getMonth() &&
                 itemDate.getDate() === yesterday.getDate();
        case 'thisWeek':
          return itemDate >= thisWeek;
        default:
          return true; // 'all' case
      }
    });
  }, [timeFilter, sensorData]);

  // Function to render each history item
  const renderHistoryItem = ({ item }) => {
    const [sensorName, sensorData] = item;
    return (
      <View className="bg-[#F7F7F7] rounded-lg shadow-lg shadow-gray-100 p-4 mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-[#0A1931] text-base font-medium">{sensorName}</Text>
          <Text className="text-gray-600 text-xs">{sensorData.time}</Text>
        </View>
        
        <View className="flex-row mt-2">
          <View className="flex-1">
            <Text className="text-gray-500 text-xs">Value</Text>
            <Text className="text-blue-500 font-medium">
              {sensorData.value} {sensorData.unit}
            </Text>
          </View>
          
          <View className="flex-1">
            <Text className="text-gray-500 text-xs">Status</Text>
            <Text className="text-[#2FCA91] font-medium">{sensorData.status}</Text>
          </View>
          
          <View className="flex-1">
            <Text className="text-gray-500 text-xs">Trend</Text>
            <Text className="text-purple-500 font-medium">{sensorData.trend}</Text>
          </View>
        </View>
      </View>
    );
  }

  const TimeFilterButton = ({ title, value }) => (
    <TouchableOpacity
      onPress={() => setTimeFilter(value)}
      className={`px-4 py-2 rounded-2xl shadow-md shadow-gray-100 mr-2 ${
        timeFilter === value ? 'bg-[#2FCA91]' : 'bg-white border border-gray-100'
      }`}
    >
      <Text className={`${timeFilter === value ? 'text-white' : 'text-gray-700'} text-sm font-medium`}>
        {title}
      </Text>
    </TouchableOpacity>
  );

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
      <View className="p-4 flex-1">
        <Text className="text-3xl font-bold mb-4">History</Text>
        
        {/* Filter options */}
        <View className="flex-row mb-8">
          <TimeFilterButton title="All" value="all" />
          <TimeFilterButton title="Today" value="today" />
          <TimeFilterButton title="Yesterday" value="yesterday" />
          <TimeFilterButton title="This Week" value="thisWeek" />
        </View>

        
        {/* History list */}
        <FlatList
          data={filteredData}
          renderItem={renderHistoryItem}
          keyExtractor={([key]) => key}
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: "6rem" }}
        />
        {/* <FlatList
          data={Object.entries(data)}
          keyExtractor={([key]) => key}
          renderItem={({ item }) => {
            const [sensorName, sensorData] = item;               
            // console.log("item", item)
            // console.log("data", sensorData)
            // console.log("time", sensorData.time)
            return (
              <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>    
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{sensorName}</Text>
                <Text>Value: {sensorData.value} {sensorData.unit}</Text>
                <Text>Status: {sensorData.status}</Text>
                <Text>Trend: {sensorData.trend}</Text>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{sensorData.time}</Text>
              </View>
            );
          }}
        />  */}
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
