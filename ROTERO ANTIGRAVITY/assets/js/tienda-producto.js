/**
 * tienda-producto.js — Rotero Ecommerce Demo
 * Lógica del detalle de producto: fetch por slug, render specs, gallery.
 */
(function () {
  'use strict';

  // ── DOM refs ───────────────────────────────────────────
  const $loading = document.getElementById('loading-state');
  const $error = document.getElementById('error-state');
  const $notFound = document.getElementById('not-found-state');
  const $product = document.getElementById('product-detail');
  const $relatedGrid = document.getElementById('related-grid');
  const $relatedSection = document.getElementById('related-section');

  // ── Helpers ────────────────────────────────────────────
  function show(el) { if (el) el.classList.remove('hidden'); }
  function hide(el) { if (el) el.classList.add('hidden'); }

  function getSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
  }

  // ── Mock Data (Offline Demo) ───────────────────────────
  const MOCK_CATEGORIES = [
    { id: 'cat-1', name: 'Isotanques', slug: 'isotanques', icon: 'cylinder' },
    { id: 'cat-2', name: 'Montacargas', slug: 'montacargas', icon: 'truck' },
    { id: 'cat-3', name: 'Tarimas', slug: 'tarimas', icon: 'layers' },
    { id: 'cat-4', name: 'Consumibles', slug: 'consumibles', icon: 'package' }
  ];

  const MOCK_PRODUCTS = [
    {
      id: 'p1', slug: 'isotanque-t11-20', name: 'Isotanque T11 20ft', is_featured: true, category_id: 'cat-1',
      short_description: 'Diseñado para productos químicos líquidos no peligrosos y alimenticios. Estructura robusta y fácil mantenimiento.',
      description: 'Isotanque T11 estándar internacional con capacidad de 24,000 a 26,000 litros. Diseñado en acero inoxidable 316L, aislado y revestido en acero inoxidable, fibra de vidrio o aluminio. Aprobado para transporte multimodal.',
      specs: { 'Capacidad': '24,000 - 26,000 L', 'Material': 'Acero Inox 316L', 'Presión de trabajo': '4 Bar', 'Tipo': 'T11' },
      shop_categories: MOCK_CATEGORIES[0]
    },
    {
      id: 'p2', slug: 'isotanque-t14-20', name: 'Isotanque T14 20ft', is_featured: false, category_id: 'cat-1',
      short_description: 'Ideal para el transporte seguro de químicos peligrosos, corrosivos y ácidos. Máxima seguridad garantizada.',
      description: 'Especialmente construido para productos altamente corrosivos. Cuenta con recubrimiento interior especial en resina epóxica, caucho o PTFE, cumpliendo las normativas más estrictas de seguridad.',
      specs: { 'Capacidad': '20,000 - 24,000 L', 'Material interior': 'Recubrimiento PTFE / Goma', 'Tipo': 'T14', 'Seguridad': 'Descarga superior obligatoria' },
      shop_categories: MOCK_CATEGORIES[0]
    },
    {
      id: 'p3', slug: 'isotanque-t50-swap-body', name: 'Isotanque T50 Swap Body', is_featured: false, category_id: 'cat-1',
      short_description: 'Especializado para gases licuados con capacidad maximizada y válvula de seguridad optimizada.',
      description: 'Isotanque diseñado para el transporte a presión de gases licuados como LPG, Amoníaco y otros propulsores. Su diseño Swap Body permite un volumen de carga mucho mayor manteniendo la versatilidad multimodal.',
      specs: { 'Capacidad': 'Hasta 35,000 L', 'Material': 'Acero al carbono alta resistencia', 'Presión de trabajo': 'Mayor a 10 Bar', 'Tipo': 'T50 Gas' },
      shop_categories: MOCK_CATEGORIES[0]
    },
    {
      id: 'p4', slug: 'montacargas-electrico-25t', name: 'Montacargas Eléctrico 2.5T', is_featured: true, category_id: 'cat-2',
      short_description: 'Silencioso, cero emisiones, ideal para interiores y almacenes cerrados. Gran eficiencia energética.',
      description: 'Equipo eléctrico de alto desempeño, optimizado con batería de litio para trabajo continuo sin mantenimientos extensos. Ideal para almacenes alimenticios y farmacéuticos.',
      specs: { 'Capacidad': '2,500 kg', 'Elevación': 'Hasta 4.8m Triplex', 'Batería': 'Litio 80V', 'Motor': 'AC Drive' },
      shop_categories: MOCK_CATEGORIES[1]
    },
    {
      id: 'p5', slug: 'montacargas-combustion-5t', name: 'Montacargas Combustión 5T', is_featured: false, category_id: 'cat-2',
      short_description: 'Potente y resistente, diseñado para uso intensivo en exteriores y terrenos irregulares.',
      description: 'Diseñado para mover grandes cargas en patios y zonas descubiertas. Potencia superior con opciones de motor a diésel o dual (gas/gasolina).',
      specs: { 'Capacidad': '5,000 kg', 'Mástil': 'Dúplex / Tríplex', 'Combustible': 'Diésel / Gas LP', 'Neumáticos': 'Rudos / Todo terreno' },
      shop_categories: MOCK_CATEGORIES[1]
    },
    {
      id: 'p6', slug: 'reach-truck-electrico', name: 'Reach Truck Eléctrico', is_featured: false, category_id: 'cat-2',
      short_description: 'Optimiza el espacio de tu almacén con su mástil retráctil. Excelente visibilidad y maniobrabilidad.',
      description: 'Máquina especializada para pasillos estrechos (VNA) y almacenamiento en gran altura. Gran visibilidad y control ergonómico avanzado.',
      specs: { 'Capacidad': '1,500 - 2,000 kg', 'Elevación': 'Hasta 10.5m', 'Pasillo mínimo': '2.8m', 'Batería': 'Alta capacidad' },
      shop_categories: MOCK_CATEGORIES[1]
    },
    {
      id: 'p7', slug: 'tarima-madera-1200x1000', name: 'Tarima de Madera 1200x1000', is_featured: true, category_id: 'cat-3',
      short_description: 'Tarima estándar industrial, tratada térmicamente (HT) para exportación, alta resistencia.',
      description: 'Tarima de madera de pino de primera, fabricada bajo estándares internacionales y tratada térmicamente (NIMF 15) para permitir exportaciones sin riesgo de plagas.',
      specs: { 'Dimensiones': '1200x1000 mm', 'Carga dinámica': '1,500 kg', 'Carga estática': '3,000 kg', 'Tratamiento': 'Térmico NIMF15' },
      shop_categories: MOCK_CATEGORIES[2]
    },
    {
      id: 'p8', slug: 'tarima-plastica-1200x1000', name: 'Tarima Plástica 1200x1000', is_featured: false, category_id: 'cat-3',
      short_description: 'Reutilizable, lavable y libre de plagas. Ideal para la industria alimenticia y farmacéutica.',
      description: 'Pallet plástico inyectado de alta densidad (HDPE). Resistente a impactos, no absorbe humedad, fácil de lavar y completamente libre de astillas.',
      specs: { 'Dimensiones': '1200x1000 mm', 'Material': 'HDPE 100% Virgen/Reciclado', 'Entradas': '4 vías', 'Aplicación': 'Rackeable' },
      shop_categories: MOCK_CATEGORIES[2]
    },
    {
      id: 'p9', slug: 'stretch-film-manual-c80', name: 'Stretch Film Manual Cal. 80', is_featured: false, category_id: 'cat-4',
      short_description: 'Película estirable para uso manual. Excelente elongación y retención de carga.',
      description: 'Rollo de playo manual transparente, proporciona gran seguridad y compactación de las cargas en el pallet, evitando deslizamientos.',
      specs: { 'Calibre': '80', 'Ancho': '18 pulgadas', 'Rendimiento': 'Elongación +150%', 'Color': 'Transparente' },
      shop_categories: MOCK_CATEGORIES[3]
    },
    {
      id: 'p10', slug: 'stretch-film-maquina-c70', name: 'Stretch Film Máquina Cal. 70', is_featured: false, category_id: 'cat-4',
      short_description: 'Rollo para paletizadoras automáticas, maximiza el rendimiento y reduce costos de empaque.',
      description: 'Rollo jumbo diseñado para máquinas envolvedoras automáticas o semiautomáticas, soporta alto pre-estiramiento sin romperse.',
      specs: { 'Calibre': '70', 'Ancho': '20 pulgadas', 'Elongación': 'Hasta 250%', 'Aplicación': 'Máquina envolvedora' },
      shop_categories: MOCK_CATEGORIES[3]
    },
    {
      id: 'p11', slug: 'esquineros-carton-50x50', name: 'Esquineros de Cartón 50x50', is_featured: false, category_id: 'cat-4',
      short_description: 'Protege las esquinas de tus tarimas y cajas durante el flejado y transporte.',
      description: 'Ángulos protectores rígidos de cartón prensado. Distribuyen la tensión del fleje y previenen abolladuras en las esquinas de las cajas o productos.',
      specs: { 'Ala': '50x50 mm', 'Grosor': '4 mm', 'Largo': 'Personalizable (ej. 1m)', 'Material': 'Cartón reciclado Kraft' },
      shop_categories: MOCK_CATEGORIES[3]
    },
    {
      id: 'p12', slug: 'fleje-polipropileno-12', name: 'Fleje de Polipropileno 1/2"', is_featured: false, category_id: 'cat-4',
      short_description: 'Alta resistencia a la tensión para asegurar cajas y palets ligeros a medianos.',
      description: 'Fleje plástico (PP) ideal para uso manual o máquina semi-automática. Fuerte, ligero y seguro de manipular.',
      specs: { 'Medida': '1/2 pulgada (12mm)', 'Color': 'Negro / Blanco', 'Textura': 'Gofrado', 'Uso': 'Manual con grapa o fricción' },
      shop_categories: MOCK_CATEGORIES[3]
    }
  ];

  // ── Fetch product ──────────────────────────────────────
  async function loadProduct() {
    const slug = getSlug();
    if (!slug) {
      hide($loading);
      show($notFound);
      return;
    }

    try {
      // Offline fallback Demo
      const data = MOCK_PRODUCTS.find(p => p.slug === slug);

      setTimeout(() => {
        if (!data) {
          hide($loading);
          show($notFound);
          return;
        }

        renderProduct(data);
        loadRelated(data.category_id, data.id);
      }, 300);
    } catch (err) {
      console.error('Error cargando producto:', err);
      hide($loading);
      show($error);
    }
  }

  // ── Render product detail ──────────────────────────────
  function renderProduct(p) {
    hide($loading);
    show($product);

    const catName = p.shop_categories ? p.shop_categories.name : '';
    const catSlug = p.shop_categories ? p.shop_categories.slug : '';

    // Update page title & meta
    document.title = `${p.seo_title || p.name} | Tienda ROTERO`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', p.seo_description || p.short_description || '');

    // Gallery images
    const mainImage = `assets/tienda/${p.slug}.webp`;
    const galleryImages = Array.isArray(p.gallery) && p.gallery.length > 0
      ? [mainImage, ...p.gallery]
      : [mainImage];

    // Specs
    const specs = p.specs && typeof p.specs === 'object' ? p.specs : {};
    const specsRows = Object.entries(specs).map(([key, val]) => `
      <tr class="border-b border-slate-100 last:border-0">
        <td class="py-3 pr-4 text-sm font-medium text-slate-700 whitespace-nowrap">${key}</td>
        <td class="py-3 text-sm text-slate-600">${val}</td>
      </tr>
    `).join('');

    $product.innerHTML = `
      <!-- Breadcrumb -->
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-6">
        <ol class="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <li><a href="tienda.html" class="hover:text-blue-600 transition">Tienda</a></li>
          <li class="text-slate-300">/</li>
          <li><a href="tienda.html?cat=${catSlug}" class="hover:text-blue-600 transition">${catName}</a></li>
          <li class="text-slate-300">/</li>
          <li class="text-slate-900 font-medium truncate max-w-[200px]">${p.name}</li>
        </ol>
      </nav>

      <!-- Main content -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          <!-- LEFT: Image -->
          <div class="space-y-4">
            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img id="main-product-image"
                src="${mainImage}"
                alt="${p.name}"
                class="w-full h-full object-cover"
              />
              ${p.is_featured ? `
                <span class="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold uppercase tracking-wide shadow-lg">
                  <i data-lucide="star" class="w-3.5 h-3.5"></i>
                  Destacado
                </span>
              ` : ''}
              <span class="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wide shadow-lg">
                <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                Disponible
              </span>
            </div>

            ${galleryImages.length > 1 ? `
              <div class="flex gap-3 overflow-x-auto pb-2">
                ${galleryImages.map((img, i) => `
                  <button onclick="document.getElementById('main-product-image').src='${img}'" 
                    class="shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-blue-500' : 'border-slate-200'} hover:border-blue-400 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                    <img src="${img}" alt="Vista ${i + 1}" class="w-full h-full object-cover" />
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- RIGHT: Info -->
          <div class="flex flex-col">
            <!-- Category badge -->
            <div class="flex items-center gap-2 mb-3">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                <i data-lucide="${p.shop_categories?.icon || 'box'}" class="w-3.5 h-3.5"></i>
                ${catName}
              </span>
            </div>

            <!-- Name -->
            <h1 class="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight font-outfit mb-4">
              ${p.name}
            </h1>

            <!-- Short description -->
            <p class="text-lg text-slate-600 leading-relaxed mb-6">
              ${p.short_description || ''}
            </p>

            <!-- Price indicator -->
            <div class="flex items-center gap-3 mb-8 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200">
              <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <i data-lucide="tag" class="w-5 h-5 text-blue-600"></i>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900">Precio sobre cotización</p>
                <p class="text-xs text-slate-500">Solicita un precio personalizado para tu operación</p>
              </div>
            </div>

            <!-- Full description -->
            ${p.description ? `
              <div class="mb-8">
                <h2 class="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Descripción</h2>
                <p class="text-sm text-slate-600 leading-relaxed">${p.description}</p>
              </div>
            ` : ''}

            <!-- Specs table -->
            ${specsRows ? `
              <div class="mb-8">
                <h2 class="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Especificaciones técnicas</h2>
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table class="w-full">
                    <tbody class="divide-y divide-slate-100">
                      ${specsRows}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- CTAs -->
            <div class="flex flex-col sm:flex-row gap-3 mt-auto pt-6 border-t border-slate-200">
              <button id="btn-quote" 
                class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99]">
                <i data-lucide="file-text" class="w-5 h-5"></i>
                Solicitar cotización
              </button>
              <a href="tienda.html"
                class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                Volver al catálogo
              </a>
            </div>
          </div>
        </div>
      </section>

    `;

    // Re-init Lucide icons
    if (window.lucide) lucide.createIcons({ nodes: $product.querySelectorAll('[data-lucide]') });

    // Quote button → open real modal
    const btnQuote = document.getElementById('btn-quote');
    if (btnQuote) {
      btnQuote.addEventListener('click', () => {
        QuoteModal.open({
          productId: p.id,
          productName: p.name,
          productSlug: p.slug,
        });
      });
    }
  }

  // ── Load related products ──────────────────────────────
  async function loadRelated(categoryId, excludeId) {
    if (!$relatedGrid || !$relatedSection) return;

    try {
      const data = MOCK_PRODUCTS
        .filter(p => p.category_id === categoryId && p.id !== excludeId)
        .slice(0, 4);

      if (!data || data.length === 0) return;

      show($relatedSection);
      $relatedGrid.innerHTML = data.map(p => {
        const catName = p.shop_categories ? p.shop_categories.name : '';
        const catSlug = p.shop_categories ? p.shop_categories.slug : '';
        const catIcon = p.shop_categories ? p.shop_categories.icon : 'box';

        return `
          <a href="tienda-producto.html?slug=${p.slug}"
            class="group bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300">
            <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <img src="assets/tienda/${p.slug}.webp"
                alt="${p.name}" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                onerror="this.src='https://placehold.co/800x600/0f172a/475569?text=Producto'"
                loading="lazy" />
              ${p.is_featured ? `
                <span class="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold uppercase">
                  Destacado
                </span>
              ` : ''}
            </div>
            <div class="p-4">
              <div class="flex items-center gap-1.5 mb-1.5">
                <i data-lucide="${catIcon}" class="w-3 h-3 text-blue-500"></i>
                <span class="text-[11px] font-medium text-blue-600 uppercase tracking-wide">${catName}</span>
              </div>
              <h3 class="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">${p.name}</h3>
            </div>
          </a>
        `;
      }).join('');

      if (window.lucide) lucide.createIcons({ nodes: $relatedGrid.querySelectorAll('[data-lucide]') });
    } catch (err) {
      console.error('Error cargando relacionados:', err);
    }
  }

  // ── Init ───────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', loadProduct);
})();
