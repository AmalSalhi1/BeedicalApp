'use client';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaPen, FaCamera } from 'react-icons/fa';
import Header from '@/components/compte-patient/Header';
import Footer from '@/components/landing/Footer';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface UserInfo {
  sexe: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  lieuNaissance: string;
  
  adresse: string;
  codePostal: string;
  ville: string;
  telephone: string;
  email: string;
  assuranceMaladie: string;
  cin: string;
  profession: string;
  photoProfil?: string;
}

export default function EditComptePage() {
  const { isLoaded, user } = useUser();
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({
    prenom: user?.firstName ?? '',
    nom: user?.lastName ?? '',
    email: user?.emailAddresses[0]?.emailAddress ?? '',
    sexe: '',
    dateNaissance: '',
    lieuNaissance: '',
    ville: '',
    adresse: '',
    codePostal: '',
    telephone: '',
    assuranceMaladie: '',
    cin: '',
    profession: '',
    photoProfil: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      loadProfile();
    }
  }, [isLoaded]);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profil', {
        cache: 'no-store'
      });
      
      if (!response.ok) throw new Error('Failed to load profile');
      
      const profileData = await response.json();
      
      setUserInfo(prev => ({
        ...prev,
        ...profileData,
        email: user?.emailAddresses[0]?.emailAddress ?? profileData.email
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.push('/compte');
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    const requiredFields = {
      sexe: 'Le sexe est obligatoire',
      prenom: 'Le prénom est obligatoire',
      nom: 'Le nom est obligatoire',
      dateNaissance: 'La date de naissance est obligatoire',
      lieuNaissance: 'Le lieu de naissance est obligatoire',
      
      adresse: 'L\'adresse est obligatoire',
      codePostal: 'Le code postal est obligatoire',
      ville: 'La ville est obligatoire',
      telephone: 'Le téléphone est obligatoire',
      assuranceMaladie: 'L\'assurance maladie est obligatoire',
      cin: 'Le CIN est obligatoire',
    };

    const newErrors: Record<string, string> = {};
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!userInfo[field as keyof UserInfo]) newErrors[field] = message;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userInfo,
          dateNaissance: userInfo.dateNaissance ?? '2000-01-01',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? 'Erreur lors de l\'enregistrement');
      }

      await loadProfile();
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ form: error instanceof Error ? error.message : 'Une erreur est survenue' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo(prev => ({
          ...prev,
          photoProfil: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Liste des champs à afficher en mode lecture
  const displayFields = [
    'sexe', 'prenom', 'nom', 'dateNaissance', 'lieuNaissance', 
    'adresse', 'codePostal', 'ville', 
    'telephone', 'email', 'assuranceMaladie', 'cin', 'profession'
  ];

  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p>Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col bg-gray-100'>
      <Header />
      <div className='mx-auto w-full max-w-4xl p-6 md:p-8'>
        <div className='mb-6'>
          <button
            onClick={goBack}
            className='text-secondary flex items-center text-lg'
          >
            <FaChevronLeft className='mr-4 text-gray-400' /> Mon compte
          </button>
          <h2 className='mt-6 text-xl font-bold text-gray-800'>Mon profil</h2>
        </div>

        {errors.form && (
          <div className='mb-4 rounded bg-red-100 p-3 text-red-700'>
            {errors.form}
          </div>
        )}

        {!isEditing ? (
          <div className='mb-8 rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-4 flex justify-end'>
              <button
                onClick={toggleEditMode}
                className='text-secondary flex items-center hover:underline'
              >
                <FaPen className='mr-2' />
                Modifier
              </button>
            </div>
            <div className='mb-6 flex items-center space-x-4'>
              <div className='bg-secondary flex h-16 w-16 items-center justify-center overflow-hidden rounded-full text-2xl font-bold text-white'>
                {userInfo.photoProfil?.startsWith('data:image') ? (
                  <img
                    src={userInfo.photoProfil}
                    alt={`${userInfo.prenom} ${userInfo.nom}`}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <span>{userInfo.prenom?.[0]}{userInfo.nom?.[0]}</span>
                )}
              </div>
              <div>
                <p className='text-lg font-bold text-gray-800'>
                  {userInfo.nom} {userInfo.prenom}
                </p>
                <p className='text-sm text-gray-600'>Profil</p>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {displayFields.map((field) => (
                userInfo[field as keyof UserInfo] && (
                  <div key={field} className='rounded-lg bg-gray-50 p-4'>
                    <p className='text-sm text-gray-500'>
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className='font-medium text-gray-800'>
                      {field === 'dateNaissance' 
                        ? new Date(userInfo[field] as string).toLocaleDateString('fr-FR') 
                        : userInfo[field as keyof UserInfo]}
                    </p>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className='rounded-lg bg-white p-6 shadow-md'
          >
            <div className='mb-6 flex justify-center'>
              <label htmlFor='photoProfil' className='relative cursor-pointer'>
                <div className='bg-secondary relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full text-2xl font-bold text-white'>
                  {userInfo.photoProfil?.startsWith('data:image') ? (
                    <img
                      src={userInfo.photoProfil}
                      alt={`${userInfo.prenom} ${userInfo.nom}`}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <span>{userInfo.prenom?.[0]}{userInfo.nom?.[0]}</span>
                  )}
                  <div className='bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black opacity-0 transition-opacity hover:opacity-100'>
                    <FaCamera className='text-xl text-white' />
                  </div>
                </div>
                <input
                  type='file'
                  id='photoProfil'
                  onChange={handlePhotoChange}
                  className='hidden'
                  accept='image/*'
                />
              </label>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {Object.entries({
                sexe: { type: 'select', options: ['Homme', 'Femme'] },
                prenom: { type: 'text' },
                nom: { type: 'text' },
                dateNaissance: { type: 'date' },
                lieuNaissance: { type: 'text' },
               
                adresse: { type: 'text' },
                codePostal: { type: 'text' },
                ville: { type: 'text' },
                telephone: { type: 'tel' },
                email: { type: 'email', disabled: true },
                assuranceMaladie: { type: 'text' },
                cin: { type: 'text' },
                profession: { type: 'text' },
              }).map(([field, config]) => (
                <div key={field} className='mb-4'>
                  <label
                    htmlFor={field}
                    className='text-secondary block text-sm font-medium'
                  >
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  {config.type === 'select' ? (
                    <select
                      id={field}
                      value={userInfo[field as keyof UserInfo] as string || ''}
                      onChange={(e) =>
                        setUserInfo(prev => ({
                          ...prev,
                          [field]: e.target.value
                        }))
                      }
                      className='border-secondary mt-1 block w-full rounded-md p-2'
                    >
                      <option value=''>Sélectionnez</option>
                      {config.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={config.type}
                      id={field}
                      value={userInfo[field as keyof UserInfo] as string || ''}
                      onChange={(e) =>
                        setUserInfo(prev => ({
                          ...prev,
                          [field]: e.target.value
                        }))
                      }
                      className='focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm'
                      disabled={config.disabled}
                    />
                  )}
                  {errors[field] && (
                    <p className='mt-1 text-sm text-red-500'>{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className='flex justify-end space-x-4'>
              <button
                type='button'
                onClick={toggleEditMode}
                className='rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-400'
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type='submit'
                className='bg-secondary hover:bg-secondary-dark rounded-md px-4 py-2 text-white transition'
                disabled={isLoading}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}