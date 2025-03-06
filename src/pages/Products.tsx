
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { ProductList } from '@/components/ProductList';
import { CategoryList } from '@/components/CategoryList';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const categoryId = searchParams.get('category_id');
  
  // Log page visit for analytics
  useEffect(() => {
    console.log('Products page visited', { categoryId, isAuthenticated });
  }, [categoryId, isAuthenticated]);
  
  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="container py-8 max-w-3xl mx-auto">
          <Card className="bg-muted/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>MobileSentrix Products</CardTitle>
              <CardDescription>
                Please authenticate on the home page to view products
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <CategoryList />
          </div>
          
          <div className="lg:col-span-3">
            <ProductList 
              categoryId={categoryId || undefined}
              title={categoryId ? 'Category Products' : 'All Products'}
              description={
                categoryId 
                  ? 'Browse products in this category' 
                  : 'Explore our complete catalog of quality parts and accessories'
              }
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Products;
