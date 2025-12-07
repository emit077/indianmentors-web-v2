// Google OAuth TypeScript declarations

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleOAuthConfig) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleOAuthConfig {
  client_id: string;
  callback: (response: GoogleOAuthResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleOAuthResponse {
  credential: string;
  select_by: string;
}

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  verified_email: boolean;
}

export {};

