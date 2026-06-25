import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import products from '../data/products.json';
import categories from '../data/categories.json';
import sectors from '../data/sectors.json';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('categoria') || '');
  const [activeSector, setActiveSector] = useState(searchParams.get('sector') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || [p.name, p.description, p.category, p.sector].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchCat = !activeCategory || p.categorySlug === activeCategory;

      // El sector "salud" agrupa también productos de laboratorio clínico
      let matchSec = !activeSector;
      if (activeSector) {
        if (activeSector === 'salud') {
          matchSec = p.sectorSlug === 'salud' || p.sectorSlug === 'laboratorio';
        } else {
          matchSec = p.sectorSlug === activeSector;
        }
      }

      return matchSearch && matchCat && matchSec;
    });
  }, [search, activeCategory, activeSector]);


  const clearFilters = () => { setSearch(''); setActiveCategory(''); setActiveSector(''); };
  const hasFilters = search || activeCategory || activeSector;

  return (
    <div className="page-enter" style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(180deg, #091629 0%, var(--bg-primary) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '3rem 0 2rem'
      }}>
        <div className="container">
          <span className="section-tag">Catálogo B2B</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Catálogo de <span className="gradient-text">Productos</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Explora, filtra y agrega productos a tu solicitud de cotización. Sin precios, sin pagos.
          </p>

          {/* Search Bar */}
          <div style={{ position: 'relative', maxWidth: '560px' }}>
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', flexShrink: 0 }} width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar productos, categorías, sectores..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="catalog-search"
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem 0.85rem 2.75rem',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container catalog-layout">
        {/* Mobile filter toggle */}
        <button className="catalog-filter-toggle" onClick={() => setSidebarOpen(p => !p)} aria-label="Abrir filtros">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          {sidebarOpen ? 'Cerrar filtros' : 'Filtros'}
          {hasFilters && <span style={{ background: 'var(--grad-brand)', color: '#fff', borderRadius: '100px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700, marginLeft: '0.25rem' }}>!</span>}
        </button>

        {/* Sidebar */}
        <aside className={`catalog-sidebar${sidebarOpen ? ' mobile-open' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Filtros</h3>
            {hasFilters && (
              <button onClick={clearFilters} style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                Limpiar todo
              </button>
            )}
          </div>

          {/* Sector filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Sector</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
              <FilterBtn 
                label="Todos los sectores" 
                active={!activeSector} 
                onClick={() => { setActiveSector(''); setActiveCategory(''); }} 
              />
              {sectors.map(s => (
                <FilterBtn 
                  key={s.id} 
                  label={s.name} 
                  icon={s.icon} 
                  active={activeSector === s.id} 
                  onClick={() => { setActiveSector(activeSector === s.id ? '' : s.id); setActiveCategory(''); }} 
                />
              ))}
            </div>
          </div>

          {/* Category filter */}
          {activeSector && (
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Categorías de {sectors.find(s => s.id === activeSector)?.name}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
                <FilterBtn label="Todas" active={!activeCategory} onClick={() => setActiveCategory('')} />
                {categories.filter(c => 
                  products.some(p => 
                    p.categorySlug === c.id && 
                    (activeSector === 'salud' ? (p.sectorSlug === 'salud' || p.sectorSlug === 'laboratorio') : p.sectorSlug === activeSector)
                  )
                ).map(c => (
                  <FilterBtn key={c.id} label={c.name} icon={c.icon} active={activeCategory === c.id} onClick={() => setActiveCategory(activeCategory === c.id ? '' : c.id)} />
                ))}
              </div>
            </div>
          )}
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ display: 'none', marginTop: '1.5rem', width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}
            className="catalog-sidebar-close"
          >
            Cerrar filtros ×
          </button>
        </aside>

        {/* Product Grid */}
        <div>
          {/* Results bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {filtered.length === 0 ? 'Sin resultados' : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
            </p>
            {hasFilters && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {activeSector && <FilterChip label={sectors.find(s => s.id === activeSector)?.name} onRemove={() => setActiveSector('')} />}
                {activeCategory && <FilterChip label={categories.find(c => c.id === activeCategory)?.name} onRemove={() => setActiveCategory('')} />}
                {search && <FilterChip label={`"${search}"`} onRemove={() => setSearch('')} />}
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>Sin resultados</h3>
              <p>No encontramos productos con esos filtros. Intenta ajustar tu búsqueda.</p>
              <button onClick={clearFilters} className="btn btn-primary">Limpiar filtros</button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.25rem'
            }}>
              {filtered.map(p => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 499, backdropFilter: 'blur(2px)' }}
        />
      )}
    </div>
  );
}

function FilterBtn({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.45rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${active ? 'var(--accent-blue)' : 'transparent'}`,
        background: active ? 'rgba(10,107,255,0.12)' : 'transparent',
        color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
        fontSize: '0.82rem',
        fontWeight: active ? 600 : 400,
        textAlign: 'left',
        transition: 'all 0.2s',
        width: '100%',
        cursor: 'pointer'
      }}
    >
      {icon && <span style={{ fontSize: '0.9rem' }}>{icon}</span>}
      {label}
    </button>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.25rem 0.65rem',
      background: 'rgba(10,107,255,0.12)',
      border: '1px solid rgba(10,107,255,0.3)',
      borderRadius: '100px',
      fontSize: '0.75rem',
      color: 'var(--accent-cyan)',
      fontWeight: 500
    }}>
      {label}
      <button onClick={onRemove} style={{ color: 'inherit', lineHeight: 1, fontSize: '1rem', fontWeight: 700 }}>×</button>
    </span>
  );
}
