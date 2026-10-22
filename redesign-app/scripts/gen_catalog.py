import json, sys

pricing = json.load(open(sys.argv[1]))
steel = json.load(open(sys.argv[2]))

# Calibration: where each work sits inside the material's installed COP/kg band
# (0 = repetitive structure, 1 = small, visible, high-detail metalwork) and a fixed
# per-job mobilization (crane/hoist, crew travel, site setup), per research guidance.
GRADE = {
    "mezzanine": 0.25, "kiosko-modular": 0.35, "pergola": 0.35, "marquesina": 0.4,
    "fachada-celosia": 0.55, "escalera": 0.6, "porton": 0.6, "baranda": 0.5,
    "estanteria": 0.75, "mesa": 0.8, "barra-cafe": 0.85, "senaletica-corten": 0.9,
}
MOBILIZATION = {
    "barra-cafe": 1_000_000, "fachada-celosia": 2_500_000, "pergola": 2_000_000,
    "mezzanine": 3_000_000, "escalera": 1_800_000, "kiosko-modular": 3_000_000,
    "estanteria": 600_000, "mesa": 400_000, "baranda": 800_000, "porton": 1_200_000,
    "senaletica-corten": 1_200_000, "marquesina": 1_800_000,
}
FIRE = {"mezzanine", "escalera", "kiosko-modular"}
# Complement alternatives: (work, complement) -> extra fields.
ALTERNATIVES = {
    ("barra-cafe", "tablero-cuarzo"): {"replaces": "tablero-madera"},
    ("mesa", "tablero-cuarzo"): {"replaces": "tablero-madera"},
    ("pergola", "policarbonato"): {"group": "cubierta"},
    ("pergola", "vidrio-templado"): {"group": "cubierta"},
    ("marquesina", "policarbonato"): {"group": "cubierta"},
    ("marquesina", "vidrio-templado"): {"group": "cubierta"},
    ("marquesina", "lamina-perforada"): {"group": "cubierta"},
    ("baranda", "vidrio-templado"): {"group": "relleno"},
    ("baranda", "lamina-perforada"): {"group": "relleno"},
}
SHORT = {
    "acero-estructural": "acero estructural A36/A572",
    "acero-corten": "acero corten",
    "acero-galvanizado": "acero galvanizado",
    "acero-inox-304": "acero inoxidable 304",
}
FINISH_COMPAT = {
    "acero-estructural": ["anticorrosivo-esmalte", "epoxico-poliuretano", "electrostatica", "galvanizado-caliente"],
    "acero-corten": ["patina-corten"],
    "acero-galvanizado": ["electrostatica", "epoxico-poliuretano"],
    "acero-inox-304": ["inox-cepillado"],
}

bench = {b["work_id"]: b for b in pricing["work_benchmarks"]}
# The mezzanine benchmark is structure only; its note says to add 150–300k/m2 for the
# steel-deck slab, which our model always includes.
bench["mezzanine"] = {**bench["mezzanine"], "all_in_cop_low": bench["mezzanine"]["all_in_cop_low"] + 150_000,
                      "all_in_cop_high": bench["mezzanine"]["all_in_cop_high"] + 300_000}
steel_fin = {f["id"]: f for f in steel["finishes"]}

materials = [{
    "id": m["id"], "name": m["name"], "short": SHORT[m["id"]],
    "materialPerKg": {"low": m["material_cop_per_kg_low"], "high": m["material_cop_per_kg_high"]},
    "installedPerKg": {"low": m["fabricated_installed_cop_per_kg_low"], "high": m["fabricated_installed_cop_per_kg_high"]},
    "finishIds": FINISH_COMPAT[m["id"]], "notes": m["notes"], "confidence": m["confidence"],
} for m in pricing["materials"]]

finishes = []
for f in pricing["finishes"]:
    s = steel_fin.get(f["id"], {})
    finishes.append({
        "id": f["id"], "name": s.get("name", f["name"]), "unit": f["unit"],
        "price": {"low": f["cop_low"], "high": f["cop_high"]},
        "description": s.get("description", f["notes"]),
        "durabilityYears": {"low": s.get("durability_years_low", 0), "high": s.get("durability_years_high", 0)},
        "maintenance": s.get("maintenance", ""), "bestFor": s.get("best_for", ""),
        "confidence": f["confidence"],
    })

