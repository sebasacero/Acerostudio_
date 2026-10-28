# -*- coding: utf-8 -*-
# AceroStudio → Revit
# Lee un proyecto .acero.json de AceroStudio y crea elementos nativos de Revit:
# niveles, muros (con el tipo de espesor más cercano), losas, columnas estructurales,
# puertas y ventanas alojadas en sus muros, y volúmenes como DirectShape (modelo genérico).
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
    made = {"muros": 0, "vanos": 0, "losas": 0, "columnas": 0, "volúmenes": 0}

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
        elif t == "column" and columns:
            sym = columns[0]
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
