# AceroStudio → SketchUp
# Importa un modelo .acero-solids.json (exportado desde AceroStudio Studio o el servidor MCP):
# un grupo por elemento, etiquetas (capas) por nivel y materiales con la paleta de AceroStudio.
#
# Uso rápido: Ventana › Consola de Ruby › load "C:/ruta/acerostudio_sketchup.rb"
# Como extensión: copia este archivo en la carpeta Plugins de SketchUp; queda en
# Extensiones › AceroStudio › Importar modelo (.acero-solids.json)…
require 'sketchup.rb'
require 'json'

module AceroStudio
  module Importer
    M_TO_IN = 39.37007874015748

    def self.pt(x, y, z)
      Geom::Point3d.new(x * M_TO_IN, y * M_TO_IN, z * M_TO_IN)
    end

    def self.material(model, key, m)
      name = "AS_#{key}"
      mat = model.materials[name] || model.materials.add(name)
      hex = m['color'].delete('#')
      mat.color = Sketchup::Color.new(hex[0, 2].to_i(16), hex[2, 2].to_i(16), hex[4, 2].to_i(16))
      mat.alpha = m['opacity'].to_f if m['opacity'] && m['opacity'].to_f < 1
      mat
    end

    # Esquinas en planta (x, y) de un sólido y su cota inferior y altura.
    def self.footprint(s)
      if s['shape'] == 'box'
        cx, cy, cz = s['center']
        l, t, h = s['size']
        c = Math.cos(s['rotZ'])
        n = Math.sin(s['rotZ'])
        pts = [[-l / 2, -t / 2], [l / 2, -t / 2], [l / 2, t / 2], [-l / 2, t / 2]].map do |a, b|
          [cx + a * c - b * n, cy + a * n + b * c]
        end
        [pts, cz - h / 2, h]
      else
        [s['points'], s['z'], s['height']]
      end
    end

    def self.import(path)
      data = JSON.parse(File.read(path, encoding: 'UTF-8'))
      raise 'El archivo no es un .acero-solids.json de AceroStudio' unless data['format'] == 'acero-solids'

      model = Sketchup.active_model
      model.start_operation('Importar AceroStudio', true)
      mats = data['materials'].each_with_object({}) { |(k, m), h| h[k] = material(model, k, m) }
      tags = {}
      data['levels'].each do |lv|
        tags[lv['name']] = model.layers[lv['name']] || model.layers.add(lv['name'])
      end
      root = model.active_entities.add_group
      root.name = data['project'] || 'AceroStudio'
      data['solids'].each_with_index do |s, i|
        pts, z0, h = footprint(s)
        next if h <= 0 || pts.length < 3

        g = root.entities.add_group
        g.name = [s['kind'], s['name']].reject { |v| v.nil? || v.empty? }.join(' ')
        g.layer = tags[s['level']] if tags[s['level']]
        face = g.entities.add_face(pts.map { |x, y| pt(x, y, z0) })
        next unless face

        face.reverse! if face.normal.z < 0
        face.pushpull(h * M_TO_IN)
        g.material = mats[s['material']]
        g.set_attribute('acerostudio', 'element', s['element'])
        g.set_attribute('acerostudio', 'type', s['type'])
      rescue StandardError => e
        puts "AceroStudio: se omitió el sólido #{i} (#{e.message})"
      end
      model.commit_operation
      model.active_view.zoom_extents
      root
    end

    unless file_loaded?(__FILE__)
      menu = UI.menu('Extensions').add_submenu('AceroStudio')
      menu.add_item('Importar modelo (.acero-solids.json)…') do
        path = UI.openpanel('Modelo de AceroStudio', '', 'AceroStudio|*.json||')
        begin
          import(path) if path
        rescue StandardError => e
          UI.messagebox("AceroStudio: #{e.message}")
        end
      end
      file_loaded(__FILE__)
    end
  end
end
