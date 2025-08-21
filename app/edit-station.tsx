import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { databaseService } from '@/src/db/database';
import { StreamType, RadioStation } from '@/src/db/types';

interface StationForm {
  name: string;
  streamUrl: string;
  logoUrl: string;
  genre: string;
  country: string;
  description: string;
  streamType: StreamType;
}

const GENRES = [
  'pop', 'rock', 'news', 'classical', 'jazz', 'electronic', 'country', 'hip-hop', 'r&b', 'alternative'
];

const COUNTRIES = [
  'UK', 'US', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI', 'IE', 'BE', 'CH', 'AT', 'PL', 'CZ', 'Other'
];

const STREAM_TYPES = [
  { label: 'HTTP', value: StreamType.HTTP },
  { label: 'HTTPS', value: StreamType.HTTPS },
  { label: 'HLS', value: StreamType.HLS },
  { label: 'DASH', value: StreamType.DASH },
  { label: 'ICY', value: StreamType.ICY },
];

export default function EditStationScreen() {
  const colorScheme = useColorScheme();
  const { stationId } = useLocalSearchParams<{ stationId: string }>();
  const [station, setStation] = useState<RadioStation | null>(null);
  const [form, setForm] = useState<StationForm>({
    name: '',
    streamUrl: '',
    logoUrl: '',
    genre: 'pop',
    country: 'UK',
    description: '',
    streamType: StreamType.HTTP,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStation();
  }, [stationId]); // Remove loadStation from dependencies as it's defined in the component

  const loadStation = async () => {
    if (!stationId) {
      Alert.alert('Error', 'Station ID is required');
      router.back();
      return;
    }

    try {
      const stationData = await databaseService.getStationById(parseInt(stationId, 10));
      if (!stationData) {
        Alert.alert('Error', 'Station not found');
        router.back();
        return;
      }

      if (!stationData.isUserAdded) {
        Alert.alert('Error', 'Cannot edit built-in stations');
        router.back();
        return;
      }

      setStation(stationData);
      setForm({
        name: stationData.name,
        streamUrl: stationData.streamUrl,
        logoUrl: stationData.logoUrl || '',
        genre: stationData.genre,
        country: stationData.country,
        description: stationData.description || '',
        streamType: stationData.streamType,
      });
    } catch (error) {
      console.error('Failed to load station:', error);
      Alert.alert('Error', 'Failed to load station');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'Station name is required');
      return false;
    }
    if (!form.streamUrl.trim()) {
      Alert.alert('Error', 'Stream URL is required');
      return false;
    }
    
    // Basic URL validation
    try {
      new URL(form.streamUrl);
    } catch {
      Alert.alert('Error', 'Please enter a valid stream URL');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !station) return;

    setSaving(true);
    try {
      await databaseService.updateStation(station.id, {
        name: form.name.trim(),
        streamUrl: form.streamUrl.trim(),
        logoUrl: form.logoUrl.trim() || undefined,
        genre: form.genre,
        country: form.country,
        description: form.description.trim() || undefined,
        streamType: form.streamType,
      });

      Alert.alert('Success', 'Station updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Failed to update station:', error);
      Alert.alert('Error', 'Failed to update station. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Edit Station
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            Loading station...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Edit Station
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Station Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: Colors[colorScheme ?? 'light'].card,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border,
                }
              ]}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="Enter station name"
              placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Stream URL *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: Colors[colorScheme ?? 'light'].card,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border,
                }
              ]}
              value={form.streamUrl}
              onChangeText={(text) => setForm({ ...form, streamUrl: text })}
              placeholder="https://example.com/stream"
              placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Logo URL
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: Colors[colorScheme ?? 'light'].card,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border,
                }
              ]}
              value={form.logoUrl}
              onChangeText={(text) => setForm({ ...form, logoUrl: text })}
              placeholder="https://example.com/logo.png"
              placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Genre
            </Text>
            <View style={[
              styles.pickerContainer,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].card,
                borderColor: Colors[colorScheme ?? 'light'].border,
              }
            ]}>
              <Picker
                selectedValue={form.genre}
                onValueChange={(value) => setForm({ ...form, genre: value })}
                style={[styles.picker, { color: Colors[colorScheme ?? 'light'].text }]}
              >
                {GENRES.map((genre) => (
                  <Picker.Item key={genre} label={genre.charAt(0).toUpperCase() + genre.slice(1)} value={genre} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Country
            </Text>
            <View style={[
              styles.pickerContainer,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].card,
                borderColor: Colors[colorScheme ?? 'light'].border,
              }
            ]}>
              <Picker
                selectedValue={form.country}
                onValueChange={(value) => setForm({ ...form, country: value })}
                style={[styles.picker, { color: Colors[colorScheme ?? 'light'].text }]}
              >
                {COUNTRIES.map((country) => (
                  <Picker.Item key={country} label={country} value={country} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Stream Type
            </Text>
            <View style={[
              styles.pickerContainer,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].card,
                borderColor: Colors[colorScheme ?? 'light'].border,
              }
            ]}>
              <Picker
                selectedValue={form.streamType}
                onValueChange={(value) => setForm({ ...form, streamType: value })}
                style={[styles.picker, { color: Colors[colorScheme ?? 'light'].text }]}
              >
                {STREAM_TYPES.map((type) => (
                  <Picker.Item key={type.value} label={type.label} value={type.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: Colors[colorScheme ?? 'light'].card,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border,
                }
              ]}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              placeholder="Enter station description"
              placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
            saving && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Updating...' : 'Update Station'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  footer: {
    padding: 20,
    paddingBottom: 34,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});