
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const AuthCard = ({
  title,
  description,
  children,
  className,
  contentClassName,
}: AuthCardProps) => {
  return (
    <Card className={cn(
      "w-full max-w-md shadow-xl border border-border/50",
      "bg-card/80 backdrop-blur-sm",
      "animate-fadeIn transition-all duration-300",
      className
    )}>
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <div className="w-6 h-6 rounded-full bg-primary animate-pulse" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
        {description && (
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn("flex flex-col space-y-6", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};
