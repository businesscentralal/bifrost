/**
 * Lists the open items marked in the site, so they can be found and closed as
 * answers arrive.
 *
 *   npm run open-items            # every OPEN-nn marker, by id, with file:line
 *   npm run open-items OPEN-07    # one item
 *
 * Markers:
 *   :::note Being written (OPEN-nn)     a visible placeholder box
 *   {/* OPEN-nn: short note *\/}        an invisible note next to a sentence to confirm (MDX)
 *   // OPEN-nn or * OPEN-nn             in a component
 *
 * When an item is answered: change the text, remove its markers, and run this
 * again to check that none is left.
 */
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const roots = ['docs', 'help', 'src', 'i18n'];
const only = process.argv[2];
const pattern = /OPEN-\d{2,}/g;

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, {withFileTypes: true});
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.docusaurus', 'build'].includes(entry.name)) continue;
      yield* walk(full);
    } else if (/\.(md|mdx|tsx?|jsx?|css)$/i.test(entry.name)) {
      yield full;
    }
  }
}

const found = new Map();
for (const r of roots) {
  for await (const file of walk(path.join(root, r))) {
    const lines = (await readFile(file, 'utf8')).split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const id of line.match(pattern) ?? []) {
        if (only && id !== only) continue;
        const rest = line.slice(line.indexOf(id) + id.length);
        const note = rest.startsWith(':') ? rest.slice(1).split('*/')[0].trim() : '';
        if (!found.has(id)) found.set(id, []);
        found.get(id).push(`${path.relative(root, file)}:${i + 1}${note ? `  ${note}` : ''}`);
      }
    });
  }
}

if (found.size === 0) {
  console.log(only ? `${only}: no markers left.` : 'No open items.');
} else {
  for (const id of [...found.keys()].sort()) {
    console.log(id);
    for (const where of found.get(id)) console.log(`  ${where}`);
  }
  console.log(`\n${found.size} open item(s).`);
}
