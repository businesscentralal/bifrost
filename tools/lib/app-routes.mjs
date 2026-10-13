/**
 * App -> docs route mapping for the source-based tools (tools/check-context-help.mjs).
 *
 * Lists the published apps only, like apps.ts: an app is added here when it is
 * published and its pages move to this site.
 */

/** Owner id -> docs route id (the apps.ts plugin id) and display title. */
export const APP_ROUTES = {
  'foundation': {route: 'foundation', title: 'Foundation'},
  'language-models': {route: 'language-models', title: 'Language Models'},
};

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
