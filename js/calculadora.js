/**
 * js/calculadora.js
 * ─────────────────────────────────────────────────────────────
 * Calculadora espacial — pre-dimensionamiento de cafeterías.
 * A partir del área útil y el formato del negocio, estima un
 * programa arquitectónico: zonas (m²), puestos, mesas, metros
 * de barra y baños, más recomendaciones de diseño.
 *
 * Los ratios son de diseño comercial (orientativos). El resultado
 * se puede mandar por WhatsApp o pasar al chat de rediseño IA
 * (evento "acero:calc" + window.aceroCalcSummary).
 * ─────────────────────────────────────────────────────────────
 */
(function () {
  var form = document.getElementById('calcForm');
  if (!form) return;

  /* ============================================================
     RATIOS POR FORMATO
     bar:   fracción del área para barra + zona de trabajo
     circ:  fracción para circulación general (accesos, fila, pasillos)
     m2pp:  m² de salón por puesto (incluye pasillo entre mesas)
     perTable: puestos promedio por mesa
  ============================================================ */
  var FORMATS = {
    takeaway: { bar: 0.30, circ: 0.14, m2pp: 1.1, perTable: 3.0 },
    tables:   { bar: 0.15, circ: 0.15, m2pp: 1.5, perTable: 2.6 },
    cowork:   { bar: 0.12, circ: 0.15, m2pp: 2.2, perTable: 2.2 }
  };
  var BAR_DEPTH = 2.2;          // m: mostrador + contrabarra + pasillo de trabajo
  var WC_ACCESSIBLE = 4.5;      // m² del primer baño (accesible)
  var WC_EXTRA = 3.0;           // m² por baño adicional

  var T = {
    es: {
      unit_m: 'm',
      summary_title: 'Pre-dimensionamiento acero.studio',
      area: 'Área', format: 'Formato', kitchen_yes: 'con cocina', kitchen_no: 'sin cocina',
      fmt: { takeaway: 'Para llevar / barra', tables: 'Café con mesas', cowork: 'Café + coworking' },
      zones: { foh: 'Salón', bar: 'Barra / servicio', boh: 'Cocina / bodega', wc: 'Baños', circ: 'Circulación' },
      seats: 'Puestos', tables: 'Mesas', bar: 'Barra', wc: 'Baños',
      wa_intro: 'Hola, hice el pre-dimensionamiento de mi local en acero.studio y quiero cotizar el diseño:',
      n_aisle: 'Pasillo principal de mínimo 1,20 m libre; entre mesas, 0,90 m.',
      n_wc: 'Al menos un baño accesible con giro de 1,50 m para silla de ruedas.',
      n_small: 'Con menos de 30 m², un formato de barra o para llevar suele rendir más que llenar de mesas.',
      n_bar_long: 'Con más de 6 m de barra, separa estaciones (espresso / filtrados / entrega) para no cruzar flujos.',
      n_kitchen: 'Ubica la cocina contigua a la barra y separa su flujo del recorrido del cliente.',
      n_cowork: 'Prevé una toma eléctrica cada 2 puestos y una zona acústicamente separada para llamadas.',
      n_takeaway: 'Orienta la fila de pedido paralela a la fachada y separa el punto de recogida del de pedido.',
      n_large: 'Con más de 50 personas, verifica salidas y aforo con la NSR-10 (Título K) y bomberos.',
      n_light: 'Ubica los puestos de permanencia larga junto a la luz natural; la barra puede ir al fondo.'
    },
    en: {
      unit_m: 'm',
      summary_title: 'acero.studio space plan',
      area: 'Area', format: 'Format', kitchen_yes: 'with kitchen', kitchen_no: 'no kitchen',
      fmt: { takeaway: 'Takeaway / bar', tables: 'Café with tables', cowork: 'Café + coworking' },
      zones: { foh: 'Dining', bar: 'Bar / service', boh: 'Kitchen / storage', wc: 'Restrooms', circ: 'Circulation' },
      seats: 'Seats', tables: 'Tables', bar: 'Bar', wc: 'Restrooms',
      wa_intro: 'Hi, I sized my space on acero.studio and would like a design quote:',
      n_aisle: 'Main aisle at least 1.20 m clear; 0.90 m between tables.',
      n_wc: 'At least one accessible restroom with a 1.50 m wheelchair turning circle.',
      n_small: 'Under 30 m², a bar or takeaway format usually performs better than filling it with tables.',
      n_bar_long: 'With more than 6 m of bar, split stations (espresso / filter / pickup) so flows don\'t cross.',
      n_kitchen: 'Place the kitchen next to the bar and keep its flow apart from the customer path.',
      n_cowork: 'Plan one power outlet every 2 seats and an acoustically separated zone for calls.',
      n_takeaway: 'Run the order queue parallel to the façade and keep pickup apart from ordering.',
      n_large: 'Above 50 occupants, check exits and capacity against local building and fire codes.',
      n_light: 'Put long-stay seating by natural light; the bar can sit toward the back.'
    }
  };

  var ZONE_ORDER = ['foh', 'bar', 'boh', 'wc', 'circ'];

  var areaRange = document.getElementById('calcAreaRange');
  var areaNum = document.getElementById('calcAreaNum');
  var kitchen = document.getElementById('calcKitchen');
  var elSeats = document.getElementById('calcSeats');
  var elTables = document.getElementById('calcTables');
  var elBar = document.getElementById('calcBar');
  var elWc = document.getElementById('calcWc');
  var elPlan = document.getElementById('calcPlan');
  var elLegend = document.getElementById('calcLegend');
  var elNotes = document.getElementById('calcNotes');
  var waBtn = document.getElementById('calcWaBtn');
  var chatBtn = document.getElementById('calcChatBtn');

  var last = null;

  function lang() {
    return (document.documentElement.getAttribute('lang') || 'es').indexOf('en') === 0 ? 'en' : 'es';
  }

  function fmtNum(n, decimals) {
    return n.toLocaleString(lang() === 'en' ? 'en-US' : 'es-CO', {
      minimumFractionDigits: decimals || 0, maximumFractionDigits: decimals || 0
    });
  }

  function wcCountFor(seats) {
    if (seats <= 20) return 1;
    if (seats <= 60) return 2;
    return 2 + Math.ceil((seats - 60) / 40);
  }

  function wcArea(count) {
    return WC_ACCESSIBLE + Math.max(0, count - 1) * WC_EXTRA;
  }

  /** Cálculo puro: área (m²), formato, cocina → programa */
  function compute(area, format, hasKitchen) {
    var f = FORMATS[format] || FORMATS.tables;
    var bar = area * f.bar;
    var boh = Math.max(4, area * (hasKitchen ? 0.22 : 0.10));
    var circ = area * f.circ;

    // El número de baños depende de los puestos, y los puestos del área que
    // queda después de los baños: dos pasadas bastan para estabilizarlo.
    var wcCount = 1, foh = 0, seats = 0;
    for (var i = 0; i < 2; i++) {
      foh = Math.max(0, area - bar - boh - circ - wcArea(wcCount));
      seats = Math.floor(foh / f.m2pp);
      wcCount = wcCountFor(seats);
    }
    foh = Math.max(0, area - bar - boh - circ - wcArea(wcCount));
    seats = Math.floor(foh / f.m2pp);

    var barLen = Math.min(14, Math.max(2.4, bar / BAR_DEPTH));
    var tables = seats > 0 ? Math.max(1, Math.round(seats / f.perTable)) : 0;

    return {
      area: area, format: format, kitchen: hasKitchen,
      zones: { foh: foh, bar: bar, boh: boh, wc: wcArea(wcCount), circ: circ },
      seats: seats, tables: tables, barLen: barLen, wcCount: wcCount
    };
  }

  function notesFor(r) {
    var t = T[lang()];
    var n = [t.n_aisle, t.n_wc];
    if (r.area < 30 && r.format !== 'takeaway') n.push(t.n_small);
    if (r.barLen > 6) n.push(t.n_bar_long);
    if (r.kitchen) n.push(t.n_kitchen);
    if (r.format === 'cowork') n.push(t.n_cowork);
    if (r.format === 'takeaway') n.push(t.n_takeaway);
    if (r.seats > 50) n.push(t.n_large);
    if (r.format !== 'takeaway') n.push(t.n_light);
    return n;
  }

  function render(r) {
    var t = T[lang()];
    elSeats.textContent = fmtNum(r.seats);
    elTables.textContent = fmtNum(r.tables);
    elBar.textContent = fmtNum(r.barLen, 1) + ' ' + t.unit_m;
    elWc.textContent = fmtNum(r.wcCount);

    elPlan.innerHTML = '';
    elLegend.innerHTML = '';
    ZONE_ORDER.forEach(function (key) {
      var m2 = r.zones[key];
      if (m2 <= 0) return;
      var pct = (m2 / r.area) * 100;

      var cell = document.createElement('div');
      cell.className = 'calc-zone z-' + key;
      cell.style.flexGrow = String(m2);
      if (pct >= 9) cell.innerHTML = '<span>' + t.zones[key] + '</span><b>' + fmtNum(m2) + ' m²</b>';
      elPlan.appendChild(cell);

      var li = document.createElement('li');
      li.innerHTML = '<i class="z-' + key + '"></i>' + t.zones[key] +
        ' <b>' + fmtNum(m2, 1) + ' m²</b> <em>' + fmtNum(pct) + '%</em>';
      elLegend.appendChild(li);
    });

    elNotes.innerHTML = '';
    notesFor(r).forEach(function (txt) {
      var li = document.createElement('li');
      li.textContent = txt;
      elNotes.appendChild(li);
    });
  }

  function summaryText(r) {
    var t = T[lang()];
    return [
      t.summary_title,
      '· ' + t.area + ': ' + fmtNum(r.area) + ' m² · ' + t.fmt[r.format] + ' (' + (r.kitchen ? t.kitchen_yes : t.kitchen_no) + ')',
      '· ' + t.seats + ': ' + r.seats + ' · ' + t.tables + ': ' + r.tables +
        ' · ' + t.bar + ': ' + fmtNum(r.barLen, 1) + ' m · ' + t.wc + ': ' + r.wcCount
    ].join('\n');
  }

  function readInputs() {
    var area = parseFloat(areaNum.value);
    if (!isFinite(area) || area <= 0) area = parseFloat(areaRange.value) || 80;
    area = Math.max(15, Math.min(2000, area));
    var checked = form.querySelector('input[name="calcFormat"]:checked');
    return compute(area, checked ? checked.value : 'tables', !!kitchen.checked);
  }

  function update() {
    last = readInputs();
    render(last);
    window.aceroCalcSummary = { data: last, text: summaryText(last) };
  }

  areaRange.addEventListener('input', function () {
    areaNum.value = areaRange.value;
    update();
  });
  areaNum.addEventListener('input', function () {
    var v = parseFloat(areaNum.value);
    if (isFinite(v)) areaRange.value = String(Math.min(400, Math.max(15, v)));
    update();
  });
  areaNum.addEventListener('blur', function () {
    areaNum.value = String(last ? last.area : 80);
  });
  form.addEventListener('change', update);

  waBtn.addEventListener('click', function () {
    if (!last) return;
    var msg = T[lang()].wa_intro + '\n\n' + summaryText(last);
    var link = typeof window.buildWaLink === 'function'
      ? window.buildWaLink(msg)
      : 'https://wa.me/573152125327?text=' + encodeURIComponent(msg);
    window.open(link, '_blank', 'noopener');
    if (typeof window.gtag === 'function') window.gtag('event', 'calc_whatsapp', { area: last.area, format: last.format });
  });

  chatBtn.addEventListener('click', function () {
    if (!last) return;
    window.dispatchEvent(new CustomEvent('acero:calc', { detail: window.aceroCalcSummary }));
    var target = document.getElementById('rediseno');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof window.gtag === 'function') window.gtag('event', 'calc_to_chat', { area: last.area, format: last.format });
  });

  // Re-render cuando cambia el idioma (el i18n cambia <html lang>)
  new MutationObserver(function () { if (last) update(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  update();
})();
