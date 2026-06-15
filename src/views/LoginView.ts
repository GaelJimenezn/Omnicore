import { authService } from '../services/AuthService';
import { appStore } from '../core/Store';

export class LoginView {
  render() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-omni-dark relative overflow-hidden">
        <!-- Decoración de fondo abstracta -->
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-omni-accent/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div class="bg-omni-panel/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/5 w-full max-w-md z-10 animate-slide-in-right">
          <div class="text-center mb-10">
            <h1 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-omni-textMuted tracking-tighter mb-2">Omnicore</h1>
            <p class="text-omni-accent font-semibold tracking-widest uppercase text-sm">by TSG_IM</p>
          </div>

          <button id="google-login-btn" class="w-full relative group btn-glow py-4 flex items-center justify-center gap-3 overflow-hidden">
            <svg class="w-6 h-6 relative z-10" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span class="relative z-10 font-bold text-lg">Acceder con Google</span>
          </button>
          
          <div class="mt-8 text-center text-sm text-omni-textMuted">
            Acceso restringido. Requiere cuenta autorizada.
          </div>
        </div>
      </div>
    `;
  }

  afterRender() {
    const btn = document.getElementById('google-login-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        authService.loginWithGoogle();
      });
    }

    // Suscribirse a cambios de estado para mostrar loading
    const unsubscribe = appStore.subscribe((state) => {
      if (state.isLoading && btn) {
        btn.innerHTML = '<span class="relative z-10 font-bold text-lg">Autenticando...</span>';
        btn.classList.add('opacity-50', 'pointer-events-none');
      }
    });

    // Guardar unsubscribe para limpiar si se destruye
    (this as any).cleanup = unsubscribe;
  }

  destroy() {
    if ((this as any).cleanup) {
      (this as any).cleanup();
    }
  }
}
