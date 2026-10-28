# AceroStudio → Blender
# Importa un modelo .acero-solids.json (exportado desde AceroStudio Studio o el servidor MCP) y arma la
# escena comercial: acero PBR (pintado, galvanizado, corten), vidrio real, cielo físico de hora dorada,
# mediodía u hora azul con interiores encendidos, piso de plaza y césped, árboles, cámara con perspectiva
# de dos puntos (verticales rectas) y Cycles con eliminación de ruido. Una colección por nivel.
#
# Tres formas de usarlo:
#   1. Complemento: Editar › Preferencias › Complementos › Instalar… y elegir este archivo.
#      Queda en Archivo › Importar › AceroStudio (.acero-solids.json).
#   2. Script: pestaña Scripting › Abrir › Ejecutar (abre el selector de archivos).
#   3. Sin ventana (lo usa el servidor MCP para renders por lote):
#      blender -b -P acerostudio_blender.py -- modelo.acero-solids.json salida.blend [render.png]
#              [--cycles] [--ambiente=dorada|mediodia|azul] [--toma=heroe|frontal|aerea] [--muestras=96] [--resolucion=1080|1440|2160]

bl_info = {
    "name": "AceroStudio (.acero-solids.json)",
    "author": "AceroStudio",
    "version": (2, 0, 0),
    "blender": (3, 6, 0),
    "location": "Archivo › Importar › AceroStudio",
    "description": "Importa modelos de AceroStudio Studio y arma la escena de render comercial",
    "category": "Import-Export",
}

import json
import math
import os
import random
import sys

import bpy
import bmesh
from bpy.props import BoolProperty, EnumProperty, StringProperty
from bpy_extras.io_utils import ImportHelper
from mathutils import Vector

AMBIENTES = {
    # elevación del sol (°), color y fuerza del sol, fuerza del cielo, exposición, luz interior (W/m²)
    "dorada": {"sun_el": 8, "sun_color": (1.0, 0.55, 0.26), "sun": 5.5, "sky": 0.22, "exposure": -0.85, "interior": 4},
    "mediodia": {"sun_el": 62, "sun_color": (1.0, 0.97, 0.92), "sun": 4.2, "sky": 0.35, "exposure": -1.2, "interior": 0},
    "azul": {"sun_el": -3.5, "sun_color": (0.55, 0.65, 1.0), "sun": 0.0, "sky": 1.2, "exposure": 0.6, "interior": 3.5},
}


def hex_rgba(h, alpha=1.0):
    h = h.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, alpha)


def _inp(node, *names):
    for n in names:
        if n in node.inputs:
            return node.inputs[n]
    return None


