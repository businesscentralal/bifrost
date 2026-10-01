/**
 * Builds the capability map: for every app, its capabilities and, in plain words, what each message
 * type in them does. Read off the generated message type pages, so the map follows the apps without
 * anyone editing it.
 *
 *   docs/<app>/reference/message-types/*.md  ->  src/data/capabilities.json
 *
 * The plain-words line is the page's `description` front matter when it is a real one-line
 * description, otherwise the first sentence of the page's opening text. Run before every build
 * (npm run build / npm start do it); the output is committed so a plain preview works too.
 *
 *   node tools/build-capability-map.mjs
 */
import {readdir, readFile, writeFile, mkdir, access} from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exists = (p) => access(p, constants.F_OK).then(() => true).catch(() => false);

/** The generated pages' boilerplate description, which says nothing about what a type does. */
const GENERIC = /^Request and response contract for the /;

function frontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fields = {};
  for (const line of (match?.[1] ?? '').split(/\r?\n/)) {
    const field = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (field) fields[field[1]] = field[2];
  }
  return fields;
}

/** The first sentence of the first paragraph of body text, without code, links or markup. */
function firstSentence(text) {
  const body = text
    .replace(/^---[\s\S]*?\r?\n---/, '')
    .replace(/:::[\s\S]*?:::/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .split(/\r?\n/);
  let paragraph = '';
  for (const line of body) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (paragraph) break;
      continue;
    }
    if (/^(#|\||```|-|\*\*\w[^*]*:\*\*|>)/.test(trimmed)) {
      if (paragraph) break;
      continue;
    }
    paragraph += `${paragraph ? ' ' : ''}${trimmed}`;
  }
  const plain = paragraph
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*?([^*]+)\*\*?/g, '$1')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // End at the first full stop that is not inside quotes or backticks ("Calc. and Post").
  let sentence = plain;
  let quotes = 0;
  for (let i = 0; i < plain.length; i++) {
    const ch = plain[i];
    if (ch === '"') quotes ^= 1;
    // A dot after a short capitalised word is an abbreviation (Gen., Exch., No., Cust.), not an end.
    const word = plain.slice(0, i).match(/(\S+)$/)?.[1] ?? '';
    const abbreviation = ch === '.' && /^[("']?[A-Z][a-z]{0,4}$/.test(word);
    if (!quotes && !abbreviation && /[.!?]/.test(ch) && (i + 1 === plain.length || plain[i + 1] === ' ')) {
      sentence = plain.slice(0, i + 1);
      break;
    }
  }
  if (/^[{[]/.test(sentence)) sentence = '';
  if (sentence.length <= 180) return sentence;
  return `${sentence.slice(0, sentence.lastIndexOf(' ', 177)).replace(/[,;:]$/, '')}…`;
}

const appsTs = await readFile(path.join(root, 'apps.ts'), 'utf8');
const appIds = [...appsTs.matchAll(/\{id: '([a-z-]+)', title: '[^']+', appName:/g)].map((m) => m[1]);

const map = {};
for (const id of appIds) {
  const dir = path.join(root, 'docs', id, 'reference', 'message-types');
  if (!(await exists(dir))) continue;
  const capabilities = {};
  for (const file of (await readdir(dir)).filter((name) => name.endsWith('.md')).sort()) {
    const text = await readFile(path.join(dir, file), 'utf8');
    const fields = frontMatter(text);
    const type = fields.title;
    if (!type || !type.includes('.')) continue;
    const capability = type.split('.')[0];
    const action = capability === 'Help'
      ? "Describes this app's message types, for AI agents."
      : fields.description && !GENERIC.test(fields.description)
        ? fields.description
        : firstSentence(text);
    (capabilities[capability] ??= []).push({
      type,
      action,
      href: `/${id}/reference/message-types/${fields.id ?? file.replace(/\.md$/, '')}/`,
    });
  }
  map[id] = Object.fromEntries(
    Object.entries(capabilities).sort(([a], [b]) => a.localeCompare(b)),
  );
}

await mkdir(path.join(root, 'src', 'data'), {recursive: true});
await writeFile(path.join(root, 'src', 'data', 'capabilities.json'), `${JSON.stringify(map, null, 2)}\n`, 'utf8');
const counts = Object.entries(map).map(([id, caps]) => `${id} ${Object.keys(caps).length}`);
console.log(`build-capability-map: ${counts.join(', ')}`);
