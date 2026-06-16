
export interface MediaItem {
  id: number;
  title: string;
  poster: string;
  backdrop: string;
  overview: string;
  type: 'movie' | 'tv' | 'game' | 'anime' | 'manga';
  rating?: number;
  year?: string;
  logo?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface MediaDetails {
  cast: CastMember[];
  providers: WatchProvider[];
  runtime?: string;
  genre?: string;
  logo?: string;
  overview?: string;
}

/**
 * MediaService
 * Fetches media information from TMDB, RAWG, and Jikan APIs.
 */
export class MediaService {
  private static instance: MediaService;

  private constructor() {}

  public static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  /**
   * Fetches trending movies from TMDB.
   * @returns {Promise<MediaItem[]>} List of trending movies.
   */
  async getTrendingMovies(): Promise<MediaItem[]> {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) throw new Error('No TMDB API Key');

    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=es-MX`);
    const data = await res.json();
    
    if (!data.results) return [];

    return data.results.map((m: any) => ({
      id: m.id,
      title: m.title || m.name,
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
      backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : '',
      overview: m.overview,
      type: 'movie',
      rating: m.vote_average,
      year: m.release_date ? m.release_date.split('-')[0] : ''
    }));
  }

  /**
   * Fetches trending TV series from TMDB.
   * @returns {Promise<MediaItem[]>} List of trending series.
   */
  async getTrendingSeries(): Promise<MediaItem[]> {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) throw new Error('No TMDB API Key');

    const res = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&language=es-MX`);
    const data = await res.json();
    
    if (!data.results) return [];

