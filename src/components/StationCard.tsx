import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { RadioStation } from '../db/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface StationCardProps {
  station: RadioStation;
  onPlay: (station: RadioStation) => void;
  onToggleFavorite: (station: RadioStation) => void;
}

export function StationCard({ station, onPlay, onToggleFavorite }: StationCardProps) {
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'light'].text;

  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={() => onPlay(station)} style={styles.content}>
        <View style={styles.logo}>
          <ThemedText style={styles.logoText}>📻</ThemedText>
        </View>
        <View style={styles.info}>
          <ThemedText type="subtitle" numberOfLines={1}>
            {station.name}
          </ThemedText>
          <ThemedText style={styles.genre} numberOfLines={1}>
            {station.genre} • {station.country}
          </ThemedText>
          {station.description && (
            <ThemedText style={styles.description} numberOfLines={2}>
              {station.description}
            </ThemedText>
          )}
        </View>
        <Pressable 
          onPress={() => onToggleFavorite(station)}
          style={styles.favoriteButton}
        >
          <IconSymbol 
            name={station.isFavorite ? "heart.fill" : "heart"} 
            size={24} 
            color={station.isFavorite ? "#FF3B30" : iconColor} 
          />
        </Pressable>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  genre: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  favoriteButton: {
    padding: 8,
  },
});