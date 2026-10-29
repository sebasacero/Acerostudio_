# -*- coding: utf-8 -*-
# AceroStudio → Revit
# Lee un proyecto .acero.json de AceroStudio y crea elementos nativos de Revit:
# niveles, muros (con el tipo de espesor más cercano), losas, columnas estructurales (con la familia
# cuyo nombre coincide con el perfil HEB/IPE si está cargada), vigas, diagonales y cerchas de acero como
# DirectShape de armazón estructural con su sección real, puertas y ventanas alojadas en sus muros,
# y volúmenes como DirectShape (modelo genérico).
# Para la estructura con familias paramétricas de Revit también puedes abrir el .ifc que exporta el Studio.
#
# Uso con pyRevit: guárdalo como script.py de un botón en tu extensión, o ejecútalo desde
# RevitPythonShell. Pide el archivo y hace todo en una sola transacción (Ctrl+Z la deshace).
# Compatible con IronPython 2.7 y CPython 3.
import json
import math

import clr
clr.AddReference("RevitAPI")
from Autodesk.Revit.DB import (  # noqa: E402
    BuiltInCategory, BuiltInParameter, CurveLoop, DirectShape, ElementId, FamilySymbol,
    FilteredElementCollector, Floor, FloorType, GeometryCreationUtilities, Level, Line,
    Transaction, Wall, WallKind, WallType, XYZ,
)
from Autodesk.Revit.DB.Structure import StructuralType  # noqa: E402

FT = 1 / 0.3048  # metros → pies

# Perfiles del catálogo de AceroStudio (m): forma, alto h, ancho b, alma tw, ala tf / espesor t.
_I = lambda h, b, tw, tf: ("I", h / 1000.0, b / 1000.0, tw / 1000.0, tf / 1000.0)
PROFILES = {
    "IPE200": _I(200, 100, 5.6, 8.5), "IPE240": _I(240, 120, 6.2, 9.8), "IPE270": _I(270, 135, 6.6, 10.2),
    "IPE300": _I(300, 150, 7.1, 10.7), "IPE360": _I(360, 170, 8, 12.7), "IPE400": _I(400, 180, 8.6, 13.5),
    "IPE450": _I(450, 190, 9.4, 14.6), "IPE500": _I(500, 200, 10.2, 16), "IPE600": _I(600, 220, 12, 19),
    "HEB160": _I(160, 160, 8, 13), "HEB200": _I(200, 200, 9, 15), "HEB240": _I(240, 240, 10, 17),
    "HEB280": _I(280, 280, 10.5, 18), "HEB300": _I(300, 300, 11, 19), "HEB360": _I(360, 300, 12.5, 22.5),
    "HEB400": _I(400, 300, 13.5, 24), "HEB500": _I(500, 300, 14.5, 28),
    "SHS100": ("SHS", 0.1, 0.1, 0.006, 0), "SHS120": ("SHS", 0.12, 0.12, 0.006, 0), "SHS150": ("SHS", 0.15, 0.15, 0.008, 0),
    "SHS200": ("SHS", 0.2, 0.2, 0.01, 0), "SHS250": ("SHS", 0.25, 0.25, 0.01, 0), "SHS300": ("SHS", 0.3, 0.3, 0.012, 0),
    "CHS114": ("CHS", 0.1143, 0.1143, 0.006, 0), "CHS168": ("CHS", 0.1683, 0.1683, 0.008, 0), "CHS219": ("CHS", 0.2191, 0.2191, 0.01, 0),
    "CHS273": ("CHS", 0.273, 0.273, 0.01, 0), "CHS323": ("CHS", 0.3239, 0.3239, 0.012, 0),
}


def section(el):
    # Contorno (u = ancho, v = alto) de la sección en metros.
    p = PROFILES.get(el.get("profile"))
    if not p:
        b, h = el.get("w", 0.2) / 2.0, el.get("h", 0.01) / 2.0
        return [(-b, -h), (b, -h), (b, h), (-b, h)]
    kind, h, b, tw, tf = p
    if kind == "CHS":
        return [(math.cos(a) * h / 2, math.sin(a) * h / 2) for a in [i * math.pi * 2 / 20 for i in range(20)]]
    if kind == "SHS":
        return [(-b / 2, -h / 2), (b / 2, -h / 2), (b / 2, h / 2), (-b / 2, h / 2)]
    b2, h2, w2 = b / 2, h / 2, tw / 2
    return [(-b2, -h2), (b2, -h2), (b2, -h2 + tf), (w2, -h2 + tf), (w2, h2 - tf), (b2, h2 - tf), (b2, h2),
            (-b2, h2), (-b2, h2 - tf), (-w2, h2 - tf), (-w2, -h2 + tf), (-b2, -h2 + tf)]


