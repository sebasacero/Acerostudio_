/* ==========================================================================
   js/i18n.js — idioma ES/EN, menú de la cabecera y WhatsApp
   El HTML trae el texto en español; aquí está la versión en inglés. El idioma
   se detecta del navegador (o del último elegido) y cambia <html lang>, que es
   lo que leen el chat (js/rediseno-ia.js), los diagramas (js/acero.js, evento
   "acero:lang") y la calculadora de acero.
   ========================================================================== */
(function () {
  'use strict';

  // ── WhatsApp: única fuente de verdad (código país + número, sin + ni espacios) ──
  window.ACERO_WHATSAPP_NUMBER = '573152125327';
  window.ACERO_WHATSAPP_DEFAULT_MESSAGE = 'Hola, quiero información sobre un proyecto con acero.studio.';
  window.buildWaLink = function (message) {
    return 'https://wa.me/' + window.ACERO_WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message || window.ACERO_WHATSAPP_DEFAULT_MESSAGE);
  };

  var EN = {
    meta_title: 'AceroStudio — Design intelligence for steel architecture',
    meta_description: 'AceroStudio is design intelligence for architecture: steel structures, sales-grade renders, a 3D Studio in the browser and space redesign from a single photo. From Bogotá.',
    nav_open: 'Open menu', nav_how: 'How it works', nav_projects: 'Projects', nav_platform: 'Platform', nav_calc: 'Calculator', nav_steel: 'Steel', nav_b2b: 'Business',
    cta_upload: 'Upload a photo',
    hero_pill: 'Design intelligence for architecture · Bogotá',
    hero_h1: 'Design your<br><span class="u">space</span><i>.</i>',
    hero_lead: 'Upload a photo of your space as it is today and get a proposal that respects walls, windows and columns. And if you are going to build, we design it in steel: structure, quantities and a render that sells.',
    hero_cta1: 'Upload a photo →', hero_cta2: 'Create your steel structure',
    hero_m1k: 'Example', hero_m1v: '~38 m² shop · steel column · 2 windows', hero_m2k: 'Delivery', hero_m2v: 'Diagnosis → proposal · 72 h',
    hero_seq: 'Redesign sequence',
    visor_alt: 'Golden-hour render of a five-storey steel building with HEB frames, IPE beams, X bracing, curtain wall and pergola',
    visor_kick: 'Fig. 02 · Sales render · tap the diamonds', visor_h2: 'Everything we design is <i>steel</i>.',
    visor_s1: 'of steel', visor_s2: 'built area',
    visor_p: 'Five-storey building generated in the 3D Studio: HEB 300 columns, IPE 400 beams and a steel-deck slab, rendered in Blender at golden hour.',
    visor_cta1: 'Open it in the 3D Studio', visor_cta2: 'Size your structure',
    how_fig: 'Fig. 03 · How it works', how_h2: 'Your space, reinvented before moving a single brick.',
    how_lead: 'acero.studio turns a real photo of your space into a redesign proposal and connects you with an advisor to build it in steel.',
    how1_t: 'Upload a real photo', how1_p: 'From your camera or gallery. Interior or façade, exactly as it is today, no plans or measurements.',
    how2_t: 'Pick style and scope', how2_p: 'Minimalist, industrial, warm, Scandinavian or tropical. Interior, façade or a new steel structure.',
    how3_t: 'We mark it with the red pencil', how3_p: 'What stays, what changes and the pre-sized steel structure, with its render.',
    how4_t: 'Get a quote on WhatsApp', how4_p: 'Talk directly with an advisor: materials, tons of steel, timeline and budget.', how4_cta: 'Send on WhatsApp →',
    pen_fig: 'Fig. 04 · Origin · The workshop', pen_h2: 'Before you cut, you mark.',
    pen_lead: 'The red pencil is the oldest tool in the studio. Today it marks what the AI proposes to change: everything red on this page is a design decision.',
    pen_quote: '“In my grandfather’s ironwork shop we used a <b>red pencil</b>.”',
    pen_p: 'On steel, red shows through grease, dust or rust. That is why the workshop marks are the same ones we use in every proposal:',
    sty_fig: 'Fig. 05 · Style', sty_h2: 'Same space, five styles.',
    sty_lead: 'Tap a style and watch the same shop change: the steel column, walls and windows stay put, everything else changes.',
    sty_group: 'Styles', sty_cta: 'Try this style →', sty_cap: 'Proposal · axonometric view',
    chat_fig_l: 'Fig. 06 · Assistant', chat_h2: 'Try it with your space.',
    chat_lead: 'Send the assistant a photo: pick style and scope, and our team messages you on WhatsApp with the proposal marked in red.',
    chat_s1: 'Photo', chat_s1p: 'Camera or gallery, as it is today.', chat_s2: 'Style and scope', chat_s2p: 'Interior, façade or steel structure.', chat_s3: 'WhatsApp', chat_s3p: 'We message you with the proposal and quote.',
    chat_scope: 'Interiors, façades and steel structures · shops, offices, homes and warehouses',
    chat_fig: 'Redesign assistant', chat_state: 'status: welcome',
    si_lead: 'This is how I read your space: walls, windows and the steel column (in blue and red) stay put. Everything else can be redesigned.',
    si_step1_title: 'Upload a photo', si_step1_body: 'Camera or gallery, as it is today.',
    si_step2_title: 'Choose a style', si_step2_body: 'Minimalist, industrial, warm, Scandinavian…',
    si_step3_title: 'Choose the scope', si_step3_body: 'Interior, façade or steel structure.',
    si_step4_title: 'Get a quote on WhatsApp', si_step4_body: 'Talk directly with a real advisor.',
    si_cta: '↓ Use the buttons below to start',
    btn_camera: 'Take photo', btn_gallery: 'Upload from gallery', btn_photo: 'Photo', btn_send: 'Send', input_placeholder: 'Type a message…', input_aria: 'Message',
    composer_hint: 'Interior, façade and steel structure redesign',
    proj_fig: 'Fig. 07 · Steel projects', proj_h2: 'Renders that sell the project.',
    proj_lead: 'Every typology comes from the same steel engine as the 3D Studio and is rendered in Blender at golden or blue hour, ready for the sales sheet.',
    proj_open: 'Open in 3D',
    proj1_tag: 'House · golden hour', proj1_t: 'Cantilevered house', proj1_alt: 'Two-storey steel house with a 4 m cantilever at golden hour',
    proj2_tag: 'Warehouse · golden hour', proj2_t: 'Trussed warehouse', proj2_alt: 'Steel warehouse with tubular trusses at golden hour',
    proj3_tag: 'Pavilion · blue hour', proj3_t: 'Showroom pavilion', proj3_alt: 'Steel and glass pavilion with a cantilevered eave at blue hour',
    proj4_tag: 'Building · blue hour', proj4_t: 'Frame building', proj4_alt: 'Five-storey steel building lit at blue hour',
    stat_designs: 'Designs', stat_types: 'Steel typologies', stat_clients: 'Clients', stat_time: 'Photo → proposal',
    plat_fig: 'Fig. 08 · Platform · applied AI', plat_h2: 'From drawing to building, in the browser.',
    plat_lead: 'The tools we use on every project, open to you. Nothing to install, on desktop or phone.',
    app1_alt: '3D Studio with a steel building rendered at golden hour', app1_t: '3D architecture editor',
    app1_p: 'Walls, slabs, steel columns and beams; cinematic tour, walk mode and sales render with real sun.', app1_go: 'Open the Studio →',
    app2_alt: 'A drawn plan turned into a 3D model with walls and openings', app2_tag: 'Image → 3D', app2_t: 'Plan, sketch or photo → model',
    app2_p: 'Upload a plan or a hand sketch and we raise the walls; a building photo becomes floors, bays and the steel structure.',
    app2_l1: 'Plan → walls', app2_l2: 'Photo → volumes', app2_l3: 'Parametric', app2_go: 'Try it with a plan →',
    app3_alt: '3D building explorer with floor selector and red diamonds', app3_tag: 'Floor explorer', app3_t: 'Walk the building floor by floor',
    app3_p: 'For developers and real estate: floor cutaway, plan view, diamonds on every space and a guided route to the elevator.',
    app3_l1: 'Floor cutaway', app3_l2: 'Guided route', app3_go: 'Open the explorer →',
    app4_alt: 'Presentation sheet with the before and after of a project', app4_tag: 'Presentations', app4_t: 'Sheets, reels and 3D viewer',
    app4_p: 'Before and after in a vertical reel, sales sheets, automatic camera animation and a single-file 3D viewer for your website.',
    app4_l1: '9:16 reel', app4_l2: 'Sales sheet', app4_l3: '.html viewer', app4_go: 'Create a presentation →',
    works_t: 'Works with your workflow', works_mcp: 'AI assistants',
    calc_fig: 'Fig. 09 · Pre-sizing', calc_h2: 'How much steel does your project need?',
    calc_lead: 'Pick the typology and the dimensions. We use the same engine as the 3D Studio: sections, tons and kg/m² instantly, and the structure ready to open in 3D.',
    calc_type: 'Typology', calc_t1: 'Building', calc_t1s: 'HEB + IPE frames', calc_t2: 'House', calc_t2s: 'With cantilever', calc_t3: 'Warehouse', calc_t3s: 'Tubular trusses', calc_t4: 'Pavilion', calc_t4s: 'Showroom, eave',
    calc_front: 'Front', calc_depth: 'Depth', calc_floors: 'Floors', calc_span: 'Clear span', calc_length: 'Length',
    calc_note: 'Indicative pre-sizing (span/20 for beams, columns by number of floors). It does not replace structural design or local code review.',
    calc_k1: 'Steel', calc_k2: 'Built area', calc_k4: 'Pieces', calc_cap: 'Diagram · red pencil',
    calc_open: 'Open in 3D with render →', calc_wa: 'Quote on WhatsApp', calc_chat: 'Attach to my request',
    steel_fig: 'Fig. 10 · Material · Steel in the name', steel_h2: 'The colors of steel.',
    steel_lead: 'When steel is reheated, an oxide layer so thin appears that it changes color with temperature: straw, bronze, purple and blue. That scale is the AceroStudio palette, always behind the red of the pencil.',
    steel_scale: 'Tempering scale', steel_temp: 'Tempering temperature', steel_beam: 'IPE 300 section · tinted at the chosen temperature',
    steel_h: 'depth h', steel_b: 'flange b', steel_tw: 'web', steel_kg: 'weight',
    refs_fig: 'References · steel architecture', refs_h2: 'Where the idea comes from.', refs_lead: 'Buildings where steel does not hide: the structure is the architecture.',
    ref1: 'Mies van der Rohe. A single open hall hung from four exterior steel frames.',
    ref2: 'Piano and Rogers. Structure and ducts outside, painted by color according to their function.',
    ref3_k: 'Material', ref3_t: 'Weathering steel', ref3: 'It protects itself with its own rust layer. Façades that change color over the years.',
    ref4: 'BIG. A stainless-steel façade that twists between city block and skyscraper.',
    b2b_fig: 'Fig. 11 · Corporate services', b2b_h2: 'For business.',
    b2b_lead: 'Visual infrastructure and spatial intelligence for builders, architecture firms, chains and developers who want to sell their projects before building them.',
    b2b1_t: 'Developers and real estate', b2b1_p: 'Floor-by-floor 3D explorer, sales renders and steel quantities for pre-sales and showrooms.',
    b2b2_t: 'Architecture studios', b2b2_p: 'From sketch to steel structure in minutes, with IFC for Revit and sheets ready to present to the client.',
    b2b3_t: 'Chains and franchises', b2b3_p: 'Consistent brand image and interiors across locations. Concept proposals at scale.',
    b2b4_t: 'Hospitality', b2b4_p: 'High-traffic areas, lobbies and dining rooms designed for capacity and experience.',
    b2b_cta_p: 'Several projects or locations? We build a plan for you.', b2b_cta: 'Talk to the studio',
    blog_fig: 'Fig. 12 · Technical content', blog_h2: 'Knowledge.', blog_lead: 'Steel architecture, interior design and AI-driven design, thought and written from Bogotá.',
    blog1_tag: 'Steel', blog1_t: 'Why build in steel: construction time, clear spans and recycling', blog1_p: 'Prefabricated structure, less load on the foundation and floor plans free of walls.',
    blog2_tag: 'AI + Design', blog2_t: 'How an AI redesign works: from photo to proposal', blog2_p: 'Real photo, style and a proposal that keeps walls, windows and columns.',
    blog3_tag: 'Render', blog3_t: 'Golden hour and blue hour: the light that sells a project', blog3_p: 'How to choose the hour, the two-point camera and the setting of a sales render.',
    blog4_tag: 'BIM workflow', blog4_t: 'From the browser to Revit: IFC 4, DXF and connectors', blog4_p: 'What the 3D Studio exports and how to take it to Revit, AutoCAD, SketchUp or Blender.',
    blog5_tag: 'Architecture', blog5_t: 'The 6 architecture principles that make a space feel right', blog5_p: 'Circulation, zoning, acoustics and daylight shape the experience before color does.',
    blog6_tag: 'Automation', blog6_t: 'n8n for small businesses: automate social media without a marketing team', blog6_p: 'Automation does not replace creativity, it removes repetitive work.',
    foot_wa: 'Quote on WhatsApp', foot_copy: 'Copy number', foot_links: 'Links', foot_l2: '3D Explorer', foot_l3: 'Presentations', foot_l4: 'Steel calculator',
    foot_meta: 'ACEROSTUDIO © 2026 · Bogotá · 2,600 masl',
    mbar_cta: '📷 Upload a photo of your space',
    wa_aria: 'Message us on WhatsApp'
  };

  var ES = {}; // se llena con el texto original del HTML la primera vez
  var ES_META = { title: document.title, desc: (document.getElementById('metaDescription') || {}).content };

  function detectLang() {
    try { var s = localStorage.getItem('acero_lang'); if (s === 'es' || s === 'en') return s; } catch (e) {}
    var nav = (navigator.language || 'es').toLowerCase();
    return nav.indexOf('es') === 0 ? 'es' : 'en';
  }

  function remember() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n'); if (!(k in ES)) ES[k] = el.innerHTML;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'), k = p[1]; if (!(k in ES)) ES[k] = el.getAttribute(p[0]) || '';
      });
    });
  }

  function applyLang(lang) {
    var dict = lang === 'en' ? EN : ES;
    var changed = document.documentElement.getAttribute('lang') !== lang;
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n'); if (dict[k] !== undefined) el.innerHTML = dict[k];
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); if (dict[p[1]] !== undefined) el.setAttribute(p[0], dict[p[1]]);
      });
    });
    document.title = lang === 'en' ? EN.meta_title : ES_META.title;
    var md = document.getElementById('metaDescription'); if (md) md.setAttribute('content', lang === 'en' ? EN.meta_description : ES_META.desc);
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem('acero_lang', lang); } catch (e) {}
    if (changed) window.dispatchEvent(new CustomEvent('acero:lang', { detail: lang }));
  }
  window.setAceroLang = applyLang;

  function initNav() {
    var btn = document.getElementById('hamburgerBtn'), nav = document.getElementById('siteNav');
    if (!btn || !nav) return;
    var close = function () { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !nav.classList.contains('open');
      nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target) && e.target !== btn) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // Botones con data-wa-trigger: <a> recibe el enlace; los demás abren WhatsApp al tocarlos.
  function wireWa() {
    document.querySelectorAll('[data-wa-trigger]').forEach(function (el) {
      var link = function () { return window.buildWaLink(el.getAttribute('data-wa-message')); };
      if (el.tagName === 'A') { el.setAttribute('href', link()); el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
      else el.addEventListener('click', function () { window.open(link(), '_blank', 'noopener'); });
    });
  }

  // Este script va antes que los demás al final del <body>: el DOM ya existe.
  remember();
  document.documentElement.setAttribute('lang', 'es');
  applyLang(detectLang());
  document.querySelectorAll('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); }); });
  initNav();
  wireWa();
})();
