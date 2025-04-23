'use client';

interface SuppressionComptePopupProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SuppressionComptePopup({
  onConfirm,
  onCancel,
}: Readonly<SuppressionComptePopupProps>) {
  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6'>
        <h3 className='mb-4 text-xl font-bold'>Supprimer mon compte</h3>
        <div className='mb-6 space-y-4'>
          <p>
            Vous avez la possibilité de supprimer votre compte et les données
            associées. Cette action n'aura pas automatiquement pour effet de
            supprimer vos données personnelles des bases de données des
            soignants avec lesquels vous avez pris rendez-vous et/ou que vous
            avez consulté.
          </p>
          <p>
            Les soignants peuvent avoir un intérêt légitime à les conserver.
            Vous avez alors la possibilité d'exercer vos droits d'accès, de
            rectification ou d'effacement directement auprès de ces derniers.
          </p>
        </div>
        <div className='flex justify-end space-x-4'>
          <button
            onClick={onCancel}
            className='rounded bg-gray-200 px-4 py-2 transition hover:bg-gray-300'
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className='rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600'
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  );
}
