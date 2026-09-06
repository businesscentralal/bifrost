import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {Options as DocsOptions} from '@docusaurus/plugin-content-docs';
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
 *   SITE_URL   https://businesscentralal.github.io   |  https://bifrost.origo.is
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

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

/** Builds a docs plugin instance with the conventions shared by every section. */
function docsInstance(id: string, routeBasePath: string, path: string): [string, DocsOptions] {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id,
      path,
      routeBasePath,
      sidebarPath: './sidebars.ts',
      editUrl: 'https://github.com/businesscentralal/bifrost/tree/main/',
      showLastUpdateTime: true,
    } satisfies DocsOptions,
  ];
}

const docsPlugins = [
  ...apps.map((app) => docsInstance(app.id, app.id, `docs/${app.id}`)),
  ...apps.map((app) => docsInstance(`help-${app.id}`, `help/${app.id}`, `help/${app.id}`)),
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
  onBrokenMarkdownLinks: 'warn',

  // Each build produces exactly one locale, at an explicit locale-prefixed
  // baseUrl. The language switcher in the navbar links across the two builds.
  i18n: {
    defaultLocale: buildLocale ?? 'en-US',
    locales: [buildLocale ?? 'en-US'],
  },

  markdown: {
    mermaid: true,
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
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: [
          ...apps.map((app) => app.id),
          ...apps.map((app) => `help/${app.id}`),
          ...crossAppInstances.map((section) => section.id),
        ],
        language: ['en'],
        searchResultLimits: 12,
      },
    ],
  ],

  themeConfig: {
    image: 'img/bifrost-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Bifröst',
      items: [
        {
          type: 'dropdown',
          label: 'Apps',
          position: 'left',
          items: apps.map((app) => ({label: app.title, to: `/${app.id}/`})),
        },
        {
          type: 'dropdown',
          label: 'Help',
          position: 'left',
          items: apps.map((app) => ({label: app.title, to: `/help/${app.id}/`})),
        },
        {label: 'Extensibility', to: '/extensibility/', position: 'left'},
        {label: 'Skills', to: '/skills/', position: 'left'},
        {
          type: 'dropdown',
          label: buildLocale === 'is-IS' ? 'Íslenska' : 'English',
          position: 'right',
          items: [
            {label: 'English', href: `${BASE_URL}en-us/`, target: '_self'},
            {label: 'Íslenska', href: `${BASE_URL}is-is/`, target: '_self'},
          ],
        },
        {
          href: 'https://github.com/businesscentralal/bifrost',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Apps',
          items: apps.slice(0, 5).map((app) => ({label: app.title, to: `/${app.id}/`})),
        },
        {
          title: 'More apps',
          items: apps.slice(5).map((app) => ({label: app.title, to: `/${app.id}/`})),
        },
        {
          title: 'Build on Bifröst',
          items: [
            {label: 'Extensibility', to: '/extensibility/'},
            {label: 'Skills for AI agents', to: '/skills/'},
            {label: 'llms.txt', href: `${BASE_URL}llms.txt`, target: '_self'},
            {label: 'GitHub', href: 'https://github.com/businesscentralal/bifrost'},
          ],
        },
        {
          title: 'Origo',
          items: [
            {label: 'origo.is', href: 'https://www.origo.is/'},
            {label: 'Privacy', href: 'https://www.origo.is/um-origo/stefnur/personuverndarstefna'},
            {label: 'Terms', href: 'https://www.origo.is/skilmalar-og-oryggismal'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Origo ehf. Bifröst is a family of Business Central extensions published on Microsoft AppSource.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['json', 'powershell', 'bash', 'csharp', 'pascal'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
