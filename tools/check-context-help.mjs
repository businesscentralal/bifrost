#!/usr/bin/env node
/**
 * Checks an app's context-sensitive help against this documentation site, from source.
 *
 * Business Central builds a page's Help URL as
 *
 *   <app.json contextSensitiveHelpUrl, {0} = the user's locale> + <ContextSensitiveHelpPage>
 *
 * so every user-facing page must name a help page that exists under help/<route>/.
 * This script reads the AL repository and the site, and reports:
 *
 *   - app.json: contextSensitiveHelpUrl (site root, {0} placeholder, route id), `help`,
 *     and helpBaseUrl when present
 *   - every page, report request page and query: ContextSensitiveHelpPage / HelpLink,
 *     the published URL for en-US and is-IS, and whether the target page exists
 *     (and has an is-IS translation, otherwise the Icelandic site shows English)
 *   - user-facing pages with no ContextSensitiveHelpPage at all
 *
 * Offline and read-only: no Business Central, no network, nothing written.
 *
 * Usage:
 *   node tools/check-context-help.mjs --app attachments --source ../bc-origo-bifrost-attachments
 *
 * Options:
 *   --app <name>        route id, title or codename (as in the generator). Required.
 *   --source <path>     AL repository or app folder (repeatable).
 *   --site-root <path>  documentation repository root (default: this script's parent).
 *   --json              print the findings as JSON instead of Markdown tables.
 *
 * Exit code 0 when everything resolves, 1 when something is missing or broken.
 */
import {existsSync} from 'node:fs';
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {isTestApp, loadSources, objectProperties, propertyText} from './lib/al-source.mjs';
import {APP_ROUTES, appJsonMatches, parseArgs, resolveApp} from './lib/app-routes.mjs';

/** Site roots the help can be served from (GitHub Pages today, the custom domain later). */
const SITE_ROOTS = ['https://businesscentralal.github.io/bifrost/', 'https://docs.bifrost.origo.is/'];
const LOCALES = [{bc: 'en-US', dir: 'en-us'}, {bc: 'is-IS', dir: 'is-is'}];

/** Page types a user never opens on their own; help is optional there. */
const NOT_USER_FACING = new Set(['api', 'headlinepart']);
const PART_TYPES = new Set(['cardpart', 'listpart']);

// ---------------------------------------------------------------------------
// Site: help page routes
// ---------------------------------------------------------------------------

function frontMatter(text) {
  const m = /^---\n([\s\S]*?)\n---/.exec(text.replace(/\r\n/g, '\n'));
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z_]+):\s*(.*)$/.exec(line);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return fm;
}

async function* walkDocs(dir, rel = '') {
  if (!existsSync(dir)) return;
  const entries = (await readdir(dir, {withFileTypes: true})).sort((a, b) => (a.name < b.name ? -1 : 1));
  for (const e of entries) {
    if (e.isDirectory()) yield* walkDocs(path.join(dir, e.name), rel ? `${rel}/${e.name}` : e.name);
    else if (/\.mdx?$/.test(e.name)) yield {file: path.join(dir, e.name), rel: rel ? `${rel}/${e.name}` : e.name};
  }
}

const stripNumberPrefix = (s) => s.replace(/^\d+[-_.]/, '');

/** Docusaurus doc path (relative to the plugin's routeBasePath) for one file. */
function docPath(rel, fm) {
  const parts = rel.split('/');
  const base = parts.pop().replace(/\.mdx?$/, '');
  const dir = parts.map(stripNumberPrefix).join('/');
  if (fm.slug) {
    const slug = fm.slug.startsWith('/') ? fm.slug : `${dir ? `${dir}/` : ''}${fm.slug}`;
    return slug.replace(/^\/+|\/+$/g, '');
  }
  const id = fm.id ?? stripNumberPrefix(base);
  if (id === 'index' || id === 'README' || (dir && id === parts[parts.length - 1])) return dir;
  return `${dir ? `${dir}/` : ''}${id}`;
}

/** Map of doc path -> { file, isFile } for help/<route>/ and its is-IS mirror. */
async function helpRoutes(siteRoot, route) {
  const en = new Map();
  for await (const {file, rel} of walkDocs(path.join(siteRoot, 'help', route))) {
    en.set(docPath(rel, frontMatter(await readFile(file, 'utf8'))), path.relative(siteRoot, file));
  }
  const is = new Map();
  const isRoot = path.join(siteRoot, 'i18n', 'is-IS', `docusaurus-plugin-content-docs-help-${route}`, 'current');
  for await (const {file, rel} of walkDocs(isRoot)) {
    is.set(docPath(rel, frontMatter(await readFile(file, 'utf8'))), path.relative(siteRoot, file));
  }
  return {en, is};
}

// ---------------------------------------------------------------------------
// Source
// ---------------------------------------------------------------------------

