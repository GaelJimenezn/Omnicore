import heroImg from '../assets/hero.png';
import { type MediaItem } from '../services/MediaService';

export class HeroSection {
  private containerId = 'hero-section-container';

  render(_path: string = '/') {
    return `<div id="${this.containerId}" class="w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden mb-12 bg-omni-panel/50 animate-pulse border border-white/5 shadow-2xl relative">
      <div class="absolute inset-0 flex items-center justify-center text-omni-textMuted">Cargando portada...</div>
    </div>`;
  }

  update(item: MediaItem) {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const bgUrl = item.backdrop || item.poster || heroImg;
    const title = item.title;
    const description = item.overview || 'Sin descripción disponible.';
    const isGames = item.type === 'game';

    const accentClass = isGames ? 'text-omni-secondary border-omni-secondary/30 bg-omni-secondary/20 shadow-[0_0_10px_rgba(112,0,255,0.2)]' : 'text-omni-accent border-omni-accent/30 bg-omni-accent/20 shadow-[0_0_10px_rgba(0,240,255,0.2)]';

    container.innerHTML = `
      <div class="relative w-full h-full group">
        <!-- Hero Background -->
        <div class="absolute inset-0">
          <img src="${bgUrl}" onerror="this.src='${heroImg}'" alt="Featured" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[10s] ease-out opacity-60 md:opacity-100" />
          <div class="absolute inset-0 bg-gradient-to-t from-omni-dark via-omni-dark/60 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-omni-dark via-omni-dark/40 to-transparent"></div>
        </div>

        <!-- Hero Content -->
        <div class="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3">
          <div class="flex items-center gap-4 mb-4 animate-slide-up" style="animation-delay: 0.1s;">
            <span class="px-3 py-1 rounded-full ${accentClass} text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
              Trending
            </span>
            <span class="text-omni-textMuted text-sm font-medium">99% Match</span>
          </div>
          
          <h1 class="text-4xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight animate-slide-up" style="animation-delay: 0.2s;">
            ${title}
          </h1>
          
          <p class="text-base md:text-lg text-omni-textMuted mb-8 line-clamp-3 max-w-2xl font-medium drop-shadow-md animate-slide-up" style="animation-delay: 0.3s;">
            ${description}
          </p>
          
          <div class="flex flex-wrap items-center gap-4 animate-slide-up" style="animation-delay: 0.4s;">
            <button class="btn-glow flex items-center gap-3 bg-white text-black hover:text-black">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
              <span>${isGames ? 'Jugar Ahora' : 'Ver Ahora'}</span>
            </button>
            <button class="px-8 py-3 rounded-xl font-bold bg-omni-panel/80 text-white backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              Más Información
            </button>
          </div>
        </div>
      </div>
    `;
    
    container.classList.remove('animate-pulse');
  }
}

export const heroSection = new HeroSection();
