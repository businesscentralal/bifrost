/**
 * Fails when a page links to a site path that no page has: `[text](/setup/x/)` or `to: '/x/'`.
 * Fast, and runs without a build, so it catches a moved or renamed page before the preview does.
 * Covers docs/ and help/ pages, src/ components and the navbar/footer in docusaurus.config.ts.
 *
 *   node tools/check-links.mjs
 */
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function walk(dir, test) {
  const out = [];
  for (const entry of await readdir(dir, {withFileTypes: true}).catch(() => [])) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, test)));
    else if (test(entry.name)) out.push(full);
  }
  return out;
}

const appsTs = await readFile(path.join(root, 'apps.ts'), 'utf8');
const appIds = [...appsTs.matchAll(/\{id: '([a-z-]+)', title: '[^']+', appName:/g)].map((m) => m[1]);
const sectionIds = [...appsTs.matchAll(/\{id: '([a-z-]+)', title: '[^']+'\}/g)].map((m) => m[1]);

/** route prefix -> folder */
const instances = new Map();
for (const id of [...appIds, ...sectionIds]) instances.set(`/${id}`, path.join(root, 'docs', id));
for (const id of appIds) instances.set(`/help/${id}`, path.join(root, 'help', id));

const routes = new Set(['/', '/apps', '/help']);
for (const [prefix, dir] of instances) {
  for (const file of await walk(dir, (name) => /\.mdx?$/.test(name))) {
    const text = await readFile(file, 'utf8');
    const rel = path.relative(dir, file).split(path.sep).join('/').replace(/\.mdx?$/, '');
    const parts = rel.split('/');
    const slug = text.match(/^slug:\s*"?([^"\r\n]+)"?/m)?.[1]?.trim();
    let route;
    if (slug) route = slug.startsWith('/') ? slug : `/${[...parts.slice(0, -1), slug].join('/')}`;
    else route = `/${(parts.at(-1) === 'index' ? parts.slice(0, -1) : parts).join('/')}`;
    routes.add(`${prefix}${route === '/' ? '' : route.replace(/\/$/, '')}`);
  }
  for (const file of await walk(dir, (name) => name === '_category_.json')) {
    const slug = JSON.parse(await readFile(file, 'utf8')).link?.slug;
    if (slug) routes.add(`${prefix}${slug.replace(/\/$/, '')}`);
  }
}

const sources = [
  ...(await walk(path.join(root, 'docs'), (name) => /\.mdx?$/.test(name))),
  ...(await walk(path.join(root, 'help'), (name) => /\.mdx?$/.test(name))),
  ...(await walk(path.join(root, 'src'), (name) => name.endsWith('.tsx'))),
  path.join(root, 'docusaurus.config.ts'),
];
const skip = /^\/(img|skills|apps\.json|llms)/;
const broken = [];
for (const file of sources) {
  const text = await readFile(file, 'utf8');
  const links = [
    ...[...text.matchAll(/\]\((\/[^)\s#?]*)/g)].map((m) => m[1]),
    ...[...text.matchAll(/\bto[=:]\s*['"`{]+(\/[^'"`}#\s$]*)/g)].map((m) => m[1]),
  ];
  for (const link of links) {
    if (link.startsWith('//') || skip.test(link)) continue;
    const normal = link.replace(/\/$/, '') || '/';
    if (!routes.has(normal)) broken.push(`${path.relative(root, file)}: ${link}`);
  }
}

if (broken.length) {
  console.error(`check-links: ${broken.length} link(s) to pages that do not exist:\n  ${broken.join('\n  ')}`);
  process.exit(1);
}
console.log(`check-links: all site links resolve (${routes.size} pages).`);
