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
            <img src="/logo-fondo-negro.png" alt="Marketero Logo" style={{ height: '36px', width: 'auto' }} />
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
