# AceroStudio · Bogotá futuro
# Conceptos de arquitectura del futuro en acero, mezclados con la tradición bogotana: el ladrillo de Rogelio
# Salmona (celosías, curvas, canales de agua), las casas coloniales de La Candelaria, el ladrillo inglés de
# Chapinero, las culatas, los tanques de agua negros y las varillas en las cubiertas, con los cerros
# orientales y Monserrate al fondo. Cada concepto es una estructura de acero a la vista.
#
# Inspiración: los "architecture fever dreams" de calle (edificios pequeños y escultóricos entre vecinos
# comunes, luz suave de película, cámara a la altura del peatón o desde arriba).
#
# Sin ventana (Blender 4.2+ o el módulo bpy de Python):
#   blender -b -P bogota_futuro.py -- --concepto=faro --salida=faro.png [--muestras=96] [--ancho=1080 --alto=1920]
#   python3 bogota_futuro.py --concepto=todos --carpeta=renders/
# Conceptos: faro, silo, bloque, terrazas, portal, cenital (el faro visto desde arriba).

import argparse
import math
import os
import random
import sys

import bpy
import bmesh
from mathutils import Matrix, Vector, noise

CONCEPTOS = {
    "faro": "Faro de La Candelaria · celosía de ladrillo sobre anillos de acero",
    "silo": "Silo de Chapinero · cilindro de acero inoxidable entre casas de ladrillo",
    "bloque": "Bloque Salmona · caja de acero forrada en ladrillo rojo con canal de agua",
    "terrazas": "Terrazas de los Cerros · cajas de acero apiladas con jardines",
    "portal": "Portal de Teusaquillo · pórtico de acero y ladrillo con casa de vidrio colgada",
    "cenital": "Faro de La Candelaria · vista cenital del cruce",
}

# ---------------------------------------------------------------------------------------------
# Utilidades


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple([x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c] + [1.0])


def sock(sockets, name, kind=None):
    for s in sockets:
        if s.name == name and (kind is None or s.type == kind):
            return s
    raise KeyError(name)


class Ctx:
    def __init__(self, seed):
        self.rng = random.Random(seed)
        self.mats = {}
        self.col = bpy.context.scene.collection


def link(ctx, ob):
    ctx.col.objects.link(ob)
    return ob


def uv_world(bm, mode="box", center=(0, 0)):
    """UV en metros: los ladrillos y texturas quedan a escala real en cualquier volumen."""
    uv = bm.loops.layers.uv.verify()
    cx, cy = center
    for f in bm.faces:
        n = f.normal
        if abs(n.z) > 0.7:
            for l in f.loops:
                l[uv].uv = (l.vert.co.x, l.vert.co.y)
            continue
        if mode == "cyl":
            angs = [math.atan2(l.vert.co.y - cy, l.vert.co.x - cx) for l in f.loops]
            if max(angs) - min(angs) > math.pi:
                angs = [a + 2 * math.pi if a < 0 else a for a in angs]
            for l, a in zip(f.loops, angs):
                r = math.hypot(l.vert.co.x - cx, l.vert.co.y - cy)
                l[uv].uv = (a * r, l.vert.co.z)
        else:
            t = Vector((-n.y, n.x, 0)).normalized()
            for l in f.loops:
                l[uv].uv = (l.vert.co.dot(t), l.vert.co.z)


def mesh_obj(ctx, name, bm, mat, uv="box", center=(0, 0), smooth=False):
    if uv:
        uv_world(bm, uv, center)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(ctx.mats[mat] if isinstance(mat, str) else mat)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    return link(ctx, bpy.data.objects.new(name, me))


def add_box(bm, x0, y0, z0, x1, y1, z1):
    m = Matrix.Translation(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)) @ Matrix.Diagonal((abs(x1 - x0), abs(y1 - y0), abs(z1 - z0), 1))
    return bmesh.ops.create_cube(bm, size=1, matrix=m)["verts"]


def add_cyl(bm, x, y, z0, z1, r, seg=24, r2=None):
    m = Matrix.Translation((x, y, (z0 + z1) / 2))
    return bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=z1 - z0, matrix=m)["verts"]


def add_oriented_box(bm, p, size, rot_z):
    m = Matrix.Translation(p) @ Matrix.Rotation(rot_z, 4, "Z") @ Matrix.Diagonal((*size, 1))
    return bmesh.ops.create_cube(bm, size=1, matrix=m)["verts"]


def box(ctx, name, x0, y0, z0, x1, y1, z1, mat, bevel=0.0):
    bm = bmesh.new()
    add_box(bm, x0, y0, z0, x1, y1, z1)
    if bevel:
        bmesh.ops.bevel(bm, geom=list(bm.edges), offset=bevel, segments=2, affect="EDGES", profile=0.5)
    return mesh_obj(ctx, name, bm, mat)


def curve(ctx, name, pts, radius, mat, cyclic=False):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = radius
    cu.bevel_resolution = 3
    sp = cu.splines.new("POLY")
    sp.points.add(len(pts) - 1)
    for p, q in zip(sp.points, pts):
        p.co = (*q, 1)
    sp.use_cyclic_u = cyclic
    cu.materials.append(ctx.mats[mat])
    return link(ctx, bpy.data.objects.new(name, cu))


def ring(ctx, name, cx, cy, z, r, tube, mat, n=96):
    return curve(ctx, name, [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n), z) for i in range(n)], tube, mat, True)


# ---------------------------------------------------------------------------------------------
# Materiales


def new_mat(ctx, key):
    m = bpy.data.materials.new(key)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    ctx.mats[key] = m
    return m, nt, bsdf


def haze_mix(nt, bsdf, start=60.0, dist=900.0, color=(0.62, 0.68, 0.74, 1)):
    """Bruma de la sabana: lo lejano se funde con el cielo (cerros, ciudad de fondo)."""
    out = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
    cam = nt.nodes.new("ShaderNodeCameraData")
    sub = nt.nodes.new("ShaderNodeMath"); sub.operation = "SUBTRACT"; sub.inputs[1].default_value = start
    div = nt.nodes.new("ShaderNodeMath"); div.operation = "DIVIDE"; div.inputs[1].default_value = -dist
    exp = nt.nodes.new("ShaderNodeMath"); exp.operation = "EXPONENT"
    inv = nt.nodes.new("ShaderNodeMath"); inv.operation = "SUBTRACT"; inv.inputs[0].default_value = 1.0; inv.use_clamp = True
    em = nt.nodes.new("ShaderNodeEmission"); em.inputs["Color"].default_value = color; em.inputs["Strength"].default_value = 1.0
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(cam.outputs["View Distance"], sub.inputs[0])
    nt.links.new(sub.outputs[0], div.inputs[0])
    nt.links.new(div.outputs[0], exp.inputs[0])
    nt.links.new(exp.outputs[0], inv.inputs[1])
    nt.links.new(inv.outputs[0], mix.inputs[0])
    nt.links.new(bsdf.outputs[0], mix.inputs[1])
    nt.links.new(em.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])


def mat_plain(ctx, key, color, rough=0.6, metal=0.0, coat=0.0, haze=False):
    m, nt, b = new_mat(ctx, key)
    b.inputs["Base Color"].default_value = srgb(color) if isinstance(color, str) else color
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if coat:
        b.inputs["Coat Weight"].default_value = coat
    if haze:
        haze_mix(nt, b)
    return m


def mat_noisy(ctx, key, c1, c2, rough=0.7, scale=3.0, metal=0.0, bump=0.15, haze=False, haze_dist=900.0):
    m, nt, b = new_mat(ctx, key)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = scale; nz.inputs["Detail"].default_value = 6
    mx = nt.nodes.new("ShaderNodeMix"); mx.data_type = "RGBA"
    sock(mx.inputs, "A", "RGBA").default_value = srgb(c1)
    sock(mx.inputs, "B", "RGBA").default_value = srgb(c2)
    bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = bump
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    nt.links.new(nz.outputs["Fac"], mx.inputs[0])
    nt.links.new(nz.outputs["Fac"], bp.inputs["Height"])
    nt.links.new(sock(mx.outputs, "Result", "RGBA"), b.inputs["Base Color"])
    nt.links.new(bp.outputs[0], b.inputs["Normal"])
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if haze:
        haze_mix(nt, b, start=150, dist=haze_dist)
    return m


