/**
 * Tienda.js — Rotero Ecommerce Demo
 * Lógica del catálogo: fetch categorías/productos, filtros, búsqueda.
 */
(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────
  let allProducts = [];
  let allCategories = [];
  let activeCategory = null;
  let searchTerm = '';

  // ── DOM refs ───────────────────────────────────────────
  const $grid = document.getElementById('products-grid');
  const $cats = document.getElementById('categories-bar');
  const $search = document.getElementById('search-input');
  const $count = document.getElementById('results-count');
  const $loading = document.getElementById('loading-state');
  const $error = document.getElementById('error-state');
  const $empty = document.getElementById('empty-state');

  // ── Lucide icon map (category slug → icon name) ───────
  const iconMap = {
    cylinder: '<i data-lucide="cylinder" class="w-5 h-5"></i>',
    forklift: '<i data-lucide="truck" class="w-5 h-5"></i>',
    layers: '<i data-lucide="layers" class="w-5 h-5"></i>',
    package: '<i data-lucide="package" class="w-5 h-5"></i>',
    wrench: '<i data-lucide="wrench" class="w-5 h-5"></i>',
  };

  // ── Helpers ────────────────────────────────────────────
  function show(el) { if (el) el.classList.remove('hidden'); }
  function hide(el) { if (el) el.classList.add('hidden'); }

  function slugIcon(iconName) {
    return iconMap[iconName] || '<i data-lucide="box" class="w-5 h-5"></i>';
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
      shop_categories: MOCK_CATEGORIES[0]
    },
    {
      id: 'p2', slug: 'isotanque-t14-20', name: 'Isotanque T14 20ft', is_featured: false, category_id: 'cat-1',
      short_description: 'Ideal para el transporte seguro de químicos peligrosos, corrosivos y ácidos. Máxima seguridad garantizada.',
      shop_categories: MOCK_CATEGORIES[0]
    },
    {
      id: 'p3', slug: 'isotanque-t50-swap-body', name: 'Isotanque T50 Swap Body', is_featured: false, category_id: 'cat-1',
      short_description: 'Especializado para gases licuados con capacidad maximizada y válvula de seguridad optimizada.',
      shop_categories: MOCK_CATEGORIES[0]
    },
    {
      id: 'p4', slug: 'montacargas-electrico-25t', name: 'Montacargas Eléctrico 2.5T', is_featured: true, category_id: 'cat-2',
      short_description: 'Silencioso, cero emisiones, ideal para interiores y almacenes cerrados. Gran eficiencia energética.',
      shop_categories: MOCK_CATEGORIES[1]
    },
    {
      id: 'p5', slug: 'montacargas-combustion-5t', name: 'Montacargas Combustión 5T', is_featured: false, category_id: 'cat-2',
      short_description: 'Potente y resistente, diseñado para uso intensivo en exteriores y terrenos irregulares.',
      shop_categories: MOCK_CATEGORIES[1]
    },
    {
      id: 'p6', slug: 'reach-truck-electrico', name: 'Reach Truck Eléctrico', is_featured: false, category_id: 'cat-2',
      short_description: 'Optimiza el espacio de tu almacén con su mástil retráctil. Excelente visibilidad y maniobrabilidad.',
      shop_categories: MOCK_CATEGORIES[1]
    },
    {
      id: 'p7', slug: 'tarima-madera-1200x1000', name: 'Tarima de Madera 1200x1000', is_featured: true, category_id: 'cat-3',
      short_description: 'Tarima estándar industrial, tratada térmicamente (HT) para exportación, alta resistencia.',
      shop_categories: MOCK_CATEGORIES[2]
    },
    {
      id: 'p8', slug: 'tarima-plastica-1200x1000', name: 'Tarima Plástica 1200x1000', is_featured: false, category_id: 'cat-3',
      short_description: 'Reutilizable, lavable y libre de plagas. Ideal para la industria alimenticia y farmacéutica.',
      shop_categories: MOCK_CATEGORIES[2]
    },
    {
      id: 'p9', slug: 'stretch-film-manual-c80', name: 'Stretch Film Manual Cal. 80', is_featured: false, category_id: 'cat-4',
      short_description: 'Película estirable para uso manual. Excelente elongación y retención de carga.',
      shop_categories: MOCK_CATEGORIES[3]
    },
    {
      id: 'p10', slug: 'stretch-film-maquina-c70', name: 'Stretch Film Máquina Cal. 70', is_featured: false, category_id: 'cat-4',
      short_description: 'Rollo para paletizadoras automáticas, maximiza el rendimiento y reduce costos de empaque.',
      shop_categories: MOCK_CATEGORIES[3]
    },
    {
      id: 'p11', slug: 'esquineros-carton-50x50', name: 'Esquineros de Cartón 50x50', is_featured: false, category_id: 'cat-4',
      short_description: 'Protege las esquinas de tus tarimas y cajas durante el flejado y transporte.',
      shop_categories: MOCK_CATEGORIES[3]
    },
    {
      id: 'p12', slug: 'fleje-polipropileno-12', name: 'Fleje de Polipropileno 1/2"', is_featured: false, category_id: 'cat-4',
      short_description: 'Alta resistencia a la tensión para asegurar cajas y palets ligeros a medianos.',
      shop_categories: MOCK_CATEGORIES[3]
    }
  ];

  // ── Fetch data ─────────────────────────────────────────
  async function fetchData() {
    show($loading);
    hide($error);
    hide($empty);

    try {
      // Offline fallback Demo
      allCategories = MOCK_CATEGORIES;
      allProducts = MOCK_PRODUCTS;

      setTimeout(() => {
        renderCategories();
        renderProducts();
      }, 300); // Pequeño delay para simular carga
    } catch (err) {
      console.error('Error cargando catálogo:', err);
      hide($loading);
      show($error);
    }
  }

  // ── Render categories ──────────────────────────────────
  function renderCategories() {
    if (!$cats) return;

    const pills = allCategories.map(cat => {
      const isActive = activeCategory === cat.id;
      return `
        <button
          data-cat-id="${cat.id}"
          class="cat-pill group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
            ${isActive
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md'
            }"
          aria-pressed="${isActive}"
        >
          ${slugIcon(cat.icon)}
          ${cat.name}
        </button>
      `;
    }).join('');

    const allActive = !activeCategory;
    const allPill = `
      <button
        data-cat-id=""
        class="cat-pill group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
          ${allActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md'
          }"
        aria-pressed="${allActive}"
      >
        <i data-lucide="layout-grid" class="w-5 h-5"></i>
        Todos
      </button>
    `;

    $cats.innerHTML = allPill + pills;

    // Re-create Lucide icons inside pills
    if (window.lucide) lucide.createIcons({ nodes: $cats.querySelectorAll('[data-lucide]') });

    // Click handlers
    $cats.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.catId;
        activeCategory = catId || null;
        renderCategories();
        renderProducts();
      });
    });
  }

  // ── Filter logic ───────────────────────────────────────
  function getFilteredProducts() {
    return allProducts.filter(p => {
      const matchesCat = !activeCategory || p.category_id === activeCategory;
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm) ||
        (p.short_description && p.short_description.toLowerCase().includes(searchTerm)) ||
        (p.shop_categories && p.shop_categories.name.toLowerCase().includes(searchTerm));
      return matchesCat && matchesSearch;
    });
  }

  // ── Render products ────────────────────────────────────
  function renderProducts() {
    hide($loading);
    const filtered = getFilteredProducts();

    // Update count
    if ($count) {
      $count.textContent = `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`;
    }

    // Empty state
    if (filtered.length === 0) {
      hide($grid);
      show($empty);
      return;
    }

    hide($empty);
    show($grid);

    $grid.innerHTML = filtered.map(p => {
      const catName = p.shop_categories ? p.shop_categories.name : '';
      const catSlug = p.shop_categories ? p.shop_categories.slug : '';
      const catIcon = p.shop_categories ? p.shop_categories.icon : 'box';

      return `
        <article class="product-card group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300">
          <!-- Image -->
          <a href="tienda-producto.html?slug=${p.slug}" class="block relative aspect-[4/3] overflow-hidden bg-slate-100">
            <img
              src="assets/tienda/${p.slug}.webp"
              alt="${p.name}"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onerror="this.src='https://placehold.co/800x600/0f172a/475569?text=Producto'"
              loading="lazy"
            />
            ${p.is_featured ? `
              <span class="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-semibold uppercase tracking-wide shadow-lg">
                <i data-lucide="star" class="w-3 h-3"></i>
                Destacado
              </span>
            ` : ''}
            <span class="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] font-semibold uppercase tracking-wide">
              Disponible
            </span>
          </a>

          <!-- Content -->
          <div class="p-5">
            <!-- Category tag -->
            <div class="flex items-center gap-1.5 mb-2">
              <i data-lucide="${catIcon}" class="w-3.5 h-3.5 text-blue-500"></i>
              <span class="text-xs font-medium text-blue-600 uppercase tracking-wide">${catName}</span>
            </div>

            <!-- Name -->
            <h3 class="font-semibold text-slate-900 text-lg leading-snug mb-2 group-hover:text-blue-600 transition-colors">
              <a href="tienda-producto.html?slug=${p.slug}" class="after:absolute after:inset-0">
                ${p.name}
              </a>
            </h3>

            <!-- Description -->
            <p class="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
              ${p.short_description || ''}
            </p>

            <!-- CTA -->
            <a href="tienda-producto.html?slug=${p.slug}"
              class="relative z-10 inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-blue-600 transition-colors duration-200">
              Ver producto
              <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-0.5"></i>
            </a>
          </div>
        </article>
      `;
    }).join('');

    // Re-create Lucide icons inside cards
    if (window.lucide) lucide.createIcons({ nodes: $grid.querySelectorAll('[data-lucide]') });
  }

  // ── Search ─────────────────────────────────────────────
  if ($search) {
    let debounceTimer;
    $search.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchTerm = $search.value.trim().toLowerCase();
        renderProducts();
      }, 250);
    });
  }

  // ── Init ───────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', fetchData);
})();
