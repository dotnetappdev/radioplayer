import { StyleSheet, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAppContext } from '../context/AppContext';

export function NowPlayingBar() {
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'light'].text;
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  
  const { playbackStatus, pausePlayback, resumePlayback } = useAppContext();
  const { station, isPlaying, isLoaded } = playbackStatus;

  if (!station || !isLoaded) {
    return null;
  }

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pausePlayback();
    } else {
      await resumePlayback();
    }
  };

  const handleTapBar = () => {
    router.push('/player');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <Pressable style={styles.content} onPress={handleTapBar}>
        <View style={styles.stationInfo}>
          <View style={styles.stationLogo}>
            <ThemedText style={styles.logoText}>📻</ThemedText>
          </View>
          <View style={styles.textInfo}>
            <ThemedText numberOfLines={1} style={styles.stationName}>
              {station.name}
            </ThemedText>
            <ThemedText numberOfLines={1} style={styles.status}>
              {isPlaying ? 'Playing' : 'Paused'} • {station.genre}
            </ThemedText>
          </View>
        </View>
        <Pressable style={styles.playButton} onPress={handlePlayPause}>
          <IconSymbol 
            name={isPlaying ? "pause.fill" : "play.fill"} 
            size={20} 
            color={iconColor} 
          />
        </Pressable>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingBottom: 12, // Account for tab bar
  },
  stationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stationLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 16,
  },
  textInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  status: {
    fontSize: 14,
    opacity: 0.7,
  },
  playButton: {
    padding: 8,
    marginLeft: 12,
  },
});