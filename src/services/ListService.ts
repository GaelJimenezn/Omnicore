import { db } from '../core/firebase.config';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { appStore } from '../core/Store';
import { type MediaItem } from './MediaService';

export type PlaylistCategory = 'mixed' | 'movie' | 'tv' | 'game' | 'anime' | 'manga';

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  isDynamic: boolean;
  filterKeyword: string;
  category: PlaylistCategory;
  manualOrder: string[]; // array of MediaItem IDs to force order
  items: MediaItem[]; // cached or populated items
}

export class ListService {
  private static instance: ListService;
  private mockLists: Playlist[] = [];

  private constructor() {
    // Generar algunas listas mock iniciales
    this.mockLists = [
      {
        id: 'mock-list-1',
        userId: 'mock-123',
        name: 'Favoritos de Acción',
        isDynamic: false,
        filterKeyword: '',
        category: 'movie',
        manualOrder: [],
        items: []
      },
      {
        id: 'mock-list-2',
        userId: 'mock-123',
        name: 'Universo Transformers',
        isDynamic: true,
        filterKeyword: 'Transformers',
        category: 'movie',
        manualOrder: [],
        items: []
      }
    ];
  }

  public static getInstance(): ListService {
    if (!ListService.instance) {
      ListService.instance = new ListService();
    }
    return ListService.instance;
  }

  private get userId(): string | null {
    return appStore.get().user?.uid || 'mock-123';
  }

  async getPlaylists(): Promise<Playlist[]> {
    if (!db) {
      // Mock mode: Evaluar dinámicas al vuelo
      return Promise.all(this.mockLists.map(list => this.populateDynamicList(list)));
    }

    const uid = this.userId;
    if (!uid) return [];

    const q = query(collection(db, 'playlists'), where('userId', '==', uid));
    const snapshot = await getDocs(q);
    const lists = snapshot.docs.map(doc => doc.data() as Playlist);
    
    return Promise.all(lists.map(list => this.populateDynamicList(list)));
  }

  async savePlaylist(playlist: Playlist): Promise<void> {
    if (!playlist.userId) playlist.userId = this.userId!;
    
    if (!db) {
      const idx = this.mockLists.findIndex(l => l.id === playlist.id);
      if (idx >= 0) this.mockLists[idx] = playlist;
      else this.mockLists.push(playlist);
      return;
    }

    await setDoc(doc(db, 'playlists', playlist.id), playlist);
  }

  async deletePlaylist(id: string): Promise<void> {
    if (!db) {
      this.mockLists = this.mockLists.filter(l => l.id !== id);
      return;
    }
    await deleteDoc(doc(db, 'playlists', id));
  }

  // --- Dynamic Population & Manual Sorting ---

