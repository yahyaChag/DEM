import React from 'react';
import { MoroccanCard } from './moroccan-card';
import { ImageCarousel } from './image-carousel';
import { StatusBadge } from './status-badge';
import { Button } from './button';
import { Database } from '@/lib/supabase/types';
import Link from 'next/link';

type Room = Database['public']['Tables']['rooms']['Row'];

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const images = room.picture_urls.length > 0 ? room.picture_urls : ['https://placehold.co/600x400/E8D5B7/3C1518?text=Chambre'];
  
  return (
    <MoroccanCard className="p-0 flex flex-col h-full">
      <div className="h-64 relative">
        <ImageCarousel images={images} className="h-full rounded-b-none" autoPlay={false} />
        <div className="absolute top-4 right-4 z-20">
          <StatusBadge status={room.status} />
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-playfair font-bold text-mahogany">{room.name}</h3>
          <span className="text-xl font-bold text-terracotta">{room.price_per_night} MAD <span className="text-sm text-gray-500 font-normal">/ nuit</span></span>
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-3 flex-1">{room.description}</p>
        
        <div className="mt-auto">
          <Link href={`/chambres/${room.id}`} passHref>
            <Button className="w-full bg-olive hover:bg-jade text-white">
              Voir les détails & Réserver
            </Button>
          </Link>
        </div>
      </div>
    </MoroccanCard>
  );
}
