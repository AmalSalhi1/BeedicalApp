"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, MapPin, Phone, Check } from "lucide-react"

interface Doctor {
  id: number
  nom: string
  specialite: string
  disponibilite: string[]
  image: string
  location: string
  latitude: number
  longitude: number
  accepteNouveaux: boolean
  secteur: number
  adresse?: string
  codePostal?: string
  telephone?: string
}

interface DoctorCardProps {
  doctor: Doctor
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const [showPhone, setShowPhone] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Get current date and next 6 days
  const getDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  const dates = getDates()

  // Format date for display
  const formatDate = (date: Date) => {
    const days = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"]
    const day = days[date.getDay()]
    return {
      dayName: day,
      dayNumber: date.getDate(),
      month: date.getMonth() + 1,
      fullDate: `${date.getDate()}/${date.getMonth() + 1}`,
    }
  }

  // Check if doctor is available on a specific date
  const isAvailable = (date: Date) => {
    const day = date.getDay()
    const dayNames = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
    return doctor.disponibilite.includes(dayNames[day])
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Doctor Info */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full">
              <Image
                src={doctor.image || "/placeholder.svg?height=80&width=80"}
                alt={doctor.nom}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-black">{doctor.nom}</h2>
              <p className="text-gray-600">{doctor.specialite}</p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    doctor.secteur === 1
                      ? "bg-green-100 text-green-800"
                      : doctor.secteur === 2
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  Secteur {doctor.secteur}
                </span>

                {doctor.accepteNouveaux && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    <Check className="h-3 w-3" />
                    Accepte nouveaux patients
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {doctor.adresse && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {doctor.adresse}
                  {doctor.codePostal ? `, ${doctor.codePostal}` : ""} {doctor.location}
                </span>
              </div>
            )}

            {doctor.telephone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                {showPhone ? (
                  <span className="text-sm font-medium text-gray-700">{doctor.telephone}</span>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Afficher le numéro
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Availability Calendar */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 md:border-l md:border-t-0">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Disponibilités</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {dates.map((date, index) => {
              const { dayName, dayNumber, fullDate } = formatDate(date)
              const available = isAvailable(date)

              return (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">{dayName}</span>
                  <div
                    className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      available
                        ? selectedDate === fullDate
                          ? "bg-blue-600 text-white"
                          : "cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-400"
                    }`}
                    onClick={() => available && setSelectedDate(fullDate)}
                  >
                    {dayNumber}
                  </div>
                </div>
              )
            })}
          </div>

          {selectedDate ? (
            <div className="mt-4">
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700">
                Prendre RDV le {selectedDate}
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700">
                Prendre rendez-vous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
