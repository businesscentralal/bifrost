/**
 * Publishes data/apps.json to static/apps.json before the Docusaurus build,
 * so both locale builds copy it in as-is and it ends up served at
 * /en-us/apps.json and /is-is/apps.json. tools/build-root.mjs additionally
 * copies it to the locale-agnostic /apps.json at the site root, the same way
 * it writes llms.txt.
 *
 * Run standalone:  node tools/copy-apps-json.mjs
 * Wired into:       npm run build (before build:en / build:is)
 */
import {copyFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'data', 'apps.json');
const destDir = path.join(root, 'static');
const dest = path.join(destDir, 'apps.json');

await mkdir(destDir, {recursive: true});
await copyFile(source, dest);

console.log('copy-apps-json: static/apps.json refreshed from data/apps.json');
