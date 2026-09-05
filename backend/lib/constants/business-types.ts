// Official AfriCart Business Types - Single Source of Truth

export interface OfficialBusinessType {
  name: string;
  value: string;
  description: string;
}

export const OFFICIAL_BUSINESS_TYPES: OfficialBusinessType[] = [
  {
    name: "Indivual",
    value: "Indivual",
    description: "Registered or unregistered single business owner.",
  },
  {
    name: "Paternship",
    value: "Paternship",
    description: "Partnership business entity owned by two or more partners.",
  },
];

export const OFFICIAL_BUSINESS_TYPE_VALUES = OFFICIAL_BUSINESS_TYPES.map((b) => b.value);

export function isValidBusinessType(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const clean = value.trim();
  return OFFICIAL_BUSINESS_TYPE_VALUES.includes(clean);
}

export function sanitizeBusinessType(value?: string | null): string {
  if (!value) return "Indivual";
  const clean = value.trim();
  if (clean === "Paternship" || clean.toLowerCase().includes("patern") || clean.toLowerCase().includes("partner")) {
    return "Paternship";
  }
  return "Indivual";
}
