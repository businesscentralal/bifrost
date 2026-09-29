#!/usr/bin/env node
/**
 * Generates the message-type reference pages from an app's AL source code.
 *
 * The offline counterpart of tools/generate-message-type-docs.ps1. Instead of asking a
 * running Business Central environment for `Help.MessageTypes.Get` and
 * `Help.Implementation.Get`, it reads the app repository:
 *
 *   1. app.json                        the app (name, id, publisher, version)
 *   2. enumextension ... extends       the message types: one value per type, with the
 *      "Message Type ori"              codeunit that implements "Msg Interface ori"
 *   3. that codeunit's                 the help contract, evaluated with a small AL
 *      GetMessageHelpAsMarkdownDocument interpreter (TextBuilder, labels, StrSubstNo,
 *                                     Format, if/case, calls into help codeunits)
 *
 * and writes one page per type into docs/<route>/reference/message-types/, in exactly
 * the format of the API generator (front matter, info box, MDX escaping, the shared
 * "Errors and warnings" pointer that Help.Implementation.Get appends to every non-Help
 * type, sidebar positions in sorted order, and the two _category_.json files).
 *
 * It needs no credentials, no network and no Business Central. The same source gives
 * the same pages byte for byte.
 *
 * Usage:
 *   node tools/generate-message-type-docs-from-source.mjs --app attachments \
 *        --source ../bc-origo-bifrost-attachments --version 28.0.0.36
 *
 * Options:
 *   --app <name>        App to document: route id (attachments), title (Attachments,
 *                       Bifrost Attachments) or codename (hnitbjorg). Required.
 *   --source <path>     AL repository or app folder. Repeat for apps whose help calls
 *                       into another repository (for example a shared Foundation
 *                       help builder). Only the --app app's own types are documented.
 *   --version <x.y.z.w> Version reported where help reads NavApp.GetCurrentModuleInfo.
 *                       AL-Go stamps the build number at build time, so app.json
 *                       usually says x.y.0.0; pass the released version here.
 *   --site-root <path>  Documentation repository root. Defaults to this script's parent.
 *   --list-only         Print the types, their owner and direction; write nothing.
 *   --check             Write nothing; exit 1 when a page on disk differs from the
 *                       generated one (or is missing).
 *   --prune             Delete generated pages whose type no longer exists in source.
 *   --help              Show this text.
 */
import {existsSync} from 'node:fs';
import {mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

import {AlUnsupported, ArgumentMock, Interpreter, enumValues, isTestApp, loadSources} from './lib/al-source.mjs';
import {APP_ROUTES, appJsonMatches, isExcludedType, ownerByPrefix, parseArgs, resolveApp} from './lib/app-routes.mjs';

const GENERATOR = 'tools/generate-message-type-docs-from-source.mjs';
const MESSAGE_TYPE_ENUM = 'message type ori';
const MESSAGE_INTERFACE = 'msg interface ori';
const ERRORS_POINTER = 'Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).';

// ---------------------------------------------------------------------------
// Page format (kept identical to tools/generate-message-type-docs.ps1)
// ---------------------------------------------------------------------------

/**
 * MDX reads `{` as an expression and `<Word` as a JSX tag. Code spans and fences are
 * parked, braces and every `<` outside them are escaped, then pipes inside inline code
 * on table rows are escaped so the span does not split the cell.
 */
export function toMdxSafe(markdown) {
  const fences = [];
  const parked = markdown.replace(/```[\s\S]*?```|`[^`\n]*`/g, (m) => {
    fences.push(m);
    return `\u0000${fences.length - 1}\u0000`;
  });
  const escaped = parked.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;').replace(/</g, '&lt;');
  const restored = escaped.replace(/\u0000(\d+)\u0000/g, (m, i) => fences[Number(i)]);
  return restored
    .split('\n')
    .map((line) => (line.trimStart().startsWith('|')
      ? line.replace(/`([^`\n]*)`/g, (m, body) => (body.includes('|') ? '`' + body.replace(/(?<!\\)\|/g, '\\|') + '`' : m))
      : line))
    .join('\n');
}

export function slugFor(type) {
  return type.replace(/\./g, '-').toLowerCase();
}

