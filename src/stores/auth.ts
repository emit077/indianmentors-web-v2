import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => {
    // Safely parse user from localStorage
    let user = null;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        user = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
    }
    
    return {
      user,
      returnUrl: null
    };
  },
  actions: {
    async login(username: string, password: string) {
      const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

      // update pinia state
      this.user = user;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));
      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/dashboard/default');
    },
    
    async loginWithGoogle(googleUser: any) {
      try {
        // Store Google user data
        this.user = googleUser;
        localStorage.setItem('user', JSON.stringify(googleUser));
        
        // Redirect to dashboard
        router.push(this.returnUrl || '/dashboard/default');
        
        return { success: true, user: googleUser };
      } catch (error) {
        console.error('Google login error:', error);
        throw error;
      }
    },
    
    async logout() {
      // If user logged in with Google, sign out from Google as well
      if (this.user?.provider === 'google') {
        try {
          // Sign out from Google
          if (window.google && window.google.accounts) {
            window.google.accounts.id.disableAutoSelect();
          }
        } catch (error) {
          console.error('Google sign out error:', error);
        }
      }
      
      this.user = null;
      localStorage.removeItem('user');
      router.push('/auth/login1');
    },
    
    // Check if user is authenticated
    isAuthenticated() {
      return !!this.user;
    },
    
    // Get user info
    getUser() {
      return this.user;
    }
  }
});
