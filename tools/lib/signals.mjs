/**
 * Cross-field rules for the `signals` detection rules in data/apps.json that the
 * JSON Schema cannot express: at most 5 per app, 60 in total, unique
 * tableId + filters per app, and both languages with a {count} placeholder.
 * Structure (types, filter count, value/min/max shape) is enforced by the schema.
 */
export const MAX_SIGNALS_PER_APP = 5;
export const MAX_SIGNALS_TOTAL = 60;

const filterKey = (f) => JSON.stringify([f?.fieldNo, f?.value ?? null, f?.min ?? null, f?.max ?? null]);

export const signalKey = (signal) =>
  `${signal?.tableId}|${(Array.isArray(signal?.filters) ? signal.filters : []).map(filterKey).sort().join(';')}`;

/** @returns {string[]} one message per problem */
export function signalErrors(apps) {
  const errors = [];
  let total = 0;
  for (const app of Array.isArray(apps) ? apps : []) {
    const signals = Array.isArray(app?.signals) ? app.signals : [];
    const label = app?.name || app?.appId;
    total += signals.length;
    if (signals.length > MAX_SIGNALS_PER_APP) {
      errors.push(`"${label}": ${signals.length} signals, at most ${MAX_SIGNALS_PER_APP} allowed`);
    }
    const seen = new Set();
    signals.forEach((signal, index) => {
      const key = signalKey(signal);
      if (seen.has(key)) errors.push(`"${label}": signals[${index}] repeats tableId ${signal?.tableId} with the same filters`);
      seen.add(key);
      for (const lang of ['en', 'is']) {
        const text = signal?.reason?.[lang];
        if (typeof text !== 'string' || text.trim().length === 0) {
          errors.push(`"${label}": signals[${index}].reason.${lang} is missing or blank`);
        } else if (!text.includes('{count}')) {
          errors.push(`"${label}": signals[${index}].reason.${lang} lacks the {count} placeholder`);
        }
      }
    });
  }
  if (total > MAX_SIGNALS_TOTAL) errors.push(`${total} signals in total, at most ${MAX_SIGNALS_TOTAL} allowed`);
  return errors;
}
