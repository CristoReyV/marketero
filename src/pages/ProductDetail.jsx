import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import products from '../data/products.json';
import { useQuote } from '../context/QuoteContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useQuote();

  const product = products.find(p => p.slug === slug);
  const inQuote = product && items.some(i => i.id === product.id);
  const related = product
    ? products.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!product) navigate('/catalogo');
  }, [slug]);

  if (!product) return null;

  return (
    <div className="page-enter" style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Inicio</Link>
          <span>/</span>
          <Link to="/catalogo" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Catálogo</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
        </div>
      </div>

      {/* Product Main */}
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start', marginBottom: '4rem' }}>
          {/* Image */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(10,107,255,0.08), rgba(0,212,255,0.04))',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            height: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', inset: 0 }} className="grid-bg" />
            <span style={{ fontSize: '7rem', position: 'relative', zIndex: 1 }}>
              {getCategoryEmoji(product.category)}
            </span>
            <span className="badge-cotizable" style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}>
              Cotizable
            </span>
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Link to={`/catalogo?categoria=${product.categorySlug}`} className="badge-category">{product.category}</Link>
              <Link to={`/catalogo?sector=${product.sectorSlug}`} className="badge-category">{product.sector}</Link>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '1rem', marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Notice - no prices */}
            <div style={{
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              padding: '1rem 1.25rem',
              background: 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>ℹ️</span>
              <div>
                <p style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.2rem' }}>Producto cotizable</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Los precios se informan a través de una propuesta comercial personalizada. Agrega este producto a tu cotización y recibirás una respuesta en menos de 48 horas.
                </p>
              </div>
            </div>

            {/* Tags */}
            {product.tags && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.75rem' }}>
                {product.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '0.2rem 0.65rem', borderRadius: '100px' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => addItem(product)}
                className="btn btn-primary btn-lg"
                style={{ flex: 1, minWidth: '200px', justifyContent: 'center' }}
                id={`product-add-quote-${product.id}`}
              >
                {inQuote ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>Agregado — Añadir más</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <span>Agregar a Mi Cotización</span>
                  </>
                )}
              </button>
              <Link to="/contacto" className="btn btn-ghost btn-lg" id="product-advisory-btn">
                Solicitar asesoría
              </Link>
            </div>
          </div>
        </div>

        {/* Applications + Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
          {/* Applications */}
          {product.applications && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🎯</span> Aplicaciones
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {product.applications.map(app => (
                  <li key={app} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-cyan)', flexShrink: 0 }} />
                    {app}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specs */}
          {product.specs && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚙️</span> Especificaciones
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {product.specs.map(spec => (
                    <tr key={spec.label} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.6rem 0', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500, width: '40%' }}>{spec.label}</td>
                      <td style={{ padding: '0.6rem 0', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Productos <span className="gradient-text">relacionados</span>
              </h2>
              <Link to={`/catalogo?categoria=${product.categorySlug}`} className="btn btn-ghost btn-sm">
                Ver todos <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-main { grid-template-columns: 1fr !important; }
          .product-details { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function getCategoryEmoji(category) {
  const map = {
    'Material Médico': '🩺', 'Equipo Médico': '🏥',
    'Reactivos y Laboratorio': '🧪', 'Material de Curación': '🩹',
    'Papelería y Oficina': '📋', 'Limpieza e Higiene': '🧴',
    'Ferretería': '🔧', 'Material de Construcción': '🏗️',
    'Refrigeración': '❄️', 'Equipamiento Industrial': '⚙️',
    'Alimentos y Bebidas': '🍽️', 'Consumibles Empresariales': '📦',
  };
  return map[category] || '📦';
}