def mat_brick(ctx, key, c1, c2, mortar="#b9ada0", bw=0.25, rh=0.075, ms=0.007, vary=0.25):
    """Ladrillo tolete bogotano a escala real (UV en metros), con variación por pieza y relieve de la junta."""
    m, nt, b = new_mat(ctx, key)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    br = nt.nodes.new("ShaderNodeTexBrick")
    br.offset = 0.5
    br.inputs["Color1"].default_value = srgb(c1)
    br.inputs["Color2"].default_value = srgb(c2)
    br.inputs["Mortar"].default_value = srgb(mortar)
    br.inputs["Scale"].default_value = 1.0
    br.inputs["Mortar Size"].default_value = ms
    br.inputs["Mortar Smooth"].default_value = 0.2
    br.inputs["Bias"].default_value = 0.0
    br.inputs["Brick Width"].default_value = bw
    br.inputs["Row Height"].default_value = rh
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 40; nz.inputs["Detail"].default_value = 4
    dark = nt.nodes.new("ShaderNodeMix"); dark.data_type = "RGBA"; dark.blend_type = "MULTIPLY"
    dark.inputs[0].default_value = vary
    sock(dark.inputs, "B", "RGBA").default_value = (0.55, 0.5, 0.48, 1)
    bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = 0.45; bp.inputs["Distance"].default_value = 0.01
    inv = nt.nodes.new("ShaderNodeMath"); inv.operation = "SUBTRACT"; inv.inputs[0].default_value = 1.0
    add = nt.nodes.new("ShaderNodeMath"); add.operation = "MULTIPLY_ADD"; add.inputs[1].default_value = 0.12
    nt.links.new(tc.outputs["UV"], br.inputs["Vector"])
    nt.links.new(tc.outputs["UV"], nz.inputs["Vector"])
    nt.links.new(br.outputs["Color"], sock(dark.inputs, "A", "RGBA"))
    nt.links.new(nz.outputs["Fac"], dark.inputs[0])
    nt.links.new(sock(dark.outputs, "Result", "RGBA"), b.inputs["Base Color"])
    nt.links.new(br.outputs["Fac"], inv.inputs[1])
    nt.links.new(nz.outputs["Fac"], add.inputs[0])
    nt.links.new(inv.outputs[0], add.inputs[2])
    nt.links.new(add.outputs[0], bp.inputs["Height"])
    nt.links.new(bp.outputs[0], b.inputs["Normal"])
    b.inputs["Roughness"].default_value = 0.88
    return m


def mat_window(ctx, key, lit=0.6, warm="#ffc58a", haze=False, frac=0.55):
    """Vidrio oscuro que refleja el cielo y deja ver interiores cálidos (unos encendidos, otros no)."""
    m, nt, b = new_mat(ctx, key)
    b.inputs["Base Color"].default_value = (0.012, 0.016, 0.02, 1)
    b.inputs["Roughness"].default_value = 0.04
    b.inputs["Specular IOR Level"].default_value = 0.9
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    snap = nt.nodes.new("ShaderNodeVectorMath"); snap.operation = "SNAP"; snap.inputs[1].default_value = (1.9, 1.9, 2.75)
    wn = nt.nodes.new("ShaderNodeTexWhiteNoise"); wn.noise_dimensions = "3D"
    gt = nt.nodes.new("ShaderNodeMath"); gt.operation = "GREATER_THAN"; gt.inputs[1].default_value = 1 - frac
    lw = nt.nodes.new("ShaderNodeLayerWeight"); lw.inputs["Blend"].default_value = 0.35
    fac = nt.nodes.new("ShaderNodeMath"); fac.operation = "SUBTRACT"; fac.inputs[0].default_value = 1.0
    mul = nt.nodes.new("ShaderNodeMath"); mul.operation = "MULTIPLY"
    mul2 = nt.nodes.new("ShaderNodeMath"); mul2.operation = "MULTIPLY"; mul2.inputs[1].default_value = lit
    b.inputs["Emission Color"].default_value = srgb(warm)
    nt.links.new(geo.outputs["Position"], snap.inputs[0])
    nt.links.new(snap.outputs[0], wn.inputs["Vector"])
    nt.links.new(wn.outputs["Value"], gt.inputs[0])
    nt.links.new(lw.outputs["Facing"], fac.inputs[1])
    nt.links.new(gt.outputs[0], mul.inputs[0])
    nt.links.new(fac.outputs[0], mul.inputs[1])
    nt.links.new(mul.outputs[0], mul2.inputs[0])
    nt.links.new(mul2.outputs[0], b.inputs["Emission Strength"])
    if haze:
        haze_mix(nt, b)
    return m


def mat_far_facade(ctx, key, wall_c, haze_start=25.0):
    """Fachadas de la ciudad de fondo: muro con ventanas procedurales y bruma por distancia."""
    m, nt, b = new_mat(ctx, key)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    def frac_lt(inp, period, duty):
        d = nt.nodes.new("ShaderNodeMath"); d.operation = "DIVIDE"; d.inputs[1].default_value = period
        f = nt.nodes.new("ShaderNodeMath"); f.operation = "FRACT"
        lt = nt.nodes.new("ShaderNodeMath"); lt.operation = "LESS_THAN"; lt.inputs[1].default_value = duty
        nt.links.new(inp, d.inputs[0]); nt.links.new(d.outputs[0], f.inputs[0]); nt.links.new(f.outputs[0], lt.inputs[0])
        return lt.outputs[0]
    nt.links.new(tc.outputs["UV"], sep.inputs[0])
    a = frac_lt(sep.outputs["X"], 2.6, 0.5)
    c = frac_lt(sep.outputs["Y"], 2.7, 0.45)
    m0 = nt.nodes.new("ShaderNodeMath"); m0.operation = "MULTIPLY"
    nt.links.new(a, m0.inputs[0]); nt.links.new(c, m0.inputs[1])
    geo = nt.nodes.new("ShaderNodeNewGeometry"); sn = nt.nodes.new("ShaderNodeSeparateXYZ")
    ab = nt.nodes.new("ShaderNodeMath"); ab.operation = "ABSOLUTE"
    wall = nt.nodes.new("ShaderNodeMath"); wall.operation = "LESS_THAN"; wall.inputs[1].default_value = 0.5
    nt.links.new(geo.outputs["Normal"], sn.inputs[0]); nt.links.new(sn.outputs["Z"], ab.inputs[0]); nt.links.new(ab.outputs[0], wall.inputs[0])
    mm = nt.nodes.new("ShaderNodeMath"); mm.operation = "MULTIPLY"
    nt.links.new(m0.outputs[0], mm.inputs[0]); nt.links.new(wall.outputs[0], mm.inputs[1])
    mx = nt.nodes.new("ShaderNodeMix"); mx.data_type = "RGBA"
    sock(mx.inputs, "A", "RGBA").default_value = srgb(wall_c)
    sock(mx.inputs, "B", "RGBA").default_value = (0.02, 0.025, 0.03, 1)
    nt.links.new(mm.outputs[0], mx.inputs[0])
    nt.links.new(sock(mx.outputs, "Result", "RGBA"), b.inputs["Base Color"])
    rough = nt.nodes.new("ShaderNodeMath"); rough.operation = "MULTIPLY_ADD"; rough.inputs[1].default_value = -0.75; rough.inputs[2].default_value = 0.85
    nt.links.new(mm.outputs[0], rough.inputs[0]); nt.links.new(rough.outputs[0], b.inputs["Roughness"])
    haze_mix(nt, b, start=haze_start, dist=420)
    return m


def mat_corrugated(ctx, key, color, metal=1.0, rough=0.22, period=0.076):
    """Lámina ondulada (acero inoxidable o persiana) con relieve por UV: ondas verticales."""
    m, nt, b = new_mat(ctx, key)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wave = nt.nodes.new("ShaderNodeTexWave"); wave.wave_type = "BANDS"; wave.bands_direction = "X"
    wave.inputs["Scale"].default_value = 1.0 / period / 1.0
    wave.inputs["Distortion"].default_value = 0.0
    sc = nt.nodes.new("ShaderNodeMapping"); sc.inputs["Scale"].default_value = (1.0, 1.0, 1.0)
    bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = 0.6; bp.inputs["Distance"].default_value = 0.02
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 2.0
    rr = nt.nodes.new("ShaderNodeMapRange"); rr.inputs["To Min"].default_value = rough * 0.6; rr.inputs["To Max"].default_value = rough * 1.6
    nt.links.new(tc.outputs["UV"], sc.inputs["Vector"])
    nt.links.new(sc.outputs[0], wave.inputs["Vector"])
    nt.links.new(wave.outputs["Fac"], bp.inputs["Height"])
    nt.links.new(bp.outputs[0], b.inputs["Normal"])
    nt.links.new(tc.outputs["UV"], nz.inputs["Vector"])
    nt.links.new(nz.outputs["Fac"], rr.inputs["Value"])
    nt.links.new(rr.outputs[0], b.inputs["Roughness"])
    b.inputs["Base Color"].default_value = srgb(color)
    b.inputs["Metallic"].default_value = metal
    return m


