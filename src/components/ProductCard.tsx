
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/services/apiService';
import { Star, Tag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-lg border-border/40 h-full flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        {product.default_image ? (
          <img 
            src={product.default_image} 
            alt={product.name} 
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        
        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured === "1" && (
            <Badge variant="default" className="bg-amber-500">
              <Star className="mr-1 h-3 w-3" /> Featured
            </Badge>
          )}
          {product.premium === "1" && (
            <Badge variant="default" className="bg-purple-600">
              Premium
            </Badge>
          )}
          {product.end_of_life === "1" && (
            <Badge variant="destructive">
              EOL
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="flex-1 p-4">
        <div className="mb-2 flex items-center gap-2">
          {product.manufacturer_text && (
            <Badge variant="outline" className="font-normal">
              {product.manufacturer_text}
            </Badge>
          )}
          {product.model_text && (
            <Badge variant="outline" className="font-normal">
              {product.model_text}
            </Badge>
          )}
        </div>
        
        <h3 className="font-medium line-clamp-2 h-12 mb-2">{product.name}</h3>
        
        <div className="text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>SKU: {product.new_sku || product.sku}</span>
          </div>
          
          {product.attribute_set_id && (
            <div className="text-xs mt-1">
              Type: {getProductType(product.attribute_set_id)}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
        <div className="text-lg font-bold">
          ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price?.toFixed(2)}
        </div>
        
        <Badge 
          variant={product.status === "1" ? "secondary" : "outline"} 
          className="flex items-center gap-1"
        >
          {product.status === "1" ? (
            <>
              <Check className="h-3 w-3" />
              In Stock
            </>
          ) : (
            "Unavailable"
          )}
        </Badge>
      </CardFooter>
    </Card>
  );
};

// Helper function to get product type name
function getProductType(attributeSetId: string): string {
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
}
