import './index.css';
import { router } from './core/Router';
import { LoginView } from './views/LoginView';
import { LibraryHub } from './views/LibraryHub';
// authService is initialized on import
router.addRoute({ path: '/login', view: LoginView, requiresAuth: false });
router.addRoute({ path: '/', view: LibraryHub, requiresAuth: true });
router.addRoute({ path: '*', view: LibraryHub, requiresAuth: true });

// Inicializar el router (AuthService ya escucha los cambios y redirige)
// La inicialización real del router sucederá una vez que Firebase devuelva el estado de auth
// Por defecto se mostrará algo vacío o un loader hasta que authService reciba estado
document.getElementById('app')!.innerHTML = `
  <div class="min-h-screen flex items-center justify-center bg-omni-dark">
    <div class="animate-pulse flex flex-col items-center">
      <div class="w-12 h-12 border-4 border-omni-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-omni-accent font-bold tracking-widest uppercase">Iniciando Omnicore...</p>
    </div>
  </div>
`;

// AuthService.initListener() ya fue llamado por el constructor Singleton
// Esto activará el router.navigate en cuanto sepamos si hay usuario o no.
