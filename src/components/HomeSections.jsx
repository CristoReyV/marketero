import { Link } from 'react-router-dom';

// ── Particles Canvas background ──────────────────────────────────
import { useEffect, useRef, useState } from 'react';

function ParticlesCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = canvas.parentElement.offsetHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10,107,255,${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.6 }} />;
}

// ── Hero Supply Showcase ──────────────────────────────────────────────
const showcaseCategories = [
  { icon: '🩺', label: 'Material Médico',      color: 'rgba(0,212,255,0.18)',   border: 'rgba(0,212,255,0.35)',   img: '/images/cat-medico.png' },
  { icon: '🧹', label: 'Limpieza e Higiene',   color: 'rgba(10,107,255,0.18)', border: 'rgba(10,107,255,0.35)',  img: '/images/cat-limpieza.png' },
  { icon: '📦', label: 'Papelaría y Oficina',  color: 'rgba(88,101,242,0.18)',  border: 'rgba(88,101,242,0.35)', img: '/images/cat-oficina.png' },
  { icon: '🔩', label: 'Ferretería',           color: 'rgba(0,212,255,0.15)',   border: 'rgba(0,212,255,0.3)',    img: '/images/cat-ferreteria.png' },
  { icon: '❄️', label: 'Refrigeración',        color: 'rgba(10,107,255,0.15)', border: 'rgba(10,107,255,0.3)',   img: '/images/cat-refrigeracion.png' },
  { icon: '🍽️', label: 'Alimentos y Bebidas',  color: 'rgba(88,101,242,0.15)',  border: 'rgba(88,101,242,0.3)',  img: '/images/cat-alimentos.png' },
];

const DEFAULT_IMG = '/images/cat-default.png';

// Preload all images on module load
if (typeof window !== 'undefined') {
  [DEFAULT_IMG, ...showcaseCategories.map(c => c.img)].forEach(src => {
    const img = new Image(); img.src = src;
  });
}

const showcaseBadges = [
  '✅ Cotización empresarial',
  '🏭 Proveedores especializados',
  '⚡ Respuesta comercial',
  '🤝 Abastecimiento B2B',
];

