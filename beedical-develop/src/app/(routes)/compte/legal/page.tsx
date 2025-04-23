'use client';
import Header from '@/components/compte-patient/Header';
import Footer from '@/components/landing/Footer';
import { MdFileOpen } from 'react-icons/md';
import {
  FaShieldAlt,
  FaBalanceScale,
  FaExclamationTriangle,
  FaFileAlt,
  FaChevronLeft,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';

interface LegalDocument {
  title: string;
  description?: string;
  icon: JSX.Element;
  filePath: string;
}

export default function LegalPage() {
  const router = useRouter();

  const legalDocuments: LegalDocument[] = [
    {
      title: "Conditions générales d'utilisation",
      description: "Conditions d'utilisation du site BeeDical",
      icon: <FaFileAlt className='text-secondary text-xl' />,
      filePath: '/documents/etude projet beedical.pdf',
    },
    {
      title: 'Politique de confidentialité',
      description: 'Protection des données personnelles',
      icon: <FaShieldAlt className='text-secondary text-xl' />,
      filePath: '/documents/etude projet beedical.pdf',
    },
    {
      title: 'Politique des cookies',
      icon: <MdFileOpen className='text-secondary text-xl' />,
      filePath: '/documents/etude projet beedical.pdf',
    },
    {
      title: 'Mentions légales',
      icon: <FaBalanceScale className='text-secondary text-xl' />,
      filePath: '/documents/etude projet beedical.pdf',
    },
    {
      title: 'Signaler un contenu illicite',
      icon: <FaExclamationTriangle className='text-secondary text-xl' />,
      filePath: '/documents/etude projet beedical.pdf',
    },
  ];

  const goBack = () => {
    router.push('/compte');
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />

      <main className='container mx-auto flex-grow px-4 py-8 md:py-12'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-6'>
            <button
              onClick={goBack}
              className='text-secondary hover:text-secondary flex items-center text-lg transition-colors'
              aria-label='Retour à mon compte'
            >
              <FaChevronLeft className='mr-2 text-gray-400' />
              <span>Mon compte</span>
            </button>
          </div>

          <h1 className='mb-8 text-3xl font-bold text-gray-900'>
            Informations légales
          </h1>

          <div className='space-y-4'>
            {legalDocuments.map((document, index) => (
              <a
                key={document.title}
                href={document.filePath}
                target='_blank'
                rel='noopener noreferrer'
                className='group hover:border-secondary block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md'
              >
                <div className='flex items-start space-x-4'>
                  <div className='mt-1'>{document.icon}</div>
                  <div className='flex-1'>
                    <h2 className='group-hover:text-secondary text-xl font-semibold text-gray-800 transition-colors'>
                      {document.title}
                    </h2>
                    {document.description && (
                      <p className='mt-1 text-gray-600'>
                        {document.description}
                      </p>
                    )}
                  </div>
                  <div className='group-hover:text-secondary text-gray-400 transition-colors'>
                    <MdFileOpen className='text-xl' />
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className='from-gold-100 to-aqua-100 mt-12 rounded-lg bg-gradient-to-r p-6'>
            <h3 className='mb-4 text-xl font-semibold'>Contact juridique</h3>
            <p className='mb-2 text-gray-700'>
              Pour toute question concernant nos documents légaux :
            </p>
            <a
              href='mailto:contact@beedical.com'
              className='text-secondary hover:text-primary font-medium'
            >
              contact@beedical.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
