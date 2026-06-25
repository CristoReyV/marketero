// ─────────────────────────────────────────────────────────────────────
// QuoteForm — Formulario de cotización modular con:
//   · react-hook-form + Zod  (validaciones)
//   · react-phone-number-input (teléfono)
//   · country-state-city + react-select (ubicación)
// ─────────────────────────────────────────────────────────────────────
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactSelect from 'react-select';
import { sendQuoteRequest } from '../utils/emailService';
import { quoteSchema } from '../utils/quoteSchema';
import PhoneField from './PhoneField';
import CountryStateCitySelector from './CountryStateCitySelector';
import { darkSelectStyles, darkSelectStylesError } from '../styles/selectStyles';

const SECTORS_GIRO = [
  'Salud y Laboratorio','Construcción','Industria','Oficinas y Corporativos',
  'Limpieza e Higiene','Ferretería','Refrigeración y Cadena de Frío',
  'Alimentos y Bebidas','Gobierno e Instituciones','Educación','Otro',
];

const giroOptions = SECTORS_GIRO.map(s => ({ value: s, label: s }));

/**
 * @param {Object} props
 * @param {Array}    props.items       — Items de cotización del contexto
 * @param {Function} props.onSuccess   — Callback cuando el envío es exitoso
 */
export default function QuoteForm({ items, onSuccess }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      nombre: '', empresa: '', correo: '',
      telefono: '', pais: 'MX', estado: '', ciudad: '',
      giro: '', mensaje: '', website: '',
    },
  });

  const watchPais   = watch('pais');
  const watchEstado = watch('estado');
  const watchMensaje = watch('mensaje') || '';

  const onSubmit = async (data) => {
    // Anti-spam: honeypot
    if (data.website) return;

    // Verificar que hay productos
    if (!items.length) {
      setError('root', { message: 'Agrega al menos un producto antes de enviar.' });
      return;
    }

    try {
      await sendQuoteRequest({
        formData: {
          nombre: data.nombre,
          empresa: data.empresa,
          correo: data.correo,
          telefono: data.telefono,
          ciudad: `${data.ciudad}, ${data.estado}`,
          estado: data.estado,
          municipio: data.ciudad,
          giro: data.giro,
          mensaje: data.mensaje || '',
          pais: data.pais,
          timestamp: new Date().toISOString(),
        },
        quoteItems: items,
      });
      onSuccess(data.correo);
    } catch {
      setError('root', { message: 'Error al enviar. Por favor intenta de nuevo.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>

      {/* Honeypot invisible */}
      <input
        type="text"
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
      />

      {/* Nombre */}
      <FormField
        label="Nombre completo"
        id="q-nombre"
        error={errors.nombre}
        {...register('nombre')}
        placeholder="Tu nombre completo"
        maxLength={80}
      />

      {/* Empresa */}
      <FormField
        label="Empresa / Organización"
        id="q-empresa"
        error={errors.empresa}
        {...register('empresa')}
        placeholder="Nombre de tu empresa"
        maxLength={120}
      />

      {/* Correo */}
      <FormField
        label="Correo electrónico"
        id="q-correo"
        type="email"
        error={errors.correo}
        {...register('correo')}
        placeholder="correo@empresa.com"
        maxLength={120}
      />

      {/* Teléfono con banderas */}
      <PhoneField control={control} errors={errors} />

      {/* País > Estado > Ciudad */}
      <CountryStateCitySelector
        control={control}
        errors={errors}
        watchPais={watchPais}
        watchEstado={watchEstado}
        onPaisChange={() => { setValue('estado', ''); setValue('ciudad', ''); }}
        onEstadoChange={() => setValue('ciudad', '')}
      />

      {/* Giro */}
      <div className="form-group">
        <label htmlFor="q-giro">
          Giro de la empresa
          {errors.giro && <ErrorMsg msg={errors.giro.message} />}
        </label>
        <Controller
          name="giro"
          control={control}
          render={({ field }) => (
            <ReactSelect
              inputId="q-giro"
              options={giroOptions}
              value={giroOptions.find(o => o.value === field.value) || null}
              onChange={opt => field.onChange(opt?.value || '')}
              placeholder="Selecciona tu giro..."
              styles={errors.giro ? darkSelectStylesError : darkSelectStyles}
              noOptionsMessage={() => 'Sin resultados'}
            />
          )}
        />
      </div>

      {/* Mensaje opcional */}
      <div className="form-group">
        <label htmlFor="q-mensaje">
          Requerimiento adicional
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginLeft: '0.4rem' }}>(opcional)</span>
        </label>
        <textarea
          id="q-mensaje"
          rows={3}
          {...register('mensaje')}
          placeholder="Especificaciones adicionales, volúmenes, urgencia..."
          maxLength={800}
          style={{ resize: 'vertical', borderColor: errors.mensaje ? '#ff6b6b' : undefined }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{watchMensaje.length}/800</span>
          {errors.mensaje && <ErrorMsg msg={errors.mensaje.message} />}
        </div>
      </div>

      {/* Aviso legal */}
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
        ⚖️ El envío de esta solicitud no representa una compra. Un asesor comercial validará disponibilidad, precios y condiciones.
      </p>

      {/* Error general / root */}
      {errors.root && (
        <p style={{ fontSize: '0.82rem', color: '#ff6b6b', background: 'rgba(255,107,107,0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,107,107,0.2)' }}>
          {errors.root.message}
        </p>
      )}

      {/* Botón enviar */}
      <button
        type="submit"
        className="btn btn-primary btn-lg btn-full"
        id="quote-submit-btn"
        disabled={isSubmitting}
        style={{ marginTop: '0.5rem' }}
      >
        {isSubmitting ? (
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
  );
}

// ── Helpers ───────────────────────────────────────────────────────────
function ErrorMsg({ msg }) {
  return <span style={{ color: '#ff6b6b', fontSize: '0.75rem', marginLeft: '0.4rem' }}>— {msg}</span>;
}

import { forwardRef } from 'react';

const FormField = forwardRef(function FormField(
  { label, id, error, placeholder, type = 'text', maxLength, ...rest },
  ref
) {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        {error && <ErrorMsg msg={error.message} />}
      </label>
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{ borderColor: error ? '#ff6b6b' : undefined }}
        {...rest}
      />
    </div>
  );
});
