import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { databaseService } from '../db/database';
import { audioService, PlaybackStatus } from '../player/audioService';
import { RadioStation, Genre } from '../db/types';

interface AppContextType {
  stations: RadioStation[];
  genres: Genre[];
  playbackStatus: PlaybackStatus;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  playStation: (station: RadioStation) => Promise<void>;
  pausePlayback: () => Promise<void>;
  resumePlayback: () => Promise<void>;
  stopPlayback: () => Promise<void>;
  toggleFavorite: (station: RadioStation) => Promise<void>;
  searchStations: (query: string) => Promise<RadioStation[]>;
  getStationsByCountry: (country: string) => Promise<RadioStation[]>;
  getStationsByGenre: (genre: string) => Promise<RadioStation[]>;
  refreshStations: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>({
    isLoaded: false,
    isPlaying: false,
    station: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStations = useCallback(async () => {
    try {
      const stationsData = await databaseService.getAllStations();
      setStations(stationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stations');
    }
  }, []);

  const initializeApp = useCallback(async () => {
    try {
      setIsLoading(true);
      await databaseService.initialize();
      await audioService.initialize();
      await refreshStations();
      const genresData = await databaseService.getAllGenres();
      setGenres(genresData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize app');
    } finally {
      setIsLoading(false);
    }
  }, [refreshStations]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    const unsubscribe = audioService.addListener(setPlaybackStatus);
    return unsubscribe;
  }, []);

  const playStation = async (station: RadioStation) => {
    try {
      await audioService.playStation(station);
      await databaseService.updateLastPlayed(station.id);
      await databaseService.addToPlayHistory(station.id);
      await refreshStations(); // Refresh to update last played time
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play station');
    }
  };

  const pausePlayback = async () => {
    try {
      await audioService.pause();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause playback');
    }
  };

  const resumePlayback = async () => {
    try {
      await audioService.resume();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume playback');
    }
  };

  const stopPlayback = async () => {
    try {
      await audioService.stop();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop playback');
    }
  };

  const toggleFavorite = async (station: RadioStation) => {
    try {
      await databaseService.toggleFavorite(station.id);
      await refreshStations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle favorite');
    }
  };

  const searchStations = async (query: string): Promise<RadioStation[]> => {
    try {
      return await databaseService.searchStations(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search stations');
      return [];
    }
  };

  const getStationsByCountry = async (country: string): Promise<RadioStation[]> => {
    try {
      return await databaseService.getStationsByCountry(country);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stations by country');
      return [];
    }
  };

  const getStationsByGenre = async (genre: string): Promise<RadioStation[]> => {
    try {
      return await databaseService.getStationsByGenre(genre);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stations by genre');
      return [];
    }
  };

  const contextValue: AppContextType = {
    stations,
    genres,
    playbackStatus,
    isLoading,
    error,
    playStation,
    pausePlayback,
    resumePlayback,
    stopPlayback,
    toggleFavorite,
    searchStations,
    getStationsByCountry,
    getStationsByGenre,
    refreshStations,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}