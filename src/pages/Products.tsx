
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { ProductList } from '@/components/ProductList';
import { useAuth } from '@/hooks/useAuth';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const categoryId = searchParams.get('category_id');
  
  // Log page visit for analytics
  useEffect(() => {
    console.log('Products page visited', { categoryId, isAuthenticated });
  }, [categoryId, isAuthenticated]);
  
  return (
    <PageLayout>
      <div className="container py-8">
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
    </PageLayout>
  );
};

export default Products;
