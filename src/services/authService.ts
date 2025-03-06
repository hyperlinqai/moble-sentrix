
// Authentication service for MobileSentrix
export interface MobileSentrixConfig {
  consumerName: string;
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  baseUrl: string;
  authEndpoint: string;
  callbackUrl: string;
  authType: number;
}

// Default configuration
export const mobileSentrixConfig: MobileSentrixConfig = {
  consumerName: 'fix4youcellular',
  consumerKey: '838a1d9576b18d4b34f4e6cf1f81df99',
  consumerSecret: '8e9a9b60049398ed3f5ad524b8b44267',
  accessToken: '00a0ea4d6fe4ad8e623af27025134a45',
  accessTokenSecret: '3cba9dfd37820d35b3c2fa0e1bdd59d3',
  baseUrl: 'http://www.mobilesentrix.ca',
  authEndpoint: '/oauth/authorize/identifier',
  callbackUrl: 'https://www.fix4youcellular.com/',
  authType: 1
};

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userData: any | null;
}

export class AuthService {
  private config: MobileSentrixConfig;
  
  constructor(config: MobileSentrixConfig = mobileSentrixConfig) {
    this.config = config;
  }

  /**
   * Generate authentication URL
   */
  getAuthUrl(): string {
    const queryParams = new URLSearchParams({
      oauth_consumer_key: this.config.consumerKey,
      oauth_token: this.config.accessToken,
      oauth_callback: this.config.callbackUrl,
      auth_type: this.config.authType.toString()
    });

    return `${this.config.baseUrl}${this.config.authEndpoint}?${queryParams.toString()}`;
  }

  /**
   * Initiate authentication process
   */
  authenticate(): void {
    // Open a new window with the authentication URL
    const authUrl = this.getAuthUrl();
    const width = 600;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    
    window.open(
      authUrl,
      'MobileSentrixAuth',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  }

  /**
   * Check authentication status by making a test request
   */
  async checkAuthStatus(): Promise<boolean> {
    try {
      // In a real implementation, you'd make an API call to verify credentials
      // For this example, we'll simulate a network request
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(1500);
      
      // Simulate auth check with the provided credentials
      // In reality, you'd make a request to an endpoint that requires authentication
      const isValid = !!this.config.consumerKey && 
                    !!this.config.consumerSecret && 
                    !!this.config.accessToken && 
                    !!this.config.accessTokenSecret;
      
      return isValid;
    } catch (error) {
      console.error('Auth status check failed:', error);
      return false;
    }
  }
}

// Create and export a default instance
export const authService = new AuthService();
