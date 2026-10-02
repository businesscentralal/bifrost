/**
 * Offline reader for AL source code, used by tools/check-context-help.mjs.
 *
 *   loadSources(paths)        finds every app.json and .al file under the given folders
 *   objectProperties(obj)     the top-level properties of an object, such as ContextSensitiveHelpPage
 *
 * Nothing here talks to Business Central or the network. Hidden folders are skipped.
 */
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/** A construct whose value only exists at runtime, or AL this reader does not cover. */
export class AlUnsupported extends Error {
  constructor(message, where) {
    super(where ? `${message} (${where})` : message);
    this.name = 'AlUnsupported';
  }
}

// ---------------------------------------------------------------------------
// Lexer
// ---------------------------------------------------------------------------

const TWO_CHAR_OPS = new Set([':=', '+=', '-=', '*=', '/=', '<>', '<=', '>=', '::', '..']);

/**
 * Splits AL source into tokens. String literals keep AL semantics exactly: the only
 * escape is a doubled quote, so `\u2192` or `\n` inside a literal stay literal text,
 * as they do in Business Central.
 */
export function tokenize(src, file = '') {
  const toks = [];
  let i = 0;
  let line = 1;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (c === ' ' || c === '\t' || c === '\r' || c === '\f' || c === '\v' || c === '\uFEFF') { i++; continue; }
    if (c === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') line++; i++; }
      i += 2;
      continue;
    }
    if (c === "'") {
      const startLine = line;
      let s = '';
      i++;
      for (;;) {
        if (i >= n) throw new AlUnsupported('Unterminated string literal', `${file}:${startLine}`);
        if (src[i] === "'") {
          if (src[i + 1] === "'") { s += "'"; i += 2; continue; }
          i++;
          break;
        }
        if (src[i] === '\n') line++;
        s += src[i++];
      }
      toks.push({t: 'str', v: s, line: startLine});
      continue;
    }
    if (c === '"') {
      let s = '';
      i++;
      while (i < n && src[i] !== '"' && src[i] !== '\n') s += src[i++];
      i++;
      toks.push({t: 'qid', v: s, lc: s.toLowerCase(), line});
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let s = '';
      while (i < n && /[A-Za-z0-9_]/.test(src[i])) s += src[i++];
      toks.push({t: 'id', v: s, lc: s.toLowerCase(), line});
      continue;
    }
    if (/[0-9]/.test(c)) {
      let s = '';
      while (i < n && /[0-9]/.test(src[i])) s += src[i++];
      if (src[i] === '.' && /[0-9]/.test(src[i + 1] ?? '')) {
        s += src[i++];
        while (i < n && /[0-9]/.test(src[i])) s += src[i++];
      }
      // Date/time literals (0D, 0T, 0DT) and BigInteger suffixes are kept as a marker.
      let suffix = '';
      while (i < n && /[A-Za-z]/.test(src[i])) suffix += src[i++];
      toks.push({t: 'num', v: Number(s), suffix, line});
      continue;
    }
    const two = src.substr(i, 2);
    if (TWO_CHAR_OPS.has(two)) { toks.push({t: 'op', v: two, line}); i += 2; continue; }
    toks.push({t: 'op', v: c, line});
    i++;
  }
  toks.push({t: 'eof', v: '', line});
  return toks;
}

// ---------------------------------------------------------------------------
// Object scanner
// ---------------------------------------------------------------------------

const OBJECT_TYPES = new Set([
  'codeunit', 'table', 'tableextension', 'page', 'pageextension', 'pagecustomization', 'report',
  'reportextension', 'query', 'xmlport', 'enum', 'enumextension', 'interface', 'permissionset',
  'permissionsetextension', 'profile', 'profileextension', 'controladdin', 'entitlement',
  'dotnet', 'reportlayout',
]);

const tokName = (tok) => (tok && (tok.t === 'id' || tok.t === 'qid') ? tok.v : undefined);

/** Index of the token that closes the brace/paren/bracket opened at `start`. */
function matchClose(toks, start) {
  const open = toks[start].v;
  const close = {'{': '}', '(': ')', '[': ']'}[open];
  let depth = 0;
  for (let i = start; i < toks.length; i++) {
    const tk = toks[i];
    if (tk.t !== 'op') continue;
    if (tk.v === open) depth++;
    else if (tk.v === close) { depth--; if (depth === 0) return i; }
  }
  throw new AlUnsupported(`Unbalanced '${open}'`, `line ${toks[start].line}`);
}

/**
 * Finds the AL objects in one file: type, id, name, `extends`/`implements`, and the
 * token range of the body. Namespace and using directives are skipped.
 */
