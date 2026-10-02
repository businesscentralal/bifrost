/**
 * Documentation lint helpers for the public Bifröst site.
 *
 * Modes:
 *   node tools/check-docs.mjs              # default: ipBoundary
 *   node tools/check-docs.mjs ipBoundary    # same
 *
 * ipBoundary fails when new forbidden vocabulary appears under docs/, help/,
 * or the matching i18n markdown mirrors. Wired as `npm run check:ip-boundary`.
 * It also fails on any value that looks like a personal kennitala (see
 * findKennitalaHits) under docs/, help/, i18n/ or static/. That part has no
 * baseline: personal data is never grandfathered.
 * Runs in the preview workflow on every pull request.
 *
 */
import {execFile} from 'node:child_process';
import {createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {readdir, readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Foundation guard vocabulary. Patterns with identifier-like casing stay exact;
// product names are case-insensitive, and Key Vault also catches KeyVault.
//
// The line this list draws: infrastructure, credentials and Origo's internal
// object names are off the site, and so are message types (decision 30.09.2026):
// the site names none of them, so readers and agents read them live from the
// environment. The public extension surface partners build on (interfaces,
// events, public codeunits, isolated writes via Codeunit.Run as in the reference
// repo) is not blocked here.
//
// Entries marked `strict` are never grandfathered from the baseline: the content
// they catch was removed from the whole site, so any hit is a regression.
// A message-type name is Area.Entity.Verb (three or more PascalCase parts). AL and .NET namespaces
// that start with these prefixes are not message types.
const MESSAGE_TYPE_NAME = /(?<![\w./-])(?!(?:Origo|Microsoft|System)\.)[A-Z][A-Za-z0-9]*\.[A-Z][A-Za-z0-9]*\.[A-Z][A-Za-z0-9]*(?:\.[A-Z][A-Za-z0-9]*)*(?![\w-])/g;
// The discovery entry points: how a reader finds every other type.
const ALLOWED_TYPE_NAMES = new Set(['Help.MessageTypes.Get', 'Help.Implementation.Get']);

// Apps that are not published on AppSource yet. This repository is public, so their names are kept
// as hashes: the first 16 hex digits of SHA-256 over the lower-cased name (ö written as o), one to three
// words, and over each docs route. `node tools/check-docs.mjs hash "<name or route>"` prints the value to
// add. When an app is published, remove its hashes in the same pull request that brings its pages back.
const UNPUBLISHED_NAME_HASHES = new Set([
  'd94df5d992169251', 'fe99523a77b777ec', 'a046c4f0a310ac2f', 'a0a446ad370b830c', '17214a07d5b7578b',
  '1b797f6e6728ad2b', '4e335a9a47a11647', '3381590a4e4bd9ff', 'a6ad3891ba67c714', '63874763be005259',
  'e3fb45974f88dc34', '6f3e4d7fd1f5e471', 'b0dd3a2d68522b2d', '2756636f5ac88609', '90a45c6dcbb66d38',
  '9a91356d3b648e62',
]);
const UNPUBLISHED_ROUTE_HASHES = new Set([
  '9eb5c59d70089e53', '97a37556dc257040', 'b25920b5f0013a9f', 'a43a82a5e0b2fb98', '3930e671c9e40dee',
  '11376b7e2acf0c93', 'dc0d200aaebbf548', 'c2750447ccba4184', 'b11a85b296a90afc',
]);
const shortHash = (value) => createHash('sha256').update(value).digest('hex').slice(0, 16);

/** A pattern-like object: true when a line names an unpublished app or links to one of its routes. */
const UNPUBLISHED_APPS = {
  global: false,
  test(line) {
    const words = line.toLowerCase().replace(/ö/g, 'o').match(/[a-z0-9]+/g) ?? [];
    for (let i = 0; i < words.length; i++) {
      for (let n = 1; n <= 3 && i + n <= words.length; n++) {
        if (UNPUBLISHED_NAME_HASHES.has(shortHash(words.slice(i, i + n).join(' ')))) return true;
      }
    }
    for (const m of line.matchAll(/\]\(\/(?:help\/)?([a-z-]+)\//g)) {
      if (UNPUBLISHED_ROUTE_HASHES.has(shortHash(m[1]))) return true;
    }
    return false;
  },
};

const FORBIDDEN = [
  {token: 'Cosmos', pattern: /Cosmos/i},
  {token: 'Key Vault', pattern: /Key\s*Vault/i},
  {token: 'vault.azure.net', pattern: /vault\.azure\.net/i},
  {token: 'CE-', pattern: /CE-/},
  {token: 'TODO', pattern: /\bTODO\b/},
  {token: 'FIXME', pattern: /\bFIXME\b/},
  {token: 'accessKey', pattern: /accessKey/},
  {token: 'AccountKey=', pattern: /AccountKey=/},
  {token: 'InstrumentationKey=', pattern: /InstrumentationKey=/},
  {token: 'DefaultEndpointsProtocol=', pattern: /DefaultEndpointsProtocol=/},
  {token: ' Impl ori', pattern: / Impl ori/},
  {token: ' Handler ori', pattern: / Handler ori/},
  {token: 'cloudapp.azure.com', pattern: /cloudapp\.azure\.com/i},
  // Removed from the whole site on 02.10.2026 (#62, #68-#71); see the documentation rules.
  {token: 'message type name', pattern: MESSAGE_TYPE_NAME, strict: true, allow: ALLOWED_TYPE_NAMES},
  {token: 'message-type page', pattern: /reference\/message-types\/|\/foundation\/message-types\//, strict: true},
  {token: 'telemetry id', pattern: /ORI-BIF-\d/, strict: true},
  {token: 'IsolatedStorage', pattern: /IsolatedStorage/, strict: true},
  {token: 'development container', pattern: /\bbc28-|\bCRONUS\b|\bAlpaca\b/, strict: true},
  {token: 'partner program page', pattern: /\/licensing\/(vendor|partner|customer|leaving-and-cancelling)\/|\]\(\.\/(vendor|partner|customer|leaving-and-cancelling)\.md/, strict: true},
  {token: 'skills page', pattern: /\]\(\/skills\/|static\/skills\//, strict: true},
  // Only published apps are documented here (decision 02.10.2026). When an app is published, remove
  // its hashes in the same pull request that brings its pages back.
  {token: 'unpublished app', pattern: UNPUBLISHED_APPS, strict: true},
];

const SCAN_ROOTS = ['docs', 'help', 'i18n'];
const KENNITALA_SCAN_ROOTS = ['docs', 'help', 'i18n', 'static'];
const BASELINE_COMMIT = 'a4250f2fbb1aa401a4d1ce372299fba345de3227';

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
    for (const {token, pattern, strict, allow} of FORBIDDEN) {
      let found;
      if (pattern.global) {
        found = [...line.matchAll(pattern)].some((m) => !allow?.has(m[0]));
      } else {
        found = pattern.test(line);
      }
      if (found) {
        hits.push({file: filePath, line: i + 1, token, strict: Boolean(strict), source: line, excerpt: line.trim().slice(0, 160)});
      }
    }
  }
  return hits;
}

// Personal kennitala: DDMMYY[-]NNNN where DDMMYY is a real calendar date and
// digit 9 is the modulus-11 check digit (weights 3,2,7,6,5,4,3,2), as every
// issued kennitala has. The check digit keeps DDMMYYHHMI timestamps and dummies
// such as 1010101111 out. Company (day 41-71) and temporary IDs are not
// personal data and are not flagged. GUID parts, longer numbers and prefixed
// IDs are skipped by the boundaries below. Use 0000000000 or 000000-0000.
const KENNITALA_ALLOW = new Set(['0000000000', '000000-0000']);
const KENNITALA_PATTERN = /(?<![\w.\-])(\d{2})(\d{2})(\d{2})-?(\d{2})(\d)(\d)(?![\w]|-\w|[.,]\d)/g;

function isPersonalKennitala(dd, mm, yy, digits, century) {
  const day = Number(dd);
  const month = Number(mm);
  if (day < 1 || day > 31 || month < 1 || month > 12) return false;
  const year = ({8: 1800, 9: 1900, 0: 2000}[century] ?? 1900) + Number(yy);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return false;
  const weights = [3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((acc, w, i) => acc + w * Number(digits[i]), 0);
  const check = (11 - (sum % 11)) % 11;
  return check !== 10 && check === Number(digits[8]);
}

function findKennitalaHits(content, filePath) {
  const hits = [];
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const m of lines[i].matchAll(KENNITALA_PATTERN)) {
      if (KENNITALA_ALLOW.has(m[0])) continue;
      const digits = m[0].replace('-', '');
      if (!isPersonalKennitala(m[1], m[2], m[3], digits, m[6])) continue;
      // Do not echo the value itself into CI logs.
      hits.push({file: filePath, line: i + 1, token: 'kennitala', excerpt: `column ${m.index + 1}`});
    }
  }
  return hits;
}

async function readBaseline(filePath) {
  try {
    const {stdout} = await execFileAsync('git', ['show', `${BASELINE_COMMIT}:${filePath}`], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
    return stdout;
  } catch {
    return '';
  }
}

function removeGrandfatheredHits(currentHits, baselineHits) {
  const allowances = new Map();
  for (const hit of baselineHits) {
    const key = `${hit.token}\0${hit.source}`;
    allowances.set(key, (allowances.get(key) ?? 0) + 1);
  }

  return currentHits.filter((hit) => {
    if (hit.strict) return true;
    const key = `${hit.token}\0${hit.source}`;
    const remaining = allowances.get(key) ?? 0;
    if (remaining === 0) return true;
    allowances.set(key, remaining - 1);
    return false;
  });
}

async function findHelpIndexPages() {
  const found = [];
  const helpRoot = path.join(root, 'help');
  for (const app of await readdir(helpRoot).catch(() => [])) {
    for (const name of ['index.md', 'index.mdx']) {
      if (await stat(path.join(helpRoot, app, name)).catch(() => null)) found.push(path.join('help', app, name));
    }
  }
  const i18nRoot = path.join(root, 'i18n', 'is-IS');
  for (const dir of (await readdir(i18nRoot).catch(() => [])).filter((d) => d.startsWith('docusaurus-plugin-content-docs-help-'))) {
    for (const name of ['index.md', 'index.mdx']) {
      const rel = path.join('i18n', 'is-IS', dir, 'current', name);
      if (await stat(path.join(root, rel)).catch(() => null)) found.push(rel);
    }
  }
  return found;
}

async function ipBoundary() {
  const hits = [];
  for (const scanRoot of SCAN_ROOTS) {
    const abs = path.join(root, scanRoot);
    const st = await stat(abs).catch(() => null);
    if (!st || !st.isDirectory()) continue;
    for await (const file of walkMarkdown(abs)) {
      const rel = path.relative(root, file);
      // Meta policy page may describe the rule without embedding every token.
      if (/(^|[/\\])ip-boundary\.md$/i.test(rel)) continue;
      const content = await readFile(file, 'utf8');
      const currentHits = findHits(content, rel);
      if (currentHits.length === 0) continue;
      const baseline = await readBaseline(rel);
      hits.push(...removeGrandfatheredHits(currentHits, findHits(baseline, rel)));
    }
  }
  for (const scanRoot of KENNITALA_SCAN_ROOTS) {
    const abs = path.join(root, scanRoot);
    const st = await stat(abs).catch(() => null);
    if (!st || !st.isDirectory()) continue;
    for await (const file of walkMarkdown(abs)) {
      const rel = path.relative(root, file);
      hits.push(...findKennitalaHits(await readFile(file, 'utf8'), rel));
    }
  }

  // Help is reached from Business Central, never browsed: no help instance has an index page.
  for (const helpIndex of await findHelpIndexPages()) {
    hits.push({file: helpIndex, line: 1, token: 'help index page', excerpt: 'help instances have no index page'});
  }

  if (hits.length === 0) {
    console.log(
      'ipBoundary: OK — no new forbidden vocabulary under docs/, help/, or i18n/, and no personal kennitala under those or static/.',
    );
    return 0;
  }

  console.error(`ipBoundary: FAILED — ${hits.length} new hit(s):\n`);
  for (const hit of hits) {
    console.error(`  ${hit.file}:${hit.line}  [${hit.token}]  ${hit.excerpt}`);
  }
  console.error(
    '\nPublic site = public information only. See CONTRIBUTING.md.' +
      '\nFor [kennitala] hits use the placeholder 0000000000 (or 000000-0000).',
  );
  return 1;
}

const mode = process.argv[2] ?? 'ipBoundary';
let code;
switch (mode) {
  case 'ipBoundary':
    code = await ipBoundary();
    break;
  case 'hash':
    // Prints the value to put in UNPUBLISHED_NAME_HASHES or UNPUBLISHED_ROUTE_HASHES.
    console.log(shortHash((process.argv[3] ?? '').trim().toLowerCase().replace(/ö/g, 'o').replace(/\s+/g, ' ')));
    code = 0;
    break;
  default:
    console.error(`Unknown mode: ${mode}\nUsage: node tools/check-docs.mjs [ipBoundary | hash "<name or route>"]`);
    code = 2;
}
process.exit(code);