/** PowerShell's Sort-Object on strings: case-insensitive first, ordinal to break ties. */
function compareTypes(a, b) {
  const la = a.toLowerCase();
  const lb = b.toLowerCase();
  if (la !== lb) return la < lb ? -1 : 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Known help-text defects, reported (never fixed) so they can be fixed in the app.
 * AL string literals decode no escapes, so `\u2192` or `\n` in a label reach the API,
 * and the site, as those literal characters.
 */
const HELP_LINTS = [
  {id: 'unicode-escape', re: /\\u[0-9a-fA-F]{4}/, text: 'literal \\uXXXX escape in the help text (AL does not decode escapes; use the character itself)'},
  {id: 'newline-escape', re: /\\n/, text: 'literal \\n in the help text (AL does not decode escapes; use AppendLine)'},
  {id: 'backslash-break', re: /\S\\- /, text: "'\\' used as a line break (it is only a line break in Message/Error dialogs)"},
  {id: 'mcp-tool-names', re: /\b(call_message_type|get_message_type_help|invoke_message_type)\b/, text: 'help names an MCP tool rather than the message type contract (help defect #12)'},
];

/** The markdown Help.Implementation.Get would return for one type. */
function asHelpImplementationResponse(type, markdown) {
  // Foundation appends the shared "Errors and warnings" section to every type except
  // the Help.* types; the page writer replaces it with a link, as the API tool does.
  if (type.startsWith('Help.')) return markdown;
  return `${markdown}\n## Errors and warnings\n(shared section)\n`;
}

export function renderPage(type, markdown, position) {
  const slug = slugFor(type);
  let body = toMdxSafe(markdown.replace(/\r\n?/g, '\n').trim());
  body = body.replace(/^#[ \t]+.*\n/, '');
  body = body.replace(/\n## Errors and warnings\n[\s\S]*$/, `\n## Errors and warnings\n${ERRORS_POINTER}`);
  const frontMatter = [
    '---',
    `id: ${slug}`,
    `title: "${type}"`,
    `sidebar_label: "${type}"`,
    `sidebar_position: ${position}`,
    `description: "Request and response contract for the ${type} Bifröst message type."`,
    '---',
    '',
    ':::info Generated page',
    "This page is generated from the message type's own help codeunit by",
    `\`${GENERATOR}\`. Edit the help codeunit in the app, not this file.`,
    ':::',
    '',
  ].join('\n');
  return `${frontMatter}\n${body}\n\n`;
}

function categoryJson() {
  return JSON.stringify({
    label: 'Message types',
    position: 1,
    link: {
      type: 'generated-index',
      slug: '/reference/message-types',
      description: "Every message type this app adds to the Bifröst catalogue. Generated from the app's own help codeunits.",
    },
  }, null, 2) + '\n';
}

function referenceCategoryJson() {
  return JSON.stringify({
    label: 'Reference',
    position: 4,
    link: {type: 'generated-index', slug: '/reference', description: 'Developer reference for this app.'},
  }, null, 2) + '\n';
}

// ---------------------------------------------------------------------------
// Source -> message types
// ---------------------------------------------------------------------------

/** Message types declared by one app: enum (Foundation) or enum extensions of it. */
function declaredTypes(app) {
  const types = [];
  for (const obj of app.objects) {
    const isBase = obj.type === 'enum' && (obj.name ?? '').toLowerCase() === MESSAGE_TYPE_ENUM;
    const isExt = obj.type === 'enumextension' && (obj.extends ?? '').toLowerCase() === MESSAGE_TYPE_ENUM;
    if (!isBase && !isExt) continue;
    for (const v of enumValues(obj)) {
      types.push({
        type: v.caption ?? v.name,
        valueName: v.name,
        ordinal: v.ordinal,
        implementation: v.implementations.get(MESSAGE_INTERFACE),
        declaredIn: `${obj.file}:${v.line}`,
      });
    }
  }
  return types;
}

function gitHead(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).trim();
  } catch {
    return undefined;
  }
}

/** Runs one Msg Interface procedure on a fresh implementation instance. */
function runInterface(interp, implName, procedure, subject) {
  const inst = interp.newCodeunit(implName);
  if (procedure === 'GetMessageHelpAsMarkdownDocument') {
    const argument = new ArgumentMock(subject);
    interp.callProcedure(inst, procedure, [{isRef: true, ref: {type: {base: 'record', name: 'Message Argument ori'}, value: argument}}]);
    if (argument.fields.get('content type') !== 'text/markdown') {
      throw new AlUnsupported('Help did not set a Markdown response (SetResponseMarkdown was not reached)');
    }
    return argument.responseText;
  }
  return interp.callProcedure(inst, procedure, []);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const HELP = fileURLToPath(import.meta.url);

async function main(argv) {
  const opts = parseArgs(argv, {
    app: {type: 'string'},
    source: {type: 'list', alias: ['src']},
    version: {type: 'string'},
    siteRoot: {type: 'string', alias: ['site-root']},
    listOnly: {type: 'boolean', alias: ['list-only']},
    check: {type: 'boolean'},
    prune: {type: 'boolean'},
    help: {type: 'boolean', alias: ['h']},
  });
  if (opts.help) {
    const text = await readFile(HELP, 'utf8');
    console.log(text.slice(text.indexOf('/**') + 3, text.indexOf('*/')).replace(/^ \* ?/gm, '').trim());
    return 0;
  }
  if (!opts.app) throw new Error('--app is required. Run with --help.');
  if (!opts.source?.length) throw new Error('--source is required (the AL repository to read). Run with --help.');
  if (opts.version && !/^\d+\.\d+\.\d+\.\d+$/.test(opts.version)) throw new Error(`--version must look like 28.0.0.36, not '${opts.version}'.`);

  const owner = resolveApp(opts.app);
  const {route, title} = APP_ROUTES[owner];
  const siteRoot = path.resolve(opts.siteRoot ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
  console.log(`App: ${opts.app} -> route '${route}' (docs/${route}/reference/message-types/).`);

  const {apps, objects} = await loadSources(opts.source);
  const candidates = apps.filter((a) => !isTestApp(a.json) && appJsonMatches(owner, a.json.name));
  if (candidates.length !== 1) {
    const found = apps.map((a) => `${a.json.name} (${path.relative(process.cwd(), a.dir) || '.'})`).join('; ') || 'none';
    throw new Error(`Expected exactly one app named 'Bifrost ${title}' under --source, found ${candidates.length}. Apps found: ${found}.`);
  }
  const app = candidates[0];
  const version = opts.version ?? app.json.version;
  if (!opts.version && /\.0\.0$/.test(app.json.version ?? '')) {
    console.warn(`Warning: app.json says ${app.json.version}, which looks like the unstamped AL-Go placeholder. Pass --version with the released build.`);
  }
  for (const root of opts.source) {
    const sha = gitHead(root);
    console.log(`Source: ${path.resolve(root)}${sha ? ` @ ${sha}` : ''}`);
  }
  console.log(`${app.json.name} ${version} (${app.json.id})`);

  const interp = new Interpreter(objects, {versions: new Map([[app.json.id.toLowerCase(), version]])});

  const declared = declaredTypes(app);
  const planned = [];
  const excluded = [];
  const warnings = [];
  for (const entry of declared) {
    if (isExcludedType(entry.type)) { excluded.push(entry.type); continue; }
    const prefixOwner = ownerByPrefix(entry.type);
    if (prefixOwner !== owner) {
      warnings.push(`${entry.type} is declared by ${app.json.name} but the prefix table files it under '${prefixOwner}'. Add its prefix to PREFIX_MAP (and to the API tool's $PrefixMap).`);
    }
    planned.push(entry);
  }
  planned.sort((a, b) => compareTypes(a.type, b.type));

  console.log(`Source: ${declared.length} message type(s) declared; ${planned.length} to document; ${excluded.length} excluded (test-only).`);
  for (const w of warnings) console.warn(`Warning: ${w}`);

  if (opts.listOnly) {
    const rows = planned.map((p) => {
      let direction = '';
      try {
        const d = runInterface(interp, p.implementation, 'GetMessageDirection');
        direction = d && d.kind === 'enum' ? d.name : String(d ?? '');
      } catch (e) {
        direction = `? (${e.message})`;
      }
      return {type: p.type, route, direction};
    });
    const w = Math.max(...rows.map((r) => r.type.length), 4);
    console.log(`\n${'Type'.padEnd(w)}  Route         Direction`);
    for (const r of rows) console.log(`${r.type.padEnd(w)}  ${r.route.padEnd(12)}  ${r.direction}`);
    if (excluded.length) console.log(`\nExcluded (test-only, never published): ${excluded.sort().join(', ')}`);
    return 0;
  }

  if (!existsSync(path.join(siteRoot, 'docs', route))) {
    throw new Error(`No docs folder for route '${route}' under ${siteRoot}/docs. Add the app to apps.ts first.`);
  }

  const folder = path.join(siteRoot, 'docs', route, 'reference', 'message-types');
  const files = new Map();
  const failed = [];
  const lintHits = new Map();
  planned.forEach((p, idx) => {
    try {
      if (!p.implementation) throw new AlUnsupported(`No "Msg Interface ori" implementation on the enum value (${p.declaredIn})`);
      const markdown = runInterface(interp, p.implementation, 'GetMessageHelpAsMarkdownDocument', p.type);
      if (!markdown.trim()) throw new AlUnsupported('Help rendered empty');
      for (const lint of HELP_LINTS) {
        if (lint.re.test(markdown)) lintHits.set(lint.id, [...(lintHits.get(lint.id) ?? []), p.type]);
      }
      files.set(path.join(folder, `${slugFor(p.type)}.md`), renderPage(p.type, asHelpImplementationResponse(p.type, markdown), idx + 1));
    } catch (e) {
      failed.push(`${p.type}: ${e.message}`);
    }
  });
  files.set(path.join(folder, '_category_.json'), categoryJson());
  const referenceCategory = path.join(siteRoot, 'docs', route, 'reference', '_category_.json');
  if (!existsSync(referenceCategory)) files.set(referenceCategory, referenceCategoryJson());

  // Generated pages on disk whose type is gone from source.
  const stale = [];
  if (existsSync(folder)) {
    for (const name of (await readdir(folder)).sort()) {
      const full = path.join(folder, name);
      if (!name.endsWith('.md') || files.has(full)) continue;
      const text = await readFile(full, 'utf8');
      if (text.includes(':::info Generated page')) stale.push(full);
    }
  }

  let changed = 0;
  const report = [];
  for (const [file, content] of files) {
    const current = existsSync(file) ? await readFile(file, 'utf8') : undefined;
    const state = current === undefined ? 'new' : current === content ? 'unchanged' : 'changed';
    if (state !== 'unchanged') changed++;
    report.push(`  ${state.padEnd(9)} ${path.relative(siteRoot, file)}`);
    if (!opts.check && state !== 'unchanged') {
      await mkdir(path.dirname(file), {recursive: true});
      await writeFile(file, content, 'utf8');
    }
  }
  for (const file of stale) {
    report.push(`  ${(opts.prune && !opts.check ? 'deleted' : 'stale').padEnd(9)} ${path.relative(siteRoot, file)}`);
    if (opts.prune && !opts.check) await rm(file);
  }
  console.log(report.join('\n'));
  console.log(`\n${opts.check ? 'Would write' : 'Wrote'} ${changed} file(s); ${files.size - changed} unchanged; ${stale.length} stale${stale.length && !opts.prune ? ' (rerun with --prune to delete)' : ''}.`);

  if (lintHits.size) {
    console.warn('\nHelp-text defects found in source (left as they are; fix them in the app):');
    for (const lint of HELP_LINTS) {
      const types = lintHits.get(lint.id);
      if (types) console.warn(`  ${lint.text}: ${types.length} type(s): ${types.join(', ')}`);
    }
  }
  if (failed.length) {
    console.error(`\n${failed.length} type(s) could not be generated from source:`);
    for (const f of failed) console.error(`  ${f}`);
    return 1;
  }
  if (opts.check && (changed || stale.length)) return 1;
  return 0;
}

main(process.argv.slice(2)).then((code) => process.exit(code), (err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(2);
});
