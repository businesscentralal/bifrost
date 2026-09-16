/**
 * Documentation lint helpers for the public Bifröst site.
 *
 * Modes:
 *   node tools/check-docs.mjs              # default: ipBoundary
 *   node tools/check-docs.mjs ipBoundary    # same
 *
 * ipBoundary fails when new forbidden vocabulary appears under docs/, help/,
 * or the matching i18n markdown mirrors. Wired as `npm run check:ip-boundary`.
 * Preview/deploy CI wiring is deferred until the GitHub token has the
 * `workflow` scope (`gh auth refresh -h github.com -s workflow`).
 *
 * tools/generate-message-type-docs.ps1 can overwrite generated message-type
 * pages until Foundation core#67 lands. This check is the safety net: exact
 * lines already present when site PR #17 merged are grandfathered, but changed
 * or newly generated lines are checked against the current vocabulary.
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
  {token: 'Codeunit.Run', pattern: /Codeunit\.Run/},
];

const SCAN_ROOTS = ['docs', 'help', 'i18n'];
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

  if (hits.length === 0) {
    console.log('ipBoundary: OK — no new forbidden vocabulary under docs/, help/, or i18n/.');
    return 0;
  }

  console.error(`ipBoundary: FAILED — ${hits.length} new hit(s):\n`);
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
