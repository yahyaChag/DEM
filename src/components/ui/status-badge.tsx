import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type StatusType = 
  | 'Disponible' | 'Occupée' | 'Nettoyage Requis' | 'Maintenance' 
  | 'Confirmée' | 'En attente' | 'Annulée' | 'Arrivé' | 'Départ'
  | 'Payé' | 'Échoué' | 'Paiement sur place'
  | 'Reçu' | 'En préparation' | 'Livré';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      // Success / Available
      case 'Disponible':
      case 'Confirmée':
      case 'Arrivé':
      case 'Payé':
      case 'Livré':
        return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
      
      // Warning / Pending
      case 'Nettoyage Requis':
      case 'En attente':
      case 'Paiement sur place':
      case 'Reçu':
      case 'En préparation':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200';
      
      // Error / Unavailable
      case 'Occupée':
      case 'Maintenance':
      case 'Annulée':
      case 'Échoué':
        return 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200';

      // Neutral
      case 'Départ':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge variant="outline" className={cn(getStatusStyles(status), className)}>
      {status}
    </Badge>
  );
}
