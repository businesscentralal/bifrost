/**
 * Proves that splitting the monolithic bifrost-bc-integration SKILL.md into
 * SKILL.md + references/*.md lost nothing.
 *
 *   node tools/check-skill-split.mjs
 *   node tools/check-skill-split.mjs --from <path to the original SKILL.md>
 *   node tools/check-skill-split.mjs --rev <git rev>
 *
 * With no arguments the original is read out of git history at the commit the
 * split was made from, so the repository does not have to carry a 280 kB copy
 * of a file that no longer exists.
 *
 * Three kinds of item are compared, chosen because they are the parts an agent
 * follows literally and the parts a careless edit silently mangles:
 *
 *   headings     every ATX heading line (`#` … `######`)
 *   code blocks  everything between a pair of ``` or ~~~ fences, verbatim
 *   table rows   every line that starts with `|`
 *
 * Each item of the original must appear EXACTLY ONCE across the new files.
 * Missing means content was dropped; duplicated means a block was pasted into
 * two files and the two copies will drift.
 *
 * Out of scope, deliberately:
 *   - YAML front matter. The new front matter is a router description, not the
 *     old one; it is rewritten, not moved.
 *   - Prose lines. They travel with the blocks around them, and comparing them
 *     line by line would flag every reference file's own purpose paragraph.
 *
 * Exit code is 0 when everything is accounted for, 1 otherwise.
 *
 * BASE_REV is pinned to the commit the mechanical split was carved from, not
 * to "the previous state of the content." Once a later commit intentionally
 * rewrites part of a reference file (fixing a mistake, changing a described
 * server, adding a section), this script will correctly report those old
 * headings/code blocks/rows as MISSING against BASE_REV — that is not a
 * split regression, it is the intentional edit doing its job. Re-run with
 * `--rev <the commit right before your intentional edit>` if you want a
 * "did my edit lose anything it didn't mean to" check instead of the
 * original "did the 2026-09 split lose anything" check.
 *
 * Case in point: 2026-09-06 rewrote references/mcp-server.md (and touched
 * authentication.md, queue-api.md) to describe a local origo-bc-mcp-server
 * setup instead of a hosted `dynamics.is` MCP server the skill was never
 * supposed to name. Running this script against BASE_REV after that change
 * reports the old hosted-server headings/rows as MISSING by design — they
 * were deliberately removed, not lost.
 */
import {readFile, readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The commit the split was carved from — the last one with the single-file skill. */
const BASE_REV = '74e1c4e5818fc97f76f4a077345be3f5f2d95e88';
const SKILL_PATH = 'static/skills/bifrost-bc-integration/SKILL.md';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) out[argv[i].replace(/^--/, '')] = argv[i + 1];
  return out;
}

const opts = parseArgs(process.argv.slice(2));

