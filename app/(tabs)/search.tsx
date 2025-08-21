import { StyleSheet, TextInput, ActivityIndicator, Platform, View, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StationList } from '@/src/components/StationList';
import { AutomotiveKeyboard } from '@/src/components/AutomotiveKeyboard';
import { useAppContext } from '@/src/context/AppContext';
import { RadioStation } from '@/src/db/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const { searchStations, toggleFavorite, playStation } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RadioStation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAutomotiveKeyboard, setShowAutomotiveKeyboard] = useState(false);

  // Detect if running in automotive environment (CarPlay/Android Auto)
  // This could be used for automatic keyboard display in automotive builds
  // const isAutomotive = Platform.select({
  //   ios: false, // Would be true for CarPlay builds
  //   android: false, // Would be true for Android Auto builds
  //   default: false,
  // });

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

  // Automotive keyboard handlers
  const handleKeyPress = (key: string) => {
    const newQuery = searchQuery + key;
    setSearchQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleBackspace = () => {
    const newQuery = searchQuery.slice(0, -1);
    setSearchQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const toggleKeyboard = () => {
    setShowAutomotiveKeyboard(!showAutomotiveKeyboard);
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
        <View style={styles.titleRow}>
          <ThemedText type="title">Search</ThemedText>
          <TouchableOpacity
            style={[
              styles.keyboardToggle,
              { backgroundColor: showAutomotiveKeyboard ? Colors[colorScheme ?? 'light'].tint : 'transparent' }
            ]}
            onPress={toggleKeyboard}
            accessible={true}
            accessibilityLabel="Toggle automotive keyboard"
            accessibilityRole="button"
          >
            <IconSymbol 
              size={24} 
              name="keyboard" 
              color={showAutomotiveKeyboard ? Colors[colorScheme ?? 'light'].background : Colors[colorScheme ?? 'light'].text} 
            />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.subtitle}>
          Find radio stations by name, genre, or description
          {showAutomotiveKeyboard && '\nUse A-Z keyboard for automotive-safe search'}
        </ThemedText>
        
        <View style={styles.searchContainer}>
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
            editable={!showAutomotiveKeyboard}
          />
          {showAutomotiveKeyboard && (
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={handleClear}
              accessible={true}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <IconSymbol size={16} name="xmark" color={Colors[colorScheme ?? 'light'].background} />
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>

      {isSearching ? (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Searching...</ThemedText>
        </ThemedView>
      ) : !hasSearched ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.emptyText}>
            {showAutomotiveKeyboard 
              ? 'Use the keyboard below to search stations' 
              : 'Enter a search term to find radio stations'}
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

      {/* Automotive A-Z Keyboard for CarPlay/Android Auto */}
      <AutomotiveKeyboard
        visible={showAutomotiveKeyboard}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onClear={handleClear}
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  keyboardToggle: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    lineHeight: 24,
  },
});