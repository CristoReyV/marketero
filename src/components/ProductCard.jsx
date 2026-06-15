import { Link } from 'react-router-dom';
import { useQuote } from '../context/QuoteContext';

export default function ProductCard({ product }) {
  const { addItem, items } = useQuote();
  const inQuote = items.some(i => i.id === product.id);

  return (
    <div style={{
      position: 'relative',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
      cursor: 'default'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(10,107,255,0.45)';
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,107,255,0.15)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Image */}
      <Link to={`/producto/${product.slug}`} style={{ display: 'block', flexShrink: 0 }}>
        <div style={{
          height: '180px',
          background: 'linear-gradient(135deg, rgba(10,107,255,0.08) 0%, rgba(0,212,255,0.04) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <ProductImagePlaceholder category={product.category} />
          <span className="badge-cotizable" style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            Cotizable
          </span>
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        <span className="badge-category">{product.category}</span>

        <Link to={`/producto/${product.slug}`}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.target.style.color = 'var(--accent-cyan)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}
          >{product.name}</h3>
        </Link>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55, flex: 1 }}>
          {product.shortDesc}
        </p>

        {/* Tags */}
        {product.tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.04)',
                padding: '0.15rem 0.5rem',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => addItem(product)}
            className={`btn btn-sm ${inQuote ? 'btn-outline' : 'btn-primary'}`}
            style={{ flex: 1, justifyContent: 'center' }}
            id={`add-quote-${product.id}`}
          >
            {inQuote ? (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                En Cotización
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Agregar
              </>
            )}
          </button>
          <Link
            to={`/producto/${product.slug}`}
            className="btn btn-ghost btn-sm"
            style={{ flexShrink: 0 }}
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductImagePlaceholder({ category }) {
  const icons = {
    'Material Médico': '🩺',
    'Equipo Médico': '🏥',
    'Reactivos y Laboratorio': '🧪',
    'Material de Curación': '🩹',
    'Papelería y Oficina': '📋',
    'Limpieza e Higiene': '🧴',
    'Ferretería': '🔧',
    'Material de Construcción': '🏗️',
    'Refrigeración': '❄️',
    'Equipamiento Industrial': '⚙️',
    'Alimentos y Bebidas': '🍽️',
    'Consumibles Empresariales': '📦',
  };
  return (
    <span style={{ fontSize: '3.5rem', opacity: 0.5, userSelect: 'none' }}>
      {icons[category] || '📦'}
    </span>
  );
}
