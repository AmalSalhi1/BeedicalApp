import Image from 'next/image';

const features = [
  {
    id: 1,
    image: '/images/img2.png',
    title: 'Rendez-vous en ligne',
    description: 'Prenez rendez-vous en quelques secondes.',
  },
  {
    id: 2,
    image: '/images/img5.png',
    title: 'Consultations sécurisées',
    description: 'Toutes vos données sont protégées.',
  },
  {
    id: 3,
    image: '/images/img6.png',
    title: 'Professionnels vérifiés',
    description: 'Accédez à un large réseau de médecins qualifiés.',
  },
  {
    id: 4,
    image: '/images/img2.png',
    title: 'Rendez-vous en ligne',
    description: 'Prenez rendez-vous en quelques secondes.',
  },
  {
    id: 5,
    image: '/images/img5.png',
    title: 'Consultations sécurisées',
    description: 'Toutes vos données sont protégées.',
  },
  {
    id: 6,
    image: '/images/img6.png',
    title: 'Professionnels vérifiés',
    description: 'Accédez à un large réseau de médecins qualifiés.',
  },
];

export default function Features() {
  return (
    <section className='bg-white px-4 py-16'>
      <h2 className='text-center text-3xl font-bold text-gray-900'>
        Pourquoi choisir <span className='text-primary'>Bee</span>
        <span className='text-secondary'>Dical</span> ?
      </h2>

      {/* Cartes des fonctionnalités */}
      <div className='mt-8 grid grid-cols-1 gap-6 text-center sm:grid-cols-2 md:grid-cols-3'>
        {features.map((feature) => (
          <div
            key={feature.id}
            className='mx-auto w-full max-w-sm rounded-lg bg-[#ecfffe] p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg sm:p-6'
          >
            {/* Image stylisée */}
            <div className='relative mx-auto mb-4 h-24 w-24'>
              <Image
                src={feature.image}
                alt={feature.title}
                width={50}
                height={50}
                className='rounded-full object-contain shadow-md transition-all duration-300'
              />
            </div>

            {/* Titre et description */}
            <h3 className='mt-4 text-xl font-semibold'>{feature.title}</h3>
            <p className='mt-2 text-gray-600'>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Statistiques */}
      <div className='mt-16 grid grid-cols-2 gap-4 text-center md:grid-cols-3'>
        <div className='p-4'>
          <p className='text-secondary text-3xl font-bold'>1000+</p>
          <p className='text-gray-600'>Médecins</p>
        </div>
        <div className='p-4'>
          <p className='text-secondary text-3xl font-bold'>50k+</p>
          <p className='text-gray-600'>Patients satisfaits</p>
        </div>
        <div className='p-4'>
          <p className='text-secondary text-3xl font-bold'>24/7</p>
          <p className='text-gray-600'>Support</p>
        </div>
      </div>

      {/*securite des donnes */}
      <div className='mx-auto mt-16 flex w-full max-w-6xl flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[#FFF9E6] to-[#EBF9FF] px-6 py-10 text-center shadow-md md:flex-row md:px-10 md:text-left'>
        <div className='relative'>
          <Image
            src='/images/img3.jpg'
            alt='Sécurité des données'
            width={320}
            height={240}
            className='rounded-lg shadow-md'
          />
        </div>
        <div className='mt-6 max-w-lg md:mt-0 md:ml-8'>
          <h3 className='text-2xl font-bold text-gray-900'>
            Sécurité et Confidentialité
          </h3>
          <p className='mt-4 text-gray-600'>
            Chez <span className='text-primary font-bold'>Bee</span>
            <span className='text-secondary font-bold'>Dical</span>, nous
            prenons la sécurité de vos données très au sérieux. Toutes vos
            informations médicales sont stockées de manière sécurisée et
            protégées par des protocoles avancés de chiffrement.
          </p>
          <div className='mt-6'>
            <a
              href='/'
              className='bg-primary hover:bg-aqua-300 inline-block rounded-lg px-6 py-3 text-lg font-semibold text-white transition-all duration-300'
            >
              Voir nos engagements
            </a>
          </div>
        </div>
      </div>

      {/* telecherher app mobile */}
      <div className='mt-16 mr-16 ml-16 flex flex-col items-center justify-center space-y-6 rounded-lg p-10 text-center md:flex-row md:space-y-0 md:space-x-10 md:text-left'>
        <p className='mb-6 text-xl text-gray-800'>
          Téléchargez l'application mobile maintenant et simplifiez votre
          gestion des soins de santé !
        </p>
        <div className='flex justify-center gap-6'>
          <a
            href='https://apps.apple.com'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-secondary hover:bg-aqua-300 rounded-lg px-6 py-2 text-lg text-white transition-colors duration-300'
          >
            App Store
          </a>
          <a
            href='https://play.google.com'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-primary hover:bg-gold-300 rounded-lg px-6 py-2 text-lg text-white transition-colors duration-300'
          >
            Google Play
          </a>
        </div>
      </div>
    </section>
  );
}
