import { mediaService, type MediaItem } from '../services/MediaService';

export class MediaDrawer {
  private container: HTMLElement | null = null;
  private currentItem: MediaItem | null = null;

  constructor() {
    this.createContainer();
  }

  private createContainer() {
    if (document.getElementById('media-drawer')) return;
    
    this.container = document.createElement('div');
    this.container.id = 'media-drawer';
    // Estilos iniciales (fuera de pantalla)
    this.container.className = 'fixed top-0 right-0 w-full md:w-[600px] h-full bg-omni-panel/95 backdrop-blur-xl border-l border-white/10 transform translate-x-full transition-transform duration-300 z-50 overflow-y-auto shadow-2xl';
    document.body.appendChild(this.container);

    // Overlay oscuro detrás del drawer
    const overlay = document.createElement('div');
    overlay.id = 'drawer-overlay';
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden opacity-0 transition-opacity duration-300';
    overlay.onclick = () => this.close();
    document.body.appendChild(overlay);
  }

  async open(item: MediaItem) {
    this.currentItem = item;
    if (!this.container) return;

    this.render();

    // Animar entrada
    requestAnimationFrame(() => {
      this.container!.classList.remove('translate-x-full');
      const overlay = document.getElementById('drawer-overlay');
      if (overlay) {
        overlay.classList.remove('hidden');
        // Pequeño delay para la transición de opacidad
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
      }
    });

    this.attachEvents();
  }

  close() {
    if (!this.container) return;
    
    this.container.classList.add('translate-x-full');
    const overlay = document.getElementById('drawer-overlay');
    if (overlay) {
      overlay.classList.add('opacity-0');
      setTimeout(() => overlay.classList.add('hidden'), 300);
    }
    
    // Limpiar iframe al cerrar
    setTimeout(() => {
      const playerContainer = document.getElementById('player-container');
      if (playerContainer) playerContainer.innerHTML = '';
    }, 300);
  }

  private render() {
    if (!this.container || !this.currentItem) return;

    const { title, backdrop, overview, type } = this.currentItem;

    this.container.innerHTML = `
      <div class="relative h-64 w-full">
        <img src="${backdrop}" alt="${title}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-omni-panel to-transparent"></div>
        <button id="close-drawer" class="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-8">
        <h2 class="text-4xl font-bold text-white mb-2">${title}</h2>
        <div class="flex items-center gap-2 mb-6 text-sm text-omni-accent font-semibold tracking-wider uppercase">
          <span>${type === 'movie' ? 'Película' : type === 'tv' ? 'Serie' : 'Juego'}</span>
        </div>
        <p class="text-omni-textMuted leading-relaxed mb-8">${overview}</p>
        
        <div class="flex gap-4 mb-8">
          ${type !== 'game' ? `<button id="play-btn" class="btn-glow flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
            Reproducir
          </button>` : `<button id="download-btn" class="btn-glow flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Descargar
          </button>`}
        </div>

        <div id="player-container" class="w-full aspect-video rounded-xl overflow-hidden bg-black hidden"></div>
      </div>
    `;
  }

  private attachEvents() {
    const closeBtn = document.getElementById('close-drawer');
    closeBtn?.addEventListener('click', () => this.close());

    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', async () => {
        if (!this.currentItem) return;
        
        playBtn.innerHTML = 'Cargando...';
        playBtn.setAttribute('disabled', 'true');

        try {
          const streamUrl = await mediaService.getStreamUrl(this.currentItem.id);
          const playerContainer = document.getElementById('player-container');
          
          if (playerContainer) {
            playerContainer.classList.remove('hidden');
            playerContainer.classList.add('animate-fade-in');
            // Sandbox estricto para evitar ads/popups
            playerContainer.innerHTML = `
              <iframe 
                src="${streamUrl}" 
                class="w-full h-full border-0" 
                allowfullscreen 
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
            `;
            // Ocultar botón después de reproducir
            playBtn.style.display = 'none';
          }
        } catch (error) {
          console.error(error);
          playBtn.innerHTML = 'Error al cargar';
        }
      });
    }

    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        alert('Lógica de descarga segura desde Firebase Firestore irá aquí.');
      });
    }
  }
}

export const mediaDrawer = new MediaDrawer();
