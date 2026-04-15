"use client";

import React, { useState } from 'react';
import { login } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { MoroccanCard } from '@/components/ui/moroccan-card';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    
    // login throws redirect on success, so if it returns, it's an error
    if (result && result.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[url('https://placehold.co/100x100/C5992E/E8D5B7?text=Zellige')] opacity-5 pointer-events-none mix-blend-multiply" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl font-bold text-mahogany mb-2">Diar EL Mehdi</h1>
          <p className="text-terracotta tracking-widest uppercase text-sm">Administration</p>
        </div>

        <MoroccanCard className="p-2">
          <div className="flex justify-center mb-6 mt-4">
            <div className="p-4 rounded-full bg-cream shadow-inner text-mahogany">
              <Lock className="h-8 w-8" />
            </div>
          </div>
          
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-800 bg-red-100 rounded-lg text-center font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-mahogany">Adresse email professionnelle</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="admin@diar-el-mehdi.com" 
                required 
                className="border-terracotta/30 focus:border-terracotta focus:ring-terracotta"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-mahogany">Mot de passe</Label>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="border-terracotta/30 focus:border-terracotta focus:ring-terracotta"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-mahogany hover:bg-terracotta text-white font-medium text-lg mt-4" 
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>
        </MoroccanCard>
        
        <p className="text-center text-gray-500 text-sm mt-8">
          Accès réservé au personnel autorisé.
        </p>
      </div>
    </div>
  );
}
