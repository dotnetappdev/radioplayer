import { FlatList, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StationCard } from './StationCard';
import { RadioStation } from '../db/types';

interface StationListProps {
  stations: RadioStation[];
  onPlay: (station: RadioStation) => void;
  onToggleFavorite: (station: RadioStation) => void;
  title?: string;
  emptyMessage?: string;
}

export function StationList({ 
  stations, 
  onPlay, 
  onToggleFavorite, 
  title,
  emptyMessage = "No stations available"
}: StationListProps) {
  if (stations.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>{emptyMessage}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {title && (
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
      )}
      <FlatList
        data={stations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StationCard
            station={item}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    padding: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 100, // Account for tab bar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    opacity: 0.6,
    textAlign: 'center',
  },
});