def make_material(key, m):
    name = f"AS_{key}"
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    out = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
    alpha = float(m.get("opacity", 1))
    color = hex_rgba(m["color"])
    rough, metal = float(m.get("roughness", 0.8)), float(m.get("metalness", 0))
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    steel = key.startswith("acero") or key in ("corten", "panel_metalico")
    if key in ("vidrio", "policarbonato"):
        # Vidrio de fachada: transmisión real con un leve tinte (no transparencia plana).
        _inp(bsdf, "Transmission Weight", "Transmission").default_value = 1.0 if key == "vidrio" else 0.85
        bsdf.inputs["Roughness"].default_value = 0.02 if key == "vidrio" else 0.35
        bsdf.inputs["IOR"].default_value = 1.52
        bsdf.inputs["Base Color"].default_value = (0.78, 0.86, 0.9, 1) if key == "vidrio" else (0.95, 0.95, 0.92, 1)
        bsdf.inputs["Metallic"].default_value = 0
        if "Thin Wall" in bsdf.inputs:
            bsdf.inputs["Thin Wall"].default_value = True
    elif steel and metal < 0.9:
        # Acero pintado: pigmento dieléctrico con laca (coat), no un metal desnudo.
        bsdf.inputs["Metallic"].default_value = 0.0 if key == "acero_blanco" else 0.25
        bsdf.inputs["Roughness"].default_value = 0.42
        c = _inp(bsdf, "Coat Weight", "Clearcoat")
        if c:
            c.default_value = 0.35
    elif key in ("acero_galvanizado", "acero"):
        a = _inp(bsdf, "Anisotropic")
        if a:
            a.default_value = 0.4
    # Bordes con un milímetro de bisel: el acero se lee como pieza fabricada, no como polígono.
    bevel = nt.nodes.get("AS_bevel") or nt.nodes.new("ShaderNodeBevel")
    bevel.name = "AS_bevel"
    bevel.inputs["Radius"].default_value = 0.004 if steel else 0.008
    nt.links.new(bevel.outputs["Normal"], bsdf.inputs["Normal"])
    # Variación de rugosidad para concreto, piso y paneles (sin texturas externas).
    if key in ("concreto", "microcemento", "losa_steeldeck", "panel_metalico", "corten"):
        noise = nt.nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 3.0 if key != "panel_metalico" else 1.0
        ramp = nt.nodes.new("ShaderNodeMapRange")
        ramp.inputs["To Min"].default_value = max(0.05, rough - 0.12)
        ramp.inputs["To Max"].default_value = min(1.0, rough + 0.08)
        nt.links.new(noise.outputs["Fac"], ramp.inputs["Value"])
        nt.links.new(ramp.outputs["Result"], bsdf.inputs["Roughness"])
    if key == "panel_metalico":
        wave = nt.nodes.new("ShaderNodeTexWave")
        wave.inputs["Scale"].default_value = 8.0
        bump = nt.nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = 0.35
        nt.links.new(wave.outputs["Fac"], bump.inputs["Height"])
        nt.links.new(bevel.outputs["Normal"], bump.inputs["Normal"])
        nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    nt.links.new(bsdf.outputs[0], out.inputs[0])
    mat.diffuse_color = hex_rgba(m["color"], alpha)
    return mat


def solid_mesh(s):
    me = bpy.data.meshes.new(s.get("profile") or s.get("name") or s["kind"])
    if s["shape"] == "mesh":
        me.from_pydata([tuple(v) for v in s["vertices"]], [], [tuple(f) for f in s["faces"]])
        me.update()
        return me
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
    slabs = []
    for i, s in enumerate(data["solids"]):
        me = solid_mesh(s)
        me.materials.append(mats[s["material"]])
        label = s.get("profile") or s.get("name") or ""
        ob = bpy.data.objects.new(f"{s['kind']}_{i:04d}" + (f" {label}" if label else ""), me)
        if s["shape"] == "box":
            ob.location = Vector(s["center"])
            ob.rotation_euler = (0, 0, s["rotZ"])
        ob["acero_element"] = s["element"]
        ob["acero_type"] = s["type"]
        levels.get(s["level"], root).objects.link(ob)
        ground_slab = s["kind"] == "losa" and s["z"] + s["height"] <= 0.25
        if ground_slab:
            continue  # la plaza no cuenta para encuadrar el edificio
        if s["kind"] == "losa":
            slabs.append(s)
        for c in ob.bound_box:
            p = ob.matrix_basis @ Vector(c)
            lo = Vector(map(min, lo, p))
            hi = Vector(map(max, hi, p))
    root["acero_bounds"] = [*lo, *hi] if data["solids"] else [0, 0, 0, 1, 1, 1]
    root["acero_slabs"] = json.dumps(slabs)
    return root


# ---------------------------------------------------------------------------------------------
# Escena comercial

def _link(ob, col):
    col.objects.link(ob)
    return ob