  private async populateDynamicList(list: Playlist): Promise<Playlist> {
    if (!list.category) list.category = 'mixed';

    if (list.isDynamic && list.filterKeyword) {
      try {
        // --- JIKAN API FOR ANIME AND MANGA ---
        if (list.category === 'anime' || list.category === 'manga') {
          const type = list.category; // 'anime' or 'manga'
          const res = await fetch(`https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(list.filterKeyword)}&limit=20&sfw=true`);
          const data = await res.json();
          if (data.data) {
            const mappedItems = data.data.map((m: any) => ({
                id: m.mal_id,
                title: m.title,
                poster: m.images?.jpg?.image_url || '',
                backdrop: m.images?.jpg?.large_image_url || '',
                overview: m.synopsis || '',
                type: type,
                rating: m.score,
                year: type === 'anime' ? (m.year || (m.aired?.from ? m.aired.from.substring(0, 4) : '')) : (m.published?.from ? m.published.from.substring(0, 4) : '')
            }));
            list.items = this.applyManualOrder(mappedItems, list.manualOrder);
            return list;
          }
        }

        // --- RAWG API FOR GAMES ---
        if (list.category === 'game') {
          const apiKeyRawg = import.meta.env.VITE_RAWG_API_KEY;
          if (apiKeyRawg) {
            const res = await fetch(`https://api.rawg.io/api/games?key=${apiKeyRawg}&search=${encodeURIComponent(list.filterKeyword)}&page_size=20`);
            const data = await res.json();
            if (data.results) {
              const mappedItems = data.results.map((g: any) => ({
                id: g.id,
                title: g.name,
                poster: g.background_image || '',
                backdrop: g.background_image_additional || g.background_image || '',
                overview: '',
                type: 'game',
                rating: g.rating,
                year: g.released ? g.released.split('-')[0] : ''
              }));
              list.items = this.applyManualOrder(mappedItems, list.manualOrder);
              return list;
            }
          }
        }

        // --- TMDB API FOR MOVIES / TV / MIXED ---
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        if (!apiKey) throw new Error('No API Key');

        let rawItems: any[] = [];

        let foundCollection = false;

        // 1. Try to find a collection (Franchise) first to get all movies
        try {
          const colRes = await fetch(`https://api.themoviedb.org/3/search/collection?api_key=${apiKey}&language=es-MX&query=${encodeURIComponent(list.filterKeyword)}&page=1`);
          const colData = await colRes.json();
          if (colData.results && colData.results.length > 0) {
            const collectionId = colData.results[0].id;
            const detailRes = await fetch(`https://api.themoviedb.org/3/collection/${collectionId}?api_key=${apiKey}&language=es-MX`);
            const detailData = await detailRes.json();
            if (detailData.parts && detailData.parts.length > 0) {
              // Parts are always movies
              rawItems = detailData.parts.map((p: any) => ({ ...p, media_type: 'movie' }));
              foundCollection = true;
            }
          }
        } catch (e) {
          console.error("Error fetching collection", e);
        }

        // 2. Normal multi search (ONLY if collection not found)
        if (!foundCollection) {
          const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=es-MX&query=${encodeURIComponent(list.filterKeyword)}&page=1`);
          const data = await res.json();
          if (data.results) {
            rawItems = data.results;
          }
        }

        // Deduplicate by ID
        const uniqueMap = new Map<number, any>();
        rawItems.forEach(item => {
          if ((item.media_type === 'movie' || item.media_type === 'tv') && !uniqueMap.has(item.id)) {
            uniqueMap.set(item.id, item);
          }
        });
        
        const mappedItems: MediaItem[] = Array.from(uniqueMap.values())
          .filter((m: any) => {
            if (list.category === 'movie' && m.media_type !== 'movie') return false;
            if (list.category === 'tv' && m.media_type !== 'tv') return false;
            return true;
          })
          .map((m: any) => ({
            id: m.id,
            title: m.title || m.name,
            poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://ui-avatars.com/api/?name=OH&background=111&color=fff',
            backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : '',
            overview: m.overview,
            type: m.media_type === 'tv' ? 'tv' : 'movie',
            rating: m.vote_average,
            year: m.release_date ? m.release_date.split('-')[0] : (m.first_air_date ? m.first_air_date.split('-')[0] : '')
          }));
        
        list.items = this.applyManualOrder(mappedItems, list.manualOrder);
      } catch (e) {
        list.items = this.applyManualOrder(this.getMockTransformers(), list.manualOrder);
      }
    } else {
      list.items = this.applyManualOrder(list.items || [], list.manualOrder);
    }
    return list;
  }

  public applyManualOrder(items: MediaItem[], orderIds: string[]): MediaItem[] {
    if (!orderIds || orderIds.length === 0) return items;

    const ordered: MediaItem[] = [];
    const remaining = [...items];

    // 1. Extraer los que están en manualOrder
    for (const id of orderIds) {
      const idx = remaining.findIndex(item => String(item.id) === String(id));
      if (idx !== -1) {
        ordered.push(remaining[idx]);
        remaining.splice(idx, 1);
      }
    }

    // 2. Añadir el resto al final
    return [...ordered, ...remaining];
  }

  private getMockTransformers(): MediaItem[] {
    return [
      { id: 101, title: 'Transformers: El Despertar de las Bestias', type: 'movie', poster: 'https://image.tmdb.org/t/p/w500/qhcwgE0H02A0w2vA0o7R7kXYl8w.jpg', backdrop: '', overview: '', year: '2023' },
      { id: 102, title: 'Transformers: La Era de la Extinción', type: 'movie', poster: 'https://image.tmdb.org/t/p/w500/vGvGvGvGvGvGvGvGvGvGvGvGvG.jpg', backdrop: '', overview: '', year: '2014' },
      { id: 103, title: 'Bumblebee', type: 'movie', poster: 'https://image.tmdb.org/t/p/w500/fWvGvGvGvGvGvGvGvGvGvGvGvG.jpg', backdrop: '', overview: '', year: '2018' }
    ];
  }
}

export const listService = ListService.getInstance();
