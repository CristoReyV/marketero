// ─────────────────────────────────────────────────────────────────────
// Estilos personalizados de react-select para el tema dark de Markketero
// Importar en cualquier componente que use <ReactSelect />
// ─────────────────────────────────────────────────────────────────────

export const darkSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: 'rgba(255,255,255,0.04)',
    borderColor: state.isFocused ? '#0A6BFF' : 'rgba(10, 107, 255, 0.18)',
    borderRadius: '8px',
    minHeight: '46px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(10,107,255,0.2)' : 'none',
    '&:hover': { borderColor: 'rgba(10, 107, 255, 0.5)' },
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    background: '#091629',
    border: '1px solid rgba(10, 107, 255, 0.25)',
    borderRadius: '8px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    zIndex: 999,
  }),
  menuList: (base) => ({
    ...base,
    padding: '4px',
    maxHeight: '220px',
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? 'rgba(10,107,255,0.3)'
      : state.isFocused
        ? 'rgba(10,107,255,0.12)'
        : 'transparent',
    color: state.isSelected ? '#00D4FF' : '#F0F6FF',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '8px 12px',
    '&:active': { background: 'rgba(10,107,255,0.25)' },
  }),
  singleValue: (base) => ({
    ...base,
    color: '#F0F6FF',
    fontSize: '0.95rem',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#4A6080',
    fontSize: '0.92rem',
  }),
  input: (base) => ({
    ...base,
    color: '#F0F6FF',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#4A6080',
    '&:hover': { color: '#8BA5C8' },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: '#4A6080',
    '&:hover': { color: '#ff6b6b' },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: '#4A6080',
    fontSize: '0.85rem',
  }),
};

/** Variante con borde rojo para campos con error */
export const darkSelectStylesError = {
  ...darkSelectStyles,
  control: (base, state) => ({
    ...darkSelectStyles.control(base, state),
    borderColor: '#ff6b6b',
    '&:hover': { borderColor: '#ff6b6b' },
  }),
};
