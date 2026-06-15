import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: '#030A18',
      borderTop: '1px solid rgba(10,107,255,0.12)',
      paddingTop: '4rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          paddingBottom: '3rem'
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <rect x="1" y="1" width="34" height="34" rx="8" stroke="url(#fG)" strokeWidth="1.5"/>
                <path d="M8 12L18 8L28 12L28 24L18 28L8 24Z" stroke="url(#fG)" strokeWidth="1.5" fill="none"/>
                <path d="M8 12L18 16L28 12" stroke="url(#fG)" strokeWidth="1.5" fill="none"/>
                <path d="M18 16L18 28" stroke="url(#fG)" strokeWidth="1.5" fill="none"/>
                <defs>
                  <linearGradient id="fG" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0A6BFF"/><stop offset="1" stopColor="#00D4FF"/>
                  </linearGradient>
                </defs>
              </svg>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '0.12em',
                background: 'var(--grad-brand)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>MARKETERO</span>
            </Link>
            <p style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem', fontWeight: 500 }}>
              Suministros y soluciones para empresas
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '260px' }}>
              Tu socio estratégico de abastecimiento. Conectamos organizaciones con los suministros que necesitan para operar sin interrupciones.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
              Navegación
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { to: '/', label: 'Inicio' },
                { to: '/catalogo', label: 'Catálogo' },
                { to: '/nosotros', label: 'Nosotros' },
                { to: '/contacto', label: 'Contacto' },
                { to: '/cotizacion', label: 'Mi Cotización' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} style={{ fontSize: '0.88rem', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectores */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
              Sectores
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Salud y Laboratorio','Construcción','Industria','Oficinas','Limpieza','Ferretería','Refrigeración','Alimentos'].map(s => (
                <li key={s}>
                  <Link to="/catalogo" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
              Contacto
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a href="mailto:contacto@marketero.com" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent-cyan)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >contacto@marketero.com</a>
              </li>
              <li>
                <a href="tel:+527470000000" style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>+52 747 000 0000</a>
              </li>
              <li>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Ciudad de México, México</span>
              </li>
            </ul>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/cotizacion" className="btn btn-primary btn-sm">
                Solicitar Cotización
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(10,107,255,0.1)',
          padding: '1.5rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            &copy; {year} MARKETERO. Todos los derechos reservados.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Suministros y Soluciones para Empresas
          </p>
        </div>
      </div>
    </footer>
  );
}
