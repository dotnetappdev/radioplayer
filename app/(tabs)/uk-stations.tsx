import { StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StationList } from '@/src/components/StationList';
import { useAppContext } from '@/src/context/AppContext';
import { RadioStation } from '@/src/db/types';

export default function UKStationsScreen() {
  const { getStationsByCountry, toggleFavorite, playStation } = useAppContext();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUKStations = useCallback(async () => {
    try {
      const ukStations = await getStationsByCountry('UK');
      setStations(ukStations);
    } finally {
      setIsLoading(false);
    }
  }, [getStationsByCountry]);

  useEffect(() => {
    loadUKStations();
  }, [loadUKStations]);

  const handlePlayStation = async (station: RadioStation) => {
    await playStation(station);
    router.push('/player');
  };

  const handleToggleFavorite = async (station: RadioStation) => {
    await toggleFavorite(station);
    await loadUKStations(); // Refresh the list
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading UK stations...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">UK Stations</ThemedText>
        <ThemedText style={styles.subtitle}>
          {stations.length} radio stations from the United Kingdom
        </ThemedText>
      </ThemedView>
      <StationList
        stations={stations}
        onPlay={handlePlayStation}
        onToggleFavorite={handleToggleFavorite}
        emptyMessage="No UK stations available"
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