'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { FaChevronLeft, FaUsers, FaEdit, FaTrash, FaBell, FaCamera, FaExclamationTriangle } from 'react-icons/fa';
import { IoMdPersonAdd } from 'react-icons/io';
import Header from '@/components/compte-patient/Header';
import Footer from '@/components/landing/Footer';

type Proche = {
  id: string;
  photoProfil: string;
  sexe: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  lieuNaissance: string;
  villeNaissance: string;
  telephone: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
};

const initialProcheState = {
  photoProfil: '',
  sexe: 'Homme',
  prenom: '',
  nom: '',
  dateNaissance: '',
  lieuNaissance: '',
  villeNaissance: '',
  telephone: '',
  adresse: '',
  codePostal: '',
  ville: '',
};

export default function MesProchesPage() {
  const router = useRouter();
  const { user } = useUser();
  const [state, setState] = useState({
    showForm: false,
    proches: [] as Proche[],
    phoneVerified: false,
    emailVerified: false,
    showVerificationAlert: false,
    loading: true,
    legalRepresentative: false,
    newProche: initialProcheState,
    errors: {} as Record<string, string>
  });
  const [editingProche, setEditingProche] = useState<Proche | null>(null);

  useEffect(() => {
    setState(prev => ({ ...prev, phoneVerified: true, emailVerified: true }));
    fetchProches();
  }, [user]);

  const fetchProches = async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/proches');
      if (response.ok) {
        const proches = await response.json();
        setState(prev => ({ ...prev, proches, loading: false }));
      }
    } catch (error) {
      console.error('Erreur:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleAddProche = () => {
    if (!state.phoneVerified || !state.emailVerified) {
      setState(prev => ({ ...prev, showVerificationAlert: true }));
      return;
    }
    setState(prev => ({ ...prev, showForm: true, showVerificationAlert: false }));
    setEditingProche(null);
  };

  const handleEditProche = (proche: Proche) => {
    setEditingProche(proche);
    setState(prev => ({
      ...prev,
      showForm: true,
      newProche: {
        photoProfil: proche.photoProfil ?? '',
        sexe: proche.sexe ?? '',
        prenom: proche.prenom ?? '',
        nom: proche.nom ?? '',
        dateNaissance: proche.dateNaissance ?? '',
        lieuNaissance: proche.lieuNaissance ?? '',
        villeNaissance: proche.villeNaissance ?? '',
        telephone: proche.telephone ?? '',
        adresse: proche.adresse ?? '',
        codePostal: proche.codePostal ?? '',
        ville: proche.ville ?? ''
      }
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          newProche: {
            ...prev.newProche,
            photoProfil: reader.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setState(prev => ({ 
      ...prev, 
      newProche: { ...prev.newProche, [field]: value },
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  const validateForm = () => {
    const { newProche, legalRepresentative } = state;
    const errors: Record<string, string> = {};
    
    if (!newProche.prenom) errors.prenom = 'Le prénom est requis';
    if (!newProche.nom) errors.nom = 'Le nom est requis';
    if (!newProche.dateNaissance) errors.dateNaissance = 'La date de naissance est requise';
    if (!newProche.telephone || newProche.telephone.length < 10) errors.telephone = 'Numéro invalide (10 chiffres minimum)';
    if (!legalRepresentative) errors.legalRepresentative = 'Vous devez confirmer cette déclaration';

    setState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const method = editingProche ? 'PUT' : 'POST';
      const url = editingProche ? `/api/proches/${editingProche.id}` : '/api/proches';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...state.newProche, userId: user?.id })
      });

      if (response.ok) {
        const updatedProche = await response.json();
        setState(prev => ({
          ...prev,
          proches: editingProche 
            ? prev.proches.map(p => p.id === updatedProche.id ? updatedProche : p)
            : [...prev.proches, updatedProche],
          showForm: false,
          newProche: initialProcheState,
          legalRepresentative: false,
          errors: {}
        }));
        setEditingProche(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleCancel = () => {
    setState(prev => ({ 
      ...prev, 
      showForm: false, 
      newProche: initialProcheState,
      errors: {},
      legalRepresentative: false 
    }));
    setEditingProche(null);
  };

  const handleDeleteProche = async (procheId: string) => {
    try {
      const response = await fetch(`/api/proches/${procheId}`, { method: 'DELETE' });
      if (response.ok) {
        setState(prev => ({ 
          ...prev, 
          proches: prev.proches.filter(proche => proche.id !== procheId) 
        }));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (state.loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p>Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <div className='sticky top-0 z-50'>
        <Header />
      </div>

      <div className='mx-auto w-full max-w-4xl p-6 pt-16 md:p-8'>
        <div className='mb-8 flex flex-col'>
          <button onClick={() => router.push('/compte')} className='text-secondary flex items-center text-lg'>
            <FaChevronLeft className='mr-4 text-gray-400' /> Mon compte
          </button>
          
          <div className='mt-4 flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-800'>Mes proches</h1>
            {!state.showForm && (
              <button onClick={handleAddProche} className='bg-secondary hover:bg-secondary-dark flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow transition-all hover:shadow-md'>
                <IoMdPersonAdd className='text-lg' />
                <span className='font-medium'>AJOUTER UN PROCHE</span>
              </button>
            )}
          </div>
        </div>

        {state.showVerificationAlert && (
          <div className='mb-6 rounded border-l-4 border-yellow-400 bg-yellow-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className='ml-3'>
                <p className='text-sm text-yellow-700'>
                  Vous devez vérifier votre email et téléphone avant d'ajouter un proche.
                </p>
              </div>
            </div>
          </div>
        )}

        {state.showForm && (
          <form onSubmit={handleSubmit} className='mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-md'>
            <h2 className='mb-6 text-xl font-semibold text-gray-800'>
              {editingProche ? 'Modifier un proche' : 'Ajouter un proche'}
            </h2>
            
            <div className='mb-6 flex justify-center'>
              <label htmlFor='photoProfil' className='relative cursor-pointer'>
                <div className='relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-white'>
                  {state.newProche.photoProfil ? (
                    <img src={state.newProche.photoProfil} alt='Profil' className='h-full w-full object-cover' />
                  ) : (
                    <span className='text-4xl text-gray-500'>+</span>
                  )}
                  <div className='bg-black/15bg-opacity-30 absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity hover:opacity-100'>
                    <FaCamera className='text-xl text-white' />
                  </div>
                </div>
                <input type='file' id='photoProfil' onChange={handlePhotoChange} className='hidden' accept='image/*' />
              </label>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {[
                { id: 'sexe', type: 'select', options: ['Homme', 'Femme'] },
                { id: 'prenom', type: 'text' },
                { id: 'nom', type: 'text' },
                { id: 'dateNaissance', type: 'date' },
                { id: 'telephone', type: 'tel' },
                { id: 'lieuNaissance', type: 'text' },
                { id: 'villeNaissance', type: 'text' },
                { id: 'adresse', type: 'text' },
                { id: 'codePostal', type: 'text' },
                { id: 'ville', type: 'text' }
              ].map(({ id, type, options }) => (
                <div key={id} className='mb-4'>
                  <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
                    {id.split(/(?=[A-Z])/).join(' ')}
                  </label>
                  {type === 'select' ? (
                    <select
                      id={id}
                      value={state.newProche[id as keyof typeof initialProcheState] || ''}
                      onChange={(e) => handleInputChange(id, e.target.value)}
                      className='focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm'
                    >
                      {options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      id={id}
                      value={state.newProche[id as keyof typeof initialProcheState] || ''}
                      onChange={(e) => handleInputChange(id, e.target.value)}
                      className='focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm'
                    />
                  )}
                  {state.errors[id] && <p className='mt-1 text-sm text-red-500'>{state.errors[id]}</p>}
                </div>
              ))}
            </div>

            <div className='mt-6 mb-6'>
              <div className='relative flex items-start'>
                <div className='flex h-5 items-center'>
                  <input
                    id='legalRepresentative'
                    type='checkbox'
                    checked={state.legalRepresentative}
                    onChange={(e) => setState(prev => ({ ...prev, legalRepresentative: e.target.checked }))}
                    className='text-primary focus:ring-primary h-4 w-4 rounded border-gray-300'
                  />
                </div>
                <div className='ml-3 text-sm'>
                  <label htmlFor='legalRepresentative' className='font-medium text-gray-700'>
                    Je déclare être le représentant légal de mon proche.
                  </label>
                </div>
              </div>
              {state.errors.legalRepresentative && <p className='mt-1 text-sm text-red-500'>{state.errors.legalRepresentative}</p>}
            </div>

            <div className='flex justify-end space-x-4'>
              <button
                type='button'
                onClick={handleCancel}
                className='rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-400'
              >
                Annuler
              </button>
              <button 
                type='submit' 
                className='bg-secondary hover:bg-secondary-dark rounded-md px-4 py-2 text-white transition'
              >
                {editingProche ? 'Enregistrer les modifications' : 'Ajouter ce proche'}
              </button>
            </div>
          </form>
        )}

        {state.proches.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {state.proches.map((proche) => (
              <div key={proche.id} className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md'>
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0'>
                    {proche.photoProfil ? (
                      <img className='h-16 w-16 rounded-full object-cover' src={proche.photoProfil} alt={`${proche.prenom} ${proche.nom}`} />
                    ) : (
                      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-500'>
                        <FaUsers className='text-2xl' />
                      </div>
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h3 className='text-lg font-medium text-gray-900'>{proche.prenom} {proche.nom}</h3>
                    <p className='text-sm text-gray-500'>Né(e) le {proche.dateNaissance} à {proche.villeNaissance}</p>
                    {proche.adresse && <p className='mt-1 text-sm text-gray-500'>{proche.adresse}, {proche.codePostal} {proche.ville}</p>}
                  </div>
                  <div className='flex space-x-2'>
                    <button 
                      onClick={() => handleEditProche(proche)} 
                      className='hover:text-primary text-gray-400 transition-colors'
                    >
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteProche(proche.id)} className='text-gray-400 transition-colors hover:text-red-500'>
                      <FaTrash />
                    </button>
                    <button className='hover:text-secondary text-gray-400 transition-colors'>
                      <FaBell />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !state.showForm && (
            <div className='mt-12 py-12 text-center'>
              <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100'>
                <FaUsers className='text-3xl text-gray-400' />
              </div>
              <h3 className='mb-2 text-xl font-medium text-gray-700'>Aucun proche ajouté</h3>
              <p className='mx-auto max-w-md text-gray-500'>Commencez par ajouter un proche pour gérer ses rendez-vous</p>
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
}