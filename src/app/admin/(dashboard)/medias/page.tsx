"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadToAubergeMedia, deleteFromAubergeMedia, getPublicUrl } from '@/lib/supabase/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, UploadCloud, GripVertical } from 'lucide-react';
import Image from 'next/image';

export default function AdminMediaPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createClient();

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('homepage_images')
      .single();
    const dataAny = data as any;
    if (dataAny) {
      setImages(dataAny.homepage_images || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, [supabase]);

  const saveSettings = async (newImages: string[]) => {
    const { error } = await (supabase.from('site_settings') as any)
      .update({ homepage_images: newImages, updated_at: new Date().toISOString() })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // hacky way to update since there's only 1 row

    if (error) {
      toast.error("Erreur de sauvegarde: " + error.message);
    } else {
      setImages(newImages);
      toast.success("Images mises à jour avec succès");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (images.length >= 6) {
      return toast.error("Maximum 6 images d'accueil autorisées");
    }

    setUploading(true);
    try {
      const timestamp = new Date().getTime();
      const ext = file.name.split('.').pop();
      const path = `homepage/hero-${timestamp}.${ext}`;
      
      const publicUrl = await uploadToAubergeMedia(file, path);
      saveSettings([...images, publicUrl]);
      
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploading(false);
    }
  };

  const handleDelete = async (url: string) => {
    // We could delete from bucket, but we'll just remove from array for safety and simplicity here
    // In a full prod app we should delete physical file too: 
    // const path = url.split('/').pop(); await deleteFromAubergeMedia(`homepage/${path}`);
    const newImages = images.filter(img => img !== url);
    saveSettings(newImages);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-mahogany border-b-2 border-terracotta pb-2 inline-block">
          Gestion des Médias 
        </h1>
        <p className="text-gray-500 mt-2">Gérez les images du carrousel de la page d'accueil (Max 6 images).</p>
      </div>

      {loading ? (
        <div className="py-10 text-center">Chargement...</div>
      ) : (
        <div className="space-y-8">
          {/* Upload Area */}
          <Card className="border-dashed border-2 bg-gray-50">
            <CardContent className="p-10 flex flex-col items-center justify-center">
              <UploadCloud className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4 text-center">Glissez-déposez une image ou cliquez pour parcourir</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleUpload} 
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={uploading || images.length >= 6}
                className="bg-terracotta hover:bg-mahogany text-white"
              >
                {uploading ? 'Téléchargement...' : 'Sélectionner un fichier'}
              </Button>
              {images.length >= 6 && <p className="text-red-500 text-sm mt-2">Limite de 6 images atteinte.</p>}
            </CardContent>
          </Card>

          {/* Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <div className="absolute top-2 left-2 z-10 bg-black/50 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                  {idx + 1}
                </div>
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(img)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-48 w-full relative bg-gray-100">
                  <img src={img} alt={`Homepage ${idx}`} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
