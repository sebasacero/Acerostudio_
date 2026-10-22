import json, sys
w = json.load(open(sys.argv[1]))
out = []
for t in w['traditions']:
    out.append({
        "id": t["id"], "name": t["name"], "region": t["region"],
        "countries": t["countries"], "cities": t["cities"], "era": t["era"],
        "philosophy": t["philosophy"], "steelLanguage": t["steel_language"],
        "signatureDetails": t["signature_details"], "materials": t["materials"],
        "preferredMaterialIds": t["preferred_material_ids"], "preferredFinishIds": t["preferred_finish_ids"],
        "palette": t["palette"], "architects": t["reference_architects"], "works": t["reference_works"],
        "promptKeywords": t["prompt_keywords_en"], "complexityFactor": round(t["complexity_factor"], 2),
        "complexityRationale": t["complexity_rationale"], "lat": round(t["lat"], 2), "lng": round(t["lng"], 2),
    })
body = json.dumps(out, ensure_ascii=False, indent=2)
print('import type { Tradition } from "../types.ts";\n')
print('// Investigado y verificado (arquitectos, obras, ciudades y años) en oct-2026.')
print('export const TRADITIONS: Tradition[] = ' + body + ';')
