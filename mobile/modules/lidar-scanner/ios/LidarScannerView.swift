import ARKit
import ExpoModulesCore
import RealityKit

// Vista de escaneo: ARKit reconstruye la malla del espacio con el LiDAR y
// clasifica cada cara (piso, muro, techo...). Con eso medimos el espacio sin
// que el usuario tome medidas, y al terminar exportamos foto + malla OBJ.
class LidarScannerView: ExpoView, ARSessionDelegate {
  private let arView = ARView(frame: .zero)
  private var meshAnchors: [UUID: ARMeshAnchor] = [:]
  private var lastProgressAt = Date.distantPast

  let onProgress = EventDispatcher()
  let onError = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    addSubview(arView)
    arView.session.delegate = self
    arView.debugOptions = [.showSceneUnderstanding]
    arView.environment.sceneUnderstanding.options = [.occlusion]
    start()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    arView.frame = bounds
  }

  private func start() {
    guard ARWorldTrackingConfiguration.supportsSceneReconstruction(.meshWithClassification) else {
      onError(["message": "Este dispositivo no tiene sensor LiDAR."])
      return
    }
    let config = ARWorldTrackingConfiguration()
    config.sceneReconstruction = .meshWithClassification
    config.planeDetection = [.horizontal, .vertical]
    config.environmentTexturing = .automatic
    arView.session.run(config, options: [.resetTracking, .removeExistingAnchors, .resetSceneReconstruction])
  }

  func reset() {
    meshAnchors.removeAll()
    start()
  }

  // MARK: - ARSessionDelegate

  func session(_ session: ARSession, didAdd anchors: [ARAnchor]) {
    track(anchors)
  }

  func session(_ session: ARSession, didUpdate anchors: [ARAnchor]) {
    track(anchors)
  }

  func session(_ session: ARSession, didRemove anchors: [ARAnchor]) {
    for a in anchors where a is ARMeshAnchor { meshAnchors.removeValue(forKey: a.identifier) }
  }

  func session(_ session: ARSession, didFailWithError error: Error) {
    onError(["message": error.localizedDescription])
  }

  private func track(_ anchors: [ARAnchor]) {
    var changed = false
    for a in anchors {
      if let m = a as? ARMeshAnchor {
        meshAnchors[m.identifier] = m
        changed = true
      }
    }
    // Las mallas se actualizan muchas veces por segundo; reportamos como mucho 2 veces/s.
    guard changed, Date().timeIntervalSince(lastProgressAt) > 0.5 else { return }
    lastProgressAt = Date()
    onProgress(measure().asDictionary())
  }

  // MARK: - Medición

  struct Measurement {
    var floorAreaM2: Double = 0
    var wallAreaM2: Double = 0
    var ceilingAreaM2: Double = 0
    var widthM: Double = 0
    var depthM: Double = 0
    var heightM: Double = 0
    var faceCount: Int = 0

    func asDictionary() -> [String: Any] {
      [
        "floorAreaM2": floorAreaM2, "wallAreaM2": wallAreaM2, "ceilingAreaM2": ceilingAreaM2,
        "widthM": widthM, "depthM": depthM, "heightM": heightM, "faceCount": faceCount,
      ]
    }
  }

  private func measure() -> Measurement {
    var m = Measurement()
    var minP = SIMD3<Float>(repeating: .greatestFiniteMagnitude)
    var maxP = SIMD3<Float>(repeating: -.greatestFiniteMagnitude)

    for anchor in meshAnchors.values {
      let g = anchor.geometry
      let transform = anchor.transform
      let vertices = g.vertices
      let faces = g.faces
      let classification = g.classification

      func vertex(_ i: Int) -> SIMD3<Float> {
        let p = vertices.buffer.contents().advanced(by: vertices.offset + vertices.stride * i)
        let v = p.assumingMemoryBound(to: SIMD3<Float>.self).pointee
        let w = transform * SIMD4<Float>(v, 1)
        return SIMD3<Float>(w.x, w.y, w.z)
      }

      m.faceCount += faces.count
      for f in 0..<faces.count {
        let idx = faces.buffer.contents().advanced(by: f * faces.indexCountPerPrimitive * faces.bytesPerIndex)
        let i = idx.assumingMemoryBound(to: UInt32.self)
        let a = vertex(Int(i[0])), b = vertex(Int(i[1])), c = vertex(Int(i[2]))
        minP = simd_min(minP, simd_min(a, simd_min(b, c)))
        maxP = simd_max(maxP, simd_max(a, simd_max(b, c)))
        let area = Double(simd_length(simd_cross(b - a, c - a)) / 2)

        var cls = ARMeshClassification.none
        if let classification {
          let p = classification.buffer.contents().advanced(by: classification.offset + classification.stride * f)
          cls = ARMeshClassification(rawValue: Int(p.assumingMemoryBound(to: UInt8.self).pointee)) ?? .none
        }
        switch cls {
        case .floor: m.floorAreaM2 += area
        case .wall: m.wallAreaM2 += area
        case .ceiling: m.ceilingAreaM2 += area
        default: break
        }
      }
    }

    if m.faceCount > 0 {
      let size = maxP - minP
      m.widthM = Double(size.x)
      m.heightM = Double(size.y)
      m.depthM = Double(size.z)
    }
    return m
  }

  // MARK: - Exportación

  func finish(promise: Promise) {
    let measurement = measure()
    guard measurement.faceCount > 0 else {
      promise.reject("E_EMPTY_SCAN", "Todavía no hay superficie escaneada. Mueve el teléfono despacio por el espacio.")
      return
    }
    let dir = FileManager.default.temporaryDirectory
    let stamp = Int(Date().timeIntervalSince1970)
    let meshURL = dir.appendingPathComponent("espacio_\(stamp).obj")
    let photoURL = dir.appendingPathComponent("espacio_\(stamp).jpg")

    do {
      try exportOBJ(to: meshURL)
    } catch {
      promise.reject("E_EXPORT", "No se pudo exportar la malla: \(error.localizedDescription)")
      return
    }

    arView.snapshot(saveToHDR: false) { image in
      guard let image, let data = image.jpegData(compressionQuality: 0.85) else {
        promise.reject("E_SNAPSHOT", "No se pudo capturar la foto del espacio.")
        return
      }
      do {
        try data.write(to: photoURL)
      } catch {
        promise.reject("E_SNAPSHOT", error.localizedDescription)
        return
      }
      var result = measurement.asDictionary()
      result["photoUri"] = photoURL.absoluteString
      result["meshUri"] = meshURL.absoluteString
      promise.resolve(result)
    }
  }

  private func exportOBJ(to url: URL) throws {
    var out = "# AceroStudio · escaneo LiDAR · metros\n"
    var offset = 1
    for anchor in meshAnchors.values {
      let g = anchor.geometry
      let v = g.vertices
      for i in 0..<v.count {
        let p = v.buffer.contents().advanced(by: v.offset + v.stride * i).assumingMemoryBound(to: SIMD3<Float>.self).pointee
        let w = anchor.transform * SIMD4<Float>(p, 1)
        out += "v \(w.x) \(w.y) \(w.z)\n"
      }
      let f = g.faces
      for i in 0..<f.count {
        let idx = f.buffer.contents().advanced(by: i * f.indexCountPerPrimitive * f.bytesPerIndex).assumingMemoryBound(to: UInt32.self)
        out += "f \(Int(idx[0]) + offset) \(Int(idx[1]) + offset) \(Int(idx[2]) + offset)\n"
      }
      offset += v.count
    }
    try out.write(to: url, atomically: true, encoding: .utf8)
  }
}
