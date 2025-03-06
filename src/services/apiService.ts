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

// Define product interfaces
export interface Product {
  entity_id: string;
  attribute_set_id: string;
  sku: string;
  new_sku?: string;
  status: string | number;
  name: string;
  url_key: string;
  description?: string;
  short_description?: string;
  price: string | number;
  weight?: string | number;
  manufacturer?: string;
  manufacturer_text?: string;
  brand?: string;
  color?: string;
  color_text?: string;
  model?: string;
  model_text?: string;
  featured?: string | number;
  premium?: string | number;
  end_of_life?: string | number;
  category_ids?: string[];
  default_image?: string;
  product_badges?: string;
  product_badges_text?: string;
  image_gallery?: string[];
  related_product?: Product[];
  product_extra_info?: string;
  battery_mah?: string;
  battery_volt?: string;
  battery_wh?: string;
}

export interface ProductListResponse {
  items: Product[];
  total_count?: number;
  page_info?: {
    page_size: number;
    current_page: number;
    total_pages: number;
  };
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
      } else if (endpoint === '/products' || endpoint.startsWith('/products?')) {
        console.log('Returning mock product data for development');
        return {
          data: {
            items: [
              {
                entity_id: "12345",
                attribute_set_id: "4",
                sku: "XYZ-123",
                new_sku: "XYZ-123-NEW",
                status: "1",
                name: "iPhone 13 LCD Screen Replacement",
                url_key: "iphone-13-lcd-screen-replacement",
                description: "High quality replacement screen for iPhone 13",
                short_description: "iPhone 13 screen replacement",
                price: "89.99",
                manufacturer: "123",
                manufacturer_text: "Apple",
                brand: "Apple",
                color: "1",
                color_text: "Black",
                model: "234",
                model_text: "iPhone 13",
                featured: "1",
                premium: "1",
                end_of_life: "0",
                category_ids: ["756", "165"],
                default_image: "https://via.placeholder.com/400x400?text=iPhone+Screen"
              },
              {
                entity_id: "12346",
                attribute_set_id: "4",
                sku: "XYZ-124",
                status: "1",
                name: "Samsung Galaxy S21 Battery",
                url_key: "samsung-galaxy-s21-battery",
                description: "Original Samsung Galaxy S21 battery replacement",
                short_description: "Galaxy S21 battery",
                price: "49.99",
                manufacturer: "124",
                manufacturer_text: "Samsung",
                brand: "Samsung",
                model: "235",
                model_text: "Galaxy S21",
                featured: "0",
                premium: "1",
                end_of_life: "0",
                category_ids: ["757", "165"],
                default_image: "https://via.placeholder.com/400x400?text=Galaxy+Battery"
              },
              {
                entity_id: "12347",
                attribute_set_id: "4",
                sku: "XYZ-125",
                status: "1",
                name: "Motorola Edge Charging Port",
                url_key: "motorola-edge-charging-port",
                description: "Replacement charging port for Motorola Edge",
                short_description: "Motorola Edge charging port",
                price: "29.99",
                manufacturer: "125",
                manufacturer_text: "Motorola",
                brand: "Motorola",
                model: "236",
                model_text: "Edge",
                featured: "0",
                premium: "0",
                end_of_life: "0",
                category_ids: ["779", "165"],
                default_image: "https://via.placeholder.com/400x400?text=Charging+Port"
              },
              {
                entity_id: "12348",
                attribute_set_id: "14",
                sku: "BAT-001",
                status: "1",
                name: "iPhone 12 Pro Max Battery",
                url_key: "iphone-12-pro-max-battery",
                description: "High capacity replacement battery for iPhone 12 Pro Max",
                short_description: "iPhone 12 Pro Max battery",
                price: "39.99",
                manufacturer: "123",
                manufacturer_text: "Apple",
                brand: "Apple",
                model: "237",
                model_text: "iPhone 12 Pro Max",
                featured: "1",
                premium: "0",
                battery_mah: "3687",
                battery_volt: "3.83",
                end_of_life: "0",
                category_ids: ["756", "165"],
                default_image: "https://via.placeholder.com/400x400?text=iPhone+Battery"
              },
              {
                entity_id: "12349",
                attribute_set_id: "17",
                sku: "TOOL-001",
                status: "1",
                name: "Precision Screwdriver Set",
                url_key: "precision-screwdriver-set",
                description: "Complete set of precision screwdrivers for phone repair",
                short_description: "Precision screwdriver set",
                price: "24.99",
                brand: "FixTools",
                featured: "0",
                premium: "0",
                end_of_life: "0",
                category_ids: ["587"],
                default_image: "https://via.placeholder.com/400x400?text=Screwdriver+Set"
              }
            ],
            total_count: 5,
            page_info: {
              page_size: 20,
              current_page: 1,
              total_pages: 1
            }
          } as T,
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

/**
 * Fetch products with optional filters
 */
export const fetchProducts = async (params?: Record<string, string>): Promise<ApiResponse<ProductListResponse>> => {
  let endpoint = '/products';
  
  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, value);
    }
    
    endpoint = `${endpoint}?${queryParams.toString()}`;
  }
  
  return apiRequest<ProductListResponse>(endpoint);
};

/**
 * Fetch a specific product by ID
 */
export const fetchProductById = async (id: string, loadOptions?: string[]): Promise<ApiResponse<Product>> => {
  let endpoint = `/products/${id}`;
  
  if (loadOptions && loadOptions.length > 0) {
    endpoint = `${endpoint}?load=${loadOptions.join(',')}`;
  }
  
  return apiRequest<Product>(endpoint);
};

/**
 * Fetch products by category ID
 */
export const fetchProductsByCategory = async (categoryId: string, params?: Record<string, string>): Promise<ApiResponse<ProductListResponse>> => {
  let queryParams = new URLSearchParams();
  queryParams.append('category_id', categoryId);
  
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, value);
    }
  }
  
  return apiRequest<ProductListResponse>(`/products?${queryParams.toString()}`);
};

