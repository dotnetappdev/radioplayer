import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { databaseService, ShowWithCategory } from '@/database/DatabaseService';

interface PodcastListProps {
  onPodcastPress?: (podcast: ShowWithCategory) => void;
}

export function PodcastList({ onPodcastPress }: PodcastListProps) {
  const [podcasts, setPodcasts] = useState<ShowWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAndLoadPodcasts();
  }, []);

  const initializeAndLoadPodcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize database (if not already done)
      await databaseService.initializeDatabase();
      
      // Load podcasts
      const allPodcasts = await databaseService.getAllPodcastShows();
      setPodcasts(allPodcasts);
    } catch (err) {
      console.error('Failed to load podcasts:', err);
      setError('Failed to load podcasts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePodcastPress = (podcast: ShowWithCategory) => {
    if (onPodcastPress) {
      onPodcastPress(podcast);
    } else {
      // Default action - show podcast info
      Alert.alert(
        podcast.title,
        `Author: ${podcast.author || 'Unknown'}\nCategory: ${podcast.category_name || 'N/A'}\nEpisodes: ${podcast.episode_count || 0}\n\n${podcast.description || 'No description available'}`,
        [
          { text: 'OK', style: 'default' },
          { 
            text: 'Visit Website', 
            style: 'default',
            onPress: () => {
              if (podcast.website_url) {
                Alert.alert('Website', podcast.website_url);
              }
            }
          }
        ]
      );
    }
  };

  const renderPodcast = ({ item }: { item: ShowWithCategory }) => (
    <TouchableOpacity style={styles.podcastItem} onPress={() => handlePodcastPress(item)}>
      <ThemedView style={styles.podcastContent}>
        <ThemedView style={styles.podcastHeader}>
          {item.image_url && (
            <Image source={{ uri: item.image_url }} style={styles.podcastImage} />
          )}
          <ThemedView style={styles.podcastInfo}>
            <ThemedText type="defaultSemiBold" style={styles.podcastTitle}>
              {item.title}
            </ThemedText>
            {item.author && (
              <ThemedText style={styles.podcastAuthor}>
                by {item.author}
              </ThemedText>
            )}
            {item.category_name && (
              <ThemedText style={styles.category}>
                {item.category_name}
              </ThemedText>
            )}
            {item.episode_count !== undefined && (
              <ThemedText style={styles.episodeCount}>
                {item.episode_count} episodes
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>
        {item.description && (
          <ThemedText style={styles.description} numberOfLines={3}>
            {item.description}
          </ThemedText>
        )}
      </ThemedView>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Loading podcasts...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={initializeAndLoadPodcasts}>
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Podcasts ({podcasts.length})
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Technology, Science Fiction & More
      </ThemedText>
      <FlatList
        data={podcasts}
        renderItem={renderPodcast}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
    opacity: 0.7,
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  podcastItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  podcastContent: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
  },
  podcastHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  podcastImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  podcastInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  podcastTitle: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 20,
  },
  podcastAuthor: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    opacity: 0.8,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  episodeCount: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    opacity: 0.7,
    lineHeight: 18,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});