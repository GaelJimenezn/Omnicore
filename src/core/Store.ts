export type Listener<T> = (value: T) => void;

export class Store<T> {
  private state: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  get(): T {
    return this.state;
  }

  set(newValue: Partial<T> | ((prev: T) => Partial<T>)): void {
    const changes = typeof newValue === 'function' ? (newValue as Function)(this.state) : newValue;
    this.state = { ...this.state, ...changes };
    this.notify();
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

// Global App State
export interface AppState {
  user: any | null; // Cambiar a tipo User de Firebase cuando implementemos auth
  isLoading: boolean;
  theme: 'dark' | 'light';
}

export const appStore = new Store<AppState>({
  user: null,
  isLoading: false,
  theme: 'dark'
});
