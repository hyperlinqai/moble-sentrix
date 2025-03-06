
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchCategories, fetchCategoryById, Category } from '@/services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const CategoryList = () => {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [categoryPath, setCategoryPath] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async (categoryId?: string) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (categoryId) {
        result = await fetchCategoryById(categoryId);
        if (result.success && result.data) {
          setCategories(result.data);
          setCurrentCategory(categoryId);
        } else {
          setError(result.error || 'Failed to load subcategories');
          toast.error('Failed to load subcategories');
        }
      } else {
        result = await fetchCategories();
        if (result.success && result.data) {
          setCategories(result.data);
          setCurrentCategory(null);
          setCategoryPath([]);
        } else {
          setError(result.error || 'Failed to load categories');
          toast.error('Failed to load categories');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching categories');
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      loadCategories();
    }
  }, [isAuthenticated]);

  const handleCategoryClick = (category: Category) => {
    if (category.has_children) {
      setCategoryPath(prevPath => {
        if (currentCategory === null) {
          return [{ id: category.entity_id, name: category.name }];
        } else {
          return [...prevPath, { id: category.entity_id, name: category.name }];
        }
      });
      loadCategories(category.entity_id);
    }
  };

  const handleBackClick = () => {
    if (categoryPath.length > 1) {
      // Go back to previous category in path
      const newPath = [...categoryPath];
      newPath.pop();
      const previousCategory = newPath[newPath.length - 1];
      setCategoryPath(newPath);
      loadCategories(previousCategory.id);
    } else {
      // Go back to root
      setCurrentCategory(null);
      setCategoryPath([]);
      loadCategories();
    }
  };

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
        
        {/* Breadcrumb navigation */}
        {categoryPath.length > 0 && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1" 
              onClick={handleBackClick}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span 
                className="hover:text-foreground cursor-pointer" 
                onClick={() => loadCategories()}
              >
                Root
              </span>
              {categoryPath.map((item, index) => (
                <div key={item.id} className="flex items-center">
                  <ChevronRight className="h-3 w-3 mx-1" />
                  <span className={index === categoryPath.length - 1 ? "font-medium text-foreground" : "hover:text-foreground cursor-pointer"}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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
                <div 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-xs text-muted-foreground">{category.url_key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={category.is_active ? "default" : "outline"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {category.has_children && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Subcategories
                        <ChevronRight className="h-3 w-3" />
                      </Badge>
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
