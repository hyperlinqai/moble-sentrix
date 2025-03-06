
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/PageLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="w-full max-w-md text-center space-y-6 animate-slideUp">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-4xl">404</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Button 
          className="mt-8 auth-button bg-primary/90 hover:bg-primary"
          size="lg" 
          asChild
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </PageLayout>
  );
};

export default NotFound;
