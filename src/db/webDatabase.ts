import { RadioStation, Genre, StreamType } from './types';

class WebDatabaseService {
  private mockStations: RadioStation[] = [
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

  private mockGenres: Genre[] = [
    { id: 'pop', name: 'Pop', description: 'Popular music' },
    { id: 'rock', name: 'Rock', description: 'Rock music' },
    { id: 'news', name: 'News', description: 'News and talk' },
    { id: 'classical', name: 'Classical', description: 'Classical music' },
    { id: 'jazz', name: 'Jazz', description: 'Jazz music' },
    { id: 'electronic', name: 'Electronic', description: 'Electronic music' },
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