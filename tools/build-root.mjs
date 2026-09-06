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

console.log(`build-root: wrote index.html and 404.html for baseUrl ${BASE_URL}`);
