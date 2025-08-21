import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function GenresScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Genres</ThemedText>
      <ThemedText>Browse radio stations by genre</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
});