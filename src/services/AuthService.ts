import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { auth } from '../core/firebase.config';
import { appStore } from '../core/Store';
import { router } from '../core/Router';

export class AuthService {
  private static instance: AuthService;
  private provider: GoogleAuthProvider;

  private constructor() {
    this.provider = new GoogleAuthProvider();
    this.initListener();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initListener() {
    onAuthStateChanged(auth, (user: User | null) => {
      appStore.set({ user, isLoading: false });
      if (!user && window.location.pathname !== '/login') {
        router.navigate('/login');
      } else if (user && window.location.pathname === '/login') {
        router.navigate('/');
      }
    });
  }

  async loginWithGoogle() {
    try {
      appStore.set({ isLoading: true });
      await signInWithPopup(auth, this.provider);
    } catch (error) {
      console.error('Error logging in', error);
      appStore.set({ isLoading: false });
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out', error);
    }
  }
}

export const authService = AuthService.getInstance();
