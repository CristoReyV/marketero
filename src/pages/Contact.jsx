import { useState } from 'react';
import { sendContactRequest } from '../utils/emailService';

const SECTORS_GIRO = ['Salud y Laboratorio','Construcción','Industria','Oficinas y Corporativos','Limpieza e Higiene','Ferretería','Refrigeración','Alimentos y Bebidas','Gobierno e Instituciones','Educación','Otro'];

export default function Contact() {
  const [form, setForm] = useState({ empresa: '', nombre: '', correo: '', telefono: '', producto: '', cantidad: '', comentarios: '' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.empresa.trim()) e.empresa = 'Requerido';
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.correo.trim() || !/\S+@\S+\.\S+/.test(form.correo)) e.correo = 'Correo inválido';
    if (!form.telefono.trim()) e.telefono = 'Requerido';
    if (!form.producto.trim()) e.producto = 'Requerido';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus('sending');
    try {
      await sendContactRequest(form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handle = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }));
  };

  return (
    <div className="page-enter" style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg, #091629, var(--bg-primary))', borderBottom: '1px solid var(--border)', padding: '3.5rem 0 2.5rem' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <span className="section-tag">Requerimiento Especial</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Envía tu <span className="gradient-text">requerimiento</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7 }}>
            ¿Buscas un producto específico que no encontraste en el catálogo? ¿Tienes un requerimiento de suministro a escala? Cuéntanos y te respondemos en menos de 48 horas.
          </p>
        </div>
      </div>

      <div className="container contact-layout">
        {/* Info lateral */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Información de contacto
          </h2>

          {[
            { icon: '✉️', label: 'Correo electrónico', value: 'markketero@outlook.com', href: 'mailto:markketero@outlook.com' },
            { icon: '📞', label: 'Teléfono', value: '+52 55 4867 0305', href: 'tel:+525548670305' },
            { icon: '📍', label: 'Ubicación', value: 'Ciudad de México, México', href: null },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1.1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{c.icon}</span>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{c.label}</p>
                {c.href ? (
                  <a href={c.href} style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>{c.value}</a>
                ) : (
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{c.value}</span>
                )}
              </div>
            </div>
          ))}

          <div style={{ padding: '1.25rem', background: 'rgba(10,107,255,0.06)', border: '1px solid rgba(10,107,255,0.15)', borderRadius: 'var(--radius-md)', marginTop: '2rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--accent-cyan)' }}>⏱ Tiempo de respuesta:</strong> Nos comprometemos a responder toda solicitud en un máximo de <strong style={{ color: 'var(--text-primary)' }}>48 horas hábiles</strong> con una propuesta comercial formal.
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l6 6L23 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>¡Requerimiento enviado!</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                Tu solicitud fue recibida. Te contactaremos pronto con una propuesta.
              </p>
              <button onClick={() => { setStatus('idle'); setForm({ empresa:'',nombre:'',correo:'',telefono:'',producto:'',cantidad:'',comentarios:'' }); }} className="btn btn-outline">
                Enviar otro requerimiento
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="contact-form-row">
                <CF label="Empresa" id="c-empresa" value={form.empresa} error={errors.empresa} onChange={v => handle('empresa', v)} placeholder="Nombre de tu empresa" />
                <CF label="Nombre" id="c-nombre" value={form.nombre} error={errors.nombre} onChange={v => handle('nombre', v)} placeholder="Tu nombre" />
              </div>
              <div className="contact-form-row">
                <CF label="Correo" id="c-correo" type="email" value={form.correo} error={errors.correo} onChange={v => handle('correo', v)} placeholder="correo@empresa.com" />
                <CF label="Teléfono" id="c-telefono" value={form.telefono} error={errors.telefono} onChange={v => handle('telefono', v)} placeholder="+52 55 4867 0305" />
              </div>
              <CF label="Producto o servicio requerido" id="c-producto" value={form.producto} error={errors.producto} onChange={v => handle('producto', v)} placeholder="¿Qué productos necesitas?" />
              <CF label="Cantidad estimada" id="c-cantidad" value={form.cantidad} onChange={v => handle('cantidad', v)} placeholder="Ej: 500 unidades, 2 toneladas..." />

              <div className="form-group">
                <label htmlFor="c-comentarios">Comentarios adicionales</label>
                <textarea id="c-comentarios" rows={4} value={form.comentarios} onChange={e => handle('comentarios', e.target.value)}
                  placeholder="Especificaciones técnicas, urgencia, frecuencia de pedido, condiciones especiales..." />
              </div>

              {status === 'error' && (
                <p style={{ fontSize: '0.82rem', color: '#ff6b6b', background: 'rgba(255,107,107,0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,107,107,0.2)' }}>
                  Ocurrió un error. Por favor intenta nuevamente.
                </p>
              )}

              <button type="submit" className="btn btn-primary btn-lg btn-full" id="contact-submit-btn" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Enviando requerimiento...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15 3L8 10M15 3l-5 12-2-5-5-2 12-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Enviar Requerimiento
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function CF({ label, id, value, onChange, error, placeholder, type = 'text' }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label} {error && <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>— {error}</span>}</label>
      <input id={id} type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={{ borderColor: error ? '#ff6b6b' : undefined }} />
    </div>
  );
}
