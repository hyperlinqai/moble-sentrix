
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className }: PageLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col items-center justify-center",
      "px-4 py-12 bg-gradient-to-b from-background to-background/95",
      className
    )}>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-1/3 h-1/3 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/4 right-1/8 w-1/4 h-1/2 rounded-full bg-secondary/10 blur-3xl" />
      </div>
      
      {children}
    </div>
  );
};
