import { navbar } from '../components/Navbar';
import { listService, type Playlist } from '../services/ListService';
import { mediaDrawer } from '../components/MediaDrawer';

export class PlaylistsView {
  private lists: Playlist[] = [];
  private activeListId: string | null = null;
  private activeCategory: string = 'all';

  render() {
    return `
      <div class="h-screen bg-omni-dark flex flex-col overflow-hidden">
        ${navbar.render('/playlists')}
        
        <main class="flex-1 pt-24 pb-8 px-8 md:px-12 lg:px-12 transition-all duration-300 relative flex gap-12 max-w-[1600px] mx-auto w-full h-full overflow-hidden">
          <!-- Background Ambient Glow -->
          <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-omni-secondary/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
          
          <!-- Column 1: Lists Overview -->
          <div class="w-80 flex-shrink-0 flex flex-col gap-6 border-r border-white/5 pr-8">
            <header class="mb-4">
              <h2 class="text-omni-secondary font-black tracking-[0.2em] uppercase text-sm mb-2 drop-shadow-[0_0_10px_rgba(112,0,255,0.5)]">Tu Biblioteca</h2>
              <h1 class="text-4xl font-black text-white tracking-tight">Mis Listas</h1>
            </header>
            
            <button id="btn-create-list" class="w-full btn-glow flex items-center justify-center gap-2 mb-4 bg-white/5 text-white hover:bg-white/10 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              <span class="font-bold">Crear Nueva Lista</span>
            </button>

            <div class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar mb-2" id="category-tabs">
              <!-- Rendered via JS -->
            </div>

            <div id="playlists-container" class="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
              <!-- Rendered via JS -->
              <div class="animate-pulse text-omni-textMuted p-4">Cargando listas...</div>
            </div>
          </div>

          <!-- Column 2: List Editor (Drag & Drop) -->
          <div class="flex-1 flex flex-col relative overflow-hidden" id="list-editor">
            <div class="flex flex-col h-full items-center justify-center text-omni-textMuted relative z-10" id="editor-empty">
              <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              <p>Selecciona una lista para editar o ver su contenido.</p>
            </div>
            <div id="editor-content" class="hidden flex-col h-full relative z-10 w-full">
              <!-- Rendered via JS -->
            </div>
          </div>
        </main>
      </div>

      <!-- Modal Crear Lista -->
      <div id="modal-create" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] hidden items-center justify-center p-4 opacity-0 transition-opacity duration-300">
        <div class="glass-panel p-8 rounded-2xl w-full max-w-md scale-95 transition-transform duration-300 transform" id="modal-content">
          <h2 class="text-2xl font-black text-white mb-6">Crear Lista Dinámica</h2>
          <form id="form-create-list" class="flex flex-col gap-4">
            <input type="text" id="input-list-name" placeholder="Nombre de la lista (ej. Sci-Fi)" required class="w-full bg-omni-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-omni-secondary" />
            
            <select id="input-list-category" class="w-full bg-omni-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-omni-secondary">
              <option value="movie">Películas</option>
              <option value="tv">Series</option>
              <option value="game">Videojuegos</option>
              <option value="anime">Anime & Donghuas</option>
              <option value="manga">Mangas & Manhwas</option>
              <option value="mixed">Mixto</option>
            </select>

            <div class="flex items-center gap-3 bg-omni-dark/30 p-3 rounded-xl border border-white/5">
              <input type="checkbox" id="input-is-dynamic" checked class="w-5 h-5 accent-omni-secondary" />
              <label class="text-sm text-omni-textMuted">Rellenar automáticamente (Dinámica)</label>
            </div>
            <input type="text" id="input-list-filter" placeholder="Palabra clave (ej. Transformers)" class="w-full bg-omni-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-omni-secondary" />
            
            <div class="flex justify-end gap-4 mt-4">
              <button type="button" id="btn-close-modal" class="px-6 py-2 rounded-xl font-bold text-omni-textMuted hover:text-white transition-colors">Cancelar</button>
              <button type="submit" class="btn-glow px-8 bg-omni-secondary">Crear</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  async afterRender() {
    navbar.afterRender();
    await this.loadPlaylists();
    this.attachModalEvents();
  }

  private async loadPlaylists() {
    this.lists = await listService.getPlaylists();
    this.renderTabs();
    this.renderPlaylistsList();
    if (this.activeListId) {
      this.openEditor(this.activeListId);
    }
  }

  private renderTabs() {
    const tabsContainer = document.getElementById('category-tabs');
    if (!tabsContainer) return;
    const tabs = [
      { id: 'all', label: 'Todas' },
      { id: 'movie', label: 'Películas' },
      { id: 'tv', label: 'Series' },
      { id: 'game', label: 'Juegos' },
      { id: 'anime', label: 'Anime' },
      { id: 'manga', label: 'Manga' }
    ];

    tabsContainer.innerHTML = tabs.map(t => `
      <button type="button" class="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border border-white/5 shadow-sm ${this.activeCategory === t.id ? 'bg-omni-secondary text-white border-omni-secondary/30' : 'bg-omni-dark text-omni-textMuted hover:bg-white/10 hover:text-white'}" data-cat="${t.id}">
        ${t.label}
      </button>
    `).join('');

    tabsContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.getAttribute('data-cat') || 'all';
        this.renderTabs();
        this.renderPlaylistsList();
      });
    });
  }

  private renderPlaylistsList() {
    const container = document.getElementById('playlists-container');
    if (!container) return;

    const filteredLists = this.activeCategory === 'all' 
      ? this.lists 
      : this.lists.filter(l => l.category === this.activeCategory);

    if (filteredLists.length === 0) {
      container.innerHTML = '<p class="text-omni-textMuted p-4 text-center">No hay listas en esta categoría.</p>';
      return;
    }

    container.innerHTML = filteredLists.map(list => `
      <div class="p-3 rounded-xl cursor-pointer transition-all duration-300 border border-transparent flex items-center justify-between group ${this.activeListId === list.id ? 'bg-omni-hover border-white/10 shadow-lg relative' : 'hover:bg-white/5'}" data-list-id="${list.id}">
        ${this.activeListId === list.id ? '<div class="absolute left-0 top-2 bottom-2 w-1 bg-omni-accent rounded-r-full shadow-[0_0_10px_var(--color-omni-accent)]"></div>' : ''}
        <div class="pl-2">
          <h3 class="text-white font-bold text-base flex items-center gap-2">
            ${list.name}
            ${list.isDynamic ? '<span class="px-2 py-0.5 rounded bg-omni-secondary/20 text-omni-secondary text-[10px] font-bold uppercase tracking-wider">Auto</span>' : ''}
          </h3>
          <p class="text-xs text-omni-textMuted mt-1">${list.items.length} elementos</p>
        </div>
        <button class="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity btn-delete-list p-2" data-list-id="${list.id}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    `).join('');

    // Attach click for opening
    container.querySelectorAll('div[data-list-id]').forEach(el => {
      el.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.btn-delete-list')) return;
        this.activeListId = el.getAttribute('data-list-id');
        this.renderPlaylistsList(); // re-render to update active styling
        this.openEditor(this.activeListId!);
      });
    });

    // Attach delete
    container.querySelectorAll('.btn-delete-list').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-list-id');
        if (id && confirm('¿Eliminar lista?')) {
          await listService.deletePlaylist(id);
          if (this.activeListId === id) {
            this.activeListId = null;
            document.getElementById('editor-empty')!.classList.remove('hidden');
            document.getElementById('editor-content')!.classList.add('hidden');
          }
          await this.loadPlaylists();
        }
      });
    });
  }

  private openEditor(listId: string) {
    const list = this.lists.find(l => l.id === listId);
    if (!list) return;

    document.getElementById('editor-empty')!.classList.add('hidden');
    const content = document.getElementById('editor-content')!;
    content.classList.remove('hidden');
    content.classList.add('flex');

    content.innerHTML = `
      <header class="mb-10 p-8 rounded-3xl bg-gradient-to-br from-omni-secondary/20 via-omni-dark to-transparent border border-white/5 flex justify-between items-end relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-omni-dark/80 via-transparent to-transparent z-0"></div>
        <div class="relative z-10">
          <div class="text-xs font-bold text-omni-accent uppercase tracking-widest mb-3 flex items-center gap-2">
            ${list.isDynamic ? '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg> Lista Inteligente' : 'Lista Manual'}
          </div>
          <h2 class="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter" style="font-family: Impact, sans-serif;">${list.name}</h2>
          <p class="text-omni-textMuted text-sm font-medium">
            ${list.isDynamic ? 'Regla: Contiene la palabra <span class="text-white bg-white/10 px-2 py-0.5 rounded-md">"' + list.filterKeyword + '"</span>' : 'Colección personalizada'}
            <span class="mx-2">•</span> ${list.items.length} elementos
          </p>
        </div>
        <div class="relative z-10 text-xs font-bold text-omni-textMuted flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
          Arrastra para ordenar
        </div>
      </header>
      
      <div class="flex-1 overflow-y-auto pr-4 custom-scrollbar grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 content-start pb-20" id="drag-container">
        ${list.items.map(item => `
          <div class="relative w-full flex-shrink-0 group cursor-grab" draggable="true" data-item-id="${item.id}">
            <div class="relative aspect-[2/3] w-full mb-3 rounded-xl overflow-hidden bg-omni-panel border border-white/5 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl">
              <img src="${item.poster}" alt="${item.title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <!-- Subtle Drag Handle -->
              <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
              </div>
            </div>
            <div class="px-1">
              <h3 class="text-white font-bold text-xs md:text-sm leading-tight truncate">${item.title}</h3>
              <div class="flex items-center gap-2 mt-1 text-[10px] text-omni-textMuted font-medium">
                ${item.rating ? `<span class="text-red-500 flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>${item.rating.toFixed(1)}</span>` : ''}
                ${item.year ? `<span>·</span><span>${item.year}</span>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
        ${list.items.length === 0 ? '<p class="col-span-full text-center text-omni-textMuted mt-10">Esta lista está vacía.</p>' : ''}
      </div>
    `;

    this.attachDragAndDrop(list);
  }

  private attachDragAndDrop(list: Playlist) {
    const container = document.getElementById('drag-container');
    if (!container) return;

    let draggedEl: HTMLElement | null = null;

    container.querySelectorAll('div[draggable="true"]').forEach(el => {
      const element = el as HTMLElement;
      
      // Click to open detailed view
      element.addEventListener('click', () => {
        // Prevent click if we are dragging
        if (element.classList.contains('opacity-50')) return;
        const itemId = element.getAttribute('data-item-id');
        const mediaItem = list.items.find(i => i.id === Number(itemId));
        if (mediaItem) mediaDrawer.open(mediaItem);
      });

      element.addEventListener('dragstart', (e) => {
        draggedEl = element;
        element.classList.add('opacity-50', 'border-omni-secondary');
        e.dataTransfer!.effectAllowed = 'move';
      });

      element.addEventListener('dragend', () => {
        element.classList.remove('opacity-50', 'border-omni-secondary');
        draggedEl = null;
        this.saveNewOrder(list);
      });

      element.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
        
        // Simple swap logic
        if (draggedEl && draggedEl !== element) {
          const rect = element.getBoundingClientRect();
          const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
          container.insertBefore(draggedEl, next ? element.nextSibling : element);
        }
      });
    });
  }

  private async saveNewOrder(list: Playlist) {
    const container = document.getElementById('drag-container');
    if (!container) return;

    const newOrder: string[] = [];
    container.querySelectorAll('div[data-item-id]').forEach(el => {
      newOrder.push(el.getAttribute('data-item-id')!);
    });

    list.manualOrder = newOrder;
    // Update local cache manually
    list.items = listService.applyManualOrder(list.items, newOrder);
    
    // Save to DB
    await listService.savePlaylist(list);
  }

  private attachModalEvents() {
    const modal = document.getElementById('modal-create')!;
    const modalContent = document.getElementById('modal-content')!;
    const btnOpen = document.getElementById('btn-create-list')!;
    const btnClose = document.getElementById('btn-close-modal')!;
    const form = document.getElementById('form-create-list')!;
    
    const isDynamicCheck = document.getElementById('input-is-dynamic') as HTMLInputElement;
    const filterInput = document.getElementById('input-list-filter') as HTMLInputElement;

    const openModal = () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
      }, 10);
    };

    const closeModal = () => {
      modal.classList.add('opacity-0');
      modalContent.classList.add('scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }, 300);
    };

    btnOpen.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    isDynamicCheck.addEventListener('change', () => {
      if (isDynamicCheck.checked) {
        filterInput.parentElement!.classList.remove('hidden');
        filterInput.required = true;
      } else {
        filterInput.parentElement!.classList.add('hidden');
        filterInput.required = false;
        filterInput.value = '';
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (document.getElementById('input-list-name') as HTMLInputElement).value;
      const category = (document.getElementById('input-list-category') as HTMLSelectElement).value as any;
      const isDynamic = isDynamicCheck.checked;
      const filterKeyword = filterInput.value;

      const newList: Playlist = {
        id: 'list-' + Date.now(),
        userId: '',
        name,
        isDynamic,
        filterKeyword,
        category,
        manualOrder: [],
        items: []
      };

      await listService.savePlaylist(newList);
      closeModal();
      (form as HTMLFormElement).reset();
      await this.loadPlaylists(); // reload lists from db
    });
  }

  destroy() {}
}
