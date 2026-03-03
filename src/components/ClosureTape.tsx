import { useState } from 'react';
import { X } from 'lucide-react';

export const ClosureTape = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Diagonal Tape */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div
          className="absolute w-full h-full"
          style={{
            background: 'linear-gradient(45deg, transparent 35%, #dc2626 35%, #dc2626 65%, transparent 65%)',
            pointerEvents: 'auto',
          }}
        />
      </div>

      {/* Text on Tape */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div
          className="text-white font-bold text-center whitespace-pre-wrap max-w-2xl px-4"
          style={{
            transform: 'rotate(45deg)',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)',
            lineHeight: '1.6',
            fontSize: '20px',
            fontWeight: '900',
          }}
        >
          Ce magasin est fermé
          <br />
          Aucun produit n'est plus disponible
          <br />
          sur notre site
          <br />
          <br />
          Merci à vous et au revoir
          <br />
          <br />
          <span style={{ fontSize: '18px' }}>
            Vous voulez un site web ?
            <br />
            Contactez-nous:{' '}
            <a
              href="mailto:optimum.tech.911@gmail.com"
              className="underline hover:opacity-80 transition-opacity pointer-events-auto"
              style={{ pointerEvents: 'auto' }}
            >
              optimum.tech.911@gmail.com
            </a>
            <br />
            Notre site :{' '}
            <a
              href="https://optimutech.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity pointer-events-auto"
              style={{ pointerEvents: 'auto' }}
            >
              optimutech.fr
            </a>
          </span>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="fixed top-8 right-8 z-[60] bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-colors"
        aria-label="Close closure notice"
      >
        <X size={28} />
      </button>
    </>
  );
};
