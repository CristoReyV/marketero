// ═══════════════════════════════════════════════════════════════════
// MARKETERO — Servicio de Email
// ═══════════════════════════════════════════════════════════════════
// Usa la API REST de EmailJS (no requiere librería npm).
// Documentación: https://www.emailjs.com/docs/rest-api/send/
//
// PASOS PARA CONECTAR:
// 1. Crea cuenta en https://www.emailjs.com/
// 2. Crea un "Email Service" y copia el SERVICE_ID
// 3. Crea templates para cotización y contacto, copia sus TEMPLATE_ID
// 4. Ve a Account > API Keys y copia tu PUBLIC_KEY
// 5. Reemplaza los valores de EMAILJS_CONFIG abajo
// ═══════════════════════════════════════════════════════════════════

// ┌─────────────────────────────────────────────────────────────────┐
// │  CONFIGURACIÓN — EDITAR ANTES DE PRODUCCIÓN                     │
// └─────────────────────────────────────────────────────────────────┘
const EMAILJS_CONFIG = {
  SERVICE_ID:          'YOUR_SERVICE_ID',          // Ej: "service_abc123"
  TEMPLATE_QUOTE_ID:   'YOUR_QUOTE_TEMPLATE_ID',   // Template para cotizaciones
  TEMPLATE_CONTACT_ID: 'YOUR_CONTACT_TEMPLATE_ID', // Template para contacto
  PUBLIC_KEY:          'YOUR_PUBLIC_KEY',           // Tu Public Key de EmailJS
  RECIPIENT_EMAIL:     'contacto@marketero.com',    // Correo que recibe las solicitudes
};

const EMAILJS_API = 'https://api.emailjs.com/api/v1.0/email/send';

const isConfigured = () =>
  EMAILJS_CONFIG.SERVICE_ID  !== 'YOUR_SERVICE_ID' &&
  EMAILJS_CONFIG.PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY';

// ── Enviar vía REST API de EmailJS ──────────────────────────────────
async function sendViaEmailJS(templateId, templateParams) {
  const body = {
    service_id:   EMAILJS_CONFIG.SERVICE_ID,
    template_id:  templateId,
    user_id:      EMAILJS_CONFIG.PUBLIC_KEY,
    template_params: templateParams,
  };

  const response = await fetch(EMAILJS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`EmailJS error ${response.status}: ${text}`);
  }

  return { success: true };
}

// ═══════════════════════════════════════════════════════════════════
// Enviar Solicitud de Cotización
// ═══════════════════════════════════════════════════════════════════
export async function sendQuoteRequest({ formData, quoteItems }) {
  const productsText = quoteItems
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} | Categoría: ${item.category} | Cantidad: ${item.quantity}${
          item.comment ? ` | Nota: ${item.comment}` : ''
        }`
    )
    .join('\n');

  const templateParams = {
    to_email:       EMAILJS_CONFIG.RECIPIENT_EMAIL,
    from_name:      formData.nombre,
    from_company:   formData.empresa,
    from_email:     formData.correo,
    from_phone:     formData.telefono,
    from_city:      formData.ciudad,
    from_giro:      formData.giro,
    message:        formData.mensaje || 'Sin comentarios adicionales.',
    products_list:  productsText,
    total_products: quoteItems.length,
    date: new Date().toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric',
    }),
  };

  if (!isConfigured()) {
    // Modo demo: simular envío exitoso
    console.log('📧 [MODO DEMO] Solicitud de cotización:', templateParams);
    await new Promise(r => setTimeout(r, 1500));
    return { success: true, demo: true };
  }

  return sendViaEmailJS(EMAILJS_CONFIG.TEMPLATE_QUOTE_ID, templateParams);
}

// ═══════════════════════════════════════════════════════════════════
// Enviar Formulario de Contacto / Requerimiento
// ═══════════════════════════════════════════════════════════════════
export async function sendContactRequest(formData) {
  const templateParams = {
    to_email:          EMAILJS_CONFIG.RECIPIENT_EMAIL,
    from_company:      formData.empresa,
    from_name:         formData.nombre,
    from_email:        formData.correo,
    from_phone:        formData.telefono,
    product_needed:    formData.producto,
    quantity_estimate: formData.cantidad,
    message:           formData.comentarios || 'Sin comentarios.',
    date: new Date().toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric',
    }),
  };

  if (!isConfigured()) {
    console.log('📧 [MODO DEMO] Requerimiento de contacto:', templateParams);
    await new Promise(r => setTimeout(r, 1500));
    return { success: true, demo: true };
  }

  return sendViaEmailJS(EMAILJS_CONFIG.TEMPLATE_CONTACT_ID, templateParams);
}
