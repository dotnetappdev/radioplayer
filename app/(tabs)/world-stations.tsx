import { StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StationList } from '@/src/components/StationList';
import { useAppContext } from '@/src/context/AppContext';
import { RadioStation } from '@/src/db/types';

export default function WorldStationsScreen() {
  const { stations, toggleFavorite, playStation } = useAppContext();
  const [worldStations, setWorldStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorldStations = useCallback(() => {
    // Filter stations that are not from UK
    const filtered = stations.filter(station => station.country !== 'UK');
    setWorldStations(filtered);
    setIsLoading(false);
  }, [stations]);

  useEffect(() => {
    loadWorldStations();
  }, [loadWorldStations]);

  const handlePlayStation = async (station: RadioStation) => {
    await playStation(station);
    router.push('/player');
  };

  const handleToggleFavorite = async (station: RadioStation) => {
    await toggleFavorite(station);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading world stations...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">World Stations</ThemedText>
        <ThemedText style={styles.subtitle}>
          {worldStations.length} radio stations from around the world
        </ThemedText>
      </ThemedView>
      <StationList
        stations={worldStations}
        onPlay={handlePlayStation}
        onToggleFavorite={handleToggleFavorite}
        emptyMessage="No world stations available"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
});