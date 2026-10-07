import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {Options as DocsOptions} from '@docusaurus/plugin-content-docs';
import {existsSync, readdirSync} from 'node:fs';
import {themes as prismThemes} from 'prism-react-renderer';
import {apps, crossAppInstances} from './apps';

/**
 * The site is built once per locale into a locale-prefixed folder, because
 * Business Central builds context-sensitive help URLs as
 *   <contextSensitiveHelpUrl with {0} = user locale><ContextSensitiveHelpPage>
 * which means BOTH locales must live behind a locale prefix — including the
 * default one. Docusaurus does not prefix the default locale, so instead of
 * relying on its i18n routing we build each locale as its own single-locale
 * site with an explicit baseUrl.
 *
 *   DOCUSAURUS_LOCALE=en-US  ->  baseUrl = ${BASE_URL}en-us/
 *   DOCUSAURUS_LOCALE=is-IS  ->  baseUrl = ${BASE_URL}is-is/
 *
 * Deployment target is controlled entirely by two environment variables so the
 * same commit deploys to GitHub Pages today and to the custom domain later:
 *
 *   SITE_URL   https://businesscentralal.github.io   |  https://docs.bifrost.origo.is
 *   BASE_URL   /bifrost/                             |  /
 */
const SITE_URL = process.env.SITE_URL ?? 'https://businesscentralal.github.io';
const BASE_URL = ensureTrailingSlash(process.env.BASE_URL ?? '/bifrost/');

const LOCALE_DIRS: Record<string, string> = {'en-US': 'en-us', 'is-IS': 'is-is'};
const buildLocale = process.env.DOCUSAURUS_LOCALE;
const localeDir = buildLocale ? LOCALE_DIRS[buildLocale] : undefined;

if (buildLocale && !localeDir) {
  throw new Error(
    `DOCUSAURUS_LOCALE="${buildLocale}" is not supported. Use one of: ${Object.keys(LOCALE_DIRS).join(', ')}`,
  );
}

/** baseUrl of the site currently being built (locale-prefixed for real builds). */
const baseUrl = localeDir ? `${BASE_URL}${localeDir}/` : BASE_URL;

/**
 * Absolute root of the deployed site. Docusaurus resolves a bare `href`
 * against the current baseUrl, which for a locale build already contains the
 * locale segment — so anything that has to escape the locale (the language
 * switcher, llms.txt) must be a fully qualified URL.
 */
const siteRoot = `${SITE_URL.replace(/\/$/, '')}${BASE_URL}`;

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

/** Builds a docs plugin instance with the conventions shared by every section. */
/**
 * An app's sidebar keeps two items on top, Overview and Capabilities, and folds everything else
 * (message type guides, the generated reference, listing and validation texts) into one collapsed
 * "Reference" group. The pages and their addresses do not change.
 */
const groupAppSidebar: NonNullable<DocsOptions['sidebarItemsGenerator']> = async ({defaultSidebarItemsGenerator, ...args}) => {
  const items = await defaultSidebarItemsGenerator(args);
  const top = items.filter((item) => item.type === 'doc' && ['index', 'capabilities'].includes(item.id));
  const rest = items.filter((item) => !top.includes(item));
  if (!rest.length) return items;
  return [
    ...top,
    {
      type: 'category',
      label: buildLocale === 'is-IS' ? 'Tilvísanir' : 'Reference',
      collapsed: true,
      collapsible: true,
      items: rest,
    },
  ];
};

function docsInstance(id: string, routeBasePath: string, path: string, isApp = false): [string, DocsOptions] {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id,
      path,
      routeBasePath,
      sidebarPath: './sidebars.ts',
      showLastUpdateTime: true,
      ...(isApp ? {sidebarItemsGenerator: groupAppSidebar} : {}),
    } satisfies DocsOptions,
  ];
}

/**
 * A help instance: one page per Business Central page, opened from that page's help icon and never
 * browsed. No sidebar, so no list of pages, no breadcrumbs and no previous/next links.
 */
function helpInstance(id: string, routeBasePath: string, path: string): [string, DocsOptions] {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id,
      path,
      routeBasePath,
      sidebarPath: false,
      breadcrumbs: false,
      showLastUpdateTime: true,
    } satisfies DocsOptions,
  ];
}


