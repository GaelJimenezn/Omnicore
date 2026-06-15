import { db } from '../core/firebase.config';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { appStore } from '../core/Store';
import { apiService } from './ApiService';
import { type MediaItem } from './MediaService';

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  isDynamic: boolean;
  filterKeyword: string;
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
        manualOrder: [],
        items: []
      },
      {
        id: 'mock-list-2',
        userId: 'mock-123',
        name: 'Universo Transformers',
        isDynamic: true,
        filterKeyword: 'Transformers',
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
    if (list.isDynamic && list.filterKeyword) {
      try {
        // Buscar en el backend externo basado en keyword (TMDB)
        const results = await apiService.get<{results: MediaItem[]}>(`/api/search?query=${encodeURIComponent(list.filterKeyword)}`);
        
        // Asignar items resultantes, pero ordenarlos por manualOrder si existe
        list.items = this.applyManualOrder(results.results || this.getMockTransformers(), list.manualOrder);
      } catch (e) {
        // Si la API falla (ej. sin keys), usar mock
        list.items = this.applyManualOrder(this.getMockTransformers(), list.manualOrder);
      }
    } else {
      // Si no es dinámica, usar sus items estáticos y ordenarlos
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
      { id: 101, title: 'Transformers: El Despertar de las Bestias', type: 'movie', poster: 'https://image.tmdb.org/t/p/w500/qhcwgE0H02A0w2vA0o7R7kXYl8w.jpg', backdrop: '', overview: '' },
      { id: 102, title: 'Transformers: La Era de la Extinción', type: 'movie', poster: 'https://image.tmdb.org/t/p/w500/vGvGvGvGvGvGvGvGvGvGvGvGvG.jpg', backdrop: '', overview: '' },
      { id: 103, title: 'Bumblebee', type: 'movie', poster: 'https://image.tmdb.org/t/p/w500/fWvGvGvGvGvGvGvGvGvGvGvGvG.jpg', backdrop: '', overview: '' }
    ];
  }
}

export const listService = ListService.getInstance();