def setup_world(amb, sun_az):
    sc = bpy.context.scene
    world = sc.world or bpy.data.worlds.new("Cielo AceroStudio")
    sc.world = world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()
    sky = nt.nodes.new("ShaderNodeTexSky")
    for t in ("MULTIPLE_SCATTERING", "NISHITA", "SINGLE_SCATTERING", "HOSEK_WILKIE"):
        try:
            sky.sky_type = t
            break
        except TypeError:
            continue
    a = AMBIENTES[amb]
    if hasattr(sky, "sun_elevation"):
        sky.sun_elevation = math.radians(a["sun_el"])
        sky.sun_rotation = sun_az
        sky.sun_disc = amb != "azul"
        if hasattr(sky, "air_density"):
            sky.air_density = 1.2 if amb == "dorada" else 1.0
            sky.aerosol_density = 2.0 if amb == "dorada" else 1.0
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Strength"].default_value = a["sky"]
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(sky.outputs["Color"], bg.inputs["Color"])
    if amb == "azul":
        # Hora azul: el cielo físico bajo el horizonte queda muy oscuro; se le suma un degradado azul profundo.
        grad = nt.nodes.new("ShaderNodeTexGradient")
        geo = nt.nodes.new("ShaderNodeTexCoord")
        sep = nt.nodes.new("ShaderNodeSeparateXYZ")
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = 0.0
        ramp.color_ramp.elements[0].color = (0.55, 0.32, 0.18, 1)
        ramp.color_ramp.elements[1].position = 0.35
        ramp.color_ramp.elements[1].color = (0.012, 0.03, 0.11, 1)
        mid = ramp.color_ramp.elements.new(0.08)
        mid.color = (0.06, 0.12, 0.32, 1)
        nt.links.new(geo.outputs["Generated"], sep.inputs[0])
        nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
        del grad
    nt.links.new(bg.outputs[0], out.inputs[0])


