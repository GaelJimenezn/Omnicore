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
    // Pantalla completa inmersiva tipo Cienby
    this.container.className = 'fixed inset-0 w-full h-full bg-[#09090b] transition-all duration-500 z-[100] overflow-y-auto overflow-x-hidden opacity-0 pointer-events-none transform scale-95';
    document.body.appendChild(this.container);
  }

  async open(item: MediaItem) {
    this.currentItem = item;
    if (!this.container) return;

    this.render();

    // Animar entrada
    requestAnimationFrame(() => {
      this.container!.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
      this.container!.classList.add('opacity-100', 'scale-100');
    });

    this.attachEvents();
    this.loadExtraDetails();
  }

  close() {
    if (!this.container) return;
    
    this.container.classList.remove('opacity-100', 'scale-100');
    this.container.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
    
    // Limpiar iframe al cerrar
    setTimeout(() => {
      const playerContainer = document.getElementById('player-container');
      if (playerContainer) playerContainer.innerHTML = '';
      this.container!.innerHTML = '';
    }, 500);
  }

  private render() {
    if (!this.container || !this.currentItem) return;

    const { title, backdrop, poster, overview, year, rating } = this.currentItem;
    const displayImg = backdrop || poster;
    const ratingStr = rating ? rating.toFixed(1) : '0.0';

    this.container.innerHTML = `
      <div class="relative w-full h-[70vh] md:h-[80vh] flex items-end">
        <!-- Backdrop Image -->
        <div class="absolute inset-0 z-0 bg-black">
          <img src="${displayImg}" class="w-full h-full object-cover opacity-60" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent"></div>
        </div>
        
        <!-- Top controls -->
        <button id="close-drawer" class="absolute top-8 left-8 z-20 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center backdrop-blur-md transition-colors text-white border border-white/10">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <!-- Main Content overlaid -->
        <div class="relative z-10 p-8 md:p-16 max-w-5xl">
          <div id="media-title-container" class="min-h-[100px] flex items-end mb-4">
            ${this.currentItem.logo ? 
              `<img src="${this.currentItem.logo}" class="max-w-[400px] max-h-[150px] object-contain drop-shadow-2xl" alt="${title}" />` 
              : `<h1 class="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-2xl" style="font-family: Impact, sans-serif;">${title}</h1>`
            }
          </div>
          
          <div class="flex items-center gap-3 text-sm md:text-base text-white/80 font-medium mb-6">
            <span class="text-red-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              ${ratingStr}
            </span>
            ${year ? `<span>·</span><span>${year}</span>` : ''}
            <span id="runtime-ph"></span>
            <span id="genre-ph"></span>
          </div>

          <p class="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl mb-10 drop-shadow-md">${overview || 'No overview available.'}</p>

          <div class="flex flex-wrap items-center gap-4">
            <button id="play-btn" class="bg-white text-black px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-white/90 transition-transform hover:scale-105 active:scale-95">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
              Play
            </button>
            <button class="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </button>
            <button class="px-6 py-3 rounded-full border border-white/20 bg-white/5 flex items-center gap-2 text-white hover:bg-white/10 transition-colors font-medium">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download
            </button>
            <button class="px-6 py-3 rounded-full border border-white/20 bg-white/5 flex items-center gap-2 text-white hover:bg-white/10 transition-colors font-medium">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              Similars
            </button>
          </div>
        </div>
      </div>

      <div class="p-8 md:px-16 pb-16 max-w-[1400px] mx-auto">
        <div id="player-container" class="w-full aspect-video rounded-xl overflow-hidden bg-black hidden mb-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"></div>
        <div id="media-extra-details"></div>
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
            playerContainer.innerHTML = `
              <iframe 
                src="${streamUrl}" 
                class="w-full h-full border-0" 
                allowfullscreen 
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
            `;
            playBtn.style.display = 'none';
            playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } catch (error) {
          console.error(error);
          playBtn.innerHTML = 'Error al cargar';
        }
      });
    }
  }

  private async loadExtraDetails() {
    if (!this.currentItem) return;
    const detailsContainer = document.getElementById('media-extra-details');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = '<div class="animate-pulse text-white/50 text-sm">Cargando detalles adicionales...</div>';

    const details = await mediaService.getMediaDetails(this.currentItem.id, this.currentItem.type);

    if (details.logo && !this.currentItem.logo) {
      const titleContainer = document.getElementById('media-title-container');
      if (titleContainer) {
        titleContainer.innerHTML = `<img src="${details.logo}" class="max-w-[500px] max-h-[180px] object-contain drop-shadow-2xl animate-fade-in" alt="Logo" />`;
      }
    }

    if (details.runtime) {
      const ph = document.getElementById('runtime-ph');
      if (ph) ph.outerHTML = `<span>·</span><span>${details.runtime}</span>`;
    }
    if (details.genre) {
      const ph = document.getElementById('genre-ph');
      if (ph) ph.outerHTML = `<span>·</span><span>${details.genre}</span>`;
    }

    let html = '';
    
    // ACTORS GRID (CIENBY STYLE)
    if (details.cast.length > 0) {
      html += `
        <div class="mb-12">
          <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div class="w-1 h-6 bg-red-600 rounded-sm"></div>
            Actors
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            ${details.cast.map(c => `
              <div class="bg-[#121214] border border-white/5 rounded-2xl p-3 flex items-center gap-4 hover:bg-[#1a1a1e] transition-colors cursor-pointer group">
                <img src="${c.profilePath}" alt="${c.name}" class="w-14 h-14 rounded-full object-cover bg-black opacity-90 group-hover:opacity-100 transition-opacity" />
                <div class="flex-1 overflow-hidden">
                  <p class="text-white text-sm font-bold truncate">${c.name}</p>
                  <p class="text-white/50 text-xs truncate">${c.character}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // PROVIDERS
    if (details.providers.length > 0) {
      html += `
        <div class="mb-12">
          <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div class="w-1 h-6 bg-red-600 rounded-sm"></div>
            Disponible en
          </h3>
          <div class="flex gap-4 flex-wrap">
            ${details.providers.map(p => `
              <div class="flex flex-col items-center gap-2 transition-transform hover:scale-105" title="${p.provider_name}">
                <img src="${p.logo_path}" alt="${p.provider_name}" class="w-14 h-14 rounded-xl shadow-lg border border-white/10" />
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (!html) {
      detailsContainer.innerHTML = '';
    } else {
      detailsContainer.innerHTML = html;
    }
  }
}

export const mediaDrawer = new MediaDrawer();
