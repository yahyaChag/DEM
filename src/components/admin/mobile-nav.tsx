"use client";

import React from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LayoutDashboard, CalendarDays, BedDouble, UtensilsCrossed, Sparkles, Image as ImageIcon, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  iconId: string;
}

const IconMap: Record<string, any> = {
  dashboard: LayoutDashboard,
  reservations: CalendarDays,
  rooms: BedDouble,
  service: UtensilsCrossed,
  cleaning: Sparkles,
  media: ImageIcon,
  settings: Settings,
};

export function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="text-mahogany" />}>
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="left" className="bg-mahogany text-white border-white/10 p-0 w-72">
          <SheetHeader className="p-6 text-left border-b border-white/10">
            <SheetTitle className="text-white font-playfair text-xl font-bold flex flex-col">
              <span className="text-gold leading-none">Diar EL Mehdi</span>
              <span className="text-[10px] text-terracotta tracking-widest uppercase mt-1">Admin</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 p-4 mt-2">
            {navItems.map((item) => {
              const Icon = IconMap[item.iconId] || LayoutDashboard;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sand/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-5 w-5 text-terracotta" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <Link 
                href="/" 
                target="_blank" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2 text-sand/60 transition-colors hover:text-white text-sm"
              >
                Voir le site public
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
