---
description: "Audit and improve Icelandic translations for the Bifrost documentation site and active Bifrost Business Central apps, then create one pull request per affected product app."
name: "Translate Bifrost to Icelandic"
---

# Translate Bifrost documentation and apps to Icelandic

Complete an Icelandic localization audit for the Bifrost documentation site and all active Bifrost Business Central product apps in scope. Work end to end: discover the current source repositories and translation files, prepare the translation scope, review terminology against Business Central Icelandic conventions, translate or correct the content, validate it, create isolated branches, push them, and open pull requests.

Do not translate test apps. Do not stop after making a plan. Stop only at the required user-confirmation gates or when a genuine technical blocker prevents safe progress.

## Workspace layout

- Documentation repository: `D:\Git\Public\bifrost`
- Public source repositories: `D:\Git\Public`
- Private source repositories: `D:\Git\Private`
- Documentation site: `https://businesscentralal.github.io/bifrost/`
- Target locale: `is-IS`

## Repository scope

Use the same scope as the Bifrost documentation synchronization task. Discover repositories from GitHub and local folders. Include repositories in `businesscentralal` or `OrigoSoftwareSolutions` whose names contain `bifrost` case-insensitively and which are not archived.

Always exclude:

- Any repository or folder containing `temp`, especially `bc-origo-bifrost-temp-install-helper`.
- `bc-origo-bifrost-ce-takeover`.
- `_bifrost-migration-archive`.
- Test apps, test projects, and test-only translation files in every product repository.

A name match is not enough to make a repository an app target. Inspect the tree and `app/app.json`. Framework/template repositories without a product `app/app.json` are not translation targets unless the user explicitly adds them.

The documentation repository is always in scope, even though it has no `app.json`.

## Product-app scope

For source repositories with a product `app/app.json`:

- Translate and review the product app's `is-IS` XLF files.
- Do not modify `test/app.json`, test source, test XLF files, or test-only app assets.
- Keep source/generated XLF responsibilities clear. Never edit `.g.xlf` files directly when the repository workflow generates them.
- If an app has no Icelandic XLF or no translation target, report that explicitly instead of inventing a file layout.

## Safety and branching rules

1. Preserve all existing user changes. Never run `git reset --hard`, `git checkout --`, or destructive cleanup on an existing working tree.
2. Inspect `git status`, current branch, and remote before fetching or editing each repository.
3. Fetch `origin/main --prune` without switching the user's existing branch.
4. If a repository has local changes, use an isolated worktree from `origin/main`; do not edit its existing checkout.
5. Create one isolated branch and one pull request per affected product app repository. Use a separate documentation branch and pull request for documentation-only changes.
6. Keep each PR focused on Icelandic translation and the necessary glossary or translation metadata only.
7. Do not commit secrets, credentials, tenant information, Application Insights values, or generated build output unless the repository explicitly tracks it.
8. Do not modify English source text merely to make translation easier.
9. Do not change app IDs, route IDs, help URLs, object names, or business logic as part of translation unless the user explicitly expands the task.
10. Do not translate test apps. If a product app and its test app share files, verify the changed paths before staging.
11. Do not merge PRs. Create and report them.

## Required translation standards

Use the NAB AL Tools translation workflow and its `NAB-XLF-Translator` agent/tools for XLF translation. Do not bulk-edit XLF files with generic search-and-replace scripts, Python, or ad hoc XML manipulation.

Follow these rules:

- Target locale is `is-IS`.
- Use Microsoft Dynamics 365 Business Central's established Icelandic terminology wherever a standard term exists.
- Prefer Microsoft's official Icelandic Translation for Business Central repository on GitHub as the primary terminology authority. Discover the current Microsoft repository and relevant branch/files during the audit; do not hard-code an assumed repository path.
- Use the existing BC Icelandic client, base application translations, and any local glossary as supporting evidence.
- Use one consistent Icelandic term for the same Business Central concept across all Bifrost apps.
- Prefer natural, neutral Icelandic UI language over literal English word order.
- Use correct Icelandic case, gender, inflection, capitalization, compound words, and punctuation.
- Preserve product names, company names, provider names, API names, message-type identifiers, enum values, code values, URLs, email addresses, object IDs, and technical abbreviations when they are identifiers or proper names.
- Do not translate message type keys such as `Iceland.VAT.Submit`, `Storage.File.Get`, or `LLM.Prompt.Complete`.
- Translate captions, tooltips, labels, descriptions, error messages, notification text, setup instructions, and other user-facing strings unless a glossary or product convention explicitly keeps them unchanged.
- Do not leave English source text as the target by default. Keep it unchanged only for a verified proper noun, technical identifier, universal abbreviation, or term that is genuinely identical in Icelandic.
- Use the longest glossary match first and apply local project glossaries before general terminology.
- Record unresolved terminology decisions as explicit review notes instead of silently inventing a term. Complete the best-supported translation, then add the decision and alternatives as a comment on the relevant pull request.

