
import { useState, useEffect, useCallback } from 'react';
import { authService, AuthState } from '../services/authService';
import { toast } from 'sonner';

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  userData: null
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  
  const checkAuthentication = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    console.log('Checking authentication status...');
    
    try {
      const isAuthenticated = await authService.checkAuthStatus();
      console.log('Authentication check result:', isAuthenticated);
      
      setAuthState({
        isAuthenticated,
        isLoading: false,
        error: null,
        userData: isAuthenticated ? { provider: 'MobileSentrix' } : null
      });
      
      if (isAuthenticated) {
        toast.success('Authentication successful');
      } else {
        toast.error('Not authenticated');
      }
      
      return isAuthenticated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication check failed';
      console.error('Authentication check error:', errorMessage);
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
        userData: null
      });
      
      toast.error(errorMessage);
      return false;
    }
  }, []);
  
  const login = useCallback(() => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    console.log('Initiating authentication...');
    
    try {
      authService.authenticate();
      toast.info('Authentication window opened');
      // We don't immediately update the state here as the authentication
      // happens in a popup window. In a complete implementation, we would
      // use a callback or window messaging to update the state.
      
      // For now, let's check authentication after a delay to simulate callback
      setTimeout(() => {
        checkAuthentication();
      }, 5000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      console.error('Authentication initiation error:', errorMessage);
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      
      toast.error(errorMessage);
    }
  }, [checkAuthentication]);
  
  // Effect to check authentication on mount
  useEffect(() => {
    console.log('useAuth hook mounted, checking authentication...');
    checkAuthentication();
  }, [checkAuthentication]);
  
  return {
    ...authState,
    login,
    checkAuthentication
  };
}
