import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NowPlayingBar } from '@/src/components/NowPlayingBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="uk-stations"
          options={{
            title: 'UK',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="radio" color={color} />,
          }}
        />
        <Tabs.Screen
          name="world-stations"
          options={{
            title: 'World',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="globe" color={color} />,
          }}
        />
        <Tabs.Screen
          name="genres"
          options={{
            title: 'Genres',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="music.note.list" color={color} />,
          }}
        />
        <Tabs.Screen
          name="podcasts"
          options={{
            title: 'Podcasts',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="mic.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
          }}
        />
        <Tabs.Screen
          name="manage-stations"
          options={{
            title: 'Manage',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle" color={color} />,
          }}
        />
      </Tabs>
      <NowPlayingBar />
    </>
  );
}
