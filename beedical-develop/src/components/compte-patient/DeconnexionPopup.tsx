'use client';

interface DeconnexionPopupProps {
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export default function DeconnexionPopup({
  onConfirm,
  onCancel,
}: DeconnexionPopupProps) {
  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-md rounded-lg bg-white p-6'>
        <h3 className='mb-4 text-xl font-bold'>Confirmer la déconnexion</h3>
        <p className='mb-6'>
          Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
        </p>
        <div className='flex justify-end space-x-4'>
          <button
            onClick={onCancel}
            className='rounded bg-gray-200 px-4 py-2 transition hover:bg-gray-300'
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className='bg-primary hover:bg-primary-dark rounded px-4 py-2 text-white transition'
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
