import { defineStore } from 'pinia';
import { router } from '@/router';
import { api } from '@/utils/api/axios';
import URLS from '@/utils/urls';

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
    /**
     * Step 1: Send login credentials to receive OTP
     * @param username - Email or mobile number
     * @param password - User password
     */
    async sendLoginOTP(username: string, password: string) {
      try {
        // Use axios instance directly to access response headers
        const axiosInstance = api.getInstance();
        const response = await axiosInstance.post<{
          message?: string;
          email?: string;
          mobile?: string;
          masked_email?: string;
          masked_phone?: string;
        }>(URLS.USER_LOGIN, {
          username, // Can be email or mobile
          password
        });

        // Extract OTP-TOKEN from response headers (case-insensitive)
        const otpToken = response.headers['otp-token'] || 
                        response.headers['OTP-TOKEN'] || 
                        response.headers['otp_token'] ||
                        (response.headers as any)['Otp-Token'];

        // Extract response data (handle both wrapped and direct responses)
        const responseData = (response.data as any)?.result || response.data;

        // Store pending login info for OTP verification
        this.pendingLogin = {
          email: responseData?.email || responseData?.masked_email,
          mobile: responseData?.mobile || responseData?.masked_phone,
          username,
          otpToken: otpToken as string
        };

        // Store in sessionStorage as backup
        sessionStorage.setItem('pendingLogin', JSON.stringify(this.pendingLogin));

        return {
          success: true,
          message: responseData?.message || 'OTP sent successfully',
          email: responseData?.email || responseData?.masked_email,
          mobile: responseData?.mobile || responseData?.masked_phone
        };
      } catch (error: any) {
        throw error;
      }
    },

    /**
     * Step 2: Verify OTP and complete login
     * @param otp - OTP code entered by user
     * @param otpToken - Optional OTP token (if not provided, will use from pendingLogin)
     */
    async verifyOTP(otp: string, otpToken?: string) {
      try {
        // Get pending login info
        const pendingLogin = this.pendingLogin || JSON.parse(sessionStorage.getItem('pendingLogin') || '{}');

        if (!pendingLogin.username) {
          throw new Error('No pending login found. Please login again.');
        }

        // Prepare verification payload
        // For mobile login, use mobile; for email login, use username
        const verifyPayload: any = {
          otp: otp
        };

        if (pendingLogin.mobile || pendingLogin.masked_phone) {
          // Mobile login - use mobile number
          verifyPayload.mobile = pendingLogin.username; // username is the mobile number
        } else {
          // Email login - use username/email
          verifyPayload.username = pendingLogin.username;
        }

        // Get OTP-TOKEN from parameter or pending login
        const token = otpToken || pendingLogin.otpToken;

        if (!token) {
          throw new Error('OTP token not found. Please login again.');
        }

        // Use axios instance directly to set custom headers
        const axiosInstance = api.getInstance();
        const response = await axiosInstance.post<{
          token?: string;
          user?: any;
          message?: string;
        }>(URLS.USER_VERIFY_OTP, verifyPayload, {
          headers: {
            'OTP-TOKEN': token
          }
        });

        // Extract response data (handle both wrapped and direct responses)
        const responseData = (response.data as any)?.result || response.data;

        // Create user object with token
        const user = {
          ...(responseData?.user || responseData),
          token: responseData?.token || responseData?.access_token
        };

        // Update pinia state
        this.user = user;
        
        // Store user details and jwt in local storage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Clear pending login
        this.pendingLogin = null;
        sessionStorage.removeItem('pendingLogin');

        // Redirect to previous url or default to home page
        router.push(this.returnUrl || '/dashboard/default');

        return {
          success: true,
          user,
          message: responseData?.message || 'Login successful'
        };
      } catch (error: any) {
        throw error;
      }
    },

    /**
     * Send OTP to mobile number (without password)
     * @param mobileNumber - Mobile number (with country code, e.g., +919876543210)
     */
    async sendMobileOTP(mobileNumber: string) {
      try {
        const axiosInstance = api.getInstance();
        const response = await axiosInstance.post<{
          mobile?: string;
        }>(URLS.USER_LOGIN, {
          // No password for mobile OTP login
          mobile: mobileNumber
        });
        const otpToken = response.headers['OTP_TOKEN'] || response.headers['otp_token'];
        console.log('otpToken', response.headers);
        
        const responseData = (response.data as any)?.result || response.data;

        return {
          success: true,
          message: responseData?.message || 'OTP sent successfully to your mobile number',
          mobile: responseData?.mobile || responseData?.masked_phone,
          otpToken: otpToken as string
        };
      } catch (error: any) {
        throw error;
      }
    },

    /**
     * Resend OTP
     * @param otpToken - Optional OTP token (if not provided, will use from pendingLogin)
     */
    async resendOTP(otpToken?: string) {
      try {
        const pendingLogin = this.pendingLogin || JSON.parse(sessionStorage.getItem('pendingLogin') || '{}');

        if (!pendingLogin.username) {
          throw new Error('No pending login found. Please login again.');
        }

        // Get OTP-TOKEN from parameter or pending login
        const token = otpToken || pendingLogin.otpToken;

        if (!token) {
          throw new Error('OTP token not found. Please login again.');
        }

        // Prepare resend payload - use mobile for mobile login, username for email login
        const resendPayload: any = {};
        
        if (pendingLogin.mobile || pendingLogin.masked_phone) {
          // Mobile login - use mobile number
          resendPayload.mobile = pendingLogin.username;
        } else {
          // Email login - use username/email
          resendPayload.username = pendingLogin.username;
        }

        // Use axios instance directly to set custom headers
        const axiosInstance = api.getInstance();
        const response = await axiosInstance.post<{
          message?: string;
          email?: string;
          mobile?: string;
          masked_email?: string;
          masked_phone?: string;
        }>(URLS.USER_RESEND_OTP, resendPayload, {
          headers: {
            'OTP-TOKEN': token
          }
        });

        // Extract response data (handle both wrapped and direct responses)
        const responseData = (response.data as any)?.result || response.data;

        return {
          success: true,
          message: responseData?.message || 'OTP resent successfully',
          email: responseData?.email || responseData?.masked_email,
          mobile: responseData?.mobile || responseData?.masked_phone
        };
      } catch (error: any) {
        throw error;
      }
    },

    /**
     * Legacy login method (without OTP) - kept for backward compatibility
     * @deprecated Use sendLoginOTP and verifyOTP instead
     */
    async login(username: string, password: string) {
      // For backward compatibility, try direct login first
      try {
        const user = await api.post(`${URLS.USER_LOGIN}`, { username, password }, {
          skipDefaultErrorHandling: true
        });

        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        router.push(this.returnUrl || '/dashboard/default');
      } catch (error: any) {
        // If direct login fails, it might require OTP
        // In that case, use the OTP flow
        throw error;
      }
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
