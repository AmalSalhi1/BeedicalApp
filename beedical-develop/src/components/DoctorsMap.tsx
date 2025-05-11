'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.icon({
  iconUrl: '/images/markers.png', 
  iconSize: [40, 40],
  iconAnchor: [20, 40], 
  popupAnchor: [0, -40],
});

interface Doctor {
  readonly id: number;
  readonly nom: string;
  readonly specialite: string;
  readonly location: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly adresse?: string;
  readonly telephone?: string;
}

interface DoctorsMapProps {
  readonly doctors: readonly Doctor[]; 
  readonly selectedDoctor?: number;
  readonly onMarkerClick?: (doctorId: number) => void;
}

export default function DoctorsMap({ 
  doctors, 
  selectedDoctor, 
  onMarkerClick 
}: Readonly<DoctorsMapProps>) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.FeatureGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Initialiser la carte avec des options de style
    const map = L.map(mapRef.current, {
      zoomControl: false, // Désactiver le contrôle de zoom par défaut pour le repositionner
      attributionControl: false, // Masquer l'attribution par défaut
      scrollWheelZoom: true, // Activer le zoom à la molette
      doubleClickZoom: true,
      dragging: true,
    }).setView([33.5731, -7.5898], 12); // Centre sur Casablanca

    // Ajouter le contrôle de zoom en bas à droite
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Ajouter une couche de tuiles avec un style plus moderne
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Ajouter l'attribution dans le coin inférieur gauche
    L.control.attribution({
      position: 'bottomleft',
      prefix: false
    }).addAttribution('© OpenStreetMap | Docteurs Maroc').addTo(map);

    // Créer un groupe de marqueurs
    const markers = L.featureGroup().addTo(map);
    markersRef.current = markers;
    
    mapInstanceRef.current = map;
    setIsLoading(false);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = null;
    };
  }, []); // Initialisation unique de la carte

  // Mettre à jour les marqueurs lorsque la liste des médecins change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersRef.current;
    
    if (!map || !markersGroup) return;

    // Effacer les marqueurs existants
    markersGroup.clearLayers();

    // Ajouter des marqueurs pour chaque médecin
    doctors.forEach((doctor) => {
      // Vérifier que les coordonnées sont valides
      if (
        typeof doctor.latitude === 'number' &&
        typeof doctor.longitude === 'number' &&
        !isNaN(doctor.latitude) &&
        !isNaN(doctor.longitude)
      ) {
        const marker = L.marker([doctor.latitude, doctor.longitude], { 
          icon: customIcon,
          // Ajouter un effet au marqueur sélectionné
          opacity: selectedDoctor === doctor.id ? 1 : 0.8,
          zIndexOffset: selectedDoctor === doctor.id ? 1000 : 0
        });
        
        // Créer un contenu de popup personnalisé
        const popupContent = `
          <div class="p-2 min-w-48">
            <h3 class="font-bold text-lg mb-1">${doctor.nom}</h3>
            <p class="text-gray-700 mb-1">${doctor.specialite}</p>
            ${doctor.adresse ? `<p class="text-gray-600 text-sm mb-1">${doctor.adresse}</p>` : ''}
            ${doctor.telephone ? `<p class="text-gray-600 text-sm"><a href="tel:${doctor.telephone}" class="text-blue-600 hover:underline">${doctor.telephone}</a></p>` : ''}
          </div>
        `;

        marker
          .addTo(markersGroup)
          .bindPopup(popupContent, { 
            closeButton: true, 
            autoClose: true,
            className: 'custom-popup'
          });

        // Ajouter un gestionnaire d'événements pour le clic sur le marqueur
        if (onMarkerClick) {
          marker.on('click', () => {
            onMarkerClick(doctor.id);
          });
        }
      }
    });

    // Ajuster la vue de la carte pour inclure tous les marqueurs
    if (doctors.length > 0) {
      const bounds = markersGroup.getBounds(); // Obtenir les limites de tous les marqueurs
      if (bounds.isValid()) {
        map.fitBounds(bounds, { 
          padding: [50, 50], // Ajouter de la marge autour des marqueurs
          maxZoom: 15 // Limiter le niveau de zoom maximal
        });
      }
    }
  }, [doctors, selectedDoctor, onMarkerClick]);

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden border border-gray-200">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
      
      <div
        ref={mapRef}
        className="h-full w-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Overlay en haut de la carte */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-10">
        <div className="bg-white bg-opacity-70 rounded-lg px-4 py-2 shadow-sm pointer-events-auto">
          <p className="text-black text-sm">
            {doctors.length > 0 ? `${doctors.length} médecins trouvés` : 'Aucun médecin trouvé'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Ajouter ces styles dans votre CSS global ou via un module CSS
/*
.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 8px;
  box-shadow: 0 3px 14px rgba(0,0,0,0.2);
}

.custom-popup .leaflet-popup-content {
  margin: 8px 12px;
  min-width: 200px;
}

.custom-popup .leaflet-popup-tip-container {
  width: 30px;
  height: 15px;
}

.custom-popup .leaflet-popup-tip {
  box-shadow: 0 3px 14px rgba(0,0,0,0.2);
}
*/
