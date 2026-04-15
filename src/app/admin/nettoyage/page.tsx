"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Sparkles, CheckCircle2 } from 'lucide-react';

type Room = Database['public']['Tables']['rooms']['Row'];

export default function AdminCleaningPage() {
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
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();

    const channel = supabase
      .channel('public:rooms')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
        fetchRooms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('rooms')
      .update({ status: newStatus as any })
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    } else {
      toast.success("Chambre mise à jour");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair font-bold text-mahogany border-b-2 border-terracotta pb-2 inline-block">
        Gestion du Nettoyage
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {loading ? (
          <div className="col-span-3 text-center py-10">Chargement...</div>
        ) : (
          rooms.map(room => (
            <Card key={room.id} className={`overflow-hidden transition-all ${room.status === 'Nettoyage Requis' ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}>
              <div className={`h-2 w-full ${
                room.status === 'Disponible' ? 'bg-green-500' : 
                room.status === 'Occupée' ? 'bg-blue-500' : 
                room.status === 'Nettoyage Requis' ? 'bg-red-500' : 'bg-gray-500'
              }`} />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{room.name}</CardTitle>
                  <StatusBadge status={room.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    variant={room.status === 'Nettoyage Requis' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => updateStatus(room.id, 'Nettoyage Requis')}
                  >
                    Sale
                  </Button>
                  <Button 
                    variant={room.status === 'Disponible' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full bg-olive hover:bg-jade hover:text-white"
                    onClick={() => updateStatus(room.id, 'Disponible')}
                  >
                    Propre
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
