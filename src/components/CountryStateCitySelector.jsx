// ─────────────────────────────────────────────────────────────────────
// CountryStateCitySelector — Selector dependiente País > Estado > Ciudad
// Usa la librería `country-state-city` (catálogo oficial de 239 países)
// ─────────────────────────────────────────────────────────────────────
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import { Country, State, City } from 'country-state-city';
import { darkSelectStyles, darkSelectStylesError } from '../styles/selectStyles';

/**
 * @param {Object} props
 * @param {import('react-hook-form').Control} props.control
 * @param {Object} props.errors
 * @param {string} props.watchPais   - valor actual del campo pais
 * @param {string} props.watchEstado - valor actual del campo estado
 * @param {Function} props.onPaisChange   - callback para resetear estado/ciudad
 * @param {Function} props.onEstadoChange - callback para resetear ciudad
 */
export default function CountryStateCitySelector({
  control,
  errors,
  watchPais,
  watchEstado,
  onPaisChange,
  onEstadoChange,
}) {
  // Opciones de país ordenadas con México primero
  const paisOptions = useMemo(() => {
    const all = Country.getAllCountries().map(c => ({
      value: c.isoCode,
      label: `${c.flag} ${c.name}`,
    }));
    const mx = all.find(o => o.value === 'MX');
    const rest = all.filter(o => o.value !== 'MX');
    return mx ? [mx, ...rest] : all;
  }, []);

  // Opciones de estado según país seleccionado
  const estadoOptions = useMemo(() => {
    if (!watchPais) return [];
    return State.getStatesOfCountry(watchPais).map(s => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [watchPais]);

  // Opciones de ciudad según país + estado seleccionados
  const ciudadOptions = useMemo(() => {
    if (!watchPais || !watchEstado) return [];
    return City.getCitiesOfState(watchPais, watchEstado).map(c => ({
      value: c.name,
      label: c.name,
    }));
  }, [watchPais, watchEstado]);

  return (
    <>
      {/* ── País ── */}
      <div className="form-group">
        <label htmlFor="q-pais">
          País
          {errors.pais && <ErrorMsg msg={errors.pais.message} />}
        </label>
        <Controller
          name="pais"
          control={control}
          render={({ field }) => (
            <ReactSelect
              inputId="q-pais"
              options={paisOptions}
              value={paisOptions.find(o => o.value === field.value) || null}
              onChange={opt => {
                field.onChange(opt?.value || '');
                onPaisChange();
              }}
              placeholder="Busca o selecciona tu país..."
              styles={errors.pais ? darkSelectStylesError : darkSelectStyles}
              noOptionsMessage={() => 'Sin resultados'}
            />
          )}
        />
      </div>

      {/* ── Estado / Provincia ── */}
      <div className="form-group">
        <label htmlFor="q-estado">
          Estado / Provincia
          {errors.estado && <ErrorMsg msg={errors.estado.message} />}
        </label>
        <Controller
          name="estado"
          control={control}
          render={({ field }) => (
            <ReactSelect
              inputId="q-estado"
              options={estadoOptions}
              value={estadoOptions.find(o => o.value === field.value) || null}
              onChange={opt => {
                field.onChange(opt?.value || '');
                onEstadoChange();
              }}
              isDisabled={!watchPais || estadoOptions.length === 0}
              placeholder={!watchPais ? 'Primero selecciona un país' : 'Busca o selecciona tu estado...'}
              styles={errors.estado ? darkSelectStylesError : darkSelectStyles}
              noOptionsMessage={() => 'Sin resultados'}
            />
          )}
        />
      </div>

      {/* ── Ciudad / Municipio ── */}
      <div className="form-group">
        <label htmlFor="q-ciudad">
          Ciudad / Municipio
          {errors.ciudad && <ErrorMsg msg={errors.ciudad.message} />}
        </label>
        <Controller
          name="ciudad"
          control={control}
          render={({ field }) => (
            <ReactSelect
              inputId="q-ciudad"
              options={ciudadOptions}
              value={ciudadOptions.find(o => o.value === field.value) || null}
              onChange={opt => field.onChange(opt?.value || '')}
              isDisabled={!watchEstado || ciudadOptions.length === 0}
              placeholder={!watchEstado ? 'Primero selecciona un estado' : 'Busca o selecciona tu ciudad...'}
              styles={errors.ciudad ? darkSelectStylesError : darkSelectStyles}
              noOptionsMessage={() => 'Sin resultados'}
            />
          )}
        />
      </div>
    </>
  );
}

function ErrorMsg({ msg }) {
  return <span style={{ color: '#ff6b6b', fontSize: '0.75rem', marginLeft: '0.4rem' }}>— {msg}</span>;
}
