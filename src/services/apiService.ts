
import { mobileSentrixConfig } from './authService';
import { toast } from 'sonner';

// Define category interfaces
export interface Category {
  entity_id: string;
  is_active: number;
  name: string;
  url_key: string;
  has_children: boolean;
  children?: Category[];
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

/**
 * Generate OAuth signature for API requests
 */
const generateOAuthHeaders = (): Record<string, string> => {
  // In a production app, you would use a library like oauth-1.0a
  // to properly generate OAuth 1.0a signatures
  return {
    'Authorization': `OAuth oauth_consumer_key="${mobileSentrixConfig.consumerKey}", oauth_token="${mobileSentrixConfig.accessToken}", oauth_signature_method="HMAC-SHA1", oauth_signature="xxxxx", oauth_timestamp="xxxxx", oauth_nonce="xxxxx"`,
    'Content-Type': 'application/json',
  };
};

/**
 * Make an authenticated request to the MobileSentrix API
 */
async function apiRequest<T>(endpoint: string, method: string = 'GET', body?: any): Promise<ApiResponse<T>> {
  const url = `${mobileSentrixConfig.baseUrl}/api/rest${endpoint}`;
  const headers = generateOAuthHeaders();
  
  try {
    console.log(`Making ${method} request to: ${url}`);
    
    // In real implementation, you would:
    // 1. Generate a proper OAuth 1.0a signature with timestamp, nonce, etc.
    // 2. Include all OAuth parameters in the Authorization header
    
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    console.error('API request failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'API request failed';
    toast.error(errorMessage);
    return { data: null as unknown as T, success: false, error: errorMessage };
  }
}

/**
 * Fetch all categories from the API
 */
export const fetchCategories = async (): Promise<ApiResponse<Category[]>> => {
  return apiRequest<Category[]>('/categories');
};

/**
 * Fetch a specific category by ID
 */
export const fetchCategoryById = async (id: string): Promise<ApiResponse<Category>> => {
  return apiRequest<Category>(`/categories/${id}`);
};
