import heroImg from '../assets/hero.png';

export class HeroSection {
  render(path: string = '/') {
    const isGames = path === '/games';
    const isSeries = path === '/series';
    
    let bgUrl = 'https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtec8Oobm7sS.jpg'; // Movie default (Godzilla)
    let title = 'Godzilla Minus One';
    let description = 'Japón, devastado tras la guerra, se enfrenta a una nueva amenaza en forma de Godzilla. ¿Cómo sobrevivirá la población a esta crisis sin precedentes?';

    if (isGames) {
      bgUrl = 'https://image.api.playstation.com/vulcan/ap/rnd/202010/0222/b3b19280145c11d29faec5087e6fa50e93cd1e309207e602.jpg';
      title = 'Cyberpunk 2077';
      description = 'Entra en el inmenso mundo abierto de Night City, una megalópolis obsesionada con el poder, el glamur y la modificación corporal. Conviértete en un mercenario cyberpunk y construye tu leyenda.';
    } else if (isSeries) {
      bgUrl = 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg'; // Stranger Things
      title = 'Stranger Things';
      description = 'A raíz de la desaparición de un niño, un pueblo desvela un misterio relacionado con experimentos secretos, fuerzas sobrenaturales aterradoras y una niña muy extraña.';
    }

    const accentClass = isGames ? 'text-omni-secondary border-omni-secondary/30 bg-omni-secondary/20 shadow-[0_0_10px_rgba(112,0,255,0.2)]' : 'text-omni-accent border-omni-accent/30 bg-omni-accent/20 shadow-[0_0_10px_rgba(0,240,255,0.2)]';

    return `
      <div class="relative w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden mb-12 animate-fade-in group shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-omni-panel">
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
  }
}

export const heroSection = new HeroSection();
