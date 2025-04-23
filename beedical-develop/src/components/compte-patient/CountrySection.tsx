'use client';

import { useState } from 'react';
import { FaChevronRight, FaGlobe } from 'react-icons/fa';
import {
  BE as BelgiumFlag,
  FR as FranceFlag,
  MA as MoroccoFlag,
} from 'country-flag-icons/react/3x2';

interface CountrySectionProps {
  className?: string;
}

const CountrySection = ({ className = '' }: CountrySectionProps) => {
  const [selectedCountry, setSelectedCountry] = useState('France');
  const [showCountryPopup, setShowCountryPopup] = useState(false);

  const countries = [
    { name: 'Maroc', code: 'MA', Component: MoroccoFlag },
    { name: 'France', code: 'FR', Component: FranceFlag },
    { name: 'Belgique', code: 'BE', Component: BelgiumFlag },
  ];

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    setShowCountryPopup(false);
    // Ajoutez ici la logique pour sauvegarder le pays sélectionné
  };

  const getCountryFlag = () => {
    const country = countries.find((c) => c.name === selectedCountry);
    return country ? <country.Component className='h-6 w-6' /> : null;
  };

  return (
    <div className={className}>
      {/* Bouton de sélection de pays */}
      <button
        className='border-primary mb-4 flex w-full items-center justify-between rounded-lg border-l-4 bg-white p-6 text-left shadow-md transition hover:bg-gray-50'
        onClick={() => setShowCountryPopup(true)}
        aria-label='Sélectionner un pays'
      >
        <div className='flex items-center space-x-4'>
          <FaGlobe className='text-primary text-xl' />
          <div>
            <h2 className='text-lg font-semibold text-gray-800'>Pays</h2>
            <p className='text-sm text-gray-600'>
              Sélectionnez votre pays de résidence
            </p>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='mr-2 h-6 w-6'>{getCountryFlag()}</div>
          <FaChevronRight className='text-gray-400' />
        </div>
      </button>

      {/* Popup de sélection de pays */}
      {showCountryPopup && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
            <h3 className='mb-4 text-xl font-bold text-gray-800'>
              Sélectionnez votre pays
            </h3>
            <div className='space-y-3'>
              {countries.map((country) => {
                const FlagComponent = country.Component;
                return (
                  <button
                    key={country.code}
                    className={`flex w-full items-center justify-between rounded-lg p-3 transition-colors ${
                      selectedCountry === country.name
                        ? 'bg-primary-100 text-primary'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleCountrySelect(country.name)}
                  >
                    <div className='flex items-center'>
                      <span>{country.name}</span>
                    </div>
                    <div className='flex items-center'>
                      <FlagComponent className='mr-2 h-6 w-8' />
                      {selectedCountry === country.name && (
                        <span className='text-primary'>✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              className='mt-6 px-4 py-2 text-gray-500 transition-colors hover:text-gray-700'
              onClick={() => setShowCountryPopup(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySection;
