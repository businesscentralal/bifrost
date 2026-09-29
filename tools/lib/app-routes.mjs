/**
 * Message type -> app -> docs route mapping, shared by the source-based tools.
 *
 * Mirrors the tables in tools/generate-message-type-docs.ps1 ($PrefixMap and
 * $AppRoutes, with the codename -> route renames and the Item.Attribute entry from
 * site PR #55). Keep both in step with apps.ts. The owner ids are the apps' internal
 * codenames; pages are always written under the route id.
 */

/** Key prefix -> owner id. First match wins; anything unclaimed belongs to Foundation. */
export const PREFIX_MAP = [
  // Bifröst Orchestrator (Nornir) - scheduling and orchestration
  ['Orchestrator.', 'nornir'],
  ['Help.Orchestrator', 'nornir'],

  // Bifröst Attachments (Hnitbjörg) - external storage, and from 28.0.0.36 the
  // Data Exchange discovery types (the app declares them; see the enum extension).
  ['Storage.', 'hnitbjorg'],
  ['Help.Storage', 'hnitbjorg'],
  ['DataExchange.', 'hnitbjorg'],
  ['Help.DataExchange', 'hnitbjorg'],

  // Bifröst Language Models (Bragi) - chat and language models
  ['LLM.', 'bragi'],
  ['Chat.', 'bragi'],
  ['Help.Chat', 'bragi'],
  ['Help.LLM', 'bragi'],

  // Bifröst Iceland DocEx - electronic document exchange
  ['DocumentExchange.', 'iceland-docex'],
  ['Help.DocumentExchange', 'iceland-docex'],

  // Bifröst Timesheets (Clockify) - time tracking
  ['Clockify.', 'clockify'],
  ['Help.Clockify', 'clockify'],

  // Bifröst Subscription Billing
  ['Subscription.', 'subscription-billing'],
  ['Help.Subscription', 'subscription-billing'],

  // Bifröst Inventory - item attributes (`Item.Attribute` also covers
  // `Item.AttributeDefinition.*`; the rest of `Item.*` stays with Foundation)
  ['Item.Attribute', 'inventory'],

  // Bifröst Iceland Treasury - the bank connectors
  ['Landsbankinn.', 'iceland-treasury'],
  ['Help.Landsbankinn', 'iceland-treasury'],
  ['Arionbanki.', 'iceland-treasury'],
  ['Arion.', 'iceland-treasury'],
  ['Help.Arionbanki', 'iceland-treasury'],
  ['Help.Arion', 'iceland-treasury'],
  ['Islandsbanki.', 'iceland-treasury'],
  ['Help.Islandsbanki', 'iceland-treasury'],
  ['Kvikabanki.', 'iceland-treasury'],
  ['Kvika.', 'iceland-treasury'],
  ['Help.Kvikabanki', 'iceland-treasury'],
  ['Help.Kvika', 'iceland-treasury'],
  ['Sparisjodir.', 'iceland-treasury'],
  ['Help.Sparisjodir', 'iceland-treasury'],

  // Bifröst Iceland - government services, SMS, Já Gagnatorg and the VAT statement
  ['Iceland.', 'iceland'],
  ['Help.Iceland', 'iceland'],
  ['Ja.', 'iceland'],
  ['Help.Ja', 'iceland'],
  ['Finance.VAT', 'iceland'],
];

/** Owner id -> docs route id (the apps.ts plugin id) and display title. */
export const APP_ROUTES = {
  'foundation': {route: 'foundation', title: 'Foundation'},
  'iceland': {route: 'iceland', title: 'Iceland'},
  'iceland-treasury': {route: 'iceland-treasury', title: 'Iceland Treasury'},
  'iceland-docex': {route: 'iceland-docex', title: 'Iceland DocEx'},
  'bragi': {route: 'language-models', title: 'Language Models'},
  'hnitbjorg': {route: 'attachments', title: 'Attachments'},
  'nornir': {route: 'orchestrator', title: 'Orchestrator'},
  'clockify': {route: 'timesheets', title: 'Timesheets'},
  'subscription-billing': {route: 'subscription-billing', title: 'Subscription Billing'},
  'inventory': {route: 'inventory', title: 'Inventory'},
};

export const FALLBACK_OWNER = 'foundation';

/** Test-only message types are never published. */
const EXCLUDED = [/^Test\./, /\.Test\./, /\.Mock\./];

export function isExcludedType(type) {
  return EXCLUDED.some((re) => re.test(type));
}

/** Owner id for a message type key, by prefix (the fallback signal of the API tool). */
export function ownerByPrefix(type) {
  const lc = type.toLowerCase();
  for (const [prefix, owner] of PREFIX_MAP) {
    if (lc.startsWith(prefix.toLowerCase())) return owner;
  }
  return FALLBACK_OWNER;
}

/**
 * Resolves an --app value (codename, route id, title, or "Bifrost <title>") to its owner
 * id, case-insensitively. Throws with the valid choices on an unknown value.
 */
export function resolveApp(name) {
  const wanted = name.trim().replace(/^Bifr(ö|o)st\s+/i, '').toLowerCase();
  for (const [owner, entry] of Object.entries(APP_ROUTES)) {
    if (wanted === owner || wanted === entry.route || wanted === entry.title.toLowerCase()) return owner;
  }
  const valid = Object.entries(APP_ROUTES).map(([owner, e]) => (owner === e.route ? `${e.route} (${e.title})` : `${e.route} (${e.title}, formerly ${owner})`));
  throw new Error(`Unknown app '${name}'. Use one of: ${valid.join('; ')}.`);
}

/** True when an app.json name belongs to the owner (Bifrost/Bifröst <Title>). */
export function appJsonMatches(owner, appJsonName) {
  const title = APP_ROUTES[owner].title.toLowerCase();
  const n = (appJsonName ?? '').trim().replace(/^Bifr(ö|o)st\s+/i, '').toLowerCase();
  return n === title || n === owner;
}

/** Parses a small `--flag value` / `--flag` command line; repeated flags collect. */
export function parseArgs(argv, spec) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const m = /^--?([A-Za-z][\w-]*)(?:=(.*))?$/.exec(arg);
    if (!m) throw new Error(`Unexpected argument '${arg}'. Run with --help.`);
    const key = Object.keys(spec).find((k) => k.toLowerCase() === m[1].toLowerCase() || (spec[k].alias ?? []).some((a) => a.toLowerCase() === m[1].toLowerCase()));
    if (!key) throw new Error(`Unknown option '${arg}'. Run with --help.`);
    const kind = spec[key].type;
    if (kind === 'boolean') { out[key] = true; continue; }
    const value = m[2] ?? argv[++i];
    if (value === undefined) throw new Error(`Option --${key} needs a value.`);
    if (kind === 'list') (out[key] ??= []).push(value);
    else out[key] = value;
  }
  return out;
}
