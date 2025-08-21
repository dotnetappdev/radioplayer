import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/src/context/AppContext';

export default function PlayerScreen() {
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'light'].text;
  
  const {
    playbackStatus,
    pausePlayback,
    resumePlayback,
    stopPlayback,
    toggleFavorite,
  } = useAppContext();

  const { station, isPlaying, isLoaded, error } = playbackStatus;

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pausePlayback();
    } else {
      await resumePlayback();
    }
  };

  const handleStop = async () => {
    await stopPlayback();
    router.back();
  };

  const handleToggleFavorite = async () => {
    if (station) {
      await toggleFavorite(station);
    }
  };

  if (!station) {
    return (
      <>
        <Stack.Screen options={{ title: 'No Station' }} />
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>No station selected</ThemedText>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
          </Pressable>
        </ThemedView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Now Playing' }} />
      <ThemedView style={styles.container}>
        <View style={styles.stationInfo}>
          <View style={styles.stationLogo}>
            <ThemedText style={styles.logoText}>📻</ThemedText>
          </View>
          <ThemedText type="title" style={styles.stationName}>
            {station.name}
          </ThemedText>
          <ThemedText style={styles.genre}>
            {station.genre} • {station.country}
          </ThemedText>
          {station.description && (
            <ThemedText style={styles.description}>
              {station.description}
            </ThemedText>
          )}
          
          {error && (
            <ThemedText style={styles.errorText}>
              Playback Error: {error}
            </ThemedText>
          )}
          
          {!isLoaded && !error && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
              <ThemedText style={styles.loadingText}>Loading...</ThemedText>
            </View>
          )}
          
          {isLoaded && !error && (
            <ThemedText style={styles.nowPlaying}>
              {isPlaying ? '🔊 Playing' : '⏸ Paused'}
            </ThemedText>
          )}
        </View>
        
        <View style={styles.controls}>
          <Pressable style={styles.controlButton} onPress={handleToggleFavorite}>
            <IconSymbol 
              name={station.isFavorite ? "heart.fill" : "heart"} 
              size={32} 
              color={station.isFavorite ? "#FF3B30" : iconColor} 
            />
          </Pressable>
          
          <Pressable 
            style={[styles.controlButton, styles.playButton]} 
            onPress={handlePlayPause}
            disabled={!isLoaded}
          >
            <IconSymbol 
              name={isPlaying ? "pause.fill" : "play.fill"} 
              size={48} 
              color="#fff" 
            />
          </Pressable>
          
          <Pressable style={styles.controlButton} onPress={handleStop}>
            <IconSymbol name="paperplane.fill" size={32} color={iconColor} />
          </Pressable>
        </View>
        
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Back to Stations</ThemedText>
        </Pressable>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationInfo: {
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  stationLogo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 80,
  },
  stationName: {
    marginBottom: 10,
    textAlign: 'center',
  },
  genre: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  nowPlaying: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  loadingText: {
    marginLeft: 8,
    opacity: 0.7,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    marginBottom: 40,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: '#007AFF',
    borderRadius: 40,
    padding: 20,
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});