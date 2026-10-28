# AceroStudio → 3ds Max (2022 o superior, Python 3 con pymxs)
# Importa un modelo .acero-solids.json (exportado desde AceroStudio Studio o el servidor MCP):
# cajas y prismas editables con materiales físicos y una capa por nivel.
#
# Uso: Scripting › Run Script… y elige este archivo; abre el selector del modelo.
# Sin diálogo (por ejemplo desde 3dsmaxbatch):  set ACERO_SOLIDS=C:\ruta\modelo.acero-solids.json
import json
import math
import os

from pymxs import runtime as rt

def scene_scale():
    # Convierte metros a las unidades del sistema de la escena (cm, mm, pulgadas…).
    return rt.units.decodeValue("1m")


def material(key, m):
    name = "AS_" + key
    mat = rt.PhysicalMaterial(name=name)
    h = m["color"].lstrip("#")
    mat.base_color = rt.Color(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
    mat.roughness = float(m.get("roughness", 0.8))
    mat.metalness = float(m.get("metalness", 0))
    op = float(m.get("opacity", 1))
    if op < 1:
        mat.transparency = 1 - op
    return mat


def layer(name):
    lyr = rt.LayerManager.getLayerFromName(name)
    return lyr if lyr else rt.LayerManager.newLayerFromName(name)


def prism(points, z0, h, k):
    shp = rt.SplineShape()
    rt.addNewSpline(shp)
    for x, y in points:
        rt.addKnot(shp, 1, rt.Name("corner"), rt.Name("line"), rt.Point3(x * k, y * k, z0 * k))
    rt.close(shp, 1)
    rt.updateShape(shp)
    rt.addModifier(shp, rt.Extrude(amount=h * k, capStart=True, capEnd=True))
    return shp


def import_solids(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if data.get("format") != "acero-solids":
        raise ValueError("El archivo no es un .acero-solids.json de AceroStudio")
    k = scene_scale()
    mats = {key: material(key, m) for key, m in data["materials"].items()}
    layers = {lv["name"]: layer(lv["name"]) for lv in data["levels"]}
    for i, s in enumerate(data["solids"]):
        if s["shape"] == "box":
            L, T, H = s["size"]
            cx, cy, cz = s["center"]
            obj = rt.Box(length=T * k, width=L * k, height=H * k)  # pivote en el centro de la base
            rt.rotate(obj, rt.EulerAngles(0, 0, math.degrees(s["rotZ"])))
            obj.position = rt.Point3(cx * k, cy * k, (cz - H / 2) * k)
        else:
            obj = prism(s["points"], s["z"], s["height"], k)
        obj.name = "{}_{:04d}{}".format(s["kind"], i, " " + s["name"] if s.get("name") else "")
        obj.material = mats[s["material"]]
        rt.setUserProp(obj, "acero_element", s["element"])
        lyr = layers.get(s["level"])
        if lyr:
            lyr.addNode(obj)
    rt.redrawViews()


def main():
    path = os.environ.get("ACERO_SOLIDS") or rt.getOpenFileName(caption="Modelo de AceroStudio", types="AceroStudio (*.json)|*.json")
    if path:
        import_solids(path)
        print("AceroStudio: modelo importado")


main()
