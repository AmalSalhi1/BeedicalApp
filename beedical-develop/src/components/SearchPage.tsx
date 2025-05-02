'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DoctorsMap from '@/components/DoctorsMap';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import DoctorCard from '@/components/DoctorCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

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

  // Get unique values for autocomplete
  const uniqueNames = [...new Set(filteredDoctors.map((doctor) => doctor.nom))];
  const uniqueSpecialties = [
    ...new Set(filteredDoctors.map((doctor) => doctor.specialite)),
  ];
  const uniqueLocations = [
    ...new Set(filteredDoctors.map((doctor) => doctor.location)),
  ];

  const handleSearch = () => {
    // Reset to first page when searching
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setLocationQuery('');
    setCurrentPage(1);
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
              className='w-full rounded-lg border bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery.length > 0 && (
              <div className='absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg'>
                {uniqueNames
                  .filter((name) =>
                    name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((name) => (
                    <button
                      key={name}
                      className='w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100'
                      onClick={() => setSearchQuery(name)}
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
                      className='w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100'
                      onClick={() => setSearchQuery(specialty)}
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
              className='w-full rounded-lg border bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
            {locationQuery.length > 0 && (
              <div className='absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg'>
                {uniqueLocations
                  .filter((location) =>
                    location.toLowerCase().includes(locationQuery.toLowerCase())
                  )
                  .map((location) => (
                    <button
                      key={location}
                      className='w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100'
                      onClick={() => setLocationQuery(location)}
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
          <div className='flex flex-grow flex-col gap-4 lg:flex-row'>
            <div className='w-full overflow-y-auto pr-0 lg:w-8/12 lg:pr-4'>
              <div className='mb-8 space-y-6'>
                {currentDoctors.length === 0 ? (
                  <p className='text-center text-gray-600'>
                    Aucun résultat trouvé.
                  </p>
                ) : (
                  currentDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
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

            <div className='flex w-full flex-col pl-0 lg:w-4/12'>
              <div className='flex-grow overflow-hidden rounded-lg shadow-lg'>
                <DoctorsMap doctors={filteredDoctors} />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
