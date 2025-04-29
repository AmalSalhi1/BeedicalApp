'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearchClick = () => {
    router.push('/Search');
  };

  if (!isClient) return null;

  return (
    <section className='relative overflow-hidden bg-gradient-to-b from-blue-50 via-blue-50 to-white px-4 py-24 min-h-[90vh] flex items-center'>

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
              Trouvez le bon médecin<br />
              <span className='text-blue-600'>pour vos besoins</span>
            </h1>

            <p className='mt-6 text-lg text-gray-600'>
              Prenez rendez-vous avec les meilleurs médecins près de chez vous.
            </p>

            <button
              onClick={handleSearchClick}
              className='bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-3 text-white shadow-md transition-all duration-200 flex items-center font-medium'
            >
              Rechercher un médecin
              <ArrowRight size={16} className="ml-2" />
            </button>

    
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