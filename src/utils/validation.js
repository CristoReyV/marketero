// ═══════════════════════════════════════════════════════════════════
// MARKKETERO — Utilidades de Validación y Sanitización
// ═══════════════════════════════════════════════════════════════════

// ── Sanitización ────────────────────────────────────────────────────
/**
 * Elimina etiquetas HTML y limpia espacios dobles en un string.
 */
export function sanitizeText(str = '') {
  return str
    .replace(/<[^>]*>/g, '')       // strip HTML tags
    .replace(/\s\s+/g, ' ')         // collapse multiple spaces
    .trim();
}

/**
 * Sanitiza todos los campos de texto del formulario.
 */
export function sanitizeForm(form) {
  const textFields = ['nombre', 'empresa', 'mensaje'];
  const sanitized = { ...form };
  textFields.forEach(field => {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeText(sanitized[field]);
    }
  });
  return sanitized;
}

// ── Validadores ─────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida el formulario de cotización.
 * @param {Object} form - Datos del formulario
 * @param {string} phoneNumber - Solo los dígitos del teléfono
 * @param {Object} country - Objeto de país seleccionado { dial, minDigits, maxDigits }
 * @returns {Object} errors - { campo: 'mensaje de error' }
 */
export function validateQuoteForm(form, phoneNumber, country) {
  const e = {};

  // Nombre
  const nombre = sanitizeText(form.nombre || '');
  if (!nombre || nombre.length < 3) {
    e.nombre = 'Nombre obligatorio, mínimo 3 caracteres.';
  } else if (nombre.length > 80) {
    e.nombre = 'Máximo 80 caracteres.';
  }

  // Empresa
  const empresa = sanitizeText(form.empresa || '');
  if (!empresa || empresa.length < 2) {
    e.empresa = 'Empresa obligatoria, mínimo 2 caracteres.';
  } else if (empresa.length > 120) {
    e.empresa = 'Máximo 120 caracteres.';
  }

  // Correo
  const correo = (form.correo || '').trim();
  if (!correo) {
    e.correo = 'Correo obligatorio.';
  } else if (!EMAIL_RE.test(correo)) {
    e.correo = 'Formato de correo inválido.';
  } else if (correo.length > 120) {
    e.correo = 'Máximo 120 caracteres.';
  }

  // País
  if (!form.pais) {
    e.pais = 'Selecciona un país.';
  }

  // Teléfono
  const digits = (phoneNumber || '').replace(/\D/g, '');
  if (!digits) {
    e.telefono = 'Teléfono obligatorio.';
  } else if (country) {
    if (digits.length < country.minDigits) {
      e.telefono = `Mínimo ${country.minDigits} dígitos para este país.`;
    } else if (digits.length > country.maxDigits) {
      e.telefono = `Máximo ${country.maxDigits} dígitos para este país.`;
    }
  }

  // Estado
  if (!form.estado) {
    e.estado = 'Selecciona un estado.';
  }

  // Municipio
  if (!form.municipio) {
    e.municipio = 'Selecciona un municipio.';
  }

  // Giro
  if (!form.giro) {
    e.giro = 'Selecciona el giro de tu empresa.';
  }

  // Mensaje (opcional, solo longitud)
  const mensaje = sanitizeText(form.mensaje || '');
  if (mensaje.length > 800) {
    e.mensaje = 'Máximo 800 caracteres.';
  }

  return e;
}
