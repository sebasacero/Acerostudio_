import { WORLD_LAT_TOP } from "./data/world-map.ts";

export const BOGOTA = { lat: 4.711, lng: -74.072 };

export function project(lat: number, lng: number) {
  return { x: lng + 180, y: WORLD_LAT_TOP - lat };
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function arcPath(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  const a = project(from.lat, from.lng);
  const b = project(to.lat, to.lng);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const cy = my - Math.min(40, len * 0.28);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${mx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}
