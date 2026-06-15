import { appStore } from '../core/Store';
import { authService } from '../services/AuthService';
import { router } from '../core/Router';
import logoUrl from '../assets/logo.svg';

export class Sidebar {
  render(currentPath: string = '/') {
    const { user } = appStore.get();
    const avatar = user?.photoURL || 'https://ui-avatars.com/api/?name=OH&background=00F0FF&color=05050A';

    return `
      <nav class="fixed left-0 top-0 bottom-0 w-24 flex flex-col items-center py-8 glass-panel z-50 border-r border-white/5 transition-all duration-300 hover:w-64 group overflow-hidden">
        
        <!-- Logo -->
        <div class="mb-12 flex items-center justify-center w-full h-16 px-4 transition-all duration-300">
          <img src="${logoUrl}" alt="Omnihub Logo" class="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-transform duration-500 group-hover:scale-105" />
        </div>

        <!-- Menu Items -->
        <div class="flex-1 w-full flex flex-col gap-6 px-4">
          ${this.renderMenuItem('Inicio', '/', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`, currentPath === '/')}
          ${this.renderMenuItem('Películas', '/movies', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>`, currentPath === '/movies')}
          ${this.renderMenuItem('Series', '/series', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`, currentPath === '/series')}
          ${this.renderMenuItem('Videojuegos', '/games', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`, currentPath === '/games')}
          ${this.renderMenuItem('Anime & Donghuas', '/anime', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`, currentPath === '/anime')}
          ${this.renderMenuItem('Mangas & Manhwas', '/manga', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`, currentPath === '/manga')}
          <div class="h-px bg-white/10 w-full my-1"></div>
          ${this.renderMenuItem('Mis Listas', '/playlists', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>`, currentPath === '/playlists')}
          
          <div class="px-4 mt-2 text-[10px] uppercase font-bold text-omni-textMuted tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Tus Favoritos</div>
          <div class="w-full flex flex-col gap-1 overflow-hidden" id="sidebar-playlists-container">
             <!-- Rendered via JS -->
          </div>
          
          <a href="/playlists" data-nav-link="true" class="relative w-full flex items-center p-3 rounded-xl text-omni-textMuted hover:bg-white/5 hover:text-white transition-all group/add">
            <div class="flex items-center justify-center w-10 flex-shrink-0 relative z-10">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span class="text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ml-0 w-0 group-hover:ml-4 group-hover:w-[120px]">
              Crear Lista
            </span>
          </a>
        </div>

        <!-- Profile / Logout -->
        <div class="mt-auto w-full px-4 border-t border-white/5 pt-6 flex flex-col items-center">
          <div class="cursor-pointer group/profile flex items-center w-full justify-start rounded-xl p-2 hover:bg-omni-hover transition-colors" id="logout-btn">
            <img src="${avatar}" class="w-12 h-12 rounded-full border-2 border-transparent group-hover/profile:border-omni-accent transition-colors flex-shrink-0" />
            <span class="font-bold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 text-omni-text ml-0 w-0 opacity-0 group-hover:ml-4 group-hover:w-[100px] group-hover:opacity-100">
              Cerrar Sesión
            </span>
          </div>
        </div>

      </nav>
    `;
  }

  private renderMenuItem(label: string, path: string, icon: string, active = false) {
    return `
      <a href="${path}" data-nav-link="true" class="relative w-full flex items-center p-3 rounded-xl transition-all duration-300 group/item ${active ? 'text-omni-text' : 'text-omni-textMuted hover:bg-white/5 hover:text-white'}">
        ${active ? '<div class="absolute left-0 top-1/4 bottom-1/4 w-1 bg-omni-accent rounded-r-full shadow-[0_0_10px_var(--color-omni-accent)]"></div>' : ''}
        <div class="flex items-center justify-center w-10 flex-shrink-0 relative z-10 transition-transform duration-300 group-hover/item:scale-110 ${active ? 'text-omni-accent drop-shadow-[0_0_8px_var(--color-omni-accent)]' : ''}">
          ${icon}
        </div>
        <span class="font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ml-0 w-0 opacity-0 group-hover:ml-4 group-hover:w-[120px] group-hover:opacity-100 ${active ? 'text-white' : ''}">
          ${label}
        </span>
      </a>
    `;
  }

  async afterRender() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        authService.logout();
      });
    }

    this.attachNavLinks();
    await this.loadUserPlaylists();
  }

  private attachNavLinks() {
    const links = document.querySelectorAll('a[data-nav-link="true"]');
    links.forEach(link => {
      // Remove previous to avoid duplicates if called multiple times
      const newLink = link.cloneNode(true);
      link.parentNode?.replaceChild(newLink, link);
      
      newLink.addEventListener('click', (e) => {
        e.preventDefault();
        const path = (newLink as HTMLAnchorElement).getAttribute('href');
        if (path) {
          router.navigate(path);
        }
      });
    });
  }

  public async loadUserPlaylists() {
    const { listService } = await import('../services/ListService');
    const playlists = await listService.getPlaylists();
    const container = document.getElementById('sidebar-playlists-container');
    if (container) {
      container.innerHTML = playlists.map(p => `
        <a href="/playlists" data-nav-link="true" class="relative w-full flex items-center p-3 rounded-xl transition-all duration-300 group/item text-omni-textMuted hover:bg-white/5 hover:text-white" title="${p.name}">
          <div class="flex items-center justify-center w-10 flex-shrink-0 relative z-10">
            <div class="w-6 h-6 rounded bg-omni-dark border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-transform duration-300 group-hover/item:scale-110">
              ${p.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <span class="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ml-0 w-0 opacity-0 group-hover:ml-4 group-hover:w-[120px] group-hover:opacity-100">
            ${p.name}
          </span>
        </a>
      `).join('');
      
      // Attach routing logic to new dynamic links
      this.attachNavLinks();
    }
  }
}

export const sidebar = new Sidebar();
