/**
 * Release step for data/versions.json.
 *
 * Copies brief and description exactly from the released app.json onto the
 * app's existing entry. Does not add apps. Pass --version and --released
 * when the AppSource package version changes.
 *
 *   node tools/update-released-version.mjs --app-json path/to/app.json --version 28.0.10.632 --released 2026-10-28
 */
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {applyReleasedCopy, releasedCopyErrors} from './lib/versions-file.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const {values} = parseArgs({
  options: {
    'app-json': {type: 'string'},
    version: {type: 'string'},
    released: {type: 'string'},
    updated: {type: 'string'},
    file: {type: 'string'},
  },
});

if (!values['app-json']) {
  console.error('Usage: node tools/update-released-version.mjs --app-json path/to/app.json [--version 28.0.0.0] [--released YYYY-MM-DD] [--updated YYYY-MM-DD]');
  process.exit(1);
}

const versionsPath = path.resolve(root, values.file || path.join('data', 'versions.json'));
const appJson = JSON.parse(await readFile(path.resolve(values['app-json']), 'utf8'));
const data = JSON.parse(await readFile(versionsPath, 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const entry = applyReleasedCopy(data, appJson, {
  version: values.version,
  released: values.released,
  updated: values.updated || today,
});
const errors = releasedCopyErrors(data);
if (errors.length > 0) {
  console.error(errors.map((error) => `  - ${error}`).join('\n'));
  process.exit(1);
}
await writeFile(versionsPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Updated "${entry.name}" (${entry.appId}): brief and description copied from app.json.`);
