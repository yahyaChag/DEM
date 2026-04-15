Plateforme Auberge "Diar EL Mehdi" — Plan d'Implémentation
Objectif
Créer une plateforme web bilingue complète (Interface utilisateur en français) pour l'auberge "Diar EL Mehdi" à Meknès, au Maroc, comprenant un site de réservation public, un tableau de bord d'administration en temps réel et un portail client pour le service d'étage. Le design doit refléter le patrimoine marocain traditionnel avec des motifs inspirés du zellige, des tons terreux et une esthétique authentique et chaleureuse.

Révision de l'Utilisateur Requise
Important : Identifiants Supabase Requis
Vous devez fournir l'URL de votre projet Supabase et la clé anonyme (et optionnellement une clé de rôle de service). Celles-ci seront stockées dans .env.local. Sans elles, l'application fonctionnera, mais toutes les fonctionnalités de base de données/authentification/stockage seront inopérantes.
Important : Bucket de Stockage Supabase
Le plan suppose que vous allez créer un bucket de stockage nommé auberge-media dans votre tableau de bord Supabase avec l'accès public activé pour les URL d'images. Alternativement, nous pouvons le créer via le client Supabase lors de la configuration.
Avertissement : Paiement Fictif Uniquement
Le flux de paiement utilise une route d'API fictive (/api/mock-pay). Aucune véritable passerelle de paiement (CMI ou autre) n'est intégrée — l'architecture est préparée pour une intégration future.
Important : Ressources de Design
Je générerai des images de couverture (hero) et des images de chambres fictives en utilisant la génération d'images par IA pour créer une démo entièrement visuelle. Celles-ci pourront être remplacées ultérieurement par de vraies photos téléchargées via le tableau de bord d'administration.
Changements Proposés
Phase 1 : Échafaudage du Projet & Outils
NOUVEAU
Initialisation du Projet Next.js
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --use-npm
Puis installez les dépendances :

