
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/PageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { fetchProductById, Product } from '@/services/apiService';
import { 
  Loader2, 
  ArrowLeft, 
  Star, 
  Tag, 
  BarChart, 
  Package, 
  Info, 
  ShoppingCart 
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    data: product,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      
      const result = await fetchProductById(id, ['image_gallery', 'related_product']);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch product');
      }
      
      return result.data;
    },
    enabled: Boolean(id),
  });
  
  useEffect(() => {
    if (isError) {
      toast.error(error instanceof Error ? error.message : 'Failed to load product details');
    }
  }, [isError, error]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleAddToCart = () => {
    toast.success(`${product?.name} added to cart`);
  };
  
  const getProductType = (attributeSetId?: string): string => {
    if (!attributeSetId) return 'Other';
    
    const types: Record<string, string> = {
      "4": "Parts",
      "10": "Devicesystem",
      "12": "Macbook Parts",
      "13": "Game Console",
      "14": "Battery",
      "17": "Tools",
      "20": "Accessories"
    };
    
    return types[attributeSetId] || "Other";
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }
  
  if (isError || !product) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-4xl">😕</div>
                <h1 className="text-2xl font-bold text-destructive">Product Not Found</h1>
                <p className="text-muted-foreground">
                  The product you're looking for doesn't exist or has been removed.
                </p>
                <Button 
                  onClick={() => navigate('/products')}
                  className="mt-4"
                >
                  Browse All Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={product.default_image || "https://via.placeholder.com/600x600?text=No+Image"} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
            
            {product.image_gallery && product.image_gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.image_gallery.map((image, index) => (
                  <div 
                    key={index} 
                    className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer border hover:border-primary transition-colors"
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - Image ${index + 1}`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline">
                  {getProductType(product.attribute_set_id)}
                </Badge>
                
                {product.manufacturer_text && (
                  <Badge variant="outline">
                    {product.manufacturer_text}
                  </Badge>
                )}
                
                {product.featured === "1" && (
                  <Badge variant="default" className="bg-amber-500">
                    <Star className="mr-1 h-3 w-3" />
                    Featured
                  </Badge>
                )}
                
                {product.premium === "1" && (
                  <Badge variant="default" className="bg-purple-600">
                    Premium
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Tag className="mr-1 h-3 w-3" />
                  SKU: {product.new_sku || product.sku}
                </div>
                
                {product.model_text && (
                  <div className="flex items-center">
                    <span className="mx-2">•</span>
                    Model: {product.model_text}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price?.toFixed(2)}
              </span>
              
              <Badge 
                variant={product.status === "1" ? "secondary" : "outline"} 
                className="ml-2"
              >
                {product.status === "1" ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full"
                disabled={product.status !== "1"}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              
              {product.short_description && (
                <div className="text-muted-foreground">
                  {product.short_description}
                </div>
              )}
            </div>
            
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p className="text-muted-foreground">No detailed description available for this product.</p>
                )}
                
                {product.product_extra_info && (
                  <div>
                    <h3 className="font-medium mb-2">Additional Information</h3>
                    <div dangerouslySetInnerHTML={{ __html: product.product_extra_info }} />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="specs" className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {product.attribute_set_id && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Product Type</span>
                      <span className="font-medium">{getProductType(product.attribute_set_id)}</span>
                    </div>
                  )}
                  
                  {product.manufacturer_text && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Manufacturer</span>
                      <span className="font-medium">{product.manufacturer_text}</span>
                    </div>
                  )}
                  
                  {product.model_text && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{product.model_text}</span>
                    </div>
                  )}
                  
                  {product.color_text && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Color</span>
                      <span className="font-medium">{product.color_text}</span>
                    </div>
                  )}
                  
                  {product.weight && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-medium">{product.weight} g</span>
                    </div>
                  )}
                  
                  {/* Battery specific fields */}
                  {product.battery_mah && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">{product.battery_mah} mAh</span>
                    </div>
                  )}
                  
                  {product.battery_volt && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Voltage</span>
                      <span className="font-medium">{product.battery_volt} V</span>
                    </div>
                  )}
                  
                  {product.battery_wh && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Watt Hours</span>
                      <span className="font-medium">{product.battery_wh} Wh</span>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="compatibility">
                <div className="py-8 text-center text-muted-foreground">
                  <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Compatibility information is loaded from the API.</p>
                  <p>Use the tags endpoint to fetch compatibility data for this product.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Products */}
        {product.related_product && product.related_product.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.related_product.map(relatedProduct => (
                <Card 
                  key={relatedProduct.entity_id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/products/${relatedProduct.entity_id}`)}
                >
                  <div className="aspect-square p-4">
                    <img 
                      src={relatedProduct.default_image || "https://via.placeholder.com/300x300?text=No+Image"} 
                      alt={relatedProduct.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <CardContent>
                    <h3 className="font-medium line-clamp-2">{relatedProduct.name}</h3>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-bold">
                        ${typeof relatedProduct.price === 'string' ? parseFloat(relatedProduct.price).toFixed(2) : relatedProduct.price?.toFixed(2)}
                      </span>
                      <Badge variant="outline" size="sm">
                        {getProductType(relatedProduct.attribute_set_id)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ProductDetail;
