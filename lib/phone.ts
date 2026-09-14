export function normalizeUsPhone(value: string): string | null {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export function formatPhoneDisplay(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (ten.length !== 10) return e164;
  return `${ten.slice(0, 3)}-${ten.slice(3, 6)}-${ten.slice(6)}`;
}
