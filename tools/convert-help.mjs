/**
 * Converts the standalone HTML help pages that used to ship inside each app
 * repository (`app/Help/en-US`, `app/Help/is-IS`) into Docusaurus Markdown.
 *
 *   node tools/convert-help.mjs --source <app/Help> --app <id> [--title "..."]
 *
 * The source pages all follow the same shape: a <nav> bar with a Home link, a
 * language switcher and related-page links; an <h1>; some prose; "Fields" and
 * "Actions" tables; and an <hr> + copyright footer. The nav bar and the footer
 * are dropped — Docusaurus provides both — and everything else is converted.
 *
 * File names become the page slug, kebab-cased, and every `*.html` link is
 * rewritten to the sibling slug. That slug is the value each Business Central
 * page must carry in its ContextSensitiveHelpPage property.
 */
import {readdir, readFile, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import TurndownService from 'turndown';
import {gfm} from 'turndown-plugin-gfm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Parses `--flag value` pairs; every flag used here takes a value. */
function args(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) out[argv[i].replace(/^--/, '')] = argv[i + 1];
  return out;
}

/** `StorageAccountLookup` -> `storage-account-lookup`, `setup-jq` -> `setup-jq`. */
export function slugify(stem) {
  return stem
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});
turndown.use(gfm);

// The nav bar and the copyright rule are site chrome in the source pages and
// are replaced by Docusaurus navigation, so they never reach the Markdown.
turndown.remove(['script', 'style', 'nav']);

// The source pages link to their own sections by id (`#bis30`). Markdown would
// otherwise generate a slug from the heading text and break every such link, so
// an explicit id is carried across as Docusaurus's `{#id}` suffix.
turndown.addRule('headingWithId', {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  replacement(content, node) {
    const level = Number(node.nodeName.charAt(1));
    const id = node.getAttribute('id');
    const heading = content.trim().replace(/\n+/g, ' ');
    return `\n\n${'#'.repeat(level)} ${heading}${id ? ` {#${id}}` : ''}\n\n`;
  },
});

/** Pulls the <body>, minus the trailing `<hr>` + copyright paragraph. */
function bodyOf(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return (body ? body[1] : html).replace(/<hr\s*\/?>[\s\S]*$/i, '');
}

function titleOf(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const raw = h1 ? h1[1] : (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? 'Help');
  return decodeEntities(raw.replace(/<[^>]+>/g, '')).trim();
}

function decodeEntities(text) {
  return text
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Rewrites intra-help links. `index.html` becomes the section root and any
 * other `*.html` becomes its sibling slug; cross-locale links (`../is-IS/x.html`)
 * are dropped because the navbar language switcher replaces them.
 */
function rewriteLinks(markdown, app) {
  return markdown
    .replace(/\]\(\.\.\/(?:en-US|is-IS)\/[^)]*\)/g, `](/help/${app}/)`)
    .replace(/\]\(index\.html\)/g, `](/help/${app}/)`)
    .replace(/\]\(([A-Za-z0-9._-]+)\.html(#[^)]*)?\)/g, (_m, stem, hash) => `](/help/${app}/${slugify(stem)}/${hash ?? ''})`);
}

/** Escapes the YAML front-matter scalar; titles contain `:` and quotes. */
const yaml = (value) => `"${String(value).replace(/"/g, '\\"')}"`;

async function convertLocale(sourceDir, outDir, app, indexTitle, position) {
  const files = (await readdir(sourceDir)).filter((f) => f.endsWith('.html')).sort();
  await mkdir(outDir, {recursive: true});

  const written = [];
  for (const file of files) {
    const stem = path.basename(file, '.html');
    const isIndex = stem.toLowerCase() === 'index';
    const slug = isIndex ? 'index' : slugify(stem);

    const html = await readFile(path.join(sourceDir, file), 'utf8');
    let markdown = turndown.turndown(bodyOf(html)).trim();

    // Turndown emits the h1 as `# Title`; the front matter already carries it,
    // and Docusaurus renders one from `title`, so drop the duplicate.
    markdown = markdown.replace(/^#\s+.*\n+/, '');
    markdown = rewriteLinks(markdown, app);
    // `{0}` and other braces are MDX expression syntax; the help text uses them
    // as literal placeholders.
    markdown = markdown.replace(/(?<!`)\{(\d+)\}(?!`)/g, '`{$1}`');

    const title = isIndex ? indexTitle : titleOf(html);
    const frontMatter = [
      '---',
      `id: ${slug}`,
      `title: ${yaml(title)}`,
      `sidebar_label: ${yaml(title.replace(/^Bifrost\s+/i, ''))}`,
      `sidebar_position: ${isIndex ? 1 : position.next()}`,
      isIndex ? 'slug: /' : null,
      '---',
      '',
    ]
      .filter((line) => line !== null)
      .join('\n');

    await writeFile(path.join(outDir, `${slug}.md`), `${frontMatter}\n${markdown}\n`, 'utf8');
    written.push(slug);
  }
  return written;
}

const opts = args(process.argv.slice(2));
if (!opts.source || !opts.app) {
  console.error('usage: node tools/convert-help.mjs --source <app/Help> --app <id> [--title "..."]');
  process.exit(1);
}

const indexTitle = opts.title ?? `Bifröst ${opts.app} — Help`;
let counter = 1;
const position = {next: () => ++counter};

const en = await convertLocale(
  path.join(opts.source, 'en-US'),
  path.join(root, 'help', opts.app),
  opts.app,
  indexTitle,
  position,
);

counter = 1;
const is = await convertLocale(
  path.join(opts.source, 'is-IS'),
  path.join(root, 'i18n', 'is-IS', `docusaurus-plugin-content-docs-help-${opts.app}`, 'current'),
  opts.app,
  indexTitle,
  position,
);

console.log(`convert-help ${opts.app}: en-US ${en.length} page(s), is-IS ${is.length} page(s)`);
console.log(`  slugs: ${en.filter((s) => s !== 'index').join(', ')}`);
