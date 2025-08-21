import { StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StationList } from '@/src/components/StationList';
import { useAppContext } from '@/src/context/AppContext';
import { RadioStation } from '@/src/db/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const { searchStations, toggleFavorite, playStation } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RadioStation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchStations(query.trim());
      setSearchResults(results);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  }, [searchStations]);

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(text);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handlePlayStation = async (station: RadioStation) => {
    await playStation(station);
    router.push('/player');
  };

  const handleToggleFavorite = async (station: RadioStation) => {
    await toggleFavorite(station);
    // Refresh search results
    if (searchQuery.trim().length > 0) {
      const results = await searchStations(searchQuery.trim());
      setSearchResults(results);
    }
  };

  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const borderColor = colorScheme === 'dark' ? '#333' : '#ddd';

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Search</ThemedText>
        <ThemedText style={styles.subtitle}>
          Find radio stations by name, genre, or description
        </ThemedText>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor,
              color: textColor,
              borderColor,
            }
          ]}
          placeholder="Search stations..."
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
          value={searchQuery}
          onChangeText={handleSearchInputChange}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </ThemedView>

      {isSearching ? (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Searching...</ThemedText>
        </ThemedView>
      ) : !hasSearched ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.emptyText}>
            Enter a search term to find radio stations
          </ThemedText>
        </ThemedView>
      ) : (
        <StationList
          stations={searchResults}
          onPlay={handlePlayStation}
          onToggleFavorite={handleToggleFavorite}
          emptyMessage={`No stations found for "${searchQuery}"`}
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
    marginBottom: 16,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
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
  emptyText: {
    opacity: 0.6,
    textAlign: 'center',
    fontSize: 16,
  },
});