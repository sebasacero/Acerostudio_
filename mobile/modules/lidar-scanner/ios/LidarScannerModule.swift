import ARKit
import ExpoModulesCore

public class LidarScannerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("LidarScanner")

    Function("isSupported") { () -> Bool in
      ARWorldTrackingConfiguration.supportsSceneReconstruction(.meshWithClassification)
    }

    View(LidarScannerView.self) {
      Events("onProgress", "onError")

      AsyncFunction("finish") { (view: LidarScannerView, promise: Promise) in
        view.finish(promise: promise)
      }

      AsyncFunction("reset") { (view: LidarScannerView) in
        view.reset()
      }
    }
  }
}