npm install @supabase/supabase-js @supabase/ssr
npx shadcn@latest init
npx shadcn@latest add button card input label select dialog sheet tabs badge separator avatar dropdown-menu calendar popover toast table textarea switch scroll-area
NOUVEAU
.env.local
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (serveur uniquement, pour les opérations d'administration)
Phase 2 : Système de Design — Palette du Patrimoine Marocain
MODIFIER
tailwind.config.ts
Palette de couleurs personnalisée inspirée de l'architecture de Meknès :

Jeton	Hex	Inspiration
terracotta	#C4663A	Murs d'argile de la médina de Meknès
olive	#6B7B3A	Oliveraies entourant la ville
sand	#E8D5B7	Sable du désert, arrière-plans chaleureux
cream	#FDF6EC	Blanc chaud pour les surfaces
gold	#C5992E	Lanternes en laiton, embellissements royaux
indigo	#1E3A5F	Bleu marocain profond (zellige)
jade	#2D6A4F	Carreaux de la Médersa Bou Inania
mahogany	#3C1518	Sculptures en bois de cèdre
Jetons de design supplémentaires :

Police personnalisée : Playfair Display pour les titres (sérif, élégante), Inter pour le corps de texte
Motifs de rayon de bordure imitant les portes en arc
Système d'ombres aux tons chauds
NOUVEAU
src/styles/moroccan-patterns.css
Motifs géométriques zellige basés sur CSS utilisant background-image avec des URI de données SVG
Classes de motifs réutilisables : .zellige-bg, .arch-border, .lantern-glow
Composants séparateurs décoratifs
MODIFIER
src/app/globals.css
Importation des polices Google Fonts (Playfair Display, Inter, Amiri pour le texte décoratif arabe)
Définition des styles de base avec des arrière-plans chauds
Barre de défilement (scrollbar) personnalisée avec thème marocain
Images clés d'animation pour les effets de fondu, de glissement et de scintillement (shimmer)
Phase 3 : Configuration du Client Supabase
NOUVEAU
src/lib/supabase/client.ts
Client navigateur utilisant createBrowserClient de @supabase/ssr
NOUVEAU
src/lib/supabase/server.ts
Client serveur utilisant createServerClient avec gestion des cookies
NOUVEAU
src/lib/supabase/middleware.ts
Logique de rafraîchissement de session pour le middleware
NOUVEAU
src/middleware.ts
Protéger les routes /admin/* — redirection vers /admin/login si non authentifié
Autoriser les routes publiques (/, /chambres, /client/*)
Rafraîchir la session d'authentification Supabase à chaque requête
Phase 4 : Types & Schéma de la Base de Données
NOUVEAU
src/lib/supabase/types.ts
Types TypeScript correspondant au schéma de la base de données :

interface SiteSettings {
  id: string;
  homepage_images: string[];
  updated_at: string;
}

interface Room {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  features: Record<string, any>;
  picture_urls: string[];
  status: 'Disponible' | 'Occupée' | 'Nettoyage Requis' | 'Maintenance';
}

interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  total_price: number;
  booking_reference: string;
  status: 'Confirmée' | 'En attente' | 'Annulée' | 'Arrivé' | 'Départ';
  payment_status: 'Payé' | 'En attente' | 'Échoué' | 'Paiement sur place';
}

interface RoomServiceOrder {
  id: string;
  booking_id: string;
  items: { name: string; quantity: number; price: number }[];
  total_price: number;
  status: 'Reçu' | 'En préparation' | 'Livré' | 'Annulé';
  created_at: string;
}
NOUVEAU
supabase/schema.sql
DDL SQL complet pour toutes les tables avec indices, contraintes et politiques RLS
Données d'amorçage (Seed data) pour la ligne initiale site_settings
Politiques d'accès basées sur les rôles (les utilisateurs anonymes peuvent lire les chambres & paramètres, les administrateurs authentifiés peuvent écrire)
Phase 5 : Utilitaire de Stockage
NOUVEAU
src/lib/supabase/storage.ts
uploadToAubergeMedia(file: File, path: string): Promise<string> — télécharge vers le bucket auberge-media, retourne l'URL publique
deleteFromAubergeMedia(path: string): Promise<void> — supprime le fichier du bucket
getPublicUrl(path: string): string — construit l'URL publique
Assistant (Helper) pour générer des noms de fichiers uniques avec des horodatages
Phase 6 : Composants d'Interface Utilisateur Partagés
NOUVEAU
src/components/ui/moroccan-card.tsx
Composant de carte avec bordure supérieure en arc marocain et motif zellige subtil
NOUVEAU
src/components/layout/header.tsx
En-tête de site public avec logo "Diar EL Mehdi" dans une police décorative
Navigation : Accueil, Nos Chambres, Réserver, Contact
Menu hamburger mobile avec panneau coulissant (sheet)
NOUVEAU
src/components/layout/footer.tsx
Pied de page avec informations de l'auberge, adresse à Meknès, téléphone, email
Motif de bordure zellige en haut
Liens sociaux, mentions légales
NOUVEAU
src/components/ui/image-carousel.tsx
Carrousel d'images réactif avec lecture automatique, navigation par points
Transitions CSS avec effets de fondu/glissement
Prend en charge les tableaux d'images dynamiques depuis Supabase
NOUVEAU
src/components/ui/booking-search.tsx
Sélecteur de plage de dates (arrivée / départ)
Sélecteur de nombre de personnes
Bouton "Rechercher" → navigue vers /chambres?checkin=...&checkout=...&guests=...
NOUVEAU
src/components/ui/room-card.tsx
Carte d'affichage de chambre avec mini-carrousel de galerie d'images, nom, prix, badges de caractéristiques
Indicateur de statut
Bouton d'appel à l'action "Réserver"
NOUVEAU
src/components/ui/zellige-divider.tsx
Séparateur décoratif avec motif zellige basé sur SVG
NOUVEAU
src/components/ui/status-badge.tsx
Badges de statut avec code couleur pour les réservations, chambres, commandes (étiquettes en français)
Phase 7 : Page d'Accueil Publique (/)
NOUVEAU
src/app/page.tsx
Section Héros (Hero) : Héros plein écran avec texte superposé : "Bienvenue à Diar EL Mehdi — Votre havre de paix au cœur de Meknès"
Image d'arrière-plan provenant de site_settings.homepage_images[0] ou espace réservé (placeholder) généré
Effet de défilement parallaxe subtil
Widget de recherche de réservation superposé sur le héros
Galerie d'Images : Grille/carrousel contenant jusqu'à 6 images d'accueil depuis site_settings
Section À Propos : Paragraphe narratif sur l'auberge, l'histoire de Meknès
Aperçu des Chambres : Les 3 meilleures chambres de la base de données affichées sous forme de cartes
Témoignages (texte statique en français)
Appel à l'Action : "Réservez votre séjour"
NOUVEAU
src/app/layout.tsx
Mise en page racine (Root layout) avec en-tête, pied de page, Google Fonts, métadonnées
SEO : titre "Diar EL Mehdi — Auberge Traditionnelle à Meknès"
Méta description en français
Phase 8 : Liste & Détails des Chambres (/chambres)
NOUVEAU
src/app/chambres/page.tsx
Récupérer toutes les chambres depuis Supabase (composant serveur)
Afficher une grille de composants RoomCard
Filtrer par disponibilité en fonction des paramètres de requête de l'URL (arrivée, départ)
NOUVEAU
src/app/chambres/[id]/page.tsx
Page détaillée de la chambre avec galerie complète d'images, description, liste des caractéristiques, prix
Bouton "Réserver cette chambre" → navigue vers le flux de réservation
Phase 9 : Flux de Réservation & de Paiement
NOUVEAU
src/app/reserver/page.tsx
Formulaire multi-étapes :
Résumé : Afficher la chambre sélectionnée, les dates, le prix total
Informations : Nom du client, email, téléphone
Paiement : Choix entre "Payer par carte" et "Paiement sur place"
Générer une référence de réservation unique (ex. DEM-XXXXXX)
Insérer la réservation dans Supabase
NOUVEAU
src/app/api/mock-pay/route.ts
Point de terminaison de paiement fictif
Accepte un numéro de carte, un montant
4242424242424242 → succès (retourne { success: true })
Tout autre numéro → échec (retourne { success: false, error: "Paiement refusé" })
Met à jour le payment_status de la réservation en conséquence
NOUVEAU
src/app/reserver/confirmation/page.tsx
Page de confirmation de réservation affichant le numéro de référence, les détails
Lien "Accéder à votre portail client"
Phase 10 : Authentification Administrateur
NOUVEAU
src/app/admin/login/page.tsx
Formulaire de connexion par email/mot de passe
Page de connexion à thème marocain avec arrière-plan décoratif
Gestion des erreurs en français
NOUVEAU
src/app/admin/login/actions.ts
Action serveur pour la connexion via l'authentification Supabase
Redirection vers /admin/dashboard en cas de succès
Phase 11 : Tableau de Bord Administrateur
NOUVEAU
src/app/admin/layout.tsx
Coquille du tableau de bord avec navigation latérale (étiquettes en français)
Éléments de la barre latérale : Tableau de Bord, Réservations, Chambres, Service d'étage, Nettoyage, Médias, Paramètres
Barre supérieure avec infos utilisateur et déconnexion
Couleurs d'accentuation marocaines sur la barre latérale
NOUVEAU
src/app/admin/dashboard/page.tsx
Cartes d'aperçu : Total réservations, Chambres occupées, Revenus du mois, Commandes en cours
Statistiques rapides avec compteurs animés
Tableau des réservations récentes
Phase 12 : Modules CRUD Administrateur
Gestion des Médias
NOUVEAU
src/app/admin/medias/page.tsx
Zone de téléchargement (glisser-déposer + sélection de fichier) pour jusqu'à 6 images d'accueil
Grille de prévisualisation avec boutons de suppression
Télécharge vers le bucket auberge-media → sauvegarde les URLs dans site_settings.homepage_images
Capacité de réorganisation
Configurateur de Chambres
NOUVEAU
src/app/admin/chambres/page.tsx
Lister toutes les chambres dans un tableau avec badges de statut
Le bouton "Ajouter une chambre" ouvre une boîte de dialogue (formulaire)
NOUVEAU
src/app/admin/chambres/[id]/page.tsx
Formulaire d'édition pour la chambre : nom, description, prix, caractéristiques (éditeur JSON), statut
Composant de téléchargement d'images avec prise en charge de fichiers multiples → Supabase Storage
Grille de prévisualisation des images avec suppression
Réservations (Temps Réel)
NOUVEAU
src/app/admin/reservations/page.tsx
Liste en temps réel de toutes les réservations utilisant supabase.channel().on('postgres_changes')
Onglets de filtre de statut : Toutes, En attente, Confirmées, Arrivé
Actions : Confirmer, Check-in, Check-out, Annuler
Chaque action met à jour le statut de la réservation dans la base de données
Commandes de Service d'Étage (Temps Réel)
NOUVEAU
src/app/admin/service-etage/page.tsx
Flux des commandes en temps réel groupé par statut
Actions : Marquer "En préparation", Marquer "Livré", Annuler
Notification visuelle/audio lors d'une nouvelle commande
Gestion du Nettoyage (Temps Réel)
NOUVEAU
src/app/admin/nettoyage/page.tsx
Grille de toutes les chambres avec indicateurs de statut de nettoyage
Boutons d'action rapide : "Nettoyage Requis" → "En cours" → "Propre" (correspond au statut de la chambre)
Mises à jour de statut en temps réel
Phase 13 : Portail Client (/client/[bookingReference])
NOUVEAU
src/app/client/page.tsx
Page d'entrée : champ de saisie pour la référence de réservation
Bouton "Accéder à mon séjour"
NOUVEAU
src/app/client/[bookingReference]/page.tsx
Récupérer les données de la réservation par référence
Affichage : infos de la chambre, dates, statut de la réservation
Menu du service d'étage en français :
Petit-déjeuner : Msemen, Baghrir, Œufs, Café, Thé à la menthe, Jus d'orange
Boissons : Eau, Soda, Thé, Café
Collations : Cornes de gazelle, Fruits
Formulaire de commande avec sélecteurs de quantité
Soumettre → insère dans room_service_orders (déclenche le temps réel du côté administrateur)
Suivi du statut de la commande en direct via abonnement Supabase Realtime
Phase 14 : Ressources Visuelles Générées
Utilisation de la génération d'images par IA pour :

Image héros : Cour de riad marocain avec fontaine, carreaux de zellige, éclairage chaud
Images de chambres (3-4) : Intérieurs traditionnels de chambres marocaines avec bois sculpté, textiles colorés
Images de galerie : Lieux emblématiques de Meknès, extérieur de l'auberge, jardin
Ressources de motifs : Motifs SVG de zellige pour les arrière-plans
Aperçu de la Structure du Projet
src/
├── app/
│   ├── layout.tsx              # Mise en page racine (polices, métadonnées, en-tête/pied de page)
│   ├── page.tsx                # Page d'accueil
│   ├── chambres/
│   │   ├── page.tsx            # Liste des chambres
│   │   └── [id]/page.tsx       # Détails de la chambre
│   ├── reserver/
│   │   ├── page.tsx            # Flux de réservation
│   │   └── confirmation/page.tsx
│   ├── client/
│   │   ├── page.tsx            # Saisie de la référence
│   │   └── [bookingReference]/page.tsx  # Portail client
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── layout.tsx          # Coquille du tableau de bord
│   │   ├── dashboard/page.tsx
│   │   ├── reservations/page.tsx
│   │   ├── chambres/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── service-etage/page.tsx
│   │   ├── nettoyage/page.tsx
│   │   ├── medias/page.tsx
│   │   └── parametres/page.tsx
│   ├── api/
│   │   └── mock-pay/route.ts
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── ui/
│       ├── (composants shadcn)
│       ├── moroccan-card.tsx
│       ├── image-carousel.tsx
│       ├── booking-search.tsx
│       ├── room-card.tsx
│       ├── zellige-divider.tsx
│       └── status-badge.tsx
├── lib/
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       ├── middleware.ts
│       ├── storage.ts
│       └── types.ts
├── styles/
│   └── moroccan-patterns.css
└── middleware.ts
supabase/
└── schema.sql
Questions Ouvertes
Important : Utilisateur Administrateur
Comment l'utilisateur administrateur initial doit-il être créé ? Options :
Créer manuellement via le tableau de bord Supabase
Inclure un script d'amorçage (seed script) qui crée un administrateur par défaut (email/mot de passe que vous fournissez)
Inclure une page d'inscription (moins sécurisé pour la production)
Plan de Vérification
Tests Automatisés
Vérification du Build : npm run build — s'assurer de l'absence d'erreurs TypeScript et de compilation
Serveur de développement : npm run dev — vérifier que toutes les pages se rendent sans erreur
Test de route API : curl sur /api/mock-pay avec des numéros de carte de test
Tests Navigateur (Vérification Visuelle)
Utilisation du sous-agent navigateur pour vérifier :

La page d'accueil affiche correctement le héros, la galerie et le widget de réservation
La liste des chambres affiche les cartes correctement
Le flux de réservation se complète de bout en bout (formulaire → paiement fictif → confirmation)
Connexion admin → tableau de bord → opérations CRUD
Portail client : saisir la référence → voir la réservation → passer une commande de service d'étage
Mises en page responsives sur mobile sur les pages clés
Vérification Manuelle
L'utilisateur déploie sur Vercel et connecte le projet Supabase
L'utilisateur teste le flux d'authentification Supabase réel
L'utilisateur télécharge de vraies images via le gestionnaire de médias admin
L'utilisateur crée des chambres et effectue des réservations de test