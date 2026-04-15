import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface MoroccanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MoroccanCard({ children, className, ...props }: MoroccanCardProps) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden arch-border border-border/50 bg-card shadow-md",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 w-full h-[40px] zellige-bg opacity-10" />
      <div className="relative z-10 p-6 pt-10">
        {children}
      </div>
    </Card>
  );
}
