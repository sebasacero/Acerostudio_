Pod::Spec.new do |s|
  s.name           = 'LidarScanner'
  s.version        = '0.1.0'
  s.summary        = 'Escaneo de espacios con LiDAR (ARKit) para AceroStudio'
  s.author         = 'AceroStudio'
  s.homepage       = 'https://www.acerostudio.com'
  s.license        = 'MIT'
  s.platforms      = { :ios => '16.0' }
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.frameworks = 'ARKit', 'RealityKit'
  s.source_files = '**/*.swift'
end
