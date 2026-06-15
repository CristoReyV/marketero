import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuote } from '../context/QuoteContext';
import { sendQuoteRequest } from '../utils/emailService';

const SECTORS_GIRO = ['Salud y Laboratorio','Construcción','Industria','Oficinas y Corporativos','Limpieza e Higiene','Ferretería','Refrigeración y Cadena de Frío','Alimentos y Bebidas','Gobierno e Instituciones','Educación','Otro'];

export default function Quote() {
  const { items, removeItem, updateQuantity, updateComment, clearQuote } = useQuote();
  const [form, setForm] = useState({ nombre: '', empresa: '', correo: '', telefono: '', ciudad: '', giro: '', mensaje: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.empresa.trim()) e.empresa = 'Requerido';
    if (!form.correo.trim() || !/\S+@\S+\.\S+/.test(form.correo)) e.correo = 'Correo inválido';
    if (!form.telefono.trim()) e.telefono = 'Requerido';
    if (!form.giro) e.giro = 'Requerido';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus('sending');
    try {
      await sendQuoteRequest({ formData: form, quoteItems: items });
      setStatus('success');
      clearQuote();
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }));
  };

  if (status === 'success') {
    return (
      <div className="page-enter" style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '3rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M7 18l8 8L30 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>¡Solicitud enviada!</h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            Tu solicitud de cotización ha sido recibida. Nuestro equipo revisará tu requerimiento y te enviará una propuesta comercial personalizada en menos de <strong style={{ color: 'var(--accent-cyan)' }}>48 horas hábiles</strong>.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
            Revisa tu correo: <strong>{form.correo}</strong>
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalogo" className="btn btn-primary">Ver más productos</Link>
            <Link to="/" className="btn btn-ghost">Ir al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg, #091629, var(--bg-primary))', borderBottom: '1px solid var(--border)', padding: '3rem 0 2rem' }}>
        <div className="container">
          <span className="section-tag">Cotización B2B</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Mi <span className="gradient-text">Cotización</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Revisa tus productos, completa tus datos empresariales y envía tu solicitud.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {items.length === 0 && status !== 'success' ? (
          <div className="empty-state" style={{ paddingTop: '6rem' }}>
            <div className="empty-state-icon">📋</div>
            <h3>Tu cotización está vacía</h3>
            <p>Explora el catálogo y agrega los productos que necesitas para tu empresa.</p>
            <Link to="/catalogo" className="btn btn-primary btn-lg">
              <span>Explorar Catálogo</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2.5rem', alignItems: 'start' }}>
            {/* Products list */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Productos seleccionados ({items.length})
                </h2>
                <button onClick={clearQuote} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#ff6b6b'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >Limpiar todo</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map(item => (
                  <QuoteItemRow key={item.id} item={item} onRemove={removeItem} onQty={updateQuantity} onComment={updateComment} />
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  ℹ️ Esta solicitud <strong style={{ color: 'var(--text-primary)' }}>no implica ningún pago ni compromiso de compra</strong>. Recibirás una propuesta comercial formal con precios, tiempos y condiciones.
                </p>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '2rem', position: 'sticky', top: '90px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Datos empresariales
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Completa tu información para recibir la propuesta.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FormField label="Nombre completo" id="q-nombre" value={form.nombre} error={errors.nombre}
                  onChange={v => handleChange('nombre', v)} placeholder="Tu nombre completo" />
                <FormField label="Empresa / Organización" id="q-empresa" value={form.empresa} error={errors.empresa}
                  onChange={v => handleChange('empresa', v)} placeholder="Nombre de tu empresa" />
                <FormField label="Correo electrónico" id="q-correo" type="email" value={form.correo} error={errors.correo}
                  onChange={v => handleChange('correo', v)} placeholder="correo@empresa.com" />
                <FormField label="Teléfono" id="q-telefono" value={form.telefono} error={errors.telefono}
                  onChange={v => handleChange('telefono', v)} placeholder="+52 747 000 0000" />
                <FormField label="Ciudad / Estado" id="q-ciudad" value={form.ciudad}
                  onChange={v => handleChange('ciudad', v)} placeholder="Ciudad de México" />

                {/* Giro select */}
                <div className="form-group">
                  <label htmlFor="q-giro">Giro de la empresa {errors.giro && <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>— {errors.giro}</span>}</label>
                  <select id="q-giro" value={form.giro} onChange={e => handleChange('giro', e.target.value)} style={{ borderColor: errors.giro ? '#ff6b6b' : undefined }}>
                    <option value="" disabled>Selecciona tu giro</option>
                    {SECTORS_GIRO.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Mensaje */}
                <div className="form-group">
                  <label htmlFor="q-mensaje">Requerimiento adicional (opcional)</label>
                  <textarea id="q-mensaje" rows={3} value={form.mensaje} onChange={e => handleChange('mensaje', e.target.value)}
                    placeholder="Especificaciones adicionales, volúmenes, urgencia..." />
                </div>

                {status === 'error' && (
                  <p style={{ fontSize: '0.82rem', color: '#ff6b6b', background: 'rgba(255,107,107,0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,107,107,0.2)' }}>
                    Error al enviar. Por favor intenta de nuevo o escríbenos directamente.
                  </p>
                )}

                <button type="submit" className="btn btn-primary btn-lg btn-full" id="quote-submit-btn" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <>
                      <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Enviando solicitud...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15 3L8 10M15 3l-5 12-2-5-5-2 12-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Enviar solicitud de cotización
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Quote Item Row ──────────────────────────────────────────────────
function QuoteItemRow({ item, onRemove, onQty, onComment }) {
  const [showComment, setShowComment] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem',
      transition: 'border-color 0.2s'
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Emoji icon */}
        <div style={{
          width: '56px', height: '56px', flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(10,107,255,0.1), rgba(0,212,255,0.05))',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem'
        }}>
          {getCategoryEmoji(item.category)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{item.name}</p>
              <span className="badge-category">{item.category}</span>
            </div>
            <button onClick={() => onRemove(item.id)} style={{ color: 'var(--text-muted)', fontSize: '1.3rem', flexShrink: 0, lineHeight: 1, padding: '0.2rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#ff6b6b'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              aria-label="Eliminar producto"
            >×</button>
          </div>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Cantidad:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <button onClick={() => onQty(item.id, item.quantity - 1)} style={{ width: '26px', height: '26px', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-blue)'; e.target.style.color = 'var(--accent-cyan)'; }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
                >−</button>
                <input
                  type="number" min="1" value={item.quantity}
                  onChange={e => onQty(item.id, parseInt(e.target.value) || 1)}
                  style={{ width: '48px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.2rem', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                />
                <button onClick={() => onQty(item.id, item.quantity + 1)} style={{ width: '26px', height: '26px', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-blue)'; e.target.style.color = 'var(--accent-cyan)'; }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
                >+</button>
              </div>
            </div>
            <button onClick={() => setShowComment(p => !p)} style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
              {showComment ? '− Ocultar nota' : '+ Agregar nota'}
            </button>
          </div>

          {showComment && (
            <textarea
              placeholder="Especificaciones, unidades, modelo requerido..."
              value={item.comment || ''}
              onChange={e => onComment(item.id, e.target.value)}
              rows={2}
              style={{ marginTop: '0.65rem', width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.85rem', color: 'var(--text-primary)', fontSize: '0.82rem', resize: 'vertical' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function getCategoryEmoji(category) {
  const map = {
    'Material Médico':'🩺','Equipo Médico':'🏥','Reactivos y Laboratorio':'🧪',
    'Material de Curación':'🩹','Papelería y Oficina':'📋','Limpieza e Higiene':'🧴',
    'Ferretería':'🔧','Material de Construcción':'🏗️','Refrigeración':'❄️',
    'Equipamiento Industrial':'⚙️','Alimentos y Bebidas':'🍽️','Consumibles Empresariales':'📦',
  };
  return map[category] || '📦';
}

// ── Form Field Helper ──────────────────────────────────────────────
function FormField({ label, id, value, onChange, error, placeholder, type = 'text' }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label} {error && <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>— {error}</span>}</label>
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{ borderColor: error ? '#ff6b6b' : undefined }}
      />
    </div>
  );
}
