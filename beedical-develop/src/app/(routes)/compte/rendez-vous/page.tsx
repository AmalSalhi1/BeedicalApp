'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/compte-patient/Header';
import Footer from '@/components/landing/Footer';
import { FaCalendarAlt, FaChevronLeft, FaMapMarkerAlt, FaUserMd, FaClock, FaTrashAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RendezVous {
  id: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  status: string;
  medecin: {
    id: number;
    prenom: string;
    nom: string;
    adresse?: string;
    codePostal?: string;
    telephone?: string;
    ville: {
      nom: string;
    };
    specialites: {
      specialite: {
        nom: string;
      };
    }[];
  };
  proche?: {
    id: number;
    prenom: string;
    nom: string;
  } | null;
}

export default function RendezVousPage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedRendezVous, setSelectedRendezVous] = useState<RendezVous | null>(null);
  const [cancelInProgress, setCancelInProgress] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetchRendezVous();
    }
  }, [isSignedIn]);

  const fetchRendezVous = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rendez-vous');
      if (response.ok) {
        const data = await response.json();
        setRendezVous(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      toast.error('Erreur lors de la récupération des rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRendezVous = async () => {
    if (!selectedRendezVous) return;

    setCancelInProgress(true);
    try {
      const response = await fetch(`/api/rendez-vous/${selectedRendezVous.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Rendez-vous annulé avec succès');
        setShowCancelDialog(false);
        fetchRendezVous();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de l\'annulation du rendez-vous');
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error);
      toast.error('Erreur lors de l\'annulation du rendez-vous');
    } finally {
      setCancelInProgress(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };

  const getRendezVousByStatus = (status: string) => {
    return rendezVous.filter(rdv => rdv.status === status);
  };

  return (
    <div className='flex min-h-screen flex-col bg-gray-100'>
      <Header />

      <div className='mx-auto w-full max-w-4xl p-6 pt-16 md:p-8'>
        <div className='mb-8 flex flex-col'>
          <button onClick={() => router.push('/compte')} className='text-secondary flex items-center text-lg'>
            <FaChevronLeft className='mr-4 text-gray-400' /> Mon compte
          </button>

          <div className='mt-4 flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-800'>Mes rendez-vous</h1>
            <button
              onClick={() => router.push('/Search')}
              className='bg-secondary hover:bg-secondary-dark flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow transition-all hover:shadow-md'
            >
              <FaCalendarAlt className='text-lg' />
              <span className='font-medium'>NOUVEAU RENDEZ-VOUS</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className='flex h-64 items-center justify-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent'></div>
          </div>
        ) : (
          <Tabs defaultValue='a-venir' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='a-venir'>À venir</TabsTrigger>
              <TabsTrigger value='passes'>Passés</TabsTrigger>
              <TabsTrigger value='annules'>Annulés</TabsTrigger>
            </TabsList>

            <TabsContent value='a-venir' className='mt-6'>
              {getRendezVousByStatus('reservé').length > 0 ? (
                <div className='space-y-4'>
                  {getRendezVousByStatus('reservé').map((rdv) => (
                    <div key={rdv.id} className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow'>
                      <div className='border-b border-gray-200 bg-blue-50 p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <FaCalendarAlt className='text-blue-600' />
                            <span className='font-medium capitalize text-blue-800'>{formatDate(rdv.date)}</span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedRendezVous(rdv);
                              setShowCancelDialog(true);
                            }}
                            className='text-red-500 hover:text-red-700'
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>

                      <div className='p-4'>
                        <div className='mb-4 flex items-start gap-4'>
                          <div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center'>
                            <FaUserMd className='text-blue-600' />
                          </div>

                          <div>
                            <h3 className='text-lg font-semibold text-gray-800'>
                              Dr. {rdv.medecin.prenom} {rdv.medecin.nom}
                            </h3>
                            <p className='text-gray-600'>
                              {rdv.medecin.specialites.map(s => s.specialite.nom).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className='space-y-2 text-sm text-gray-600'>
                          <div className='flex items-center gap-2'>
                            <FaClock className='text-gray-400' />
                            <span>{rdv.heureDebut} - {rdv.heureFin}</span>
                          </div>

                          <div className='flex items-center gap-2'>
                            <FaMapMarkerAlt className='text-gray-400' />
                            <span>
                              {rdv.medecin.adresse}, {rdv.medecin.codePostal} {rdv.medecin.ville.nom}
                            </span>
                          </div>

                          {rdv.proche && (
                            <div className='mt-4 rounded-md bg-purple-50 p-2 text-sm'>
                              <span className='font-medium text-purple-700'>
                                Rendez-vous pour {rdv.proche.prenom} {rdv.proche.nom}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex h-64 flex-col items-center justify-center text-center'>
                  <FaCalendarAlt className='mb-4 text-4xl text-gray-300' />
                  <h3 className='text-xl font-medium text-gray-700'>Aucun rendez-vous à venir</h3>
                  <p className='mt-2 text-gray-500'>
                    Vous n'avez pas de rendez-vous programmés pour le moment
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value='passes' className='mt-6'>
              {getRendezVousByStatus('terminé').length > 0 ? (
                <div className='space-y-4'>
                  {getRendezVousByStatus('terminé').map((rdv) => (
                    <div key={rdv.id} className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow opacity-75'>
                      <div className='border-b border-gray-200 bg-gray-50 p-4'>
                        <div className='flex items-center gap-2'>
                          <FaCalendarAlt className='text-gray-500' />
                          <span className='font-medium capitalize text-gray-700'>{formatDate(rdv.date)}</span>
                        </div>
                      </div>

                      <div className='p-4'>
                        <div className='mb-4 flex items-start gap-4'>
                          <div className='h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center'>
                            <FaUserMd className='text-gray-500' />
                          </div>

                          <div>
                            <h3 className='text-lg font-semibold text-gray-700'>
                              Dr. {rdv.medecin.prenom} {rdv.medecin.nom}
                            </h3>
                            <p className='text-gray-500'>
                              {rdv.medecin.specialites.map(s => s.specialite.nom).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className='space-y-2 text-sm text-gray-500'>
                          <div className='flex items-center gap-2'>
                            <FaClock className='text-gray-400' />
                            <span>{rdv.heureDebut} - {rdv.heureFin}</span>
                          </div>

                          <div className='flex items-center gap-2'>
                            <FaMapMarkerAlt className='text-gray-400' />
                            <span>
                              {rdv.medecin.adresse}, {rdv.medecin.codePostal} {rdv.medecin.ville.nom}
                            </span>
                          </div>

                          {rdv.proche && (
                            <div className='mt-4 rounded-md bg-gray-50 p-2 text-sm'>
                              <span className='font-medium text-gray-600'>
                                Rendez-vous pour {rdv.proche.prenom} {rdv.proche.nom}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex h-64 flex-col items-center justify-center text-center'>
                  <FaCalendarAlt className='mb-4 text-4xl text-gray-300' />
                  <h3 className='text-xl font-medium text-gray-700'>Aucun rendez-vous passé</h3>
                  <p className='mt-2 text-gray-500'>
                    Vous n'avez pas d'historique de rendez-vous
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value='annules' className='mt-6'>
              {getRendezVousByStatus('annulé').length > 0 ? (
                <div className='space-y-4'>
                  {getRendezVousByStatus('annulé').map((rdv) => (
                    <div key={rdv.id} className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow opacity-75'>
                      <div className='border-b border-gray-200 bg-red-50 p-4'>
                        <div className='flex items-center gap-2'>
                          <FaCalendarAlt className='text-red-500' />
                          <span className='font-medium capitalize text-red-700'>{formatDate(rdv.date)}</span>
                        </div>
                      </div>

                      <div className='p-4'>
                        <div className='mb-4 flex items-start gap-4'>
                          <div className='h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center'>
                            <FaUserMd className='text-gray-500' />
                          </div>

                          <div>
                            <h3 className='text-lg font-semibold text-gray-700'>
                              Dr. {rdv.medecin.prenom} {rdv.medecin.nom}
                            </h3>
                            <p className='text-gray-500'>
                              {rdv.medecin.specialites.map(s => s.specialite.nom).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className='space-y-2 text-sm text-gray-500'>
                          <div className='flex items-center gap-2'>
                            <FaClock className='text-gray-400' />
                            <span>{rdv.heureDebut} - {rdv.heureFin}</span>
                          </div>

                          <div className='flex items-center gap-2'>
                            <FaMapMarkerAlt className='text-gray-400' />
                            <span>
                              {rdv.medecin.adresse}, {rdv.medecin.codePostal} {rdv.medecin.ville.nom}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex h-64 flex-col items-center justify-center text-center'>
                  <FaCalendarAlt className='mb-4 text-4xl text-gray-300' />
                  <h3 className='text-xl font-medium text-gray-700'>Aucun rendez-vous annulé</h3>
                  <p className='mt-2 text-gray-500'>
                    Vous n'avez pas de rendez-vous annulés
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Annuler le rendez-vous</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>

          {selectedRendezVous && (
            <div className='mt-4 rounded-md bg-gray-50 p-4 text-sm'>
              <p className='font-medium text-gray-700'>
                Dr. {selectedRendezVous.medecin.prenom} {selectedRendezVous.medecin.nom}
              </p>
              <p className='mt-1 text-gray-600'>
                {formatDate(selectedRendezVous.date)} à {selectedRendezVous.heureDebut}
              </p>
            </div>
          )}

          <DialogFooter className='sm:justify-between'>
            <Button variant='outline' onClick={() => setShowCancelDialog(false)}>
              Retour
            </Button>
            <Button
              variant='destructive'
              onClick={handleCancelRendezVous}
              disabled={cancelInProgress}
            >
              {cancelInProgress ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  Annulation...
                </>
              ) : (
                'Annuler le rendez-vous'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