    return data.results.map((s: any) => ({
      id: s.id,
      title: s.name || s.original_name,
      poster: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : '',
      backdrop: s.backdrop_path ? `https://image.tmdb.org/t/p/original${s.backdrop_path}` : '',
      overview: s.overview,
      type: 'series',
      rating: s.vote_average,
      year: s.first_air_date ? s.first_air_date.split('-')[0] : ''
    }));
  }

  /**
   * Fetches trending games from RAWG and enriches them with SteamGridDB.
   * @returns {Promise<MediaItem[]>} List of trending games.
   */
  async getTrendingGames(): Promise<MediaItem[]> {
    const apiKey = import.meta.env.VITE_RAWG_API_KEY;
    if (!apiKey) return [];

    const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&dates=2023-01-01,2024-12-31&ordering=-added&page_size=15`);
    const data = await res.json();
    if (!data.results) return [];

    const games: MediaItem[] = data.results.map((g: any) => ({
      id: g.id,
      title: g.name,
      poster: g.background_image || '',
      backdrop: g.background_image_additional || g.background_image || '',
      overview: '',
      type: 'game',
      rating: g.rating,
      year: g.released ? g.released.split('-')[0] : ''
    }));

    // Fetch SteamGridDB parallel
    await Promise.all(games.map(async (g) => {
      const sgd = await this.getSteamGridData(g.title);
      if (sgd) {
        if (sgd.poster) g.poster = sgd.poster;
        if (sgd.logo) g.logo = sgd.logo;
      }
    }));

    return games;
  }

  /**
   * Fetches vertical posters and transparent logos from SteamGridDB.
   * @param {string} gameName - Name of the game to search.
   * @returns {Promise<{ poster: string, logo: string } | null>}
   */
  private async getSteamGridData(
    gameName: string
  ): Promise<{ poster: string, logo: string } | null> {
    const apiKey = import.meta.env.VITE_STEAMGRIDDB_API_KEY;
    if (!apiKey) return null;

    try {
      const searchRes = await fetch(`/steamgriddb-api/search/autocomplete/${encodeURIComponent(gameName)}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const searchData = await searchRes.json();
      if (!searchData.success || searchData.data.length === 0) return null;

      const gameId = searchData.data[0].id;

      // Use exact parameters typical for Playnite to ensure covers
      const gridRes = await fetch(`/steamgriddb-api/grids/game/${gameId}?dimensions=600x900,342x482,460x215&styles=alternate,official,material,white_logo,no_logo`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const gridData = await gridRes.json();
      let poster = null;
      if (gridData.success && gridData.data.length > 0) {
        // Prioritize standard vertical grids 600x900, then by upvotes
        const gridsToUse = gridData.data.sort((a: any, b: any) => {
          if (a.width === 600 && b.width !== 600) return -1;
          if (a.width !== 600 && b.width === 600) return 1;
          return (b.upvotes || 0) - (a.upvotes || 0);
        });
        poster = gridsToUse[0].url;
      }

      const logoRes = await fetch(`/steamgriddb-api/logos/game/${gameId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const logoData = await logoRes.json();
      const logo = logoData.success && logoData.data.length > 0 ? logoData.data[0].url : null;

      if (poster || logo) {
        return { poster: poster || '', logo: logo || '' };
      }
      return null;
    } catch (e) {
      console.error('SteamGridDB Error:', e);
      return null;
    }
  }

  /**
   * Fetches top trending anime from Jikan API.
   * SFW filter is enabled to prevent adult content.
   * @returns {Promise<MediaItem[]>} List of anime.
   */
  async getTrendingAnime(): Promise<MediaItem[]> {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/top/anime?filter=bypopularity&sfw=true`);
      const data = await res.json();
      if (!data.data) return [];

      return data.data.slice(0, 20).map((m: any) => ({
        id: m.mal_id,
        title: m.title,
        poster: m.images?.jpg?.image_url || '',
        backdrop: m.images?.jpg?.large_image_url || '',
        overview: m.synopsis || '',
        type: 'anime',
        rating: m.score,
        year: m.year || (m.aired?.from ? m.aired.from.substring(0, 4) : '')
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /**
   * Fetches top trending manga from Jikan API.
   * @returns {Promise<MediaItem[]>} List of manga.
   */
  async getTrendingManga(): Promise<MediaItem[]> {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/top/manga?filter=bypopularity&sfw=true`);
      const data = await res.json();
      if (!data.data) return [];

      return data.data.slice(0, 20).map((m: any) => ({
        id: m.mal_id,
        title: m.title,
        poster: m.images?.jpg?.image_url || '',
        backdrop: m.images?.jpg?.large_image_url || '',
        overview: m.synopsis || '',
        type: 'manga',
        rating: m.score,
        year: m.published?.from ? m.published.from.substring(0, 4) : ''
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /**
   * Gets streaming URL (Placeholder).
   * @param {number} _tmdbId - The ID of the media.
   * @returns {Promise<string>} Stream URL.
   */
  async getStreamUrl(_tmdbId: number): Promise<string> {
    return '#'; // Placeholder until specific streaming logic is defined
  }

  /**
   * Fetches additional media details like cast, providers, and logos.
   * @param {number | string} id - Media ID.
   * @param {string} type - Type of media ('movie', 'tv', 'game', etc).
   * @returns {Promise<MediaDetails>} Detailed information object.
   */
  async getMediaDetails(id: number | string, type: string): Promise<MediaDetails> {
    let cast: CastMember[] = [];
    let providers: WatchProvider[] = [];
    let runtime = '';
    let genre = '';
    let logo = '';
    let overview = '';

    if (type === 'movie' || type === 'tv' || type === 'series' || type === 'anime') {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      if (!apiKey) return { cast, providers, runtime, genre, logo };
      
      const tmdbType = (type === 'anime' || type === 'series') ? 'tv' : type;

      try {
        const res = await fetch(`https://api.themoviedb.org/3/${tmdbType}/${id}?api_key=${apiKey}&language=es-MX&append_to_response=credits,watch/providers,images&include_image_language=en,null,es`);
        const data = await res.json();
        
        if (data.credits && data.credits.cast) {
          cast = data.credits.cast.slice(0, 10).map((c: any) => ({
            id: c.id,
            name: c.name,
            character: c.character,
            profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(c.name) + '&background=111&color=fff'
          }));
        }

        const localeData = data['watch/providers']?.results?.MX || data['watch/providers']?.results?.US;
        if (localeData && localeData.flatrate) {
          providers = localeData.flatrate.map((p: any) => ({
            provider_id: p.provider_id,
            provider_name: p.provider_name,
            logo_path: `https://image.tmdb.org/t/p/w200${p.logo_path}`
          }));
        }

        if (data.runtime) {
          const h = Math.floor(data.runtime / 60);
          const m = data.runtime % 60;
          runtime = `${h}h ${m}m`;
        } else if (data.episode_run_time && data.episode_run_time.length > 0) {
          runtime = `${data.episode_run_time[0]}m`;
        }

        if (data.genres && data.genres.length > 0) {
          genre = data.genres[0].name;
        }

        if (data.images && data.images.logos && data.images.logos.length > 0) {
          logo = `https://image.tmdb.org/t/p/w500${data.images.logos[0].file_path}`;
        }
        
        if (data.overview) {
          overview = data.overview;
        }
      } catch (e) {
        console.error(e);
      }
    } else if (type === 'game') {
      try {
        const apiKey = import.meta.env.VITE_RAWG_API_KEY;
        const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);
        const data = await res.json();
        
        if (data.playtime) runtime = `${data.playtime} h promedio`;
        if (data.genres && data.genres.length > 0) genre = data.genres[0].name;
        if (data.description_raw) overview = data.description_raw;
        
        if (data.name) {
           const sgd = await this.getSteamGridData(data.name);
           if (sgd && sgd.logo) {
             logo = sgd.logo;
           }
        }
      } catch (e) {
        console.error(e);
      }
    }

    return { cast, providers, runtime, genre, logo, overview };
  }
}

export const mediaService = MediaService.getInstance();