def mat_stripes(ctx, key, base, stripe, period, duty, axis="X"):
    m, nt, b = new_mat(ctx, key)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    d = nt.nodes.new("ShaderNodeMath"); d.operation = "DIVIDE"; d.inputs[1].default_value = period
    f = nt.nodes.new("ShaderNodeMath"); f.operation = "FRACT"
    lt = nt.nodes.new("ShaderNodeMath"); lt.operation = "LESS_THAN"; lt.inputs[1].default_value = duty
    mx = nt.nodes.new("ShaderNodeMix"); mx.data_type = "RGBA"
    sock(mx.inputs, "A", "RGBA").default_value = srgb(base)
    sock(mx.inputs, "B", "RGBA").default_value = srgb(stripe)
    nt.links.new(tc.outputs["Object"], sep.inputs[0])
    nt.links.new(sep.outputs[axis], d.inputs[0]); nt.links.new(d.outputs[0], f.inputs[0]); nt.links.new(f.outputs[0], lt.inputs[0])
    nt.links.new(lt.outputs[0], mx.inputs[0])
    nt.links.new(sock(mx.outputs, "Result", "RGBA"), b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.75
    return m


def materials(ctx):
    # Ladrillos: el tolete naranja de Salmona, el rojo profundo de las Torres del Parque, el de Chapinero.
    mat_brick(ctx, "ladrillo_salmona", "#b5582f", "#9a4526", mortar="#c4b3a0")
    mat_brick(ctx, "ladrillo_rojo", "#8e2a1d", "#7a2318", mortar="#a08c80", vary=0.18)
    mat_brick(ctx, "ladrillo_chapinero", "#8f4a33", "#6f3a2a", mortar="#a7998c", vary=0.35)
    mat_brick(ctx, "ladrillo_culata", "#a65a3a", "#8d4a30", mortar="#9e8e80", bw=0.30, rh=0.11, ms=0.012, vary=0.45)
    mat_brick(ctx, "ladrillo_celosia", "#b65a30", "#a24d29", mortar="#b65a30", bw=0.5, rh=0.5, ms=0.0, vary=0.3)
    mat_noisy(ctx, "pañete_blanco", "#e9e4da", "#d4cdc0", rough=0.9, scale=2.5)
    for k, c in (("ocre", "#d9a441"), ("azul", "#4c7aa6"), ("verde", "#6f9b7a"), ("rosa", "#d98f86"), ("amarillo", "#e8c75a"), ("blanco_gris", "#c9c6c0")):
        mat_noisy(ctx, f"pañete_{k}", c, "#a8a196", rough=0.9, scale=1.5, bump=0.05)
    mat_plain(ctx, "teja_barro", "#9c4a2c", rough=0.8)
    mat_plain(ctx, "madera_verde", "#2f5a43", rough=0.6)
    mat_plain(ctx, "madera_azul", "#2c4f78", rough=0.6)
    mat_plain(ctx, "marco_blanco", "#e6e3dc", rough=0.4)
    mat_plain(ctx, "marco_negro", "#141414", rough=0.4, metal=0.6)
    # Acero: grafito pintado (estructura a la vista), inoxidable, blanco, y el rojo del lápiz del abuelo.
    mat_plain(ctx, "acero_grafito", "#2a2c2f", rough=0.38, metal=0.85, coat=0.3)
    mat_plain(ctx, "acero_blanco", "#e8e7e3", rough=0.32, metal=0.2, coat=0.4)
    mat_plain(ctx, "acero_rojo", "#cf2a1f", rough=0.3, metal=0.3, coat=0.6)
    mat_corrugated(ctx, "acero_inox", "#d6d9dc", metal=1.0, rough=0.3)
    mat_corrugated(ctx, "persiana", "#8d9196", metal=0.7, rough=0.45, period=0.06)
    mat_window(ctx, "ventana", lit=0.35, frac=0.45)
    mat_window(ctx, "ventana_heroe", lit=0.28, frac=0.6, warm="#f0a35c")
    mat_window(ctx, "ventana_lejos", lit=0.3, haze=True)
    mat_plain(ctx, "vidrio_claro", (0.6, 0.7, 0.72, 1), rough=0.02)
    g = ctx.mats["vidrio_claro"].node_tree.nodes["Principled BSDF"]
    g.inputs["Transmission Weight"].default_value = 1.0
    mat_noisy(ctx, "asfalto", "#2b2c2e", "#3a3b3d", rough=0.85, scale=60, bump=0.3)
    mat_noisy(ctx, "anden", "#a7a49d", "#8f8c86", rough=0.85, scale=8, bump=0.1)
    mat_plain(ctx, "bordillo", "#bdb9b0", rough=0.8)
    mat_plain(ctx, "pintura_via", "#ecebe6", rough=0.6)
    mat_plain(ctx, "pintura_amarilla", "#e3b52a", rough=0.6)
    mat_plain(ctx, "concreto", "#9d9a94", rough=0.85)
    mat_plain(ctx, "tanque_negro", "#121314", rough=0.5)
    mat_plain(ctx, "varilla", "#5b3b2a", rough=0.7, metal=0.6)
    mat_plain(ctx, "cable", "#0e0e0e", rough=0.5)
    mat_noisy(ctx, "follaje", "#2f5a2a", "#4b7a34", rough=0.8, scale=6, bump=0.5)
    mat_noisy(ctx, "follaje_oscuro", "#22401f", "#36592a", rough=0.8, scale=6, bump=0.5)
    mat_noisy(ctx, "pasto", "#4c7a33", "#3b6328", rough=0.9, scale=12, bump=0.3)
    mat_plain(ctx, "tronco", "#3e3127", rough=0.9)
    mat_plain(ctx, "agua", (0.05, 0.08, 0.09, 1), rough=0.02)
    mat_noisy(ctx, "cerro", "#1c3520", "#3a5a2c", rough=0.9, scale=0.004, haze=True, haze_dist=2600.0)
    mat_plain(ctx, "monserrate", "#f0ede6", rough=0.6, haze=True)
    mat_plain(ctx, "llanta", "#151515", rough=0.7)
    mat_plain(ctx, "carro_blanco", "#e9e7e1", rough=0.25, coat=1.0)
    mat_plain(ctx, "carro_amarillo", "#f2c230", rough=0.25, coat=1.0)
    mat_plain(ctx, "carro_rojo", "#9b1c18", rough=0.25, coat=1.0)
    mat_plain(ctx, "carro_azul", "#2a4766", rough=0.25, coat=1.0)
    mat_plain(ctx, "letrero_rojo", "#b8281e", rough=0.5)
    mat_plain(ctx, "letrero_azul", "#1f4f8f", rough=0.5)
    mat_plain(ctx, "letrero_amarillo", "#e7b525", rough=0.5)
    for k, c in (("ladrillo", "#8a4b33"), ("gris", "#8c8a86"), ("crema", "#cfc6b6"), ("rojo", "#7d3526")):
        mat_far_facade(ctx, f"lejos_{k}", c)


# ---------------------------------------------------------------------------------------------
# Ciudad: calle, andenes, vecinos bogotanos, ciudad de fondo, cerros y Monserrate.

STREET = (-11.0, -2.6)   # calzada en y
FRONT = 0.0              # paramento (fachadas) en y = 0


def street(ctx, zebra_x=-10.5):
    box(ctx, "calzada", -160, STREET[0], -0.05, 160, STREET[1], 0.0, "asfalto")
    box(ctx, "anden_norte", -160, STREET[1], 0.0, 160, FRONT + 0.3, 0.16, "anden")
    box(ctx, "anden_sur", -160, -14.5, 0.0, 160, STREET[0], 0.16, "anden")
    box(ctx, "bordillo_n", -160, STREET[1], 0.0, 160, STREET[1] + 0.16, 0.17, "bordillo")
    box(ctx, "bordillo_s", -160, STREET[0] - 0.16, 0.0, 160, STREET[0], 0.17, "bordillo")
    bm = bmesh.new()
    mid = (STREET[0] + STREET[1]) / 2
    for i in range(-40, 40):
        x = i * 6.0
        if abs(x - zebra_x) < 4:
            continue
        add_box(bm, x, mid - 0.06, 0.0, x + 3.0, mid + 0.06, 0.006)
    mesh_obj(ctx, "linea_central", bm, "pintura_amarilla")
    bm = bmesh.new()
    for k in range(13):
        y = STREET[0] + 0.4 + k * 0.62
        if y > STREET[1] - 0.3:
            break
        add_box(bm, zebra_x - 2.2, y, 0.0, zebra_x + 2.2, y + 0.38, 0.007)
    mesh_obj(ctx, "cebra", bm, "pintura_via")
    box(ctx, "cielo_tierra", -3000, -3000, -0.4, 3000, 3000, -0.3, "cerro")


def window_grid(bm_win, bm_frame, x0, x1, z0, z1, y, w=1.1, h=1.3, gap=0.9, rows=None, floor_h=2.7, frame=0.05, start=1.0):
    """Ventanas en una fachada frontal (plano y), centradas por piso."""
    n = max(1, int((x1 - x0 - gap) // (w + gap)))
    tot = n * w + (n - 1) * gap
    xs = [x0 + (x1 - x0 - tot) / 2 + i * (w + gap) for i in range(n)]
    floors = rows if rows is not None else max(0, int((z1 - z0) // floor_h))
    for f in range(floors):
        zb = z0 + f * floor_h + start
        if zb + h > z1 - 0.2:
            break
        for x in xs:
            add_box(bm_win, x, y - 0.02, zb, x + w, y + 0.02, zb + h)
            add_box(bm_frame, x - frame, y - 0.06, zb - frame, x + w + frame, y - 0.02, zb)          # alféizar
            add_box(bm_frame, x - frame, y - 0.06, zb + h, x + w + frame, y - 0.02, zb + h + frame)
            add_box(bm_frame, x - frame, y - 0.06, zb, x, y - 0.02, zb + h)
            add_box(bm_frame, x + w, y - 0.06, zb, x + w + frame, y - 0.02, zb + h)
            add_box(bm_frame, x + w / 2 - 0.02, y - 0.05, zb, x + w / 2 + 0.02, y - 0.02, zb + h)


def rooftop_bits(ctx, rng, bm_tank, bm_rebar, x0, x1, y0, y1, z):
    """Lo más bogotano de las cubiertas: tanques negros y varillas esperando el siguiente piso."""
    if rng.random() < 0.7:
        tx, ty = rng.uniform(x0 + 1, x1 - 1), rng.uniform(y0 + 1.5, y0 + 4)
        add_cyl(bm_tank, tx, ty, z, z + 1.1, 0.55, 20)
        add_cyl(bm_tank, tx, ty, z + 1.1, z + 1.22, 0.3, 16)
    if rng.random() < 0.45:
        for xi in range(int((x1 - x0) // 3) + 1):
            for yi in range(3):
                xx, yy = x0 + 0.3 + xi * 3.0, y0 + 0.3 + yi * 4.0
                if xx < x1 and yy < y1:
                    for dx in (0, 0.18):
                        add_cyl(bm_rebar, xx + dx, yy, z, z + rng.uniform(0.8, 1.4), 0.012, 6)


def neighbor(ctx, x0, x1, style, floors, depth=12.0, shop=True):
    rng = ctx.rng
    fh = 2.75
    h = 0.4 + floors * fh
    bm_win, bm_frame, bm_tank, bm_rebar = bmesh.new(), bmesh.new(), bmesh.new(), bmesh.new()
    # Volumen en ladrillo de culata (los muros laterales que se ven sobre los vecinos más bajos).
    box(ctx, f"culata_{x0:.0f}", x0 + 0.02, FRONT + 0.25, 0, x1 - 0.02, FRONT + depth, h, "ladrillo_culata")
    fac = {"ladrillo": "ladrillo_chapinero", "colonial": "pañete_blanco"}.get(style, style)
    if style.startswith("pañete") or style == "colonial":
        box(ctx, f"fachada_{x0:.0f}", x0, FRONT, 0, x1, FRONT + 0.3, h, fac)
    else:
        box(ctx, f"fachada_{x0:.0f}", x0, FRONT, 0, x1, FRONT + 0.3, h, fac)
    frame_mat = "marco_blanco" if style != "colonial" else rng.choice(["madera_verde", "madera_azul"])
    zstart = 3.2 if shop else 0.0
    window_grid(bm_win, bm_frame, x0 + 0.4, x1 - 0.4, zstart, h, FRONT, w=rng.choice([1.0, 1.2, 1.5]), h=1.35, gap=rng.choice([0.7, 0.9, 1.1]), floor_h=fh, start=0.75)
    if shop:
        # Local de primer piso: persiana o vitrina, con letrero.
        if rng.random() < 0.5:
            add_box(bm_win, x0 + 0.6, FRONT - 0.03, 0.16, x1 - 0.6, FRONT + 0.02, 2.6)
        else:
            box(ctx, f"persiana_{x0:.0f}", x0 + 0.6, FRONT - 0.04, 0.16, x1 - 0.6, FRONT + 0.02, 2.6, "persiana")
        box(ctx, f"letrero_{x0:.0f}", x0 + 0.5, FRONT - 0.12, 2.7, x1 - 0.5, FRONT, 3.1, rng.choice(["letrero_rojo", "letrero_azul", "letrero_amarillo", "marco_blanco"]))
    if style == "colonial":
        # Alero de teja de barro sobre la calle y balcón de madera.
        bm = bmesh.new()
        v = add_box(bm, x0 - 0.05, FRONT - 0.9, h - 0.05, x1 + 0.05, FRONT + depth * 0.5, h + 0.12)
        for vv in v:
            if vv.co.y > FRONT:
                vv.co.z += 1.6
        mesh_obj(ctx, f"teja_{x0:.0f}", bm, "teja_barro")
        if floors >= 2 and rng.random() < 0.8:
            bx0, bx1 = x0 + 0.8, x1 - 0.8
            z = fh + 0.5
            box(ctx, f"balcon_{x0:.0f}", bx0, FRONT - 0.8, z, bx1, FRONT, z + 0.12, frame_mat)
            bm = bmesh.new()
            n = int((bx1 - bx0) / 0.14)
            for i in range(n + 1):
                xx = bx0 + i * (bx1 - bx0) / n
                add_box(bm, xx, FRONT - 0.79, z + 0.12, xx + 0.04, FRONT - 0.75, z + 1.0)
            add_box(bm, bx0, FRONT - 0.82, z + 0.98, bx1, FRONT - 0.72, z + 1.08)
            mesh_obj(ctx, f"baranda_{x0:.0f}", bm, frame_mat)
    else:
        # Cubierta plana con pretil, tanques y varillas.
        box(ctx, f"pretil_{x0:.0f}", x0, FRONT, h, x1, FRONT + 0.2, h + 0.9, fac)
        rooftop_bits(ctx, rng, bm_tank, bm_rebar, x0, x1, FRONT, FRONT + depth, h)
        if style == "ladrillo" and rng.random() < 0.5:
            # Chapinero inglés: hastial de ladrillo con techo inclinado.
            bm = bmesh.new()
            v = add_box(bm, x0 + 0.3, FRONT + 0.1, h, x1 - 0.3, FRONT + depth * 0.7, h + 0.15)
            for vv in v:
                if vv.co.y > FRONT + 1:
                    vv.co.z += 2.8
            mesh_obj(ctx, f"techo_{x0:.0f}", bm, "teja_barro")
    mesh_obj(ctx, f"ventanas_{x0:.0f}", bm_win, "ventana")
    mesh_obj(ctx, f"marcos_{x0:.0f}", bm_frame, frame_mat)
    if bm_tank.verts:
        mesh_obj(ctx, f"tanques_{x0:.0f}", bm_tank, "tanque_negro", smooth=True)
    else:
        bm_tank.free()
    if bm_rebar.verts:
        mesh_obj(ctx, f"varillas_{x0:.0f}", bm_rebar, "varilla")
    else:
        bm_rebar.free()
    return h


def neighbors_row(ctx, lot, styles, floors_range, extent=110):
    rng = ctx.rng
    hs = {}
    for side in (-1, 1):
        x = lot[0] if side < 0 else lot[1]
        i = 0
        while abs(x) < extent:
            w = rng.uniform(5.5, 9.0)
            a, b = (x - w, x) if side < 0 else (x, x + w)
            st = rng.choice(styles)
            fl = rng.randint(*floors_range)
            hs[i * side] = neighbor(ctx, a, b, st, fl, shop=rng.random() < 0.75)
            x = a if side < 0 else b
            i += 1
    return hs


def opposite_row(ctx, styles):
    rng = ctx.rng
    x = -110
    while x < 110:
        w = rng.uniform(6, 9)
        fl = rng.randint(2, 5)
        h = 0.4 + fl * 2.75
        box(ctx, f"op_{x:.0f}", x, -26, 0, x + w, -14.6, h, rng.choice(["ladrillo_chapinero", "ladrillo_culata", "pañete_ocre", "pañete_blanco_gris"]))
        bm_t, bm_r = bmesh.new(), bmesh.new()
        rooftop_bits(ctx, rng, bm_t, bm_r, x, x + w, -26, -14.6, h)
        for bmx, mat in ((bm_t, "tanque_negro"), (bm_r, "varilla")):
            if bmx.verts:
                mesh_obj(ctx, f"op_{mat}_{x:.0f}", bmx, mat)
            else:
                bmx.free()
        x += w


def far_city(ctx, y0=18, y1=420, towers=True):
    rng = ctx.rng
    groups = {k: bmesh.new() for k in ("lejos_ladrillo", "lejos_gris", "lejos_crema", "lejos_rojo")}
    y = y0
    while y < y1:
        x = -260
        dy = rng.uniform(10, 16)
        while x < 260:
            w = rng.uniform(7, 16)
            near = y < 60
            hmax = 14 if near else 22
            h = rng.uniform(5, hmax)
            if towers and rng.random() < 0.04 and y > 80:
                h = rng.uniform(35, 70)
            k = rng.choices(list(groups), weights=[6, 2, 1, 1])[0]
            add_box(groups[k], x, y, 0, x + w * 0.92, y + dy * 0.85, h)
            x += w
        y += dy
    for k, bm in groups.items():
        mesh_obj(ctx, f"ciudad_{k}", bm, k)


def mountains(ctx, cx=0.0):
    """Cerros orientales: una cordillera verde de ~500 m sobre la sabana, con Monserrate en la cima."""
    bm = bmesh.new()
    nx, ny = 160, 60
    xs = [-2600 + 5200 * i / nx for i in range(nx + 1)]
    ys = [650 + 1900 * j / ny for j in range(ny + 1)]
    verts = []
    for j, y in enumerate(ys):
        row = []
        for x in xs:
            t = min(1.0, (y - 650) / 750)
            ridge = 520 + 120 * noise.noise(Vector((x / 900, 3.1, 0))) + 60 * noise.noise(Vector((x / 300, 7.7, 0)))
            peak = 140 * math.exp(-((x - cx - 120) / 420) ** 2)
            z = (ridge + peak) * (math.sin(t * math.pi / 2) ** 1.4) + 25 * noise.noise(Vector((x / 80, y / 80, 1)))
            row.append(bm.verts.new((x, y, max(0, z))))
        verts.append(row)
    for j in range(ny):
        for i in range(nx):
            bm.faces.new((verts[j][i], verts[j][i + 1], verts[j + 1][i + 1], verts[j + 1][i]))
    mesh_obj(ctx, "cerros", bm, "cerro", uv=None, smooth=True)
    # Santuario de Monserrate: nave blanca y dos torres en la cumbre.
    t = 1.0
    px, py = cx + 120, 1400
    pz = (520 + 120 * noise.noise(Vector((px / 900, 3.1, 0))) + 60 * noise.noise(Vector((px / 300, 7.7, 0))) + 140) * t
    box(ctx, "monserrate", px - 14, py, pz - 8, px + 14, py + 40, pz + 12, "monserrate")
    for dx in (-10, 10):
        box(ctx, f"monserrate_torre{dx}", px + dx - 3, py - 2, pz, px + dx + 3, py + 4, pz + 28, "monserrate")


def tree(ctx, x, y, h=7.0, r=2.4, mat="follaje"):
    rng = ctx.rng
    bm = bmesh.new()
    add_cyl(bm, x, y, 0, h * 0.55, 0.16, 10, r2=0.1)
    mesh_obj(ctx, f"tronco_{x:.0f}", bm, "tronco")
    bm = bmesh.new()
    for _ in range(9):
        cx, cy, cz = x + rng.uniform(-r, r) * 0.6, y + rng.uniform(-r, r) * 0.6, h * rng.uniform(0.6, 0.95)
        rr = r * rng.uniform(0.45, 0.75)
        v = bmesh.ops.create_icosphere(bm, subdivisions=3, radius=rr, matrix=Matrix.Translation((cx, cy, cz)))["verts"]
        for vv in v:
            d = vv.co - Vector((cx, cy, cz))
            vv.co += d.normalized() * rr * 0.35 * noise.noise(vv.co * 1.3)
    mesh_obj(ctx, f"copa_{x:.0f}", bm, mat, uv=None, smooth=True)


def pole_and_wires(ctx, xs, y=-2.2, h=9.0):
    bm = bmesh.new()
    for x in xs:
        add_cyl(bm, x, y, 0.16, h, 0.13, 12, r2=0.09)
        add_box(bm, x - 0.8, y - 0.06, h - 0.6, x + 0.8, y + 0.06, h - 0.48)
    mesh_obj(ctx, "postes", bm, "concreto", smooth=True)
    for a, b in zip(xs, xs[1:]):
        for k, dy in enumerate((-0.7, -0.25, 0.25, 0.7)):
            pts = []
            for i in range(25):
                t = i / 24
                sag = 0.9 * 4 * t * (1 - t)
                pts.append((a + (b - a) * t, y + dy, h - 0.5 - sag - 0.05 * k))
            curve(ctx, f"cable_{a:.0f}_{k}", pts, 0.012, "cable")
        # Cables que cruzan a las fachadas (la maraña de siempre).
        pts = [(a + 0.2, y, h - 0.6), (a + 1.5, y + 1.0, h - 1.6), (a + 2.5, FRONT - 0.05, h - 2.6)]
        curve(ctx, f"acometida_{a:.0f}", pts, 0.01, "cable")


def car(ctx, x, y, rot=0.0, mat="carro_blanco", taxi=False):
    """Carro sencillo (o el taxi amarillo de Bogotá) para dar escala."""
    bm = bmesh.new()
    L, W = 4.1, 1.7
    def ob(p, s):
        add_oriented_box(bm, Vector((x, y, 0)) + Matrix.Rotation(rot, 3, "Z") @ Vector(p), s, rot)
    ob((0, 0, 0.62), (L, W, 0.62))
    ob((-0.25, 0, 1.12), (L * 0.55, W * 0.92, 0.48))
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=0.08, segments=2, affect="EDGES", profile=0.6)
    mesh_obj(ctx, f"carro_{x:.0f}", bm, "carro_amarillo" if taxi else mat)
    bm = bmesh.new()
    def ob2(p, s):
        add_oriented_box(bm, Vector((x, y, 0)) + Matrix.Rotation(rot, 3, "Z") @ Vector(p), s, rot)
    ob2((-0.25, 0, 1.13), (L * 0.56, W * 0.94, 0.36))
    mesh_obj(ctx, f"vidrios_{x:.0f}", bm, "ventana")
    bm = bmesh.new()
    for dx in (-1.35, 1.3):
        for dy in (-W / 2 + 0.05, W / 2 - 0.05):
            c = Vector((x, y, 0.32)) + Matrix.Rotation(rot, 3, "Z") @ Vector((dx, dy, 0))
            m = Matrix.Translation(c) @ Matrix.Rotation(rot, 4, "Z") @ Matrix.Rotation(math.pi / 2, 4, "X")
            bmesh.ops.create_cone(bm, cap_ends=True, segments=18, radius1=0.32, radius2=0.32, depth=0.22, matrix=m)
    mesh_obj(ctx, f"llantas_{x:.0f}", bm, "llanta", smooth=True)


def traffic_light(ctx, x, y):
    bm = bmesh.new()
    add_cyl(bm, x, y, 0.16, 4.6, 0.07, 12)
    add_box(bm, x - 0.18, y - 0.3, 3.3, x + 0.18, y - 0.06, 4.3)
    mesh_obj(ctx, "semaforo", bm, "marco_negro")
    m, nt, b = new_mat(ctx, "luz_roja")
    b.inputs["Emission Color"].default_value = (1, 0.05, 0.02, 1)
    b.inputs["Emission Strength"].default_value = 30
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=12, v_segments=8, radius=0.09, matrix=Matrix.Translation((x, y - 0.32, 4.1)))
    mesh_obj(ctx, "luz_semaforo", bm, "luz_roja", uv=None, smooth=True)


# ---------------------------------------------------------------------------------------------
# Conceptos en acero


def celosia_cyl(ctx, name, cx, cy, r, z0, z1, floor_h=3.2, brick=(0.24, 0.11, 0.075), gap=0.11, skip=None):
    """Celosía de ladrillo de Salmona sobre un cilindro: hiladas trabadas con calados en la franja de ventana."""
    bl, bd, bh = brick
    n = int(2 * math.pi * r / (bl + gap))
    n_solid = int(2 * math.pi * r / (bl + 0.012))
    bm = bmesh.new()
    rows = int((z1 - z0) / (bh + 0.012))
    for k in range(rows):
        z = z0 + k * (bh + 0.012)
        zf = (z - z0) % floor_h
        porous = 0.95 < zf < floor_h - 0.55
        cnt = n if porous else n_solid
        off = 0.5 * (k % 2)
        for i in range(cnt):
            a = 2 * math.pi * (i + off) / cnt
            if skip and skip(a, z):
                continue
            p = Vector((cx + r * math.cos(a), cy + r * math.sin(a), z + bh / 2))
            add_oriented_box(bm, p, (bd, bl, bh), a)
    return mesh_obj(ctx, name, bm, "ladrillo_celosia", uv="cyl", center=(cx, cy))


def concept_faro(ctx):
    """Torre cilíndrica: núcleo de vidrio, anillos de acero en cada losa y celosía de ladrillo; óculo rojo."""
    cx, cy, r = 0.0, 5.0, 3.3
    z0, top = 3.8, 20.6
    lot = (-5.0, 5.0)
    # Primer piso libre: columnas tubulares de acero y café de vidrio.
    bm = bmesh.new()
    for i in range(10):
        a = 2 * math.pi * i / 10 + 0.1
        add_cyl(bm, cx + (r + 0.05) * math.cos(a), cy + (r + 0.05) * math.sin(a), 0.16, top, 0.11, 16)
    mesh_obj(ctx, "columnas_faro", bm, "acero_grafito", smooth=True)
    bm = bmesh.new()
    add_cyl(bm, cx, cy, 0.16, z0, r - 0.9, 64)
    mesh_obj(ctx, "cafe_vidrio", bm, "ventana_heroe", uv="cyl", center=(cx, cy), smooth=True)
    bm = bmesh.new()
    add_cyl(bm, cx, cy, z0, top, r - 0.35, 64)
    mesh_obj(ctx, "nucleo", bm, "ventana_heroe", uv="cyl", center=(cx, cy), smooth=True)
    # Losas: anillos de acero grafito (vigas perimetrales) a la vista.
    z = z0
    while z <= top + 0.01:
        bm = bmesh.new()
        add_cyl(bm, cx, cy, z - 0.35, z, r + 0.22, 96)
        mesh_obj(ctx, f"anillo_{z:.1f}", bm, "acero_grafito", uv=None, smooth=True)
        z += 3.2
    # Celosía: deja un hueco para el óculo rojo que mira a la calle (−y).
    oc_z, oc_r = 13.4, 1.35
    def skip(a, zz):
        p = Vector((r * math.cos(a), r * math.sin(a)))
        return p.y < 0 and math.hypot(p.x, zz - oc_z) < oc_r + 0.05
    celosia_cyl(ctx, "celosia_faro", cx, cy, r, z0, top - 0.35, skip=skip)
    # Óculo: tubo de acero rojo (el lápiz rojo del abuelo) con vidrio.
    m = Matrix.Translation((cx, cy - r - 0.15, oc_z)) @ Matrix.Rotation(math.pi / 2, 4, "X")
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=False, segments=64, radius1=oc_r + 0.18, radius2=oc_r + 0.18, depth=1.1, matrix=m)
    bmesh.ops.solidify(bm, geom=list(bm.faces), thickness=0.16)
    mesh_obj(ctx, "oculo", bm, "acero_rojo", uv=None, smooth=True)
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, segments=64, radius=oc_r + 0.05, matrix=Matrix.Translation((cx, cy - r + 0.25, oc_z)) @ Matrix.Rotation(math.pi / 2, 4, "X"))
    mesh_obj(ctx, "oculo_vidrio", bm, "ventana_heroe", uv=None)
    # Corona: cercha circular de acero con jardín en la cubierta.
    ring(ctx, "corona_a", cx, cy, top + 0.05, r + 0.15, 0.09, "acero_grafito")
    ring(ctx, "corona_b", cx, cy, top + 1.6, r + 0.15, 0.09, "acero_grafito")
    pts = []
    for i in range(41):
        a = 2 * math.pi * i / 40
        pts.append((cx + (r + 0.15) * math.cos(a), cy + (r + 0.15) * math.sin(a), top + (0.05 if i % 2 == 0 else 1.6)))
    curve(ctx, "corona_diag", pts, 0.05, "acero_grafito")
    bm = bmesh.new()
    add_cyl(bm, cx, cy, top, top + 0.35, r - 0.2, 64)
    mesh_obj(ctx, "jardin_cubierta", bm, "pasto", uv=None)
    tree(ctx, cx - 0.8, cy + 0.5, h=top + 3.5, r=1.6)
    tree(ctx, cx + 1.2, cy - 0.6, h=top + 2.8, r=1.2, mat="follaje_oscuro")
    # Pieza de ladrillo de Salmona en el piso: plaza con banca curva.
    bm = bmesh.new()
    add_box(bm, lot[0], FRONT, 0.16, lot[1], FRONT + 10, 0.2)
    mesh_obj(ctx, "plaza_ladrillo", bm, "ladrillo_salmona")
    return lot, {"target": (0, cy, 10.5), "height": top}


def concept_silo(ctx):
    """Cilindro de acero inoxidable corrugado con cajas de vidrio enmarcadas en acero que sobresalen."""
    cx, cy, r, H = 0.0, 4.2, 3.0, 15.5
    lot = (-4.2, 4.2)
    bm = bmesh.new()
    v = add_cyl(bm, cx, cy, 0.16, H, r, 240)
    mesh_obj(ctx, "silo", bm, "acero_inox", uv="cyl", center=(cx, cy), smooth=True)
    # Base: persiana metálica y puerta, como un local bogotano.
    bm = bmesh.new()
    add_box(bm, -1.7, cy - r - 0.15, 0.16, 1.7, cy - r + 0.6, 2.7)
    mesh_obj(ctx, "persiana_silo", bm, "persiana")
    box(ctx, "dintel_silo", -1.9, cy - r - 0.25, 2.7, 1.9, cy - r + 0.6, 2.95, "acero_grafito")
    # Cajas de vidrio en voladizo (marcos de acero grafito), giradas alrededor del cilindro.
    boxes = [(-0.25, 4.3, 2.8, 2.0, 1.4), (0.55, 8.1, 2.2, 2.2, 1.1), (-0.65, 11.6, 2.6, 1.8, 1.3), (0.15, 13.4, 1.6, 1.4, 0.9)]
    for k, (ang, z, w, h, d) in enumerate(boxes):
        a = -math.pi / 2 + ang
        c = Vector((cx + (r + d / 2 - 0.4) * math.cos(a), cy + (r + d / 2 - 0.4) * math.sin(a), z + h / 2))
        bm = bmesh.new()
        add_oriented_box(bm, c, (d + 0.2, w + 0.2, h + 0.2), a)
        mesh_obj(ctx, f"marco_caja_{k}", bm, "acero_grafito")
        bm = bmesh.new()
        add_oriented_box(bm, c + Vector((math.cos(a), math.sin(a), 0)) * 0.03, (d + 0.16, w, h), a)
        mesh_obj(ctx, f"vidrio_caja_{k}", bm, "ventana_heroe")
    # Ventanas corridas pequeñas (ojos de buey cuadrados) en el lado.
    bm_w = bmesh.new()
    for k in range(5):
        a = -math.pi / 2 + 1.25
        z = 3.6 + k * 2.6
        c = Vector((cx + (r + 0.02) * math.cos(a), cy + (r + 0.02) * math.sin(a), z))
        add_oriented_box(bm_w, c, (0.08, 0.7, 0.7), a)
    mesh_obj(ctx, "ojos", bm_w, "ventana_heroe")
    # Ático: cilindro retranqueado de vidrio con anillo de acero y antena.
    bm = bmesh.new()
    add_cyl(bm, cx + 0.3, cy + 0.3, H, H + 2.4, r - 0.9, 64)
    mesh_obj(ctx, "atico", bm, "ventana_heroe", uv="cyl", center=(cx, cy), smooth=True)
    ring(ctx, "anillo_atico", cx + 0.3, cy + 0.3, H + 2.45, r - 0.8, 0.12, "acero_grafito")
    ring(ctx, "anillo_silo", cx, cy, H + 0.02, r + 0.02, 0.1, "acero_grafito")
    bm = bmesh.new()
    add_cyl(bm, cx + 0.9, cy + 0.9, H + 2.4, H + 5.4, 0.04, 8)
    mesh_obj(ctx, "antena", bm, "acero_grafito")
    return lot, {"target": (0, cy, 8.5), "height": H + 2.4}


def concept_bloque(ctx):
    """Caja de acero forrada en ladrillo rojo con esquinas curvas, ventanas cuadradas y canal de agua."""
    x0, x1, y0, y1, H, base = -6.0, 6.0, 0.6, 11.5, 22.0, 4.4
    lot = (-7.0, 7.0)
    bm = bmesh.new()
    add_box(bm, x0, y0, base, x1, y1, H)
    edges = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 1]
    bmesh.ops.bevel(bm, geom=edges, offset=2.6, segments=14, affect="EDGES", profile=0.5)
    mesh_obj(ctx, "bloque", bm, "ladrillo_rojo")
    # Ventanas cuadradas hundidas con marco de acero en la fachada a la calle y en el lateral visible.
    bm_w, bm_f = bmesh.new(), bmesh.new()
    s, step_x, step_z = 0.95, 1.55, 1.6
    xs = [x0 + 2.9 + i * step_x for i in range(int((x1 - x0 - 5.8) // step_x) + 1)]
    for zi in range(int((H - base - 1.0) // step_z)):
        z = base + 0.7 + zi * step_z
        for x in xs:
            add_box(bm_w, x, y0 - 0.03, z, x + s, y0 + 0.05, z + s)
            add_box(bm_f, x - 0.07, y0 - 0.22, z - 0.07, x + s + 0.07, y0 - 0.02, z)
            add_box(bm_f, x - 0.07, y0 - 0.22, z + s, x + s + 0.07, y0 - 0.02, z + s + 0.07)
            add_box(bm_f, x - 0.07, y0 - 0.22, z, x, y0 - 0.02, z + s)
            add_box(bm_f, x + s, y0 - 0.22, z, x + s + 0.07, y0 - 0.02, z + s)
        for y in [y0 + 2.9 + i * step_x for i in range(int((y1 - y0 - 5.8) // step_x) + 1)]:
            add_box(bm_w, x0 - 0.05, y, z, x0 + 0.03, y + s, z + s)
            add_box(bm_f, x0 - 0.22, y - 0.07, z - 0.07, x0 - 0.02, y + s + 0.07, z)
            add_box(bm_f, x0 - 0.22, y - 0.07, z + s, x0 - 0.02, y + s + 0.07, z + s + 0.07)
    mesh_obj(ctx, "ventanas_bloque", bm_w, "ventana_heroe")
    mesh_obj(ctx, "marcos_bloque", bm_f, "acero_grafito")
    # Primer piso: vidrio retranqueado y pórtico de columnas HEB a la vista, viga de transferencia.
    box(ctx, "vidrio_pb", x0 + 1.2, y0 + 1.4, 0.16, x1 - 1.2, y1 - 1.2, base - 0.6, "ventana_heroe")
    bm = bmesh.new()
    for x in (x0 + 1.4, -2.0, 2.0, x1 - 1.4):
        for y in (y0 + 0.4, y1 - 0.4):
            add_box(bm, x - 0.16, y - 0.16, 0.16, x + 0.16, y + 0.16, base)
            add_box(bm, x - 0.02, y - 0.16, 0.16, x + 0.02, y + 0.16, base)
    add_box(bm, x0 + 0.6, y0, base - 0.8, x1 - 0.6, y0 + 0.5, base)
    mesh_obj(ctx, "porticos_heb", bm, "acero_grafito")
    # Canal de agua de Salmona en el andén, con borde de ladrillo.
    box(ctx, "canal_borde", -4.5, -1.6, 0.16, 4.5, -0.7, 0.34, "ladrillo_salmona")
    box(ctx, "canal_agua", -4.35, -1.45, 0.16, 4.35, -0.85, 0.30, "agua")
    # Corona: pérgola de acero en la cubierta.
    bm = bmesh.new()
    for x in [x0 + 2 + i * 0.7 for i in range(12)]:
        add_box(bm, x, y0 + 1.5, H + 2.2, x + 0.08, y1 - 1.5, H + 2.45)
    for x in (x0 + 2, x1 - 2):
        for y in (y0 + 1.5, y1 - 1.5):
            add_box(bm, x - 0.1, y - 0.1, H, x + 0.1, y + 0.1, H + 2.2)
    mesh_obj(ctx, "pergola", bm, "acero_grafito")
    tree(ctx, 2.0, y0 + 5, h=H + 3.2, r=1.6)
    traffic_light(ctx, -8.2, STREET[1] + 0.35)
    return lot, {"target": (0, 5, 11.0), "height": H}


def concept_terrazas(ctx):
    """Cajas de acero apiladas y desplazadas, con muros de ladrillo, vidrio de piso a techo y terrazas verdes."""
    lot = (-6.0, 6.0)
    stack = [(-4.6, 4.4, 1.2, 10.5, 0.16, 3.6), (-5.2, 2.8, 0.2, 9.8, 3.6, 6.8), (-2.4, 5.2, 1.6, 10.8, 6.8, 10.0),
             (-4.8, 3.0, 0.4, 9.6, 10.0, 13.2), (-1.6, 4.6, 2.4, 10.4, 13.2, 16.4), (-3.6, 1.8, 3.2, 9.4, 16.4, 19.4)]
    for k, (x0, x1, y0, y1, z0, z1) in enumerate(stack):
        bm_s = bmesh.new()
        t = 0.22
        # Pórtico de acero: columnas en las esquinas y vigas perimetrales.
        for x in (x0, x1):
            for y in (y0, y1):
                add_box(bm_s, x - t / 2, y - t / 2, z0, x + t / 2, y + t / 2, z1)
        for z in (z0, z1 - 0.35):
            add_box(bm_s, x0 - t / 2, y0 - t / 2, z, x1 + t / 2, y0 + t / 2, z + 0.35)
            add_box(bm_s, x0 - t / 2, y1 - t / 2, z, x1 + t / 2, y1 + t / 2, z + 0.35)
            add_box(bm_s, x0 - t / 2, y0, z, x0 + t / 2, y1, z + 0.35)
            add_box(bm_s, x1 - t / 2, y0, z, x1 + t / 2, y1, z + 0.35)
        mesh_obj(ctx, f"portico_{k}", bm_s, "acero_grafito")
        box(ctx, f"losa_{k}", x0, y0, z1 - 0.35, x1, y1, z1 - 0.05, "concreto")
        # Ladrillo en los costados y en la mitad de la fachada; vidrio en el resto.
        box(ctx, f"muro_l_{k}", x0 + 0.1, y0 + 0.1, z0, x0 + 0.35, y1 - 0.1, z1 - 0.35, "ladrillo_salmona")
        box(ctx, f"muro_r_{k}", x1 - 0.35, y0 + 0.1, z0, x1 - 0.1, y1 - 0.1, z1 - 0.35, "ladrillo_salmona")
        split = x0 + (x1 - x0) * (0.38 if k % 2 else 0.62)
        if k % 2:
            box(ctx, f"muro_f_{k}", x0 + 0.1, y0 + 0.4, z0, split, y0 + 0.65, z1 - 0.35, "ladrillo_salmona")
            box(ctx, f"vidrio_f_{k}", split, y0 + 0.5, z0, x1 - 0.1, y0 + 0.58, z1 - 0.35, "ventana_heroe")
        else:
            box(ctx, f"vidrio_f_{k}", x0 + 0.1, y0 + 0.5, z0, split, y0 + 0.58, z1 - 0.35, "ventana_heroe")
            box(ctx, f"muro_f_{k}", split, y0 + 0.4, z0, x1 - 0.1, y0 + 0.65, z1 - 0.35, "ladrillo_salmona")
        # Diagonal de arriostramiento a la vista en el vidrio.
        a = Vector((split if k % 2 else x0 + 0.2, y0 + 0.2, z0 + 0.1))
        b = Vector((x1 - 0.2 if k % 2 else split, y0 + 0.2, z1 - 0.4))
        curve(ctx, f"diagonal_{k}", [tuple(a), tuple(b)], 0.08, "acero_grafito")
        # Jardinera en la terraza que deja la caja de arriba.
        if k + 1 < len(stack):
            nx0, nx1, ny0, ny1 = stack[k + 1][:4]
            if ny0 > y0 + 0.8:
                box(ctx, f"jardinera_{k}", x0 + 0.3, y0 - 0.1, z1 - 0.05, x1 - 0.3, y0 + 0.6, z1 + 0.55, "acero_grafito")
                bm = bmesh.new()
                for i in range(int((x1 - x0) / 0.5)):
                    xx = x0 + 0.5 + i * 0.5
                    v = bmesh.ops.create_icosphere(bm, subdivisions=2, radius=ctx.rng.uniform(0.3, 0.55), matrix=Matrix.Translation((xx, y0 + 0.25, z1 + 0.6)))["verts"]
                    for vv in v:
                        vv.co += (vv.co - Vector((xx, y0 + 0.25, z1 + 0.6))) * 0.3 * noise.noise(vv.co * 2)
                mesh_obj(ctx, f"plantas_{k}", bm, "follaje", uv=None, smooth=True)
    tree(ctx, -3.0, 6.0, h=22.5, r=1.5)
    return lot, {"target": (0, 5, 10.0), "height": 19.4}


def concept_portal(ctx):
    """Pórtico gigante de acero forrado en ladrillo, con una casa de vidrio colgada y garaje abajo."""
    lot = (-7.5, 7.5)
    X0, X1, Y0, Y1, H = -6.6, 6.6, 2.0, 12.0, 12.6
    leg, beam = 1.3, 1.9
    for nm, a, b in (("pata_izq", X0, X0 + leg), ("pata_der", X1 - leg, X1)):
        box(ctx, nm, a, Y0, 0.16, b, Y1, H - beam, "ladrillo_salmona")
    box(ctx, "dintel", X0, Y0, H - beam, X1, Y1, H, "ladrillo_salmona")
    # Canto de acero que dibuja el pórtico.
    bm = bmesh.new()
    t = 0.12
    add_box(bm, X0 - t, Y0 - t, 0.16, X0, Y1, H + t)
    add_box(bm, X1, Y0 - t, 0.16, X1 + t, Y1, H + t)
    add_box(bm, X0 - t, Y0 - t, H, X1 + t, Y1, H + t)
    add_box(bm, X0 - t, Y0 - t, 0.16, X0 + leg + t, Y0, 0.4)
    mesh_obj(ctx, "canto_acero", bm, "acero_grafito")
    # Casa de vidrio colgada de la viga: tensores de acero, losa de acero y montantes.
    cx0, cx1, cz0, cz1 = X0 + leg + 0.6, X1 - leg - 0.6, 4.2, H - beam - 0.9
    box(ctx, "losa_casa", cx0, Y0 + 0.8, cz0 - 0.35, cx1, Y1 - 0.8, cz0, "acero_grafito")
    box(ctx, "techo_casa", cx0, Y0 + 0.8, cz1, cx1, Y1 - 0.8, cz1 + 0.3, "acero_grafito")
    box(ctx, "vidrio_casa", cx0 + 0.1, Y0 + 1.0, cz0, cx1 - 0.1, Y1 - 1.0, cz1, "ventana_heroe")
    bm = bmesh.new()
    for i in range(9):
        x = cx0 + 0.05 + i * (cx1 - cx0 - 0.1) / 8
        add_box(bm, x - 0.05, Y0 + 0.9, cz0, x + 0.05, Y0 + 1.0, cz1)
    mesh_obj(ctx, "montantes", bm, "acero_grafito")
    for x in (cx0 + 0.4, cx1 - 0.4):
        for y in (Y0 + 1.1, Y1 - 1.1):
            curve(ctx, f"tensor_{x:.0f}_{y:.0f}", [(x, y, cz1 + 0.3), (x, y, H - beam)], 0.04, "acero_grafito")
    # Escalera de acero rojo que sube a la casa.
    bm = bmesh.new()
    for i in range(14):
        add_box(bm, cx1 - 1.5, Y0 + 2.2 + i * 0.32, 0.16 + i * 0.29, cx1 - 0.4, Y0 + 2.5 + i * 0.32, 0.22 + i * 0.29)
    add_box(bm, cx1 - 1.55, Y0 + 2.2, 0.16, cx1 - 1.5, Y0 + 6.7, 4.2)
    mesh_obj(ctx, "escalera", bm, "acero_rojo")
    # Garaje y jardín al frente.
    box(ctx, "piso_garaje", X0 + leg, Y0, 0.16, X1 - leg, Y1, 0.2, "concreto")
    box(ctx, "jardin", lot[0], FRONT + 0.3, 0.16, lot[1], Y0, 0.3, "pasto")
    car(ctx, -1.2, 6.8, rot=math.pi / 2 + 0.05, mat="carro_blanco")
    tree(ctx, X0 - 0.2, 0.9, h=6.5, r=1.8)
    tree(ctx, X1 + 0.4, 1.0, h=5.5, r=1.4, mat="follaje_oscuro")
    return lot, {"target": (0, 6, 6.8), "height": H}


# ---------------------------------------------------------------------------------------------
# Escena, luz y cámara

CONTEXTO = {
    "faro": (["colonial", "colonial", "pañete_ocre", "pañete_azul", "pañete_verde", "colonial", "ladrillo"], (2, 3)),
    "silo": (["ladrillo", "ladrillo", "ladrillo", "pañete_blanco_gris", "pañete_rosa"], (2, 4)),
    "bloque": (["ladrillo", "pañete_blanco_gris", "ladrillo", "pañete_amarillo", "ladrillo"], (3, 6)),
    "terrazas": (["ladrillo", "ladrillo", "pañete_blanco_gris", "colonial", "pañete_ocre"], (2, 4)),
    "portal": (["ladrillo", "ladrillo", "pañete_blanco_gris", "pañete_verde"], (2, 3)),
}


def world(sun_el=34, sun_az=-35, sky=0.55, haze=1.0):
    sc = bpy.context.scene
    w = bpy.data.worlds.new("Cielo Bogotá")
    sc.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    sky_n = nt.nodes.new("ShaderNodeTexSky")
    for t in ("MULTIPLE_SCATTERING", "NISHITA", "SINGLE_SCATTERING", "HOSEK_WILKIE"):
        try:
            sky_n.sky_type = t
            break
        except TypeError:
            continue
    if hasattr(sky_n, "sun_elevation"):
        sky_n.sun_elevation = math.radians(sun_el)
        sky_n.sun_rotation = math.radians(sun_az)
        sky_n.sun_disc = False
        if hasattr(sky_n, "altitude"):
            sky_n.altitude = 2600  # Bogotá: 2.600 m sobre el nivel del mar
        if hasattr(sky_n, "air_density"):
            sky_n.air_density = 1.0
            sky_n.aerosol_density = 3.5 * haze
    # Nubes de la sabana: se mezcla el cielo físico con un gris nublado según ruido.
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 1.2; nz.inputs["Detail"].default_value = 4; nz.inputs["Roughness"].default_value = 0.5
    rmp = nt.nodes.new("ShaderNodeMapRange"); rmp.inputs["From Min"].default_value = 0.42; rmp.inputs["From Max"].default_value = 0.62
    mx = nt.nodes.new("ShaderNodeMix"); mx.data_type = "RGBA"
    sock(mx.inputs, "B", "RGBA").default_value = (0.75, 0.77, 0.8, 1)
    rmp.inputs["To Max"].default_value = 0.55
    bg = nt.nodes.new("ShaderNodeBackground"); bg.inputs["Strength"].default_value = sky
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(tc.outputs["Generated"], nz.inputs["Vector"])
    nt.links.new(nz.outputs["Fac"], rmp.inputs["Value"])
    nt.links.new(rmp.outputs[0], mx.inputs[0])
    nt.links.new(sky_n.outputs["Color"], sock(mx.inputs, "A", "RGBA"))
    nt.links.new(sock(mx.outputs, "Result", "RGBA"), bg.inputs["Color"])
    nt.links.new(bg.outputs[0], out.inputs[0])
    sun = bpy.data.lights.new("sol", "SUN")
    sun.energy = 5.0
    sun.angle = math.radians(4)
    sun.color = (1.0, 0.93, 0.84)
    ob = bpy.data.objects.new("sol", sun)
    ob.rotation_euler = (math.radians(90 - sun_el), 0, math.radians(sun_az))
    sc.collection.objects.link(ob)


def camera(ctx, loc, target, lens=26, shift_y=0.0):
    cam = bpy.data.cameras.new("cam")
    cam.lens = lens
    cam.sensor_fit = "VERTICAL"
    cam.sensor_height = 36
    cam.shift_y = shift_y
    cam.clip_end = 6000
    ob = bpy.data.objects.new("cam", cam)
    ob.location = loc
    d = Vector(target) - Vector(loc)
    ob.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    ctx.col.objects.link(ob)
    bpy.context.scene.camera = ob
    return ob


def build(concepto, seed=7):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    ctx = Ctx(seed)
    materials(ctx)
    base = "faro" if concepto == "cenital" else concepto
    lot, info = {"faro": concept_faro, "silo": concept_silo, "bloque": concept_bloque, "terrazas": concept_terrazas, "portal": concept_portal}[base](ctx)
    styles, floors = CONTEXTO[base]
    zebra = -11.5 if base != "bloque" else -12.5
    street(ctx, zebra_x=zebra)
    neighbors_row(ctx, lot, styles, floors)
    opposite_row(ctx, styles)
    far_city(ctx)
    mountains(ctx, cx=-60 if base in ("terrazas", "faro") else 80)
    pole_and_wires(ctx, [-30, -9.5 if base != "bloque" else -8.8, 13, 36])
    rng = ctx.rng
    for x in (-24, 19, 31):
        tree(ctx, x, -1.4, h=rng.uniform(6, 8.5), r=rng.uniform(1.8, 2.4), mat=rng.choice(["follaje", "follaje_oscuro"]))
    car(ctx, -17, -4.4, 0, taxi=True)
    car(ctx, -26 if base in ("silo", "terrazas") else 24, -9.3, math.pi, "carro_rojo")
    if base != "portal":
        car(ctx, 15, -4.3, 0.0, "carro_azul")
    cy = info["target"][1]
    if concepto == "cenital":
        world(sun_el=40, sun_az=-30)
        camera(ctx, (-14, -22, 27), (-2.5, 0.0, 5.0), lens=24)
    else:
        world(sun_el=34, sun_az=-35 if base != "silo" else 25)
        h = info["height"]
        tx, ty, tz = info["target"]
        # Cámara a la altura del peatón en el andén de enfrente, en diagonal para ver fachada y vecinos;
        # verticales rectas (cámara nivelada + desplazamiento óptico en vez de inclinarla).
        side = {"faro": -9.0, "silo": 8.0, "bloque": -10.0, "terrazas": 9.0, "portal": -8.0}[base]
        eye = 4.2
        loc = Vector((tx + side, -14.0, eye))
        flat = Vector((tx, ty, eye)) - loc
        lens = 18 if h > 18 else 20
        cam = camera(ctx, tuple(loc), tuple(loc + flat), lens=lens)
        half = math.atan(18 / lens)
        need = math.atan((tz - eye) / flat.length)
        cam.data.shift_y = min(0.5, math.tan(need) / (2 * math.tan(half)))
    return ctx


def render(out, samples=96, w=1080, h=1920):
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    try:
        sc.cycles.denoiser = "OPENIMAGEDENOISE"
    except TypeError:
        pass
    sc.cycles.max_bounces = 6
    sc.cycles.diffuse_bounces = 3
    sc.cycles.glossy_bounces = 3
    sc.cycles.transmission_bounces = 4
    sc.cycles.caustics_reflective = sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 1.0
    sc.cycles.use_adaptive_sampling = True
    for look in ("AgX - Medium High Contrast", "AgX - Base Contrast", "None"):
        try:
            sc.view_settings.view_transform = "AgX"
            sc.view_settings.look = look
            break
        except TypeError:
            continue
    sc.view_settings.exposure = 0.0
    sc.render.resolution_x, sc.render.resolution_y = w, h
    sc.render.resolution_percentage = 100
    sc.render.filepath = out
    sc.render.image_settings.file_format = "PNG"
    bpy.ops.render.render(write_still=True)


def main(argv):
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = argv[1:]
    p = argparse.ArgumentParser(description="AceroStudio · Bogotá futuro")
    p.add_argument("--concepto", default="faro", choices=list(CONCEPTOS) + ["todos"])
    p.add_argument("--salida", default="")
    p.add_argument("--carpeta", default=".")
    p.add_argument("--muestras", type=int, default=96)
    p.add_argument("--ancho", type=int, default=1080)
    p.add_argument("--alto", type=int, default=1920)
    p.add_argument("--blend", action="store_true", help="guardar también el .blend")
    a = p.parse_args(argv)
    todos = list(CONCEPTOS) if a.concepto == "todos" else [a.concepto]
    for c in todos:
        out = a.salida if (a.salida and len(todos) == 1) else os.path.join(a.carpeta, f"bogota_{c}.png")
        build(c)
        if a.blend:
            bpy.ops.wm.save_as_mainfile(filepath=os.path.splitext(out)[0] + ".blend")
        render(os.path.abspath(out), a.muestras, a.ancho, a.alto)
        print("✓", c, "→", out, "·", CONCEPTOS[c])


if __name__ == "__main__":
    main(sys.argv)
