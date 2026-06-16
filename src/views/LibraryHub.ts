import { mediaService, type MediaItem } from '../services/MediaService';
import { mediaDrawer } from '../components/MediaDrawer';
import { navbar } from '../components/Navbar';
import { heroSection } from '../components/HeroSection';

export class LibraryHub {
  render() {
    const path = window.location.pathname;
    const showMovies = path === '/' || path === '/movies';
    const showSeries = path === '/' || path === '/series';
    const showGames = path === '/' || path === '/games';
    const showAnime = path === '/' || path === '/anime';
    const showManga = path === '/' || path === '/manga';
    
    // Cambiar titulo según la ruta
    let title = 'Descubre';
    if (path === '/movies') title = 'Películas';
    if (path === '/series') title = 'Series';
    if (path === '/games') title = 'Videojuegos';
    if (path === '/anime') title = 'Anime & Donghuas';
    if (path === '/manga') title = 'Mangas & Manhwas';

    return `
      <div class="min-h-screen bg-omni-dark">
        ${navbar.render(path)}
        
        <main class="pt-28 pb-8 px-8 md:px-12 lg:px-16 transition-all duration-300 relative max-w-[1600px] mx-auto">
          <!-- Background Ambient Glow -->
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-omni-accent/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          
          <header class="flex justify-between items-end mb-12 animate-slide-in-right">
            <div>
              <h2 class="text-omni-accent font-black tracking-[0.2em] uppercase text-sm mb-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">Omnicore Access Granted</h2>
              <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">${title}</h1>
            </div>
            <div class="flex items-center gap-4">
              <div class="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-sm text-omni-textMuted hover:text-white transition-colors cursor-text">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span>Buscar en Omnicore...</span>
              </div>
            </div>
          </header>

          ${heroSection.render(path)}

          ${showMovies ? `
          <section class="mb-16 relative z-10 animate-fade-in">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <div class="w-2 h-8 bg-omni-accent rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
                ${path === '/' ? 'Películas Top' : 'Películas'}
              </h2>
              ${path === '/' ? `
              <div class="flex items-center gap-4">
                <div class="hidden md:flex items-center gap-2">
                  <button id="left-btn-movies" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:border-omni-accent/50 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button id="right-btn-movies" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:border-omni-accent/50 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
                <a href="/movies" data-nav-link="true" class="text-sm font-bold text-omni-accent hover:text-white transition-colors uppercase tracking-widest hidden sm:block">Ver todo</a>
              </div>
              ` : ''}
            </div>
            <div class="relative">
              <div id="movies-grid" class="${path === '/' ? 'flex gap-6 overflow-x-auto pb-8 pt-4 px-2 -mx-2 snap-x scroll-smooth hide-scrollbar' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-6 pt-4'}">
                <div class="text-center text-omni-textMuted py-12 w-full animate-pulse col-span-full">Cargando datos de la red...</div>
              </div>
            </div>
          </section>` : ''}

          ${showSeries ? `
          <section class="mb-16 relative z-10 animate-fade-in">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <div class="w-2 h-8 bg-[#00f0ff] rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
                ${path === '/' ? 'Series Top' : 'Series'}
              </h2>
              ${path === '/' ? `
              <div class="flex items-center gap-4">
                <div class="hidden md:flex items-center gap-2">
                  <button id="left-btn-series" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:border-[#00f0ff]/50 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button id="right-btn-series" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:border-[#00f0ff]/50 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
                <a href="/series" data-nav-link="true" class="text-sm font-bold text-[#00f0ff] hover:text-white transition-colors uppercase tracking-widest hidden sm:block">Ver todo</a>
              </div>
              ` : ''}
            </div>
            <div class="relative">
              <div id="series-grid" class="${path === '/' ? 'flex gap-6 overflow-x-auto pb-8 pt-4 px-2 -mx-2 snap-x scroll-smooth hide-scrollbar' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-6 pt-4'}">
                <div class="text-center text-omni-textMuted py-12 w-full animate-pulse col-span-full">Cargando series...</div>
              </div>
            </div>
          </section>` : ''}

          ${showGames ? `
          <section class="relative z-10 mb-16 animate-fade-in">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <div class="w-2 h-8 bg-omni-secondary rounded-full shadow-[0_0_10px_rgba(112,0,255,0.8)]"></div>
                Videojuegos Populares
              </h2>
              ${path === '/' ? `
              <div class="flex items-center gap-4">
                <div class="hidden md:flex items-center gap-2">
                  <button id="left-btn-games" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:border-omni-secondary/50 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button id="right-btn-games" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:border-omni-secondary/50 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
                <a href="/games" data-nav-link="true" class="text-sm font-bold text-omni-secondary hover:text-white transition-colors uppercase tracking-widest hidden sm:block">Explorar</a>
              </div>
              ` : ''}
            </div>
            <div class="relative">
              <div id="games-grid" class="${path === '/' ? 'flex gap-6 overflow-x-auto pb-8 pt-4 px-2 -mx-2 snap-x scroll-smooth hide-scrollbar' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-6 pt-4'}">
                <div class="text-center text-omni-textMuted py-12 w-full animate-pulse col-span-full">Sincronizando...</div>
              </div>
            </div>
          </section>` : ''}

          ${showAnime ? `
          <section class="relative z-10 mb-16 animate-fade-in">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <div class="w-2 h-8 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
                Anime & Donghuas
              </h2>
              ${path === '/' ? `
              <div class="flex items-center gap-4">
                <div class="hidden md:flex items-center gap-2">
                  <button id="left-btn-anime" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:border-pink-500/50 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button id="right-btn-anime" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:border-pink-500/50 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
                <a href="/anime" data-nav-link="true" class="text-sm font-bold text-pink-500 hover:text-white transition-colors uppercase tracking-widest hidden sm:block">Explorar</a>
              </div>
              ` : ''}
            </div>
            <div class="relative">
              <div id="anime-grid" class="${path === '/' ? 'flex gap-6 overflow-x-auto pb-8 pt-4 px-2 -mx-2 snap-x scroll-smooth hide-scrollbar' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-6 pt-4'}">
                <div class="text-center text-omni-textMuted py-12 w-full animate-pulse col-span-full">Cargando anime...</div>
              </div>
            </div>
          </section>` : ''}

          ${showManga ? `
          <section class="relative z-10 mb-16 animate-fade-in">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <div class="w-2 h-8 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                Mangas & Manhwas Populares
              </h2>
              ${path === '/' ? `
              <div class="flex items-center gap-4">
                <div class="hidden md:flex items-center gap-2">
                  <button id="left-btn-manga" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:border-orange-500/50 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button id="right-btn-manga" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:border-orange-500/50 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
                <a href="/manga" data-nav-link="true" class="text-sm font-bold text-orange-500 hover:text-white transition-colors uppercase tracking-widest hidden sm:block">Explorar</a>
              </div>
              ` : ''}
            </div>
            <div class="relative">
              <div id="manga-grid" class="${path === '/' ? 'flex gap-6 overflow-x-auto pb-8 pt-4 px-2 -mx-2 snap-x scroll-smooth hide-scrollbar' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-6 pt-4'}">
                <div class="text-center text-omni-textMuted py-12 w-full animate-pulse col-span-full">Cargando manga...</div>
              </div>
            </div>
          </section>` : ''}
        </main>
      </div>
    `;
  }

