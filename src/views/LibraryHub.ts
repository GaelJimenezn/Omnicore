import { mediaService, type MediaItem } from '../services/MediaService';
import { mediaDrawer } from '../components/MediaDrawer';
import { sidebar } from '../components/Sidebar';
import { heroSection } from '../components/HeroSection';

export class LibraryHub {
  render() {
    const path = window.location.pathname;
    const showMovies = path === '/' || path === '/movies' || path === '/series';
    const showGames = path === '/' || path === '/games';
    
    // Cambiar titulo según la ruta
    let title = 'Descubre';
    if (path === '/movies') title = 'Películas';
    if (path === '/series') title = 'Series';
    if (path === '/games') title = 'Videojuegos';

    return `
      <div class="min-h-screen bg-omni-dark flex">
        ${sidebar.render(path)}
        
        <main class="flex-1 ml-24 p-8 md:p-12 lg:p-16 transition-all duration-300 relative">
          <!-- Background Ambient Glow -->
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-omni-accent/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          
          <header class="flex justify-between items-end mb-12 animate-slide-in-right">
            <div>
              <h2 class="text-omni-accent font-black tracking-[0.2em] uppercase text-sm mb-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">Nexus Access Granted</h2>
              <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">${title}</h1>
            </div>
            <div class="flex items-center gap-4">
              <div class="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-sm text-omni-textMuted hover:text-white transition-colors cursor-text">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span>Buscar en el Nexus...</span>
              </div>
            </div>
          </header>

          ${heroSection.render(path)}

          ${showMovies ? `
          <section class="mb-16 relative z-10 animate-fade-in">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <div class="w-2 h-8 bg-omni-accent rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
                Películas & Series Top
              </h2>
              <a href="#" class="text-sm font-bold text-omni-accent hover:text-white transition-colors uppercase tracking-widest">Ver todo</a>
            </div>
            <!-- Horizontal scrolling row -->
            <div id="movies-grid" class="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 -mx-2 snap-x">
              <div class="text-center text-omni-textMuted py-12 w-full animate-pulse">Cargando datos de la red...</div>
            </div>
          </section>` : ''}

          ${showGames ? `
          <section class="relative z-10 mb-16 animate-fade-in">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <div class="w-2 h-8 bg-omni-secondary rounded-full shadow-[0_0_10px_rgba(112,0,255,0.8)]"></div>
                Videojuegos Populares
              </h2>
              <a href="#" class="text-sm font-bold text-omni-secondary hover:text-white transition-colors uppercase tracking-widest">Explorar</a>
            </div>
            <!-- Horizontal scrolling row -->
            <div id="games-grid" class="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 -mx-2 snap-x">
              <div class="text-center text-omni-textMuted py-12 w-full animate-pulse">Sincronizando...</div>
            </div>
          </section>` : ''}
        </main>
      </div>
    `;
  }

  afterRender() {
    sidebar.afterRender();
    this.loadContent();
  }

  private async loadContent() {
    try {
      const path = window.location.pathname;
      const promises = [];
      
      if (path === '/' || path === '/movies' || path === '/series') {
        promises.push(mediaService.getTrendingMovies().then(res => this.renderRow('movies-grid', res)));
      } else {
        promises.push(Promise.resolve());
      }

      if (path === '/' || path === '/games') {
        promises.push(mediaService.getTrendingGames().then(res => this.renderRow('games-grid', res)));
      } else {
        promises.push(Promise.resolve());
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

    grid.innerHTML = items.map(item => `
      <div class="media-card aspect-[2/3] w-48 md:w-56 flex-shrink-0 snap-start" data-id="${item.id}" data-type="${gridId}">
        <img src="${item.poster}" alt="${item.title}" loading="lazy" />
        <div class="media-card-overlay">
          <h3 class="text-white font-bold text-lg leading-tight line-clamp-2">${item.title}</h3>
          <p class="text-omni-accent text-xs font-bold mt-2 uppercase tracking-widest">${item.rating ? '★ ' + item.rating.toFixed(1) : 'Nuevo'}</p>
        </div>
      </div>
    `).join('');

    // Attach click events
    const cards = grid.querySelectorAll('.media-card');
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
