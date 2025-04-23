'use client';
import Link from 'next/link';
import { useState, useEffect, KeyboardEvent } from 'react';
import Image from 'next/image';
import {
  FaBars,
  FaTimes,
  FaQuestionCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaFileAlt,
  FaUser,
  FaChevronDown,
} from 'react-icons/fa'; // Icônes pour les liens
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser,useClerk } from '@clerk/nextjs';

export default function Header() {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const { user } = useUser();

  const { signOut } = useClerk();


  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  const handleCompteClick = () => {
    router.push('/compte');
    setIsAccountMenuOpen(false);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement> | KeyboardEvent<HTMLButtonElement>,
    callback: { (): void; (): void; (): void; (): void }
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      callback();
    }
  };

  // Fonction pour gérer la déconnexion et suppresion de compte , a remplacer par l'appel API réel plus tard
  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';// Redirige vers la page d'accueil après déconnexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className='bg-background shadow-md'>
      <div className='container mx-auto flex items-center justify-between p-4'>
        {/* Logo */}
        <Link href='/' className='flex items-center space-x-2'>
          <Image
            src='/images/beedical logo.png'
            alt='Beedical Logo'
            width={50}
            height={40}
          />
          <div className='text-xl font-bold md:text-2xl'>
            <span className='text-primary'>Bee</span>
            <span className='text-secondary'>Dical</span>
          </div>
        </Link>

        {/* Menu mobile  */}
        <button
          className='hover:text-secondary text-gray-700 md:hidden'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label='Ouvrir le menu mobile'
        >
          {isMobileMenuOpen ? (
            <FaTimes className='h-6 w-6' />
          ) : (
            <FaBars className='h-6 w-6' />
          )}
        </button>

        {/* Liens de navigation (version desktop) */}
        <nav className='hidden items-center space-x-6 md:flex'>
          <Link
            href='/help'
            className='hover:text-secondary flex items-center text-gray-700 transition'
          >
            <FaQuestionCircle className='mr-2' /> Centre d'aide
          </Link>
          <Link
            href='/messages'
            className='hover:text-secondary flex items-center text-gray-700 transition'
          >
            <FaEnvelope className='mr-2' /> Mes messages
          </Link>
          <Link
            href='/compte/rendez-vous'
            className='hover:text-secondary flex items-center text-gray-700 transition'
          >
            <FaCalendarAlt className='mr-2' /> Mes rendez-vous
          </Link>
          <Link
            href='/documents'
            className='hover:text-secondary flex items-center text-gray-700 transition'
          >
            <FaFileAlt className='mr-2' /> Mes documents
          </Link>
        </nav>

        {/* Menu "Mon compte" (version desktop) */}
        <div className='relative hidden md:block'>
          <button
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className='hover:text-secondary flex items-center text-gray-700'
            aria-label='Ouvrir le menu compte'
          >
            <FaUser className='mr-2' /> {user?.firstName || 'Utilisateur'}
            <FaChevronDown className='ml-2 h-4 w-4' />
          </button>

          {/* Menu déroulant */}
          {isAccountMenuOpen && (
            <div className='absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg'>
              <button
                className='w-full p-4 text-left text-gray-700 hover:bg-gray-100'
                onClick={handleCompteClick}
                onKeyDown={(e) => handleKeyDown(e, handleCompteClick)}
                aria-label='Aller à la page compte'
              >
                compte
              </button>
              <hr />
              <button
                className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                aria-label='Déconnexion'
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menu mobile (version mobile) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay semi-transparent */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-40 bg-black/10 backdrop-blur-md' // Réduire l'opacité
              onClick={() => setIsMobileMenuOpen(false)}
              onKeyDown={(e) =>
                handleKeyDown(e, () => setIsMobileMenuOpen(false))
              }
              aria-label='Fermer le menu mobile'
            />

            {/* Menu mobile (apparaît à droite) */}
            <motion.div
              initial={{ x: '100%' }} // Démarre à droite
              animate={{ x: 0 }} // Se déplace vers la gauche
              exit={{ x: '100%' }} // Disparaît vers la droite
              transition={{ type: 'tween', ease: 'easeInOut' }}
              className='fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-md'
            >
              <nav className='flex flex-col space-y-4 p-4'>
                <Link
                  href='/help'
                  className='hover:text-secondary flex items-center text-gray-700 transition'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaQuestionCircle className='mr-2' /> Centre d'aide
                </Link>
                <Link
                  href='/messages'
                  className='hover:text-secondary flex items-center text-gray-700 transition'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaEnvelope className='mr-2' /> Mes messages
                </Link>
                <Link
                  href='/appointments'
                  className='hover:text-secondary flex items-center text-gray-700 transition'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaCalendarAlt className='mr-2' /> Mes rendez-vous
                </Link>
                <Link
                  href='/documents'
                  className='hover:text-secondary flex items-center text-gray-700 transition'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaFileAlt className='mr-2' /> Mes documents
                </Link>

                {/* Menu "Mon compte" (version mobile) */}
                <div className='relative'>
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className='hover:text-secondary flex items-center text-gray-700'
                    aria-label='Ouvrir le menu compte'
                  >
                    <FaUser className='mr-2' /> {user?.firstName || 'Utilisateur'}
                    <FaChevronDown className='ml-2 h-4 w-4' />
                  </button>

                  {/* Menu déroulant */}
                  {isAccountMenuOpen && (
                    <div className='mt-2 ml-4 rounded-lg bg-white shadow-lg'>
                      <button
                        className='w-full p-4 text-left text-gray-700 hover:bg-gray-100'
                        onClick={handleCompteClick}
                        onKeyDown={(e) => handleKeyDown(e, handleCompteClick)}
                        aria-label='Aller à la page compte'
                      >
                        compte
                      </button>
                      <hr />
                      <button
                        className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                        aria-label='Déconnexion'
                        onClick={handleLogout}
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
