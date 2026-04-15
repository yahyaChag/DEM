export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string
          homepage_images: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          homepage_images?: string[]
          updated_at?: string
        }
        Update: {
          id?: string
          homepage_images?: string[]
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          description: string
          price_per_night: number
          features: Json
          picture_urls: string[]
          status: 'Disponible' | 'Occupée' | 'Nettoyage Requis' | 'Maintenance'
        }
        Insert: {
          id?: string
          name: string
          description: string
          price_per_night: number
          features?: Json
          picture_urls?: string[]
          status?: 'Disponible' | 'Occupée' | 'Nettoyage Requis' | 'Maintenance'
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price_per_night?: number
          features?: Json
          picture_urls?: string[]
          status?: 'Disponible' | 'Occupée' | 'Nettoyage Requis' | 'Maintenance'
        }
      }
      bookings: {
        Row: {
          id: string
          room_id: string
          guest_name: string
          guest_email: string
          guest_phone: string
          check_in: string
          check_out: string
          total_price: number
          booking_reference: string
          status: 'Confirmée' | 'En attente' | 'Annulée' | 'Arrivé' | 'Départ'
          payment_status: 'Payé' | 'En attente' | 'Échoué' | 'Paiement sur place'
        }
        Insert: {
          id?: string
          room_id: string
          guest_name: string
          guest_email: string
          guest_phone: string
          check_in: string
          check_out: string
          total_price: number
          booking_reference: string
          status?: 'Confirmée' | 'En attente' | 'Annulée' | 'Arrivé' | 'Départ'
          payment_status?: 'Payé' | 'En attente' | 'Échoué' | 'Paiement sur place'
        }
        Update: {
          id?: string
          room_id?: string
          guest_name?: string
          guest_email?: string
          guest_phone?: string
          check_in?: string
          check_out?: string
          total_price?: number
          booking_reference?: string
          status?: 'Confirmée' | 'En attente' | 'Annulée' | 'Arrivé' | 'Départ'
          payment_status?: 'Payé' | 'En attente' | 'Échoué' | 'Paiement sur place'
        }
      }
      room_service_orders: {
        Row: {
          id: string
          booking_id: string
          items: Json
          total_price: number
          status: 'Reçu' | 'En préparation' | 'Livré' | 'Annulé'
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          items: Json
          total_price: number
          status?: 'Reçu' | 'En préparation' | 'Livré' | 'Annulé'
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          items?: Json
          total_price?: number
          status?: 'Reçu' | 'En préparation' | 'Livré' | 'Annulé'
          created_at?: string
        }
      }
    }
  }
}
