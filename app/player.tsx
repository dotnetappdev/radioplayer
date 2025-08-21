import { StyleSheet, View, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function PlayerScreen() {
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'light'].text;

  return (
    <>
      <Stack.Screen options={{ title: 'Now Playing' }} />
      <ThemedView style={styles.container}>
        <View style={styles.stationInfo}>
          <View style={styles.stationLogo}>
            <ThemedText style={styles.logoText}>📻</ThemedText>
          </View>
          <ThemedText type="title" style={styles.stationName}>BBC Radio 1</ThemedText>
          <ThemedText style={styles.nowPlaying}>Now Playing</ThemedText>
          <ThemedText type="subtitle" style={styles.songTitle}>Popular Song Title</ThemedText>
          <ThemedText style={styles.artist}>Artist Name</ThemedText>
        </View>
        
        <View style={styles.controls}>
          <Pressable style={styles.controlButton}>
            <IconSymbol name="heart" size={32} color={iconColor} />
          </Pressable>
          <Pressable style={[styles.controlButton, styles.playButton]}>
            <IconSymbol name="play.fill" size={48} color="#fff" />
          </Pressable>
          <Pressable style={styles.controlButton}>
            <IconSymbol name="paperplane.fill" size={32} color={iconColor} />
          </Pressable>
        </View>
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
  nowPlaying: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 10,
  },
  songTitle: {
    textAlign: 'center',
    marginBottom: 5,
  },
  artist: {
    opacity: 0.8,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: '#007AFF',
    borderRadius: 40,
    padding: 20,
  },
});