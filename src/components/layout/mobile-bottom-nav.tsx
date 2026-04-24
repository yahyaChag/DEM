"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BedDouble, CalendarCheck, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Chambres', href: '/chambres', icon: BedDouble },
  { name: 'Réserver', href: '/chambres', icon: CalendarCheck, primary: true },
  { name: 'Contact', href: '#contact', icon: Phone },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-terracotta/10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-[68px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.primary) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-terracotta to-mahogany flex items-center justify-center shadow-lg shadow-terracotta/30 active:scale-95 transition-transform">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <span className="text-[10px] mt-1 font-semibold text-terracotta">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-colors",
                isActive
                  ? "text-terracotta"
                  : "text-mahogany/40 hover:text-mahogany/70"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={cn(
                "text-[10px]",
                isActive ? "font-bold" : "font-medium"
              )}>
                {item.name}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-5 h-0.5 rounded-full bg-terracotta" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
