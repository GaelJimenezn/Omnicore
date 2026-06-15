import { authService } from '../services/AuthService';
import { appStore } from '../core/Store';

export class LoginView {
  render() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-omni-dark relative overflow-hidden">
        <!-- Abstract neon background -->
        <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-omni-accent/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>
        <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-omni-secondary/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" style="animation-delay: 1.5s;"></div>

        <div class="glass-panel p-10 md:p-14 rounded-[2rem] shadow-2xl w-full max-w-md z-10 animate-slide-up relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-omni-accent/5 to-omni-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div class="text-center mb-8 relative z-10">
            <h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-omni-accent to-omni-secondary tracking-tighter mb-2 drop-shadow-lg">OMNIHUB</h1>
            <p class="text-omni-textMuted font-medium tracking-[0.2em] uppercase text-xs">Acceso Privado</p>
          </div>

          <form id="login-form" class="relative z-10 flex flex-col gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-omni-textMuted uppercase tracking-widest pl-2">Email</label>
              <input type="email" id="email-input" required class="w-full bg-omni-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-omni-accent transition-colors shadow-inner" placeholder="admin@omnihub.app" />
            </div>

            <div class="flex flex-col gap-2 mb-2">
              <label class="text-xs font-bold text-omni-textMuted uppercase tracking-widest pl-2">Contraseña</label>
              <input type="password" id="pass-input" required class="w-full bg-omni-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-omni-accent transition-colors shadow-inner" placeholder="••••••••" />
            </div>

            <button type="submit" id="submit-btn" class="w-full relative btn-glow py-4 flex items-center justify-center gap-3 mt-2">
              <svg class="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
              <span class="relative z-10 font-bold text-lg tracking-wide">Desbloquear</span>
            </button>
          </form>
          
          <div class="mt-8 text-center text-[10px] text-omni-textMuted/40 uppercase tracking-widest relative z-10">
            Nexus de entretenimiento clasificado.
          </div>
        </div>
      </div>
    `;
  }

  afterRender() {
    const form = document.getElementById('login-form');
    const btn = document.getElementById('submit-btn');
    const emailInput = document.getElementById('email-input') as HTMLInputElement;
    const passInput = document.getElementById('pass-input') as HTMLInputElement;

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput?.value;
        const pass = passInput?.value;
        if (email && pass) {
          authService.login(email, pass);
        }
      });
    }

    const unsubscribe = appStore.subscribe((state) => {
      if (state.isLoading && btn) {
        btn.innerHTML = '<span class="relative z-10 font-bold text-lg tracking-wide">Verificando...</span>';
        btn.classList.add('opacity-70', 'pointer-events-none', 'animate-pulse');
      } else if (!state.isLoading && btn) {
        btn.innerHTML = '<svg class="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg><span class="relative z-10 font-bold text-lg tracking-wide">Desbloquear</span>';
        btn.classList.remove('opacity-70', 'pointer-events-none', 'animate-pulse');
      }
    });

    (this as any).cleanup = unsubscribe;
  }

  destroy() {
    if ((this as any).cleanup) {
      (this as any).cleanup();
    }
  }
}
