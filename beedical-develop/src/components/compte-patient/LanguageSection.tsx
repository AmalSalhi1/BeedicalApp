'use client';

import { useState } from 'react';
import { FaChevronRight, FaLanguage } from 'react-icons/fa';

interface LanguageSectionProps {
  className?: string;
}

const LanguageSection = ({ className = '' }: LanguageSectionProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('Français');
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];

  const handleLanguageSelect = (languageName: string) => {
    setSelectedLanguage(languageName);
    setShowLanguagePopup(false);
  };

  return (
    <div className={className}>
      <button
        className='border-primary mb-4 flex w-full items-center justify-between rounded-lg border-l-4 bg-white p-6 text-left shadow-md transition hover:bg-gray-50'
        onClick={() => setShowLanguagePopup(true)}
        aria-label='Changer la langue'
      >
        <div className='flex items-center space-x-4'>
          <FaLanguage className='text-primary text-xl' />
          <div>
            <h2 className='text-lg font-semibold text-gray-800'>Langue</h2>
            <p className='text-sm text-gray-600'>
              Sélectionnez la langue de votre choix
            </p>
          </div>
        </div>
        <div className='flex items-center'>
          <span className='text-gray-600'>{selectedLanguage}</span>
          <FaChevronRight className='ml-2 text-gray-400' />
        </div>
      </button>

      {showLanguagePopup && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
            <h3 className='mb-4 text-xl font-bold text-gray-800'>
              Sélectionnez votre langue
            </h3>
            <div className='space-y-3'>
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`flex w-full items-center justify-between rounded-lg p-3 transition-colors ${
                    selectedLanguage === language.name
                      ? 'bg-primary-100 text-primary'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleLanguageSelect(language.name)}
                >
                  <div className='flex items-center'>
                    <span>{language.name}</span>
                  </div>
                  {selectedLanguage === language.name && (
                    <span className='text-primary'>✓</span>
                  )}
                </button>
              ))}
            </div>
            <button
              className='mt-6 px-4 py-2 text-gray-500 transition-colors hover:text-gray-700'
              onClick={() => setShowLanguagePopup(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSection;
