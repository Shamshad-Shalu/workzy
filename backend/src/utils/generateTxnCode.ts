export function generateTxnCode(prefix: "DSP" | "BKG" | "TXN") {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();

  return `${prefix}-${y}${m}${day}-${rand}`;
}
