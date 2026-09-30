/**
 * Offline reader for AL source code, shared by the source-based documentation tools.
 *
 *   loadSources(paths)        finds every app.json and .al file under the given folders
 *   Interpreter               runs the small, side-effect-free subset of AL that help
 *                             codeunits are written in (TextBuilder, labels, StrSubstNo,
 *                             Format, if/case/foreach, codeunit calls)
 *
 * Nothing here talks to Business Central or the network. Anything that only exists at
 * runtime (database records, installed-app enum composition, the caller's module, the
 * current user or company) raises AlUnsupported with the file and line, so a caller can
 * report exactly which message type could not be rendered from source and why.
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

class ExitSignal {
  constructor(value) {
    this.value = value;
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

/** Values of an enum or enum extension: ordinal, name, caption, implementations. */
export function enumValues(obj) {
  const {toks} = obj;
  const values = [];
  let i = obj.bodyStart + 1;
  while (i < obj.bodyEnd) {
    const tk = toks[i];
    if (tk.t === 'id' && tk.lc === 'value' && toks[i + 1].t === 'op' && toks[i + 1].v === '(') {
      const close = matchClose(toks, i + 1);
      const ordinal = toks[i + 2].v;
      const name = tokName(toks[i + 4]);
      const value = {ordinal, name, caption: undefined, implementations: new Map(), line: tk.line};
      let j = close + 1;
      if (toks[j].t === 'op' && toks[j].v === '{') {
        const end = matchClose(toks, j);
        for (let k = j + 1; k < end; k++) {
          const p = toks[k];
          if (p.t === 'id' && p.lc === 'caption' && toks[k + 1].v === '=' && toks[k + 2].t === 'str') value.caption = toks[k + 2].v;
          if (p.t === 'id' && p.lc === 'implementation' && toks[k + 1].v === '=') {
            // Implementation = "Interface A" = "Codeunit A", "Interface B" = "Codeunit B";
            let m = k + 2;
            while (m < end && !(toks[m].t === 'op' && toks[m].v === ';')) {
              const iface = tokName(toks[m]);
              if (iface && toks[m + 1].v === '=') {
                value.implementations.set(iface.toLowerCase(), tokName(toks[m + 2]));
                m += 3;
              } else m++;
            }
          }
        }
        i = end + 1;
      } else i = j;
      values.push(value);
      continue;
    }
    if (tk.t === 'op' && tk.v === '{') { i = matchClose(toks, i) + 1; continue; }
    i++;
  }
  return values;
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
      if (SKIP_DIRS.has(entry.name)) continue;
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

class Parser {
  constructor(toks, pos, file) {
    this.toks = toks;
    this.pos = pos;
    this.file = file;
  }

  get tk() { return this.toks[this.pos]; }
  peek(o = 1) { return this.toks[this.pos + o]; }
  where(tok = this.tk) { return `${this.file}:${tok.line}`; }
  isOp(v, tok = this.tk) { return tok.t === 'op' && tok.v === v; }
  isKw(v, tok = this.tk) { return tok.t === 'id' && tok.lc === v; }
  next() { return this.toks[this.pos++]; }
  expectOp(v) {
    if (!this.isOp(v)) throw new AlUnsupported(`Expected '${v}' but found '${this.tk.v}'`, this.where());
    return this.next();
  }
  expectKw(v) {
    if (!this.isKw(v)) throw new AlUnsupported(`Expected '${v}' but found '${this.tk.v}'`, this.where());
    return this.next();
  }
  skipOp(v) { if (this.isOp(v)) { this.pos++; return true; } return false; }

  /** `A, B: Type;` lines until a token that cannot start a declaration. */
  parseVarSection() {
    const decls = [];
    while ((this.tk.t === 'id' || this.tk.t === 'qid') && !['begin', 'procedure', 'local', 'internal', 'protected', 'trigger', 'var'].includes(this.tk.lc)) {
      const names = [this.next().v];
      while (this.skipOp(',')) names.push(this.next().v);
      this.expectOp(':');
      const type = this.parseType([';']);
      this.expectOp(';');
      for (const name of names) decls.push({name, lc: name.toLowerCase(), type});
    }
    return decls;
  }

  /** Reads a type up to one of the terminator ops at depth 0. */
  parseType(terminators, stopKeywords = []) {
    const start = this.pos;
    let depth = 0;
    while (this.tk.t !== 'eof') {
      if (depth === 0 && this.tk.t === 'id' && stopKeywords.includes(this.tk.lc) && this.pos > start) break;
      if (this.tk.t === 'op') {
        if (depth === 0 && terminators.includes(this.tk.v)) break;
        if (this.tk.v === '(' || this.tk.v === '[') depth++;
        if (this.tk.v === ')' || this.tk.v === ']') depth--;
      }
      this.pos++;
    }
    return describeType(this.toks.slice(start, this.pos));
  }

  parseProcedure() {
    const nameTok = this.next();
    const proc = {name: nameTok.v, lc: nameTok.v.toLowerCase(), params: [], locals: [], body: null, line: nameTok.line, file: this.file};
    this.expectOp('(');
    while (!this.isOp(')')) {
      const byRef = this.isKw('var') ? (this.next(), true) : false;
      const pname = this.next().v;
      this.expectOp(':');
      const type = this.parseType([';', ')']);
      proc.params.push({name: pname, lc: pname.toLowerCase(), type, byRef});
      this.skipOp(';');
    }
    this.expectOp(')');
    if (this.isOp(':')) {
      this.next();
      proc.returnType = this.parseType([';'], ['var', 'begin']);
    } else if ((this.tk.t === 'id' || this.tk.t === 'qid') && this.isOp(':', this.peek())) {
      proc.returnName = this.next().v;
      this.next();
      proc.returnType = this.parseType([';'], ['var', 'begin']);
    }
    this.skipOp(';');
    if (this.isKw('var')) { this.next(); proc.locals = this.parseVarSection(); }
    proc.body = this.parseBlock();
    this.skipOp(';');
    return proc;
  }

  parseBlock() {
    this.expectKw('begin');
    const stmts = [];
    while (!this.isKw('end')) {
      if (this.tk.t === 'eof') throw new AlUnsupported('Unterminated begin', this.where());
      if (this.skipOp(';')) continue;
      stmts.push(this.parseStatement());
      if (!this.isKw('end')) this.skipOp(';');
    }
    this.next();
    return {k: 'block', stmts};
  }

  parseStatement() {
    const tk = this.tk;
    const where = this.where();
    if (this.isOp(';')) return {k: 'empty'};
    if (this.isKw('begin')) return this.parseBlock();
    if (this.isKw('if')) {
      this.next();
      const cond = this.parseExpr();
      this.expectKw('then');
      const then = this.isKw('else') ? {k: 'empty'} : this.parseStatement();
      let otherwise = null;
      if (this.isKw('else')) { this.next(); otherwise = this.isOp(';') || this.isKw('end') ? {k: 'empty'} : this.parseStatement(); }
      return {k: 'if', cond, then, otherwise, where};
    }
    if (this.isKw('case')) {
      this.next();
      const selector = this.parseExpr();
      this.expectKw('of');
      const branches = [];
      let otherwise = null;
      while (!this.isKw('end')) {
        if (this.skipOp(';')) continue;
        if (this.isKw('else')) {
          this.next();
          const stmts = [];
          while (!this.isKw('end')) {
            if (this.skipOp(';')) continue;
            stmts.push(this.parseStatement());
          }
          otherwise = {k: 'block', stmts};
          break;
        }
        const labels = [];
        do {
          const lo = this.parseExpr();
          if (this.skipOp('..')) labels.push({lo, hi: this.parseExpr()});
          else labels.push({lo});
        } while (this.skipOp(','));
        this.expectOp(':');
        const body = this.parseStatement();
        branches.push({labels, body});
      }
      this.next();
      return {k: 'case', selector, branches, otherwise, where};
    }
    if (this.isKw('exit')) {
      this.next();
      if (this.isOp('(')) {
        this.next();
        if (this.skipOp(')')) return {k: 'exit', value: null, where};
        const value = this.parseExpr();
        this.expectOp(')');
        return {k: 'exit', value, where};
      }
      return {k: 'exit', value: null, where};
    }
    if (this.isKw('foreach')) {
      this.next();
      const varName = this.next().v;
      this.expectKw('in');
      const list = this.parseExpr();
      this.expectKw('do');
      return {k: 'foreach', varName, list, body: this.parseStatement(), where};
    }
    if (this.isKw('for')) {
      this.next();
      const varName = this.next().v;
      this.expectOp(':=');
      const from = this.parseExpr();
      const down = this.isKw('downto');
      this.next();
      const to = this.parseExpr();
      this.expectKw('do');
      return {k: 'for', varName, from, to, down, body: this.parseStatement(), where};
    }
    if (this.isKw('while')) {
      this.next();
      const cond = this.parseExpr();
      this.expectKw('do');
      return {k: 'while', cond, body: this.parseStatement(), where};
    }
    if (this.isKw('repeat')) {
      this.next();
      const stmts = [];
      while (!this.isKw('until')) {
        if (this.skipOp(';')) continue;
        stmts.push(this.parseStatement());
      }
      this.next();
      return {k: 'repeat', body: {k: 'block', stmts}, cond: this.parseExpr(), where};
    }
    if (this.isKw('with') || this.isKw('asserterror')) {
      throw new AlUnsupported(`'${tk.v}' statements are not supported`, where);
    }
    const target = this.parseExpr();
    if (this.tk.t === 'op' && [':=', '+=', '-=', '*=', '/='].includes(this.tk.v)) {
      const op = this.next().v;
      return {k: 'assign', target, op, value: this.parseExpr(), where};
    }
    return {k: 'expr', expr: target, where};
  }

  parseExpr() {
    let left = this.parseAdd();
    for (;;) {
      const tk = this.tk;
      if (tk.t === 'op' && ['=', '<>', '<', '<=', '>', '>='].includes(tk.v)) {
        this.next();
        left = {k: 'bin', op: tk.v, left, right: this.parseAdd(), where: this.where(tk)};
      } else if (this.isKw('in')) {
        this.next();
        left = {k: 'in', left, right: this.parseAdd(), where: this.where(tk)};
      } else return left;
    }
  }

  parseAdd() {
    let left = this.parseMul();
    for (;;) {
      const tk = this.tk;
      if ((tk.t === 'op' && (tk.v === '+' || tk.v === '-')) || this.isKw('or') || this.isKw('xor')) {
        this.next();
        left = {k: 'bin', op: tk.t === 'op' ? tk.v : tk.lc, left, right: this.parseMul(), where: this.where(tk)};
      } else return left;
    }
  }

  parseMul() {
    let left = this.parseUnary();
    for (;;) {
      const tk = this.tk;
      if ((tk.t === 'op' && (tk.v === '*' || tk.v === '/')) || this.isKw('div') || this.isKw('mod') || this.isKw('and')) {
        this.next();
        left = {k: 'bin', op: tk.t === 'op' ? tk.v : tk.lc, left, right: this.parseUnary(), where: this.where(tk)};
      } else return left;
    }
  }

  parseUnary() {
    const tk = this.tk;
    if (this.isKw('not')) { this.next(); return {k: 'not', expr: this.parseUnary(), where: this.where(tk)}; }
    if (this.isOp('-')) { this.next(); return {k: 'neg', expr: this.parseUnary(), where: this.where(tk)}; }
    if (this.isOp('+')) { this.next(); return this.parseUnary(); }
    return this.parsePostfix();
  }

  parsePostfix() {
    let expr = this.parsePrimary();
    for (;;) {
      const tk = this.tk;
      if (this.isOp('.') && !this.isOp('.', this.peek())) {
        this.next();
        const name = this.next();
        expr = {k: 'member', obj: expr, name: name.v, lc: name.v.toLowerCase(), where: this.where(name)};
      } else if (this.isOp('(')) {
        this.next();
        const args = [];
        while (!this.isOp(')')) {
          args.push(this.parseExpr());
          if (!this.skipOp(',')) break;
        }
        this.expectOp(')');
        expr = {k: 'call', callee: expr, args, where: this.where(tk)};
      } else if (this.isOp('[')) {
        this.next();
        const index = [this.parseExpr()];
        while (this.skipOp(',')) index.push(this.parseExpr());
        this.expectOp(']');
        expr = {k: 'index', obj: expr, index, where: this.where(tk)};
      } else if (this.isOp('::')) {
        this.next();
        const name = this.next();
        const parts = expr.k === 'scope' ? [...expr.parts, name.v] : [expr.k === 'ident' ? expr.name : undefined, name.v];
        expr = {k: 'scope', parts, base: expr.k === 'scope' ? expr.base : expr, where: this.where(name)};
      } else return expr;
    }
  }

  parsePrimary() {
    const tk = this.next();
    const where = this.where(tk);
    if (tk.t === 'str') return {k: 'lit', value: tk.v, where};
    if (tk.t === 'num') {
      if (tk.suffix && !/^L$/i.test(tk.suffix)) return {k: 'lit', value: {kind: 'datetime', text: `${tk.v}${tk.suffix}`}, where};
      return {k: 'lit', value: tk.v, where};
    }
    if (tk.t === 'id' && tk.lc === 'true') return {k: 'lit', value: true, where};
    if (tk.t === 'id' && tk.lc === 'false') return {k: 'lit', value: false, where};
    if (tk.t === 'id' || tk.t === 'qid') return {k: 'ident', name: tk.v, lc: tk.v.toLowerCase(), where};
    if (tk.t === 'op' && tk.v === '(') {
      const e = this.parseExpr();
      this.expectOp(')');
      return e;
    }
    if (tk.t === 'op' && tk.v === '[') {
      const items = [];
      while (!this.isOp(']')) {
        const lo = this.parseExpr();
        if (this.skipOp('..')) items.push({lo, hi: this.parseExpr()});
        else items.push({lo});
        if (!this.skipOp(',')) break;
      }
      this.expectOp(']');
      return {k: 'set', items, where};
    }
    throw new AlUnsupported(`Unexpected '${tk.v}'`, where);
  }
}

/** Turns the tokens of a type declaration into { base, name, label, temporary, text }. */
function describeType(toks) {
  const text = toks.map((t) => (t.t === 'str' ? `'${t.v}'` : t.t === 'qid' ? `"${t.v}"` : t.v)).join(' ');
  if (toks.length === 0) return {base: 'unknown', text};
  const base = toks[0].lc ?? String(toks[0].v).toLowerCase();
  const type = {base, text};
  if (base === 'label') {
    type.label = toks[1] && toks[1].t === 'str' ? toks[1].v : '';
  } else if (['codeunit', 'record', 'enum', 'interface', 'page', 'report', 'query', 'xmlport', 'testpage'].includes(base)) {
    const names = toks.slice(1).filter((t) => t.t === 'qid' || (t.t === 'id' && t.lc !== 'temporary'));
    type.name = names.length ? names[names.length - 1].v : undefined;
    type.temporary = toks.some((t) => t.t === 'id' && t.lc === 'temporary');
  } else if (base === 'list' || base === 'dictionary') {
    type.element = text;
  }
  return type;
}

/** Parses the procedures and global variables of a codeunit body. */
export function parseCodeunit(obj) {
  if (obj.parsed) return obj.parsed;
  const p = new Parser(obj.toks, obj.bodyStart + 1, obj.file);
  const parsed = {globals: [], procedures: new Map(), singleInstance: false};
  while (p.pos < obj.bodyEnd) {
    const tk = p.tk;
    if (p.isOp('[')) { p.pos = matchClose(obj.toks, p.pos) + 1; continue; }
    if (p.isKw('var')) { p.next(); parsed.globals.push(...p.parseVarSection()); continue; }
    if (p.isKw('local') || p.isKw('internal') || p.isKw('protected')) { p.next(); continue; }
    if (p.isKw('procedure')) {
      p.next();
      const proc = p.parseProcedure();
      const list = parsed.procedures.get(proc.lc) ?? [];
      list.push(proc);
      parsed.procedures.set(proc.lc, list);
      continue;
    }
    if (p.isKw('trigger')) {
      p.next();
      const proc = p.parseProcedure();
      parsed.procedures.set(`trigger:${proc.lc}`, [proc]);
      continue;
    }
    if (tk.t === 'id' && p.isOp('=', p.peek())) {
      if (tk.lc === 'singleinstance') parsed.singleInstance = p.peek(2).lc === 'true';
      while (!p.isOp(';') && p.pos < obj.bodyEnd) p.next();
      p.next();
      continue;
    }
    p.next();
  }
  obj.parsed = parsed;
  return parsed;
}

// ---------------------------------------------------------------------------
// Interpreter
// ---------------------------------------------------------------------------

const MAX_STEPS = 2_000_000;

/** Mock of Foundation's `Message Argument ori` record: collects the help response. */
export class ArgumentMock {
  constructor(subject = '') {
    this.kind = 'argument';
    this.fields = new Map([['subject', subject], ['content type', ''], ['response text', '']]);
    this.responseText = '';
  }
}

export class Interpreter {
  /**
   * @param {object[]} objects      every object from loadSources()
   * @param {object}   options
   * @param {Map<string,string>} [options.versions]  app id -> version to report for
   *        NavApp.GetCurrentModuleInfo (the build number AL-Go stamps is not in app.json)
   */
  constructor(objects, options = {}) {
    this.objects = objects;
    this.versions = options.versions ?? new Map();
    this.codeunits = new Map();
    this.enums = new Map();
    for (const obj of objects) {
      if (obj.type === 'codeunit' && obj.name) this.codeunits.set(obj.name.toLowerCase(), obj);
      if ((obj.type === 'enum' || obj.type === 'enumextension') && obj.name) {
        const key = (obj.type === 'enum' ? obj.name : obj.extends ?? '').toLowerCase();
        const entry = this.enums.get(key) ?? {base: null, extensions: []};
        if (obj.type === 'enum') entry.base = obj;
        else entry.extensions.push(obj);
        this.enums.set(key, entry);
      }
    }
    this.steps = 0;
    this.singletons = new Map();
  }

  // -- values ---------------------------------------------------------------

  defaultValue(type, where) {
    switch (type.base) {
      case 'text': case 'code': case 'bigtext': case 'secrettext': return '';
      case 'label': return type.label ?? '';
      case 'integer': case 'decimal': case 'biginteger': case 'duration': case 'option': return 0;
      case 'boolean': return false;
      case 'char': case 'byte': return {kind: 'char', code: 0};
      case 'textbuilder': return {kind: 'textbuilder', buf: ''};
      case 'codeunit': return this.newCodeunit(type.name, where, true);
      case 'enum': return {kind: 'enum', enumName: type.name, name: ''};
      case 'interface': return {kind: 'interface', name: type.name, target: null};
      case 'list': return {kind: 'list', items: []};
      case 'dictionary': return {kind: 'dictionary', map: new Map()};
      case 'moduleinfo': return {kind: 'moduleinfo', app: null};
      case 'version': return {kind: 'version', parts: [0, 0, 0, 0]};
      case 'guid': return {kind: 'guid', value: '00000000-0000-0000-0000-000000000000'};
      case 'record':
        if ((type.name ?? '').toLowerCase() === 'message argument ori') return new ArgumentMock();
        return {kind: 'record', name: type.name};
      default: return {kind: 'opaque', type: type.text};
    }
  }

  newCodeunit(name, where, lazy = false) {
    const obj = this.codeunits.get((name ?? '').toLowerCase());
    if (!obj) {
      if (SYSTEM_CODEUNITS[(name ?? '').toLowerCase()]) return {kind: 'syscodeunit', name};
      if (lazy) return {kind: 'missingcodeunit', name, where};
      throw new AlUnsupported(`Codeunit "${name}" is not in the loaded sources; pass its repository with --source`, where);
    }
    const parsed = parseCodeunit(obj);
    if (parsed.singleInstance) {
      const existing = this.singletons.get(obj);
      if (existing) return existing;
    }
    const inst = {kind: 'codeunit', obj, parsed, globals: new Map()};
    for (const d of parsed.globals) inst.globals.set(d.lc, {type: d.type, value: this.defaultValue(d.type, `${obj.file}`)});
    if (parsed.singleInstance) this.singletons.set(obj, inst);
    return inst;
  }

  /** Instance of the codeunit that implements `iface` for one enum value. */
  implementationFor(enumName, valueName, iface = 'msg interface ori') {
    const entry = this.enums.get(enumName.toLowerCase());
    if (!entry) return undefined;
    for (const obj of [entry.base, ...entry.extensions].filter(Boolean)) {
      for (const v of enumValues(obj)) {
        if ((v.name ?? '').toLowerCase() === valueName.toLowerCase()) return v.implementations.get(iface);
      }
    }
    return undefined;
  }

  // -- calls ----------------------------------------------------------------

  /** Calls `procName` on a codeunit instance with already-evaluated arguments (or refs). */
  callProcedure(inst, procName, args, where) {
    const list = inst.parsed.procedures.get(procName.toLowerCase());
    if (!list) throw new AlUnsupported(`Procedure ${procName} not found in codeunit "${inst.obj.name}"`, where);
    const proc = list.find((p) => p.params.length === args.length) ?? list[0];
    const frame = {vars: new Map(), inst, proc};
    proc.params.forEach((p, idx) => {
      const arg = args[idx];
      if (p.byRef && arg && arg.isRef) frame.vars.set(p.lc, arg.ref);
      else frame.vars.set(p.lc, {type: p.type, value: this.coerce(arg && arg.isRef ? arg.ref.value : arg, p.type)});
    });
    for (const d of proc.locals) frame.vars.set(d.lc, {type: d.type, value: this.defaultValue(d.type, `${proc.file}:${proc.line}`)});
    if (proc.returnName) frame.vars.set(proc.returnName.toLowerCase(), {type: proc.returnType, value: this.defaultValue(proc.returnType)});
    try {
      this.exec(proc.body, frame);
    } catch (e) {
      if (e instanceof ExitSignal) return e.value;
      throw e;
    }
    if (proc.returnName) return frame.vars.get(proc.returnName.toLowerCase()).value;
    return proc.returnType ? this.defaultValue(proc.returnType) : undefined;
  }

  coerce(value, type) {
    if (!type) return value;
    if (type.base === 'char' && typeof value === 'number') return {kind: 'char', code: value};
    if (type.base === 'interface' && value && value.kind === 'enum') return this.interfaceFromEnum(value, type.name);
    if ((type.base === 'text' || type.base === 'code') && value && value.kind === 'char') return String.fromCharCode(value.code);
    if (type.base === 'code' && typeof value === 'string') return value.toUpperCase();
    return value;
  }

  interfaceFromEnum(enumValue, ifaceName) {
    const implName = this.implementationFor(enumValue.enumName ?? 'message type ori', enumValue.name, (ifaceName ?? '').toLowerCase());
    if (!implName) throw new AlUnsupported(`No implementation of "${ifaceName}" for enum value "${enumValue.name}" in the loaded sources`);
    return this.newCodeunit(implName);
  }

  // -- statements -----------------------------------------------------------

  tick(where) {
    if (++this.steps > MAX_STEPS) throw new AlUnsupported('Step limit exceeded (runaway loop?)', where);
  }

  exec(stmt, frame) {
    this.tick(stmt.where);
    switch (stmt.k) {
      case 'empty': return;
      case 'block': for (const s of stmt.stmts) this.exec(s, frame); return;
      case 'expr': {
        const e = stmt.expr;
        // A bare procedure name is a call in AL.
        if (e.k === 'ident' || e.k === 'member') this.evalCall({k: 'call', callee: e, args: [], where: stmt.where}, frame);
        else this.eval(e, frame);
        return;
      }
      case 'assign': {
        const ref = this.lvalue(stmt.target, frame);
        let value = this.eval(stmt.value, frame);
        if (stmt.op !== ':=') value = this.binary(stmt.op[0], ref.get(), value, stmt.where);
        ref.set(this.coerce(value, ref.type));
        return;
      }
      case 'if':
        if (this.truthy(this.eval(stmt.cond, frame), stmt.where)) this.exec(stmt.then, frame);
        else if (stmt.otherwise) this.exec(stmt.otherwise, frame);
        return;
      case 'case': {
        const sel = this.eval(stmt.selector, frame);
        for (const br of stmt.branches) {
          for (const lab of br.labels) {
            const lo = this.eval(lab.lo, frame);
            const hit = lab.hi ? this.compare(sel, lo) >= 0 && this.compare(sel, this.eval(lab.hi, frame)) <= 0 : this.equals(sel, lo);
            if (hit) { this.exec(br.body, frame); return; }
          }
        }
        if (stmt.otherwise) this.exec(stmt.otherwise, frame);
        return;
      }
      case 'exit':
        throw new ExitSignal(stmt.value ? this.eval(stmt.value, frame) : undefined);
      case 'foreach': {
        const coll = this.eval(stmt.list, frame);
        const ref = this.lvalue({k: 'ident', name: stmt.varName, lc: stmt.varName.toLowerCase(), where: stmt.where}, frame);
        let items;
        if (coll && coll.kind === 'list') items = [...coll.items];
        else if (coll && coll.kind === 'dictionary') items = [...coll.map.keys()];
        else if (typeof coll === 'string') items = [...coll];
        else throw new AlUnsupported('foreach over a runtime-only collection', stmt.where);
        for (const item of items) { ref.set(item); this.exec(stmt.body, frame); }
        return;
      }
      case 'for': {
        const ref = this.lvalue({k: 'ident', name: stmt.varName, lc: stmt.varName.toLowerCase(), where: stmt.where}, frame);
        const from = this.eval(stmt.from, frame);
        const to = this.eval(stmt.to, frame);
        for (let v = from; stmt.down ? v >= to : v <= to; v += stmt.down ? -1 : 1) { ref.set(v); this.exec(stmt.body, frame); }
        return;
      }
      case 'while':
        while (this.truthy(this.eval(stmt.cond, frame), stmt.where)) this.exec(stmt.body, frame);
        return;
      case 'repeat':
        do { this.exec(stmt.body, frame); } while (!this.truthy(this.eval(stmt.cond, frame), stmt.where));
        return;
      default:
        throw new AlUnsupported(`Statement ${stmt.k} not supported`, stmt.where);
    }
  }

  truthy(v, where) {
    if (typeof v === 'boolean') return v;
    throw new AlUnsupported('Condition is not a Boolean known from source', where);
  }

  // -- names ----------------------------------------------------------------

  findVar(lc, frame) {
    if (frame.vars.has(lc)) return frame.vars.get(lc);
    if (frame.inst && frame.inst.globals.has(lc)) return frame.inst.globals.get(lc);
    return undefined;
  }

  lvalue(expr, frame) {
    if (expr.k === 'ident') {
      const ref = this.findVar(expr.lc, frame);
      if (!ref) throw new AlUnsupported(`Unknown variable ${expr.name}`, expr.where);
      return {type: ref.type, get: () => ref.value, set: (v) => { ref.value = v; }, ref};
    }
    if (expr.k === 'member') {
      const obj = this.eval(expr.obj, frame);
      if (obj instanceof ArgumentMock) {
        return {type: null, get: () => obj.fields.get(expr.lc) ?? '', set: (v) => { obj.fields.set(expr.lc, v); }};
      }
    }
    throw new AlUnsupported('Assignment target not supported', expr.where);
  }

  // -- expressions ----------------------------------------------------------

  eval(expr, frame) {
    this.tick(expr.where);
    switch (expr.k) {
      case 'lit': return expr.value;
      case 'ident': {
        const ref = this.findVar(expr.lc, frame);
        if (ref) return ref.value;
        // A parameterless procedure of the current codeunit, called without parentheses.
        if (frame.inst && frame.inst.parsed.procedures.has(expr.lc)) return this.callProcedure(frame.inst, expr.name, [], expr.where);
        throw new AlUnsupported(`Unknown identifier ${expr.name}`, expr.where);
      }
      case 'scope': return this.evalScope(expr, frame);
      case 'member': {
        const obj = this.eval(expr.obj, frame);
        return this.memberValue(obj, expr, frame);
      }
      case 'call': return this.evalCall(expr, frame);
      case 'not': return !this.truthy(this.eval(expr.expr, frame), expr.where);
      case 'neg': return -this.eval(expr.expr, frame);
      case 'bin': {
        if (expr.op === 'and') return this.truthy(this.eval(expr.left, frame), expr.where) && this.truthy(this.eval(expr.right, frame), expr.where);
        if (expr.op === 'or') return this.truthy(this.eval(expr.left, frame), expr.where) || this.truthy(this.eval(expr.right, frame), expr.where);
        return this.binary(expr.op, this.eval(expr.left, frame), this.eval(expr.right, frame), expr.where);
      }
      case 'in': {
        const v = this.eval(expr.left, frame);
        if (expr.right.k !== 'set') throw new AlUnsupported("'in' needs a literal set", expr.where);
        return expr.right.items.some((it) => (it.hi
          ? this.compare(v, this.eval(it.lo, frame)) >= 0 && this.compare(v, this.eval(it.hi, frame)) <= 0
          : this.equals(v, this.eval(it.lo, frame))));
      }
      case 'index': {
        const obj = this.eval(expr.obj, frame);
        const idx = this.eval(expr.index[0], frame);
        if (typeof obj === 'string') return obj.charAt(idx - 1);
        throw new AlUnsupported('Indexing not supported here', expr.where);
      }
      default:
        throw new AlUnsupported(`Expression ${expr.k} not supported`, expr.where);
    }
  }

  evalScope(expr, frame) {
    const parts = expr.parts;
    const head = (parts[0] ?? '').toLowerCase();
    if (head === 'enum' && parts.length === 3) return {kind: 'enum', enumName: parts[1], name: parts[2]};
    if (['database', 'codeunit', 'page', 'report', 'xmlport', 'query'].includes(head)) {
      return {kind: 'objectref', objectType: head, name: parts[1]};
    }
    // Variable::Value or "Enum Name"::Value
    if (expr.base && expr.base.k === 'ident') {
      const ref = this.findVar(expr.base.lc, frame);
      if (ref && ref.type && ref.type.base === 'enum') return {kind: 'enum', enumName: ref.type.name, name: parts[parts.length - 1]};
      if (ref && ref.type && ref.type.base === 'option') throw new AlUnsupported('Option values are not supported', expr.where);
      if (this.enums.has(expr.base.lc)) return {kind: 'enum', enumName: expr.base.name, name: parts[parts.length - 1]};
    }
    // Record."Field"::Value on an unknown record: runtime schema.
    throw new AlUnsupported(`Cannot resolve ${parts.filter(Boolean).join('::')}`, expr.where);
  }

  memberValue(obj, expr, frame) {
    const lc = expr.lc;
    if (obj && obj.kind === 'moduleinfo') {
      const json = obj.app?.json;
      if (!json) throw new AlUnsupported('ModuleInfo was never filled', expr.where);
      if (lc === 'appversion') return {kind: 'version', parts: this.appVersion(json)};
      if (lc === 'dataversion') return {kind: 'version', parts: this.appVersion(json)};
      if (lc === 'name') return json.name;
      if (lc === 'publisher') return json.publisher;
      if (lc === 'id') return {kind: 'guid', value: json.id};
      throw new AlUnsupported(`ModuleInfo.${expr.name} is not known from source`, expr.where);
    }
    if (obj && obj.kind === 'version') {
      const idx = ['major', 'minor', 'build', 'revision'].indexOf(lc);
      if (idx >= 0) return obj.parts[idx];
    }
    if (obj instanceof ArgumentMock) {
      if (obj.fields.has(lc)) return obj.fields.get(lc);
      // A parameterless method called without parentheses.
      return this.callMethod(obj, expr.name, [], expr.where, frame);
    }
    if (obj && (obj.kind === 'codeunit' || obj.kind === 'textbuilder' || obj.kind === 'list' || typeof obj === 'string')) {
      return this.callMethod(obj, expr.name, [], expr.where, frame);
    }
    throw new AlUnsupported(`Member ${expr.name} is not known from source`, expr.where);
  }

  appVersion(json) {
    const override = this.versions.get((json.id ?? '').toLowerCase());
    const text = override ?? json.version ?? '0.0.0.0';
    const parts = String(text).split('.').map((p) => Number.parseInt(p, 10) || 0);
    while (parts.length < 4) parts.push(0);
    return parts.slice(0, 4);
  }

  /** Evaluates call arguments, passing refs for plain variables so `var` params work. */
  evalArgs(args, frame) {
    return args.map((a) => {
      if (a.k === 'ident') {
        const ref = this.findVar(a.lc, frame);
        if (ref) return {isRef: true, ref};
      }
      return this.eval(a, frame);
    });
  }

  evalCall(expr, frame) {
    const callee = expr.callee;
    const where = expr.where;
    if (callee.k === 'ident') {
      // Own procedure first, then built-in function.
      if (frame.inst && frame.inst.parsed.procedures.has(callee.lc) && !this.findVar(callee.lc, frame)) {
        return this.callProcedure(frame.inst, callee.name, this.evalArgs(expr.args, frame), where);
      }
      const ref = this.findVar(callee.lc, frame);
      if (ref && expr.args.length === 0) return ref.value;
      return this.builtin(callee.lc, callee.name, expr.args, frame, where);
    }
    if (callee.k === 'member') {
      const baseExpr = callee.obj;
      if (baseExpr.k === 'ident' && !this.findVar(baseExpr.lc, frame)) {
        if (baseExpr.lc === 'navapp') return this.navApp(callee.lc, expr.args, frame, where);
        if (baseExpr.lc === 'session' || baseExpr.lc === 'database' || baseExpr.lc === 'companyproperty' || baseExpr.lc === 'userid') {
          throw new AlUnsupported(`${baseExpr.name}.${callee.name} is runtime-only`, where);
        }
      }
      if (baseExpr.k === 'scope' && (baseExpr.parts[0] ?? '').toLowerCase() === 'enum' && baseExpr.parts.length === 2) {
        return this.enumStatic(baseExpr.parts[1], callee.lc, where);
      }
      const obj = this.eval(baseExpr, frame);
      return this.callMethod(obj, callee.name, this.evalArgs(expr.args, frame), where, frame);
    }
    throw new AlUnsupported('Call target not supported', where);
  }

  enumStatic(enumName, method, where) {
    const entry = this.enums.get(enumName.toLowerCase());
    if (!entry || !entry.base) throw new AlUnsupported(`Enum "${enumName}" is not in the loaded sources`, where);
    const props = objectProperties(entry.base);
    const extensible = (propertyText(props.get('extensible')) ?? 'false').toLowerCase() === 'true';
    if (extensible) throw new AlUnsupported(`Enum "${enumName}" is extensible; its values depend on the installed apps`, where);
    const values = enumValues(entry.base);
    if (method === 'names') return {kind: 'list', items: values.map((v) => v.name)};
    if (method === 'ordinals') return {kind: 'list', items: values.map((v) => v.ordinal)};
    throw new AlUnsupported(`Enum method ${method} not supported`, where);
  }

  navApp(method, args, frame, where) {
    if (method === 'getcurrentmoduleinfo') {
      const target = this.evalArgs(args, frame)[0];
      if (!target || !target.isRef) throw new AlUnsupported('GetCurrentModuleInfo needs a variable', where);
      target.ref.value = {kind: 'moduleinfo', app: frame.inst.obj.app};
      return true;
    }
    throw new AlUnsupported(`NavApp.${method} is runtime-only`, where);
  }

  deref(v) { return v && v.isRef ? v.ref.value : v; }

  callMethod(obj, name, rawArgs, where, frame) {
    const lc = name.toLowerCase();
    const args = rawArgs.map((a) => this.deref(a));
    if (obj && obj.kind === 'codeunit') return this.callProcedure(obj, name, rawArgs, where);
    if (obj && obj.kind === 'interface') {
      if (!obj.target) throw new AlUnsupported('Interface variable has no implementation', where);
      return this.callProcedure(obj.target, name, rawArgs, where);
    }
    if (obj && obj.kind === 'syscodeunit') {
      const fn = SYSTEM_CODEUNITS[obj.name.toLowerCase()][lc];
      if (!fn) throw new AlUnsupported(`${obj.name}.${name} is not supported offline`, where);
      return fn(...args);
    }
    if (obj && obj.kind === 'missingcodeunit') {
      throw new AlUnsupported(`Codeunit "${obj.name}" is not in the loaded sources; pass its repository with --source`, where);
    }
    if (obj && obj.kind === 'textbuilder') {
      switch (lc) {
        case 'append': obj.buf += this.toText(args[0] ?? ''); return undefined;
        case 'appendline': obj.buf += (args.length ? this.toText(args[0]) : '') + '\n'; return undefined;
        case 'totext': return args.length >= 2 ? obj.buf.substr(args[0] - 1, args[1]) : obj.buf;
        case 'clear': obj.buf = ''; return undefined;
        case 'length': return obj.buf.length;
        case 'replace': obj.buf = obj.buf.split(this.toText(args[0])).join(this.toText(args[1])); return true;
        case 'insert': obj.buf = obj.buf.slice(0, args[0] - 1) + this.toText(args[1]) + obj.buf.slice(args[0] - 1); return true;
        case 'remove': obj.buf = obj.buf.slice(0, args[0] - 1) + obj.buf.slice(args[0] - 1 + args[1]); return true;
        default: throw new AlUnsupported(`TextBuilder.${name} not supported`, where);
      }
    }
    if (typeof obj === 'string') return textMethod(obj, lc, args, where, this);
    if (obj && obj.kind === 'list') {
      switch (lc) {
        case 'add': obj.items.push(args[0]); return undefined;
        case 'count': return obj.items.length;
        case 'get': return obj.items[args[0] - 1];
        case 'contains': return obj.items.some((x) => this.equals(x, args[0]));
        case 'indexof': return obj.items.findIndex((x) => this.equals(x, args[0])) + 1;
        case 'insert': obj.items.splice(args[0] - 1, 0, args[1]); return undefined;
        case 'removeat': obj.items.splice(args[0] - 1, 1); return true;
        case 'addrange': obj.items.push(...args); return undefined;
        default: throw new AlUnsupported(`List.${name} not supported`, where);
      }
    }
    if (obj && obj.kind === 'dictionary') {
      switch (lc) {
        case 'add': case 'set': obj.map.set(args[0], args[1]); return undefined;
        case 'get': return obj.map.get(args[0]);
        case 'containskey': return obj.map.has(args[0]);
        case 'count': return obj.map.size;
        case 'keys': return {kind: 'list', items: [...obj.map.keys()]};
        case 'values': return {kind: 'list', items: [...obj.map.values()]};
        default: throw new AlUnsupported(`Dictionary.${name} not supported`, where);
      }
    }
    if (obj instanceof ArgumentMock) {
      switch (lc) {
        case 'setresponsemarkdown':
          obj.responseText = this.toText(args[0]);
          obj.fields.set('content type', 'text/markdown');
          return undefined;
        case 'setresponsetext':
          obj.responseText = this.toText(args[0]);
          return undefined;
        case 'getresponsetext': return obj.responseText;
        case 'getcontenttypemarkdown': return 'text/markdown';
        case 'getcontenttypejson': return 'text/json';
        case 'assertversion1': return undefined;
        default: throw new AlUnsupported(`Message argument method ${name} is runtime-only`, where);
      }
    }
    if (obj && obj.kind === 'enum' && (lc === 'asinteger' || lc === 'names' || lc === 'ordinals')) {
      throw new AlUnsupported(`Enum.${name} is not supported offline`, where);
    }
    if (obj && obj.kind === 'record') throw new AlUnsupported(`Record "${obj.name}".${name} reads the database (runtime-only)`, where);
    throw new AlUnsupported(`Method ${name} is not known from source`, where);
  }

  builtin(lc, name, argExprs, frame, where) {
    const raw = this.evalArgs(argExprs, frame);
    const args = raw.map((a) => this.deref(a));
    switch (lc) {
      case 'strsubstno': return strSubstNo(this.toText(args[0]), args.slice(1).map((a) => this.format(a)));
      case 'format': return this.format(args[0], args[1], args[2]);
      case 'strlen': return this.toText(args[0]).length;
      case 'copystr': {
        const s = this.toText(args[0]);
        return args.length >= 3 ? s.substr(args[1] - 1, args[2]) : s.substr(args[1] - 1);
      }
      case 'uppercase': return this.toText(args[0]).toUpperCase();
      case 'lowercase': return this.toText(args[0]).toLowerCase();
      case 'strpos': return this.toText(args[0]).indexOf(this.toText(args[1])) + 1;
      case 'convertstr': {
        const [s, from, to] = args.map((a) => this.toText(a));
        return [...s].map((ch) => (from.indexOf(ch) >= 0 ? to[from.indexOf(ch)] : ch)).join('');
      }
      case 'delchr': {
        const s = this.toText(args[0]);
        const where_ = this.toText(args[1] ?? '=');
        const chars = args.length >= 3 ? this.toText(args[2]) : ' ';
        let out = s;
        const isDel = (ch) => chars.includes(ch);
        if (where_.includes('=')) return [...out].filter((ch) => !isDel(ch)).join('');
        if (where_.includes('<')) while (out && isDel(out[0])) out = out.slice(1);
        if (where_.includes('>')) while (out && isDel(out[out.length - 1])) out = out.slice(0, -1);
        return out;
      }
      case 'padstr': {
        const s = this.toText(args[0]);
        const len = args[1];
        const fill = args.length >= 3 ? this.toText(args[2]) : ' ';
        return s.length >= len ? s.slice(0, len) : s + fill.repeat(len - s.length);
      }
      case 'selectstr': return this.toText(args[1]).split(',')[args[0] - 1] ?? '';
      case 'abs': return Math.abs(args[0]);
      case 'clear': {
        const target = raw[0];
        if (!target || !target.isRef) throw new AlUnsupported('Clear needs a variable', where);
        if (target.ref.value && target.ref.value.kind === 'codeunit') {
          target.ref.value = this.newCodeunit(target.ref.value.obj.name, where);
        } else target.ref.value = this.defaultValue(target.ref.type, where);
        return undefined;
      }
      case 'guiallowed': return false;
      case 'error': throw new AlUnsupported(`Help code raises an error: ${this.toText(args[0] ?? '')}`, where);
      case 'message': return undefined;
      default:
        throw new AlUnsupported(`Function ${name} is not supported offline`, where);
    }
  }

  // -- operators and conversions -------------------------------------------

  toText(v) {
    if (typeof v === 'string') return v;
    if (v && v.kind === 'char') return String.fromCharCode(v.code);
    if (v && v.kind === 'textbuilder') return v.buf;
    return this.format(v);
  }

  format(v, _len, fmt) {
    if (v === undefined || v === null) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'number') {
      if (Number.isInteger(v)) return fmt === 9 ? String(v) : v.toLocaleString('en-US', {useGrouping: fmt !== 9 && Math.abs(v) >= 1000 ? true : false}).replace(/,/g, fmt === 9 ? '' : ',');
      return fmt === 9 ? String(v) : v.toLocaleString('en-US', {maximumFractionDigits: 5});
    }
    if (typeof v === 'boolean') return fmt === 9 ? String(v) : v ? 'Yes' : 'No';
    if (v.kind === 'char') return String.fromCharCode(v.code);
    if (v.kind === 'version') return v.parts.join('.');
    if (v.kind === 'enum') return this.enumCaption(v);
    if (v.kind === 'guid') return fmt === 4 ? v.value.toLowerCase() : `{${v.value.toUpperCase()}}`;
    if (v.kind === 'textbuilder') return v.buf;
    throw new AlUnsupported(`Cannot format a runtime-only value (${v.kind})`);
  }

  enumCaption(v) {
    const entry = this.enums.get((v.enumName ?? '').toLowerCase());
    if (entry) {
      for (const obj of [entry.base, ...entry.extensions].filter(Boolean)) {
        const hit = enumValues(obj).find((x) => (x.name ?? '').toLowerCase() === v.name.toLowerCase());
        if (hit) return hit.caption ?? hit.name;
      }
    }
    return v.name;
  }

  binary(op, a, b, where) {
    switch (op) {
      case '+':
        if (typeof a === 'number' && typeof b === 'number') return a + b;
        return this.toText(a) + this.toText(b);
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      case 'div': return Math.trunc(a / b);
      case 'mod': return a % b;
      case 'xor': return Boolean(a) !== Boolean(b);
      case '=': return this.equals(a, b);
      case '<>': return !this.equals(a, b);
      case '<': return this.compare(a, b) < 0;
      case '<=': return this.compare(a, b) <= 0;
      case '>': return this.compare(a, b) > 0;
      case '>=': return this.compare(a, b) >= 0;
      default: throw new AlUnsupported(`Operator ${op} not supported`, where);
    }
  }

  equals(a, b) {
    if (a && a.kind === 'enum' && b && b.kind === 'enum') return a.name.toLowerCase() === b.name.toLowerCase();
    if (a && a.kind === 'char') a = String.fromCharCode(a.code);
    if (b && b.kind === 'char') b = String.fromCharCode(b.code);
    if (a && a.kind === 'guid' && b && b.kind === 'guid') return a.value.toLowerCase() === b.value.toLowerCase();
    if (typeof a === 'object' || typeof b === 'object') throw new AlUnsupported('Comparison of runtime-only values');
    return a === b;
  }

  compare(a, b) {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    const sa = this.toText(a);
    const sb = this.toText(b);
    return sa < sb ? -1 : sa > sb ? 1 : 0;
  }
}

