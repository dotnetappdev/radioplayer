import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { RadioStation, Genre, StreamType } from './types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isWeb = Platform.OS === 'web';

  async initialize() {
    if (this.isWeb) {
      // For web, use in-memory storage
      console.log('Running on web - using mock data');
      return;
    }

    try {
      this.db = await SQLite.openDatabaseAsync('radioplayer.db');
      await this.createTables();
      await this.seedData();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private getMockStations(): RadioStation[] {
    return [
      {
        id: 1,
        name: 'BBC Radio 1',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one',
        genre: 'pop',
        country: 'UK',
        description: 'The best new music and entertainment',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 2,
        name: 'BBC Radio 2',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_two',
        genre: 'pop',
        country: 'UK',
        description: 'Popular music and culture',
        isFavorite: true,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 3,
        name: 'BBC Radio 4',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm',
        genre: 'news',
        country: 'UK',
        description: 'News, current affairs and factual programming',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 4,
        name: 'Capital FM',
        streamUrl: 'http://media-ssl.musicradio.com/CapitalMP3',
        genre: 'pop',
        country: 'UK',
        description: "The UK's No.1 Hit Music Station",
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 5,
        name: 'Heart FM',
        streamUrl: 'http://media-ssl.musicradio.com/HeartLondonMP3',
        genre: 'pop',
        country: 'UK',
        description: 'More Music Variety',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 6,
        name: 'NPR News',
        streamUrl: 'https://npr-ice.streamguys1.com/live.mp3',
        genre: 'news',
        country: 'US',
        description: 'National Public Radio',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 7,
        name: 'Jazz FM',
        streamUrl: 'http://edge-bauerall-01-gos2.sharp-stream.com/jazz.aac',
        genre: 'jazz',
        country: 'UK',
        description: 'The sound of jazz',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
    ];
  }

  private getMockGenres(): Genre[] {
    return [
      { id: 'pop', name: 'Pop', description: 'Popular music' },
      { id: 'rock', name: 'Rock', description: 'Rock music' },
      { id: 'news', name: 'News', description: 'News and talk' },
      { id: 'classical', name: 'Classical', description: 'Classical music' },
      { id: 'jazz', name: 'Jazz', description: 'Jazz music' },
      { id: 'electronic', name: 'Electronic', description: 'Electronic music' },
    ];
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS stations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        streamUrl TEXT NOT NULL,
        logoUrl TEXT,
        genre TEXT NOT NULL,
        country TEXT NOT NULL,
        description TEXT,
        isFavorite INTEGER DEFAULT 0,
        lastPlayed TEXT,
        streamType TEXT DEFAULT 'http',
        isUserAdded INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS genres (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS play_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stationId INTEGER NOT NULL,
        playedAt TEXT NOT NULL,
        duration INTEGER,
        FOREIGN KEY (stationId) REFERENCES stations (id)
      );
    `);
  }

  private async seedData() {
    if (!this.db) throw new Error('Database not initialized');

    // Check if data already exists
    const stationCount = await this.db.getFirstAsync<{count: number}>('SELECT COUNT(*) as count FROM stations');
    if (stationCount && stationCount.count > 0) return;

    // Seed genres
    const genres = [
      { id: 'pop', name: 'Pop', description: 'Popular music' },
      { id: 'rock', name: 'Rock', description: 'Rock music' },
      { id: 'news', name: 'News', description: 'News and talk' },
      { id: 'classical', name: 'Classical', description: 'Classical music' },
      { id: 'jazz', name: 'Jazz', description: 'Jazz music' },
      { id: 'electronic', name: 'Electronic', description: 'Electronic music' },
    ];

    for (const genre of genres) {
      await this.db.runAsync(
        'INSERT INTO genres (id, name, description) VALUES (?, ?, ?)',
        [genre.id, genre.name, genre.description]
      );
    }

    // Seed stations
    const stations = [
      {
        name: 'BBC Radio 1',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one',
        genre: 'pop',
        country: 'UK',
        description: 'The best new music and entertainment',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'BBC Radio 2',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_two',
        genre: 'pop',
        country: 'UK',
        description: 'Popular music and culture',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'BBC Radio 4',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm',
        genre: 'news',
        country: 'UK',
        description: 'News, current affairs and factual programming',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'Capital FM',
        streamUrl: 'http://media-ssl.musicradio.com/CapitalMP3',
        genre: 'pop',
        country: 'UK',
        description: "The UK's No.1 Hit Music Station",
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'Heart FM',
        streamUrl: 'http://media-ssl.musicradio.com/HeartLondonMP3',
        genre: 'pop',
        country: 'UK',
        description: 'More Music Variety',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'NPR News',
        streamUrl: 'https://npr-ice.streamguys1.com/live.mp3',
        genre: 'news',
        country: 'US',
        description: 'National Public Radio',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'Jazz FM',
        streamUrl: 'http://edge-bauerall-01-gos2.sharp-stream.com/jazz.aac',
        genre: 'jazz',
        country: 'UK',
        description: 'The sound of jazz',
        streamType: 'http',
        isUserAdded: 0,
      },
    ];

    for (const station of stations) {
      await this.db.runAsync(
        'INSERT INTO stations (name, streamUrl, genre, country, description, streamType, isUserAdded) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [station.name, station.streamUrl, station.genre, station.country, station.description, station.streamType, station.isUserAdded]
      );
    }
  }

  async getAllStations(): Promise<RadioStation[]> {
    if (this.isWeb) {
      return this.getMockStations();
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<any>('SELECT * FROM stations ORDER BY name');
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      isUserAdded: Boolean(row.isUserAdded),
      streamType: row.streamType as StreamType,
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async getStationsByCountry(country: string): Promise<RadioStation[]> {
    if (this.isWeb) {
      return this.getMockStations().filter(s => s.country === country);
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<any>('SELECT * FROM stations WHERE country = ? ORDER BY name', [country]);
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      isUserAdded: Boolean(row.isUserAdded),
      streamType: row.streamType as StreamType,
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async getStationsByGenre(genre: string): Promise<RadioStation[]> {
    if (this.isWeb) {
      return this.getMockStations().filter(s => s.genre === genre);
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<any>('SELECT * FROM stations WHERE genre = ? ORDER BY name', [genre]);
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      isUserAdded: Boolean(row.isUserAdded),
      streamType: row.streamType as StreamType,
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async getFavoriteStations(): Promise<RadioStation[]> {
    if (this.isWeb) {
      return this.getMockStations().filter(s => s.isFavorite);
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<any>('SELECT * FROM stations WHERE isFavorite = 1 ORDER BY name');
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      isUserAdded: Boolean(row.isUserAdded),
      streamType: row.streamType as StreamType,
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async searchStations(query: string): Promise<RadioStation[]> {
    if (this.isWeb) {
      const lowerQuery = query.toLowerCase();
      return this.getMockStations().filter(s => 
        s.name.toLowerCase().includes(lowerQuery) ||
        s.genre.toLowerCase().includes(lowerQuery) ||
        (s.description && s.description.toLowerCase().includes(lowerQuery))
      );
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const searchQuery = `%${query.toLowerCase()}%`;
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM stations WHERE LOWER(name) LIKE ? OR LOWER(genre) LIKE ? OR LOWER(description) LIKE ? ORDER BY name',
      [searchQuery, searchQuery, searchQuery]
    );
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      isUserAdded: Boolean(row.isUserAdded),
      streamType: row.streamType as StreamType,
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async toggleFavorite(stationId: number): Promise<void> {
    if (this.isWeb) {
      // For web, just log the action
      console.log(`Toggle favorite for station ${stationId}`);
      return;
    }

    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'UPDATE stations SET isFavorite = CASE WHEN isFavorite = 1 THEN 0 ELSE 1 END WHERE id = ?',
      [stationId]
    );
  }

  async updateLastPlayed(stationId: number): Promise<void> {
    if (this.isWeb) {
      console.log(`Update last played for station ${stationId}`);
      return;
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const now = new Date().toISOString();
    await this.db.runAsync(
      'UPDATE stations SET lastPlayed = ? WHERE id = ?',
      [now, stationId]
    );
  }

  async getAllGenres(): Promise<Genre[]> {
    if (this.isWeb) {
      return this.getMockGenres();
    }

    if (!this.db) throw new Error('Database not initialized');
    
    return await this.db.getAllAsync<Genre>('SELECT * FROM genres ORDER BY name');
  }

  async addToPlayHistory(stationId: number, duration?: number): Promise<void> {
    if (this.isWeb) {
      console.log(`Add to play history: station ${stationId}, duration ${duration}`);
      return;
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const now = new Date().toISOString();
    await this.db.runAsync(
      'INSERT INTO play_history (stationId, playedAt, duration) VALUES (?, ?, ?)',
      [stationId, now, duration || null]
    );
  }

  async getRecentlyPlayed(limit: number = 10): Promise<RadioStation[]> {
    if (this.isWeb) {
      return this.getMockStations().slice(0, limit);
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<any>(`
      SELECT DISTINCT s.* FROM stations s
      JOIN play_history ph ON s.id = ph.stationId
      ORDER BY ph.playedAt DESC
      LIMIT ?
    `, [limit]);
    
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      isUserAdded: Boolean(row.isUserAdded),
      streamType: row.streamType as StreamType,
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  // CRUD Operations
  async createStation(station: Omit<RadioStation, 'id' | 'isFavorite' | 'lastPlayed'>): Promise<number> {
    if (this.isWeb) {
      // For web, just log and return a mock ID
      console.log('Create station:', station);
      return Math.floor(Math.random() * 10000) + 1000;
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO stations (name, streamUrl, logoUrl, genre, country, description, streamType, isUserAdded) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        station.name,
        station.streamUrl,
        station.logoUrl || null,
        station.genre,
        station.country,
        station.description || null,
        station.streamType,
        1 // isUserAdded = true
      ]
    );
    
    return result.lastInsertRowId;
  }

  async updateStation(id: number, station: Partial<Omit<RadioStation, 'id' | 'isUserAdded'>>): Promise<void> {
    if (this.isWeb) {
      console.log('Update station:', id, station);
      return;
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const fields = [];
    const values = [];
    
    if (station.name !== undefined) {
      fields.push('name = ?');
      values.push(station.name);
    }
    if (station.streamUrl !== undefined) {
      fields.push('streamUrl = ?');
      values.push(station.streamUrl);
    }
    if (station.logoUrl !== undefined) {
      fields.push('logoUrl = ?');
      values.push(station.logoUrl);
    }
    if (station.genre !== undefined) {
      fields.push('genre = ?');
      values.push(station.genre);
    }
    if (station.country !== undefined) {
      fields.push('country = ?');
      values.push(station.country);
    }
    if (station.description !== undefined) {
      fields.push('description = ?');
      values.push(station.description);
    }
    if (station.streamType !== undefined) {
      fields.push('streamType = ?');
      values.push(station.streamType);
    }
    
    if (fields.length === 0) return;
    
    values.push(id);
    await this.db.runAsync(
      `UPDATE stations SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteStation(id: number): Promise<void> {
    if (this.isWeb) {
      console.log('Delete station:', id);
      return;
    }

    if (!this.db) throw new Error('Database not initialized');
    
    // First delete from play history
    await this.db.runAsync('DELETE FROM play_history WHERE stationId = ?', [id]);
    
    // Then delete the station
    await this.db.runAsync('DELETE FROM stations WHERE id = ?', [id]);
  }

  async getUserAddedStations(): Promise<RadioStation[]> {
    if (this.isWeb) {
      // Return empty array for web demo
      return [];
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<any>('SELECT * FROM stations WHERE isUserAdded = 1 ORDER BY name');
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      isUserAdded: Boolean(row.isUserAdded),
      streamType: row.streamType as StreamType,
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async getStationById(id: number): Promise<RadioStation | null> {
    if (this.isWeb) {
      return this.getMockStations().find(s => s.id === id) || null;
    }

    if (!this.db) throw new Error('Database not initialized');
    
    const row = await this.db.getFirstAsync<any>('SELECT * FROM stations WHERE id = ?', [id]);
    if (!row) return null;
    
    return {
      ...row,
      isFavorite: Boolean(row.isFavorite),
      isUserAdded: Boolean(row.isUserAdded),
      streamType: row.streamType as StreamType,
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    };
  }
}

export const databaseService = new DatabaseService();