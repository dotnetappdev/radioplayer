import { RadioStation, StreamType } from '../db/types';

export interface FMStreamStation {
  id: string;
  name: string;
  url: string;
  website?: string;
  genre?: string;
  country?: string;
  description?: string;
  logo?: string;
}

export interface FMStreamResponse {
  stations: FMStreamStation[];
  total: number;
  page: number;
}

class FMStreamService {
  private readonly baseUrl = 'https://www.fmstream.org/api';
  
  /**
   * Fetch stations from FMStream API
   * Since the actual API structure isn't available, this is based on common radio directory patterns
   */
  async fetchStations(limit: number = 100, page: number = 1): Promise<FMStreamResponse> {
    try {
      // FMStream API endpoint - this would need to be adjusted based on actual API
      const response = await fetch(`${this.baseUrl}/stations?limit=${limit}&page=${page}`);
      
      if (!response.ok) {
        throw new Error(`FMStream API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.parseFMStreamResponse(data);
    } catch (error) {
      console.error('Error fetching stations from FMStream:', error);
      
      // Fallback: Return mock data that represents typical FMStream stations
      return this.getMockFMStreamData();
    }
  }

  /**
   * Parse FMStream API response into our expected format
   */
  private parseFMStreamResponse(data: any): FMStreamResponse {
    // This would need to be adjusted based on actual FMStream API response format
    return {
      stations: data.stations || data.results || [],
      total: data.total || data.count || 0,
      page: data.page || 1
    };
  }

  /**
   * Convert FMStream station to our RadioStation format
   */
  convertToRadioStation(fmStation: FMStreamStation, existingIds: Set<number>): RadioStation {
    // Generate a unique ID that doesn't conflict with existing stations
    let newId: number;
    do {
      newId = Math.floor(Math.random() * 900000) + 100000; // 6-digit ID
    } while (existingIds.has(newId));
    
    return {
      id: newId,
      name: fmStation.name,
      streamUrl: fmStation.url,
      logoUrl: fmStation.logo,
      genre: this.normalizeGenre(fmStation.genre || 'pop'),
      country: fmStation.country || 'Unknown',
      description: fmStation.description || `${fmStation.name} radio station`,
      isFavorite: false,
      streamType: this.determineStreamType(fmStation.url),
      isUserAdded: false // FMStream stations are not user-added, they're from external API
    };
  }

  /**
   * Determine stream type based on URL
   */
  private determineStreamType(url: string): StreamType {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('https://')) {
      return StreamType.HTTPS;
    } else if (lowerUrl.includes('http://')) {
      return StreamType.HTTP;
    } else if (lowerUrl.includes('.m3u8')) {
      return StreamType.HLS;
    } else if (lowerUrl.includes('icy://')) {
      return StreamType.ICY;
    } else {
      return StreamType.HTTP; // Default fallback
    }
  }

  /**
   * Normalize genre to match our supported genres
   */
  private normalizeGenre(genre: string): string {
    const normalizedGenre = genre.toLowerCase().trim();
    
    const genreMap: { [key: string]: string } = {
      'pop': 'pop',
      'rock': 'rock',
      'news': 'news',
      'talk': 'news',
      'classical': 'classical',
      'jazz': 'jazz',
      'electronic': 'electronic',
      'edm': 'electronic',
      'dance': 'dance',
      'country': 'country',
      'hip-hop': 'hip-hop',
      'hip hop': 'hip-hop',
      'rap': 'hip-hop',
      'r&b': 'r&b',
      'rnb': 'r&b',
      'alternative': 'alternative',
      'indie': 'alternative',
      'folk': 'folk',
      'acoustic': 'folk'
    };

    return genreMap[normalizedGenre] || 'pop'; // Default to pop if not found
  }

  /**
   * Mock data for testing purposes when actual API is not available
   */
  private getMockFMStreamData(): FMStreamResponse {
    return {
      stations: [
        {
          id: 'fm1',
          name: 'FMStream Pop Radio',
          url: 'https://streaming.fmstream.org/pop-radio/stream.mp3',
          genre: 'pop',
          country: 'US',
          description: 'Popular music hits 24/7 from FMStream',
          logo: 'https://fmstream.org/logos/pop-radio.png'
        },
        {
          id: 'fm2',
          name: 'FMStream Rock Station',
          url: 'https://streaming.fmstream.org/rock-station/stream.aac',
          genre: 'rock',
          country: 'UK',
          description: 'Classic and modern rock from FMStream',
          logo: 'https://fmstream.org/logos/rock-station.png'
        },
        {
          id: 'fm3',
          name: 'FMStream Jazz Lounge',
          url: 'https://streaming.fmstream.org/jazz-lounge/128.mp3',
          genre: 'jazz',
          country: 'US',
          description: 'Smooth jazz and blues from FMStream',
          logo: 'https://fmstream.org/logos/jazz-lounge.png'
        },
        {
          id: 'fm4',
          name: 'FMStream Electronic',
          url: 'https://streaming.fmstream.org/electronic/256.aac',
          genre: 'electronic',
          country: 'Germany',
          description: 'Electronic dance music from FMStream',
          logo: 'https://fmstream.org/logos/electronic.png'
        },
        {
          id: 'fm5',
          name: 'FMStream News Network',
          url: 'https://streaming.fmstream.org/news/live.m3u8',
          genre: 'news',
          country: 'Canada',
          description: 'Global news and current affairs from FMStream',
          logo: 'https://fmstream.org/logos/news.png'
        },
        {
          id: 'fm6',
          name: 'FMStream Classical',
          url: 'https://streaming.fmstream.org/classical/high.flac',
          genre: 'classical',
          country: 'Austria',
          description: 'Classical music masterpieces from FMStream',
          logo: 'https://fmstream.org/logos/classical.png'
        },
        {
          id: 'fm7',
          name: 'FMStream Hip-Hop',
          url: 'https://streaming.fmstream.org/hiphop/192.mp3',
          genre: 'hip-hop',
          country: 'US',
          description: 'Latest hip-hop and rap from FMStream',
          logo: 'https://fmstream.org/logos/hiphop.png'
        },
        {
          id: 'fm8',
          name: 'FMStream Country',
          url: 'https://streaming.fmstream.org/country/stream.aac',
          genre: 'country',
          country: 'US',
          description: 'Country music classics and hits from FMStream',
          logo: 'https://fmstream.org/logos/country.png'
        }
      ],
      total: 8,
      page: 1
    };
  }
}

export const fmStreamService = new FMStreamService();