function HeroShowcase() {
  const [clickedIdx, setClickedIdx] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [autoIdx, setAutoIdx] = useState(-1); // -1 = default image
  const timerRef = useRef(null);

  // Auto-rotate, pauses when user interacts (hover or click)
  useEffect(() => {
    if (hoveredIdx !== null || clickedIdx !== null) return;
    timerRef.current = setInterval(() => {
      setAutoIdx(p => (p + 1) >= showcaseCategories.length ? -1 : p + 1);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, [hoveredIdx, clickedIdx]);

  const displayIdx = hoveredIdx !== null ? hoveredIdx : (clickedIdx !== null ? clickedIdx : autoIdx);

  return (
    <div
      className="hero-showcase-wrapper"
      onMouseLeave={() => setHoveredIdx(null)}
    >
      <div className="hero-showcase-bg">
        <img
          src={DEFAULT_IMG}
          alt=""
          aria-hidden="true"
          className="showcase-bg-img"
          style={{ opacity: displayIdx === -1 ? 1 : 0 }}
        />
        {showcaseCategories.map((cat, i) => (
          <img
            key={cat.label}
            src={cat.img}
            alt=""
            aria-hidden="true"
            className="showcase-bg-img"
            style={{ opacity: displayIdx === i ? 1 : 0 }}
          />
        ))}
        <div className="showcase-overlay" />
        <div className="showcase-vignette" />
      </div>

      <div className="hero-showcase-panel">
        <div className="showcase-glow" />

        <div className="showcase-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.4rem' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'var(--grad-brand)',
              boxShadow: '0 0 10px rgba(10,107,255,0.7)',
            }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Suministro multisectorial
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', opacity: 0.7,
                  background: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#22c55e' }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem', marginBottom: '1.4rem' }}>
            {showcaseCategories.map((cat, i) => (
              <div
                key={cat.label}
                onClick={() => setClickedIdx(clickedIdx === i ? null : i)}
                onMouseEnter={() => setHoveredIdx(i)}
                style={{
                  background: displayIdx === i ? cat.color : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${displayIdx === i ? cat.border : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '12px', padding: '0.75rem 0.5rem', textAlign: 'center',
                  transition: 'all 0.35s ease', cursor: 'pointer',
                  transform: displayIdx === i ? 'scale(1.06) translateY(-2px)' : 'scale(1)',
                  boxShadow: displayIdx === i ? `0 4px 24px ${cat.border}` : 'none',
                  userSelect: 'none',
                }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem', lineHeight: 1 }}>{cat.icon}</div>
                <div style={{ fontSize: '0.62rem', fontWeight: 600, lineHeight: 1.2,
                  color: displayIdx === i ? '#e2e8f0' : 'var(--text-muted)' }}>{cat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', marginBottom: '1.2rem' }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {showcaseBadges.map(b => (
              <span key={b} style={{
                fontSize: '0.68rem', fontWeight: 600, padding: '0.3rem 0.75rem',
                borderRadius: '100px', background: 'rgba(10,107,255,0.14)',
                border: '1px solid rgba(10,107,255,0.28)', color: '#94a3b8',
              }}>{b}</span>
            ))}
          </div>
        </div>

        <div style={{
          position: 'absolute', top: '-18px', right: '-18px',
          background: 'linear-gradient(135deg, rgba(10,107,255,0.32), rgba(0,212,255,0.18))',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,212,255,0.35)', borderRadius: '14px',
          padding: '0.65rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: '0 4px 24px rgba(10,107,255,0.35)',
          animation: 'float 5s ease-in-out infinite', zIndex: 3,
        }}>
          <span style={{ fontSize: '1.1rem' }}>📋</span>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>Cotización</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', marginTop: '1px' }}>Solicitud B2B</div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: '-14px', left: '-14px',
          background: 'linear-gradient(135deg, rgba(88,101,242,0.32), rgba(10,107,255,0.18))',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(88,101,242,0.4)', borderRadius: '14px',
          padding: '0.65rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: '0 4px 24px rgba(88,101,242,0.28)',
          animation: 'float 6s ease-in-out infinite 1s', zIndex: 3,
        }}>
          <span style={{ fontSize: '1.1rem' }}>🏭</span>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>8+ Sectores</div>
            <div style={{ fontSize: '0.6rem', color: '#a5b4fc', marginTop: '1px' }}>Multisectorial</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
      overflow: 'hidden', background: 'linear-gradient(180deg, #050E1F 0%, #091629 100%)',
      paddingTop: '70px'
    }}>
      <ParticlesCanvas />
      <div className="grid-bg" />

      {/* Glow blob central (moved to right) */}
      <div style={{
        position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(ellipse, rgba(10,107,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '6rem 1.5rem' }}>
        <div className="hero-layout">
          
          {/* Left Column (Text & CTA) */}
          <div className="hero-text-col">
            {/* Logo */}
            <div className="reveal" style={{ marginBottom: '2.5rem' }}>
              <img
                src="/logo-fondo-negro.png"
                alt="Markketero Logo"
                style={{
                  height: '80px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 28px rgba(10,107,255,0.4)) drop-shadow(0 0 8px rgba(0,212,255,0.2))',
                  animation: 'float 4s ease-in-out infinite',
                  display: 'block'
                }}
              />
            </div>

            {/* Badge */}
            <div className="reveal" style={{ marginBottom: '1.5rem' }}>
              <span className="badge-cotizable" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                Plataforma B2B · Suministro Multisectorial
              </span>
            </div>

            <h1 className="reveal" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}>
              Suministros empresariales para{' '}
              <span className="gradient-text">operaciones que no pueden detenerse</span>
            </h1>

            <p className="reveal" style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '2.5rem'
            }}>
              MARKKETERO conecta a empresas, industrias, oficinas, laboratorios, comercios y organizaciones con productos, insumos y soluciones de abastecimiento bajo solicitud de cotización.
            </p>

            <div className="reveal" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
              <Link to="/cotizacion" className="btn btn-primary btn-lg" id="hero-cta-quote">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M5 6h8M5 9h8M5 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Solicitar Cotización</span>
              </Link>
              <Link to="/catalogo" className="btn btn-ghost btn-lg" id="hero-cta-catalog">
                <span>Ver Catálogo</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="reveal hero-stats" style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              {[
                { num: '8+', label: 'Sectores atendidos' },
                { num: '5,000+', label: 'Productos disponibles' },
                { num: '<48h', label: 'Respuesta garantizada' },
                { num: '100%', label: 'Enfoque B2B' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.num}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Hero Showcase */}
          <div className="hero-carousel-col reveal">
            <HeroShowcase />
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Sectors Grid ─────────────────────────────────────────────────
const sectors = [
  { id: 'salud', icon: '🏥', name: 'Salud y Laboratorio', desc: 'Hospitales, clínicas y centros de investigación.' },
  { id: 'construccion', icon: '🏗️', name: 'Construcción', desc: 'Constructoras y empresas de infraestructura.' },
  { id: 'industria', icon: '🏭', name: 'Industria', desc: 'Manufactura, plantas y procesos industriales.' },
  { id: 'oficinas', icon: '🏢', name: 'Oficinas', desc: 'Corporativos, despachos y empresas de servicios.' },
  { id: 'limpieza', icon: '✨', name: 'Limpieza e Higiene', desc: 'Servicios de limpieza industrial y comercial.' },
  { id: 'ferreteria', icon: '🔧', name: 'Ferretería', desc: 'Herramientas, materiales y suministros técnicos.' },
  { id: 'refrigeracion', icon: '❄️', name: 'Refrigeración', desc: 'Climatización y cadenas de frío empresariales.' },
  { id: 'alimentos', icon: '🍽️', name: 'Alimentos y Bebidas', desc: 'Restaurantes, procesadoras y distribuidoras.' },
];

export function SectorsGrid() {
  return (
    <section id="sectores" style={{ padding: 'var(--section-py) 0', background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">Cobertura Multisectorial</span>
          <h2 className="section-title">Sectores que <span className="gradient-text">atendemos</span></h2>
          <p className="section-subtitle">Abastecemos a organizaciones de múltiples industrias con la misma eficiencia, calidad y atención personalizada.</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          {sectors.map((s, i) => (
            <Link
              key={s.id}
              to={`/catalogo?sector=${s.id}`}
              className="reveal"
              style={{
                display: 'block',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                transition: 'all 0.3s',
                textDecoration: 'none'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(10,107,255,0.5)';
                e.currentTarget.style.background = 'rgba(10,107,255,0.07)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{s.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Categories Grid ───────────────────────────────────────────────
const categories = [
  { id: 'material-medico', name: 'Material Médico', icon: '🩺' },
  { id: 'equipo-medico', name: 'Equipo Médico', icon: '🏥' },
  { id: 'reactivos-laboratorio', name: 'Reactivos y Laboratorio', icon: '🧪' },
  { id: 'material-curacion', name: 'Material de Curación', icon: '🩹' },
  { id: 'papeleria-oficina', name: 'Papelería y Oficina', icon: '📋' },
  { id: 'limpieza-higiene', name: 'Limpieza e Higiene', icon: '🧴' },
  { id: 'ferreteria', name: 'Ferretería', icon: '🔧' },
  { id: 'material-construccion', name: 'Material de Construcción', icon: '🏗️' },
  { id: 'refrigeracion', name: 'Refrigeración', icon: '❄️' },
  { id: 'equipamiento-industrial', name: 'Equipamiento Industrial', icon: '⚙️' },
  { id: 'alimentos-bebidas', name: 'Alimentos y Bebidas', icon: '🍽️' },
  { id: 'consumibles-empresariales', name: 'Consumibles Empresariales', icon: '📦' },
];

export function CategoriesGrid() {
  return (
    <section style={{ padding: 'var(--section-py) 0', background: 'var(--bg-primary)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">Catálogo</span>
          <h2 className="section-title">Categorías <span className="gradient-text">destacadas</span></h2>
          <p className="section-subtitle">Explora nuestro catálogo de productos por categoría y agrega lo que necesitas a tu solicitud de cotización.</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/catalogo?categoria=${cat.id}`}
              className="reveal"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.65rem',
                padding: '1.4rem 1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.3s',
                textDecoration: 'none'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-blue)';
                e.currentTarget.style.background = 'rgba(10,107,255,0.08)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{cat.name}</span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/catalogo" className="btn btn-primary btn-lg" id="categories-view-all">
            <span>Ver Catálogo Completo</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Why Markketero ─────────────────────────────────────────────────
const pillars = [
  { n: '01', icon: '🌐', title: 'Abastecimiento Multisectorial', desc: 'Una sola fuente de suministro para todos tus departamentos. Simplificamos tu cadena de compras.' },
  { n: '02', icon: '👤', title: 'Atención Personalizada', desc: 'Ejecutivo dedicado que conoce tu operación y anticipa tus necesidades de abastecimiento.' },
  { n: '03', icon: '📄', title: 'Cotizaciones Empresariales', desc: 'Propuestas formales, documentadas y con condiciones claras. Sin letra chica, sin sorpresas.' },
  { n: '04', icon: '⚡', title: 'Respuesta Comercial Ágil', desc: 'Cotizaciones en menos de 48 horas. Tu operación no puede esperar y nosotros lo sabemos.' },
  { n: '05', icon: '🔗', title: 'Gestión de Proveedores', desc: 'Acceso a red de proveedores certificados para atender pedidos de cualquier volumen y especificación.' },
];

export function WhyMarkketero() {
  return (
    <section style={{ padding: 'var(--section-py) 0', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', right: '-200px', transform: 'translateY(-50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(10,107,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div className="container" style={{ position: 'relative' }}>
        <div className="why-grid">
          <div className="reveal why-sticky">
            <span className="section-tag">Propuesta de Valor</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              ¿Por qué elegir <span className="gradient-text">MARKKETERO</span>?
            </h2>
            <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
              No somos un proveedor más. Somos el aliado que garantiza que tu operación nunca se detenga por falta de suministros.
            </p>
            <Link to="/contacto" className="btn btn-primary" id="why-contact-btn">
              <span>Hablar con un Ejecutivo</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {pillars.map((p, i) => (
              <div key={p.n} className="reveal" style={{
                display: 'flex',
                gap: '1.25rem',
                padding: '1.5rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(10,107,255,0.4)';
                e.currentTarget.style.background = 'rgba(10,107,255,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--bg-card)';
              }}
              >
                <div style={{ fontSize: '1.8rem', flexShrink: 0, lineHeight: 1 }}>{p.icon}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.08em' }}>{p.n}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.title}</h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────
const steps = [
  { n: '01', icon: '🔍', title: 'Explora el catálogo', desc: 'Navega por categorías y sectores. Encuentra los productos que necesita tu empresa.' },
  { n: '02', icon: '📋', title: 'Agrega a Mi Cotización', desc: 'Selecciona productos, define cantidades y agrega notas o especificaciones por producto.' },
  { n: '03', icon: '📤', title: 'Envía tu solicitud', desc: 'Llena tus datos empresariales y envía la solicitud. Sin pagos, sin compromisos.' },
  { n: '04', icon: '📩', title: 'Recibe propuesta comercial', desc: 'En menos de 48 horas recibes una cotización formal con precios, tiempos y condiciones.' },
];

export function HowItWorks() {
  return (
    <section style={{ padding: 'var(--section-py) 0', background: 'var(--bg-primary)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">Metodología</span>
          <h2 className="section-title">Cómo <span className="gradient-text">funciona</span></h2>
          <p className="section-subtitle">Un proceso simple, eficiente y sin fricciones. Tu tiempo vale, por eso lo hacemos fácil.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0',
          position: 'relative'
        }}>
          {/* Connecting line — hidden on mobile via CSS */}
          <div className="how-connector" style={{
            position: 'absolute',
            top: '36px',
            left: '12.5%',
            right: '12.5%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--accent-blue), var(--accent-cyan), var(--accent-blue), transparent)',
            opacity: 0.4,
            pointerEvents: 'none'
          }} />

          {steps.map((s, i) => (
            <div key={s.n} className="reveal" style={{ textAlign: 'center', padding: '0 1.5rem 2rem' }}>
              <div style={{
                width: '72px', height: '72px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem',
                margin: '0 auto 1.5rem',
                position: 'relative',
                zIndex: 1
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{s.n}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────
export function FinalCTA() {
  return (
    <section style={{
      padding: 'var(--section-py) 0',
      background: 'linear-gradient(135deg, #050E1F 0%, #091629 60%, rgba(10,107,255,0.08) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(10,107,255,0.1) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />
      <div className="grid-bg" style={{ opacity: 0.5 }} />
      <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
        <div className="reveal">
          <span className="section-tag">¿Listo para comenzar?</span>
          <h2 className="section-title" style={{ maxWidth: '600px', margin: '0 auto 1rem' }}>
            ¿Buscas productos específicos para tu <span className="gradient-text">empresa</span>?
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2.5rem', maxWidth: '500px' }}>
            Explora nuestro catálogo o envíanos tu requerimiento directamente. Sin costo, sin compromiso.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalogo" className="btn btn-primary btn-lg" id="final-cta-catalog">
              <span>Ver Catálogo</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/contacto" className="btn btn-ghost btn-lg" id="final-cta-contact">
              <span>Enviar Requerimiento</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
