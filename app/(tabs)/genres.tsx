import { StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StationList } from '@/src/components/StationList';
import { useAppContext } from '@/src/context/AppContext';
import { RadioStation, Genre } from '@/src/db/types';

export default function GenresScreen() {
  const { 
    genres, 
    getStationsByGenre, 
    toggleFavorite, 
    playStation, 
    isLoading: appLoading 
  } = useAppContext();
  
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreStations, setGenreStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenreSelect = async (genreId: string) => {
    setSelectedGenre(genreId);
    setIsLoading(true);
    try {
      const stations = await getStationsByGenre(genreId);
      setGenreStations(stations);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayStation = async (station: RadioStation) => {
    await playStation(station);
    router.push('/player');
  };

  const handleToggleFavorite = async (station: RadioStation) => {
    await toggleFavorite(station);
    // Refresh genre stations if a genre is selected
    if (selectedGenre) {
      const stations = await getStationsByGenre(selectedGenre);
      setGenreStations(stations);
    }
  };

  const renderGenreItem = ({ item }: { item: Genre }) => (
    <Pressable
      style={[
        styles.genreCard,
        selectedGenre === item.id && styles.selectedGenreCard
      ]}
      onPress={() => handleGenreSelect(item.id)}
    >
      <ThemedText type="subtitle" style={styles.genreName}>
        {item.name}
      </ThemedText>
      {item.description && (
        <ThemedText style={styles.genreDescription}>
          {item.description}
        </ThemedText>
      )}
    </Pressable>
  );

  if (appLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading genres...</ThemedText>
      </ThemedView>
    );
  }

  if (!selectedGenre) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Genres</ThemedText>
          <ThemedText style={styles.subtitle}>
            Browse radio stations by genre
          </ThemedText>
        </ThemedView>
        <FlatList
          data={genres}
          keyExtractor={(item) => item.id}
          renderItem={renderGenreItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.genresList}
        />
      </ThemedView>
    );
  }

  const selectedGenreData = genres.find(g => g.id === selectedGenre);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <Pressable onPress={() => setSelectedGenre(null)} style={styles.backButton}>
          <ThemedText style={styles.backText}>← Back</ThemedText>
        </Pressable>
        <ThemedText type="title">
          {selectedGenreData?.name || 'Unknown Genre'}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {genreStations.length} stations
        </ThemedText>
      </ThemedView>
      
      {isLoading ? (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Loading stations...</ThemedText>
        </ThemedView>
      ) : (
        <StationList
          stations={genreStations}
          onPlay={handlePlayStation}
          onToggleFavorite={handleToggleFavorite}
          emptyMessage={`No ${selectedGenreData?.name || 'genre'} stations available`}
        />
      )}
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
  genresList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  genreCard: {
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedGenreCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  genreName: {
    marginBottom: 4,
  },
  genreDescription: {
    fontSize: 14,
    opacity: 0.7,
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
  backButton: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
});