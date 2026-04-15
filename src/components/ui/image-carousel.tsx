"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  className?: string;
  autoPlay?: boolean;
}

export function ImageCarousel({ images, className, autoPlay = true }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, autoPlay]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className={cn("w-full h-64 bg-slate-100 flex items-center justify-center text-slate-400", className)}>
        Aucune image
      </div>
    );
  }

  return (
    <div className={cn("relative group overflow-hidden arch-border", className)}>
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, idx) => (
          <div key={idx} className="min-w-full h-full relative">
            {/* If using placehold.co or similar before DB is populated */}
            <img 
              src={src} 
              alt={`Slide ${idx}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {images.length > 1 && (
        <>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-white/50 border-none hover:bg-white/80"
            onClick={goToPrev}
          >
            <ChevronLeft className="h-6 w-6 text-mahogany" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-white/50 border-none hover:bg-white/80"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6 text-mahogany" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button 
                key={idx}
                className={cn("w-2 h-2 rounded-full transition", currentIndex === idx ? "bg-white scale-125" : "bg-white/50")}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
