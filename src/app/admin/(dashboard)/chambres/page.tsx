"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';
import { Edit, Plus } from 'lucide-react';
import { toast } from 'sonner';

type Room = Database['public']['Tables']['rooms']['Row'];

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('name');
    
    if (data) setRooms(data);
    if (error) toast.error("Erreur: " + error.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, [supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) return;
    
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) {
      toast.error('Erreur lors de la suppression: ' + error.message);
    } else {
      toast.success('Chambre supprimée');
      fetchRooms();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-terracotta pb-2">
        <h1 className="text-3xl font-playfair font-bold text-mahogany">
          Configurateur de Chambres
        </h1>
        <Link href="/admin/chambres/nouvelle">
          <Button className="bg-olive hover:bg-jade text-white flex items-center gap-2">
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-10 text-center">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {rooms.map(room => (
            <Card key={room.id} className="overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-gray-100 flex-shrink-0">
                <img 
                  src={room.picture_urls[0] || 'https://placehold.co/400x400/E8D5B7/3C1518?text=Image'} 
                  alt={room.name}
                  className="w-full h-full object-cover min-h-[150px]"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-mahogany">{room.name}</h3>
                    <StatusBadge status={room.status} />
                  </div>
                  <p className="text-terracotta font-semibold mb-2">{room.price_per_night} MAD <span className="text-sm text-gray-500 font-normal">/ nuit</span></p>
                  <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(room.id)}>
                    Supprimer
                  </Button>
                  <Link href={`/admin/chambres/${room.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Edit className="h-4 w-4" /> Éditer
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
          {rooms.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-500">Aucune chambre configurée.</div>
          )}
        </div>
      )}
    </div>
  );
}
