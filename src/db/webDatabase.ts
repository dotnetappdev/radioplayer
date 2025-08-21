import { RadioStation, Genre, StreamType } from './types';

class WebDatabaseService {
  private mockStations: RadioStation[] = [
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

  private mockGenres: Genre[] = [
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

  async initialize() {
    console.log('Web database service initialized with mock data');
  }

  async getAllStations(): Promise<RadioStation[]> {
    return [...this.mockStations];
  }

  async getStationsByCountry(country: string): Promise<RadioStation[]> {
    return this.mockStations.filter(s => s.country === country);
  }

  async getStationsByGenre(genre: string): Promise<RadioStation[]> {
    return this.mockStations.filter(s => s.genre === genre);
  }

  async getFavoriteStations(): Promise<RadioStation[]> {
    return this.mockStations.filter(s => s.isFavorite);
  }

  async searchStations(query: string): Promise<RadioStation[]> {
    const lowerQuery = query.toLowerCase();
    return this.mockStations.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.genre.toLowerCase().includes(lowerQuery) ||
      (s.description && s.description.toLowerCase().includes(lowerQuery))
    );
  }

  async toggleFavorite(stationId: number): Promise<void> {
    const station = this.mockStations.find(s => s.id === stationId);
    if (station) {
      station.isFavorite = !station.isFavorite;
    }
  }

  async updateLastPlayed(stationId: number): Promise<void> {
    const station = this.mockStations.find(s => s.id === stationId);
    if (station) {
      station.lastPlayed = new Date();
    }
  }

  async getAllGenres(): Promise<Genre[]> {
    return [...this.mockGenres];
  }

  async addToPlayHistory(stationId: number, duration?: number): Promise<void> {
    console.log(`Add to play history: station ${stationId}, duration ${duration}`);
  }

  async getRecentlyPlayed(limit: number = 10): Promise<RadioStation[]> {
    return this.mockStations.slice(0, limit);
  }

  // CRUD Operations (Web implementation with mock data)
  async createStation(station: Omit<RadioStation, 'id' | 'isFavorite' | 'lastPlayed'>): Promise<number> {
    const id = Math.max(...this.mockStations.map(s => s.id)) + 1;
    const newStation: RadioStation = {
      ...station,
      id,
      isFavorite: false,
      lastPlayed: undefined,
    };
    this.mockStations.push(newStation);
    console.log('Created station (web mock):', newStation);
    return id;
  }

  async updateStation(id: number, station: Partial<Omit<RadioStation, 'id' | 'isUserAdded'>>): Promise<void> {
    const index = this.mockStations.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockStations[index] = { ...this.mockStations[index], ...station };
      console.log('Updated station (web mock):', this.mockStations[index]);
    }
  }

  async deleteStation(id: number): Promise<void> {
    const index = this.mockStations.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockStations.splice(index, 1);
      console.log('Deleted station (web mock):', id);
    }
  }

  async getUserAddedStations(): Promise<RadioStation[]> {
    return this.mockStations.filter(s => s.isUserAdded);
  }

  async getStationById(id: number): Promise<RadioStation | null> {
    return this.mockStations.find(s => s.id === id) || null;
  }
}

export const webDatabaseService = new WebDatabaseService();