def member_frame(el):
    # Igual que memberFrame de steel.js: t = eje, v = alto del perfil, u = ancho (coordenadas del Studio).
    p0, p1 = el["p0"], el["p1"]
    d = [p1[i] - p0[i] for i in range(3)]
    L = math.sqrt(sum(c * c for c in d)) or 1e-6
    t = [c / L for c in d]
    ref = [0, 0, 1] if abs(t[1]) > 0.98 else [0, 1, 0]
    k = sum(ref[i] * t[i] for i in range(3))
    v = [ref[i] - k * t[i] for i in range(3)]
    n = math.sqrt(sum(c * c for c in v)) or 1
    v = [c / n for c in v]
    u = [v[1] * t[2] - v[2] * t[1], v[2] * t[0] - v[0] * t[2], v[0] * t[1] - v[1] * t[0]]
    r = el.get("roll") or 0
    if r:
        c, s = math.cos(r), math.sin(r)
        u, v = [u[i] * c + v[i] * s for i in range(3)], [-u[i] * s + v[i] * c for i in range(3)]
    return t, u, v, L


def P(x, z, y=0.0):
    # Planta de AceroStudio: X este, Z sur. Revit: X este, Y norte.
    return XYZ(x * FT, -z * FT, y * FT)


def pick_file():
    try:
        from pyrevit import forms
        return forms.pick_file(file_ext="json", title="Proyecto de AceroStudio (.acero.json)")
    except ImportError:
        clr.AddReference("System.Windows.Forms")
        from System.Windows.Forms import DialogResult, OpenFileDialog
        dlg = OpenFileDialog()
        dlg.Filter = "AceroStudio (*.json)|*.json"
        return dlg.FileName if dlg.ShowDialog() == DialogResult.OK else None


def symbols(doc, cat):
    return [s for s in FilteredElementCollector(doc).OfCategory(cat).OfClass(FamilySymbol)]


def width_of(sym):
    for name in ("Width", "Ancho", "Anchura"):
        p = sym.LookupParameter(name)
        if p and p.HasValue:
            return p.AsDouble()
    p = sym.get_Parameter(BuiltInParameter.FAMILY_WIDTH_PARAM)
    return p.AsDouble() if p and p.HasValue else None


def closest_symbol(syms, width_m):
    if not syms:
        return None
    target = width_m * FT
    return min(syms, key=lambda s: abs((width_of(s) or target) - target))


def wall_type(doc, thickness_m):
    types = [t for t in FilteredElementCollector(doc).OfClass(WallType) if t.Kind == WallKind.Basic]
    return min(types, key=lambda t: abs(t.Width - thickness_m * FT))


def get_level(doc, lv, cache):
    elev = lv["elev"] * FT
    for l in FilteredElementCollector(doc).OfClass(Level):
        if abs(l.Elevation - elev) < 0.01:
            cache[lv["id"]] = l
            return l
    l = Level.Create(doc, elev)
    try:
        l.Name = lv["name"]
    except Exception:  # nombre repetido en el proyecto
        pass
    cache[lv["id"]] = l
    return l