function strSubstNo(fmt, values) {
  return fmt.replace(/%(\d+)/g, (m, d) => {
    const idx = Number(d) - 1;
    return idx < values.length ? values[idx] : m;
  }).replace(/#(\d+)#*/g, (m, d) => {
    const idx = Number(d) - 1;
    return idx < values.length ? values[idx] : m;
  });
}

function textMethod(s, lc, args, where, interp) {
  const t = (x) => interp.toText(x);
  switch (lc) {
    case 'replace': return s.split(t(args[0])).join(t(args[1]));
    case 'contains': return s.includes(t(args[0]));
    case 'startswith': return s.startsWith(t(args[0]));
    case 'endswith': return s.endsWith(t(args[0]));
    case 'tolower': return s.toLowerCase();
    case 'toupper': return s.toUpperCase();
    case 'trim': return s.trim();
    case 'trimstart': return args.length ? s.replace(new RegExp(`^[${escapeClass(t(args[0]))}]+`), '') : s.replace(/^\s+/, '');
    case 'trimend': return args.length ? s.replace(new RegExp(`[${escapeClass(t(args[0]))}]+$`), '') : s.replace(/\s+$/, '');
    case 'substring': return args.length >= 2 ? s.substr(args[0] - 1, args[1]) : s.substr(args[0] - 1);
    case 'indexof': return s.indexOf(t(args[0])) + 1;
    case 'lastindexof': return s.lastIndexOf(t(args[0])) + 1;
    case 'padleft': return s.padStart(args[0], args.length > 1 ? t(args[1]) : ' ');
    case 'padright': return s.padEnd(args[0], args.length > 1 ? t(args[1]) : ' ');
    case 'split': return {kind: 'list', items: args.length ? s.split(t(args[0])) : [s]};
    default: throw new AlUnsupported(`Text.${lc} not supported`, where);
  }
}

function escapeClass(chars) {
  return chars.replace(/[\\\]^-]/g, '\\$&');
}

/** Platform codeunits whose few text helpers are pure and known. */
const SYSTEM_CODEUNITS = {
  'type helper': {
    lfseparator: () => '\n',
    crlfseparator: () => '\r\n',
    newline: () => '\r\n',
  },
};
