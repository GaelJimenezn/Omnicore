import { appStore } from './Store';

export interface Route {
  path: string;
  view: any; // Class constructable
  requiresAuth?: boolean;
}

export class Router {
  private routes: Route[] = [];
  private currentView: any = null;
  private rootElement: HTMLElement;

  constructor(rootId: string) {
    const el = document.getElementById(rootId);
    if (!el) throw new Error(`Root element ${rootId} not found`);
    this.rootElement = el;

    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });
  }

  addRoute(route: Route) {
    this.routes.push(route);
  }

  navigate(path: string, pushState = true) {
    // Buscar la ruta que coincide
    const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '*');
    
    if (!route) {
      console.error(`Route not found for ${path}`);
      return;
    }

    // Verificar autenticación
    const { user } = appStore.get();
    if (route.requiresAuth && !user) {
      this.navigate('/login', pushState);
      return;
    }

    if (pushState) {
      window.history.pushState({}, '', path);
    }

    // Limpiar vista anterior
    if (this.currentView && typeof this.currentView.destroy === 'function') {
      this.currentView.destroy();
    }

    // Instanciar nueva vista y renderizar
    this.currentView = new route.view();
    this.rootElement.innerHTML = this.currentView.render();
    
    // Ejecutar lógica post-render
    if (typeof this.currentView.afterRender === 'function') {
      this.currentView.afterRender();
    }
  }

  init() {
    this.navigate(window.location.pathname, false);
  }
}

export const router = new Router('app');
