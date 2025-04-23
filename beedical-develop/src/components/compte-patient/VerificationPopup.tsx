'use client';
import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaArrowLeft,
  FaShieldAlt,
  FaEdit,
} from 'react-icons/fa';
import validator from 'validator';
interface VerificationPopupProps {
  type: 'phone' | 'email';
  currentValue: string;
  onClose: () => void;
  onVerified: (value: string) => void;
  onUpdate?: (newValue: string) => Promise<boolean>;
}

const VerificationPopup: React.FC<VerificationPopupProps> = ({
  type,
  currentValue,
  onClose,
  onVerified,
  onUpdate,
}) => {
  const [mode, setMode] = useState<'choose' | 'modify' | 'verify'>('choose');
  const [value, setValue] = useState(currentValue);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  }>({ text: '', type: 'info' });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ value: '', code: '' });
  const [isFormValid, setIsFormValid] = useState(false);

  // Regex patterns for validation

  const codeRegex = /^\d{6}$/;

  // Real-time validation
  useEffect(() => {
    validateForm();
  }, [value, code, mode, isCodeSent]);

  const validateMainField = (newErrors: {
    value: string;
    code: string;
  }): boolean => {
    if (!value.trim()) {
      newErrors.value = `Le ${type === 'phone' ? 'numéro de téléphone' : 'email'} est requis`;
      return false;
    } else if (type === 'phone') {
      if (!validator.isMobilePhone(value, 'any')) {
        // Utilisation de validator
        newErrors.value = 'Format de téléphone invalide';
        return false;
      }
    } else if (type === 'email') {
      if (!validator.isEmail(value)) {
        // Utilisation de validator
        newErrors.value = "Format d'email invalide";
        return false;
      }
    }
    return true;
  };

  const validateVerificationCode = (newErrors: {
    value: string;
    code: string;
  }): boolean => {
    if (!code.trim()) {
      newErrors.code = 'Le code de vérification est requis';
      return false;
    } else if (!codeRegex.test(code)) {
      newErrors.code = 'Le code doit contenir 6 chiffres';
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const newErrors = { value: '', code: '' };
    let isValid = true;

    if (mode !== 'choose') {
      isValid = validateMainField(newErrors) && isValid;

      if (isCodeSent) {
        isValid = validateVerificationCode(newErrors) && isValid;
      }
    }

    setErrors(newErrors);
    setIsFormValid(isValid);
  };

  const title =
    type === 'phone'
      ? 'Vérification de votre téléphone'
      : 'Vérification de votre email';

  const description =
    type === 'phone'
      ? 'Pour sécuriser votre compte, nous devons vérifier votre numéro de téléphone. Un code de vérification vous sera envoyé.'
      : 'Pour sécuriser votre compte, nous devons vérifier votre adresse email. Un code de vérification vous sera envoyé.';

  const callApi = async (endpoint: string, body: any) => {
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Réponse non JSON');
      }

      return await res.json();
    } catch (error) {
      console.error('API call failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async () => {
    if (!isFormValid) return;

    const endpoint =
      type === 'phone' ? '/api/send-phone-verif' : '/api/send-verif-test';
    const data = await callApi(endpoint, { [type]: value });

    if (data.success) {
      setMessage({
        text: `Code envoyé à votre ${type === 'phone' ? 'téléphone' : 'email'}.`,
        type: 'success',
      });
      setIsCodeSent(true);
    } else {
      setMessage({
        text: data.message || "Échec de l'envoi du code",
        type: 'error',
      });
    }
  };

  const verifyCode = async () => {
    if (!isFormValid) return;

    const endpoint =
      type === 'phone' ? '/api/verify-telephone' : '/api/verif-test';
    const data = await callApi(endpoint, { [type]: value, code });

    if (data.success) {
      setMessage({
        text: `${type === 'phone' ? 'Téléphone' : 'Email'} vérifié avec succès !`,
        type: 'success',
      });
      setTimeout(() => {
        onVerified(value);
        onClose();
      }, 1500);
    } else {
      setMessage({
        text: data.message || 'Code invalide',
        type: 'error',
      });
    }
  };

  const updateValue = async () => {
    if (!onUpdate || !isFormValid) return;

    setLoading(true);
    const success = await onUpdate(value);

    if (success) {
      setMessage({
        text: `${type === 'phone' ? 'Numéro' : 'Email'} modifié avec succès. Un code de vérification a été envoyé.`,
        type: 'success',
      });
      setIsCodeSent(true);
    } else {
      setMessage({
        text: 'Échec de la modification',
        type: 'error',
      });
    }
    setLoading(false);
  };

  const goBackToChoice = () => {
    setMode('choose');
    setIsCodeSent(false);
    setCode('');
    setMessage({ text: '', type: 'info' });
    setValue(currentValue);
    setErrors({ value: '', code: '' });
  };

  const renderVerificationInput = () => {
    const labelText =
      type === 'phone' ? 'Numéro de téléphone' : 'Adresse email';
    const inputType = type === 'phone' ? 'tel' : 'email';
    const icon = type === 'phone' ? <FaPhone /> : <FaEnvelope />;

    return (
      <>
        <label
          htmlFor='verification-input'
          className='mb-1 block text-sm font-medium text-gray-700'
        >
          {labelText}
        </label>
        <div className='relative'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400'>
            {icon}
          </div>
          <input
            id='verification-input'
            type={inputType}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={mode === 'verify' || isCodeSent}
            className={`w-full border ${errors.value ? 'border-red-500' : 'border-gray-300'} focus:ring-secondary focus:border-secondary rounded-lg p-3 pl-10 focus:ring-2 disabled:bg-gray-100`}
          />
        </div>
        {errors.value && (
          <p className='mt-1 text-sm text-red-600'>{errors.value}</p>
        )}
      </>
    );
  };

  const renderVerificationCodeSection = () => (
    <>
      <div>
        <label
          htmlFor='verification-code'
          className='mb-1 block text-sm font-medium text-gray-700'
        >
          Code de vérification
        </label>
        <input
          id='verification-code'
          type='text'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`w-full border ${errors.code ? 'border-red-500' : 'border-gray-300'} focus:ring-secondary focus:border-secondary rounded-lg p-3 focus:ring-2`}
          placeholder='Entrez le code reçu'
        />
        {errors.code && (
          <p className='mt-1 text-sm text-red-600'>{errors.code}</p>
        )}
        <p className='mt-1 text-xs text-gray-500'>
          {`Un code à 6 chiffres a été envoyé à votre ${type === 'phone' ? 'téléphone' : 'email'}`}
        </p>
      </div>

      <button
        onClick={verifyCode}
        disabled={loading || !isFormValid}
        className='bg-primary hover:bg-primary flex w-full items-center justify-center space-x-2 rounded-lg p-3 text-white transition-colors disabled:opacity-70'
      >
        <FaCheckCircle />
        <span>{loading ? 'Vérification...' : 'Vérifier le code'}</span>
      </button>
    </>
  );

  const renderActionButton = () => {
    if (mode === 'modify' && !isCodeSent) {
      return (
        <button
          onClick={updateValue}
          disabled={loading || !isFormValid}
          className='bg-secondary hover:bg-secondary flex w-full items-center justify-center rounded-lg p-3 text-white transition-colors disabled:opacity-70'
        >
          <FaEdit className='mr-2' />
          {loading ? 'Enregistrement...' : 'Modifier'}
        </button>
      );
    }

    if (isCodeSent) {
      return renderVerificationCodeSection();
    }

    return (
      <button
        onClick={sendCode}
        disabled={loading || !isFormValid}
        className='bg-primary hover:bg-primary w-full rounded-lg p-3 text-white transition-colors disabled:opacity-70'
      >
        {loading ? 'Envoi en cours...' : 'Envoyer le code de vérification'}
      </button>
    );
  };

  const renderMessage = () => {
    if (!message.text) return null;

    let messageClass = '';
    switch (message.type) {
      case 'success':
        messageClass = 'bg-green-100 text-green-800';
        break;
      case 'error':
        messageClass = 'bg-red-100 text-red-800';
        break;
      default:
        messageClass = 'bg-blue-100 text-blue-800';
    }

    return (
      <div className={`mt-4 rounded-lg p-3 ${messageClass}`}>
        {message.text}
      </div>
    );
  };

  const renderContent = () => {
    if (mode === 'choose') {
      return (
        <div className='space-y-6'>
          <div className='text-secondary flex items-center justify-center'>
            <FaShieldAlt className='text-4xl' />
          </div>
          <p className='text-center text-gray-600'>{description}</p>

          <div className='flex flex-col space-y-3'>
            <button
              onClick={() => setMode('modify')}
              className='flex items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50'
            >
              <FaEdit />
              <span>Modifier {type === 'phone' ? 'le numéro' : "l'email"}</span>
            </button>
            <button
              onClick={() => setMode('verify')}
              className='bg-primary hover:bg-primary flex items-center justify-center space-x-2 rounded-lg px-4 py-3 text-white transition-colors'
            >
              <FaCheckCircle />
              <span>
                Vérifier{' '}
                {type === 'phone' ? 'le numéro actuel' : "l'email actuel"}
              </span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        <button
          onClick={goBackToChoice}
          className='flex items-center text-gray-500 transition-colors hover:text-gray-700'
        >
          <FaArrowLeft className='mr-2' />
          <span>Retour</span>
        </button>

        <div className='space-y-4'>
          <div>{renderVerificationInput()}</div>
          {renderActionButton()}
        </div>
      </div>
    );
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl'>
        <button
          className='absolute top-4 right-4 text-gray-500 transition-colors hover:text-gray-700'
          onClick={onClose}
          aria-label='Fermer'
        >
          <FaTimes className='text-xl' />
        </button>

        <div className='p-6'>
          <div className='mb-4'>
            <h2 className='flex items-center text-xl font-bold text-gray-800'>
              {type === 'phone' ? (
                <>
                  <FaPhone className='text-secondary mr-2' />
                  {title}
                </>
              ) : (
                <>
                  <FaEnvelope className='text-secondary mr-2' />
                  {title}
                </>
              )}
            </h2>
            {mode === 'choose' && (
              <p className='mt-2 text-gray-600'>{description}</p>
            )}
          </div>

          {renderContent()}
          {renderMessage()}
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;