/** Properties of a nested block such as `requestpage { ... }` inside an object. */
function nestedBlockProperties(obj, keyword) {
  const {toks} = obj;
  let depth = 0;
  for (let i = obj.bodyStart; i <= obj.bodyEnd; i++) {
    const tk = toks[i];
    if (tk.t === 'op' && tk.v === '{') depth++;
    if (tk.t === 'op' && tk.v === '}') depth--;
    if (depth === 1 && tk.t === 'id' && tk.lc === keyword && toks[i + 1].t === 'op' && toks[i + 1].v === '{') {
      let d = 0;
      let end = i + 1;
      for (let j = i + 1; j <= obj.bodyEnd; j++) {
        if (toks[j].t === 'op' && toks[j].v === '{') d++;
        if (toks[j].t === 'op' && toks[j].v === '}') { d--; if (d === 0) { end = j; break; } }
      }
      return objectProperties({toks, bodyStart: i + 1, bodyEnd: end});
    }
  }
  return null;
}

function parseHelpUrl(url, route) {
  const findings = [];
  if (!url) return {ok: false, findings: ['contextSensitiveHelpUrl is missing']};
  const root = SITE_ROOTS.find((r) => url.startsWith(r));
  if (!root) findings.push(`site root is not one of ${SITE_ROOTS.join(', ')}`);
  if (!url.includes('{0}')) findings.push('no {0} locale placeholder');
  const rest = root ? url.slice(root.length) : url;
  const m = /^\{0\}\/help\/([^/]+)\/$/.exec(rest);
  if (!m) findings.push(`path should be {0}/help/${route}/ (with the trailing slash), found '${rest}'`);
  else if (m[1] !== route) {
    const legacy = Object.entries(APP_ROUTES).find(([owner, e]) => e.route === route && owner === m[1]);
    findings.push(legacy ? `route '${m[1]}' is the former id; it only works through a client redirect, use '${route}'` : `route '${m[1]}' does not match '${route}'`);
  }
  return {ok: findings.length === 0, root, findings};
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function main(argv) {
  const opts = parseArgs(argv, {
    app: {type: 'string'},
    source: {type: 'list', alias: ['src']},
    siteRoot: {type: 'string', alias: ['site-root']},
    json: {type: 'boolean'},
    help: {type: 'boolean', alias: ['h']},
  });
  if (opts.help) {
    const text = await readFile(fileURLToPath(import.meta.url), 'utf8');
    console.log(text.slice(text.indexOf('/**') + 3, text.indexOf('*/')).replace(/^ \* ?/gm, '').trim());
    return 0;
  }
  if (!opts.app || !opts.source?.length) throw new Error('--app and --source are required. Run with --help.');
  const owner = resolveApp(opts.app);
  const {route, title} = APP_ROUTES[owner];
  const siteRoot = path.resolve(opts.siteRoot ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));

  const {apps} = await loadSources(opts.source);
  const app = apps.find((a) => !isTestApp(a.json) && appJsonMatches(owner, a.json.name));
  if (!app) throw new Error(`No app named 'Bifrost ${title}' under --source.`);

  const routes = await helpRoutes(siteRoot, route);
  const appFindings = [];
  const url = parseHelpUrl(app.json.contextSensitiveHelpUrl, route);
  appFindings.push({property: 'contextSensitiveHelpUrl', value: app.json.contextSensitiveHelpUrl ?? '', status: url.ok ? 'ok' : 'broken', note: url.findings.join('; ')});
  if (app.json.helpBaseUrl !== undefined) {
    appFindings.push({property: 'helpBaseUrl', value: app.json.helpBaseUrl, status: 'check', note: 'helpBaseUrl is the on-premises Help Server setting; online apps use contextSensitiveHelpUrl'});
  }
  if (app.json.help !== undefined) {
    const root = SITE_ROOTS.find((r) => app.json.help.startsWith(r));
    const expected = root ? `${root}en-us/${route}/` : undefined;
    const ok = expected && app.json.help === expected && existsSync(path.join(siteRoot, 'docs', route));
    appFindings.push({property: 'help', value: app.json.help, status: ok ? 'ok' : 'broken', note: ok ? '' : `expected ${expected ?? `<site root>en-us/${route}/`}`});
  }

  const rows = [];
  const objects = [...app.objects].sort((a, b) => (a.type === b.type ? (a.id ?? 0) - (b.id ?? 0) : a.type < b.type ? -1 : 1));
  for (const obj of objects) {
    let props;
    let userFacing = false;
    let kind = obj.type;
    if (obj.type === 'page') {
      props = objectProperties(obj);
      const pageType = (propertyText(props.get('pagetype')) ?? 'Card').toLowerCase();
      kind = `page (${propertyText(props.get('pagetype')) ?? 'Card'})`;
      if (NOT_USER_FACING.has(pageType)) continue;
      userFacing = !PART_TYPES.has(pageType);
    } else if (obj.type === 'report') {
      props = nestedBlockProperties(obj, 'requestpage');
      const top = objectProperties(obj);
      kind = 'report request page';
      if (!props) {
        if (top.has('contextsensitivehelppage')) props = top;
        else continue;
      }
      userFacing = true;
      if (!props.has('helplink') && top.has('helplink')) props.set('helplink', top.get('helplink'));
    } else if (obj.type === 'query') {
      props = objectProperties(obj);
      const usage = (propertyText(props.get('usagecategory')) ?? 'None').toLowerCase();
      if (usage === 'none' && !props.has('contextsensitivehelppage')) continue;
      userFacing = usage !== 'none';
    } else if (obj.type === 'pageextension') {
      rows.push({objectType: 'pageextension', id: obj.id, name: obj.name, file: obj.file, current: '', expected: '', status: 'n/a', note: `inherits the help of "${obj.extends}" from the base page's app`});
      continue;
    } else continue;

    const cshp = propertyText(props.get('contextsensitivehelppage'));
    const helpLink = propertyText(props.get('helplink'));
    const row = {objectType: kind, id: obj.id, name: obj.name, file: obj.file, current: cshp ?? '', expected: '', status: 'ok', note: ''};
    if (helpLink !== undefined) row.note = `HelpLink = '${helpLink}'`;
    if (cshp === undefined) {
      if (helpLink !== undefined) {
        const root = SITE_ROOTS.find((r) => helpLink.startsWith(r));
        const m = root && new RegExp(`^(en-us|is-is)/help/${route}/(.+?)/?$`).exec(helpLink.slice(root.length));
        row.current = helpLink;
        if (m && routes.en.has(m[2])) { row.expected = `help/${route}/${m[2]}`; row.note = 'HelpLink (fixed locale); prefer ContextSensitiveHelpPage'; row.status = 'check'; }
        else { row.status = 'broken'; row.note = 'HelpLink does not resolve to a page in this site'; }
      } else if (userFacing) {
        row.status = 'missing';
        row.note = 'user-facing page without ContextSensitiveHelpPage';
      } else {
        row.status = 'n/a';
        row.note = 'part page; the host page provides help';
      }
      rows.push(row);
      continue;
    }
    const slug = cshp.replace(/^\/+|\/+$/g, '');
    if (slug !== cshp || /\.mdx?$/.test(cshp) || /(^|\/)(en-us|is-is|en-US|is-IS)\//.test(cshp)) {
      row.note = [row.note, 'value should be a bare slug (no slashes at the ends, no .md, no locale)'].filter(Boolean).join('; ');
      row.status = 'broken';
    }
    const target = slug.split('#')[0];
    row.expected = routes.en.get(target) ?? `help/${route}/${target}.md`;
    if (!routes.en.has(target)) {
      row.status = 'broken';
      row.note = [row.note, 'target page does not exist'].filter(Boolean).join('; ');
    } else if (!routes.is.has(target)) {
      row.note = [row.note, 'no is-IS translation (Icelandic users see English)'].filter(Boolean).join('; ');
      if (row.status === 'ok') row.status = 'ok (EN only)';
    }
    row.urls = url.root ? LOCALES.map((l) => `${url.root}${l.dir}/help/${route}/${target}/`) : [];
    rows.push(row);
  }

  const problems = [...appFindings.filter((f) => f.status === 'broken'), ...rows.filter((r) => r.status === 'broken' || r.status === 'missing')];
  if (opts.json) {
    console.log(JSON.stringify({app: app.json.name, route, appFindings, objects: rows, problems: problems.length}, null, 2));
  } else {
    console.log(`# Context-sensitive help: ${app.json.name} -> help/${route}/\n`);
    console.log('| app.json property | Value | Status | Note |\n|---|---|---|---|');
    for (const f of appFindings) console.log(`| \`${f.property}\` | \`${f.value}\` | ${f.status} | ${f.note} |`);
    console.log('\n| Object type | Id | Name | Current value | Expected docs path | Status | Note |\n|---|---|---|---|---|---|---|');
    for (const r of rows) console.log(`| ${r.objectType} | ${r.id ?? ''} | ${r.name} | ${r.current ? `\`${r.current}\`` : '(none)'} | ${r.expected ? `\`${r.expected}\`` : ''} | ${r.status} | ${r.note} |`);
    console.log(`\n${problems.length ? `${problems.length} problem(s).` : 'All context-sensitive help resolves.'}`);
    if (url.root) console.log(`Published as ${url.root}{en-us|is-is}/help/${route}/<page>/ (Business Central sends en-US/is-IS; the site's 404 page rewrites the locale case).`);
  }
  return problems.length ? 1 : 0;
}

main(process.argv.slice(2)).then((code) => process.exit(code), (err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(2);
});
