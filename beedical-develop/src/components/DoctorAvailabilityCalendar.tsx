// DoctorAvailabilityCalendar.tsx
'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/Calendar';

interface DoctorAvailabilityCalendarProps {
  readonly disponibilite: string[];
}

export function DoctorAvailabilityCalendar({
  disponibilite,
}: DoctorAvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <Calendar
      mode='single'
      selected={selectedDate}
      onSelect={setSelectedDate}
      className='border-none shadow-none'
      disabled={(date) =>
        !disponibilite.includes(date.toISOString().split('T')[0])
      }
    />
  );
}
