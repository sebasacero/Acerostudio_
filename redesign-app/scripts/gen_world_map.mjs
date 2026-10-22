// Generates a dot-matrix world map as SVG run segments (rendered with a dotted stroke).
// Equirectangular, viewBox 0 0 360 150 covering lat 84..-66, lng -180..180.
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = require("world-atlas/land-110m.json");
const land = feature(topo, topo.objects.land);

const STEP = 2; // degrees
const LAT_TOP = 84;
const LAT_BOTTOM = -58;
const runs = [];
for (let lat = LAT_TOP - STEP / 2; lat > LAT_BOTTOM; lat -= STEP) {
  let start = null;
  for (let lng = -180 + STEP / 2; lng < 180 + STEP; lng += STEP) {
    const inside = lng < 180 && geoContains(land, [lng, lat]);
    if (inside && start === null) start = lng;
    if (!inside && start !== null) {
      runs.push({ lat, from: start, to: lng - STEP });
      start = null;
    }
  }
}

const x = (lng) => +(lng + 180).toFixed(1);
const y = (lat) => +(LAT_TOP - lat).toFixed(1);
const d = runs.map((r) => `M${x(r.from)} ${y(r.lat)}h${+(r.to - r.from).toFixed(1)}`).join("");

const out = `// Generado offline desde world-atlas (Natural Earth 110m, dominio público).
// Equirectangular: x = lng + 180, y = ${LAT_TOP} - lat. Cada segmento es una fila de
// tierra firme; se dibuja con trazo punteado (dasharray "0 ${STEP}") para el efecto dot-matrix.
export const WORLD_VIEWBOX = { width: 360, height: ${LAT_TOP - LAT_BOTTOM} } as const;
export const WORLD_DOT_STEP = ${STEP};
export const WORLD_LAT_TOP = ${LAT_TOP};
export const WORLD_DOTS_PATH =
  "${d}";
`;
process.stdout.write(out);
console.error(`runs: ${runs.length}, path chars: ${d.length}`);
