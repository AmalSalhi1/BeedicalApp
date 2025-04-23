'use client'
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const SyncUser = () => {
  const { user, isLoaded } = useUser();
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    if (isLoaded && user && !isSynced) {
      const syncUser = async () => {
        try {
          const response = await fetch('/api/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prenom: user.firstName,
              nom: user.lastName,
              email: user.primaryEmailAddress?.emailAddress
              // On envoie uniquement les champs provenant du formulaire d'inscription
            })
          });

          if (response.ok) {
            setIsSynced(true);
            console.log('Utilisateur synchronisé avec succès');
          } else {
            console.error('Erreur lors de la synchronisation');
          }
        } catch (error) {
          console.error('Erreur lors de l’appel à l’API sync-user', error);
        }
      };

      syncUser();
    }
  }, [user, isLoaded, isSynced]);

  return null;
};

export default SyncUser;
