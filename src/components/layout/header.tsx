"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Nos Chambres', href: '/chambres' },
    { name: 'Service Client', href: '/client' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-terracotta/20 bg-cream/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          {/* Logo - Decorative font */}
          <Link href="/" className="flex flex-col">
            <span className="font-playfair text-3xl font-bold text-mahogany leading-none">Diar EL Mehdi</span>
            <span className="text-xs text-terracotta tracking-widest uppercase">Auberge de Charme</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-mahogany/80 hover:text-terracotta transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all group-hover:w-full"></span>
            </Link>
          ))}
          <Link href="/chambres" passHref>
            <Button className="bg-terracotta hover:bg-mahogany text-white rounded-full px-6">
              Réserver
            </Button>
          </Link>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-mahogany">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu principal</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-cream border-l border-terracotta/20 flex flex-col pt-20">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-playfair font-semibold text-mahogany hover:text-terracotta transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="mt-8">
                  <Link href="/chambres" passHref onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-terracotta hover:bg-mahogany text-white h-12 text-lg">
                      Réserver votre séjour
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-terracotta/40 via-gold/40 to-terracotta/40" />
    </header>
  );
}
