import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuote } from '../context/QuoteContext';
import '../styles/Header.css';

export default function Header() {
  const { totalItems, isDrawerOpen } = useQuote();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();

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
            <img src="/logo-fondo-negro.png" alt="Markketero Logo" style={{ height: '36px', width: 'auto' }} />
          </Link>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><Link to="/" className={`nav-link ${pathname === '/' && hash !== '#sectores' ? 'active' : ''}`} onClick={closeMenu}>Inicio</Link></li>
            <li><Link to="/#sectores" className={`nav-link ${pathname === '/' && hash === '#sectores' ? 'active' : ''}`} onClick={closeMenu}>Sectores</Link></li>
            <li><Link to="/catalogo" className={`nav-link ${pathname.startsWith('/catalogo') ? 'active' : ''}`} onClick={closeMenu}>Catálogo</Link></li>
            <li><Link to="/nosotros" className={`nav-link ${pathname === '/nosotros' ? 'active' : ''}`} onClick={closeMenu}>Nosotros</Link></li>
            <li><Link to="/contacto" className={`nav-link ${pathname === '/contacto' ? 'active' : ''}`} onClick={closeMenu}>Contacto</Link></li>
            
            {/* CTA Buttons for Mobile Menu */}
            <li className="mobile-nav-action" style={{ marginTop: '0.5rem' }}>
              <Link to="/cotizacion" className="btn btn-ghost btn-full" onClick={closeMenu} style={{ justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M5 6h8M5 9h8M5 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Mi Cotización {totalItems > 0 && <span className="quote-badge" style={{ display: 'inline-flex', position: 'static', marginLeft: '4px' }}>{totalItems}</span>}
              </Link>
            </li>
            <li className="mobile-nav-action">
              <Link to="/cotizacion" className="btn btn-primary btn-full" onClick={closeMenu} style={{ justifyContent: 'center' }}>
                <span>Solicitar Cotización</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </li>
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
