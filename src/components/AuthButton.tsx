
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Lock, LogIn, CheckCircle } from 'lucide-react';

interface AuthButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  isAuthenticated?: boolean;
  className?: string;
}

export const AuthButton = ({
  onClick,
  isLoading = false,
  isAuthenticated = false,
  className,
}: AuthButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Button
      variant="default"
      size="lg"
      className={cn(
        "auth-button relative px-6 py-6 rounded-xl transition-all duration-300",
        "shadow-lg group bg-gradient-to-r from-primary/90 to-primary",
        "hover:shadow-primary/30 active:scale-95",
        className
      )}
      onClick={onClick}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="animate-pulse">Authenticating...</span>
          </>
        ) : isAuthenticated ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Authenticated</span>
          </>
        ) : (
          <>
            {isHovered ? (
              <LogIn className="w-5 h-5 transition-transform duration-300 transform" />
            ) : (
              <Lock className="w-5 h-5 transition-transform duration-300 transform" />
            )}
            <span className="font-medium">Authenticate with MobileSentrix</span>
          </>
        )}
      </div>
      
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-white/10 to-transparent",
          "opacity-0 transition-opacity duration-300 group-hover:opacity-20"
        )} />
      </div>
    </Button>
  );
};