def build(doc, data):
    levels = {}
    for lv in sorted(data["levels"], key=lambda l: l["elev"]):
        get_level(doc, lv, levels)
    lv_by_id = dict((lv["id"], lv) for lv in data["levels"])
    doors, windows = symbols(doc, BuiltInCategory.OST_Doors), symbols(doc, BuiltInCategory.OST_Windows)
    columns = symbols(doc, BuiltInCategory.OST_StructuralColumns)
    floor_type = FilteredElementCollector(doc).OfClass(FloorType).FirstElement()
    made = {"muros": 0, "vanos": 0, "losas": 0, "columnas": 0, "barras de acero": 0, "volúmenes": 0}

    for el in data["elements"]:
        level = levels.get(el.get("level")) or list(levels.values())[0]
        lv = lv_by_id.get(el.get("level"), data["levels"][0])
        t = el["type"]
        if t == "wall":
            a, b = el["a"], el["b"]
            line = Line.CreateBound(P(a[0], a[1], lv["elev"]), P(b[0], b[1], lv["elev"]))
            w = Wall.Create(doc, line, wall_type(doc, el["thickness"]).Id, level.Id, el["height"] * FT, 0.0, False, False)
            made["muros"] += 1
            L = math.hypot(b[0] - a[0], b[1] - a[1]) or 1
            for o in el.get("openings", []):
                sym = closest_symbol(doors if o["kind"] == "door" else windows, o["width"])
                if not sym:
                    continue
                if not sym.IsActive:
                    sym.Activate()
                    doc.Regenerate()
                k = o["t"] / L
                pt = P(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, lv["elev"] + o.get("sill", 0))
                inst = doc.Create.NewFamilyInstance(pt, sym, w, level, StructuralType.NonStructural)
                sill = inst.get_Parameter(BuiltInParameter.INSTANCE_SILL_HEIGHT_PARAM)
                if sill and not sill.IsReadOnly:
                    sill.Set(o.get("sill", 0) * FT)
                made["vanos"] += 1
        elif t == "slab" and floor_type:
            pts = [P(x, z, lv["elev"]) for x, z in el["points"]]
            loop = CurveLoop()
            for i in range(len(pts)):
                loop.Append(Line.CreateBound(pts[i], pts[(i + 1) % len(pts)]))
            try:
                Floor.Create(doc, [loop], floor_type.Id, level.Id)  # Revit 2022+
            except AttributeError:
                from Autodesk.Revit.DB import CurveArray
                arr = CurveArray()
                for c in loop:
                    arr.Append(c)
                doc.Create.NewFloor(arr, False)
            made["losas"] += 1
        elif t == "member":
            # Viga, diagonal, cordón o correa: la sección real extruida por su eje, como armazón estructural.
            tv, u, v, L = member_frame(el)
            p0 = el["p0"]
            V = lambda x, y, z: XYZ(x * FT, -z * FT, (y + lv["elev"]) * FT)
            pts = [V(p0[0] + u[0] * a + v[0] * b, p0[1] + u[1] * a + v[1] * b, p0[2] + u[2] * a + v[2] * b) for a, b in section(el)]
            loop = CurveLoop()
            for i in range(len(pts)):
                loop.Append(Line.CreateBound(pts[i], pts[(i + 1) % len(pts)]))
            solid = GeometryCreationUtilities.CreateExtrusionGeometry([loop], XYZ(tv[0], -tv[2], tv[1]), L * FT)
            cat = BuiltInCategory.OST_StructuralFraming if el.get("role") not in ("parteluz", "lamina", "baranda") else BuiltInCategory.OST_GenericModel
            ds = DirectShape.CreateElement(doc, ElementId(cat))
            ds.SetShape([solid])
            ds.Name = "{} {}".format(el.get("role", "barra"), el.get("profile", ""))
            made["barras de acero"] += 1
        elif t == "column" and columns:
            named = [c for c in columns if el.get("profile") and el["profile"].replace("HEB", "HE") in (c.Family.Name + c.Name).replace(" ", "").upper()]
            sym = (named or columns)[0]
            if not sym.IsActive:
                sym.Activate()
                doc.Regenerate()
            inst = doc.Create.NewFamilyInstance(P(el["x"], el["z"], lv["elev"]), sym, level, StructuralType.Column)
            top = inst.get_Parameter(BuiltInParameter.FAMILY_TOP_LEVEL_OFFSET_PARAM)
            base_top = inst.get_Parameter(BuiltInParameter.FAMILY_TOP_LEVEL_PARAM)
            if top and base_top and base_top.AsElementId() == level.Id:
                top.Set(el["height"] * FT)
            made["columnas"] += 1
        elif t == "box":
            c, s = math.cos(el.get("rotY", 0)), math.sin(el.get("rotY", 0))
            corners = [(-el["w"] / 2, -el["d"] / 2), (el["w"] / 2, -el["d"] / 2), (el["w"] / 2, el["d"] / 2), (-el["w"] / 2, el["d"] / 2)]
            z0 = lv["elev"] + el.get("y", 0)
            pts = [P(el["x"] + x * c - z * s, el["z"] + x * s + z * c, z0) for x, z in corners]
            loop = CurveLoop()
            for i in range(4):
                loop.Append(Line.CreateBound(pts[i], pts[(i + 1) % 4]))
            solid = GeometryCreationUtilities.CreateExtrusionGeometry([loop], XYZ.BasisZ, el["h"] * FT)
            ds = DirectShape.CreateElement(doc, ElementId(BuiltInCategory.OST_GenericModel))
            ds.SetShape([solid])
            ds.Name = el.get("name") or "Volumen AceroStudio"
            made["volúmenes"] += 1
    return made


def run(doc, path):
    with open(path) as f:
        data = json.load(f)
    if "elements" not in data or "levels" not in data:
        raise ValueError("El archivo no es un proyecto .acero.json de AceroStudio")
    tx = Transaction(doc, "Importar AceroStudio")
    tx.Start()
    try:
        made = build(doc, data)
        tx.Commit()
    except Exception:
        tx.RollBack()
        raise
    return made


if __name__ == "__main__":
    doc = __revit__.ActiveUIDocument.Document  # noqa: F821 (lo define pyRevit / RevitPythonShell)
    path = pick_file()
    if path:
        result = run(doc, path)
        print("AceroStudio: " + ", ".join("%s %s" % (v, k) for k, v in result.items()))