  private setupScroll(idPrefix: string) {
    const grid = document.getElementById(`${idPrefix}-grid`);
    const leftBtn = document.getElementById(`left-btn-${idPrefix}`);
    const rightBtn = document.getElementById(`right-btn-${idPrefix}`);

    if (grid && leftBtn && rightBtn) {
      leftBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -window.innerWidth * 0.6, behavior: 'smooth' });
      });
      rightBtn.addEventListener('click', () => {
        grid.scrollBy({ left: window.innerWidth * 0.6, behavior: 'smooth' });
      });
    }
  }

  afterRender() {
    navbar.afterRender();
    this.loadContent();
    
    setTimeout(() => {
      this.setupScroll('movies');
      this.setupScroll('series');
      this.setupScroll('games');
      this.setupScroll('anime');
      this.setupScroll('manga');
    }, 100);
  }

  private async loadContent() {
    try {
      const path = window.location.pathname;
      const promises = [];
      
      if (path === '/' || path === '/movies') {
        promises.push(mediaService.getTrendingMovies().then(res => this.renderRow('movies-grid', res)));
      }
      
      if (path === '/' || path === '/series') {
        promises.push(mediaService.getTrendingSeries().then(res => this.renderRow('series-grid', res)));
      }

      if (path === '/' || path === '/games') {
        promises.push(mediaService.getTrendingGames().then(res => this.renderRow('games-grid', res)));
      } else {
        promises.push(Promise.resolve());
      }
      
      if (path === '/' || path === '/anime') {
        promises.push(mediaService.getTrendingAnime().then(res => this.renderRow('anime-grid', res)));
      }

      if (path === '/' || path === '/manga') {
        promises.push(mediaService.getTrendingManga().then(res => this.renderRow('manga-grid', res)));
      }
      
      await Promise.all(promises);

    } catch (error) {
      console.error(error);
      const mGrid = document.getElementById('movies-grid') || document.getElementById('games-grid');
      if (mGrid) mGrid.innerHTML = `
        <div class="w-full glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 border-red-500/30">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <p class="text-omni-text font-bold text-xl">Sin conexión a la base de datos externa.</p>
          <p class="text-omni-textMuted">Configura tus API Keys (TMDB/RAWG) en el archivo .env para ver el contenido real.</p>
          <div class="mt-4 text-sm text-omni-accent animate-pulse">Mostrando interfaz en modo Demo</div>
        </div>
      `;
    }
  }

  private renderRow(gridId: string, items: MediaItem[]) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (items.length === 0) {
      grid.innerHTML = '<div class="w-full text-center text-omni-textMuted">No hay contenido disponible.</div>';
      return;
    }

    grid.innerHTML = items.map(item => {
      const displayImg = item.poster || item.backdrop;
      const rating = item.rating ? item.rating.toFixed(1) : '0.0';
      const typeLabel = item.type === 'movie' ? 'Película' : item.type === 'tv' ? 'Serie' : item.type === 'game' ? 'Juego' : item.type === 'anime' ? 'Anime' : 'Manga';
      
      return `
      <div class="media-item-container w-48 md:w-56 flex-shrink-0 snap-start group cursor-pointer" data-id="${item.id}" data-type="${gridId}">
        <div class="relative aspect-[2/3] w-full mb-3 rounded-xl overflow-hidden bg-omni-panel border border-white/5 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl">
          <img src="${displayImg}" alt="${item.title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg class="w-12 h-12 text-white transform scale-50 group-hover:scale-100 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
          </div>
        </div>
        <div class="px-1">
          <h3 class="text-white font-bold text-sm md:text-base leading-tight truncate">${item.title}</h3>
          <div class="flex items-center gap-2 mt-1 text-xs text-omni-textMuted font-medium">
            <span class="text-red-500 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              ${rating}
            </span>
            ${item.year ? `<span>·</span><span>${item.year}</span>` : ''}
            <span>·</span><span>${typeLabel}</span>
          </div>
        </div>
      </div>
      `;
    }).join('');

    // Attach click events
    const cards = grid.querySelectorAll('.media-item-container');
    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        mediaDrawer.open(items[index]);
      });
    });
  }

  destroy() {
    // Limpiar si es necesario al cambiar de vista
  }
}
