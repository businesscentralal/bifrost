/**
 * Renders the agent skills in `static/skills/` into browsable pages under
 * `docs/skills/`.
 *
 *   node tools/render-skills.mjs
 *
 * A skill is a folder holding a SKILL.md and, optionally, a `references/`
 * folder of topic files. That layout is the standard Agent Skills one: an agent
 * fetches SKILL.md, decides what it needs, and pulls one reference. The pages
 * this script writes are the same content for a person to read and search.
 *
 *   static/skills/<skill>/SKILL.md                ->  docs/skills/<skill>/index.md
 *   static/skills/<skill>/references/<topic>.md   ->  docs/skills/<skill>/references/<topic>.md
 *   static/skills/<skill>/SKILL.md   (no refs)    ->  docs/skills/<skill>.md
 *
 * plus docs/skills/index.md, the table of every skill and how to load it.
 *
 * The skill files are the authoritative copy. Everything under docs/skills/ is
 * derived and is deleted and rewritten on every run, so it cannot drift.
 *
 * Replaces tools/split-skill.mjs, which cut one very large SKILL.md at its
 * headings. The split now lives in the skill folder itself, so this script only
 * has to render — and to get the MDX escaping right, which the old one did not:
 * its placeholder for a stashed code span was ` <n> `, which matches any number
 * surrounded by spaces in ordinary prose, so restoring the spans dropped code
 * into the wrong sentence.
 */
