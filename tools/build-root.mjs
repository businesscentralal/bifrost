/**
 * Assembles the deployable site from the two locale builds.
 *
 * `build/en-us` (and, when Icelandic is published, `build/is-is`) are produced
 * by separate Docusaurus builds. This script adds the files that live above them:
 *
 *   build/index.html   forwards to the English site
 *   build/404.html     catches everything else, including unknown locale
 *                      prefixes such as /da-dk/help/foundation/
 *   build/apps.json    a locale-agnostic copy of data/apps.json, alongside the
 *                      per-locale /en-us/apps.json and /is-is/apps.json that
 *                      tools/copy-apps-json.mjs publishes via static/
 *
 * When Icelandic is not built (`npm run build:en-only`), it
 * also writes `build/is-is/<path>/index.html` for every English page: a small
 * page that forwards to the same path under /en-us/. Business Central's help
 * button and old bookmarks use /is-is/... links, and they keep working.
 *
 * Both HTML pages are plain HTML with a <noscript> fallback, so a reader with
 * scripting disabled still gets a working link rather than a blank page.
 *
 *   node tools/build-root.mjs
 */
import {writeFile, access, readFile, readdir, mkdir} from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, 'build');

const BASE_URL = (process.env.BASE_URL ?? '/').replace(/\/?$/, '/');

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
  </p>
</main>
</body>
</html>
`;

const exists = (p) => access(p, constants.F_OK).then(() => true).catch(() => false);

/**
 * Icelandic is published when `build/is-is` was built (`npm run build`, both locales).
 * `npm run build:en-only` builds English alone, for a quick check;
 * the Icelandic source files stay in i18n/is-IS and are kept up to date.
 */
const FORWARD_MARK = '<meta name="bifrost-forward" content="en-us">';
const isIndex = path.join(buildDir, 'is-is', 'index.html');
// The forwarding pages below also write build/is-is/index.html; they carry a
// mark so that running this script twice does not mistake them for a build.
const OFFER_ICELANDIC = (await exists(isIndex)) && !(await readFile(isIndex, 'utf8')).includes(FORWARD_MARK);

/**
 * The site root always opens English, whatever the browser's language list says.
 * Icelandic readers switch with the language menu, and Business Central's help
 * button links to /is-is/ directly.
 */
const chooseLocale = `
  location.replace(${JSON.stringify(BASE_URL)} + 'en-us/');
`;

/**
 * GitHub Pages serves this one 404 for every missing path on the site, so it
 * has to tell two cases apart:
 *
 *   /xx-yy/help/foundation/setup/   an unsupported or differently-cased locale —
 *                               rewrite the prefix and keep the rest of the
 *                               path, so a Business Central client asking for
 *                               a locale we do not publish still lands on the
 *                               right help page;
 *   /en-us/foundation/typo/         a genuinely missing page inside a locale we do
 *                               publish — leave it alone. Rewriting it would
 *                               produce the same URL and loop forever.
 */
const rescueLocale = `
  var base = ${JSON.stringify(BASE_URL)};
  var offerIcelandic = ${OFFER_ICELANDIC};
  var rest = location.pathname.slice(base.length);
  var match = rest.match(/^([a-z]{2}(?:-[a-z]{2})?)\\/(.*)$/i);
  if (match) {
    // Compared case-sensitively on purpose: GitHub Pages paths are
    // case-sensitive, so /en-US/ is a miss that must be rewritten to /en-us/.
    if (match[1] !== 'en-us' && (match[1] !== 'is-is' || !offerIcelandic)) {
      var locale = match[1].toLowerCase();
      var target = offerIcelandic && (locale === 'is' || locale.indexOf('is-') === 0) ? 'is-is/' : 'en-us/';
      location.replace(base + target + match[2] + location.search + location.hash);
    }
  }
`;

for (const locale of OFFER_ICELANDIC ? ['en-us', 'is-is'] : ['en-us']) {
  if (!(await exists(path.join(buildDir, locale, 'index.html')))) {
    throw new Error(
      `build/${locale}/index.html is missing — run the ${locale} Docusaurus build before tools/build-root.mjs`,
    );
  }
}

await writeFile(path.join(buildDir, 'index.html'), page('Bifröst', chooseLocale), 'utf8');
await writeFile(path.join(buildDir, '404.html'), page('Bifröst — page not found', rescueLocale), 'utf8');

/** Every folder under build/en-us that holds an index.html, as a path relative to it. */
async function pagePaths(dir, rel = '') {
  const found = [];
  for (const entry of await readdir(path.join(dir, rel), {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;
    const sub = rel ? `${rel}/${entry.name}` : entry.name;
    if (await exists(path.join(dir, sub, 'index.html'))) found.push(sub);
    found.push(...(await pagePaths(dir, sub)));
  }
  return found;
}

const forwardPage = (target) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
${FORWARD_MARK}
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<title>Bifröst</title>
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
</head>
<body><p><a href="${target}">Bifröst documentation (English)</a></p></body>
</html>
`;