complements = [{
    "id": c["id"], "name": c["name"], "unit": c["unit"],
    "price": {"low": c["cop_low"], "high": c["cop_high"]}, "notes": c["notes"],
} for c in pricing["complements"]]

works = []
for w in steel["works"]:
    b = bench[w["id"]]
    works.append({
        "id": w["id"], "name": w["name"], "category": w["category"], "unit": w["unit"],
        "description": w["description"],
        "quantity": {"default": w["default_quantity"], "min": w["quantity_min"], "max": w["quantity_max"], "step": w["quantity_step"]},
        "structuralSystem": w["structural_system"], "profiles": w["typical_profiles"],
        "connectionIds": w["typical_connection_ids"], "materialIds": w["allowed_material_ids"],
        "defaultMaterialId": w["default_material_id"], "defaultFinishId": w["default_finish_id"],
        "kgPerUnit": {"low": w["kg_per_unit_low"], "high": w["kg_per_unit_high"]},
        "fabricationGrade": GRADE[w["id"]], "mobilization": MOBILIZATION[w["id"]],
        "finishAreaPerUnit": w["finish_area_m2_per_unit"],
        "complements": [{"id": c["id"], "qtyPerUnit": c["qty_per_unit"], "optional": c["optional"],
                         **ALTERNATIVES.get((w["id"], c["id"]), {})} for c in w["complements"]],
        "fireProtectionApplies": w["id"] in FIRE,
        "nsr10": w["nsr10_notes"], "maintenance": w["maintenance_notes"],
        "fabricationDays": {"low": w["fabrication_days_low"], "high": w["fabrication_days_high"]},
        "weightRationale": w["weight_rationale"],
        "benchmarkPerUnit": {"low": b["all_in_cop_low"], "high": b["all_in_cop_high"]},
    })

profiles = [{"family": p["family"], "designation": p["designation"], "kgPerM": p["kg_per_m"], "use": p["typical_use"]} for p in steel["profiles"]]
connections = [{"id": c["id"], "name": c["name"], "description": c["description"], "whenToUse": c["when_to_use"]} for c in steel["connections"]]

fees = pricing["fees"]
CAVEATS = [
    "Son estimaciones de orden de magnitud (−20% / +30%) construidas con fuentes públicas colombianas de 2025–2026 y criterio de taller; no reemplazan una cotización formal.",
    "El precio del acero es volátil: depende del dólar, del níquel (inoxidable), del zinc (galvanizado) y de medidas comerciales como el antidumping a la lámina galvanizada china (2025).",
    "La mano de obra subió con el salario mínimo de 2026 (≈23%), lo que encarece la fabricación frente a 2025.",
    "El precio por kilo sube cuando la pieza es pequeña, va a la vista y lleva mucho detalle: por eso una barra cuesta más por kilo que un entrepiso.",
    "Corten, inoxidable, galvanizado en caliente, pátina, electrostática y LED tienen pocas referencias públicas en Colombia: su precio tiene menor confianza.",
    "No incluye diseño o revisión estructural firmada (NSR-10), licencias de construcción, permisos de publicidad exterior o de espacio público, obra civil ni desmontes.",
    "El IVA se calcula al 19% sobre el total, como en el suministro e instalación de carpintería metálica; en contratos de obra con AIU puede liquidarse distinto.",
    "Fuera de Bogotá y la Sabana se suma el transporte por viaje.",
]
meta = {"asOf": "octubre 2026", "caveats": CAVEATS, "feesNotes": fees["notes"]}

def dump(name, typ, value):
    return f"export const {name}: {typ} = {json.dumps(value, ensure_ascii=False, indent=2)};\n"

print('import type { Complement, Connection, Finish, Material, Profile, Work } from "../types.ts";\n')
print("// Generado desde la investigación de precios (Bogotá, 2025–2026) y la calibración descrita en README.md.")
print(dump("MATERIALS", "Material[]", materials))
print(dump("FINISHES", "Finish[]", finishes))
print(dump("COMPLEMENTS", "Complement[]", complements))
print(dump("WORKS", "Work[]", works))
print(dump("PROFILES", "Profile[]", profiles))
print(dump("CONNECTIONS", "Connection[]", connections))
print(dump("CODE_NOTES", "string[]", steel["code_notes"]))
print(dump("BOGOTA_NOTES", "string[]", steel["bogota_notes"]))
print(dump("PRICING_META", "{ asOf: string; caveats: string[]; feesNotes: string }", meta))
