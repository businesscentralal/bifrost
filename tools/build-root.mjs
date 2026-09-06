/**
 * Assembles the deployable site from the two locale builds.
 *
 * `build/en-us` and `build/is-is` are produced by two separate Docusaurus
 * builds. This script adds the two files that live above them:
 *
 *   build/index.html   picks a locale from the browser's language list
 *   build/404.html     catches everything else, including unknown locale
 *                      prefixes such as /da-dk/help/nornir/
 *
 * Both are plain HTML with a <noscript> fallback, so a reader with scripting
 * disabled still gets a working link rather than a blank page.
 *
 *   node tools/build-root.mjs
 */
import {writeFile, access} from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, 'build');

const BASE_URL = (process.env.BASE_URL ?? '/bifrost/').replace(/\/?$/, '/');

const page = (title, script) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<style>
  body { font-family: "Segoe UI", system-ui, sans-serif; margin: 0; min-height: 100vh;
         display: grid; place-items: center; background: #16181a; color: #f2f4f5; }
  main { text-align: center; padding: 2rem; }
  a { color: #2fd4c1; }
</style>
<script>${script}</script>
</head>
<body>
<main>
  <h1>Bifröst</h1>
  <p>
    <a href="${BASE_URL}en-us/">English documentation</a>
    &nbsp;·&nbsp;
    <a href="${BASE_URL}is-is/">Íslensk skjölun</a>
  </p>
</main>
</body>
</html>
`;

/**
 * Chooses is-is only when Icelandic is the reader's stated preference;
 * everything else, including an empty language list, gets English.
 */
const chooseLocale = `
  var base = ${JSON.stringify(BASE_URL)};
  var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en']);
  var wantsIcelandic = false;
  for (var i = 0; i < langs.length; i++) {
    var tag = String(langs[i]).toLowerCase();
    if (tag === 'is' || tag.indexOf('is-') === 0) { wantsIcelandic = true; break; }
    if (tag === 'en' || tag.indexOf('en-') === 0) { break; }
  }
  location.replace(base + (wantsIcelandic ? 'is-is/' : 'en-us/'));
`;

/**
 * A 404 inside a locale build is served by that build's own 404 page, so this
 * one only ever sees paths with a missing or unsupported locale prefix. It
 * keeps the rest of the path, which is what makes an unsupported Business
 * Central locale still land on the right help page in English.
 */
const rescueLocale = `
  var base = ${JSON.stringify(BASE_URL)};
  var rest = location.pathname.slice(base.length).replace(/^[a-z]{2}(-[a-z]{2})?\\//i, '');
  location.replace(base + 'en-us/' + rest + location.search + location.hash);
`;

const exists = (p) => access(p, constants.F_OK).then(() => true).catch(() => false);

for (const locale of ['en-us', 'is-is']) {
  if (!(await exists(path.join(buildDir, locale, 'index.html')))) {
    throw new Error(
      `build/${locale}/index.html is missing — run the ${locale} Docusaurus build before tools/build-root.mjs`,
    );
  }
}

await writeFile(path.join(buildDir, 'index.html'), page('Bifröst', chooseLocale), 'utf8');
await writeFile(path.join(buildDir, '404.html'), page('Bifröst — page not found', rescueLocale), 'utf8');

/**
 * llms.txt — the entry point for an agent handed nothing but the site address.
 * It is written at the site root (not inside a locale) and carries absolute
 * URLs, so it is only correct once SITE_URL and BASE_URL are known: build time.
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://businesscentralal.github.io').replace(/\/$/, '');
const site = `${SITE_URL}${BASE_URL}`;
const en = `${site}en-us/`;

const appSections = [
  ['foundation', 'Bifröst Foundation — the kernel every other app depends on'],
  ['iceland', 'Bifröst Iceland — Icelandic ERP message types'],
  ['iceland-treasury', 'Bifröst Iceland Treasury — Icelandic bank connectors and payments'],
  ['iceland-docex', 'Bifröst Iceland DocEx — electronic document exchange (Peppol/BIS 3.0)'],
  ['bragi', 'Bifröst Bragi — chat and language model providers'],
  ['hnitbjorg', 'Bifröst Hnitbjörg — Azure Blob, Azure File Share and SharePoint storage'],
  ['nornir', 'Bifröst Nornir — job queue scheduling and declarative playbooks'],
  ['clockify', 'Bifröst Clockify — time tracking'],
  ['subscription-billing', 'Bifröst Subscription Billing — recurring billing'],
];

const llms = [
  '# Bifröst',
  '',
  '> Bifröst is a family of Microsoft Dynamics 365 Business Central extensions by Origo.',
  '> Every operation is a message: a JSON envelope posted to one of three REST endpoints,',
  '> routed by its `type` field. Bifröst Foundation is the kernel; the other apps add',
  '> message types for banks, storage, documents, schedules and language models.',
  '',
  'This site holds all public documentation for those apps in English (`/en-us/`) and',
  'Icelandic (`/is-is/`). The paths below are the English ones.',
  '',
  '## Skills',
  '',
  `- [Bifröst BC integration skill](${site}skills/bifrost-bc-integration/SKILL.md): the complete API reference as one file — endpoints, request envelope, response patterns, every message type, pagination, tableView filter syntax, field selection, enum handling, translations, webhooks. Start here.`,
  `- [Skills index](${en}skills/): the same skill split into browsable pages, plus what an agent needs beyond the skill itself.`,
  '',
  '## Building on Bifröst',
  '',
  `- [Extensibility guide](${en}extensibility/): how to write a Business Central app that depends on Bifröst Foundation — message types, help codeunits, setup and secrets, install and upgrade, testing, naming conventions.`,
  '',
  '## Apps',
  '',
  ...appSections.map(([id, description]) => `- [${description}](${en}${id}/)`),
  '',
  '## In-product help',
  '',
  'Business Central opens these pages from the help icon. One page per Business Central page:',
  '',
  ...appSections.map(([id]) => `- ${en}help/${id}/`),
  '',
  '## Optional',
  '',
  `- [Site source](https://github.com/businesscentralal/bifrost): the documentation is generated and maintained here.`,
  '',
].join('\n');

// Written at the site root and inside each locale, so that both
// `<site>/llms.txt` and `<site>/en-us/llms.txt` resolve — an agent guesses one
// or the other and should not have to guess right.
for (const dir of [buildDir, path.join(buildDir, 'en-us'), path.join(buildDir, 'is-is')]) {
  await writeFile(path.join(dir, 'llms.txt'), llms, 'utf8');
}

console.log(`build-root: wrote index.html, 404.html and llms.txt for ${site}`);
