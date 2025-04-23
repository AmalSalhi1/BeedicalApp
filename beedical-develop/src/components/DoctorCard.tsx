// DoctorCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { DoctorAvailabilityCalendar } from '@/components/DoctorAvailabilityCalendar';

interface DoctorCardProps {
  readonly doctor: {
    readonly id: number;
    readonly nom: string;
    readonly specialite: string;
    readonly location: string;
    readonly image: string;
    readonly disponibilite: string[];
  };
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className='mb-6 flex flex-col gap-6 rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg md:flex-row'>
      {/* Section 1 : Carte du médecin */}
      <div className='flex-1'>
        <div className='flex items-center gap-4'>
          <div className='relative h-20 w-20'>
            <Image
              src={doctor.image || '/images/default.png'}
              alt={doctor.nom}
              width={80}
              height={80}
              className='rounded-full object-cover'
            />
          </div>
          <div>
            <h3 className='text-xl font-bold'>{doctor.nom}</h3>
            <p className='text-gray-600'>{doctor.specialite}</p>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <MapPinIcon className='h-5 w-5 text-gray-500' />
              <p>{doctor.location}</p>
            </div>
          </div>
        </div>
        <div className='mt-4 flex flex-col gap-2'>
          <Link
            href={`/doctor/${doctor.id}`}
            className='bg-primary hover:bg-primary-700 rounded-lg px-4 py-2 text-center text-white transition-colors'
          >
            Prendre rendez-vous
          </Link>
        </div>
      </div>

      {/* Ligne de séparation */}
      <div className='mx-4 hidden border-l border-gray-200 md:block'></div>

      {/* Section 2 : Calendrier de disponibilités */}
      <div className='flex-1'>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className='text-primary hover:text-primary-700 mb-4 text-sm underline'
        >
          Prochain RDV
        </button>

        {showCalendar && (
          <div>
            <h4 className='mb-4 text-lg font-semibold'>Disponibilités</h4>
            <DoctorAvailabilityCalendar disponibilite={doctor.disponibilite} />
          </div>
        )}
      </div>
    </div>
  );
}
