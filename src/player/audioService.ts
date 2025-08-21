import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { RadioStation } from '../db/types';

export interface PlaybackStatus {
  isLoaded: boolean;
  isPlaying: boolean;
  station: RadioStation | null;
  error: string | null;
}

class AudioService {
  private sound: Audio.Sound | null = null;
  private currentStation: RadioStation | null = null;
  private listeners: ((status: PlaybackStatus) => void)[] = [];
  private isWeb = Platform.OS === 'web';

  async initialize() {
    if (this.isWeb) {
      console.log('Audio service initialized for web');
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  async playStation(station: RadioStation) {
    try {
      // Stop current playback
      await this.stop();

      this.currentStation = station;

      if (this.isWeb) {
        // For web, simulate playback without actual audio
        console.log(`Playing station: ${station.name}`);
        this.notifyListeners({
          isLoaded: true,
          isPlaying: true,
          station,
          error: null,
        });
        return;
      }

      // Create new sound instance
      const { sound } = await Audio.Sound.createAsync(
        { uri: station.streamUrl },
        { shouldPlay: true },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      
      this.notifyListeners({
        isLoaded: true,
        isPlaying: true,
        station,
        error: null,
      });
    } catch (error) {
      console.error('Failed to play station:', error);
      this.notifyListeners({
        isLoaded: false,
        isPlaying: false,
        station: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async pause() {
    if (this.sound) {
      try {
        await this.sound.pauseAsync();
        this.notifyListeners({
          isLoaded: true,
          isPlaying: false,
          station: this.currentStation,
          error: null,
        });
      } catch (error) {
        console.error('Failed to pause:', error);
      }
    }
  }

  async resume() {
    if (this.sound) {
      try {
        await this.sound.playAsync();
        this.notifyListeners({
          isLoaded: true,
          isPlaying: true,
          station: this.currentStation,
          error: null,
        });
      } catch (error) {
        console.error('Failed to resume:', error);
      }
    }
  }

  async stop() {
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
        this.sound = null;
        this.currentStation = null;
        this.notifyListeners({
          isLoaded: false,
          isPlaying: false,
          station: null,
          error: null,
        });
      } catch (error) {
        console.error('Failed to stop:', error);
      }
    }
  }

  getPlaybackStatus(): PlaybackStatus {
    return {
      isLoaded: this.sound !== null,
      isPlaying: this.sound !== null,
      station: this.currentStation,
      error: null,
    };
  }

  addListener(listener: (status: PlaybackStatus) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private onPlaybackStatusUpdate = (status: any) => {
    if (status.error) {
      console.error('Playback error:', status.error);
      this.notifyListeners({
        isLoaded: false,
        isPlaying: false,
        station: null,
        error: status.error,
      });
    }
  };

  private notifyListeners(status: PlaybackStatus) {
    this.listeners.forEach(listener => listener(status));
  }
}

export const audioService = new AudioService();