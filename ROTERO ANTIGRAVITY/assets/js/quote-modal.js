/**
 * quote-modal.js — Rotero Ecommerce Demo (Fase 4)
 * Modal de solicitud de cotización con validación y guardado en Supabase.
 *
 * Uso:
 *   QuoteModal.open({ productId, productName, productSlug })
 */
const QuoteModal = (function () {
  'use strict';

  let isOpen = false;
  let isSubmitting = false;
  let productContext = {};

  // ── Inject modal HTML ──────────────────────────────────
  function injectModal() {
    if (document.getElementById('quote-modal-overlay')) return;

    const html = `
      <!-- OVERLAY -->
      <div id="quote-modal-overlay" class="quote-modal-overlay hidden" aria-hidden="true">
        <div class="quote-modal-backdrop"></div>

        <!-- MODAL PANEL -->
        <div class="quote-modal-panel" role="dialog" aria-modal="true" aria-labelledby="qm-title">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 mb-6 pb-5 border-b border-slate-200">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <i data-lucide="file-text" class="w-4 h-4 text-blue-600"></i>
                </div>
                <h2 id="qm-title" class="text-lg font-semibold text-slate-900">Solicitar cotización</h2>
              </div>
              <p id="qm-product-name" class="text-sm text-slate-500 truncate ml-10"></p>
            </div>
            <button id="qm-close" type="button" class="shrink-0 w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition" aria-label="Cerrar">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- FORM -->
          <form id="qm-form" novalidate autocomplete="on">
            <div class="space-y-4">
              <!-- Row 1: Nombre / Empresa -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="qm-name" class="qm-label">Nombre completo <span class="text-red-400">*</span></label>
                  <input id="qm-name" name="customer_name" type="text" required autocomplete="name" placeholder="Tu nombre"
                    class="qm-input" />
                  <p class="qm-error-msg hidden" data-for="qm-name"></p>
                </div>
                <div>
                  <label for="qm-company" class="qm-label">Empresa <span class="text-red-400">*</span></label>
                  <input id="qm-company" name="company" type="text" required autocomplete="organization" placeholder="Razón social"
                    class="qm-input" />
                  <p class="qm-error-msg hidden" data-for="qm-company"></p>
                </div>
              </div>

              <!-- Row 2: Teléfono / Email -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="qm-phone" class="qm-label">Teléfono <span class="text-red-400">*</span></label>
                  <input id="qm-phone" name="phone" type="tel" required autocomplete="tel" placeholder="+52 55 1234 5678"
                    class="qm-input" />
                  <p class="qm-error-msg hidden" data-for="qm-phone"></p>
                </div>
                <div>
                  <label for="qm-email" class="qm-label">Email <span class="text-red-400">*</span></label>
                  <input id="qm-email" name="email" type="email" required autocomplete="email" placeholder="correo@empresa.com"
                    class="qm-input" />
                  <p class="qm-error-msg hidden" data-for="qm-email"></p>
                </div>
              </div>

              <!-- Row 3: Ciudad / Cantidad -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="qm-city" class="qm-label">Ciudad</label>
                  <input id="qm-city" name="city" type="text" autocomplete="address-level2" placeholder="Monterrey, NL"
                    class="qm-input" />
                </div>
                <div>
                  <label for="qm-qty" class="qm-label">Cantidad</label>
                  <input id="qm-qty" name="quantity" type="number" min="1" placeholder="1"
                    class="qm-input" />
                  <p class="qm-error-msg hidden" data-for="qm-qty"></p>
                </div>
              </div>

              <!-- Row 4: Comentarios -->
              <div>
                <label for="qm-comments" class="qm-label">Comentarios adicionales</label>
                <textarea id="qm-comments" name="comments" rows="3" placeholder="Detalles de tu requerimiento, plazos, especificaciones especiales..."
                  class="qm-input qm-textarea"></textarea>
              </div>
            </div>

            <!-- Error banner -->
            <div id="qm-error-banner" class="hidden mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
              <i data-lucide="alert-circle" class="w-4 h-4 shrink-0 mt-0.5 text-red-400"></i>
              <span id="qm-error-text">Error al enviar. Intenta de nuevo.</span>
            </div>

            <!-- Submit -->
            <button id="qm-submit" type="submit"
              class="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:shadow-blue-500/25">
              <i data-lucide="send" class="w-4 h-4 qm-icon-send"></i>
              <span class="qm-btn-label">Enviar solicitud</span>
              <svg class="qm-spinner hidden w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-25"></circle>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"></path>
              </svg>
            </button>
          </form>

          <!-- SUCCESS STATE -->
          <div id="qm-success" class="hidden text-center py-4">
            <div class="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <i data-lucide="check-circle-2" class="w-8 h-8 text-emerald-500"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">¡Solicitud enviada!</h3>
            <p class="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
              Recibimos tu solicitud de cotización. Nuestro equipo te contactará en menos de 24 horas hábiles.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button id="qm-new-quote" type="button"
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Nueva cotización
              </button>
              <a href="tienda.html"
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                Volver al catálogo
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    // ── Bind events ──────────────────────────────────────
    document.getElementById('qm-close').addEventListener('click', close);
    document.getElementById('quote-modal-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('quote-modal-backdrop')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });
    document.getElementById('qm-form').addEventListener('submit', handleSubmit);
    document.getElementById('qm-new-quote').addEventListener('click', resetToForm);

    // Re-init Lucide icons inside modal
    const overlay = document.getElementById('quote-modal-overlay');
    if (window.lucide) lucide.createIcons({ nodes: overlay.querySelectorAll('[data-lucide]') });
  }

  // ── Open ───────────────────────────────────────────────
  function open(ctx) {
    injectModal();
    productContext = ctx || {};
    isOpen = true;

    // Set product name
    const label = document.getElementById('qm-product-name');
    if (label) label.textContent = productContext.productName || 'Producto';

    // Show form, hide success
    resetToForm();

    const overlay = document.getElementById('quote-modal-overlay');
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first input after animation
    setTimeout(() => {
      const first = document.getElementById('qm-name');
      if (first) first.focus();
    }, 150);
  }

  // ── Close ──────────────────────────────────────────────
  function close() {
    isOpen = false;
    const overlay = document.getElementById('quote-modal-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ── Reset to form ──────────────────────────────────────
  function resetToForm() {
    const form = document.getElementById('qm-form');
    const success = document.getElementById('qm-success');
    const errorBanner = document.getElementById('qm-error-banner');

    if (form) { form.reset(); form.classList.remove('hidden'); }
    if (success) success.classList.add('hidden');
    if (errorBanner) errorBanner.classList.add('hidden');

    clearAllFieldErrors();
    setSubmitState('idle');
  }

  // ── Validate ───────────────────────────────────────────
  function validate() {
    clearAllFieldErrors();
    let valid = true;

    const name = val('qm-name');
    const company = val('qm-company');
    const phone = val('qm-phone');
    const email = val('qm-email');
    const qty = document.getElementById('qm-qty').value.trim();

    if (!name) { showFieldError('qm-name', 'El nombre es obligatorio'); valid = false; }
    if (!company) { showFieldError('qm-company', 'La empresa es obligatoria'); valid = false; }
    if (!phone) { showFieldError('qm-phone', 'El teléfono es obligatorio'); valid = false; }
    if (!email) {
      showFieldError('qm-email', 'El email es obligatorio'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError('qm-email', 'Ingresa un email válido'); valid = false;
    }
    if (qty && (isNaN(Number(qty)) || Number(qty) < 1)) {
      showFieldError('qm-qty', 'Ingresa una cantidad válida'); valid = false;
    }

    return valid;
  }

  function val(id) { return (document.getElementById(id)?.value || '').trim(); }

  function showFieldError(inputId, msg) {
    const input = document.getElementById(inputId);
    const err = document.querySelector(`.qm-error-msg[data-for="${inputId}"]`);
    if (input) input.classList.add('qm-input-error');
    if (err) { err.textContent = msg; err.classList.remove('hidden'); }
  }

  function clearAllFieldErrors() {
    document.querySelectorAll('.qm-input-error').forEach(el => el.classList.remove('qm-input-error'));
    document.querySelectorAll('.qm-error-msg').forEach(el => el.classList.add('hidden'));
  }

  // ── Submit state ───────────────────────────────────────
  function setSubmitState(state) {
    const btn = document.getElementById('qm-submit');
    const iconSend = btn?.querySelector('.qm-icon-send');
    const spinner = btn?.querySelector('.qm-spinner');
    const label = btn?.querySelector('.qm-btn-label');
    if (!btn) return;

    if (state === 'loading') {
      btn.disabled = true;
      if (iconSend) iconSend.classList.add('hidden');
      if (spinner) spinner.classList.remove('hidden');
      if (label) label.textContent = 'Enviando...';
    } else {
      btn.disabled = false;
      if (iconSend) iconSend.classList.remove('hidden');
      if (spinner) spinner.classList.add('hidden');
      if (label) label.textContent = 'Enviar solicitud';
    }
  }

  // ── Handle submit ──────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    // Prevent double submit
    if (isSubmitting) return;

    if (!validate()) return;

    isSubmitting = true;
    setSubmitState('loading');

    const errorBanner = document.getElementById('qm-error-banner');
    const errorText = document.getElementById('qm-error-text');
    if (errorBanner) errorBanner.classList.add('hidden');

    const payload = {
      product_id: productContext.productId || null,
      product_name: productContext.productName || '',
      customer_name: val('qm-name'),
      company: val('qm-company'),
      phone: val('qm-phone'),
      email: val('qm-email'),
      city: val('qm-city') || null,
      quantity: val('qm-qty') || null,
      comments: val('qm-comments') || null,
      source_url: window.location.href,
      status: 'pending',
    };

    try {
      // Offline fallback Demo
      await new Promise(resolve => setTimeout(resolve, 800));

      // Success
      const form = document.getElementById('qm-form');
      const success = document.getElementById('qm-success');
      if (form) form.classList.add('hidden');
      if (success) {
        success.classList.remove('hidden');
        if (window.lucide) lucide.createIcons({ nodes: success.querySelectorAll('[data-lucide]') });
      }
    } catch (err) {
      console.error('Error guardando cotización:', err);
      if (errorBanner) errorBanner.classList.remove('hidden');
      if (errorText) errorText.textContent = 'No pudimos enviar tu solicitud. Revisa tu conexión e intenta de nuevo.';
      if (window.lucide) {
        lucide.createIcons({ nodes: errorBanner.querySelectorAll('[data-lucide]') });
      }
    } finally {
      isSubmitting = false;
      setSubmitState('idle');
    }
  }

  // ── Public API ─────────────────────────────────────────
  return { open, close };
})();
