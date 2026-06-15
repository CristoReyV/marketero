import { Link } from 'react-router-dom';

// ── Particles Canvas background ──────────────────────────────────
import { useEffect, useRef } from 'react';

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

// ── Hero Section ─────────────────────────────────────────────────
export function Hero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #050E1F 0%, #091629 100%)',
      paddingTop: '70px'
    }}>
      <ParticlesCanvas />
      <div className="grid-bg" />

      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(10,107,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '6rem 1.5rem' }}>
        {/* Logo */}
        <div className="reveal" style={{ marginBottom: '2.5rem' }}>
          <img
            src="/logo-fondo-negro.png"
            alt="Marketero Logo"
            style={{
              height: '90px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 28px rgba(10,107,255,0.55)) drop-shadow(0 0 8px rgba(0,212,255,0.3))',
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
          fontSize: 'clamp(2.2rem, 5vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
          maxWidth: '780px'
        }}>
          Suministros empresariales para{' '}
          <span className="gradient-text">operaciones que no pueden detenerse</span>
        </h1>

        <p className="reveal" style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
          maxWidth: '640px',
          marginBottom: '2.5rem'
        }}>
          MARKETERO conecta a empresas, industrias, oficinas, laboratorios, comercios y organizaciones con productos, insumos y soluciones de abastecimiento bajo solicitud de cotización.
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
        <div className="reveal" style={{
          display: 'flex',
          gap: '2.5rem',
          flexWrap: 'wrap',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)'
        }}>
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

// ── Why Marketero ─────────────────────────────────────────────────
const pillars = [
  { n: '01', icon: '🌐', title: 'Abastecimiento Multisectorial', desc: 'Una sola fuente de suministro para todos tus departamentos. Simplificamos tu cadena de compras.' },
  { n: '02', icon: '👤', title: 'Atención Personalizada', desc: 'Ejecutivo dedicado que conoce tu operación y anticipa tus necesidades de abastecimiento.' },
  { n: '03', icon: '📄', title: 'Cotizaciones Empresariales', desc: 'Propuestas formales, documentadas y con condiciones claras. Sin letra chica, sin sorpresas.' },
  { n: '04', icon: '⚡', title: 'Respuesta Comercial Ágil', desc: 'Cotizaciones en menos de 48 horas. Tu operación no puede esperar y nosotros lo sabemos.' },
  { n: '05', icon: '🔗', title: 'Gestión de Proveedores', desc: 'Acceso a red de proveedores certificados para atender pedidos de cualquier volumen y especificación.' },
];

export function WhyMarketero() {
  return (
    <section style={{ padding: 'var(--section-py) 0', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', right: '-200px', transform: 'translateY(-50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(10,107,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '5rem', alignItems: 'start' }}>
          <div className="reveal" style={{ position: 'sticky', top: '100px' }}>
            <span className="section-tag">Propuesta de Valor</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              ¿Por qué elegir <span className="gradient-text">MARKETERO</span>?
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
          {/* Connecting line */}
          <div style={{
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