/**
 * Client-side redirects from former route ids.
 * Each locale build uses a locale-prefixed baseUrl, so these paths are relative
 * to that base (e.g. /en-us/cost/ → /en-us/price/).
 *
 * Explicit `redirects` cover help pages whose slug renamed with the product id.
 * `createRedirects` covers every other page under the old folder prefixes.
 */
const routeIdRenames: Array<[fromPrefix: string, toPrefix: string]> = [
  ['/cost', '/price'],
  ['/foundation/licensing', '/licensing'],
];

const slugRenames: Array<{from: string; to: string}> = [
  // Licensing, Terms of Use and Privacy moved out of Foundation into their own section.
  {from: '/foundation/eula', to: '/licensing/eula'},
  {from: '/foundation/privacy', to: '/licensing/privacy'},
];

function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * Context-sensitive help is reached from Business Central, never browsed: a help instance has no
 * index page, and an app gets one only when it has help pages (pages with ContextSensitiveHelpPage).
 */
const helpApps = apps.filter((app) =>
  existsSync(`help/${app.id}`) && readdirSync(`help/${app.id}`).some((file) => /.mdx?$/.test(file)));

const docsPlugins = [
  ...apps.map((app) => docsInstance(app.id, app.id, `docs/${app.id}`, true)),
  ...helpApps.map((app) => helpInstance(`help-${app.id}`, `help/${app.id}`, `help/${app.id}`)),
  ...crossAppInstances.map((section) => docsInstance(section.id, section.id, `docs/${section.id}`)),
];

