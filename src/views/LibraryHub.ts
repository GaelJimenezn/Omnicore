import { mediaService, type MediaItem } from '../services/MediaService';
import { mediaDrawer } from '../components/MediaDrawer';
import { authService } from '../services/AuthService';

export class LibraryHub {
  render() {
    return `
      <div class="min-h-screen pt-20 px-8 pb-12 animate-fade-in">
        <header class="flex justify-between items-end mb-12">
          <div>
            <h1 class="text-5xl font-bold text-white mb-2 tracking-tight">Librería</h1>
            <p class="text-omni-textMuted text-lg">Tu colección de películas, series y juegos</p>
          </div>
          <button id="logout-btn" class="text-omni-textMuted hover:text-white transition-colors">
            Cerrar Sesión
          </button>
        </header>

        <section class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6 border-l-4 border-omni-accent pl-4">Películas & Series</h2>
          <div id="movies-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <div class="col-span-full text-center text-omni-textMuted py-12">Cargando...</div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-white mb-6 border-l-4 border-omni-accent pl-4">Videojuegos</h2>
          <div id="games-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <div class="col-span-full text-center text-omni-textMuted py-12">Cargando...</div>
          </div>
        </section>
      </div>
    `;
  }

  afterRender() {
    this.loadContent();
    this.attachEvents();
  }

  private attachEvents() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        authService.logout();
      });
    }
  }

  private async loadContent() {
    try {
      const [movies, games] = await Promise.all([
        mediaService.getTrendingMovies(),
        mediaService.getTrendingGames()
      ]);

      this.renderGrid('movies-grid', movies);
      this.renderGrid('games-grid', games);
    } catch (error) {
      console.error(error);
      const mGrid = document.getElementById('movies-grid');
      if (mGrid) mGrid.innerHTML = '<div class="col-span-full text-red-500">Error al cargar contenido. Asegúrate de configurar la API Key.</div>';
    }
  }

  private renderGrid(gridId: string, items: MediaItem[]) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (items.length === 0) {
      grid.innerHTML = '<div class="col-span-full text-omni-textMuted">No hay contenido disponible.</div>';
      return;
    }

    grid.innerHTML = items.map(item => `
      <div class="media-card aspect-[2/3]" data-id="${item.id}" data-type="${gridId}">
        <img src="${item.poster}" alt="${item.title}" loading="lazy" />
        <div class="media-card-overlay flex flex-col justify-end p-4">
          <h3 class="text-white font-bold text-lg leading-tight line-clamp-2">${item.title}</h3>
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
