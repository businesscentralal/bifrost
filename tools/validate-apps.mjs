/**
 * Validates data/apps.json against data/apps.schema.json and a handful of
 * rules the JSON Schema itself cannot express: appId uniqueness, that every
 * referenced logo file exists on disk and is actually a 250x250 PNG, and that
 * every summary reads as prose rather than being empty/whitespace.
 *
 * Run standalone:  node tools/validate-apps.mjs
 * Wired into CI:   .github/workflows/validate-apps.yml (runs this, then the
 *                   site build, on any PR/push touching data/** or
 *                   static/img/apps/**).
 */
import {readFile, access} from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(root, 'data', 'apps.json');
const schemaPath = path.join(root, 'data', 'apps.schema.json');

/** Collects problems instead of throwing on the first one, so a PR sees every fix it needs at once. */
const errors = [];
const fail = (message) => errors.push(message);

const [dataRaw, schemaRaw] = await Promise.all([readFile(dataPath, 'utf8'), readFile(schemaPath, 'utf8')]);

let data;
try {
  data = JSON.parse(dataRaw);
} catch (err) {
  console.error(`data/apps.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

let schema;
try {
  schema = JSON.parse(schemaRaw);
} catch (err) {
  console.error(`data/apps.schema.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

// --- 1. JSON Schema (draft 2020-12) -----------------------------------------------------------
const ajv = new Ajv2020({allErrors: true, strict: true});
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(data)) {
  for (const e of validate.errors ?? []) {
    fail(`schema: ${e.instancePath || '(root)'} ${e.message}`);
  }
}

// --- 2. Cross-field / filesystem checks the schema cannot express -----------------------------
const apps = Array.isArray(data.apps) ? data.apps : [];

const seenIds = new Map();
for (const app of apps) {
  if (!app.appId) continue;
  const key = app.appId.toLowerCase();
  if (seenIds.has(key)) {
    fail(`duplicate appId "${app.appId}" used by both "${seenIds.get(key)}" and "${app.name}"`);
  } else {
    seenIds.set(key, app.name);
  }
}

const isPngWithSize = async (filePath, expectedSize) => {
  const buf = await readFile(filePath);
  const isPng = buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47 && buf.readUInt32BE(4) === 0x0d0a1a0a;
  if (!isPng) return {ok: false, reason: 'not a PNG file (bad signature)'};
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (width !== expectedSize || height !== expectedSize) {
    return {ok: false, reason: `is ${width}x${height}, expected ${expectedSize}x${expectedSize}`};
  }
  return {ok: true};
};

for (const app of apps) {
  const logo = app.links?.logo;
  if (!logo) continue;
  const abs = path.join(root, logo);
  const exists = await access(abs, constants.F_OK).then(() => true).catch(() => false);
  if (!exists) {
    fail(`"${app.name}": logo "${logo}" does not exist`);
    continue;
  }
  if (!logo.toLowerCase().endsWith('.png')) {
    fail(`"${app.name}": logo "${logo}" must be a .png file`);
    continue;
  }
  const check = await isPngWithSize(abs, 250);
  if (!check.ok) {
    fail(`"${app.name}": logo "${logo}" ${check.reason}`);
  }
}

for (const app of apps) {
  if (typeof app.summary === 'string' && app.summary.trim().length === 0) {
    fail(`"${app.name || app.appId}": summary is blank`);
  }
  if (typeof app.summary === 'string' && app.summary.length > 200) {
    fail(`"${app.name}": summary is ${app.summary.length} chars, over the 200 limit`);
  }
}

// URL well-formedness beyond the schema's `format: uri` (which accepts things
// like `mailto:` already via the pattern alternative, so this only re-checks
// http(s) links resolve to a URL object without throwing).
for (const app of apps) {
  for (const [key, value] of Object.entries(app.links ?? {})) {
    if (key === 'logo' || value === null || value === undefined) continue;
    if (value.startsWith('mailto:')) continue;
    try {
      // eslint-disable-next-line no-new
      new URL(value);
    } catch {
      fail(`"${app.name}": links.${key} "${value}" is not a well-formed URL`);
    }
  }
}

// --- Report ------------------------------------------------------------------------------------
if (errors.length > 0) {
  console.error(`data/apps.json failed validation (${errors.length} issue${errors.length === 1 ? '' : 's'}):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`data/apps.json is valid — ${apps.length} app${apps.length === 1 ? '' : 's'} checked.`);
