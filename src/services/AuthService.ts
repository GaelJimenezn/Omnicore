import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { auth } from '../core/firebase.config';
import { appStore } from '../core/Store';
import { router } from '../core/Router';

/**
 * AuthService
 * Handles authentication logic via Firebase or mock mode.
 */
export class AuthService {
  private static instance: AuthService;
  private mockUser: any = { 
    uid: 'mock-123',
    email: 'admin@omnihub.app',
    displayName: 'admin', 
    photoURL: 'https://ui-avatars.com/api/?name=admin&background=00D1FF&color=0B0F19' 
  };

  private constructor() {
    this.initListener();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Gets the currently authenticated user from the store.
   * @returns {any} The current user object or null.
   */
  public get currentUser() {
    return appStore.get().user;
  }

  /**
   * Initializes the authentication listener.
   */
  private initListener() {
    if (auth) {
      onAuthStateChanged(auth, (user: User | null) => {
        this.handleUserState(user);
      });
    } else {
      // Mock mode
      setTimeout(() => {
        this.handleUserState(this.mockUser);
      }, 500);
    }
  }

  private isInitialized = false;

  private handleUserState(user: any) {
    appStore.set({ user, isLoading: false });
    if (!user && window.location.pathname !== '/login') {
      router.navigate('/login');
    } else if (user && window.location.pathname === '/login') {
      router.navigate('/');
    } else if (!this.isInitialized) {
      router.init();
    }
    this.isInitialized = true;
  }

  async login(email: string, pass: string) {
    appStore.set({ isLoading: true });
    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        // Mock Login
        setTimeout(() => {
          this.mockUser = { 
            uid: 'mock-123',
            email,
            displayName: email.split('@')[0], 
            photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=00D1FF&color=0B0F19` 
          };
          this.handleUserState(this.mockUser);
        }, 800);
      }
    } catch (error: any) {
      console.error('Error logging in', error);
      // Fallback: If user not found, register them (useful for demo/private setup)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        this.register(email, pass);
      } else {
        appStore.set({ isLoading: false });
        alert('Error de acceso: ' + error.message);
      }
    }
  }

  async register(email: string, pass: string) {
    try {
      if (auth) {
        await createUserWithEmailAndPassword(auth, email, pass);
      }
      // state will be handled by listener
    } catch (error: any) {
      console.error('Error registering', error);
      appStore.set({ isLoading: false });
      alert('Error de registro: ' + error.message);
    }
  }

  async logout() {
    try {
      if (auth) {
        await signOut(auth);
      } else {
        this.mockUser = null;
        this.handleUserState(null);
      }
    } catch (error) {
      console.error('Error logging out', error);
    }
  }
}

export const authService = AuthService.getInstance();
