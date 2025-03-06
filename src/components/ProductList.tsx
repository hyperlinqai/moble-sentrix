
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters, ProductFiltersState } from '@/components/ProductFilters';
import { 
  fetchProducts, 
  fetchCategories, 
  Product, 
  ProductListResponse 
} from '@/services/apiService';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface ProductListProps {
  categoryId?: string;
  title?: string;
  description?: string;
}

const initialFilters: ProductFiltersState = {
  search: '',
  manufacturer: [],
  productType: [],
  featured: false,
  premium: false,
  priceRange: {
    min: null,
    max: null
  },
  sortBy: 'newest'
};

export const ProductList: React.FC<ProductListProps> = ({ 
  categoryId, 
  title = 'All Products',
  description = 'Browse our collection of quality parts and accessories'
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductFiltersState>(initialFilters);
  const [manufacturers, setManufacturers] = useState<Array<{ id: string; name: string }>>([]);
  
  // Default product types based on API documentation
  const productTypes = [
    { id: "4", name: "Parts" },
    { id: "10", name: "Devicesystem" },
    { id: "12", name: "Macbook Parts" },
    { id: "13", name: "Game Console" },
    { id: "14", name: "Battery" },
    { id: "17", name: "Tools" },
    { id: "20", name: "Accessories" }
  ];
  
  // Parse search params on initial load
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const manufacturerParam = searchParams.get('manufacturer');
    const productTypeParam = searchParams.get('productType');
    const featuredParam = searchParams.get('featured');
    const premiumParam = searchParams.get('premium');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'newest';
    
    setFilters({
      search,
      manufacturer: manufacturerParam ? manufacturerParam.split(',') : [],
      productType: productTypeParam ? productTypeParam.split(',') : [],
      featured: featuredParam === 'true',
      premium: premiumParam === 'true',
      priceRange: {
        min: minPrice ? parseFloat(minPrice) : null,
        max: maxPrice ? parseFloat(maxPrice) : null
      },
      sortBy
    });
  }, []);
  
  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    if (filters.search) newSearchParams.set('search', filters.search);
    if (filters.manufacturer.length > 0) {
      newSearchParams.set('manufacturer', filters.manufacturer.join(','));
    }
    if (filters.productType.length > 0) {
      newSearchParams.set('productType', filters.productType.join(','));
    }
    if (filters.featured) newSearchParams.set('featured', 'true');
    if (filters.premium) newSearchParams.set('premium', 'true');
    if (filters.priceRange.min !== null) {
      newSearchParams.set('minPrice', filters.priceRange.min.toString());
    }
    if (filters.priceRange.max !== null) {
      newSearchParams.set('maxPrice', filters.priceRange.max.toString());
    }
    if (filters.sortBy !== 'newest') {
      newSearchParams.set('sortBy', filters.sortBy);
    }
    
    // Only update URL if filters have actually changed
    if (newSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(newSearchParams);
    }
  }, [filters, setSearchParams]);
  
  // Fetch products with current filters
  const {
    data: productsData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['products', categoryId, filters],
    queryFn: async () => {
      // Build API query params based on filters
      const params: Record<string, string> = {};
      
      if (categoryId) {
        params.category_id = categoryId;
      }
      
      // Additional filtering would be implemented here based on the API capabilities
      // For now, we're assuming client-side filtering for the demo
      
      const result = await fetchProducts(params);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch products');
      }
      
      return result.data;
    },
    enabled: isAuthenticated,
  });
  
  // Extract unique manufacturers from product data for filters
  useEffect(() => {
    if (productsData?.items) {
      const uniqueManufacturers = new Map<string, string>();
      
      productsData.items.forEach(product => {
        if (product.manufacturer && product.manufacturer_text) {
          uniqueManufacturers.set(product.manufacturer, product.manufacturer_text);
        }
      });
      
      const manufacturersList = Array.from(uniqueManufacturers.entries()).map(
        ([id, name]) => ({ id, name })
      );
      
      setManufacturers(manufacturersList);
    }
  }, [productsData]);
  
  // Apply client-side filters
  const filteredProducts = React.useMemo(() => {
    if (!productsData?.items) return [];
    
    return productsData.items.filter(product => {
      // Search filter
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Manufacturer filter
      if (filters.manufacturer.length > 0 && 
          product.manufacturer && 
          !filters.manufacturer.includes(product.manufacturer)) {
        return false;
      }
      
      // Product type filter
      if (filters.productType.length > 0 && 
          product.attribute_set_id && 
          !filters.productType.includes(product.attribute_set_id)) {
        return false;
      }
      
      // Featured filter
      if (filters.featured && product.featured !== "1") {
        return false;
      }
      
      // Premium filter
      if (filters.premium && product.premium !== "1") {
        return false;
      }
      
      // Price range filter
      const price = typeof product.price === 'string' 
        ? parseFloat(product.price) 
        : Number(product.price);
      
      if (filters.priceRange.min !== null && price < filters.priceRange.min) {
        return false;
      }
      
      if (filters.priceRange.max !== null && price > filters.priceRange.max) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Apply sorting
      switch (filters.sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'price_asc':
          return (parseFloat(a.price as string) || 0) - (parseFloat(b.price as string) || 0);
        case 'price_desc':
          return (parseFloat(b.price as string) || 0) - (parseFloat(a.price as string) || 0);
        case 'newest':
        default:
          // Assuming newer products have higher entity_id values
          return parseInt(b.entity_id) - parseInt(a.entity_id);
      }
    });
  }, [productsData, filters]);
  
  // Reset filters to default
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchParams({});
  };
  
  // Navigate to product detail
  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.entity_id}`);
  };
  
  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-muted/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>MobileSentrix Products</CardTitle>
          <CardDescription>
            Please authenticate to view products
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2">
          {description}
        </p>
        
        {categoryId && (
          <Button 
            variant="ghost" 
            className="mt-2 pl-0 text-muted-foreground"
            onClick={() => navigate('/products')}
          >
            ← Back to all products
          </Button>
        )}
      </div>
      
      <ProductFilters 
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        manufacturers={manufacturers}
        productTypes={productTypes}
      />
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Products
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {error instanceof Error ? error.message : 'Failed to load products'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="text-4xl">🔍</div>
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find any products matching your criteria. Try adjusting your filters or search term.
          </p>
          {Object.keys(filters).some(key => 
            key === 'search' ? filters[key as keyof ProductFiltersState] !== '' : 
            key === 'priceRange' ? 
              (filters.priceRange.min !== null || filters.priceRange.max !== null) : 
              Array.isArray(filters[key as keyof ProductFiltersState]) ? 
                (filters[key as keyof ProductFiltersState] as any[]).length > 0 : 
                Boolean(filters[key as keyof ProductFiltersState])
          ) && (
            <Button 
              onClick={handleResetFilters}
              variant="outline"
              className="mt-2"
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-sm">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.entity_id} 
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
