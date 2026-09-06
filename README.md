# Bifröst documentation site

The public documentation site for the **Bifröst** family of Microsoft Dynamics 365
Business Central extensions by Origo — <https://bifrost.origo.is>.

All public-facing material for every Bifröst app lives here and nowhere else:
product documentation, in-product (context-sensitive) help, extensibility
guidance for partners building dependent apps, and skills for AI agents driving
Bifröst through the MCP server. The app repositories keep only `README.md`,
`CHANGELOG.md` and code.

Built with [Docusaurus 3](https://docusaurus.io/) and deployed to GitHub Pages.

---

## Site structure

| Route | Instance | Contents |
| --- | --- | --- |
| `/{locale}/<app>/` | one docs instance per app | Product documentation: overview, setup, message-type reference, AppSource scenarios, listing copy |
| `/{locale}/help/<app>/` | one help instance per app | Context-sensitive help — one page per Business Central page |
| `/{locale}/extensibility/` | `extensibility` | How to build a dependent app on Bifröst Foundation |
| `/{locale}/skills/` | `skills` | Skills for AI agents using Bifröst through the Origo BC MCP server |

`<app>` is one of `foundation`, `iceland`, `iceland-treasury`, `iceland-docex`,
`bragi`, `hnitbjorg`, `nornir`, `clockify`, `subscription-billing`. The list is
declared once in [`apps.ts`](apps.ts); adding an entry there creates both
instances and both navbar entries.

On disk:

```
docs/<app>/                 English product documentation
docs/extensibility/         English extensibility guide
docs/skills/                English agent skills
help/<app>/                 English help pages
i18n/is-IS/docusaurus-plugin-content-docs-<instance>/current/
                            Icelandic translation of that instance
static/llms.txt             Machine-readable index for AI agents
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
https://bifrost.origo.is/en-us/help/hnitbjorg/storage-setup/
https://bifrost.origo.is/is-is/help/hnitbjorg/storage-setup/
```

Each app therefore sets, in `app/app.json`:

```jsonc
"help": "https://bifrost.origo.is/en-us/<app>/",
"contextSensitiveHelpUrl": "https://bifrost.origo.is/{0}/help/<app>/",
"supportedLocales": [ "en-US", "is-IS" ]
```

and every page uses a kebab-case slug instead of a file name:

```al
ContextSensitiveHelpPage = 'storage-setup';
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
| `SITE_URL` | `https://businesscentralal.github.io` | `https://bifrost.origo.is` |
| `BASE_URL` | `/bifrost/` | `/` |

Today the site is live at <https://businesscentralal.github.io/bifrost/>.

**To switch to `https://bifrost.origo.is`:**

1. Add a DNS `CNAME` record for `bifrost.origo.is` pointing at
   `businesscentralal.github.io`.
2. In this repository: **Settings → Pages → Custom domain**, enter
   `bifrost.origo.is` and wait for the DNS check to pass, then tick
   **Enforce HTTPS**. GitHub writes the `CNAME` file into the published site
   itself; it is deliberately **not** committed here, so the site keeps working
   on the `github.io` address until DNS actually exists.
3. In [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), change the
   two values under `env:` to `SITE_URL: https://bifrost.origo.is` and
   `BASE_URL: /`, then push.
4. Update `help` and `contextSensitiveHelpUrl` in each app's `app.json` — they
   already point at `bifrost.origo.is`, so nothing changes there.

Until step 3 is done, links published in `app.json` will not resolve. Do the DNS
record and the workflow change together.

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
root `index.html` (redirects by browser language, defaulting to English) and a
`404.html` that sends any unknown locale prefix to the English site.

## Generated message-type reference

Message-type reference pages are generated from the apps' own help codeunits
rather than written by hand, so they cannot drift from the product:

```powershell
pwsh tools/generate-message-type-docs.ps1            # all mapped apps
pwsh tools/generate-message-type-docs.ps1 -App nornir
```

The script calls the Bifröst queue API on the development container
(`Help.MessageTypes.Get`, then `Help.Implementation.Get` per type), maps each
type to its owning app, and writes one Markdown page per type into
`docs/<app>/reference/message-types/`. Credentials come from the user-level
environment variables `BC28IS_USER` and `BC28IS_PASSWORD` locally, or from the
`BC_USER` / `BC_PASSWORD` repository secrets in CI. See the script header for the
type-to-app mapping table.

Calls go out strictly one at a time, and the script takes a lock file
(`-LockFile`, `%TEMP%\bifrost-mcp.lock` by default) for the length of the run.
A burst of parallel calls has taken the shared development container's queue
endpoint down before, so if another process holds the lock, wait rather than
delete it.

The [`generate-docs.yml`](.github/workflows/generate-docs.yml) workflow runs it
weekly and on demand, and opens a pull request when the output changes.

**Repository secrets that must exist for that workflow** (not created by this
repository — an administrator must add them under *Settings → Secrets and
variables → Actions*):

| Secret | Value |
| --- | --- |
| `BC_USER` | Business Central user name for the documentation container |
| `BC_PASSWORD` | That user's web service access key or password |

The workflow is skipped automatically when the secrets are absent.

## Workflows

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `deploy.yml` | push to `main`, manual | Builds both locales and deploys to GitHub Pages |
| `preview.yml` | pull request | Builds both locales and uploads the result as an artifact |
| `generate-docs.yml` | weekly, manual | Regenerates message-type reference pages and opens a PR |

## Contributing

Documentation changes are made here, not in the app repositories. Keep English
under `docs/` and `help/`, and the Icelandic translation under the matching
`i18n/is-IS/docusaurus-plugin-content-docs-<instance>/current/` folder. Every
page needs `sidebar_position` and `title` front matter.

## Licence

Site code is MIT licensed — see [LICENSE](LICENSE). The documentation text,
product names and logos are © Origo ehf.
