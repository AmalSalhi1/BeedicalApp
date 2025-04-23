// components/Section.tsx
'use client';
import { useRouter } from 'next/navigation';
import { FaChevronRight } from 'react-icons/fa';
import { JSX } from 'react';

interface SectionProps {
  readonly title: string;
  readonly description: string;
  readonly icon: JSX.Element;
  readonly pageLink?: string;
  readonly danger?: boolean;
  readonly onClick?: () => void;
  readonly verified?: boolean; // Nouvelle prop
  readonly showVerificationStatus?: boolean; // Option pour afficher/masquer le statut
}

export default function Section({
  title,
  description,
  icon,
  pageLink = '#',
  danger = false,
  onClick,
  verified = false,
  showVerificationStatus = false,
}: SectionProps) {
  const router = useRouter();

  const handleNavigate = () => {
    if (onClick) {
      onClick();
    } else if (pageLink) {
      router.push(pageLink);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleNavigate();
    }
  };

  return (
    <button
      className={`mb-4 flex w-full items-center justify-between rounded-lg border-l-4 bg-white p-6 shadow-md ${
        danger ? 'border-red-500' : 'border-primary'
      } text-left transition hover:bg-gray-50`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      aria-label={`Accéder à ${title}`}
    >
      <div className='flex items-center space-x-4'>
        {icon}
        <div>
          <h2
            className={`text-lg font-semibold ${danger ? 'text-red-500' : 'text-gray-800'}`}
          >
            {title}
          </h2>
          <p className='text-sm text-gray-600'>{description}</p>
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        {/* Affiche le statut de vérification si demandé */}
        {showVerificationStatus && (
          <span
            className={`rounded-full px-2 py-1 text-xs ${
              verified
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {verified ? 'Vérifié' : 'Non vérifié'}
          </span>
        )}
        <FaChevronRight className={danger ? 'text-red-500' : 'text-gray-400'} />
      </div>
    </button>
  );
}