export function scanObjects(toks, file) {
  const objects = [];
  let i = 0;
  let namespace = '';
  while (toks[i].t !== 'eof') {
    const tk = toks[i];
    if (tk.t === 'id' && (tk.lc === 'namespace' || tk.lc === 'using')) {
      let j = i + 1;
      const parts = [];
      while (toks[j].t !== 'eof' && !(toks[j].t === 'op' && toks[j].v === ';')) { parts.push(toks[j].v); j++; }
      if (tk.lc === 'namespace') namespace = parts.join('');
      i = j + 1;
      continue;
    }
    if (tk.t === 'id' && OBJECT_TYPES.has(tk.lc)) {
      const obj = {type: tk.lc, file, line: tk.line, namespace, id: undefined, name: undefined, extends: undefined, implements: []};
      let j = i + 1;
      if (toks[j].t === 'num') { obj.id = toks[j].v; j++; }
      obj.name = tokName(toks[j]);
      j++;
      while (toks[j].t !== 'eof' && !(toks[j].t === 'op' && toks[j].v === '{')) {
        if (toks[j].t === 'id' && toks[j].lc === 'extends') {
          // `extends Namespace."Name"` - keep the last name part.
          let k = j + 1;
          while (toks[k + 1] && toks[k + 1].t === 'op' && toks[k + 1].v === '.') k += 2;
          obj.extends = tokName(toks[k]);
          j = k;
        } else if (toks[j].t === 'id' && toks[j].lc === 'implements') {
          let k = j + 1;
          for (;;) {
            while (toks[k + 1] && toks[k + 1].t === 'op' && toks[k + 1].v === '.') k += 2;
            obj.implements.push(tokName(toks[k]));
            if (toks[k + 1].t === 'op' && toks[k + 1].v === ',') { k += 2; continue; }
            break;
          }
          j = k;
        }
        j++;
      }
      if (toks[j].t === 'eof') break;
      obj.bodyStart = j;
      obj.bodyEnd = matchClose(toks, j);
      obj.toks = toks;
      objects.push(obj);
      i = obj.bodyEnd + 1;
      continue;
    }
    i++;
  }
  return objects;
}

/**
 * Top-level properties of an object body (`Name = value;` at brace depth 1), as the raw
 * token list of the value. Section keywords (layout, actions, var, procedure...) are
 * skipped with their blocks.
 */
export function objectProperties(obj) {
  const {toks} = obj;
  const props = new Map();
  let i = obj.bodyStart + 1;
  while (i < obj.bodyEnd) {
    const tk = toks[i];
    if (tk.t === 'op' && (tk.v === '{' || tk.v === '(' || tk.v === '[')) { i = matchClose(toks, i) + 1; continue; }
    if (tk.t === 'id' && toks[i + 1].t === 'op' && toks[i + 1].v === '=') {
      let j = i + 2;
      const value = [];
      while (j < obj.bodyEnd && !(toks[j].t === 'op' && toks[j].v === ';')) {
        if (toks[j].t === 'op' && (toks[j].v === '{')) break;
        value.push(toks[j]);
        j++;
      }
      if (!props.has(tk.lc)) props.set(tk.lc, {name: tk.v, value, line: tk.line});
      i = j + 1;
      continue;
    }
    i++;
  }
  return props;
}

/** First string (or identifier) of a property value, e.g. `Caption = 'x', Locked = true`. */
export function propertyText(prop) {
  if (!prop) return undefined;
  const first = prop.value[0];
  if (!first) return '';
  return first.t === 'str' ? first.v : first.v;
}

// ---------------------------------------------------------------------------
// Source loading
// ---------------------------------------------------------------------------

const SKIP_DIRS = new Set(['.git', 'node_modules', '.alpackages', '.alcache', '.snapshots', 'build', '.output']);

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, {withFileTypes: true});
  } catch (err) {
    if (err && err.code === 'ENOENT') return;
    throw err;
  }
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Hidden folders (.git, .claude worktrees, .alpackages ...) hold copies or symbols, never the app's source.
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

function stripJsonComments(text) {
  return text.replace(/^\uFEFF/, '').replace(/("(?:[^"\\]|\\.)*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (m, str) => str ?? '');
}

/**
 * Loads every AL app found under the given folders. Each .al file belongs to the app
 * whose app.json is the nearest one above it; files with no app.json are ignored.
 * Returns { apps: [{ dir, json, objects }], objects } with deterministic ordering.
 */
export async function loadSources(roots) {
  const appDirs = new Map();
  const alFiles = [];
  for (const root of roots) {
    const absRoot = path.resolve(root);
    for await (const file of walk(absRoot)) {
      const base = path.basename(file);
      if (base === 'app.json') {
        const json = JSON.parse(stripJsonComments(await readFile(file, 'utf8')));
        if (json && json.id && json.name) appDirs.set(path.dirname(file), {dir: path.dirname(file), root: absRoot, json, objects: []});
      } else if (/\.al$/i.test(base)) {
        alFiles.push(file);
      }
    }
  }
  const dirs = [...appDirs.keys()].sort((a, b) => b.length - a.length);
  const allObjects = [];
  for (const file of alFiles) {
    const owner = dirs.find((d) => file === d || file.startsWith(d + path.sep));
    if (!owner) continue;
    const app = appDirs.get(owner);
    const src = await readFile(file, 'utf8');
    const rel = path.relative(app.root, file).split(path.sep).join('/');
    const toks = tokenize(src, rel);
    for (const obj of scanObjects(toks, rel)) {
      obj.app = app;
      app.objects.push(obj);
      allObjects.push(obj);
    }
  }
  const apps = [...appDirs.values()].sort((a, b) => (a.dir < b.dir ? -1 : 1));
  return {apps, objects: allObjects};
}

/** True for a test app: its name says so, or it depends on the Microsoft test libraries. */
export function isTestApp(appJson) {
  if (/\btests?\b/i.test(appJson.name ?? '')) return true;
  const deps = appJson.dependencies ?? [];
  return deps.some((d) => /^(Library Assert|Test Runner|Any|Library Variable Storage)$/i.test(d.name ?? ''));
}

// ---------------------------------------------------------------------------
// Parser (procedure bodies)
// ---------------------------------------------------------------------------

