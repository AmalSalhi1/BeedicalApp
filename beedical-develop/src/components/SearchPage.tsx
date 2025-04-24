'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DoctorsMap from '@/components/DoctorsMap';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import DoctorCard from '@/components/DoctorCard';

interface Doctor {
  id: number;
  nom: string;
  specialite: string;
  disponibilite: string[];
  image: string;
  location: string;
  latitude: number;
  longitude: number;
  accepteNouveaux: boolean;
  secteur: number;
  adresse?: string;
  codePostal?: string;
  telephone?: string;
}

interface City {
  id: number;
  nom: string;
}

interface Specialty {
  id: number;
  nom: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const initialLocation = searchParams.get('location') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>([]);
  const doctorsPerPage = 5;

  // Charger les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // Charger toutes les villes
        const citiesResponse = await fetch('/api/cities');
        if (citiesResponse.ok) {
          const citiesData = await citiesResponse.json();
          setCities(citiesData);
        }

        // Charger toutes les spécialités
        const specialtiesResponse = await fetch('/api/specialties');
        if (specialtiesResponse.ok) {
          const specialtiesData = await specialtiesResponse.json();
          setSpecialties(specialtiesData);
        }

        // Effectuer la recherche initiale si des paramètres sont présents
        if (initialQuery || initialLocation) {
          await searchDoctors(initialQuery, initialLocation);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [initialQuery, initialLocation]);

  // Filtrer les villes en fonction de la saisie
  useEffect(() => {
    if (!locationQuery) {
      setFilteredCities([]);
      return;
    }

    const filtered = cities.filter(city =>
      city.nom.toLowerCase().includes(locationQuery.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [locationQuery, cities]);

  // Filtrer les spécialités en fonction de la saisie
  useEffect(() => {
    if (!searchQuery) {
      setFilteredSpecialties([]);
      return;
    }

    const filtered = specialties.filter(specialty =>
      specialty.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSpecialties(filtered);
  }, [searchQuery, specialties]);

  // Fonction pour rechercher les médecins
  const searchDoctors = async (query: string, location: string) => {
    try {
      setIsLoading(true);

      // Construire l'URL de recherche
      const searchParams = new URLSearchParams();
      if (query) {
        searchParams.append('query', query);
      }
      if (location) {
        searchParams.append('location', location);
      }

      const response = await fetch(`/api/doctors?${searchParams.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setFilteredDoctors(data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche des médecins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // Permettre la recherche avec n'importe quelle combinaison de critères
    searchDoctors(searchQuery, locationQuery);
  };

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="container mx-auto flex max-w-6xl flex-grow flex-col p-4">
        {/* Search Bar Section */}
        <div className="mt-8 mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative sm:w-64">
            <input
              type="text"
              placeholder="Nom, spécialité..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredSpecialties.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {filteredSpecialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    className="w-full cursor-pointer px-4 py-2 text-left text-black hover:bg-gray-100"
                    onClick={() => setSearchQuery(specialty.nom)}
                  >
                    {specialty.nom}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative sm:w-64">
            <input
              type="text"
              placeholder="Lieu..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
            {filteredCities.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    className="w-full cursor-pointer px-4 py-2 text-left text-black hover:bg-gray-100"
                    onClick={() => setLocationQuery(city.nom)}
                  >
                    {city.nom}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 sm:mt-0"
          >
            {isLoading ? 'Recherche en cours...' : 'Rechercher'}
          </button>
        </div>


        {/* Results Count */}
        {filteredDoctors.length > 0 && (
          <div className="mb-4 text-black">
            <p className="font-medium">{filteredDoctors.length} résultats</p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-grow flex-col gap-6 lg:flex-row">
          {/* Left Column - Doctor Listings */}
          <div className="w-full overflow-y-auto pr-0 lg:w-8/12 lg:pr-4">
            <div className="mb-8 space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : currentDoctors.length === 0 ? (
                <p className="text-center text-black">
                  {searchQuery || locationQuery ? 'Aucun résultat trouvé.' : 'Veuillez effectuer une recherche.'}
                </p>
              ) : (
                currentDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredDoctors.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={goToPreviousPage}
                  className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100"
                  disabled={currentPage === 1}
                >
                  <span className="mr-2">←</span> Précédent
                </button>
                <div className="text-black">
                  Page {currentPage} sur {totalPages}
                </div>
                <button
                  onClick={goToNextPage}
                  className="flex items-center rounded-lg px-4 py-2 text-black hover:bg-gray-100"
                  disabled={currentPage === totalPages}
                >
                  Suivant <span className="ml-2">→</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Map */}
          <div className="flex w-full flex-col pl-0 lg:w-4/12">
            <div className="h-96 flex-grow overflow-hidden rounded-lg border border-gray-200 shadow-lg lg:h-auto">
              <DoctorsMap doctors={filteredDoctors} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}