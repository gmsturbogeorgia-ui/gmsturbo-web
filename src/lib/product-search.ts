import type { Product } from "./products";

export type SearchHit = {
  product: Product;
  score: number;
  matched: { field: string; text: string }[];
};

export type SearchToken = string;

function tokenize(q: string): SearchToken[] {
  return q
    .toLowerCase()
    .split(/[\s,/]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function fieldsOf(
  p: Product,
): { field: string; text: string; weight: number }[] {
  const fields: { field: string; text: string; weight: number }[] = [
    { field: "name", text: p.name, weight: 10 },
    { field: "code", text: p.code, weight: 9 },
    { field: "category", text: p.category, weight: 6 },
    { field: "tagline", text: p.tagline, weight: 4 },
    { field: "description", text: p.description, weight: 2 },
    { field: "vehicles", text: p.vehicles.join(" "), weight: 5 },
  ];
  for (const f of p.fitments) {
    fields.push({
      field: "fitment",
      text: `${f.make} ${f.model} ${f.years} ${f.engine}`,
      weight: 5,
    });
  }
  for (const s of p.specs) {
    fields.push({
      field: `spec:${s.label}`,
      text: `${s.label} ${s.value}`,
      weight: 3,
    });
  }
  return fields;
}

export function searchProducts(
  query: string,
  pool: Product[],
): SearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const hits: SearchHit[] = [];
  for (const product of pool) {
    const fields = fieldsOf(product);
    let score = 0;
    const matched: { field: string; text: string }[] = [];

    for (const token of tokens) {
      let tokenScore = 0;
      for (const f of fields) {
        const lower = f.text.toLowerCase();
        const idx = lower.indexOf(token);
        if (idx === -1) continue;
        // Boost: exact word boundary > start of field > substring
        const boundary =
          idx === 0 || /[\s\-/(),]/.test(lower[idx - 1] ?? " ") ? 1.5 : 1;
        const startBonus = idx === 0 ? 1.5 : 1;
        tokenScore = Math.max(tokenScore, f.weight * boundary * startBonus);
        if (!matched.some((m) => m.field === f.field && m.text === f.text)) {
          matched.push({ field: f.field, text: f.text });
        }
      }
      if (tokenScore === 0) {
        // Missing token => disqualify (AND semantics across tokens).
        score = 0;
        break;
      }
      score += tokenScore;
    }

    if (score > 0) hits.push({ product, score, matched });
  }

  hits.sort((a, b) => b.score - a.score);
  return hits;
}

/**
 * Splits a string into highlight segments based on tokens.
 * Case-insensitive, non-overlapping, returns plain JS objects to render.
 */
export function highlight(
  text: string,
  query: string,
): { text: string; match: boolean }[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [{ text, match: false }];

  const lower = text.toLowerCase();
  const ranges: [number, number][] = [];
  for (const t of tokens) {
    let from = 0;
    while (from <= lower.length) {
      const idx = lower.indexOf(t, from);
      if (idx === -1) break;
      ranges.push([idx, idx + t.length]);
      from = idx + t.length;
    }
  }
  if (ranges.length === 0) return [{ text, match: false }];

  // Merge overlapping ranges
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [ranges[0]];
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1];
    if (ranges[i][0] <= last[1]) last[1] = Math.max(last[1], ranges[i][1]);
    else merged.push(ranges[i]);
  }

  const segments: { text: string; match: boolean }[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor)
      segments.push({ text: text.slice(cursor, start), match: false });
    segments.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length)
    segments.push({ text: text.slice(cursor), match: false });
  return segments;
}
