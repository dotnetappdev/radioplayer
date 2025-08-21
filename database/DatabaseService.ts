import * as SQLite from 'expo-sqlite';

export interface RadioStation {
  id: number;
  name: string;
  frequency?: string;
  stream_url: string;
  website_url?: string;
  country: string;
  region?: string;
  category_id?: number;
  logo_url?: string;
  description?: string;
  is_active: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface StationWithCategory extends RadioStation {
  category_name?: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initializeDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('radioplayer.db');
      await this.createTables();
      await this.seedInitialData();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Create categories table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create stations table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS stations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        frequency TEXT,
        stream_url TEXT NOT NULL,
        website_url TEXT,
        country TEXT NOT NULL,
        region TEXT,
        category_id INTEGER,
        logo_url TEXT,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      );
    `);

    // Create indexes
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_stations_country ON stations(country);
      CREATE INDEX IF NOT EXISTS idx_stations_category ON stations(category_id);
      CREATE INDEX IF NOT EXISTS idx_stations_active ON stations(is_active);
    `);
  }

  private async seedInitialData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Check if data already exists
    const existingCategories = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM categories');
    if ((existingCategories as any)?.count > 0) {
      return; // Data already seeded
    }

    // Insert categories
    const categories = [
      ['General', 'General music and talk radio stations'],
      ['News', 'News and current affairs'],
      ['Music', 'Music-focused radio stations'],
      ['Talk', 'Talk radio and discussion shows'],
      ['Sport', 'Sports coverage and commentary'],
      ['Classical', 'Classical music stations'],
      ['Rock', 'Rock and alternative music'],
      ['Pop', 'Pop music stations'],
      ['Jazz', 'Jazz and blues music'],
      ['Electronic', 'Electronic and dance music'],
      ['Country', 'Country music stations'],
      ['Worship', 'Christian and religious programming'],
      ['Community', 'Local community radio'],
      ['International', 'World music and international content'],
      ['BBC', 'BBC radio services']
    ];

    for (const [name, description] of categories) {
      await this.db.runAsync(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [name, description]
      );
    }

    // Insert stations data
    const stations = [
      // BBC Stations
      ['BBC Radio 1', '97-99 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one', 'https://www.bbc.co.uk/radio1', 'United Kingdom', 'National', 15, 'The UKs number one hit music station'],
      ['BBC Radio 2', '88-91 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_two', 'https://www.bbc.co.uk/radio2', 'United Kingdom', 'National', 15, 'The UKs most listened-to radio station'],
      ['BBC Radio 3', '90-93 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_three', 'https://www.bbc.co.uk/radio3', 'United Kingdom', 'National', 6, 'Classical music, jazz, world music and arts'],
      ['BBC Radio 4', '92-95 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm', 'https://www.bbc.co.uk/radio4', 'United Kingdom', 'National', 4, 'News, current affairs, arts and drama'],
      ['BBC Radio 5 Live', '693/909 MW', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_five_live', 'https://www.bbc.co.uk/5live', 'United Kingdom', 'National', 5, 'Live news and sports coverage'],
      ['BBC Radio 6 Music', 'DAB/Online', 'https://stream.live.vc.bbcmedia.co.uk/bbc_6music', 'https://www.bbc.co.uk/6music', 'United Kingdom', 'National', 7, 'Alternative music and live sessions'],
      
      // Commercial UK Stations
      ['Heart FM', '106.2 FM', 'https://media-ice.musicradio.com/HeartLondonMP3', 'https://www.heart.co.uk', 'United Kingdom', 'London', 8, 'Feel good music'],
      ['Capital FM', '95.8 FM', 'https://media-ice.musicradio.com/CapitalMP3', 'https://www.capitalfm.com', 'United Kingdom', 'London', 8, 'Hit music station'],
      ['LBC', '97.3 FM', 'https://media-ice.musicradio.com/LBCLondonMP3', 'https://www.lbc.co.uk', 'United Kingdom', 'London', 4, 'Leading talk radio station'],
      ['Classic FM', '100-102 FM', 'https://media-ice.musicradio.com/ClassicFMMP3', 'https://www.classicfm.com', 'United Kingdom', 'National', 6, 'Classical music station'],
      ['Absolute Radio', '105.8 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/absoluteradio.mp3', 'https://www.absoluteradio.co.uk', 'United Kingdom', 'National', 7, 'Rock and alternative music'],
      ['Kiss FM', '100 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/kissfmuk.mp3', 'https://www.kissfm.co.uk', 'United Kingdom', 'National', 10, 'Dance and electronic music'],
      
      // Northern Ireland Stations
      ['BBC Radio Ulster', '92.4-95.4 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_ulster', 'https://www.bbc.co.uk/radioulster', 'United Kingdom', 'Northern Ireland', 15, 'BBC local radio for Northern Ireland'],
      ['BBC Radio Foyle', '93.1 FM', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_foyle', 'https://www.bbc.co.uk/radiofoyle', 'United Kingdom', 'Northern Ireland', 15, 'BBC local radio for Derry/Londonderry area'],
      ['Cool FM', '97.4 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/coolfm.mp3', 'https://www.coolfm.co.uk', 'United Kingdom', 'Northern Ireland', 8, 'Northern Irelands biggest hit music station'],
      ['U105', '105.8 FM', 'https://icy-e-bab-04-gos.sharp-stream.com/u105.mp3', 'https://www.u105.com', 'United Kingdom', 'Northern Ireland', 1, 'Best music and chat for Belfast'],
      
      // International Stations
      ['NPR', null, 'https://npr-ice.streamguys1.com/live.mp3', 'https://www.npr.org', 'United States', 'National', 2, 'National Public Radio'],
      ['BBC World Service', null, 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', 'https://www.bbc.co.uk/worldservice', 'United Kingdom', 'International', 2, 'BBC international news service'],
      ['France Inter', null, 'https://icecast.radiofrance.fr/franceinter-midfi.mp3', 'https://www.radiofrance.fr/franceinter', 'France', 'National', 1, 'French national radio'],
      ['RTE Radio 1', null, 'https://icecast2.rte.ie/ie/radio1', 'https://www.rte.ie/radio1', 'Ireland', 'National', 1, 'Irish national radio'],
      ['CBC Radio One', null, 'https://cbc_r1_tor.leanstream.co/cbc_r1_tor', 'https://www.cbc.ca/radio/radio1', 'Canada', 'National', 2, 'Canadian Broadcasting Corporation'],
      ['ABC Radio National', null, 'https://abcradio.ic.llnwd.net/stream/abcradio_mp3_radio_national', 'https://www.abc.net.au/radionational', 'Australia', 'National', 4, 'Australian Broadcasting Corporation'],
      
      // Worship/Christian Stations
      ['Premier Christian Radio', null, 'https://icy-e-bab-04-gos.sharp-stream.com/premier.mp3', 'https://www.premier.org.uk', 'United Kingdom', 'National', 12, 'Christian talk and music'],
      ['UCB UK', null, 'https://icy-e-bab-04-gos.sharp-stream.com/ucbuk.mp3', 'https://www.ucb.co.uk', 'United Kingdom', 'National', 12, 'Uplifting Christian broadcasting'],
      ['Cross Rhythms', null, 'https://icy-e-bab-04-gos.sharp-stream.com/crossrhythms.mp3', 'https://www.crossrhythms.co.uk', 'United Kingdom', 'National', 12, 'Christian music and talk'],
      ['Revelation TV Radio', null, 'https://icy-e-bab-04-gos.sharp-stream.com/revelationtv.mp3', 'https://www.revelationtv.com', 'United Kingdom', 'National', 12, 'Christian television and radio'],
      ['K-LOVE', null, 'https://icy-e-bab-04-gos.sharp-stream.com/klove.mp3', 'https://www.klove.com', 'United States', 'National', 12, 'Contemporary Christian music'],
      ['Air1', null, 'https://icy-e-bab-04-gos.sharp-stream.com/air1.mp3', 'https://www.air1.com', 'United States', 'National', 12, 'Positive hits radio'],
      ['Hope FM', null, 'https://streaming.hopefm.com/hopefm', 'https://www.hopefm.com', 'Australia', 'National', 12, 'Christian radio Australia'],
      ['Life FM', null, 'https://icy-e-bab-04-gos.sharp-stream.com/lifefm.mp3', 'https://www.lifefm.co.nz', 'New Zealand', 'National', 12, 'Christian radio New Zealand']
    ];

    for (const station of stations) {
      await this.db.runAsync(
        'INSERT INTO stations (name, frequency, stream_url, website_url, country, region, category_id, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        station
      );
    }
  }

  async getAllStations(): Promise<StationWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(`
      SELECT s.*, c.name as category_name 
      FROM stations s 
      LEFT JOIN categories c ON s.category_id = c.id 
      WHERE s.is_active = 1
      ORDER BY s.country, s.name
    `);
    
    return result as StationWithCategory[];
  }

  async getStationsByCountry(country: string): Promise<StationWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(`
      SELECT s.*, c.name as category_name 
      FROM stations s 
      LEFT JOIN categories c ON s.category_id = c.id 
      WHERE s.country = ? AND s.is_active = 1
      ORDER BY s.name
    `, [country]);
    
    return result as StationWithCategory[];
  }

  async getStationsByCategory(categoryId: number): Promise<StationWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(`
      SELECT s.*, c.name as category_name 
      FROM stations s 
      LEFT JOIN categories c ON s.category_id = c.id 
      WHERE s.category_id = ? AND s.is_active = 1
      ORDER BY s.name
    `, [categoryId]);
    
    return result as StationWithCategory[];
  }

  async getAllCategories(): Promise<Category[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync('SELECT * FROM categories ORDER BY name');
    return result as Category[];
  }

  async searchStations(query: string): Promise<StationWithCategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const searchQuery = `%${query}%`;
    const result = await this.db.getAllAsync(`
      SELECT s.*, c.name as category_name 
      FROM stations s 
      LEFT JOIN categories c ON s.category_id = c.id 
      WHERE (s.name LIKE ? OR s.description LIKE ?) AND s.is_active = 1
      ORDER BY s.name
    `, [searchQuery, searchQuery]);
    
    return result as StationWithCategory[];
  }

  async getStationById(id: number): Promise<StationWithCategory | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync(`
      SELECT s.*, c.name as category_name 
      FROM stations s 
      LEFT JOIN categories c ON s.category_id = c.id 
      WHERE s.id = ?
    `, [id]);
    
    return result as StationWithCategory | null;
  }
}

export const databaseService = new DatabaseService();