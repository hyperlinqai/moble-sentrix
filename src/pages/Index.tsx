
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthButton } from '@/components/AuthButton';
import { PageLayout } from '@/components/PageLayout';
import { AuthCard } from '@/components/AuthCard';
import { StatusIndicator } from '@/components/StatusIndicator';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const { isAuthenticated, isLoading, error, login, checkAuthentication } = useAuth();

  // Log authentication status for debugging
  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, isLoading, error });
  }, [isAuthenticated, isLoading, error]);

  return (
    <PageLayout>
      <div className="max-w-screen-xl mx-auto w-full flex flex-col items-center animate-slideUp">
        <div className="flex flex-col items-center mb-10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-white" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-center">
            MobileSentrix Authentication
          </h1>
          
          <p className="text-xl text-muted-foreground text-center max-w-md">
            Seamlessly connect with MobileSentrix using OAuth authentication.
          </p>
        </div>

        <AuthCard 
          title="Authentication Status" 
          description="Verify your connection to MobileSentrix"
        >
          <div className="flex justify-center">
            <StatusIndicator 
              status={
                isLoading 
                  ? 'loading' 
                  : isAuthenticated 
                    ? 'authenticated' 
                    : 'unauthenticated'
              } 
            />
          </div>

          <Separator className="my-4" />
          
          <div className="space-y-4">
            <AuthButton 
              onClick={isAuthenticated ? checkAuthentication : login}
              isLoading={isLoading}
              isAuthenticated={isAuthenticated}
            />
            
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mt-4">
                {error}
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>
              Authentication powered by{' '}
              <a 
                href="http://www.mobilesentrix.ca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="animated-underline text-primary font-medium"
              >
                MobileSentrix
              </a>
            </p>
          </div>
        </AuthCard>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            This authentication interface is for demonstration purposes.
            <br />
            In a production environment, additional security measures would be implemented.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
