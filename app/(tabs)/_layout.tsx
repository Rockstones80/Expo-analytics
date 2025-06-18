import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
// import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#888888',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View 
            style={{ 
              backgroundColor: '#1A1A1A',
              flex: 1,
              borderRadius: 25,
              marginHorizontal: 20,
              marginBottom: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }} 
          />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 88,
          paddingBottom: 20,
          paddingTop: 10,
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
        },
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              borderRadius: 12,
              padding: 8,
              minWidth: 40,
              alignItems: 'center',
            }}>
              <IconSymbol size={24} name="house.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              borderRadius: 12,
              padding: 8,
              minWidth: 40,
              alignItems: 'center',
            }}>
             <AntDesign name="linechart" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              borderRadius: 12,
              padding: 8,
              minWidth: 40,
              alignItems: 'center',
            }}>
              <Fontisto name="history" size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}