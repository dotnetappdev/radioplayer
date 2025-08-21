import { Image } from 'expo-image';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StationCard } from '@/src/components/StationCard';
import { useAppContext } from '@/src/context/AppContext';
import { RadioStation } from '@/src/db/types';

export default function HomeScreen() {
  const { 
    stations, 
    isLoading, 
    error, 
    playStation, 
    toggleFavorite 
  } = useAppContext();

  const handlePlayStation = async (station: RadioStation) => {
    await playStation(station);
    router.push('/player');
  };

  const featuredStations = stations.slice(0, 4);
  const recentStations = stations.filter(s => s.lastPlayed).slice(0, 3);
  const favoriteStations = stations.filter(s => s.isFavorite).slice(0, 3);

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading stations...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Radio Player</ThemedText>
      </ThemedView>

      {featuredStations.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Featured Stations</ThemedText>
          {featuredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onPlay={handlePlayStation}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </ThemedView>
      )}

      {favoriteStations.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Favorites</ThemedText>
          {favoriteStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onPlay={handlePlayStation}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </ThemedView>
      )}

      {recentStations.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recently Played</ThemedText>
          {recentStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onPlay={handlePlayStation}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </ThemedView>
      )}

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Access</ThemedText>
        <ThemedText style={styles.helpText}>
          Browse UK stations, world stations, or search by genre using the tabs below
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  helpText: {
    opacity: 0.7,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  headerImage: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
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
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
});
