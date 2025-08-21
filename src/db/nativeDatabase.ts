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
      // BBC Stations
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
        name: 'BBC Radio 3',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_three',
        genre: 'classical',
        country: 'UK',
        description: 'Classical music, jazz, world music and arts programmes',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 4,
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
        id: 5,
        name: 'BBC Radio 5 Live',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_five_live',
        genre: 'news',
        country: 'UK',
        description: 'Live news and sports coverage',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 6,
        name: 'BBC Radio 6 Music',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_6music',
        genre: 'alternative',
        country: 'UK',
        description: 'Alternative music and live sessions',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 7,
        name: 'BBC Radio Scotland',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_scotland_fm',
        genre: 'news',
        country: 'UK',
        description: 'News, music and entertainment for Scotland',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 8,
        name: 'BBC Radio Wales',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_wales_fm',
        genre: 'news',
        country: 'UK',
        description: 'News, music and entertainment for Wales',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 9,
        name: 'BBC Radio Ulster',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_ulster',
        genre: 'news',
        country: 'UK',
        description: 'News, music and entertainment for Northern Ireland',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      
      // Commercial UK Stations
      {
        id: 10,
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
        id: 11,
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
        id: 12,
        name: 'Cool FM',
        streamUrl: 'https://edge-bauerireland-01-gos2.sharp-stream.com/coolfm.mp3',
        genre: 'pop',
        country: 'UK',
        description: 'Northern Ireland\'s Hit Music Station',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 13,
        name: 'Kiss FM',
        streamUrl: 'http://radio.kissfmuk.com/stream',
        genre: 'dance',
        country: 'UK',
        description: 'Dance and R&B music',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 14,
        name: 'Magic FM',
        streamUrl: 'http://media-ssl.musicradio.com/MagicMP3',
        genre: 'pop',
        country: 'UK',
        description: 'More of the songs you love',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 15,
        name: 'Classic FM',
        streamUrl: 'http://media-ssl.musicradio.com/ClassicFMMP3',
        genre: 'classical',
        country: 'UK',
        description: 'The world\'s greatest classical music',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 16,
        name: 'Smooth Radio',
        streamUrl: 'http://media-ssl.musicradio.com/SmoothMP3',
        genre: 'pop',
        country: 'UK',
        description: 'More music, more variety',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 17,
        name: 'Jazz FM',
        streamUrl: 'http://edge-bauerall-01-gos2.sharp-stream.com/jazz.aac',
        genre: 'jazz',
        country: 'UK',
        description: 'The sound of jazz',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 18,
        name: 'TalkSport',
        streamUrl: 'http://radio.talksport.com/stream',
        genre: 'news',
        country: 'UK',
        description: 'Sports radio and talk',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 19,
        name: 'LBC',
        streamUrl: 'http://media-ssl.musicradio.com/LBCMP3',
        genre: 'news',
        country: 'UK',
        description: 'Leading Britain\'s Conversation',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 20,
        name: 'Absolute Radio',
        streamUrl: 'http://icy-e-bab-04-gos2.sharp-stream.com/absoluteradio.mp3',
        genre: 'rock',
        country: 'UK',
        description: 'Alternative rock and classic hits',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      {
        id: 21,
        name: 'Planet Rock',
        streamUrl: 'http://planetradio.co.uk/stream/planetrock.mp3',
        genre: 'rock',
        country: 'UK',
        description: 'The planet\'s greatest rock',
        isFavorite: false,
        streamType: StreamType.HTTP,
        isUserAdded: false,
      },
      
      // International Stations
      {
        id: 22,
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
        id: 23,
        name: 'KCRW',
        streamUrl: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air',
        genre: 'alternative',
        country: 'US',
        description: 'Eclectic music and culture from Santa Monica',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 24,
        name: 'WNYC',
        streamUrl: 'https://fm939.wnyc.org/wnycfm',
        genre: 'news',
        country: 'US',
        description: 'New York Public Radio',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 25,
        name: 'CBC Radio One',
        streamUrl: 'https://cbc_r1_tor.akacast.akamaistream.net/7/750/451661/v1/rc.akacast.akamaistream.net/cbc_r1_tor',
        genre: 'news',
        country: 'Canada',
        description: 'Canadian Broadcasting Corporation news and current affairs',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 26,
        name: 'CBC Music',
        streamUrl: 'https://cbc_r2_tor.akacast.akamaistream.net/7/750/451657/v1/rc.akacast.akamaistream.net/cbc_r2_tor',
        genre: 'classical',
        country: 'Canada',
        description: 'Classical and contemporary music from CBC',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 27,
        name: 'RTÉ Radio 1',
        streamUrl: 'https://icecast.rte.ie/ie1',
        genre: 'news',
        country: 'Ireland',
        description: 'Ireland\'s national radio station',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 28,
        name: 'RTÉ 2fm',
        streamUrl: 'https://icecast.rte.ie/ie2fm',
        genre: 'pop',
        country: 'Ireland',
        description: 'Contemporary music and entertainment',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 29,
        name: 'France Inter',
        streamUrl: 'https://direct.franceinter.fr/live/franceinter-midfi.mp3',
        genre: 'news',
        country: 'France',
        description: 'French public radio news and culture',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 30,
        name: 'Radio 538',
        streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO538.mp3',
        genre: 'pop',
        country: 'Netherlands',
        description: 'The Netherlands\' biggest pop station',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 31,
        name: 'Triple J',
        streamUrl: 'https://live-radio01.mediahubaustralia.com/2TJW/mp3/',
        genre: 'alternative',
        country: 'Australia',
        description: 'Australia\'s alternative music station',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      
      // Specialist and Genre Stations
      {
        id: 32,
        name: 'Soma FM Groove Salad',
        streamUrl: 'https://somafm.com/groovesalad256.pls',
        genre: 'electronic',
        country: 'US',
        description: 'Downtempo electronic and ambient music',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 33,
        name: 'Soma FM Beat Blender',
        streamUrl: 'https://somafm.com/beatblender128.pls',
        genre: 'electronic',
        country: 'US',
        description: 'Electronic, downtempo and trip-hop',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 34,
        name: 'WWOZ New Orleans',
        streamUrl: 'https://wwoz-sc.streamguys1.com/wwoz-hi.mp3',
        genre: 'jazz',
        country: 'US',
        description: 'New Orleans jazz and blues',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 35,
        name: 'KEXP',
        streamUrl: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
        genre: 'alternative',
        country: 'US',
        description: 'Where the music matters - Seattle alternative',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 36,
        name: 'FIP',
        streamUrl: 'https://direct.fipradio.fr/live/fip-midfi.mp3',
        genre: 'jazz',
        country: 'France',
        description: 'Eclectic music selection from France',
        isFavorite: false,
        streamType: StreamType.HTTPS,
        isUserAdded: false,
      },
      {
        id: 37,
        name: 'Radio Paradise',
        streamUrl: 'https://stream.radioparadise.com/aac-320',
        genre: 'alternative',
        country: 'US',
        description: 'Commercial-free, eclectic online radio',
        isFavorite: false,
        streamType: StreamType.HTTPS,
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
      { id: 'country', name: 'Country', description: 'Country music' },
      { id: 'hip-hop', name: 'Hip-Hop', description: 'Hip-hop and rap music' },
      { id: 'r&b', name: 'R&B', description: 'Rhythm and blues' },
      { id: 'alternative', name: 'Alternative', description: 'Alternative and indie music' },
      { id: 'folk', name: 'Folk', description: 'Folk and acoustic music' },
      { id: 'dance', name: 'Dance', description: 'Dance and club music' },
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
      { id: 'country', name: 'Country', description: 'Country music' },
      { id: 'hip-hop', name: 'Hip-Hop', description: 'Hip-hop and rap music' },
      { id: 'r&b', name: 'R&B', description: 'Rhythm and blues' },
      { id: 'alternative', name: 'Alternative', description: 'Alternative and indie music' },
      { id: 'folk', name: 'Folk', description: 'Folk and acoustic music' },
      { id: 'dance', name: 'Dance', description: 'Dance and club music' },
    ];

    for (const genre of genres) {
      await this.db.runAsync(
        'INSERT INTO genres (id, name, description) VALUES (?, ?, ?)',
        [genre.id, genre.name, genre.description]
      );
    }

    // Seed stations - Comprehensive list
    const stations = [
      // BBC Stations
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
        name: 'BBC Radio 3',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_three',
        genre: 'classical',
        country: 'UK',
        description: 'Classical music, jazz, world music and arts programmes',
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
        name: 'BBC Radio 5 Live',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_five_live',
        genre: 'news',
        country: 'UK',
        description: 'Live news and sports coverage',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'BBC Radio 6 Music',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_6music',
        genre: 'alternative',
        country: 'UK',
        description: 'Alternative music and live sessions',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'BBC Radio Scotland',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_scotland_fm',
        genre: 'news',
        country: 'UK',
        description: 'News, music and entertainment for Scotland',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'BBC Radio Wales',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_wales_fm',
        genre: 'news',
        country: 'UK',
        description: 'News, music and entertainment for Wales',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'BBC Radio Ulster',
        streamUrl: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_ulster',
        genre: 'news',
        country: 'UK',
        description: 'News, music and entertainment for Northern Ireland',
        streamType: 'http',
        isUserAdded: 0,
      },
      
      // Commercial UK Stations
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
        name: 'Cool FM',
        streamUrl: 'https://edge-bauerireland-01-gos2.sharp-stream.com/coolfm.mp3',
        genre: 'pop',
        country: 'UK',
        description: 'Northern Ireland\'s Hit Music Station',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'Kiss FM',
        streamUrl: 'http://radio.kissfmuk.com/stream',
        genre: 'dance',
        country: 'UK',
        description: 'Dance and R&B music',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'Magic FM',
        streamUrl: 'http://media-ssl.musicradio.com/MagicMP3',
        genre: 'pop',
        country: 'UK',
        description: 'More of the songs you love',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'Classic FM',
        streamUrl: 'http://media-ssl.musicradio.com/ClassicFMMP3',
        genre: 'classical',
        country: 'UK',
        description: 'The world\'s greatest classical music',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'Smooth Radio',
        streamUrl: 'http://media-ssl.musicradio.com/SmoothMP3',
        genre: 'pop',
        country: 'UK',
        description: 'More music, more variety',
        streamType: 'http',
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
      {
        name: 'TalkSport',
        streamUrl: 'http://radio.talksport.com/stream',
        genre: 'news',
        country: 'UK',
        description: 'Sports radio and talk',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'LBC',
        streamUrl: 'http://media-ssl.musicradio.com/LBCMP3',
        genre: 'news',
        country: 'UK',
        description: 'Leading Britain\'s Conversation',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'Absolute Radio',
        streamUrl: 'http://icy-e-bab-04-gos2.sharp-stream.com/absoluteradio.mp3',
        genre: 'rock',
        country: 'UK',
        description: 'Alternative rock and classic hits',
        streamType: 'http',
        isUserAdded: 0,
      },
      {
        name: 'Planet Rock',
        streamUrl: 'http://planetradio.co.uk/stream/planetrock.mp3',
        genre: 'rock',
        country: 'UK',
        description: 'The planet\'s greatest rock',
        streamType: 'http',
        isUserAdded: 0,
      },
      
      // International Stations
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
        name: 'KCRW',
        streamUrl: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air',
        genre: 'alternative',
        country: 'US',
        description: 'Eclectic music and culture from Santa Monica',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'WNYC',
        streamUrl: 'https://fm939.wnyc.org/wnycfm',
        genre: 'news',
        country: 'US',
        description: 'New York Public Radio',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'CBC Radio One',
        streamUrl: 'https://cbc_r1_tor.akacast.akamaistream.net/7/750/451661/v1/rc.akacast.akamaistream.net/cbc_r1_tor',
        genre: 'news',
        country: 'Canada',
        description: 'Canadian Broadcasting Corporation news and current affairs',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'CBC Music',
        streamUrl: 'https://cbc_r2_tor.akacast.akamaistream.net/7/750/451657/v1/rc.akacast.akamaistream.net/cbc_r2_tor',
        genre: 'classical',
        country: 'Canada',
        description: 'Classical and contemporary music from CBC',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'RTÉ Radio 1',
        streamUrl: 'https://icecast.rte.ie/ie1',
        genre: 'news',
        country: 'Ireland',
        description: 'Ireland\'s national radio station',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'RTÉ 2fm',
        streamUrl: 'https://icecast.rte.ie/ie2fm',
        genre: 'pop',
        country: 'Ireland',
        description: 'Contemporary music and entertainment',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'France Inter',
        streamUrl: 'https://direct.franceinter.fr/live/franceinter-midfi.mp3',
        genre: 'news',
        country: 'France',
        description: 'French public radio news and culture',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'Radio 538',
        streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO538.mp3',
        genre: 'pop',
        country: 'Netherlands',
        description: 'The Netherlands\' biggest pop station',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'Triple J',
        streamUrl: 'https://live-radio01.mediahubaustralia.com/2TJW/mp3/',
        genre: 'alternative',
        country: 'Australia',
        description: 'Australia\'s alternative music station',
        streamType: 'https',
        isUserAdded: 0,
      },
      
      // Specialist and Genre Stations
      {
        name: 'Soma FM Groove Salad',
        streamUrl: 'https://somafm.com/groovesalad256.pls',
        genre: 'electronic',
        country: 'US',
        description: 'Downtempo electronic and ambient music',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'Soma FM Beat Blender',
        streamUrl: 'https://somafm.com/beatblender128.pls',
        genre: 'electronic',
        country: 'US',
        description: 'Electronic, downtempo and trip-hop',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'WWOZ New Orleans',
        streamUrl: 'https://wwoz-sc.streamguys1.com/wwoz-hi.mp3',
        genre: 'jazz',
        country: 'US',
        description: 'New Orleans jazz and blues',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'KEXP',
        streamUrl: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
        genre: 'alternative',
        country: 'US',
        description: 'Where the music matters - Seattle alternative',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'FIP',
        streamUrl: 'https://direct.fipradio.fr/live/fip-midfi.mp3',
        genre: 'jazz',
        country: 'France',
        description: 'Eclectic music selection from France',
        streamType: 'https',
        isUserAdded: 0,
      },
      {
        name: 'Radio Paradise',
        streamUrl: 'https://stream.radioparadise.com/aac-320',
        genre: 'alternative',
        country: 'US',
        description: 'Commercial-free, eclectic online radio',
        streamType: 'https',
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