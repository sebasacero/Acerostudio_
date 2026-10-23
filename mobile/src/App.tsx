import { useRef, useState } from "react";
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  isLidarSupported,
  LidarScannerView,
  type LidarScannerViewRef,
  type ScanResult,
  type SpaceMeasurement,
} from "../modules/lidar-scanner";
import { generateRender, saveQuote, uploadScan, WHATSAPP_NUMBER } from "./lib/backend";
import { buildPrompt, classifySpace, describeSpace, SCALE_LABEL, SUGGESTED_WORKS } from "./lib/space";

const STYLES = ["Industrial", "Minimalista", "Cálido / Madera", "Escandinavo", "Tropical"];
type Step = "scan" | "style" | "generating" | "result";

const C = { bg: "#0a0806", panel: "#12100d", fg: "#f4f1ec", muted: "#a8a099", accent: "#00e5ff", border: "rgba(255,255,255,0.14)" };

export default function App() {
  const scanner = useRef<LidarScannerViewRef>(null);
  const [step, setStep] = useState<Step>("scan");
  const [live, setLive] = useState<SpaceMeasurement | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [renderUrl, setRenderUrl] = useState<string | null>(null);
  const [urls, setUrls] = useState<{ photoUrl: string; meshUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isLidarSupported()) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.fig}>FIG. 00 — LIDAR</Text>
        <Text style={s.title}>Este iPhone no tiene sensor LiDAR</Text>
        <Text style={s.muted}>Necesitas un iPhone Pro (12 Pro o posterior). Puedes usar el rediseño con foto en acerostudio.com.</Text>
      </View>
    );
  }

  async function finishScan() {
    setError(null);
    try {
      const r = await scanner.current!.finish();
      setScan(r);
      setStep("style");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo terminar el escaneo.");
    }
  }

  async function generate(chosen: string) {
    if (!scan) return;
    setStyle(chosen);
    setStep("generating");
    setError(null);
    try {
      const [uploaded, render] = await Promise.all([
        uploadScan(scan),
        generateRender(scan.photoUri, buildPrompt(scan, chosen)),
      ]);
      setUrls(uploaded);
      setRenderUrl(render);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo salió mal.");
      setStep("style");
    }
  }

  async function quote() {
    if (!scan || !urls || !style) return;
    setError(null);
    try {
      await saveQuote({ style, ...urls, renderUrl, floorAreaM2: scan.floorAreaM2, notes: describeSpace(scan) });
      const msg =
        `Hola equipo de AceroStudio 👋\n\nEscaneé mi espacio con LiDAR: ${describeSpace(scan)}.\n` +
        `Quiero una propuesta en estilo *${style}*.\n\nFoto: ${urls.photoUrl}\nPropuesta: ${renderUrl ?? "-"}\nEscaneo 3D: ${urls.meshUrl}`;
      await Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo enviar la cotización.");
    }
  }

  function restart() {
    setScan(null); setLive(null); setStyle(null); setRenderUrl(null); setUrls(null); setError(null);
    setStep("scan");
    scanner.current?.reset();
  }

  const m = scan ?? live;
  const scale = m ? classifySpace(m) : null;

  return (
    <View style={s.screen}>
      {step === "scan" && (
        <>
          <LidarScannerView
            ref={scanner}
            style={StyleSheet.absoluteFill}
            onProgress={(e) => setLive(e.nativeEvent)}
            onError={(e) => setError(e.nativeEvent.message)}
          />
          <View style={s.corner} pointerEvents="none" />
          <View style={s.hud}>
            <Text style={s.fig}>FIG. 01 — ESCANEO · Bogotá · 2.600 msnm</Text>
            <Text style={s.title}>{live ? describeSpace(live) : "Mueve el teléfono despacio por el espacio"}</Text>
            {live && <Text style={s.muted}>{SCALE_LABEL[classifySpace(live)]} · {live.faceCount.toLocaleString("es-CO")} caras</Text>}
            {error && <Text style={s.error}>{error}</Text>}
            <Pressable style={[s.btn, !live && s.btnOff]} disabled={!live} onPress={finishScan}>
              <Text style={s.btnText}>Terminar escaneo →</Text>
            </Pressable>
          </View>
        </>
      )}

      {step !== "scan" && scan && (
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.fig}>FIG. 02 — TU ESPACIO</Text>
          <Text style={s.title}>{SCALE_LABEL[scale!]}</Text>
          <Text style={s.muted}>{describeSpace(scan)}</Text>
          <Image source={{ uri: renderUrl ?? scan.photoUri }} style={s.photo} />
          {renderUrl && <Text style={s.caption}>FIG. 04 — Propuesta · {style}</Text>}
          {error && <Text style={s.error}>{error}</Text>}

          {step === "style" && (
            <>
              <Text style={[s.fig, { marginTop: 20 }]}>FIG. 03 — ELIGE UN ESTILO</Text>
              <View style={s.chips}>
                {STYLES.map((x) => (
                  <Pressable key={x} style={s.chip} onPress={() => generate(x)}>
                    <Text style={s.chipText}>{x}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {step === "generating" && (
            <View style={[s.center, { paddingVertical: 32 }]}>
              <ActivityIndicator color={C.accent} />
              <Text style={s.muted}>Generando tu propuesta en estilo {style}…</Text>
            </View>
          )}

          {step === "result" && (
            <>
              <Text style={[s.fig, { marginTop: 20 }]}>Obras en acero sugeridas para este espacio</Text>
              <Text style={s.muted}>{SUGGESTED_WORKS[scale!].join(" · ")}</Text>
              <Pressable style={s.btn} onPress={quote}>
                <Text style={s.btnText}>Cotizar por WhatsApp →</Text>
              </Pressable>
              <Pressable style={s.ghost} onPress={() => setStep("style")}>
                <Text style={s.ghostText}>Probar otro estilo</Text>
              </Pressable>
            </>
          )}
          <Pressable style={s.ghost} onPress={restart}>
            <Text style={s.ghostText}>Escanear otro espacio</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  center: { alignItems: "center", justifyContent: "center", padding: 24 },
  content: { padding: 20, paddingTop: 64, gap: 8 },
  hud: { position: "absolute", left: 16, right: 16, bottom: 32, gap: 8, padding: 16, backgroundColor: "rgba(10,8,6,0.85)", borderWidth: 1, borderColor: C.border },
  corner: { position: "absolute", top: 80, left: 24, right: 24, bottom: 220, borderWidth: 1, borderColor: "rgba(0,229,255,0.35)" },
  fig: { color: C.accent, fontFamily: "Menlo", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" },
  title: { color: C.fg, fontSize: 20, fontWeight: "600" },
  muted: { color: C.muted, fontSize: 14 },
  caption: { color: C.accent, fontFamily: "Menlo", fontSize: 10, letterSpacing: 1 },
  error: { color: "#f87171", fontSize: 13 },
  photo: { width: "100%", aspectRatio: 9 / 16, marginTop: 12, backgroundColor: C.panel },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: { borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 8 },
  chipText: { color: C.fg },
  btn: { marginTop: 12, backgroundColor: C.accent, paddingVertical: 14, alignItems: "center" },
  btnOff: { opacity: 0.4 },
  btnText: { color: C.bg, fontWeight: "600" },
  ghost: { marginTop: 8, paddingVertical: 10, alignItems: "center" },
  ghostText: { color: C.muted, fontSize: 13 },
});
