import Link from 'next/link';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  Mail,
  Phone,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className='bg-grey-950 py-8 text-white'>
      <div className='container mx-auto max-w-6xl px-6'>
        <div className='grid grid-cols-1 gap-6 text-center md:grid-cols-3 md:text-left'>
          {/* Section 1 : Logo et description */}
          <div>
            <h2 className='text-lg font-bold'>Beedical</h2>
            <p className='mt-2 text-gray-300'>
              La plateforme qui vous connecte avec les meilleurs professionnels
              de santé.
            </p>
          </div>

          {/* Section 2 : Liens*/}
          <div>
            <h3 className='text-lg font-bold'>Liens</h3>
            <ul className='mt-2 space-y-2'>
              <li>
                <Link href='/' className='transition hover:text-gray-300'>
                  Accueil
                </Link>
              </li>
              <li>
                <Link href='/about' className='transition hover:text-gray-300'>
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='transition hover:text-gray-300'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3 : Contact */}
          <div>
            <h3 className='text-lg font-bold'>Contact</h3>
            <ul className='mt-2 space-y-2'>
              <li className='flex items-center justify-center gap-2 md:justify-start'>
                <Mail className='h-5 w-5 text-gray-300' />
                <span>contact@beedical.com</span>
              </li>
              <li className='flex items-center justify-center gap-2 md:justify-start'>
                <Phone className='h-5 w-5 text-gray-300' />
                <span>+212 600 569843</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className='mt-6 flex justify-center space-x-6'>
          <Link href='#' className='transition hover:text-gray-300'>
            <FacebookIcon className='h-6 w-6' />
          </Link>
          <Link href='#' className='transition hover:text-gray-300'>
            <TwitterIcon className='h-6 w-6' />
          </Link>
          <Link href='#' className='transition hover:text-gray-300'>
            <InstagramIcon className='h-6 w-6' />
          </Link>
        </div>

        {/* Copyright */}
        <p className='mt-6 text-center text-gray-300'>
          © {new Date().getFullYear()} Beedical. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
