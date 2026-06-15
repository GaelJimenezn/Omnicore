import './index.css';
import { router } from './core/Router';
import { LoginView } from './views/LoginView';
import { LibraryHub } from './views/LibraryHub';
import { PlaylistsView } from './views/PlaylistsView';

// authService is initialized on import
router.addRoute({ path: '/login', view: LoginView, requiresAuth: false });
router.addRoute({ path: '/playlists', view: PlaylistsView, requiresAuth: true });
router.addRoute({ path: '/', view: LibraryHub, requiresAuth: true });
router.addRoute({ path: '*', view: LibraryHub, requiresAuth: true });

// Inicializar el router
document.getElementById('app')!.innerHTML = `
  <div class="min-h-screen flex items-center justify-center bg-omni-dark">
    <div class="flex flex-col items-center animate-pulse-slow">
      <div class="relative w-16 h-16 mb-6">
        <div class="absolute inset-0 border-4 border-omni-accent/20 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-omni-accent border-t-transparent rounded-full animate-spin"></div>
        <div class="absolute inset-0 border-4 border-omni-secondary border-b-transparent rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
      </div>
      <p class="text-transparent bg-clip-text bg-gradient-to-r from-omni-accent to-omni-secondary font-black tracking-[0.3em] uppercase text-xl animate-glow">OMNIHUB</p>
    </div>
  </div>
`;

// AuthService.initListener() ya fue llamado por el constructor Singleton
