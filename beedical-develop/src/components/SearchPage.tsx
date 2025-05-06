'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/solid';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  interface Doctor {
    id: string;
    nom: string;
    specialite: string;
    location: string;
    image?: string;
    disponibilite?: string[];
    acceptsNewPatients?: boolean;
  }

  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Fetch doctors data from API based on URL parameters
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setFilteredDoctors(data);
        } else {
          console.error('Error fetching doctors');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchQuery, locationQuery]);

  const uniqueNames = [...new Set(filteredDoctors.map((doctor) => doctor.nom))];
  const uniqueSpecialties = [
    ...new Set(filteredDoctors.map((doctor) => doctor.specialite)),
  ];
  const uniqueLocations = [
    ...new Set(filteredDoctors.map((doctor) => doctor.location)),
  ];

  const handleSearch = () => {
    setCurrentPage(1);
    setShowNameDropdown(false);
    setShowLocationDropdown(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setLocationQuery('');
    setCurrentPage(1);
    setShowNameDropdown(false);
    setShowLocationDropdown(false);
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
    <div className='flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white'>
      <Header />
      <div className='container mx-auto flex max-w-6xl flex-grow flex-col p-4'>
        <div className='mt-8 mb-8 flex flex-col gap-4 sm:flex-row'>
          <div className='relative sm:w-64'>
            <input
              type='text'
              placeholder='Nom, spécialité...'
              className='w-full rounded-lg border bg-white text-black px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowNameDropdown(e.target.value.length > 0);
              }}
              onFocus={() => setShowNameDropdown(searchQuery.length > 0)}
              onBlur={() => {
                // Delay hiding the dropdown to allow click events to register
                setTimeout(() => setShowNameDropdown(false), 200);
              }}
            />
            {/* Name/specialty search autocomplete */}
            {showNameDropdown && searchQuery.length > 0 && (
              <div
                className='absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg'
                onMouseEnter={() => setShowNameDropdown(true)}
                onMouseLeave={() => setShowNameDropdown(false)}
              >
                {uniqueNames
                  .filter((name) =>
                    name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((name) => (
                    <button
                      key={name}
                      className='w-full cursor-pointer px-4 py-2 text-left text-black hover:bg-gray-100'
                      onClick={() => {
                        setSearchQuery(name);
                        setShowNameDropdown(false);
                      }}
                    >
                      {name}
                    </button>
                  ))}
                {uniqueSpecialties
                  .filter((specialty) =>
                    specialty.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((specialty) => (
                    <button
                      key={specialty}
                      className='w-full cursor-pointer px-4 py-2 text-left text-black hover:bg-gray-100'
                      onClick={() => {
                        setSearchQuery(specialty);
                        setShowNameDropdown(false);
                      }}
                    >
                      {specialty}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className='relative sm:w-64'>
            <input
              type='text'
              placeholder='Lieu...'
              className='w-full rounded-lg border bg-white text-black px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                setShowLocationDropdown(e.target.value.length > 0);
              }}
              onFocus={() => setShowLocationDropdown(locationQuery.length > 0)}
              onBlur={() => {
                // Delay hiding the dropdown to allow click events to register
                setTimeout(() => setShowLocationDropdown(false), 200);
              }}
            />
            {/* Location search autocomplete */}
            {showLocationDropdown && locationQuery.length > 0 && (
              <div
                className='absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg'
                onMouseEnter={() => setShowLocationDropdown(true)}
                onMouseLeave={() => setShowLocationDropdown(false)}
              >
                {uniqueLocations
                  .filter((location) =>
                    location.toLowerCase().includes(locationQuery.toLowerCase())
                  )
                  .map((location) => (
                    <button
                      key={location}
                      className='w-full cursor-pointer px-4 py-2 text-left text-black hover:bg-gray-100'
                      onClick={() => {
                        setLocationQuery(location);
                        setShowLocationDropdown(false);
                      }}
                    >
                      {location}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className='bg-primary hover:bg-primary-700 mt-4 rounded-lg px-4 py-3 text-black transition-colors sm:mt-0'
          >
            Rechercher
          </button>

          <button
            onClick={handleClearSearch}
            className='bg-gray-200 hover:bg-gray-300 mt-4 rounded-lg px-4 py-3 text-gray-700 transition-colors sm:mt-0'
          >
            Effacer
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className='flex flex-grow flex-col'>
            <div className="mb-4 text-gray-700">
              <p className="font-medium">
                {filteredDoctors.length} {filteredDoctors.length === 1 ? 'médecin trouvé' : 'médecins trouvés'}
                {searchQuery && ` pour "${searchQuery}"`}
                {locationQuery && ` à ${locationQuery}`}
              </p>
            </div>

            <div className='mb-8 space-y-6'>
              {currentDoctors.length === 0 ? (
                <p className='text-center text-gray-600'>
                  Aucun résultat trouvé.
                </p>
              ) : (
                currentDoctors.map((doctor) => (
                  <div key={doctor.id} className="mb-6 rounded-lg border border-blue-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Left section with doctor info */}
                      <div className="p-4 md:w-1/3 border-r border-blue-100">
                        <div className="flex items-start gap-3">
                          <div className="relative h-14 w-14">
                            <Image
                              src={doctor.image || '/images/default.png'}
                              alt={doctor.nom}
                              width={56}
                              height={56}
                              className="rounded-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0">
                              <span className="text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                                </svg>
                              </span>
                            </div>
                          </div>
                          <div>
                            <Link href={`/doctor/${encodeURIComponent(doctor.id)}`}>
                              <h3 className="text-lg font-bold text-black hover:text-primary cursor-pointer">Dr {doctor.nom}</h3>
                            </Link>
                            <p className="text-gray-800">{doctor.specialite}</p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2 text-gray-800">
                          <p className="flex items-center">
                            <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                            {doctor.location}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 md:w-2/3">
                        {/* Move appointment button above calendar */}
                        <div className="mb-4">
                          <Link
                            href={`/doctor/${encodeURIComponent(doctor.id)}`}
                            className="bg-yellow-400 hover:bg-yellow-600 w-full block rounded-lg px-4 py-2 text-center text-white transition-colors"
                          >
                            PRENDRE RENDEZ-VOUS
                          </Link>
                        </div>

                        {doctor.disponibilite && doctor.disponibilite.length > 0 ? (
                          <div className="grid grid-cols-6 gap-2">
                            {Array.from({ length: 6 }).map((_, index) => {
                              const date = new Date();
                              date.setDate(date.getDate() + index);

                              const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                              const dayName = dayNames[date.getDay()];
                              const dayNumber = date.getDate();
                              const monthNames = ['jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
                              const monthName = monthNames[date.getMonth()];

                              return (
                                <div key={index} className="text-center">
                                  <p className="text-gray-800">{dayName}</p>
                                  <p className="text-gray-600 text-sm">{dayNumber} {monthName}</p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-center p-4">
                            <div className="flex items-center text-gray-800">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                              </svg>
                              {doctor.acceptsNewPatients === false
                                ? "Ce soignant Reserve la prise de rendez-vous en ligne aux patients déjà suivis."
                                : "Aucune disponibilité pour le moment."}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredDoctors.length > doctorsPerPage && (
              <div className='mt-4 flex items-center justify-between'>
                <button
                  onClick={goToPreviousPage}
                  className='text-primary hover:text-primary-700 flex items-center rounded-lg px-4 py-2'
                  disabled={currentPage === 1}
                >
                  <span className='mr-2'>←</span> Précédent
                </button>
                <span className="text-gray-600">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  className='text-primary hover:text-primary-700 flex items-center rounded-lg px-4 py-2'
                  disabled={currentPage === totalPages}
                >
                  Suivant <span className='ml-2'>→</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
