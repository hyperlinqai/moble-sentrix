
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
    
    try {
      const isAuthenticated = await authService.checkAuthStatus();
      
      setAuthState({
        isAuthenticated,
        isLoading: false,
        error: null,
        userData: isAuthenticated ? { provider: 'MobileSentrix' } : null
      });
      
      if (isAuthenticated) {
        toast.success('Authentication successful');
      }
      
      return isAuthenticated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication check failed';
      
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
    
    try {
      authService.authenticate();
      // We don't immediately update the state here as the authentication
      // happens in a popup window. In a complete implementation, we would
      // use a callback or window messaging to update the state.
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      
      toast.error(errorMessage);
    }
  }, []);
  
  // Effect to check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);
  
  return {
    ...authState,
    login,
    checkAuthentication
  };
}
