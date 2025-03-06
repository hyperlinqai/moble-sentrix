
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'authenticated' | 'unauthenticated' | 'loading';
  className?: string;
}

export const StatusIndicator = ({ status, className }: StatusIndicatorProps) => {
  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full",
      "text-sm font-medium transition-all duration-300",
      status === 'authenticated' && "bg-green-100 text-green-700",
      status === 'unauthenticated' && "bg-amber-100 text-amber-700",
      status === 'loading' && "bg-blue-100 text-blue-700",
      className
    )}>
      <div className={cn(
        "w-2 h-2 rounded-full",
        status === 'authenticated' && "bg-green-500",
        status === 'unauthenticated' && "bg-amber-500",
        status === 'loading' && "bg-blue-500 animate-pulse"
      )} />
      {status === 'authenticated' && "Authenticated"}
      {status === 'unauthenticated' && "Not Authenticated"}
      {status === 'loading' && "Checking Status..."}
    </div>
  );
};
