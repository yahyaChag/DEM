"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoroccanCard } from '@/components/ui/moroccan-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

export default function ClientPortalEntryPage() {
  const [reference, setReference] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.trim().startsWith('DEM-')) {
      router.push(`/client/${reference.trim()}`);
    } else {
      // Basic formatting helper
      router.push(`/client/DEM-${reference.trim().replace('DEM-', '')}`);
    }
  };

  return (
    <div className="bg-cream min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl font-bold text-mahogany mb-4">Portail Client</h1>
          <p className="text-gray-600">Accédez à votre séjour, commandez le service d'étage et plus encore.</p>
        </div>

        <MoroccanCard>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-sand/30 text-terracotta">
                <Key className="h-8 w-8" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Référence de réservation</Label>
              <Input 
                id="reference" 
                placeholder="Ex: DEM-123456" 
                required 
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                className="text-center tracking-widest uppercase font-mono text-lg"
              />
              <p className="text-xs text-gray-400 text-center mt-2">Vous trouverez ce code dans votre email de confirmation.</p>
            </div>

            <Button type="submit" className="w-full h-12 bg-olive hover:bg-jade text-white text-lg rounded-xl">
              Accéder à mon séjour
            </Button>
          </form>
        </MoroccanCard>
      </div>
    </div>
  );
}
