import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { databaseService, StationWithCategory } from '@/database/DatabaseService';

interface RadioStationListProps {
  onStationPress?: (station: StationWithCategory) => void;
}

export function RadioStationList({ onStationPress }: RadioStationListProps) {
  const [stations, setStations] = useState<StationWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAndLoadStations();
  }, []);

  const initializeAndLoadStations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize database
      await databaseService.initializeDatabase();
      
      // Load stations
      const allStations = await databaseService.getAllStations();
      setStations(allStations);
    } catch (err) {
      console.error('Failed to load stations:', err);
      setError('Failed to load radio stations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStationPress = (station: StationWithCategory) => {
    if (onStationPress) {
      onStationPress(station);
    } else {
      // Default action - show station info
      Alert.alert(
        station.name,
        `Country: ${station.country}\nRegion: ${station.region || 'N/A'}\nCategory: ${station.category_name || 'N/A'}\nFrequency: ${station.frequency || 'Online only'}\n\n${station.description || 'No description available'}`,
        [
          { text: 'OK', style: 'default' },
          { 
            text: 'Visit Website', 
            style: 'default',
            onPress: () => {
              if (station.website_url) {
                Alert.alert('Website', station.website_url);
              }
            }
          }
        ]
      );
    }
  };

  const renderStation = ({ item }: { item: StationWithCategory }) => (
    <TouchableOpacity style={styles.stationItem} onPress={() => handleStationPress(item)}>
      <ThemedView style={styles.stationContent}>
        <ThemedText type="defaultSemiBold" style={styles.stationName}>
          {item.name}
        </ThemedText>
        <ThemedText style={styles.stationDetails}>
          {item.country} {item.region && `• ${item.region}`}
        </ThemedText>
        {item.frequency && (
          <ThemedText style={styles.frequency}>
            {item.frequency}
          </ThemedText>
        )}
        {item.category_name && (
          <ThemedText style={styles.category}>
            {item.category_name}
          </ThemedText>
        )}
        {item.description && (
          <ThemedText style={styles.description} numberOfLines={2}>
            {item.description}
          </ThemedText>
        )}
      </ThemedView>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Loading radio stations...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={initializeAndLoadStations}>
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Radio Stations ({stations.length})
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {stations.length} stations from UK, International & Specialty networks
      </ThemedText>
      <FlatList
        data={stations}
        renderItem={renderStation}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
    opacity: 0.7,
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  stationItem: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  stationContent: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  stationName: {
    fontSize: 16,
    marginBottom: 4,
  },
  stationDetails: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  frequency: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    opacity: 0.8,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    opacity: 0.6,
    lineHeight: 16,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});