## Technical XLF preservation rules

For every translated XLF unit, verify before saving:

- Backslash sequences are preserved exactly, including count and position. Never replace them with actual line breaks.
- `%1`, `%2`, `%3`, and other runtime placeholders are preserved exactly and remain in a valid grammatical position.
- XML tags and markup remain structurally identical; translate only their text content.
- `maxLength` constraints are respected by explicit character counting.
- Leading/trailing whitespace, punctuation, quotes, symbols, non-breaking spaces, and special characters are preserved unless the target-language grammar requires a documented change.
- Progress placeholders such as `#1#####################` are preserved.
- Translation targets are not accidentally empty or copied from the source.
- XLF state/review metadata follows the NAB AL Tools workflow.

## Phase 1: Audit before editing

### Documentation repository

Inspect:

- `i18n/is-IS/`
- `docs/` and any Icelandic translation folders
- `help/` and any Icelandic help content
- `src/pages/`
- `src/components/`
- `data/apps.json`
- Any local glossary or translation documentation

Determine:

- Which documentation instances have Icelandic translations.
- Whether translations are generated by Docusaurus and which files are source versus generated.
- Whether all ten currently registered product apps have Icelandic overview, reference, listing, scenario, and help coverage.
- Which English pages were added or changed since the Icelandic translation was last refreshed.
- Which app names, summaries, domain labels, navigation labels, and registry strings need translation or correction.

### Each product app repository

From `origin/main`, inspect:

- Product `app/app.json`.
- `Translations/`, `Translations/is-IS.xlf`, `Translations/*.xlf`, or the repository's actual XLF location.
- Any `glossary.tsv`, `resources/glossary.tsv`, or equivalent.
- `README.md` and `CHANGELOG.md` for domain terms and recent user-facing behavior.
- Product AL captions, tooltips, labels, messages, page actions, setup text, permission captions, and help text relevant to Icelandic users.
- Existing Icelandic translations and entries marked for review.

Create a compact audit table per app containing:

- App name and repository.
- Product app path.
- Icelandic XLF path(s).
- Untranslated count.
- Needs-review count.
- Existing glossary path and term count.
- English-source changes not yet present in Icelandic.
- Suspected terminology inconsistencies.
- Whether a PR is required.

Do not edit during this audit phase.

The target includes both the product apps and the documentation repository. Do not narrow the work to only strings reported as untranslated by NAB AL Tools.

## Required approval gate

After the audit, stop and ask the user to confirm the translation scope before translating. Report:

- Documentation files and estimated untranslated/review counts.
- Each product app and its XLF paths/counts.
- Apps with no Icelandic translation file.
- Existing glossary sources and conflicts.
- Any ambiguous terminology or Icelandic business-rule questions.

There is no separate approved project glossary or dedicated reviewer. Use the official Microsoft Icelandic Translation for Business Central repository as the authoritative terminology source and record any remaining uncertainty in the pull request review comments.

If all target content is already translated and no quality corrections are identified, report that and do not create empty PRs.

## Phase 2: Prepare translation sources

For each affected product app:

1. Use the NAB AL Tools build workflow to compile the product app and regenerate `.g.xlf` as required.
2. Refresh the target `is-IS` XLF from the generated source.
3. Locate and validate the local glossary.
4. If no local glossary exists, use the approved Business Central Icelandic terminology source and the existing repository translations. Do not silently create a glossary without asking the user unless the repo already has a documented glossary convention.
5. Separate product XLF work from test XLF work.
6. For documentation, update source Icelandic Markdown/MDX or Docusaurus translation files according to the repository's existing structure. Do not edit generated `build/` output.