def setup_ground(center, radius, col):
    bpy.ops.mesh.primitive_circle_add(vertices=96, radius=radius * 18, fill_type="NGON", location=(center.x, center.y, -0.03))
    g = bpy.context.active_object
    for c in g.users_collection:
        c.objects.unlink(g)
    col.objects.link(g)
    g.name = "Piso AceroStudio"
    mat = bpy.data.materials.new("AS_piso")
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    vmath = nt.nodes.new("ShaderNodeVectorMath")
    vmath.operation = "LENGTH"
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    # Plaza de concreto alrededor del edificio y césped más allá.
    ramp.color_ramp.elements[0].position = radius * 1.25 / (radius * 18)
    ramp.color_ramp.elements[0].color = (0.2, 0.19, 0.175, 1)
    ramp.color_ramp.elements[1].position = radius * 1.45 / (radius * 18)
    ramp.color_ramp.elements[1].color = (0.07, 0.11, 0.04, 1)
    scale = nt.nodes.new("ShaderNodeVectorMath")
    scale.operation = "SCALE"
    scale.inputs["Scale"].default_value = 1 / (radius * 18)
    nt.links.new(tc.outputs["Object"], scale.inputs[0])
    nt.links.new(scale.outputs["Vector"], vmath.inputs[0])
    nt.links.new(vmath.outputs["Value"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.9
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 40
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.15
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    del sep
    g.data.materials.append(mat)


def setup_trees(center, size, col, front_y, rng):
    leaf = bpy.data.materials.new("AS_follaje")
    leaf.use_nodes = True
    lb = next(n for n in leaf.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    lb.inputs["Base Color"].default_value = (0.025, 0.06, 0.018, 1)
    lb.inputs["Roughness"].default_value = 0.8
    sss = _inp(lb, "Subsurface Weight", "Subsurface")
    if sss:
        sss.default_value = 0.15
    bark = bpy.data.materials.new("AS_tronco")
    bark.use_nodes = True
    bb = next(n for n in bark.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    bb.inputs["Base Color"].default_value = (0.06, 0.045, 0.035, 1)
    bb.inputs["Roughness"].default_value = 0.9
    R = max(size.x, size.y) / 2 + 5
    n = 0
    for _ in range(300):
        if n >= 16:
            break
        a = rng.random() * math.tau
        d = R + 3 + rng.random() * R * 1.2
        x = center.x + math.cos(a) * d * (size.x / 2 + 7) / R
        y = center.y + math.sin(a) * d * (size.y / 2 + 7) / R
        if y < front_y + 2 and abs(x - center.x) < size.x * 1.3:
            continue  # despejar la fachada principal (sur, -Y)
        h = 6 + rng.random() * 4
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.16 * h / 7, depth=h * 0.5, location=(x, y, h * 0.25))
        t = bpy.context.active_object
        t.data.materials.append(bark)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=h * 0.3, location=(x, y, h * 0.65))
        c = bpy.context.active_object
        c.scale = (1, 1, 0.85 + rng.random() * 0.25)
        disp = c.modifiers.new("Volumen", "DISPLACE")
        tex = bpy.data.textures.new("Copa", "CLOUDS")
        tex.noise_scale = 0.6
        disp.texture = tex
        disp.strength = h * 0.08
        c.data.materials.append(leaf)
        bpy.ops.object.shade_smooth()
        for ob in (t, c):
            for uc in ob.users_collection:
                uc.objects.unlink(ob)
            col.objects.link(ob)
        n += 1


def setup_interior_lights(slabs, amb, col):
    a = AMBIENTES[amb]
    if not a["interior"]:
        return
    for i, s in enumerate(slabs):
        if s["z"] < 0.3:
            continue
        xs = [p[0] for p in s["points"]]
        ys = [p[1] for p in s["points"]]
        w, d = max(xs) - min(xs), max(ys) - min(ys)
        if w * d < 4:
            continue
        light = bpy.data.lights.new(f"Interior {i}", "AREA")
        light.shape = "RECTANGLE"
        light.size, light.size_y = w * 0.8, d * 0.8
        light.energy = a["interior"] * w * d
        light.color = (1.0, 0.68, 0.38)
        ob = bpy.data.objects.new(f"Luz interior {i}", light)
        ob.location = ((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, s["z"] - 0.35)
        col.objects.link(ob)


def setup_camera(lo, hi, toma, sun_az, col, aspect):
    center = (lo + hi) / 2
    size = hi - lo
    cam_data = bpy.data.cameras.new("Cámara AceroStudio")
    cam_data.sensor_width = 36
    cam = bpy.data.objects.new("Cámara AceroStudio", cam_data)
    col.objects.link(cam)
    bpy.context.scene.camera = cam
    # La cámara va del lado del sol (fachada iluminada) y mira el frente sur (-Y).
    side = 1 if math.sin(sun_az) >= 0 else -1
    az = {"heroe": 0.62, "frontal": 0.06, "aerea": 0.78}.get(toma, 0.62) * side
    dir_xy = Vector((math.sin(az), -math.cos(az), 0))
    half_w = (abs(dir_xy.y) * size.x + abs(dir_xy.x) * size.y) / 2
    H = size.z
    if toma == "aerea":
        cam_data.lens = 35
        fov_h = 2 * math.atan(18 / 35)
        R = max(half_w / math.tan(fov_h / 2), (H + size.y / 2) / math.tan(fov_h / 2 / aspect)) * 1.25 + max(size.x, size.y) / 2
        el = 0.55
        cam.location = center + dir_xy * R * math.cos(el) + Vector((0, 0, R * math.sin(el)))
        cam.rotation_euler = (center - cam.location).to_track_quat("-Z", "Y").to_euler()
        return cam
    # Perspectiva de dos puntos: cámara horizontal a 1,60 m y desplazamiento vertical del lente.
    cam_data.lens = 24 if toma == "heroe" else 28
    eye = lo.z + 1.6
    sw, sh = 36, 36 / aspect
    D = max(half_w * 2 * 1.12 * cam_data.lens / sw, H * 1.14 * cam_data.lens / sh)
    front = Vector((center.x, lo.y, eye))
    target = Vector((center.x, center.y, eye))
    cam.location = target + dir_xy * (D + (center.y - lo.y) * abs(dir_xy.y) + (size.x / 2) * abs(dir_xy.x) * 0.4)
    cam.location.z = eye
    look = (target - cam.location)
    look.z = 0
    cam.rotation_euler = look.to_track_quat("-Z", "Y").to_euler()
    dist = (target - cam.location).length
    zc = (lo.z + hi.z) / 2 - eye
    cam_data.shift_y = cam_data.lens * zc / (dist * sw) + 0.02
    del front
    return cam


def setup_render(amb, samples, res, out):
    sc = bpy.context.scene
    try:
        sc.render.engine = "CYCLES"
        sc.cycles.samples = samples
        sc.cycles.use_denoising = True
        sc.cycles.max_bounces = 8
        sc.cycles.transmission_bounces = 8
        sc.cycles.glossy_bounces = 4
        sc.cycles.diffuse_bounces = 3
        sc.cycles.caustics_reflective = sc.cycles.caustics_refractive = False
        sc.cycles.blur_glossy = 1.0
    except (AttributeError, TypeError):
        sc.render.engine = "BLENDER_EEVEE_NEXT" if bpy.app.version >= (4, 2, 0) else "BLENDER_EEVEE"
    for vt, look in (("AgX", "AgX - Medium High Contrast"), ("AgX", "Medium High Contrast"), ("Filmic", "Medium High Contrast")):
        try:
            sc.view_settings.view_transform = vt
            try:
                sc.view_settings.look = look
            except TypeError:
                pass
            break
        except TypeError:
            continue
    sc.view_settings.exposure = AMBIENTES[amb]["exposure"]
    h = int(res)
    sc.render.resolution_x, sc.render.resolution_y = round(h * 16 / 9), h
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    if out:
        sc.render.filepath = out


def setup_scene(root, ambiente="dorada", toma="heroe", samples=96, res="1080", seed=7):
    """Escena comercial completa alrededor del modelo importado."""
    b = root.get("acero_bounds")
    lo, hi = Vector(b[:3]), Vector(b[3:])
    center, size = (lo + hi) / 2, hi - lo
    env = bpy.data.collections.new("Entorno AceroStudio")
    bpy.context.scene.collection.children.link(env)
    a = AMBIENTES[ambiente]
    sun_az = math.radians(-125)  # sol de la tarde por el occidente, rasante sobre la fachada sur
    setup_world(ambiente, sun_az)
    if a["sun"] > 0:
        sun_data = bpy.data.lights.new("Sol", "SUN")
        sun_data.energy = a["sun"]
        sun_data.color = a["sun_color"]
        sun_data.angle = math.radians(0.6)
        sun = bpy.data.objects.new("Sol", sun_data)
        el = math.radians(max(a["sun_el"], 2))
        sun.rotation_euler = (math.pi / 2 - el, 0, sun_az + math.pi / 2)
        env.objects.link(sun)
    setup_ground(center, max(size.x, size.y) / 2 + 3, env)
    setup_trees(center, size, env, lo.y, random.Random(seed))
    setup_interior_lights(json.loads(root.get("acero_slabs", "[]")), ambiente, env)
    setup_render(ambiente, samples, res, None)
    sc = bpy.context.scene
    setup_camera(lo, hi, toma, sun_az, env, sc.render.resolution_x / sc.render.resolution_y)
    return env


class IMPORT_OT_acerostudio(bpy.types.Operator, ImportHelper):
    bl_idname = "import_scene.acerostudio"
    bl_label = "Importar AceroStudio"
    filename_ext = ".json"
    filter_glob: StringProperty(default="*.json", options={"HIDDEN"})
    escena: BoolProperty(name="Escena comercial (cielo, entorno, cámara, Cycles)", default=True)
    ambiente: EnumProperty(name="Ambiente", items=[("dorada", "Hora dorada", ""), ("mediodia", "Mediodía", ""), ("azul", "Hora azul", "")], default="dorada")
    toma: EnumProperty(name="Toma", items=[("heroe", "Héroe 3/4", ""), ("frontal", "Frontal", ""), ("aerea", "Aérea", "")], default="heroe")

    def execute(self, context):
        try:
            root = import_solids(self.filepath)
            if self.escena:
                setup_scene(root, self.ambiente, self.toma)
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
    opts = dict(a[2:].split("=", 1) for a in args if a.startswith("--") and "=" in a)
    flags = [a for a in args if a.startswith("--")]
    args = [os.path.abspath(a) for a in args if not a.startswith("--")]
    if args:
        # Modo sin ventana: escena limpia, importar, escena comercial, guardar y, si se pide, renderizar.
        bpy.ops.wm.read_factory_settings(use_empty=True)
        root = import_solids(args[0])
        setup_scene(root, opts.get("ambiente", "dorada"), opts.get("toma", "heroe"), int(opts.get("muestras", 96)), opts.get("resolucion", "1080"))
        if "--cycles" not in flags and len(args) > 2 and "muestras" not in opts:
            bpy.context.scene.cycles.samples = 48
        if len(args) > 1:
            bpy.ops.wm.save_as_mainfile(filepath=args[1])
        if len(args) > 2:
            bpy.context.scene.render.filepath = args[2]
            bpy.ops.render.render(write_still=True)
    else:
        register()
        bpy.ops.import_scene.acerostudio("INVOKE_DEFAULT")
