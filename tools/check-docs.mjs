/**
 * Documentation lint helpers for the public Bifröst site.
 *
 * Modes:
 *   node tools/check-docs.mjs              # default: ipBoundary
 *   node tools/check-docs.mjs ipBoundary    # same
 *
 * ipBoundary fails when forbidden vocabulary appears under docs/, help/, or
 * the matching i18n markdown mirrors. Wired as `npm run check:ip-boundary`.
 * Hooking it into CI (preview / deploy) is a follow-up if maintainers want the
 * gate on every PR rather than on demand.
 */
import {readdir, readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Phrases / tokens that must not appear on the public site. */
const FORBIDDEN = [
  'Cosmos',
  'Key Vault',
  'KeyVault',
  'vault.azure.net',
  'CE-Cosmos',
  'CE-licenses',
  'accessKey',
  'AccountKey=',
  'InstrumentationKey=',
  'DefaultEndpointsProtocol=',
];

const SCAN_ROOTS = ['docs', 'help', 'i18n'];

async function* walkMarkdown(dir) {
  let entries;
  try {
    entries = await readdir(dir, {withFileTypes: true});
  } catch (err) {
    if (err && err.code === 'ENOENT') return;
    throw err;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'build') continue;
      yield* walkMarkdown(full);
    } else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      yield full;
    }
  }
}

function findHits(content, filePath) {
  const hits = [];
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const token of FORBIDDEN) {
      // Case-sensitive for connection-string fragments; case-insensitive for names.
      const caseSensitive = token.includes('=') || token.includes('.');
      const idx = caseSensitive
        ? line.indexOf(token)
        : line.toLowerCase().indexOf(token.toLowerCase());
      if (idx !== -1) {
        hits.push({file: filePath, line: i + 1, token, excerpt: line.trim().slice(0, 160)});
      }
    }
  }
  return hits;
}

async function ipBoundary() {
  const hits = [];
  for (const rel of SCAN_ROOTS) {
    const abs = path.join(root, rel);
    const st = await stat(abs).catch(() => null);
    if (!st || !st.isDirectory()) continue;
    for await (const file of walkMarkdown(abs)) {
      const rel = path.relative(root, file);
      // Meta policy page may describe the rule without embedding every token.
      if (/(^|[/\\])ip-boundary\.md$/i.test(rel)) continue;
      const content = await readFile(file, 'utf8');
      hits.push(...findHits(content, rel));
    }
  }

  if (hits.length === 0) {
    console.log('ipBoundary: OK — no forbidden vocabulary under docs/, help/, or i18n/.');
    return 0;
  }

  console.error(`ipBoundary: FAILED — ${hits.length} hit(s):\n`);
  for (const hit of hits) {
    console.error(`  ${hit.file}:${hit.line}  [${hit.token}]  ${hit.excerpt}`);
  }
  console.error(
    '\nPublic site = public information only. See docs/extensibility/ip-boundary.md.',
  );
  return 1;
}

const mode = process.argv[2] ?? 'ipBoundary';
let code;
switch (mode) {
  case 'ipBoundary':
    code = await ipBoundary();
    break;
  default:
    console.error(`Unknown mode: ${mode}\nUsage: node tools/check-docs.mjs [ipBoundary]`);
    code = 2;
}
process.exit(code);
