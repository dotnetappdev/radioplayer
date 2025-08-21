export interface RadioStation {
  id: number;
  name: string;
  streamUrl: string;
  logoUrl?: string;
  genre: string;
  country: string;
  description?: string;
  isFavorite: boolean;
  lastPlayed?: Date;
  streamType: StreamType;
  isUserAdded: boolean;
}

export enum StreamType {
  HTTP = 'http',
  HTTPS = 'https',
  HLS = 'hls',
  DASH = 'dash',
  ICY = 'icy'
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
}

export interface PlayHistory {
  id: number;
  stationId: number;
  playedAt: Date;
  duration?: number;
}