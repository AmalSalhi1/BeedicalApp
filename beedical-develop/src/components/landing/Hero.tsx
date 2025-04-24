'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowRight } from 'lucide-react';

interface City {
  id: number;
  nom: string;
}

interface Specialty {
  id: number;
  nom: string;
}

interface Doctor {
  id: number;
  nom: string;
  specialite: string;
}

export default function Hero() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Recherche de villes
  useEffect(() => {
    const fetchCities = async () => {
      if (!location) {
        setFilteredCities([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/cities?query=${encodeURIComponent(location)}`);
        if (response.ok) {
          const data = await response.json();
          setFilteredCities(data);
          setIsCityDropdownOpen(data.length > 0);
        }
      } catch (error) {
        console.error('Erreur lors de la recherche des villes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Utiliser un délai pour éviter trop de requêtes pendant la saisie
    const timeoutId = setTimeout(() => {
      fetchCities();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [location]);

  // Recherche de médecins et spécialités
  useEffect(() => {
    const fetchDoctorsAndSpecialties = async () => {
      if (!search) {
        setFilteredDoctors([]);
        setFilteredSpecialties([]);
        return;
      }

      try {
        setIsLoading(true);

        // Recherche de spécialités
        const specialtiesResponse = await fetch(`/api/specialties?query=${encodeURIComponent(search)}`);
        if (specialtiesResponse.ok) {
          const specialtiesData = await specialtiesResponse.json();
          setFilteredSpecialties(specialtiesData);
        }

        // Recherche de médecins
        const doctorsResponse = await fetch(`/api/doctors?query=${encodeURIComponent(search)}`);
        if (doctorsResponse.ok) {
          const doctorsData = await doctorsResponse.json();
          setFilteredDoctors(doctorsData);
          setIsSearchDropdownOpen(doctorsData.length > 0);
        }
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Utiliser un délai pour éviter trop de requêtes pendant la saisie
    const timeoutId = setTimeout(() => {
      fetchDoctorsAndSpecialties();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Permettre la recherche avec n'importe quelle combinaison de critères
    const searchParams = new URLSearchParams();

    if (search) {
      searchParams.append('query', search);
    }

    if (location) {
      searchParams.append('location', location);
    }

    // Rediriger vers la page de recherche même si aucun critère n'est spécifié
    router.push(`/Search?${searchParams.toString()}`);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsCityDropdownOpen(false);
      setIsSearchDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!isClient) return null;

  return (
    <section className='relative overflow-hidden bg-gradient-to-b from-blue-50 via-blue-50 to-white px-4 py-24 min-h-[90vh] flex items-center'>
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className='absolute top-10 left-10 z-0 h-24 w-24 rotate-45 rounded-xl bg-[#81fcfc] opacity-30 blur-sm' />
        <div className='absolute right-48 top-40 z-0 h-32 w-32 rotate-12 rounded-xl bg-[#fffb86] opacity-30 blur-sm' />
        <div className='absolute left-1/3 bottom-20 z-0 h-40 w-40 -rotate-12 rounded-full bg-[#a5f3fc] opacity-20 blur-md' />
        <div className='absolute right-20 bottom-40 z-0 h-28 w-28 rotate-45 rounded-xl bg-[#c4b5fd] opacity-25 blur-sm' />
      </div>

      <div className='relative z-10 container mx-auto max-w-6xl'>
        <div className='flex flex-col items-center justify-between gap-12 md:flex-row'>
          <div className='text-left md:w-1/2 md:pr-8'>
            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-sm mb-6">
              Votre santé, notre priorité
            </div>

            <h1 className='text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl'>
              Prenez <span className="text-blue-600">rendez-vous</span> avec votre médecin en un clic
            </h1>

            <p className='mt-6 text-lg text-gray-600'>
              Trouvez rapidement un professionnel de santé qualifié et réservez votre
              consultation en toute simplicité.
            </p>

            {/* Barre de recherche */}
            <form
              onSubmit={handleSearch}
              className='relative mt-10 flex flex-col gap-4 sm:flex-row sm:items-center shadow-lg rounded-xl bg-white p-2 border border-gray-100'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Recherche de médecins */}
              <div className='relative flex-1'>
                <div className="flex items-center px-4 py-3">
                  <Search size={18} className="text-gray-400 mr-2" />
                  <input
                    type='text'
                    id='search'
                    name='search'
                    placeholder='Nom, spécialité...'
                    className='w-full bg-transparent focus:outline-none text-black'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsSearchDropdownOpen(filteredDoctors.length > 0)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {isSearchDropdownOpen && filteredDoctors.length > 0 && (
                  <div className='absolute left-0 right-0 mt-1 rounded-lg border bg-white shadow-lg z-20'>
                    <div className="p-2 text-xs font-medium text-gray-500 uppercase">Médecins</div>
                    {filteredDoctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearch(doctor.nom);
                          setIsSearchDropdownOpen(false);
                        }}
                        className='w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center text-black'
                      >
                        <span className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 mr-3 flex items-center justify-center font-medium">
                          {doctor.nom.charAt(0)}
                        </span>
                        <div>
                          <div className="font-medium">{doctor.nom}</div>
                          <div className="text-sm text-gray-500">{doctor.specialite}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-200 h-10 w-px mx-2 hidden sm:block"></div>

              {/* Recherche de villes */}
              <div className='relative flex-1'>
                <div className="flex items-center px-4 py-3">
                  <MapPin size={18} className="text-gray-400 mr-2" />
                  <input
                    type='text'
                    id='location'
                    name='location'
                    placeholder='Ville...'
                    className='w-full bg-transparent focus:outline-none text-black'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => setIsCityDropdownOpen(filteredCities.length > 0)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {isCityDropdownOpen && filteredCities.length > 0 && (
                  <div className='absolute left-0 right-0 mt-1 rounded-lg border bg-white shadow-lg z-20'>
                    <div className="p-2 text-xs font-medium text-gray-500 uppercase">Villes</div>
                    {filteredCities.map((city) => (
                      <button
                        key={city.id}
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(city.nom);
                          setIsCityDropdownOpen(false);
                        }}
                        className='w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center text-black'
                      >
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        {city.nom}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type='submit'
                className='bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-3 text-white shadow-md transition-all duration-200 flex items-center font-medium'
              >
                Rechercher
                <ArrowRight size={16} className="ml-2" />
              </button>
            </form>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center space-x-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-sm font-medium">Accès rapide</span>
              </div>

              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-sm font-medium">RDV confirmé</span>
              </div>

              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-sm font-medium">100% gratuit</span>
              </div>
            </div>
          </div>

          {/* Image with enhanced styling */}
          <div className='relative md:w-1/2'>
            <div className='relative h-96 w-full md:h-[500px] p-4'>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl transform -rotate-2"></div>
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl transform rotate-2"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src='/images/img11.png'
                  alt='Consultation médicale en ligne'
                  fill
                  className='object-contain p-8'
                  priority
                />
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-500 rounded-full h-3 w-3"></div>
                  <span className="font-medium">5000+ médecins disponibles</span>
                </div>
              </div>

              <div className="absolute -top-5 -right-5 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-500 rounded-full h-3 w-3"></div>
                  <span className="font-medium">Service 24h/24 et 7j/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}