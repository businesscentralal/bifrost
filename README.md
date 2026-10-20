# Bifröst documentation site

The public documentation site for the **Bifröst** family of Microsoft Dynamics 365
Business Central extensions by Origo — <https://docs.bifrost.origo.is>.

All public-facing material for every Bifröst app lives here and nowhere else:
product documentation and in-product (context-sensitive) help. The app repositories keep only `README.md`,
`CHANGELOG.md` and code.

Built with [Docusaurus 3](https://docusaurus.io/) and deployed to GitHub Pages.

---

## Site structure

| Route | Instance | Contents |
| --- | --- | --- |
| `/{locale}/<app>/` | one docs instance per app | Product documentation: overview, setup, AppSource scenarios, listing copy |
| `/{locale}/help/<app>/` | one help instance per app | Context-sensitive help — one page per Business Central page |

The app list is declared once in [`apps.ts`](apps.ts); adding an entry there
creates both instances and both navbar entries.

| `<app>` | Extension | Source repository |
| --- | --- | --- |
| `foundation` | Bifrost Foundation | `bc-origo-bifrost-core` |
| `language-models` | Bifrost Language Models | `bc-origo-bifrost-language-models` |
| `attachments` | Bifrost Attachments | `bc-origo-bifrost-attachments` |
| `inventory` | Bifrost Inventory | `bc-origo-bifrost-inventory` |
| `subscription-billing` | Bifrost Subscription Billing | `bc-origo-bifrost-subscription-billing` |
| `orchestrator` | Bifrost Orchestrator | `bc-origo-bifrost-orchestrator` |

The site documents published apps and the apps being prepared for AppSource (Attachments, Orchestrator,
Inventory and Subscription Billing are listed as coming soon). Every other unpublished app remains blocked.
Every listed app has a docs instance; a help instance exists only for an app with help pages, one page per
Business Central page that carries `ContextSensitiveHelpPage`, and no index page.

On disk:

```
docs/<app>/                 English product documentation
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

## Deployment target

The site never hard-codes its own address. Two environment variables decide
where a build is rooted; the deploy and preview workflows pass them in, and the
same values are the defaults for local builds:

| Variable | Value |
| --- | --- |
| `SITE_URL` | `https://docs.bifrost.origo.is` |
| `BASE_URL` | `/` |

The site is live at <https://docs.bifrost.origo.is/>. The DNS `CNAME` record
points `docs.bifrost.origo.is` at `businesscentralal.github.io`, and the custom
domain and **Enforce HTTPS** are set under **Settings → Pages**. GitHub writes
the `CNAME` file into the published site itself, so it is not committed here.

GitHub Pages redirects the old address,
`https://businesscentralal.github.io/bifrost/...`, to
`https://docs.bifrost.origo.is/...`, so apps whose `app.json` links (`help`,
`contextSensitiveHelpUrl`, `privacyStatement`, `EULA`) still use the `github.io`
address keep working. Move the apps to the new address in a later release.

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
Both English (`/en-us/`) and Icelandic (`/is-is/`) are built. The English site
keeps its language menu hidden; the existing Icelandic menu still links back
to English.

If a local build fails in `DocItem` with `Cannot read properties of undefined
(reading 'id')`, stale Docusaurus/webpack cache can be the cause. Clear the
cache and generated output, then rebuild **both** locales:

```bash
npm run clear
npm run build
```

For local testing, build with `SITE_URL=http://localhost:3000` so absolute links
stay on the local server rather than going to production.

## Message types

The site documents no message types: no per-type pages, no names, no parameters or examples. Readers
and agents read them from the environment, where they follow the installed apps (`Help.MessageTypes.Get`
and `Help.Implementation.Get`, or the MCP tools `describe_domains` and `describe_message_type`).

`tools/check-context-help.mjs --app <route> --source <repo>` checks an app's context-sensitive help
from source: `contextSensitiveHelpUrl` in `app.json`, and every page's `ContextSensitiveHelpPage`
against the pages under `help/<route>/` (and their is-IS translations). It exits non-zero when a link
is missing or broken.

## Workflows

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `deploy.yml` | push to `main`, manual | Builds both locales and deploys to GitHub Pages |
| `preview.yml` | pull request to `main` | Builds both locales, uploads an artifact, and deploys an Azure preview with a PR comment; removes the preview when the PR closes |

### Pull request previews

For PRs from branches in this repository, `preview.yml` deploys the full site to
Azure Static Web Apps using the repository Actions secret `SWA_API_TOKEN`.
The Azure deployment action comments the preview URL on the PR. Each PR keeps
its own address as new commits are pushed:

```text
https://lemon-coast-038b86303-<PR-number>.westeurope.1.azurestaticapps.net
```

Both `/en-us/` and `/is-is/` are published. The build uses the preview origin so
language links stay on the preview, and previews send a `noindex` header.
Closing or merging a PR removes its Azure preview. Production remains on
GitHub Pages via `deploy.yml`.

Fork and Dependabot PRs still run the build checks and upload an artifact, but
are not deployed because GitHub does not provide them with deployment secrets.
The deploy job needs `pull-requests: write` permission for the URL comment.

Preview URLs are publicly accessible, even for private repositories. Azure's
hosting plan limits the number of simultaneous preview environments (three on
the Free plan); further deployments fail if all slots are occupied. If the
Static Web App changes, update both `SWA_API_TOKEN` and the `SITE_URL` hostname
in `preview.yml`.

## Contributing

Documentation changes are made here, not in the app repositories. Keep English
under `docs/` and `help/`, and the Icelandic translation under the matching
`i18n/is-IS/docusaurus-plugin-content-docs-<instance>/current/` folder. Every
page needs `sidebar_position` and `title` front matter.

## Licence

Site code is MIT licensed — see [LICENSE](LICENSE). The documentation text,
product names and logos are © Origo ehf.