import {readFile, writeFile, mkdir, rm, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = path.join(root, 'static', 'skills');
const docsDir = path.join(root, 'docs', 'skills');

/* ------------------------------------------------------------------ MDX ---- */

/**
 * Placeholders use two Unicode private-use characters. Nothing in a Markdown
 * document written by a human contains them, so — unlike a numeric placeholder —
 * restoring can never hit a false match.
 */
const STASH_OPEN = '';
const STASH_CLOSE = '';

const OPEN_FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;
const CLOSE_FENCE = /^ {0,3}(`{3,}|~{3,})[ \t]*$/;

/**
 * Escapes a Markdown body so MDX will parse it as text rather than as JSX.
 *
 * Code — fenced blocks and inline spans — is set aside first and put back
 * untouched at the end, because everything inside it is meant literally. What
 * is left is prose, where three characters are dangerous:
 *
 *   `{` `}`  MDX reads them as an expression
 *   `<`      MDX reads `<word` as the start of a JSX element
 *   `|`      inside a table row it ends the cell
 *
 * The pipe only matters on table rows, and only inside restored code — a bare
 * pipe in prose is already the author's cell separator. So pipes are escaped at
 * restore time, and only for placeholders that sit on a table row.
 */
export function escapeMdx(markdown) {
  const stash = [];
  const keep = (text) => {
    stash.push(text);
    return `${STASH_OPEN}${stash.length - 1}${STASH_CLOSE}`;
  };

  // Fenced blocks first, line by line, so an opening fence can never be closed
  // by the opening fence of the next block (```js does not close ```).
  const lines = markdown.split('\n');
  const out = [];
  let open = null;
  let buffer = [];
  for (const line of lines) {
    if (open === null) {
      const match = line.match(OPEN_FENCE);
      if (match && !(match[1][0] === '`' && match[2].includes('`'))) {
        open = match[1];
        buffer = [line];
      } else {
        out.push(line);
      }
      continue;
    }
    buffer.push(line);
    const closing = line.match(CLOSE_FENCE);
    if (closing && closing[1][0] === open[0] && closing[1].length >= open.length) {
      out.push(keep(buffer.join('\n')));
      open = null;
      buffer = [];
    }
  }
  if (open !== null) out.push(keep(buffer.join('\n')));

  let text = out.join('\n');

  // Inline code spans, longest fence first so ``a ` b`` survives.
  text = text.replace(/(`+)(?:(?!\1)[\s\S])*?\1/g, (match) => keep(match));

  text = text
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
    .replace(/</g, '&lt;');

  // Restore innermost-last: a stashed fence may contain a stashed span only if
  // the fence was stashed first, which it was, so one pass in reverse is enough.
  for (let i = stash.length - 1; i >= 0; i -= 1) {
    const token = `${STASH_OPEN}${i}${STASH_CLOSE}`;
    const index = text.indexOf(token);
    if (index === -1) continue;
    const lineStart = text.lastIndexOf('\n', index) + 1;
    const lineEnd = text.indexOf('\n', index);
    const line = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);
    const inTableRow = /^\s*\|/.test(line);
    // A pipe inside a restored code span would end the cell, so escape it — but
    // only if the author has not escaped it already, or the extra backslash
    // shows up in the rendered table.
    const value = inTableRow ? stash[i].replace(/(?<!\\)\|/g, '\\|') : stash[i];
    text = `${text.slice(0, index)}${value}${text.slice(index + token.length)}`;
  }

  return text;
}

/* -------------------------------------------------------------- helpers ---- */

const yaml = (value) => `"${String(value).replace(/"/g, '\\"')}"`;

const normalise = (text) => text.replace(/^﻿/, '').replace(/\r\n/g, '\n');

/** Splits YAML front matter off a skill file. */
function parseSkill(raw) {
  const text = normalise(raw);
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  const frontMatter = match?.[1] ?? '';
  const body = (match ? text.slice(match[0].length) : text).trim();
  /**
   * Reads `name: value` or a `name: >` / `name: |` block scalar. The block form
   * is taken by indentation — the lines that follow, up to the first one that is
   * not indented further than the key. Doing it with a single regex is where the
   * previous version went wrong: with the `m` flag, `$` ends at the first line.
   */
  const scalar = (name) => {
    const rows = frontMatter.split('\n');
    const start = rows.findIndex((row) => row.startsWith(`${name}:`));
    if (start === -1) return '';
    const inline = rows[start].slice(name.length + 1).trim();
    if (!/^[>|][-+]?$/.test(inline)) return inline.replace(/^["']|["']$/g, '');
    const collected = [];
    for (const row of rows.slice(start + 1)) {
      if (row.trim() && !/^\s/.test(row)) break;
      collected.push(row.trim());
    }
    return collected.filter(Boolean).join(' ');
  };
  const heading = body.match(/^#\s+(.*)$/m);
  // `metadata.docsTitle` lets a skill keep an H1 that an agent recognises while
  // the site shows a shorter name in the sidebar.
  const docsTitle = frontMatter.match(/^\s+docsTitle:\s*(.*)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
  return {
    frontMatter,
    name: scalar('name'),
    description: scalar('description'),
    title: docsTitle || heading?.[1]?.trim() || scalar('name'),
    body: body.replace(/^#\s+.*\n/, '').trim(),
  };
}

/** Trims to a whole word, for the `description` meta tag Docusaurus emits. */
function summarise(text, limit = 280) {
  const clean = text.replace(/\s+/g, ' ').replace(/`/g, '').trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]$/, '')}…`;
}

/**
 * Rewrites the links between skill files so they point at the rendered pages.
 *
 * A skill file links the way an agent reads it: `references/queue-api.md`,
 * `../SKILL.md`, `../bifrost-nornir/SKILL.md`. On the site those files live at
 * different paths, so each link is resolved against the source file and then
 * re-expressed relative to the page being written.
 */
function rewriteLinks(body, sourceFile, targetFile, pageOf) {
  return body.replace(/\]\(([^)\s]+\.md)(#[^)\s]*)?\)/g, (match, href, anchor = '') => {
    if (/^[a-z]+:/i.test(href)) return match;
    const resolved = path.resolve(path.dirname(sourceFile), href);
    const page = pageOf.get(path.normalize(resolved));
    if (!page) return match;
    let rel = path.relative(path.dirname(targetFile), page).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = `./${rel}`;
    return `](${rel}${anchor})`;
  });
}

async function writePage(file, {id, title, label, position, description, escape = true}, body) {
  const frontMatter = [
    '---',
    `id: ${id}`,
    `title: ${yaml(title)}`,
    `sidebar_label: ${yaml(label ?? title)}`,
    `sidebar_position: ${position}`,
    description ? `description: ${yaml(description)}` : null,
    '---',
    '',
  ].filter((line) => line !== null);
  await mkdir(path.dirname(file), {recursive: true});
  await writeFile(file, `${frontMatter.join('\n')}\n${(escape ? escapeMdx(body) : body).trim()}\n`, 'utf8');
}

/** `queue-api.md` -> `queue-api`; also used for the sidebar id. */
const slugOf = (file) => path.basename(file, '.md');

/* ----------------------------------------------------------------- main ---- */

const exists = async (file) => {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
};

/**
 * Reference pages read in the order SKILL.md introduces them, not alphabetically:
 * the skill is written to be read from the envelope outwards, and a sidebar that
 * opens on "approvals" hides that. Files SKILL.md never links to come last.
 */
function orderReferences(files, skillSource) {
  const mentioned = [...normalise(skillSource).matchAll(/references\/([A-Za-z0-9._-]+\.md)/g)].map(([, file]) => file);
  const rank = new Map();
  for (const file of mentioned) if (!rank.has(file)) rank.set(file, rank.size);
  return [...files].sort((a, b) => {
    const ai = rank.has(a) ? rank.get(a) : Number.MAX_SAFE_INTEGER;
    const bi = rank.has(b) ? rank.get(b) : Number.MAX_SAFE_INTEGER;
    return ai - bi || a.localeCompare(b);
  });
}

/**
 * The order skills appear in the sidebar and in the index table: the core skill
 * first, then the apps in the order apps.ts lists them, then anything else.
 */
async function skillOrder() {
  const source = await readFile(path.join(root, 'apps.ts'), 'utf8');
  const ids = [...source.matchAll(/\{id: '([^']+)', title: '([^']+)'/g)].map(([, id]) => `bifrost-${id}`);
  return ['bifrost-bc-integration', ...ids];
}

const order = await skillOrder();
const found = (await readdir(skillsDir, {withFileTypes: true}))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const skills = [...found].sort((a, b) => {
  const ai = order.indexOf(a);
  const bi = order.indexOf(b);
  return (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) - (bi === -1 ? Number.MAX_SAFE_INTEGER : bi) || a.localeCompare(b);
});

// Pass 1: work out where every skill file will end up, so links can be rewritten.
const loaded = [];
const pageOf = new Map();

for (const id of skills) {
  const skillFile = path.join(skillsDir, id, 'SKILL.md');
  if (!(await exists(skillFile))) continue;

  const refDir = path.join(skillsDir, id, 'references');
  const references = (await exists(refDir))
    ? orderReferences(
        (await readdir(refDir)).filter((file) => file.endsWith('.md')),
        await readFile(skillFile, 'utf8'),
      )
    : [];

  const indexFile = references.length
    ? path.join(docsDir, id, 'index.md')
    : path.join(docsDir, `${id}.md`);

  pageOf.set(path.normalize(skillFile), indexFile);
  for (const file of references) {
    pageOf.set(path.normalize(path.join(refDir, file)), path.join(docsDir, id, 'references', file));
  }

  loaded.push({id, skillFile, refDir, references, indexFile});
}

// Pass 2: render.
for (const entry of loaded) {
  await rm(path.join(docsDir, entry.id), {recursive: true, force: true});
  await rm(path.join(docsDir, `${entry.id}.md`), {force: true});
}

let pages = 0;
const summary = [];

for (const [index, entry] of loaded.entries()) {
  const skill = parseSkill(await readFile(entry.skillFile, 'utf8'));
  const position = index + 2; // index.md holds position 1

  const rawUrl = `/skills/${entry.id}/SKILL.md`;
  const loading = [
    '',
    '## Loading this skill',
    '',
    `An agent loads the skill file itself: [SKILL.md](pathname://${rawUrl}).`,
    entry.references.length
      ? 'It is short by design — the model, the rules and an index. The reference files it points at are the pages under this section, and are fetched one at a time from `references/` next to it.'
      : 'It is an index: what the app adds, when to load it, and the path of every reference page.',
    '',
    '<details>',
    '<summary>The description an agent matches this skill against</summary>',
    '',
    escapeMdx(skill.description),
    '',
    '</details>',
  ].join('\n');

  await writePage(
    entry.indexFile,
    {
      id: entry.references.length ? 'index' : entry.id,
      title: skill.title,
      label: entry.references.length ? 'Overview' : skill.title,
      position: entry.references.length ? 1 : position,
      description: summarise(skill.description),
      escape: false,
    },
    escapeMdx(rewriteLinks(skill.body, entry.skillFile, entry.indexFile, pageOf)) + loading,
  );
  pages += 1;

  if (!entry.references.length) {
    summary.push(`${entry.id}: 1 page`);
    continue;
  }

  await writeFile(
    path.join(docsDir, entry.id, '_category_.json'),
    `${JSON.stringify({label: skill.title, position, link: {type: 'doc', id: 'index'}}, null, 2)}\n`,
    'utf8',
  );

  await mkdir(path.join(docsDir, entry.id, 'references'), {recursive: true});
  await writeFile(
    path.join(docsDir, entry.id, 'references', '_category_.json'),
    `${JSON.stringify(
      {
        label: 'Reference',
        position: 2,
        link: {
          type: 'generated-index',
          description: `One page per area of the ${skill.title} skill. An agent loads one of these at a time; the whole set is what the single SKILL.md used to hold.`,
        },
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  let refPosition = 0;
  for (const file of entry.references) {
    refPosition += 1;
    const source = path.join(entry.refDir, file);
    const target = path.join(docsDir, entry.id, 'references', file);
    const reference = parseSkill(await readFile(source, 'utf8'));
    // A reference file has no front matter; its first paragraph is the purpose.
    const purpose = reference.body.split('\n\n').find((block) => block.trim() && !block.startsWith('#')) ?? '';
    await writePage(
      target,
      {
        id: slugOf(file),
        title: reference.title,
        position: refPosition,
        description: summarise(purpose),
      },
      rewriteLinks(reference.body, source, target, pageOf),
    );
    pages += 1;
  }
  summary.push(`${entry.id}: ${entry.references.length + 1} pages`);
}

/* ------------------------------------------------------- the skills index -- */

const rows = [];
for (const entry of loaded) {
  const skill = parseSkill(await readFile(entry.skillFile, 'utf8'));
  const link = path
    .relative(docsDir, entry.indexFile)
    .replace(/\\/g, '/')
    .replace(/\/index\.md$/, '/')
    .replace(/\.md$/, '');
  rows.push(
    `| [${skill.title}](./${link}) | ${entry.references.length ? `${entry.references.length} reference files` : 'index only'} | [SKILL.md](pathname:///skills/${entry.id}/SKILL.md) |`,
  );
}

await writePage(
  path.join(docsDir, 'index.md'),
  {
    id: 'index',
    title: 'Skills for AI agents',
    label: 'Overview',
    position: 1,
    description:
      'Reference material for AI agents that drive Business Central through the Bifröst API and the Origo BC MCP server.',
    escape: false,
  },
  [
    'A **skill** here is what an AI agent loads before it writes code against Bifröst. It',
    'carries the parts of the API an agent cannot infer: the shape of the message envelope,',
    'which message type does what, how field names are normalised, how filters are written,',
    'and which mistakes look plausible but fail.',
    '',
    'Each skill follows the standard layout — a short `SKILL.md` holding the model, the rules',
    'and an index, and a `references/` folder the agent reads one file from at a time. An',
    'agent that needs to post a sales invoice loads the core skill and one reference, not a',
    'quarter of a million characters of catalogue.',
    '',
    'The files under `/skills/` are the authoritative copy. The pages in this section are',
    'generated from them by `tools/render-skills.mjs`, so they cannot drift.',
    '',
    '## Available skills',
    '',
    '| Skill | Shape | Single file |',
    '| --- | --- | --- |',
    ...rows,
    '',
    'Load the core skill first. An app skill on its own does not explain the API — it is the',
    'index of what that app adds to the catalogue.',
    '',
    '## Finding this from an agent',
    '',
    'The site publishes an [`llms.txt`](pathname:///llms.txt) at its root. It lists every',
    'skill file, every reference file and the main documentation sections, with absolute',
    'URLs, so an agent handed only the site address can find the rest without crawling.',
    '',
    '## What an agent still needs',
    '',
    'A skill describes the API, not your tenant. Before an agent can call anything it also',
    'needs:',
    '',
    '1. the base URL for the environment, including the company id;',
    '2. an access token — Bifröst authenticates with OAuth 2.0 through Microsoft Entra ID;',
    '3. the set of message types actually installed, which `Help.MessageTypes.Get` returns',
    '   for the environment it is asked.',
    '',
    'Every Bifröst app documents its own message types under its section — see',
    '[Orchestrator](/orchestrator/), [Attachments](/attachments/), [Language Models](/language-models/) and',
    '[Iceland DocEx](/iceland-docex/). Building an app of your own is covered under',
    '[Extensibility](/extensibility/).',
  ].join('\n'),
);
pages += 1;

console.log(summary.join('\n'));
console.log(`\nrender-skills: ${loaded.length} skill(s), ${pages} page(s) under docs/skills/.`);
