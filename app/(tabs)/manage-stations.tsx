import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { databaseService } from '@/src/db/database';
import { RadioStation } from '@/src/db/types';

export default function ManageStationsScreen() {
  const colorScheme = useColorScheme();
  const [userStations, setUserStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserStations = useCallback(async () => {
    try {
      const stations = await databaseService.getUserAddedStations();
      setUserStations(stations);
    } catch (error) {
      console.error('Failed to load user stations:', error);
      Alert.alert('Error', 'Failed to load your stations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUserStations();
  }, [loadUserStations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUserStations();
  }, [loadUserStations]);

  const handleAddStation = () => {
    router.push('/add-station');
  };

  const handleEditStation = (station: RadioStation) => {
    router.push({
      pathname: '/edit-station',
      params: { stationId: station.id.toString() }
    });
  };

  const handleDeleteStation = (station: RadioStation) => {
    Alert.alert(
      'Delete Station',
      `Are you sure you want to delete "${station.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.deleteStation(station.id);
              loadUserStations();
            } catch (error) {
              console.error('Failed to delete station:', error);
              Alert.alert('Error', 'Failed to delete station');
            }
          },
        },
      ]
    );
  };

  const renderStationItem = ({ item }: { item: RadioStation }) => (
    <View style={[styles.stationItem, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <View style={styles.stationInfo}>
        <Text style={[styles.stationName, { color: Colors[colorScheme ?? 'light'].text }]}>
          {item.name}
        </Text>
        <Text style={[styles.stationDetails, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          {item.genre} • {item.country} • {item.streamType.toUpperCase()}
        </Text>
        <Text style={[styles.stationUrl, { color: Colors[colorScheme ?? 'light'].textSecondary }]} numberOfLines={1}>
          {item.streamUrl}
        </Text>
      </View>
      <View style={styles.stationActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={() => handleEditStation(item)}
        >
          <IconSymbol name="pencil" size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteStation(item)}
        >
          <IconSymbol name="trash" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="radio" size={64} color={Colors[colorScheme ?? 'light'].textSecondary} />
      <Text style={[styles.emptyStateText, { color: Colors[colorScheme ?? 'light'].text }]}>
        No Custom Stations
      </Text>
      <Text style={[styles.emptyStateSubtext, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
        Add your own radio stations to get started
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          My Stations
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={handleAddStation}
        >
          <IconSymbol name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Station</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={userStations}
        renderItem={renderStationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors[colorScheme ?? 'light'].tint]}
            tintColor={Colors[colorScheme ?? 'light'].tint}
          />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  stationItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  stationInfo: {
    flex: 1,
    marginRight: 12,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stationDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  stationUrl: {
    fontSize: 12,
  },
  stationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});