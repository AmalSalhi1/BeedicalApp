'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const doctorsList = [
    'Dr. Ahmed',
    'Dr. Salma',
    'Dr. Youssef',
    'Dr. Anissa',
    'Dr. Karim',
  ];
  const citiesList = ['Casablanca', 'Rabat', 'Fès', 'Tanger', 'Marrakech'];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setFilteredCities(
      location
        ? citiesList.filter((city) =>
            city.toLowerCase().includes(location.toLowerCase())
          )
        : []
    );
  }, [location]);

  useEffect(() => {
    setFilteredDoctors(
      search
        ? doctorsList.filter((doctor) =>
            doctor.toLowerCase().includes(search.toLowerCase())
          )
        : []
    );
  }, [search]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search && location) {
      // Assurez-vous que les paramètres sont correctement encodés dans l'URL
      router.push(
        `/Search?query=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}/`
      );
    } else {
      // Optionnel : ajouter un message d'erreur ou gestion du cas où les champs sont vides
      console.log('Veuillez remplir tous les champs.');
    }
  };

  if (!isClient) return null;

  return (
    <section className='relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-4 py-20'>
      <div className='relative z-10 container mx-auto max-w-6xl'>
        <div className='flex flex-col items-center justify-between gap-8 md:flex-row'>
          <div className='text-left md:w-1/2 md:pr-8'>
            <h1 className='text-4xl leading-tight font-bold text-gray-900 md:text-5xl'>
              Prenez rendez-vous avec votre médecin en un clic
            </h1>
            <p className='mt-6 text-lg text-gray-600'>
              Trouvez rapidement un professionnel de santé et réservez votre
              consultation.
            </p>

            {/* Barre de recherche */}
            <form
              onSubmit={handleSearch}
              className='relative mt-8 flex flex-col gap-4 sm:flex-row'
            >
              {/* Recherche de médecins */}
              <div className='relative'>
                <input
                  type='text'
                  id='search'
                  name='search'
                  placeholder='Nom, spécialité...'
                  className='rounded-lg border bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-64'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {filteredDoctors.length > 0 && (
                  <div className='absolute left-0 mt-1 w-full rounded-lg border bg-white shadow-md'>
                    {filteredDoctors.map((doctor) => (
                      <button
                        key={doctor}
                        type='button'
                        onClick={() => setSearch(doctor)}
                        className='w-full px-4 py-2 text-left hover:bg-gray-200'
                      >
                        {doctor}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Recherche de villes */}
              <div className='relative'>
                <input
                  type='text'
                  id='location'
                  name='location'
                  placeholder='Lieu...'
                  className='rounded-lg border bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-64'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                {filteredCities.length > 0 && (
                  <div className='absolute left-0 mt-1 w-full rounded-lg border bg-white shadow-md'>
                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        type='button'
                        onClick={() => setLocation(city)}
                        className='w-full px-4 py-2 text-left hover:bg-gray-200'
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type='submit'
                className='bg-primary hover:bg-primary-700 rounded-lg px-6 py-3 text-black shadow-md transition-colors'
              >
                Rechercher
              </button>
            </form>
          </div>

          {/* Image */}
          <div className='relative md:w-1/2'>
            <div className='relative h-80 w-full md:h-96'>
              <Image
                src='/images/img11.png'
                alt='Consultation médicale en ligne'
                fill
                className='object-contain drop-shadow-xl'
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {isClient && (
        <>
          <div className='absolute top-10 left-10 z-0 h-16 w-16 rotate-45 rounded-lg bg-[#81fcfc] opacity-40' />
          <div className='absolute right-10 bottom-20 z-0 h-20 w-20 rotate-45 rounded-lg bg-[#fffb86] opacity-40' />
        </>
      )}
    </section>
  );
}
