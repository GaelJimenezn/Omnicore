import { authService } from '../services/AuthService';
import { router } from '../core/Router';

/**
 * Navbar Component
 * Represents the top navigation bar of the application.
 */
export class Navbar {
  /**
   * Renders the HTML string for the navbar.
   * @param {string} currentPath - The current active route path.
   * @returns {string} HTML string of the navbar.
   */
  render(currentPath: string) {
    const icons = {
      home: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
      movies: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>',
      series: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>',
      games: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"></path></svg>',
      anime: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>',
      manga: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>'
    };

    return `
      <nav class="fixed top-0 left-0 right-0 h-24 bg-omni-dark/90 backdrop-blur-2xl border-b border-white/5 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-2 lg:gap-4 2xl:gap-8 px-4 lg:px-6 2xl:px-10 transition-all duration-300 font-sans">
        
        <!-- Izquierda: Logo -->
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-omni-accent to-omni-secondary flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <span class="text-white font-black text-lg">O</span>
          </div>
          <span class="text-white font-black text-2xl tracking-tighter" style="font-family: 'Inter', sans-serif;">OMNICORE</span>
        </div>

        <!-- Centro: Navegación (Grid 1fr asegura que NUNCA se encimen) -->
        <div class="hidden lg:flex items-center justify-center gap-1 2xl:gap-4 overflow-x-auto min-w-0 pb-1">
          ${this.renderNavItem('Inicio', '/', icons.home, currentPath === '/')}
          ${this.renderNavItem('Películas', '/movies', icons.movies, currentPath === '/movies')}
          ${this.renderNavItem('Series', '/series', icons.series, currentPath === '/series')}
          ${this.renderNavItem('Videojuegos', '/games', icons.games, currentPath === '/games')}
          ${this.renderNavItem('Anime', '/anime', icons.anime, currentPath === '/anime')}
          ${this.renderNavItem('Manga', '/manga', icons.manga, currentPath === '/manga')}
        </div>

        <!-- Derecha: Búsqueda Global, Listas, Perfil -->
        <div class="flex items-center justify-end gap-3 2xl:gap-4">
          
          <!-- Búsqueda: Solo icono que se expande al hacer foco -->
          <div class="relative flex justify-end items-center group">
            <div class="absolute inset-y-0 left-0 flex items-center justify-center w-10 pointer-events-none text-white/60 group-focus-within:text-omni-accent z-10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="search" placeholder="Buscar..." class="w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full pl-10 pr-0 text-transparent placeholder-transparent focus:outline-none focus:bg-white/10 focus:border-omni-accent/50 focus:w-48 2xl:focus:w-64 focus:pr-4 focus:text-white focus:placeholder-white/40 transition-all duration-300 cursor-pointer focus:cursor-text relative z-0" />
          </div>

          <!-- Mis Listas: Comprimido en icono -->
          <a href="/playlists" class="flex items-center justify-center w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-omni-accent/50 rounded-full text-white/60 hover:text-white transition-all duration-300 ${currentPath === '/playlists' ? 'text-omni-accent border-omni-accent/50 shadow-[0_0_10px_rgba(188,19,254,0.3)]' : ''}" title="Mis Listas">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
          </a>
          
          <div class="h-6 w-px bg-white/10 mx-1"></div>
          
          <!-- Perfil Integrado y Logout -->
          <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pr-2 pl-4 py-1.5 shadow-lg">
            <div class="text-right hidden sm:block">
              <p class="text-white text-sm font-bold" id="nav-username">Usuario</p>
            </div>
            
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-omni-accent to-omni-secondary p-[2px] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <div class="w-full h-full rounded-full border-2 border-omni-dark overflow-hidden">
                <img id="nav-user-avatar" src="https://ui-avatars.com/api/?name=User&background=111&color=fff" class="w-full h-full object-cover" />
              </div>
            </div>
            
            <button id="btn-logout-nav" class="p-2 ml-1 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-full transition-all" title="Cerrar Sesión">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </nav>
    `;
  }

  private renderNavItem(label: string, path: string, icon: string, active = false) {
    return `
      <a href="${path}" data-nav-link="true" class="group relative px-2 2xl:px-4 py-2 2xl:py-2.5 text-xs xl:text-sm 2xl:text-base font-bold transition-colors flex items-center gap-1 2xl:gap-2.5 ${active ? 'text-white' : 'text-omni-textMuted hover:text-white'} whitespace-nowrap">
        <span class="${active ? 'text-omni-accent' : 'text-white/40 group-hover:text-white/80'} transition-colors [&>svg]:w-4 [&>svg]:h-4 2xl:[&>svg]:w-5 2xl:[&>svg]:h-5">${icon}</span>
        ${label}
        ${active ? '<div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-omni-accent rounded-t-full shadow-[0_0_12px_var(--color-omni-accent)]"></div>' : ''}
      </a>
    `;
  }

  /**
   * Attaches event listeners after rendering the navbar.
   */
  afterRender() {
    this.updateUser();

    const logoutBtn = document.getElementById('btn-logout-nav');
    logoutBtn?.addEventListener('click', async () => {
      await authService.logout();
      router.navigate('/login');
    });

    const links = document.querySelectorAll('a[data-nav-link="true"], a[href="/playlists"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('href');
        if (path) router.navigate(path);
      });
    });
  }

  /**
   * Updates the user profile section in the navbar.
   */
  updateUser() {
    const user = authService.currentUser;
    if (user) {
      const nameEl = document.getElementById('nav-username');
      const avatarEl = document.getElementById('nav-user-avatar') as HTMLImageElement;
      
      if (nameEl) nameEl.textContent = user.username || user.displayName || 'Usuario';
      if (avatarEl) avatarEl.src = user.avatarUrl || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=111&color=fff`;
    }
  }
}

export const navbar = new Navbar();
