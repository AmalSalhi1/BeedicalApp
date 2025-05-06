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
  const [doctorsList, setDoctorsList] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const fetchData = async () => {
      setLoading(true);
      try {
        const doctorsResponse = await fetch('/api/doctors/list');
        if (doctorsResponse.ok) {
          const doctorsData = await doctorsResponse.json();
          const names = doctorsData.map((doctor: any) => `Dr. ${doctor.nom}`);
          setDoctorsList(names);
        }


        const citiesResponse = await fetch('/api/cities/list');
        if (citiesResponse.ok) {
          const citiesData = await citiesResponse.json();
          const cities = citiesData.map((city: any) => city.nom);
          setCitiesList(cities);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredCities(
      location
        ? citiesList.filter((city) =>
            city.toLowerCase().includes(location.toLowerCase())
          )
        : []
    );
  }, [location, citiesList]);

  useEffect(() => {
    setFilteredDoctors(
      search
        ? doctorsList.filter((doctor) =>
            doctor.toLowerCase().includes(search.toLowerCase())
          )
        : []
    );
  }, [search, doctorsList]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search || location) {
      setShowDoctorDropdown(false);
      setShowCityDropdown(false);
      router.push(
        `/Search?query=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`
      );
    } else {
      console.log('Veuillez remplir au moins un champ.');
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
              Trouvez rapidement un professionnel de santé et Reservez votre
              consultation.
            </p>


            <form
              onSubmit={handleSearch}
              className='relative mt-8 flex flex-col gap-4 sm:flex-row'
            >

              <div className='relative'>
                <input
                  type='text'
                  id='search'
                  name='search'
                  placeholder='Nom, spécialité...'
                  className='rounded-lg border bg-white text-black px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-64'
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDoctorDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowDoctorDropdown(search.length > 0)}
                  onBlur={() => {
                    // Delay hiding the dropdown to allow click events to register
                    setTimeout(() => setShowDoctorDropdown(false), 200);
                  }}
                  disabled={loading}
                />
                {showDoctorDropdown && filteredDoctors.length > 0 && (
                  <div
                    className='absolute left-0 mt-1 w-full rounded-lg border bg-white shadow-md'
                    onMouseEnter={() => setShowDoctorDropdown(true)}
                    onMouseLeave={() => setShowDoctorDropdown(false)}
                  >
                    {filteredDoctors.map((doctor) => (
                      <button
                        key={doctor}
                        type='button'
                        onClick={() => {
                          setSearch(doctor);
                          setShowDoctorDropdown(false);
                        }}
                        className='w-full px-4 py-2 text-left hover:bg-gray-200'
                      >
                        {doctor}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className='relative'>
                <input
                  type='text'
                  id='location'
                  name='location'
                  placeholder='Lieu...'
                  className='rounded-lg border bg-white text-black px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-64'
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setShowCityDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowCityDropdown(location.length > 0)}
                  onBlur={() => {
                    // Delay hiding the dropdown to allow click events to register
                    setTimeout(() => setShowCityDropdown(false), 200);
                  }}
                  disabled={loading}
                />
                {showCityDropdown && filteredCities.length > 0 && (
                  <div
                    className='absolute left-0 mt-1 w-full rounded-lg border bg-white shadow-md'
                    onMouseEnter={() => setShowCityDropdown(true)}
                    onMouseLeave={() => setShowCityDropdown(false)}
                  >
                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        type='button'
                        onClick={() => {
                          setLocation(city);
                          setShowCityDropdown(false);
                        }}
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
                disabled={loading}
              >
                Rechercher
              </button>
            </form>
          </div>


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
