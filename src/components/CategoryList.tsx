
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchCategories, Category } from '@/services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const CategoryList = () => {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchCategories();
        
        if (result.success && result.data) {
          setCategories(result.data);
        } else {
          setError(result.error || 'Failed to load categories');
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching categories');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      loadCategories();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md bg-muted/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Please authenticate to view categories
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mt-6 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Categories
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
        <CardDescription>
          Browse MobileSentrix product categories
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No categories found
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.entity_id} className="group">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-xs text-muted-foreground">{category.url_key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={category.is_active ? "default" : "outline"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {category.has_children && (
                      <Badge variant="secondary">Has children</Badge>
                    )}
                  </div>
                </div>
                <Separator className="mt-2 last:hidden" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
