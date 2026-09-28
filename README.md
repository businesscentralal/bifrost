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

The app list is declared once in [`apps.ts`](apps.ts); adding an entry there
creates both instances and both navbar entries.

| `<app>` | Extension | Source repository |
| --- | --- | --- |
| `foundation` | Bifrost Foundation | `bc-origo-bifrost-core` |
| `iceland` | Bifrost Iceland | `bc-origo-bifrost-iceland` |
| `iceland-treasury` | Bifrost Iceland Treasury | `bc-origo-bifrost-iceland-treasury` |
| `iceland-docex` | Bifrost Iceland DocEx | `bc-origo-bifrost-iceland-docex` |
| `language-models` | Bifrost Language Models | `bc-origo-bifrost-language-models` |
| `attachments` | Bifrost Attachments | `bc-origo-bifrost-attachments` |
| `orchestrator` | Bifrost Orchestrator | `bc-origo-bifrost-orchestrator` |
| `timesheets` | Bifrost Timesheets | `bc-origo-bifrost-timesheets` |
| `subscription-billing` | Bifrost Subscription Billing | `bc-origo-bifrost-subscription-billing` |
| `inventory` | Bifrost Inventory | `bc-origo-bifrost-inventory` |

Every app has a docs instance. A help instance holds one page per Business
Central page that carries `ContextSensitiveHelpPage`, so an app with no pages of
its own — Subscription Billing — has an index page and nothing else.

On disk:

```
docs/<app>/                 English product documentation
docs/extensibility/         English extensibility guide
docs/skills/                English agent skills
help/<app>/                 English help pages
i18n/is-IS/docusaurus-plugin-content-docs-<instance>/current/
                            Icelandic translation of that instance
static/skills/              Skill files served verbatim to AI agents
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
https://bifrost.origo.is/en-us/help/attachments/storage-setup/
https://bifrost.origo.is/is-is/help/attachments/storage-setup/
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
root `index.html` (redirects by browser language, defaulting to English), a
`404.html` that sends any unknown locale prefix to the English site, and
`llms.txt` — the machine-readable index for AI agents, written at the site root
and inside each locale. `llms.txt` is generated, not committed: it carries
absolute URLs and is only correct once `SITE_URL` and `BASE_URL` are known.

## Agent skills

A skill is what an AI agent loads before it writes code against Bifröst. They
follow the standard Agent Skills layout, so an agent reads a short file and then
fetches only the part it needs:

```
static/skills/bifrost-bc-integration/SKILL.md          the model, the rules, an index
static/skills/bifrost-bc-integration/references/*.md   one file per area
static/skills/bifrost-<app>/SKILL.md                   what that app adds, as an index
```

Those files are the authoritative copy. Three scripts keep everything else in
step with them:

```bash
node tools/generate-app-skills.mjs   # rebuild the per-app skills from apps.ts + docs/
node tools/render-skills.mjs         # rebuild docs/skills/** from static/skills/**
node tools/check-skill-split.mjs     # prove the 2026 split of the core skill lost nothing
```

`render-skills.mjs` writes one page per skill file under `docs/skills/`, so the
pages cannot drift from the files; edit the skill, then rerun it. Everything it
writes is deleted and rewritten on each run.

`check-skill-split.mjs` exists because the core skill used to be a single 286 kB
file. It reads that file out of git history and proves that every heading,
fenced code block and table row in it still appears exactly once across
`SKILL.md` and `references/`. Run it after moving content between reference
files.

`generate-app-skills.mjs` reads the message-type pages under
`docs/<app>/reference/message-types/`, so run it after regenerating those.

## Generated message-type reference

Message-type reference pages are generated from the apps' own help codeunits
rather than written by hand, so they cannot drift from the product:

```powershell
pwsh tools/generate-message-type-docs.ps1            # all mapped apps
pwsh tools/generate-message-type-docs.ps1 -App orchestrator
```

The script calls the Bifröst queue API (`Help.MessageTypes.Get`, then
`Help.Implementation.Get` per type), maps each type to its owning app, and writes
one Markdown page per type into `docs/<app>/reference/message-types/`. See the
script header for the type-to-app mapping table.

The API root comes from `BIFROST_DOCS_BASEURL` (environment variable locally,
repository secret in CI); it is never committed. It is the root ending in the
company segment, and the script appends `/tasks` itself:

| Target | `BIFROST_DOCS_BASEURL` shape |
| --- | --- |
| Business Central online | `https://api.businesscentral.dynamics.com/v2.0/<tenant>/<environment>/api/origo/bifrost/v1.0/companies(<id>)` |
| On-premises instance | `https://<host>/<instance>/api/origo/bifrost/v1.0/companies(<id>)` |

### Authentication

`-Auth Auto` (the default) picks the method from the environment and prints one
line naming it. `-Auth OAuth` or `-Auth Basic` forces one. Credentials are read
from environment variables only, never from the command line, and are never
printed or written anywhere.

- **OAuth2 client credentials** (Business Central online), used when all three
  of these are set:

  | Variable | Value |
  | --- | --- |
  | `BC_TENANT_ID` | Microsoft Entra tenant (`-EntraTenantId` overrides) |
  | `BC_CLIENT_ID` | Application (client) id of the app registration (`-ClientId` overrides) |
  | `BC_CLIENT_SECRET` | Client secret. Environment variable only; there is no parameter for it |

  The script requests a token for the scope
  `https://api.businesscentral.dynamics.com/.default` from the tenant's Microsoft
  identity platform v2.0 token endpoint, keeps it in memory for the run and
  renews it shortly before it expires. Online, the tenant is part of the URL
  path, so no `?tenant=` query string is sent.

  This needs an app registration in Microsoft Entra ID with the Dynamics 365
  Business Central application permission `API.ReadWrite.All` or
  `Automation.ReadWrite.All` (admin consent granted). The same app must also be
  registered on the **Microsoft Entra Applications** page in Business Central
  and given the Bifröst read permission set. The help message types read no
  business data.

- **Basic** (the on-premises BC28IS instance), the fallback when the OAuth
  variables are not all set: `BC_USER` / `BC_PASSWORD`, or the user-level
  Windows environment variables `BC28IS_USER` and `BC28IS_PASSWORD` locally. The
  tenant is sent as `?tenant=` (`-Tenant`, `default` by default).

Calls go out strictly one at a time, and the script takes a lock file
(`-LockFile`, `bifrost-mcp.lock` in the system temporary directory by default,
on Windows and Linux alike) for the length of the run. A burst of parallel calls
has taken the shared development container's queue endpoint down before, so if
another process holds the lock, wait rather than delete it.

The [`generate-docs.yml`](.github/workflows/generate-docs.yml) workflow runs it
weekly and on demand, and opens a pull request when the output changes.

**Repository secrets that must exist for that workflow** (not created by this
repository — an administrator must add them under *Settings → Secrets and
variables → Actions*):

| Secret | Value |
| --- | --- |
| `BC_USER` | Business Central user name for the documentation container |
| `BC_PASSWORD` | That user's web service access key or password |
| `BIFROST_DOCS_BASEURL` | Bifröst API root of the documentation container, including the company segment |

For Business Central online, set `BC_TENANT_ID`, `BC_CLIENT_ID` and
`BC_CLIENT_SECRET` instead of `BC_USER` / `BC_PASSWORD`, with
`BIFROST_DOCS_BASEURL` pointing at the online environment (see
[Authentication](#authentication)). `generate-docs.yml` currently passes only
the Basic secrets to the script, so the three OAuth variables have to be added
to its `env:` block before a run can use them.

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
