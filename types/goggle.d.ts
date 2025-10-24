// ============================================
// PART 1.5: TYPE DECLARATIONS
// Create: types/google.d.ts
// ============================================

interface GoogleAuthResponse {
  access_token: string;
  error?: string;
  expires_in?: number;
  token_type?: string;
}

interface GoogleTokenClient {
  callback: (response: GoogleAuthResponse) => void;
  requestAccessToken: (options?: { prompt?: string }) => void;
}

interface GoogleAccounts {
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: GoogleAuthResponse) => void;
    }) => GoogleTokenClient;
  };
}

interface Window {
  google?: {
    accounts?: GoogleAccounts;
  };
}