Use a fresh translation context per batch/language as recommended by the NAB workflow. Since this task targets only `is-IS`, process one Icelandic translation stream per file/app and avoid concurrent writes to the same XLF.

## Phase 3: Translate and review

For each affected app XLF:

- Fetch untranslated and needs-review items in manageable batches.
- Use context fields, AL object names, captions, comments, and glossary terms to choose the Icelandic wording.
- Translate all user-facing items in scope.
- For genuinely ambiguous or business-sensitive items, complete the best-supported translation but record the source text, chosen Icelandic wording, alternatives considered, and reason in a review-notes file or checklist for the pull request.
- Continue batches until no untranslated items remain or a blocker requires user input.
- Review existing Icelandic translations for obvious English copies, inconsistent BC terminology, incorrect grammar, or violations of technical XLF rules.
- Do not hide translations requiring human review. Since review happens on the pull request, save the best-supported translation, retain a review-notes list, and add the notes as a pull request comment after the PR is created. Do not claim that a review note is resolved until a human reviewer approves it.

After the NAB AL Tools workflow completes, read every changed Icelandic translation in context. Entries with `NAB:*` prefixes or similar NAB-generated metadata are not proof that the translation is confirmed. Inspect those entries manually for Icelandic grammar, Business Central terminology, consistency, and technical preservation. Correct or flag them before the PR is created.

For documentation:

- Keep the Icelandic version semantically aligned with the current English documentation.
- Translate product overviews, setup instructions, requirements, message-type descriptions, UI terminology, navigation labels, app registry text, and user scenarios as applicable.
- Preserve code blocks, JSON keys, message-type names, API paths, URLs, object IDs, and technical identifiers.
- Use Icelandic headings and natural instructions, not word-for-word English.
- Keep product names and official service names consistent across all app documentation.

## Phase 4: Validate translations

For every changed XLF:

- Refresh the XLF after saving.
- Confirm no unintended untranslated items remain.
- Confirm no test XLF files were changed.
- Validate technical placeholders, XML tags, backslashes, punctuation, max lengths, and target states.
- Review a sample of the longest and most technical translations.
- Validate glossary structure and terminology consistency.

For the documentation repository, run its existing checks, at minimum:

```powershell
npm ci
npm run validate:apps
npm run typecheck
npm run build
```

Also run:

```powershell
git diff --check
```

Build both English and Icelandic locales. Treat unrelated pre-existing broken-link warnings as warnings, but report any new warning introduced by the translation changes.

For product apps, run available AL build/diagnostic/test commands if the environment supports them. If no BC compiler or container is available, state that AL compilation was not run; do not claim success.

## Phase 5: Commit and create PRs

For every affected product app:

1. Create a branch from `origin/main` in an isolated worktree.
2. Stage only product translation files and any explicitly approved glossary changes. Never stage test app files.
3. Commit with an imperative message such as `Update Icelandic translations`.
4. Push the branch.
5. Open a pull request against `main`.
6. Include app name, translation scope, glossary source, validation commands, remaining review items, and any compiler limitations.

For documentation:

- Create one dedicated documentation branch and pull request for all documentation translation changes.
- Include the affected locales, app sections, registry/help changes, and build validation.
- Add documentation terminology review notes as comments on that documentation pull request.

It is acceptable for one app to have no PR if no changes are needed.

## Phase 6: Close out

Before finishing:

- Confirm every in-scope product app was audited.
- Confirm excluded repositories and test apps were not modified.
- Confirm the documentation translation was audited and updated where required.
- Confirm every changed app has its own PR.
- Confirm all PRs target `main` and are open.
- Confirm original user branches and uncommitted changes remain untouched.
- Remove only temporary worktrees created by this task.

## Expected final report

Report:

1. Scope audited, including included product apps and exclusions.
2. Translation audit table with counts before and after.
3. Terminology/glossary decisions and unresolved questions.
4. Documentation changes and affected Icelandic paths.
5. One pull request per changed app, plus the documentation PR where applicable.
6. Validation commands and results.
7. Remaining review items, compiler limitations, or blockers.

Do not claim that the translation is complete if items remain in untranslated or needs-review state. Do not claim AL compilation passed if no compiler/container was available.
