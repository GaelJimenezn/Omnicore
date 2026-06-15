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
        <div class="mb-12 flex items-center justify-center w-full relative">
          <div class="flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
            <img src="${logoUrl}" alt="Omnihub Logo" class="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(134,59,255,0.8)]" />
          </div>
          <span class="absolute left-20 opacity-0 group-hover:opacity-100 text-transparent bg-clip-text bg-gradient-to-r from-omni-accent to-omni-secondary font-black tracking-widest uppercase transition-opacity duration-300 delay-100 whitespace-nowrap">
            OMNIHUB
          </span>
        </div>

        <!-- Menu Items -->
        <div class="flex-1 w-full flex flex-col gap-6 px-4">
          ${this.renderMenuItem('Inicio', '/', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`, currentPath === '/')}
          ${this.renderMenuItem('Películas', '/movies', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>`, currentPath === '/movies')}
          ${this.renderMenuItem('Series', '/series', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`, currentPath === '/series')}
          ${this.renderMenuItem('Videojuegos', '/games', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`, currentPath === '/games')}
          <div class="h-px bg-white/10 w-full my-1"></div>
          ${this.renderMenuItem('Mis Listas', '/playlists', `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>`, currentPath === '/playlists')}
        </div>

        <!-- Profile / Logout -->
        <div class="mt-auto w-full px-4 border-t border-white/5 pt-6 flex flex-col items-center">
          <div class="relative cursor-pointer group/profile flex items-center w-full justify-start overflow-hidden rounded-xl p-2 hover:bg-omni-hover transition-colors" id="logout-btn">
            <img src="${avatar}" class="w-12 h-12 rounded-full border-2 border-transparent group-hover/profile:border-omni-accent transition-colors flex-shrink-0" />
            <span class="absolute left-16 opacity-0 group-hover:opacity-100 text-omni-text font-bold text-sm whitespace-nowrap transition-opacity duration-300">
              Cerrar Sesión
            </span>
          </div>
        </div>

      </nav>
    `;
  }

  private renderMenuItem(label: string, path: string, icon: string, active = false) {
    return `
      <a href="${path}" data-nav-link="true" class="relative w-full flex items-center p-3 rounded-xl transition-all duration-300 overflow-hidden group/item ${active ? 'bg-omni-accent/10 text-omni-accent' : 'text-omni-textMuted hover:bg-omni-hover hover:text-white'}">
        ${active ? '<div class="absolute left-0 top-1/4 bottom-1/4 w-1 bg-omni-accent rounded-r-full shadow-[0_0_10px_#00F0FF]"></div>' : ''}
        <div class="flex items-center justify-center w-10 flex-shrink-0 relative z-10 transition-transform duration-300 group-hover/item:scale-110">
          ${icon}
        </div>
        <span class="absolute left-16 font-semibold opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 ${active ? 'text-omni-accent' : ''}">
          ${label}
        </span>
      </a>
    `;
  }

  afterRender() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        authService.logout();
      });
    }

    const links = document.querySelectorAll('a[data-nav-link="true"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('href');
        if (path) {
          router.navigate(path);
        }
      });
    });
  }
}

export const sidebar = new Sidebar();
