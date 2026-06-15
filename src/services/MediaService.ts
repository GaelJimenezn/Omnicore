import { apiService } from './ApiService';

export interface MediaItem {
  id: number;
  title: string;
  poster: string;
  backdrop: string;
  overview: string;
  type: 'movie' | 'tv' | 'game';
  rating?: number;
}

export class MediaService {
  private static instance: MediaService;

  private constructor() {}

  public static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  async getTrendingMovies(): Promise<MediaItem[]> {
    return apiService.get<MediaItem[]>('/api/get-media?type=trending-movies');
  }

  async getTrendingGames(): Promise<MediaItem[]> {
    return apiService.get<MediaItem[]>('/api/get-media?type=trending-games');
  }

  async getStreamUrl(tmdbId: number): Promise<string> {
    const res = await apiService.get<{url: string}>(`/api/get-stream?id=${tmdbId}`);
    return res.url;
  }
}

export const mediaService = MediaService.getInstance();