let forwarded = 0;
if (!OFFER_ICELANDIC) {
  const enDir = path.join(buildDir, 'en-us');
  for (const rel of ['', ...(await pagePaths(enDir))]) {
    const target = `${BASE_URL}en-us/${rel ? `${rel}/` : ''}`;
    await mkdir(path.join(buildDir, 'is-is', rel), {recursive: true});
    await writeFile(path.join(buildDir, 'is-is', rel, 'index.html'), forwardPage(target), 'utf8');
    forwarded++;
  }
}

/**
 * llms.txt — the entry point for an agent handed nothing but the site address.
 * It is written at the site root (not inside a locale) and carries absolute
 * URLs, so it is only correct once SITE_URL and BASE_URL are known: build time.
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://docs.bifrost.origo.is').replace(/\/$/, '');
const site = `${SITE_URL}${BASE_URL}`;
const en = `${site}en-us/`;

const appSections = [
  ['foundation', 'Bifröst Foundation (the base app, always installed) — how Bifröst works, and the standard Business Central operations'],
];

const llms = [
  '# Bifröst',
  '',
  '> Bifröst is a family of Microsoft Dynamics 365 Business Central extensions by Origo.',
  '> Every operation is a message: a JSON envelope posted to one of three REST endpoints,',
  '> routed by its `type` field. Bifröst Foundation is the kernel; the other apps add',
  '> message types for banks, storage, documents, schedules and language models.',
  '',
  ...(OFFER_ICELANDIC
    ? ['This site holds all public documentation for those apps in English (`/en-us/`) and',
       'Icelandic (`/is-is/`). The paths below are the English ones.']
    : ['This site holds all public documentation for those apps, in English (`/en-us/`).']),
  '',
  '## Apps and message types',
  '',
  'An app is what a company installs; Foundation is always installed and brings the standard',
  'Business Central operations, and every other app adds operations of its own. The operations an',
  'agent can call are message types. They are not listed here: read them from the environment, where',
  'they follow the installed apps. The MCP tools `list_message_types` and `describe_message_type` list',
  'them and return the contract of one; over the API, `Help.MessageTypes.Get` and',
  '`Help.Implementation.Get` do the same.',
  '',
  'If a user asks for something no installed message type does, say so, and suggest their Business',
  'Central partner or Origo, or building it (see Building on Bifröst).',
  `Explained for people: ${en}documentation/how-it-works/`,
  '',
  '## Setting it up and using it',
  '',
  'For helping a person rather than calling the API yourself.',
  '',
  `- [Set it up](${en}setup/): the setup steps in order, and who is needed for each one.`,
  `- [How Bifröst works](${en}documentation/how-it-works/): the concepts, once.`,
  `- [Documentation](${en}documentation/): pages for users, administrators and developers.`,
  `- [Try it out](${en}try-it-out/): trying it in a sandbox, with first questions to ask.`,
  '',
  '## Apps',
  '',
  ...appSections.map(([id, description]) =>
    `- [${description}](${en}${id}/)`),
  `- [All apps](${en}apps/) and the machine-readable [apps.json](${site}apps.json)`,
  '',
  '## In-product help',
  '',
  'Business Central opens one help page per Business Central page from its help icon, at',
  `${en}help/<app>/<page>/. The pages are reached from Business Central; there is no index.`,
  '',
  '## Optional',
  '',
  `- [Site source](https://github.com/businesscentralal/bifrost): the documentation is generated and maintained here.`,
  '',
].join('\n');

// Written at the site root and inside each locale, so that both
// `<site>/llms.txt` and `<site>/en-us/llms.txt` resolve — an agent guesses one
// or the other and should not have to guess right.
for (const dir of [buildDir, path.join(buildDir, 'en-us'), ...(OFFER_ICELANDIC ? [path.join(buildDir, 'is-is')] : [])]) {
  await writeFile(path.join(dir, 'llms.txt'), llms, 'utf8');
}

await writeFile(path.join(buildDir, 'apps.json'), await readFile(path.join(root, 'data', 'apps.json')));

console.log(`build-root: wrote index.html, 404.html, llms.txt and apps.json for ${site}` +
  (OFFER_ICELANDIC ? '' : `; Icelandic not published, ${forwarded} /is-is/ pages forward to English`));
