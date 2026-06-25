// ─────────────────────────────────────────────────────────────────────
// PhoneField — Campo de teléfono con selector de país, bandera y
// validación real basada en libphonenumber-js
// ─────────────────────────────────────────────────────────────────────
import { Controller } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

/**
 * @param {Object} props
 * @param {import('react-hook-form').Control} props.control
 * @param {Object} props.errors
 */
export default function PhoneField({ control, errors }) {
  return (
    <div className="form-group">
      <label htmlFor="q-telefono">
        Teléfono
        {errors.telefono && (
          <span style={{ color: '#ff6b6b', fontSize: '0.75rem', marginLeft: '0.4rem' }}>
            — {errors.telefono.message}
          </span>
        )}
      </label>

      <Controller
        name="telefono"
        control={control}
        rules={{
          validate: (val) =>
            !val || isValidPhoneNumber(val) ? true : 'Número de teléfono inválido.',
        }}
        render={({ field }) => (
          <PhoneInput
            id="q-telefono"
            international
            defaultCountry="MX"
            value={field.value}
            onChange={field.onChange}
            placeholder="Ej. 747 123 4567"
            numberInputProps={{
              style: {
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${errors.telefono ? '#ff6b6b' : 'rgba(10, 107, 255, 0.18)'}`,
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#F0F6FF',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                width: '100%',
                outline: 'none',
                transition: 'border-color 0.2s',
              },
            }}
            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          />
        )}
      />

      {/* CSS en línea para sobrescribir el estilo del selector de bandera de la librería */}
      <style>{`
        .PhoneInputCountry {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(10, 107, 255, 0.18);
          border-radius: 8px;
          padding: 0 0.75rem;
          gap: 0.4rem;
          height: 46px;
          flex-shrink: 0;
          cursor: pointer;
        }
        .PhoneInputCountrySelect {
          background: #091629;
          color: #F0F6FF;
          border: none;
          outline: none;
          font-family: var(--font-body);
          font-size: 0.9rem;
          cursor: pointer;
          max-width: 28px;
          opacity: 0;
          position: absolute;
        }
        .PhoneInputCountrySelectArrow {
          color: #4A6080;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          width: 6px;
          height: 6px;
          transform: rotate(45deg);
          margin-top: -3px;
          flex-shrink: 0;
        }
        .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          border-radius: 2px;
        }
        .PhoneInput--focus .PhoneInputCountry {
          border-color: #0A6BFF;
        }
      `}</style>
    </div>
  );
}
