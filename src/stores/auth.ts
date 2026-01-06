import { defineStore } from 'pinia';

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
      returnUrl: null,
      pendingLogin: null as {
        email?: string;
        mobile?: string;
        masked_phone?: string;
        username?: string;
        otpToken?: string;
      } | null
    };
  },
  actions: {
    // Check if user is authenticated
    isAuthenticated() {
      return !!this.user;
    },
    // Get user info
    getUser() {
      return this.user;
    },
    // Set/Update user in store and localStorage
    setUser(userData: any) {
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },
    // Clear user from store and localStorage
    clearUser() {
      this.user = null;
      localStorage.removeItem('user');
    }
  }
});
