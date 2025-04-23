'use client';
import { useRouter } from 'next/navigation';

import { useState, JSX } from 'react';
import {
  FaUserCircle,
  FaUsers,
  FaCogs,
  FaShieldAlt,
  FaCreditCard,
  FaFileAlt,
  FaPhone,
  FaEnvelope,
  FaTrash,
  FaSignOutAlt,
} from 'react-icons/fa';
import Header from './Header';
import Footer from '@/components/landing/Footer';
import LanguageSection from './LanguageSection';
import CountrySection from './CountrySection';
import Section from './Section';
import VerificationPopup from './VerificationPopup';
import DeconnexionPopup from './DeconnexionPopup';
import SuppressionComptePopup from './SuppressionComptePopup';
import PasswordAnd2FAPopup from './PasswordAnd2FAPopup';

interface SectionData {
  id: number;
  title: string;
  description: string;
  danger?: boolean;
  pageLink?: string;
  icon: JSX.Element;
  verified?: boolean;
  onClick?: () => void;
}

export default function ComptePage() {
  const router = useRouter();

  // État pour gérer la visibilité du popup de vérification
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<'phone' | 'email'>('phone');

  // État pour gérer la déconnexion et suppression de compte
  const [showDeconnexionPopup, setShowDeconnexionPopup] = useState(false);
  const [showSuppressionComptePopup, setShowSuppressionComptePopup] =
    useState(false);

  // État pour gérer le popup de mot de passe et 2FA
  const [showPasswordAnd2FAPopup, setShowPasswordAnd2FAPopup] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const securityAndConnection: SectionData[] = [
    {
      id: 1,
      title: 'Gestion des mots de passe',
      description:
        'Changez ou réinitialisez votre mot de passe et authentification double facteurs',
      icon: <FaShieldAlt className='text-primary text-xl' />,
      onClick: () => setShowPasswordAnd2FAPopup(true),
    },
    {
      id: 2,
      title: "Vérification de l'email",
      description: 'Vérifiez votre adresse email',
      icon: <FaEnvelope className='text-primary text-xl' />,
      pageLink: 'email',
      verified: emailVerified,
      onClick: () => {
        setPopupType('email');
        setPopupVisible(true);
      },
    },
    {
      id: 3,
      title: 'Vérification du téléphone',
      description: 'Ajoutez ou vérifiez votre numéro de téléphone',
      icon: <FaPhone className='text-primary scale-x-[-1] transform text-xl' />,
      pageLink: 'phone',
      verified: phoneVerified,
      onClick: () => {
        setPopupType('phone');
        setPopupVisible(true);
      },
    },
  ];

  const parameters: SectionData[] = [
    {
      id: 6,
      title: 'Chiffrement des documents',
      description: 'Paramétrez le chiffrement de vos documents',
      icon: <FaCogs className='text-primary text-xl' />,
    },
  ];

  const confidentiality: SectionData[] = [
    {
      id: 7,
      title: 'Préférences',
      description: 'Personnalisez vos préférences de compte',
      icon: <FaCogs className='text-primary text-xl' />,
      pageLink: '/compte/preferences',
    },
    {
      id: 8,
      title: 'Informations légales',
      description: 'Consultez les mentions légales et les CGU',
      icon: <FaFileAlt className='text-primary text-xl' />,
      pageLink: '/compte/legal',
    },
    {
      id: 9,
      title: 'Suppression du compte',
      description: 'Supprimez définitivement votre compte',
      danger: true,
      icon: <FaTrash className='text-xl text-red-500' />,
    },
  ];

  const myAccount: SectionData[] = [
    {
      id: 10,
      title: 'Mon Profil',
      description: 'Gérez votre profil',
      icon: <FaUserCircle className='text-primary text-xl' />,
      pageLink: '/compte/edit-compte',
    },
    {
      id: 11,
      title: 'Mes Proches',
      description: 'Gérez vos proches et leurs informations',
      icon: <FaUsers className='text-primary text-xl' />,
      pageLink: '/compte/proches',
    },
  ];

  const paymentAndBilling: SectionData[] = [
    {
      id: 12,
      title: 'Mode de Paiement',
      description: 'Ajoutez ou modifiez votre mode de paiement',
      icon: <FaCreditCard className='text-primary text-xl' />,
    },
    {
      id: 13,
      title: 'Moyen de Paiement',
      description: 'Gérez vos moyens de paiement',
      icon: <FaCreditCard className='text-primary text-xl' />,
    },
  ];

  // Fonction pour ouvrir le popup en fonction de l'action (phone ou email)
  const handleVerification = (type: 'phone' | 'email') => {
    setPopupType(type);
    setPopupVisible(true);
    setShowPasswordAnd2FAPopup(false);
  };

  // Fonction pour gérer la déconnexion et suppresion de compte , a remplacer par l'appel API réel plus tard
  const handleLogout = () => {
    console.log('Déconnexion effectuée');
    // À remplacer (/ par /login)
    setShowDeconnexionPopup(false);
    router.push('/');
  };

  const handleDeleteAccount = () => {
    console.log('Compte supprimé');
    // À remplacer
    setShowSuppressionComptePopup(false);
    router.push('/');
  };

  return (
    <div className='flex min-h-screen flex-col bg-gray-100'>
      {/* Header */}
      <div className='sticky top-0 z-50'>
        <Header />
      </div>

      {/* Main */}
      <div className='mx-auto w-full max-w-4xl p-6 pt-16 md:p-8'>
        {/* Section Mon Compte */}
        <div className='mb-6'>
          <h2 className='mb-4 text-xl font-bold text-gray-800'>Mon Compte</h2>
          {myAccount.map((section) => (
            <Section key={section.id} {...section} />
          ))}
        </div>

        {/* Section Sécurité et Connexion */}
        <div className='mb-6'>
          <h2 className='mb-4 text-xl font-bold text-gray-800'>
            Sécurité et Connexion
          </h2>
          {securityAndConnection.map((section) => (
            <Section
              key={section.id}
              title={section.title}
              description={section.description}
              icon={section.icon}
              danger={section.danger}
              onClick={section.onClick}
              verified={section.verified}
              showVerificationStatus={section.title.includes('Vérification')}
            />
          ))}
        </div>

        {/* Section Paramètres */}
        <div className='mb-6'>
          <h2 className='mb-4 text-xl font-bold text-gray-800'>Paramètres</h2>
          <LanguageSection className='mb-4' />
          <CountrySection className='mb-4' />
          {parameters.map((section) => (
            <Section
              key={section.id}
              {...section}
              pageLink={section.pageLink ?? '#'}
            />
          ))}
        </div>

        {/* Section Paiement et Facturation */}
        <div className='mb-6'>
          <h2 className='mb-4 text-xl font-bold text-gray-800'>
            Paiement et Facturation
          </h2>
          {paymentAndBilling.map((section) => (
            <Section
              key={section.id}
              {...section}
              pageLink={section.pageLink ?? '#'}
            />
          ))}
        </div>

        {/* Section Confidentialité */}
        <div className='mb-6'>
          <h2 className='mb-4 text-xl font-bold text-gray-800'>
            Confidentialité
          </h2>
          {confidentiality.map((section) => (
            <Section
              key={section.id}
              {...section}
              onClick={
                section.title === 'Suppression du compte'
                  ? () => setShowSuppressionComptePopup(true)
                  : undefined
              }
              pageLink={section.pageLink ?? '#'}
            />
          ))}
        </div>

        {/* Bouton de déconnexion */}
        <div className='mt-8 flex items-center justify-center'>
          <button
            className='flex cursor-pointer items-center text-lg font-semibold text-red-500'
            onClick={() => setShowDeconnexionPopup(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') router.push('/logout');
            }}
            aria-label='Déconnexion'
          >
            <FaSignOutAlt className='mr-2 text-2xl text-red-500' />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Popup de vérification/modification gmail et telephone */}
      {popupVisible && (
        <VerificationPopup
          type={popupType}
          currentValue={
            popupType === 'phone' ? '0722663333' : 'hafsa.daanouni20@ump.ac.ma'
          }
          onClose={() => setPopupVisible(false)}
          onVerified={(newValue) => {
            if (popupType === 'phone') {
              setPhoneVerified(true);
            } else {
              setEmailVerified(true);
            }
            setPopupVisible(false);
          }}
        />
      )}

      {/* Popup de déconnexion */}
      {showDeconnexionPopup && (
        <DeconnexionPopup
          onConfirm={handleLogout}
          onCancel={() => setShowDeconnexionPopup(false)}
        />
      )}

      {/* Popup de suppression de compte */}
      {showSuppressionComptePopup && (
        <SuppressionComptePopup
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowSuppressionComptePopup(false)}
        />
      )}
      {/* Popup de mot de passe et 2FA */}
      {showPasswordAnd2FAPopup && (
        <PasswordAnd2FAPopup
          onClose={() => setShowPasswordAnd2FAPopup(false)}
          onVerifyPhone={() => {
            setShowPasswordAnd2FAPopup(false);
            handleVerification('phone');
          }}
          onVerifyEmail={() => {
            setShowPasswordAnd2FAPopup(false);
            handleVerification('email');
          }}
          phoneVerified={phoneVerified}
          emailVerified={emailVerified}
          phoneNumber='+212 722 663333'
          email='hafsa.daanouni20@ump.ac.ma'
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}