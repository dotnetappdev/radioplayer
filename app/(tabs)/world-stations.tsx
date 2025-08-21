import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function WorldStationsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">World Stations</ThemedText>
      <ThemedText>Radio stations from around the world</ThemedText>
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