/** Reads the pre-split SKILL.md, from disk if asked, otherwise from git. */
async function readOriginal() {
  if (opts.from) return readFile(path.resolve(opts.from), 'utf8');
  const rev = opts.rev ?? BASE_REV;
  try {
    return execFileSync('git', ['show', `${rev}:${SKILL_PATH}`], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (error) {
    throw new Error(
      `could not read ${SKILL_PATH} at ${rev} from git — pass --from <file> or --rev <rev>\n${error.message}`,
    );
  }
}

const normalise = (text) => text.replace(/^﻿/, '').replace(/\r\n/g, '\n');

/** Drops YAML front matter, which is metadata rather than content. */
const stripFrontMatter = (text) => {
  const match = text.match(/^---\n[\s\S]*?\n---\n/);
  return match ? text.slice(match[0].length) : text;
};

/**
 * Splits a document into fenced code blocks and the prose between them, so a
 * `|` or `#` inside a code sample is never mistaken for a table row or heading.
 *
 * Fence matching follows CommonMark closely enough to matter here: a closing
 * fence is a run of the SAME character, at least as long as the opening run,
 * with nothing after it. Accepting any line that merely starts with backticks
 * lets the opening fence of the next block close the current one, which puts
 * the whole rest of the document one block out of phase.
 */
const OPEN_FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;

function tokenise(text) {
  const code = [];
  const prose = [];
  let open = null;
  let buffer = [];
  for (const line of text.split('\n')) {
    if (open === null) {
      const match = line.match(OPEN_FENCE);
      // An info string on a backtick fence may not itself contain a backtick.
      if (match && !(match[1][0] === '`' && match[2].includes('`'))) {
        open = match[1];
        buffer = [line];
      } else {
        prose.push(line);
      }
      continue;
    }
    buffer.push(line);
    const closing = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
    if (closing && closing[1][0] === open[0] && closing[1].length >= open.length) {
      code.push(buffer.join('\n').replace(/[ \t]+$/gm, ''));
      open = null;
      buffer = [];
    }
  }
  // An unterminated fence is a real defect; surface it rather than swallowing it.
  if (open !== null) code.push(`${buffer.join('\n')}\n<<UNTERMINATED FENCE>>`);
  return {code, prose};
}

/** The three item kinds, each as `kind\tvalue` so counts never collide. */
function itemsOf(text) {
  const {code, prose} = tokenise(stripFrontMatter(normalise(text)));
  const items = [];
  for (const block of code) items.push(`code\t${block}`);
  for (const line of prose) {
    const trimmed = line.replace(/[ \t]+$/, '');
    if (/^#{1,6} /.test(trimmed)) items.push(`heading\t${trimmed}`);
    else if (/^\|/.test(trimmed.trimStart())) items.push(`row\t${trimmed.trimStart()}`);
  }
  return items;
}

function tally(items) {
  const counts = new Map();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return counts;
}

const skillDir = path.join(root, 'static', 'skills', 'bifrost-bc-integration');
const refDir = path.join(skillDir, 'references');

const newFiles = [
  path.join(skillDir, 'SKILL.md'),
  ...(await readdir(refDir)).filter((f) => f.endsWith('.md')).sort().map((f) => path.join(refDir, f)),
];

const originalCounts = tally(itemsOf(await readOriginal()));

/** item -> [file, ...] so a duplicate can name the files it landed in. */
const placement = new Map();
const newCounts = new Map();
for (const file of newFiles) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  for (const item of itemsOf(await readFile(file, 'utf8'))) {
    newCounts.set(item, (newCounts.get(item) ?? 0) + 1);
    if (!placement.has(item)) placement.set(item, []);
    placement.get(item).push(rel);
  }
}

const label = (item) => {
  const [kind, ...rest] = item.split('\t');
  const value = rest.join('\t');
  const first = value.split('\n')[0];
  const shown = first.length > 96 ? `${first.slice(0, 96)}…` : first;
  const extra = kind === 'code' ? ` (${value.split('\n').length} lines)` : '';
  return `${kind.padEnd(7)} ${shown}${extra}`;
};

const missing = [];
const duplicated = [];
for (const [item, wanted] of originalCounts) {
  const found = newCounts.get(item) ?? 0;
  if (found < wanted) missing.push([item, wanted, found]);
  else if (found > wanted) duplicated.push([item, wanted, found]);
}

/** Items the split introduced — new headings and the index tables. Reported, not failed. */
const added = [...newCounts].filter(([item]) => !originalCounts.has(item));

const kinds = ['code', 'heading', 'row'];
const countBy = (counts) =>
  kinds.map((kind) => {
    let n = 0;
    for (const [item, count] of counts) if (item.startsWith(`${kind}\t`)) n += count;
    return `${kind} ${n}`;
  }).join(', ');

console.log(`original (${opts.from ?? opts.rev ?? BASE_REV}): ${countBy(originalCounts)}`);
console.log(`new (${newFiles.length} files):        ${countBy(newCounts)}`);
console.log('');

if (missing.length) {
  console.log(`MISSING — in the original, not in the new files (${missing.length}):`);
  for (const [item, wanted, found] of missing) console.log(`  ${label(item)}  [want ${wanted}, found ${found}]`);
  console.log('');
}

if (duplicated.length) {
  console.log(`DUPLICATED — appears more times than in the original (${duplicated.length}):`);
  for (const [item, wanted, found] of duplicated) {
    console.log(`  ${label(item)}  [want ${wanted}, found ${found}]`);
    console.log(`      in: ${[...new Set(placement.get(item))].join(', ')}`);
  }
  console.log('');
}

if (added.length) {
  const byKind = kinds
    .map((kind) => `${added.filter(([item]) => item.startsWith(`${kind}\t`)).length} ${kind}`)
    .join(', ');
  console.log(`ADDED by the split (${added.length}: ${byKind}) — the per-file titles, purpose`);
  console.log('paragraphs and index tables. Pass --added 1 to list them.');
  if (opts.added) for (const [item] of added) console.log(`  ${label(item)}  in ${[...new Set(placement.get(item))].join(', ')}`);
  console.log('');
}

if (missing.length || duplicated.length) {
  console.error(`FAIL: ${missing.length} missing, ${duplicated.length} duplicated.`);
  process.exit(1);
}

console.log('OK: every heading, fenced code block and table row of the original appears exactly once.');
