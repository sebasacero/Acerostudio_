import { requireNativeModule, requireNativeViewManager } from "expo-modules-core";
import type { ComponentType, Ref } from "react";
import type { ViewProps } from "react-native";

export interface SpaceMeasurement {
  floorAreaM2: number;
  wallAreaM2: number;
  ceilingAreaM2: number;
  widthM: number;
  depthM: number;
  heightM: number;
  faceCount: number;
}

export interface ScanResult extends SpaceMeasurement {
  photoUri: string;
  meshUri: string;
}

export interface LidarScannerViewRef {
  finish(): Promise<ScanResult>;
  reset(): Promise<void>;
}

export type LidarScannerViewProps = ViewProps & {
  ref?: Ref<LidarScannerViewRef>;
  onProgress?: (e: { nativeEvent: SpaceMeasurement }) => void;
  onError?: (e: { nativeEvent: { message: string } }) => void;
};

const native = requireNativeModule<{ isSupported(): boolean }>("LidarScanner");

export const isLidarSupported = (): boolean => native.isSupported();

export const LidarScannerView: ComponentType<LidarScannerViewProps> = requireNativeViewManager("LidarScanner");
