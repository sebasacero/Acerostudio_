export type Unit = "ml" | "m2" | "und";

export type Range = { low: number; high: number };

export type Confidence = "alta" | "media" | "baja";

export interface Material {
  id: string;
  name: string;
  short: string;
  materialPerKg: Range;
  installedPerKg: Range;
  finishIds: string[];
  notes: string;
  confidence: Confidence;
}

export interface Finish {
  id: string;
  name: string;
  unit: "m2" | "kg";
  price: Range;
  description: string;
  durabilityYears: Range;
  maintenance: string;
  bestFor: string;
  confidence: Confidence;
}

export interface Complement {
  id: string;
  name: string;
  unit: string;
  price: Range;
  notes: string;
}

export interface WorkComplement {
  id: string;
  qtyPerUnit: number;
  optional: boolean;
}

export interface Work {
  id: string;
  name: string;
  category: string;
  unit: Unit;
  description: string;
  quantity: { default: number; min: number; max: number; step: number };
  structuralSystem: string;
  profiles: string[];
  connectionIds: string[];
  materialIds: string[];
  defaultMaterialId: string;
  defaultFinishId: string;
  kgPerUnit: Range;
  fabricationGrade: number;
  mobilization: number;
  finishAreaPerUnit: number;
  complements: WorkComplement[];
  fireProtectionApplies: boolean;
  nsr10: string;
  maintenance: string;
  fabricationDays: Range;
  weightRationale: string;
  benchmarkPerUnit: Range;
}

export interface Tradition {
  id: string;
  name: string;
  region: string;
  countries: string[];
  cities: string[];
  era: string;
  philosophy: string;
  steelLanguage: string;
  signatureDetails: string[];
  materials: string[];
  preferredMaterialIds: string[];
  preferredFinishIds: string[];
  palette: { name: string; hex: string }[];
  architects: string[];
  works: { name: string; architect: string; city: string; year: string }[];
  promptKeywords: string;
  complexityFactor: number;
  complexityRationale: string;
  lat: number;
  lng: number;
}

export interface Profile {
  family: string;
  designation: string;
  kgPerM: number;
  use: string;
}

export interface Connection {
  id: string;
  name: string;
  description: string;
  whenToUse: string;
}

export interface Fees {
  ivaPct: number;
  designFeePct: number;
  contingencyPct: number;
  bandLowPct: number;
  bandHighPct: number;
}
