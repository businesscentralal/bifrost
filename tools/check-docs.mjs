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
 * Preview/deploy CI wiring is deferred until the GitHub token has the
 * `workflow` scope (`gh auth refresh -h github.com -s workflow`).
 *
 */
import {execFile} from 'node:child_process';
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
// object names are off the site. The public contract and the patterns partners
// need to build on Bifröst (message types, their descriptions and help, the
// interfaces, isolated writes via Codeunit.Run as in the reference repo) are not
// IP and must not be blocked here.
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
    for (const {token, pattern} of FORBIDDEN) {
      if (pattern.test(line)) {
        hits.push({file: filePath, line: i + 1, token, source: line, excerpt: line.trim().slice(0, 160)});
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
    const key = `${hit.token}\0${hit.source}`;
    const remaining = allowances.get(key) ?? 0;
    if (remaining === 0) return true;
    allowances.set(key, remaining - 1);
    return false;
  });
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
  default:
    console.error(`Unknown mode: ${mode}\nUsage: node tools/check-docs.mjs [ipBoundary]`);
    code = 2;
}
process.exit(code);
