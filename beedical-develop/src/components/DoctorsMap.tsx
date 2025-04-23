'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes de marqueurs avec votre image
const customIcon = L.icon({
  iconUrl: '/images/markers.png', // Chemin vers votre image dans le dossier public
  iconSize: [40, 40], // Taille de l'icône (largeur, hauteur)
  iconAnchor: [20, 40], // Point d'ancrage de l'icône (généralement la moitié de la largeur et la hauteur totale)
  popupAnchor: [0, -40], // Position du popup par rapport à l'icône
});

// Définir une interface pour les props
interface Doctor {
  readonly id: number;
  readonly nom: string;
  readonly specialite: string;
  readonly location: string;
  readonly latitude: number;
  readonly longitude: number;
}

interface DoctorsMapProps {
  readonly doctors: readonly Doctor[]; // Tableau en lecture seule
}

export default function DoctorsMap({ doctors }: Readonly<DoctorsMapProps>) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Vérifier que le code s'exécute côté client et que la référence de la carte est valide
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Initialiser la carte
    const map = L.map(mapRef.current).setView([33.5731, -7.5898], 12); // Centre sur Casablanca

    // Ajouter une couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Créer un groupe de marqueurs
    const markers = L.featureGroup().addTo(map);

    // Ajouter des marqueurs pour chaque médecin
    doctors.forEach((doctor) => {
      // Vérifier que les coordonnées sont valides
      if (
        typeof doctor.latitude === 'number' &&
        typeof doctor.longitude === 'number' &&
        !isNaN(doctor.latitude) &&
        !isNaN(doctor.longitude)
      ) {
        L.marker([doctor.latitude, doctor.longitude], { icon: customIcon })
          .addTo(markers)
          .bindPopup(doctor.nom); // Afficher le nom du médecin dans un popup
      }
    });

    // Ajuster la vue de la carte pour inclure tous les marqueurs
    if (doctors.length > 0) {
      const bounds = markers.getBounds(); // Obtenir les limites de tous les marqueurs
      if (bounds.isValid()) {
        map.fitBounds(bounds); // Ajuster la carte pour afficher tous les marqueurs
      }
    }

    return () => {
      map.remove();
    };
  }, [doctors]);

  return (
    <div
      ref={mapRef}
      className='h-full w-full'
      style={{ height: '100%', width: '100%' }} // Assurez-vous que la hauteur est de 100%
    />
  );
}
