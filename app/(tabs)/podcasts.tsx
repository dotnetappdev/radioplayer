import { StyleSheet } from 'react-native';

import { PodcastList } from '@/components/PodcastList';
import { ThemedView } from '@/components/ThemedView';

export default function PodcastsScreen() {
  return (
    <ThemedView style={styles.container}>
      <PodcastList />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});