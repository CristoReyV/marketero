import { Link } from 'react-router-dom';

const pillars = [
  { icon: '🌐', title: 'Abastecimiento Multisectorial', desc: 'Una sola fuente confiable para todos los insumos y suministros de tu organización.' },
  { icon: '👤', title: 'Atención Personalizada', desc: 'Ejecutivo de cuenta dedicado que entiende las necesidades específicas de tu sector.' },
  { icon: '📋', title: 'Propuestas Formales', desc: 'Documentación clara, condiciones definidas y sin costos ocultos en cada cotización.' },
  { icon: '⚡', title: 'Respuesta en 48h', desc: 'Nos comprometemos a entregar propuestas en menos de 48 horas hábiles.' },
  { icon: '🔗', title: 'Red de Proveedores', desc: 'Acceso a proveedores certificados para cualquier volumen y especificación técnica.' },
  { icon: '🛡️', title: 'Confianza y Solidez', desc: 'Operamos con transparencia, respaldo comercial y cumplimiento normativo.' },
];

const values = [
  { title: 'Misión', content: 'Conectar organizaciones con los suministros que necesitan para operar sin interrupciones, a través de un modelo de abastecimiento ágil, confiable y personalizado.' },
  { title: 'Visión', content: 'Ser el socio estratégico de suministro de referencia en México, reconocido por la amplitud de nuestro catálogo, la calidad de nuestro servicio y la solidez de nuestras relaciones comerciales.' },
  { title: 'Compromiso', content: 'Responder con profesionalismo, honestidad y rapidez. Cada solicitud es tratada con la seriedad que merece la operación de tu empresa.' },
];

export default function About() {
  return (
    <div className="page-enter" style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #050E1F 0%, #091629 70%, rgba(10,107,255,0.06) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(10,107,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: '680px', position: 'relative' }}>
          <span className="section-tag">Quiénes somos</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.1 }}>
            No somos una tienda.<br/>
            Somos tu <span className="gradient-text">socio estratégico</span> de suministro.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2rem' }}>
            MARKETERO nació para resolver una necesidad real de las empresas: contar con un aliado confiable que pueda abastecer múltiples categorías de productos, con respuesta rápida, atención personalizada y propuestas formales.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/catalogo" className="btn btn-primary btn-lg">Ver Catálogo</Link>
            <Link to="/contacto" className="btn btn-ghost btn-lg">Contactar</Link>
          </div>
        </div>
      </div>

      {/* Mission/Vision/Commitment */}
      <section style={{ padding: 'var(--section-py) 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {values.map(v => (
              <div key={v.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section style={{ padding: 'var(--section-py) 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Nuestra Propuesta</span>
            <h2 className="section-title">Por qué <span className="gradient-text">MARKETERO</span></h2>
            <p className="section-subtitle">Cada punto refleja nuestro compromiso con quienes confían en nosotros para mantener su operación.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {pillars.map((p, i) => (
              <div key={p.title} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '1.8rem', flexShrink: 0, lineHeight: 1.2 }}>{p.icon}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            ¿Listo para trabajar <span className="gradient-text">juntos</span>?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Solicita tu primera cotización sin costo ni compromiso.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/cotizacion" className="btn btn-primary btn-lg">Solicitar Cotización</Link>
            <Link to="/catalogo" className="btn btn-ghost btn-lg">Ver Catálogo</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