const config: Config = {
  title: 'Bifröst',
  tagline: 'Business Central, connected',
  favicon: 'img/favicon.ico',

  url: SITE_URL,
  baseUrl,

  organizationName: 'businesscentralal',
  projectName: 'bifrost',
  trailingSlash: true,

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  // Each build produces exactly one locale, at an explicit locale-prefixed
  // baseUrl. The language switcher in the navbar links across the two builds.
  i18n: {
    defaultLocale: buildLocale ?? 'en-US',
    locales: [buildLocale ?? 'en-US'],
  },

  markdown: {
    mermaid: true,
    hooks: {onBrokenMarkdownLinks: 'warn'},
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {customCss: './src/css/custom.css'},
        sitemap: {lastmod: 'date', changefreq: 'weekly'},
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    ...docsPlugins,
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        // No instance is called "default" here, so the search bar has to be
        // told which one to read version preferences from.
        docsPluginIdForPreferredVersion: 'foundation',
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: [
          ...apps.map((app) => app.id),
          ...helpApps.map((app) => `help/${app.id}`),
          ...crossAppInstances.map((section) => section.id),
        ],
        language: ['en'],
        searchResultLimits: 12,
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: slugRenames.map(({from, to}) => ({
          from: withTrailingSlash(from),
          to: withTrailingSlash(to),
        })),
        createRedirects(existingPath: string) {
          const normalized = existingPath.endsWith('/')
            ? existingPath.slice(0, -1)
            : existingPath;
          const fromPaths: string[] = [];
          for (const [fromPrefix, toPrefix] of routeIdRenames) {
            if (normalized === toPrefix || normalized.startsWith(`${toPrefix}/`)) {
              const suffix = normalized.slice(toPrefix.length);
              fromPaths.push(withTrailingSlash(`${fromPrefix}${suffix}`));
            }
          }
          return fromPaths.length > 0 ? fromPaths : undefined;
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/foundation.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Bifröst',
      items: [
        // Left to right, the reader's journey: set it up and try it, then one page per role (users,
        // administrators, developers), the concepts once, the price, and licensing and terms. The apps
        // sit on the right. Roles are in the menu; the topics of a role sit under it in the sidebar.
        {label: buildLocale === 'is-IS' ? 'Uppsetning' : 'Set it up', to: '/setup/', position: 'left'},
        {label: buildLocale === 'is-IS' ? 'Prófaðu' : 'Try it out', to: '/try-it-out/', position: 'left'},
        {label: buildLocale === 'is-IS' ? 'Notendur' : 'Users', to: '/documentation/end-customers/users/', position: 'left'},
        {label: buildLocale === 'is-IS' ? 'Kerfisstjórar' : 'Administrators', to: '/documentation/end-customers/administrators/', position: 'left'},
        {label: buildLocale === 'is-IS' ? 'Forritarar' : 'Developers', to: '/documentation/end-customers/developers/', position: 'left'},
        {label: buildLocale === 'is-IS' ? 'Hvernig það virkar' : 'How it works', to: '/documentation/how-it-works/', position: 'left'},
        {label: buildLocale === 'is-IS' ? 'Verð' : 'Price', to: '/price/', position: 'left'},
        {label: buildLocale === 'is-IS' ? 'Leyfi' : 'Licensing', to: '/licensing/', position: 'left'},
        // On the right, set apart: the apps. Only published apps are shown (Foundation for now), then the
        // list of all apps. The label and the items share one framed group (.navApps).
        {type: 'html', position: 'right', value: `<span class="navAppsLabel">${buildLocale === 'is-IS' ? 'Forrit' : 'Apps'}</span>`, className: 'navApps'},
        {label: 'Foundation', to: '/foundation/', position: 'right', activeBasePath: '/foundation/', className: 'navApps navAppsItem'},
        {label: buildLocale === 'is-IS' ? 'Öll forrit' : 'All apps', to: '/apps/', position: 'right', className: 'navApps navAppsItem'},
        // The Icelandic site is not offered from the English one until the new chapters are
        // translated; the Icelandic build keeps the switcher so its readers can reach English.
        ...(buildLocale === 'is-IS'
          ? [
            {
              type: 'dropdown' as const,
              label: 'Íslenska',
              position: 'right' as const,
              items: [
                {label: 'English', href: `${siteRoot}en-us/`, target: '_self'},
                {label: 'Íslenska', href: `${siteRoot}is-is/`, target: '_self'},
              ],
            },
          ]
          : []),
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: buildLocale === 'is-IS' ? 'Byrjaðu' : 'Get going',
          items: [
            {label: buildLocale === 'is-IS' ? 'Uppsetning' : 'Set it up', to: '/setup/'},
            {label: buildLocale === 'is-IS' ? 'Prófaðu' : 'Try it out', to: '/try-it-out/'},
            {label: buildLocale === 'is-IS' ? 'Verð' : 'Price', to: '/price/'},
            {label: buildLocale === 'is-IS' ? 'Leiðbeiningar' : 'Guides', to: '/documentation/'},
            {label: buildLocale === 'is-IS' ? 'Persónuvernd' : 'Privacy', to: '/licensing/privacy/'},
            {label: buildLocale === 'is-IS' ? 'Notkunarskilmálar' : 'Terms of Use', to: '/licensing/eula/'},
          ],
        },
        {
          title: buildLocale === 'is-IS' ? 'Forrit' : 'Apps',
          items: [
            {label: buildLocale === 'is-IS' ? 'Öll forrit' : 'All apps', to: '/apps/'},
            ...apps.map((app) => ({label: app.title, to: `/${app.id}/`})),
          ],
        },
        {
          title: buildLocale === 'is-IS' ? 'Fyrir vélar' : 'For machines',
          items: [
            {label: 'llms.txt', href: `${siteRoot}llms.txt`, target: '_self'},
            {label: 'apps.json', href: `${siteRoot}apps.json`, target: '_self'},
            {label: buildLocale === 'is-IS' ? 'Kóði þessarar síðu (GitHub)' : 'Site source (GitHub)', href: 'https://github.com/businesscentralal/bifrost'},
          ],
        },
        {
          title: 'Origo',
          items: [
            {label: 'origo.is', href: 'https://www.origo.is/'},
            {label: buildLocale === 'is-IS' ? 'Persónuverndarstefna Origo' : 'Origo privacy policy', href: 'https://www.origo.is/um-origo/stefnur/personuverndarstefna'},
            {label: buildLocale === 'is-IS' ? 'Skilmálar og öryggismál' : 'Origo terms and security', href: 'https://www.origo.is/skilmalar-og-oryggismal'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Origo ehf. Bifröst is a family of Business Central extensions by Origo.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['json', 'powershell', 'bash', 'csharp', 'pascal'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
