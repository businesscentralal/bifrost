# Bifröst documentation site

The public documentation site for the **Bifröst** family of Microsoft Dynamics 365
Business Central extensions by Origo — <https://docs.bifrost.origo.is>.

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
| `/{locale}/<app>/` | one docs instance per app | Product documentation: overview, setup, AppSource scenarios, listing copy |
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
https://docs.bifrost.origo.is/en-us/help/attachments/storage-setup/
https://docs.bifrost.origo.is/is-is/help/attachments/storage-setup/
```

Each app therefore sets, in `app/app.json`:

```jsonc
"help": "https://docs.bifrost.origo.is/en-us/<app>/",
"contextSensitiveHelpUrl": "https://docs.bifrost.origo.is/{0}/help/<app>/",
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
