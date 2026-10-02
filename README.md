# Bifröst documentation site

The public documentation site for the **Bifröst** family of Microsoft Dynamics 365
Business Central extensions by Origo — <https://docs.bifrost.origo.is>.

All public-facing material for every Bifröst app lives here and nowhere else:
product documentation, in-product (context-sensitive) help and extensibility
guidance for partners building dependent apps. The app repositories keep only `README.md`,
`CHANGELOG.md` and code.

Built with [Docusaurus 3](https://docusaurus.io/) and deployed to GitHub Pages.

---

## Site structure

| Route | Instance | Contents |
| --- | --- | --- |
| `/{locale}/<app>/` | one docs instance per app | Product documentation: overview, setup, AppSource scenarios, listing copy |
| `/{locale}/help/<app>/` | one help instance per app | Context-sensitive help — one page per Business Central page |
| `/{locale}/extensibility/` | `extensibility` | How to build a dependent app on Bifröst Foundation |

The app list is declared once in [`apps.ts`](apps.ts); adding an entry there
creates both instances and both navbar entries.

| `<app>` | Extension | Source repository |
| --- | --- | --- |
| `foundation` | Bifrost Foundation | `bc-origo-bifrost-core` |

The site documents published apps only, so the list holds Foundation alone for now.
An app joins it when it is published on AppSource. Every listed app has a docs
instance; a help instance exists only for an app with help pages, one page per
Business Central page that carries `ContextSensitiveHelpPage`, and no index page.

On disk:

```
docs/<app>/                 English product documentation
docs/extensibility/         English extensibility guide
help/<app>/                 English help pages
i18n/is-IS/docusaurus-plugin-content-docs-<instance>/current/
                            Icelandic translation of that instance
tools/                      Scaffolding and generator scripts
```

## The help URL contract with Business Central

Business Central builds a context-sensitive help URL as

```
<contextSensitiveHelpUrl with {0} replaced by the user's locale><ContextSensitiveHelpPage>
```

so **both** locales must sit behind a locale prefix — including the default one.
Docusaurus does not prefix its default locale, so the site is built once per
locale as its own single-locale site with an explicit `baseUrl`. That gives:

```
https://docs.bifrost.origo.is/en-us/help/foundation/bifrost-setup/
https://docs.bifrost.origo.is/is-is/help/foundation/bifrost-setup/
```

Each app therefore sets, in `app/app.json`:

```jsonc
"help": "https://docs.bifrost.origo.is/en-us/<app>/",
"contextSensitiveHelpUrl": "https://docs.bifrost.origo.is/{0}/help/<app>/",
"supportedLocales": [ "en-US", "is-IS" ]
```

and every page uses a kebab-case slug instead of a file name:

```al
ContextSensitiveHelpPage = 'bifrost-setup';
```

Every page or page extension carrying that property must have a matching help
page in `help/<app>/`. Locale folders are lower-case (`en-us`, `is-is`) because
that is the casing Business Central substitutes into `{0}`, and GitHub Pages
paths are case-sensitive.

## Deployment target — switching to the custom domain

The site never hard-codes its own address. Two environment variables decide
where a build is rooted, and the deploy workflow passes them in:

| Variable | GitHub Pages (today) | Custom domain (after DNS) |
| --- | --- | --- |
| `SITE_URL` | `https://businesscentralal.github.io` | `https://docs.bifrost.origo.is` |
| `BASE_URL` | `/bifrost/` | `/` |

Today the site is live at <https://businesscentralal.github.io/bifrost/>.

**To switch to `https://docs.bifrost.origo.is`:**

1. Add a DNS `CNAME` record for `docs.bifrost.origo.is` pointing at
   `businesscentralal.github.io`.
2. In this repository: **Settings → Pages → Custom domain**, enter
   `docs.bifrost.origo.is` and wait for the DNS check to pass, then tick
   **Enforce HTTPS**. GitHub writes the `CNAME` file into the published site
   itself; it is deliberately **not** committed here, so the site keeps working
   on the `github.io` address until DNS actually exists.
3. In [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), change the
   two values under `env:` to `SITE_URL: https://docs.bifrost.origo.is` and
   `BASE_URL: /`, then push.
4. Leave the apps' `app.json` links (`help`, `contextSensitiveHelpUrl`,
   `privacyStatement`, `EULA`) on the `github.io` address for now. Once the custom
   domain is set, GitHub Pages redirects `https://businesscentralal.github.io/bifrost/...`
   to `https://docs.bifrost.origo.is/...`, so published apps keep working. Move the
   apps to the new address in a later release.

Do the DNS record and the workflow change together.

## Local development

Requires Node 20 or newer (developed on Node 24, npm 11).

```bash
npm install
npm start                  # dev server, English, unprefixed baseUrl
npm run start:is           # dev server, Icelandic
npm run build              # both locales into build/en-us and build/is-is
npm run serve              # serve the combined build at http://localhost:3000
```

`npm run build` runs three steps: an English build into `build/en-us`, an
Icelandic build into `build/is-is`, and `tools/build-root.mjs`, which writes the
root `index.html` (redirects by browser language, defaulting to English), a
`404.html` that sends any unknown locale prefix to the English site, and
`llms.txt` — the machine-readable index for AI agents, written at the site root
and inside each locale. `llms.txt` is generated, not committed: it carries
absolute URLs and is only correct once `SITE_URL` and `BASE_URL` are known.

## Message types

The site documents no message types: no per-type pages, no names, no parameters or examples. Readers
and agents read them from the environment, where they follow the installed apps (`Help.MessageTypes.Get`
and `Help.Implementation.Get`, or the MCP tools `list_message_types` and `describe_message_type`).

`tools/check-context-help.mjs --app <route> --source <repo>` checks an app's context-sensitive help
from source: `contextSensitiveHelpUrl` in `app.json`, and every page's `ContextSensitiveHelpPage`
against the pages under `help/<route>/` (and their is-IS translations). It exits non-zero when a link
is missing or broken.

## Workflows

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `deploy.yml` | push to `main`, manual | Builds both locales and deploys to GitHub Pages |
| `preview.yml` | pull request | Builds both locales and uploads the result as an artifact |

## Contributing

Documentation changes are made here, not in the app repositories. Keep English
under `docs/` and `help/`, and the Icelandic translation under the matching
`i18n/is-IS/docusaurus-plugin-content-docs-<instance>/current/` folder. Every
page needs `sidebar_position` and `title` front matter.

## Licence

Site code is MIT licensed — see [LICENSE](LICENSE). The documentation text,
product names and logos are © Origo ehf.
