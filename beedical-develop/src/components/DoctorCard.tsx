"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, MapPin, Phone, Check, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

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

interface Disponibilite {
  id: number
  date: string
  heureDebut: string
  heureFin: string
}

interface DoctorCardProps {
  doctor: Doctor
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter()
  const { user, isSignedIn } = useUser()
  const [showPhone, setShowPhone] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [disponibilites, setDisponibilites] = useState<Record<string, Disponibilite[]>>({})
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Disponibilite | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [bookingInProgress, setBookingInProgress] = useState(false)
  const [proches, setProches] = useState<any[]>([])
  const [selectedProche, setSelectedProche] = useState<number | null>(null)

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

  const formatDate = (date: Date) => {
    const days = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"]
    const day = days[date.getDay()]
    return {
      dayName: day,
      dayNumber: date.getDate(),
      month: date.getMonth() + 1,
      fullDate: `${date.getDate()}/${date.getMonth() + 1}`,
      isoDate: date.toISOString().split('T')[0],
    }
  }

  useEffect(() => {
    if (selectedDate) {
      fetchDisponibilites()
    }
  }, [selectedDate])

  useEffect(() => {
    if (isSignedIn) {
      fetchProches()
    }
  }, [isSignedIn])

  const fetchProches = async () => {
    try {
      const response = await fetch('/api/proches')
      if (response.ok) {
        const data = await response.json()
        setProches(data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des proches:', error)
    }
  }

  const fetchDisponibilites = async () => {
    if (!selectedDate) return

    setLoading(true)
    try {
      const selectedDateObj = dates.find(
        date => formatDate(date).fullDate === selectedDate
      )

      if (!selectedDateObj) return

      const isoDate = formatDate(selectedDateObj).isoDate

      const response = await fetch(`/api/disponibilites?medecinId=${doctor.id}&date=${isoDate}`)
      if (response.ok) {
        const data = await response.json()
        setDisponibilites(data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des disponibilités:', error)
    } finally {
      setLoading(false)
    }
  }

  const isAvailable = (date: Date) => {
    return date.getDay() !== 0
  }

  const handleBookAppointment = async () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    if (selectedDate && !selectedSlot) {
      setShowDialog(true)
      return
    }

    if (selectedSlot) {
      setBookingInProgress(true)
      try {
        const response = await fetch('/api/rendez-vous', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: selectedSlot.date,
            heureDebut: selectedSlot.heureDebut,
            heureFin: selectedSlot.heureFin,
            medecinId: doctor.id,
            procheId: selectedProche,
          }),
        })

        if (response.ok) {
          toast.success('Rendez-vous réservé avec succès!')
          setShowDialog(false)
          setSelectedSlot(null)
          router.push('/compte/rendez-vous')
        } else {
          const error = await response.json()
          toast.error(error.error || 'Erreur lors de la réservation')
        }
      } catch (error) {
        console.error('Erreur lors de la réservation:', error)
        toast.error('Erreur lors de la réservation')
      } finally {
        setBookingInProgress(false)
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
       
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

          <div className="mt-4">
            <button
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
              onClick={handleBookAppointment}
            >
              {selectedDate ? `Prendre RDV le ${selectedDate}` : "Prendre rendez-vous"}
            </button>
          </div>
        </div>
      </div>

      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Prendre rendez-vous</DialogTitle>
            <DialogDescription>
              Choisissez un créneau horaire pour votre rendez-vous avec {doctor.nom}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="horaires" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="horaires">Horaires</TabsTrigger>
              <TabsTrigger value="patient">Patient</TabsTrigger>
            </TabsList>

            <TabsContent value="horaires" className="mt-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                </div>
              ) : selectedDate && disponibilites[formatDate(dates.find(d => formatDate(d).fullDate === selectedDate)!).isoDate]?.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {disponibilites[formatDate(dates.find(d => formatDate(d).fullDate === selectedDate)!).isoDate].map((slot) => (
                    <button
                      key={slot.id}
                      className={`flex items-center justify-center gap-1 rounded-md border p-2 text-sm ${
                        selectedSlot?.id === slot.id
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <Clock className="h-3 w-3" />
                      {slot.heureDebut}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Aucun créneau disponible pour cette date
                </div>
              )}
            </TabsContent>

            <TabsContent value="patient" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Pour qui prenez-vous rendez-vous ?</h3>
                  <div className="space-y-2">
                    <button
                      className={`flex w-full items-center gap-2 rounded-md border p-3 text-left ${
                        selectedProche === null
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                      }`}
                      onClick={() => setSelectedProche(null)}
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {user?.firstName?.charAt(0) || "M"}
                      </div>
                      <div>
                        <div className="font-medium">{user?.fullName || "Moi-même"}</div>
                      </div>
                    </button>

                    {proches.map((proche) => (
                      <button
                        key={proche.id}
                        className={`flex w-full items-center gap-2 rounded-md border p-3 text-left ${
                          selectedProche === proche.id
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                        }`}
                        onClick={() => setSelectedProche(proche.id)}
                      >
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          {proche.prenom.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{proche.prenom} {proche.nom}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleBookAppointment}
              disabled={!selectedSlot || bookingInProgress}
            >
              {bookingInProgress ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Réservation...
                </>
              ) : (
                "Confirmer le rendez-vous"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
