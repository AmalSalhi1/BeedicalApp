'use client';

import { useState } from 'react';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface PasswordAnd2FAPopupProps
  extends Readonly<{
    onClose: () => void;
    onVerifyPhone: () => void;
    onVerifyEmail: () => void;
    phoneVerified: boolean;
    emailVerified: boolean;
    phoneNumber?: string;
    email?: string;
  }> {}

interface VerificationMethodProps {
  type: 'phone' | 'email';
  verified: boolean;
  value: string;
  enable2FA: boolean;
  onToggle: () => void;
  onVerify: () => void;
}

const VerificationMethod = ({
  type,
  verified,
  value,
  enable2FA,
  onToggle,
  onVerify,
}: VerificationMethodProps) => (
  <div
    className={`rounded border p-3 ${!verified ? 'border-gray-300' : 'border-green-300 bg-green-50'}`}
  >
    <div className='flex items-center justify-between'>
      <div className='flex items-center'>
        <input
          type='checkbox'
          checked={verified && enable2FA}
          onChange={onToggle}
          disabled={!verified}
          className='mr-2'
        />
        <span className='font-medium'>
          {type === 'phone' ? 'Téléphone' : 'Email'}
        </span>
      </div>
      {verified ? (
        <FaCheckCircle className='text-green-500' />
      ) : (
        <FaTimesCircle className='text-gray-400' />
      )}
    </div>
    <div className='mt-1 ml-6'>
      <p className='text-sm'>{value}</p>
      <p className='text-xs text-gray-500'>
        {verified ? 'Vérifié' : 'Non vérifié'}
      </p>
    </div>
    {!verified && (
      <button
        onClick={onVerify}
        className='text-primary mt-2 text-sm hover:underline'
      >
        Vérifier mon {type === 'phone' ? 'téléphone' : 'email'}
      </button>
    )}
  </div>
);

const PasswordTab = ({
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentChange,
  onNewChange,
  onConfirmChange,
}: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentChange: (value: string) => void;
  onNewChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
}) => (
  <div className='space-y-4'>
    <div>
      <label
        htmlFor='current-password'
        className='mb-1 block text-sm font-medium text-gray-700'
      >
        Mot de passe actuel
      </label>
      <input
        id='current-password'
        type='password'
        className='w-full rounded border p-2'
        value={currentPassword}
        onChange={(e) => onCurrentChange(e.target.value)}
      />
    </div>
    <div>
      <label
        htmlFor='new-password'
        className='mb-1 block text-sm font-medium text-gray-700'
      >
        Nouveau mot de passe
      </label>
      <input
        id='new-password'
        type='password'
        className='w-full rounded border p-2'
        value={newPassword}
        onChange={(e) => onNewChange(e.target.value)}
      />
    </div>
    <div>
      <label
        htmlFor='confirm-password'
        className='mb-1 block text-sm font-medium text-gray-700'
      >
        Confirmer le nouveau mot de passe
      </label>
      <input
        id='confirm-password'
        type='password'
        className='w-full rounded border p-2'
        value={confirmPassword}
        onChange={(e) => onConfirmChange(e.target.value)}
      />
    </div>
    <button className='bg-primary hover:bg-primary-dark w-full rounded py-2 text-white transition'>
      Enregistrer les modifications
    </button>
  </div>
);

export default function PasswordAnd2FAPopup({
  onClose,
  onVerifyPhone,
  onVerifyEmail,
  phoneVerified,
  emailVerified,
  phoneNumber = '0722663333',
  email = 'hafsa.daanouni20@ump.ac.ma',
}: PasswordAnd2FAPopupProps) {
  const [activeTab, setActiveTab] = useState<'password' | '2fa'>('password');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enable2FA, setEnable2FA] = useState(false);

  const canEnable2FA = phoneVerified || emailVerified;

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='w-full max-w-md rounded-lg bg-white p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-800'>
            {activeTab === 'password'
              ? 'Modifier le mot de passe'
              : 'Authentification à double facteur'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            &times;
          </button>
        </div>

        <div className='mb-4 flex border-b'>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'password' ? 'text-primary border-primary border-b-2' : 'text-gray-500'}`}
            onClick={() => setActiveTab('password')}
          >
            Mot de passe
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === '2fa' ? 'text-primary border-primary border-b-2' : 'text-gray-500'}`}
            onClick={() => setActiveTab('2fa')}
          >
            Double authentification
          </button>
        </div>

        {activeTab === 'password' ? (
          <PasswordTab
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onCurrentChange={setCurrentPassword}
            onNewChange={setNewPassword}
            onConfirmChange={setConfirmPassword}
          />
        ) : (
          <div className='space-y-4'>
            <div className='flex items-start'>
              <FaShieldAlt className='text-primary mt-1 mr-3 text-xl' />
              <div>
                <h3 className='font-medium'>
                  La sécurité au-delà du mot de passe
                </h3>
                <p className='text-sm text-gray-600'>
                  L'authentification à deux facteurs protège votre compte en
                  demandant un code de vérification lorsque vous vous connectez
                  avec un nouvel appareil.
                </p>
              </div>
            </div>

            <div className='space-y-3'>
              <VerificationMethod
                type='phone'
                verified={phoneVerified}
                value={phoneNumber}
                enable2FA={enable2FA}
                onToggle={() => setEnable2FA(!enable2FA)}
                onVerify={onVerifyPhone}
              />

              <VerificationMethod
                type='email'
                verified={emailVerified}
                value={email}
                enable2FA={enable2FA}
                onToggle={() => setEnable2FA(!enable2FA)}
                onVerify={onVerifyEmail}
              />
            </div>

            {canEnable2FA && (
              <button
                className={`mt-4 w-full rounded py-2 ${enable2FA ? 'bg-primary hover:bg-primary-dark text-white' : 'cursor-not-allowed bg-gray-200 text-gray-600'}`}
                disabled={!enable2FA}
              >
                Activer l'authentification à double facteur
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
