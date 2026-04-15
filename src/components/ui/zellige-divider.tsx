import React from 'react';
import { cn } from '@/lib/utils';

export function ZelligeDivider({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-[15px] zellige-bg opacity-30 my-8", className)} />
  );
}
