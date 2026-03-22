import React, { useState, useEffect } from 'react';

export default function ScrollToTopFab() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 bg-emerald-600 text-white p-3 rounded-full shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-110 transition-all z-40 animate-fadeInUp"
      aria-label="Volver arriba"
    >
      <img src="/images/Pagina_inicio/arrow-up2.svg" alt="Arriba" className="h-6 w-6" />
    </button>
  );
}
