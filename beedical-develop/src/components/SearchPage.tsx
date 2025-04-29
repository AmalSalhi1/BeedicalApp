'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Filter, X } from 'lucide-react';
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
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    accepteNouveaux: false,
    secteur: 'all',
    specialite: 'all'
  });
  const [sortBy, setSortBy] = useState('relevance');
  const doctorsPerPage = 5;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const doctorsResponse = await fetch('/api/doctors');
        if (doctorsResponse.ok) {
          const doctorsData = await doctorsResponse.json();
          setAllDoctors(doctorsData);
          setFilteredDoctors(doctorsData); 
        } else {
          throw new Error('Erreur lors du chargement des médecins');
        }

        const citiesResponse = await fetch('/api/cities');
        if (citiesResponse.ok) {
          const citiesData = await citiesResponse.json();
          setCities(citiesData);
        }

        const specialtiesResponse = await fetch('/api/specialties');
        if (specialtiesResponse.ok) {
          const specialtiesData = await specialtiesResponse.json();
          setSpecialties(specialtiesData);
        }

        if (initialQuery || initialLocation) {
          await searchDoctors(initialQuery, initialLocation);
        }
      } catch (error) {
        setError('Une erreur est survenue lors du chargement des données. Veuillez réessayer.');
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [initialQuery, initialLocation]);

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

  const searchDoctors = async (query: string, location: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      if (query) searchParams.append('query', query);
      if (location) searchParams.append('location', location);
      if (filters.accepteNouveaux) searchParams.append('accepteNouveaux', 'true');
      if (filters.secteur !== 'all') searchParams.append('secteur', filters.secteur);
      if (filters.specialite !== 'all') searchParams.append('specialite', filters.specialite);
      searchParams.append('sort', sortBy);

      const response = await fetch(`/api/doctors?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche des médecins');
      }

      const data = await response.json();
      setFilteredDoctors(data);
      setCurrentPage(1);
    } catch (error) {
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      console.error('Erreur lors de la recherche des médecins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery || locationQuery 
              ? `Résultats de recherche (${filteredDoctors.length})`
              : `Tous les médecins (${allDoctors.length})`
            }
          </h2>
          <p className="text-gray-600">
            {searchQuery || locationQuery 
              ? "Résultats filtrés selon vos critères"
              : "Liste complète des médecins disponibles"
            }
          </p>
        </div>


        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un médecin ou une spécialité..."
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredSpecialties.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {filteredSpecialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    className="w-full cursor-pointer px-4 py-2 text-left text-black hover:bg-gray-100 flex items-center"
                    onClick={() => setSearchQuery(specialty.nom)}
                  >
                    <Search className="h-4 w-4 mr-2 text-gray-400" />
                    {specialty.nom}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative sm:w-64">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Lieu..."
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
            {filteredCities.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    className="w-full cursor-pointer px-4 py-2 text-left text-black hover:bg-gray-100 flex items-center"
                    onClick={() => setLocationQuery(city.nom)}
                  >
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {city.nom}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Rechercher'
            )}
          </button>
        </div>


        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-grow flex-col gap-6 lg:flex-row">

          <div className="w-full overflow-y-auto pr-0 lg:w-8/12 lg:pr-4">
            <div className="mb-8 space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    {searchQuery || locationQuery 
                      ? "Aucun médecin ne correspond à vos critères de recherche."
                      : "Aucun médecin n'est disponible pour le moment."
                    }
                  </p>
                </div>
              ) : (
                currentDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              )}
            </div>

    
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