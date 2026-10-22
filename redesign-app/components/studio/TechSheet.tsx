import { BOGOTA_NOTES, CONNECTION_BY_ID, PROFILES } from "@/lib/catalog";
import type { Finish, Material, Tradition, Work } from "@/lib/types";

const PROFILE_BY_DESIGNATION = Object.fromEntries(PROFILES.map((p) => [p.designation, p]));
const EXTERIOR = new Set(["fachada-celosia", "pergola", "porton", "senaletica-corten", "marquesina", "kiosko-modular"]);

function climateNotes(work: Work, material: Material, finish: Finish): string[] {
  const notes: string[] = [];
  const has = (re: RegExp) => BOGOTA_NOTES.filter((n) => re.test(n));
  if (material.id === "acero-corten") notes.push(...has(/corten/i).slice(0, 2));
  if (EXTERIOR.has(work.id)) {
    if (finish.durabilityYears.high <= 10) {
      notes.push(
        `${finish.name} dura ${finish.durabilityYears.low}–${finish.durabilityYears.high} años; en exterior bogotano (lluvia frecuente y UV de altura) conviene galvanizado en caliente o un sistema epóxico + poliuretano.`,
      );
    }
    notes.push(...has(/UV|lluvia|precipita/i).slice(0, 1));
  }
  if (work.id === "barra-cafe" && material.id !== "acero-inox-304") {
    notes.push(...has(/vapor|espresso|humedad/i).slice(0, 1));
  }
  return Array.from(new Set(notes)).slice(0, 3);
}

export default function TechSheet({
  work,
  material,
  finish,
  tradition,
}: {
  work: Work;
  material: Material;
  finish: Finish;
  tradition: Tradition;
}) {
  const climate = climateNotes(work, material, finish);
  return (
    <section aria-labelledby="ficha" className="print-sheet border border-border bg-panel p-5">
      <p id="ficha" className="fig mb-4">Ficha técnica</p>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted">Sistema</h3>
          <p className="text-sm text-muted">{work.structuralSystem}</p>

          <h3 className="mb-2 mt-5 font-mono text-[0.65rem] uppercase tracking-widest text-muted">Perfiles</h3>
          <ul className="text-sm">
            {work.profiles.map((d) => (
              <li key={d} className="flex justify-between gap-3 border-t border-border py-1.5">
                <span>{d}</span>
                <span className="font-mono text-xs text-muted">
                  {PROFILE_BY_DESIGNATION[d] ? `${PROFILE_BY_DESIGNATION[d].kgPerM.toLocaleString("es-CO")} kg/m` : ""}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mb-2 mt-5 font-mono text-[0.65rem] uppercase tracking-widest text-muted">Uniones</h3>
          <ul className="grid gap-1 text-sm text-muted">
            {work.connectionIds.map((id) => CONNECTION_BY_ID[id] && <li key={id}>· {CONNECTION_BY_ID[id].name}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted">Material y acabado</h3>
          <p className="text-sm">{material.name}</p>
          <p className="mt-2 text-sm">
            {finish.name} · <span className="font-mono text-xs text-accent">{finish.durabilityYears.low}–{finish.durabilityYears.high} años</span>
          </p>
          <p className="mt-1 text-sm text-muted">{finish.maintenance}</p>

          <h3 className="mb-2 mt-5 font-mono text-[0.65rem] uppercase tracking-widest text-muted">Lenguaje · {tradition.name}</h3>
          <ul className="grid gap-1 text-sm text-muted">
            {tradition.signatureDetails.slice(0, 3).map((d) => (
              <li key={d}>· {d}</li>
            ))}
          </ul>

          {climate.length > 0 && (
            <>
              <h3 className="mb-2 mt-5 font-mono text-[0.65rem] uppercase tracking-widest text-rust">Clima de Bogotá</h3>
              <ul className="grid gap-2 text-sm text-muted">
                {climate.map((n) => (
                  <li key={n} className="border-l border-rust/60 pl-3">{n}</li>
                ))}
              </ul>
            </>
          )}

          <h3 className="mb-2 mt-5 font-mono text-[0.65rem] uppercase tracking-widest text-muted">Norma</h3>
          <p className="text-sm text-muted">{work.nsr10}</p>
        </div>
      </div>
    </section>
  );
}
