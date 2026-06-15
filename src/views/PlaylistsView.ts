import { sidebar } from '../components/Sidebar';
import { listService, type Playlist } from '../services/ListService';

export class PlaylistsView {
  private lists: Playlist[] = [];
  private activeListId: string | null = null;

  render() {
    return `
      <div class="min-h-screen bg-omni-dark flex">
        ${sidebar.render('/playlists')}
        
        <main class="flex-1 ml-24 p-8 md:p-12 lg:p-16 transition-all duration-300 relative flex gap-8">
          <!-- Background Ambient Glow -->
          <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-omni-secondary/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
          
          <!-- Column 1: Lists Overview -->
          <div class="w-1/3 flex flex-col gap-6">
            <header class="mb-4">
              <h2 class="text-omni-secondary font-black tracking-[0.2em] uppercase text-sm mb-2 drop-shadow-[0_0_10px_rgba(112,0,255,0.5)]">Tu Biblioteca</h2>
              <h1 class="text-4xl font-black text-white tracking-tight">Mis Listas</h1>
            </header>
            
            <button id="btn-create-list" class="w-full btn-glow flex items-center justify-center gap-2 mb-4 bg-omni-panel/50 text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              <span>Crear Nueva Lista</span>
            </button>

            <div id="playlists-container" class="flex flex-col gap-4">
              <!-- Rendered via JS -->
              <div class="animate-pulse text-omni-textMuted p-4">Cargando listas...</div>
            </div>
          </div>

          <!-- Column 2: List Editor (Drag & Drop) -->
          <div class="w-2/3 glass-panel rounded-[2rem] p-8 flex flex-col relative overflow-hidden" id="list-editor">
            <div class="absolute inset-0 bg-gradient-to-b from-omni-secondary/5 to-transparent pointer-events-none"></div>
            <div class="flex flex-col h-full items-center justify-center text-omni-textMuted relative z-10" id="editor-empty">
              <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              <p>Selecciona una lista para editar o ver su contenido.</p>
            </div>
            <div id="editor-content" class="hidden flex-col h-full relative z-10">
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
    sidebar.afterRender();
    await this.loadPlaylists();
    this.attachModalEvents();
  }

  private async loadPlaylists() {
    this.lists = await listService.getPlaylists();
    this.renderPlaylistsList();
    if (this.activeListId) {
      this.openEditor(this.activeListId);
    }
  }

  private renderPlaylistsList() {
    const container = document.getElementById('playlists-container');
    if (!container) return;

    if (this.lists.length === 0) {
      container.innerHTML = '<p class="text-omni-textMuted p-4 text-center">No tienes listas aún.</p>';
      return;
    }

    container.innerHTML = this.lists.map(list => `
      <div class="p-4 rounded-xl cursor-pointer transition-all duration-300 border border-transparent hover:bg-white/5 hover:border-white/10 flex items-center justify-between group ${this.activeListId === list.id ? 'bg-white/10 border-white/20' : ''}" data-list-id="${list.id}">
        <div>
          <h3 class="text-white font-bold text-lg flex items-center gap-2">
            ${list.name}
            ${list.isDynamic ? '<span class="px-2 py-0.5 rounded bg-omni-secondary/20 text-omni-secondary text-[10px] uppercase tracking-wider">Auto</span>' : ''}
          </h3>
          <p class="text-xs text-omni-textMuted mt-1">${list.items.length} items</p>
        </div>
        <button class="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity btn-delete-list" data-list-id="${list.id}">
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
      <header class="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-black text-white mb-2">${list.name}</h2>
          <p class="text-omni-textMuted text-sm">
            ${list.isDynamic ? 'Se rellena automáticamente con: <span class="text-omni-secondary font-bold">"' + list.filterKeyword + '"</span>' : 'Lista manual'}
          </p>
        </div>
        <div class="text-sm text-omni-accent bg-omni-accent/10 px-3 py-1 rounded-full border border-omni-accent/20">
          Arrastra para ordenar
        </div>
      </header>
      
      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3" id="drag-container">
        ${list.items.map(item => `
          <div class="bg-omni-dark/40 border border-white/5 p-3 rounded-xl flex items-center gap-4 cursor-grab hover:bg-white/5 transition-colors group" draggable="true" data-item-id="${item.id}">
            <div class="text-omni-textMuted cursor-grab px-2 group-hover:text-omni-secondary transition-colors drag-handle">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
            </div>
            <img src="${item.poster}" class="w-12 h-16 object-cover rounded-lg shadow-md" />
            <div class="flex-1">
              <h4 class="text-white font-bold">${item.title}</h4>
              <p class="text-xs text-omni-textMuted capitalize">${item.type}</p>
            </div>
          </div>
        `).join('')}
        ${list.items.length === 0 ? '<p class="text-center text-omni-textMuted mt-10">La lista está vacía.</p>' : ''}
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
      const isDynamic = isDynamicCheck.checked;
      const filterKeyword = filterInput.value;

      const newList: Playlist = {
        id: 'list-' + Date.now(),
        userId: '',
        name,
        isDynamic,
        filterKeyword,
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
