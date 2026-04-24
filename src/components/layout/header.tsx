"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Nos Chambres', href: '/chambres' },
    { name: 'Service Client', href: '/client' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-500",
        isHome && !scrolled
          ? "header-transparent border-transparent"
          : "header-solid"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span
              className={cn(
                "font-playfair text-3xl font-bold leading-none transition-colors duration-500",
                isHome && !scrolled ? "text-white" : "text-mahogany"
              )}
            >
              Diar EL Mehdi
            </span>
            <span
              className={cn(
                "text-xs tracking-widest uppercase transition-colors duration-500",
                isHome && !scrolled ? "text-gold/80" : "text-terracotta"
              )}
            >
              Auberge de Charme
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors relative group",
                isHome && !scrolled
                  ? "text-white/80 hover:text-white"
                  : "text-mahogany/70 hover:text-terracotta"
              )}
            >
              {link.name}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full",
                  isHome && !scrolled ? "bg-gold" : "bg-terracotta"
                )}
              />
            </Link>
          ))}
          <Link href="/chambres" passHref>
            <Button className="magnetic-btn bg-terracotta hover:bg-mahogany text-white rounded-full px-6 shadow-md">
              Réserver
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "transition-colors",
                    isHome && !scrolled ? "text-white hover:bg-white/10" : "text-mahogany"
                  )}
                />
              }
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu principal</span>
            </SheetTrigger>
            <SheetContent side="right" className="bg-cream border-l border-terracotta/15 flex flex-col pt-16 w-[85vw] max-w-sm">
              {/* Decorative header */}
              <div className="mb-8 px-2">
                <p className="font-playfair text-3xl font-bold text-mahogany">Diar EL Mehdi</p>
                <p className="text-xs text-terracotta tracking-widest uppercase mt-1">Auberge de Charme</p>
                <div className="mt-4 h-0.5 w-12 bg-gradient-to-r from-terracotta to-gold rounded" />
              </div>

              <nav className="flex flex-col gap-2 px-2">
                {navLinks.map((link, idx) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-4 py-3 px-4 rounded-xl text-lg font-playfair font-semibold text-mahogany hover:bg-terracotta/5 hover:text-terracotta transition-all"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <span className="w-6 h-0.5 bg-terracotta/20 group-hover:bg-terracotta group-hover:w-8 transition-all rounded" />
                    {link.name}
                  </Link>
                ))}
                <div className="mt-6">
                  <Link href="/chambres" passHref onClick={() => setIsOpen(false)}>
                    <Button className="w-full magnetic-btn bg-terracotta hover:bg-mahogany text-white h-14 text-lg rounded-xl shadow-lg">
                      Réserver votre séjour
                    </Button>
                  </Link>
                </div>
              </nav>

              {/* Bottom decorative */}
              <div className="mt-auto pb-8 px-2">
                <div className="ornament-line">
                  <span className="text-gold text-sm">✦</span>
                </div>
                <p className="text-center text-mahogany/30 text-xs mt-4">
                  Ait Rbaa — Moyen Atlas, Maroc
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom gradient border — only visible when scrolled/solid */}
      <div
        className={cn(
          "h-[2px] w-full transition-opacity duration-500",
          scrolled || !isHome
            ? "opacity-100 bg-gradient-to-r from-terracotta/30 via-gold/30 to-terracotta/30"
            : "opacity-0"
        )}
      />
    </header>
  );
}
