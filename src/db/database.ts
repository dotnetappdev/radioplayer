import * as SQLite from 'expo-sqlite';
import { RadioStation, Genre } from './types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('radioplayer.db');
      await this.createTables();
      await this.seedData();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
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
      },
      {
        name: 'BBC Radio 2',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_two',
        genre: 'pop',
        country: 'UK',
        description: 'Popular music and culture',
      },
      {
        name: 'BBC Radio 4',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm',
        genre: 'news',
        country: 'UK',
        description: 'News, current affairs and factual programming',
      },
      {
        name: 'Capital FM',
        streamUrl: 'http://media-ssl.musicradio.com/CapitalMP3',
        genre: 'pop',
        country: 'UK',
        description: "The UK's No.1 Hit Music Station",
      },
      {
        name: 'Heart FM',
        streamUrl: 'http://media-ssl.musicradio.com/HeartLondonMP3',
        genre: 'pop',
        country: 'UK',
        description: 'More Music Variety',
      },
      {
        name: 'NPR News',
        streamUrl: 'https://npr-ice.streamguys1.com/live.mp3',
        genre: 'news',
        country: 'US',
        description: 'National Public Radio',
      },
      {
        name: 'Jazz FM',
        streamUrl: 'http://edge-bauerall-01-gos2.sharp-stream.com/jazz.aac',
        genre: 'jazz',
        country: 'UK',
        description: 'The sound of jazz',
      },
    ];

    for (const station of stations) {
      await this.db.runAsync(
        'INSERT INTO stations (name, streamUrl, genre, country, description) VALUES (?, ?, ?, ?, ?)',
        [station.name, station.streamUrl, station.genre, station.country, station.description]
      );
    }
  }

  async getAllStations(): Promise<RadioStation[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<any>('SELECT * FROM stations ORDER BY name');
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async getStationsByCountry(country: string): Promise<RadioStation[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<any>('SELECT * FROM stations WHERE country = ? ORDER BY name', [country]);
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async getStationsByGenre(genre: string): Promise<RadioStation[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<any>('SELECT * FROM stations WHERE genre = ? ORDER BY name', [genre]);
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async getFavoriteStations(): Promise<RadioStation[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const rows = await this.db.getAllAsync<any>('SELECT * FROM stations WHERE isFavorite = 1 ORDER BY name');
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async searchStations(query: string): Promise<RadioStation[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const searchQuery = `%${query.toLowerCase()}%`;
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM stations WHERE LOWER(name) LIKE ? OR LOWER(genre) LIKE ? OR LOWER(description) LIKE ? ORDER BY name',
      [searchQuery, searchQuery, searchQuery]
    );
    return rows.map(row => ({
      ...row,
      isFavorite: Boolean(row.isFavorite),
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }

  async toggleFavorite(stationId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'UPDATE stations SET isFavorite = CASE WHEN isFavorite = 1 THEN 0 ELSE 1 END WHERE id = ?',
      [stationId]
    );
  }

  async updateLastPlayed(stationId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const now = new Date().toISOString();
    await this.db.runAsync(
      'UPDATE stations SET lastPlayed = ? WHERE id = ?',
      [now, stationId]
    );
  }

  async getAllGenres(): Promise<Genre[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return await this.db.getAllAsync<Genre>('SELECT * FROM genres ORDER BY name');
  }

  async addToPlayHistory(stationId: number, duration?: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const now = new Date().toISOString();
    await this.db.runAsync(
      'INSERT INTO play_history (stationId, playedAt, duration) VALUES (?, ?, ?)',
      [stationId, now, duration || null]
    );
  }

  async getRecentlyPlayed(limit: number = 10): Promise<RadioStation[]> {
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
      lastPlayed: row.lastPlayed ? new Date(row.lastPlayed) : undefined,
    }));
  }
}

export const databaseService = new DatabaseService();