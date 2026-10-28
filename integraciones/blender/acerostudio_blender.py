# AceroStudio → Blender
# Importa un modelo .acero-solids.json (exportado desde AceroStudio Studio o el servidor MCP):
# una colección por nivel, materiales PBR con la paleta de revenido del acero, sol y cámara.
#
# Tres formas de usarlo:
#   1. Complemento: Editar › Preferencias › Complementos › Instalar… y elegir este archivo.
#      Queda en Archivo › Importar › AceroStudio (.acero-solids.json).
#   2. Script: pestaña Scripting › Abrir › Ejecutar (abre el selector de archivos).
#   3. Sin ventana (lo usa el servidor MCP para renders por lote):
#      blender -b -P acerostudio_blender.py -- modelo.acero-solids.json salida.blend [render.png]

bl_info = {
    "name": "AceroStudio (.acero-solids.json)",
    "author": "AceroStudio",
    "version": (1, 0, 0),
    "blender": (3, 6, 0),
    "location": "Archivo › Importar › AceroStudio",
    "description": "Importa modelos de AceroStudio Studio con materiales y niveles",
    "category": "Import-Export",
}

import json
import math
import os
import sys

import bpy
import bmesh
from bpy.props import StringProperty
from bpy_extras.io_utils import ImportHelper
from mathutils import Vector


def hex_rgba(h, alpha=1.0):
    h = h.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, alpha)


def make_material(key, m):
    name = f"AS_{key}"
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    alpha = float(m.get("opacity", 1))
    bsdf.inputs["Base Color"].default_value = hex_rgba(m["color"])
    bsdf.inputs["Roughness"].default_value = float(m.get("roughness", 0.8))
    bsdf.inputs["Metallic"].default_value = float(m.get("metalness", 0))
    if alpha < 1:
        bsdf.inputs["Alpha"].default_value = alpha
        if "Transmission Weight" in bsdf.inputs:
            bsdf.inputs["Transmission Weight"].default_value = 0.9
        elif "Transmission" in bsdf.inputs:
            bsdf.inputs["Transmission"].default_value = 0.9
        if hasattr(mat, "blend_method"):
            mat.blend_method = "BLEND"
    mat.diffuse_color = hex_rgba(m["color"], alpha)
    return mat


def solid_mesh(s):
    bm = bmesh.new()
    if s["shape"] == "box":
        L, T, H = s["size"]
        bmesh.ops.create_cube(bm, size=1.0)
        bmesh.ops.scale(bm, vec=Vector((L, T, H)), verts=bm.verts)
    else:
        z0, h = s["z"], s["height"]
        verts = [bm.verts.new((x, y, 0.0)) for x, y in s["points"]]
        face = bm.faces.new(verts)
        bmesh.ops.recalc_face_normals(bm, faces=[face])
        if face.normal.z < 0:
            face.normal_flip()
        ext = bmesh.ops.extrude_face_region(bm, geom=[face])
        moved = [g for g in ext["geom"] if isinstance(g, bmesh.types.BMVert)]
        bmesh.ops.translate(bm, vec=Vector((0, 0, h)), verts=moved)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bmesh.ops.translate(bm, vec=Vector((0, 0, z0)), verts=bm.verts)
    me = bpy.data.meshes.new(s.get("name") or s["kind"])
    bm.to_mesh(me)
    bm.free()
    return me


def import_solids(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if data.get("format") != "acero-solids":
        raise ValueError("El archivo no es un .acero-solids.json de AceroStudio")

    root = bpy.data.collections.new(data.get("project") or "AceroStudio")
    bpy.context.scene.collection.children.link(root)
    levels = {}
    for lv in data["levels"]:
        col = bpy.data.collections.new(lv["name"])
        root.children.link(col)
        levels[lv["name"]] = col
    mats = {k: make_material(k, m) for k, m in data["materials"].items()}

    lo = Vector((math.inf,) * 3)
    hi = Vector((-math.inf,) * 3)
    for i, s in enumerate(data["solids"]):
        me = solid_mesh(s)
        me.materials.append(mats[s["material"]])
        ob = bpy.data.objects.new(f"{s['kind']}_{i:04d}" + (f" {s['name']}" if s.get("name") else ""), me)
        if s["shape"] == "box":
            ob.location = Vector(s["center"])
            ob.rotation_euler = (0, 0, s["rotZ"])
        ob["acero_element"] = s["element"]
        ob["acero_type"] = s["type"]
        levels.get(s["level"], root).objects.link(ob)
        for c in ob.bound_box:
            p = ob.matrix_basis @ Vector(c)
            lo = Vector(map(min, lo, p))
            hi = Vector(map(max, hi, p))

    if not data["solids"]:
        return root
    center, size = (lo + hi) / 2, hi - lo
    r = max(size.x, size.y, size.z, 4)

    sun_data = bpy.data.lights.new("Sol Bogotá", "SUN")
    sun_data.energy = 4
    sun = bpy.data.objects.new("Sol Bogotá", sun_data)
    sun.rotation_euler = (math.radians(50), 0, math.radians(35))
    root.objects.link(sun)

    cam_data = bpy.data.cameras.new("Cámara AceroStudio")
    cam_data.lens = 28
    cam = bpy.data.objects.new("Cámara AceroStudio", cam_data)
    cam.location = center + Vector((r * 1.1, -r * 1.4, r * 0.8))
    direction = center - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    root.objects.link(cam)
    bpy.context.scene.camera = cam
    return root


class IMPORT_OT_acerostudio(bpy.types.Operator, ImportHelper):
    bl_idname = "import_scene.acerostudio"
    bl_label = "Importar AceroStudio"
    filename_ext = ".json"
    filter_glob: StringProperty(default="*.json", options={"HIDDEN"})

    def execute(self, context):
        try:
            import_solids(self.filepath)
        except Exception as e:  # noqa: BLE001 - se muestra al usuario
            self.report({"ERROR"}, str(e))
            return {"CANCELLED"}
        self.report({"INFO"}, "Modelo de AceroStudio importado")
        return {"FINISHED"}


def menu_func(self, context):
    self.layout.operator(IMPORT_OT_acerostudio.bl_idname, text="AceroStudio (.acero-solids.json)")


def register():
    bpy.utils.register_class(IMPORT_OT_acerostudio)
    bpy.types.TOPBAR_MT_file_import.append(menu_func)


def unregister():
    bpy.types.TOPBAR_MT_file_import.remove(menu_func)
    bpy.utils.unregister_class(IMPORT_OT_acerostudio)


if __name__ == "__main__":
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    flags = [a for a in args if a.startswith("--")]
    args = [os.path.abspath(a) for a in args if not a.startswith("--")]
    if args:
        # Modo sin ventana: escena limpia, importar, guardar y, si se pide, renderizar.
        bpy.ops.wm.read_factory_settings(use_empty=True)
        import_solids(args[0])
        if len(args) > 1:
            bpy.ops.wm.save_as_mainfile(filepath=args[1])
        if len(args) > 2:
            sc = bpy.context.scene
            sc.render.engine = "CYCLES" if "--cycles" in flags else "BLENDER_EEVEE_NEXT" if bpy.app.version >= (4, 2, 0) else "BLENDER_EEVEE"
            sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
            sc.render.filepath = args[2]
            bpy.ops.render.render(write_still=True)
    else:
        register()
        bpy.ops.import_scene.acerostudio("INVOKE_DEFAULT")
