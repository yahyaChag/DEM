import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Camera, MessageSquare } from 'lucide-react';
import { ZelligeDivider } from '@/components/ui/zellige-divider';

export function Footer() {
  return (
    <footer id="contact" className="bg-mahogany text-sand relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 w-full h-[10px] zellige-bg opacity-20" />
      
      <div className="container mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Logo & About */}
          <div>
            <h3 className="font-playfair text-3xl font-bold text-gold mb-6">Diar EL Mehdi</h3>
            <p className="text-sand/80 leading-relaxed mb-6 font-thin">
              Votre havre de paix au cœur de Meknès. Découvrez l'hospitalité marocaine authentique dans un cadre traditionnel alliant confort moderne et architecture ancestrale.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition text-white">
                <Camera className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition text-white">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-xl font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-4 text-sand/90">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span>Ancienne Médina, Meknès<br/>Maroc</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-terracotta flex-shrink-0" />
                <span>+212 5 35 XX XX XX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-terracotta flex-shrink-0" />
                <span>contact@diar-el-mehdi.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-xl font-semibold text-white mb-6">Liens Rapides</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/chambres" className="text-sand/80 hover:text-gold transition">Nos Chambres</Link>
              </li>
              <li>
                <Link href="/client" className="text-sand/80 hover:text-gold transition">Portail Client</Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-sand/80 hover:text-gold transition">Accès Administrateur</Link>
              </li>
              <li>
                <a href="#" className="text-sand/80 hover:text-gold transition">Mentions Légales</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-sand/60">
          <p>&copy; {new Date().getFullYear()} Auberge Diar EL Mehdi. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
