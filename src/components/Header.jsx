import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useQuote } from '../context/QuoteContext';
import '../styles/Header.css';

export default function Header() {
  const { totalItems, isDrawerOpen } = useQuote();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <nav className="nav container">
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <div className="logo-mark">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="1" y="1" width="34" height="34" rx="8" stroke="url(#hLogoG)" strokeWidth="1.5"/>
                <path d="M8 12L18 8L28 12L28 24L18 28L8 24Z" stroke="url(#hLogoG)" strokeWidth="1.5" fill="none"/>
                <path d="M8 12L18 16L28 12" stroke="url(#hLogoG)" strokeWidth="1.5" fill="none"/>
                <path d="M18 16L18 28" stroke="url(#hLogoG)" strokeWidth="1.5" fill="none"/>
                <defs>
                  <linearGradient id="hLogoG" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0A6BFF"/>
                    <stop offset="1" stopColor="#00D4FF"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">MARKETERO</span>
          </Link>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><NavLink to="/" end className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Inicio</NavLink></li>
            <li><NavLink to="/#sectores" className="nav-link" onClick={closeMenu}>Sectores</NavLink></li>
            <li><NavLink to="/catalogo" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Catálogo</NavLink></li>
            <li><NavLink to="/nosotros" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Nosotros</NavLink></li>
            <li><NavLink to="/contacto" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Contacto</NavLink></li>
          </ul>

          <div className="nav-actions">
            <Link to="/cotizacion" className="quote-btn" id="nav-quote-btn">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M5 6h8M5 9h8M5 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="quote-btn-text">Mi Cotización</span>
              {totalItems > 0 && (
                <span className="quote-badge" key={totalItems}>{totalItems}</span>
              )}
            </Link>

            <Link to="/cotizacion" className="btn btn-primary" id="nav-cta-btn">
              <span>Solicitar Cotización</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Menú de navegación"
            id="hamburger-btn"
          >
            <span/><span/><span/>
          </button>
        </nav>
      </header>

      {/* Toast de producto agregado */}
      {isDrawerOpen && (
        <div className="quote-drawer-toast">
          <div className="check">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l4 4 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p>Producto agregado</p>
            <span>Ver en Mi Cotización →</span>
          </div>
        </div>
      )}
    </>
  );
}
