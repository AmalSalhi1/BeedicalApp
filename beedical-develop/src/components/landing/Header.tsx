'use client';

import { SignInButton, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import dynamic from 'next/dynamic';


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { isSignedIn } = useAuth();

  const PatientHeader = dynamic(
    () => import('@/components/compte-patient/Header'),
    { ssr: false }
  );

  return isSignedIn ? <PatientHeader /> : (
    <header className='bg-accent relative z-50 flex items-center justify-between px-6 py-4 shadow-md'>
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

      {/* Menu Desktop */}
      <nav className='hidden flex-1 items-center justify-center gap-6 md:flex'>
        <Link
          href='/'
          className='hover:text-aqua-700 font-bold text-gray-700 transition'
          onClick={() => setIsMobileMenuOpen(false)}
        >
          À propos
        </Link>
        <Link
          href='/'
          className='hover:text-aqua-700 font-bold text-gray-700 transition'
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Contact
        </Link>
        <Link
          href='/'
          className='hover:text-aqua-700 font-bold text-gray-700 transition'
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Services
        </Link>
        
      </nav>

      <SignInButton mode='modal'>
        <Button className='bg-secondary hover:bg-aqua-700 ml-auto hidden text-white transition-all md:inline-block'>
          Se connecter
        </Button>
      </SignInButton>

      {/* Bouton Mobile */}
      <button
        className='text-gray-700 md:hidden'
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className='h-6 w-6' />
        ) : (
          <Menu className='h-6 w-6' />
        )}
      </button>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className='bg-accent absolute top-full left-0 z-50 w-full shadow-md md:hidden'>
          <nav className='flex flex-col items-center gap-4 py-6'>
            <Link
              href='/'
              className='text-gray-700 transition hover:text-gray-900'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              href='/'
              className='text-gray-700 transition hover:text-gray-900'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href='/'
              className='text-gray-700 transition hover:text-gray-900'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            
            <SignInButton mode='modal'>
              <Button className='bg-secondary hover:bg-aqua-700 text-white transition-all'>
                Se connecter
              </Button>
            </SignInButton>
          </nav>
        </div>
      )}
    </header>
  );
}
