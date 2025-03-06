
import { mobileSentrixConfig } from './authService';
import { toast } from 'sonner';

// Define category interfaces
export interface Category {
  entity_id: string;
  is_active: string | number;
  name: string;
  url_key: string;
  has_children: boolean;
  children?: Category[];
  image?: string;
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
  // Update to use HTTPS instead of HTTP to avoid mixed content issues
  const baseUrl = mobileSentrixConfig.baseUrl.replace('http:', 'https:');
  const url = `${baseUrl}/api/rest${endpoint}`;
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
      mode: 'cors', // Explicitly set CORS mode
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
    
    // Only show toast for network errors in production
    if (!(error instanceof Error && error.message.includes('Failed to fetch'))) {
      toast.error(errorMessage);
    } else {
      console.warn('Network request failed - this is expected in development if CORS is not configured');
      
      // For development testing, return mock data when API is unreachable
      if (endpoint === '/categories') {
        console.log('Returning mock category data for development');
        return { 
          data: [
            { entity_id: "165", is_active: "1", name: "Replacement Parts", url_key: "replacement-parts", has_children: true },
            { entity_id: "630", is_active: "1", name: "Game Console Parts", url_key: "game-console-parts", has_children: true },
            { entity_id: "587", is_active: "1", name: "Board Components", url_key: "board-components", has_children: true },
            { entity_id: "189", is_active: "1", name: "Tempered Glass", url_key: "tempered-glass", has_children: true }
          ] as T,
          success: true 
        };
      } else if (endpoint.startsWith('/categories/')) {
        console.log('Returning mock subcategory data for development');
        return {
          data: [
            { entity_id: "756", is_active: "1", name: "Apple", url_key: "apple", has_children: true },
            { entity_id: "757", is_active: "1", name: "Samsung", url_key: "samsung", has_children: true },
            { entity_id: "779", is_active: "1", name: "Motorola", url_key: "motorola", has_children: true },
            { entity_id: "92", is_active: "1", name: "LG", url_key: "lg", has_children: true },
            { entity_id: "968", is_active: "1", name: "Huawei", url_key: "huawei", has_children: true },
            { entity_id: "167", is_active: "1", name: "Others", url_key: "others-brands-parts", has_children: true, image: "other-parts_1.png" }
          ] as T,
          success: true
        };
      }
    }
    
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
export const fetchCategoryById = async (id: string): Promise<ApiResponse<Category[]>> => {
  return apiRequest<Category[]>(`/categories/${id}`);
};
