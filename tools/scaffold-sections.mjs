/**
 * Creates the folder skeleton for every docs instance declared in apps.ts and
 * drops a placeholder index page where none exists yet. Safe to re-run: it
 * never overwrites a file that is already there.
 *
 *   node tools/scaffold-sections.mjs
 */
import {mkdir, writeFile, access} from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const apps = [
  {id: 'foundation', title: 'Foundation', appName: 'Bifrost Foundation', wave: 1},
  {id: 'iceland', title: 'Iceland', appName: 'Bifrost Iceland', wave: 1},
  {id: 'iceland-treasury', title: 'Iceland Treasury', appName: 'Bifrost Iceland Treasury', wave: 1},
  {id: 'iceland-docex', title: 'Iceland DocEx', appName: 'Bifrost Iceland DocEx', wave: 1},
  {id: 'bragi', title: 'Bragi', appName: 'Bifrost Bragi', wave: 1},
  {id: 'hnitbjorg', title: 'Hnitbjörg', appName: 'Bifrost Hnitbjorg', wave: 1},
  {id: 'nornir', title: 'Nornir', appName: 'Bifrost Nornir', wave: 1},
  {id: 'clockify', title: 'Clockify', appName: 'Bifrost Clockify', wave: 1},
  {id: 'subscription-billing', title: 'Subscription Billing', appName: 'Bifrost Subscription Billing', wave: 1},
];

const exists = async (p) => access(p, constants.F_OK).then(() => true).catch(() => false);

async function put(file, contents) {
  if (await exists(file)) return false;
  await mkdir(path.dirname(file), {recursive: true});
  await writeFile(file, contents, 'utf8');
  return true;
}

const placeholder = (title, body, position = 1) =>
  `---\nsidebar_position: ${position}\ntitle: ${title}\n---\n\n# ${title}\n\n${body}\n`;

let created = 0;

for (const app of apps) {
  const pending =
    app.wave === 2
      ? `Documentation for **${app.appName}** is being migrated into this site. ` +
        `Until it lands here, the app's README in its repository is the current reference.\n`
      : '';

  created += (await put(
    path.join(root, 'docs', app.id, 'index.md'),
    placeholder(`Bifröst ${app.title}`, `${pending}`),
  ))
    ? 1
    : 0;

  created += (await put(
    path.join(root, 'help', app.id, 'index.md'),
    placeholder(
      `Bifröst ${app.title} — Help`,
      `In-product help for **${app.appName}**. Business Central opens these pages from the ` +
        `help icon on each page of the app.\n`,
    ),
  ))
    ? 1
    : 0;

  for (const [instance, dir] of [
    [app.id, path.join('docs', app.id)],
    [`help-${app.id}`, path.join('help', app.id)],
  ]) {
    created += (await put(
      path.join(root, 'i18n', 'is-IS', `docusaurus-plugin-content-docs-${instance}`, 'current', '.gitkeep'),
      '',
    ))
      ? 1
      : 0;
    void dir;
  }
}

for (const section of ['extensibility', 'skills']) {
  created += (await put(
    path.join(root, 'i18n', 'is-IS', `docusaurus-plugin-content-docs-${section}`, 'current', '.gitkeep'),
    '',
  ))
    ? 1
    : 0;
}

console.log(`scaffold-sections: created ${created} file(s)`);
