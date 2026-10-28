// Prueba de humo del servidor MCP: lo arranca, llama herramientas y revisa los archivos.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { mkdtempSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PNG } from 'pngjs';

const dir = mkdtempSync(join(tmpdir(), 'acero-mcp-'));
const client = new Client({ name: 'prueba', version: '1.0.0' });
await client.connect(new StdioClientTransport({ command: 'node', args: [new URL('./server.mjs', import.meta.url).pathname], cwd: dir }));
const call = async (name, args = {}) => {
  const r = await client.callTool({ name, arguments: args });
  if (r.isError) throw new Error(`${name}: ${r.content[0].text}`);
  return r.content[0].text;
};
const { tools } = await client.listTools();
console.log('herramientas:', tools.map((t) => t.name).join(', '));

await call('proyecto_nuevo', { nombre: 'Casa prueba' });
const m = await call('agregar_muro', { desde: [0, 0], hasta: [6, 0], material: 'ladrillo' });
const id = m.match(/Muro (\w+)/)[1];
await call('agregar_vano', { muro: id, tipo: 'ventana', distancia: 3, ancho: 1.5 });
await call('agregar_losa', { puntos: [[0, 0], [6, 0], [6, 4], [0, 4]] });
await call('agregar_columna', { x: 3, z: 2 });
console.log((await call('proyecto_resumen')).split('\n').slice(0, 3).join(' '));

// plano sintético: rectángulo de 8 × 5 m con muros de 20 cm (100 px/m) y una puerta
const W = 1000, H = 700, png = new PNG({ width: W, height: H });
png.data.fill(255);
const rect = (x0, y0, x1, y1, v = 20) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = (y * W + x) * 4; png.data[i] = png.data[i + 1] = png.data[i + 2] = v; } };
rect(100, 100, 900, 120); rect(100, 580, 900, 600); rect(100, 100, 120, 600); rect(880, 100, 900, 600); rect(300, 580, 390, 600, 255);
writeFileSync(join(dir, 'plano.png'), PNG.sync.write(png));
console.log(await call('plano_a_modelo', { imagen: join(dir, 'plano.png'), pisos: 2 }).then((t) => t.split('\n')[0]));

console.log((await call('generar_edificio', { pisos: 5, frente: 7 })).split('\n')[0]);
for (const f of ['json', 'solidos', 'dxf', 'dxf3d', 'svg']) console.log(await call('exportar', { formato: f }));
for (const p of ['blender', 'revit', 'sketchup', '3dsmax', 'autocad']) {
  const t = await call('enviar_a', { programa: p });
  const files = JSON.parse(t.slice(t.indexOf('{'))).archivos;
  console.log(p, files.every(existsSync) ? 'ok' : 'FALTAN', files.length, 'archivos');
}
console.log((await call('prompt_video', { toma: 'orbita' })).slice(0, 90) + '…');
await client.close();
console.log('listo');
