---
description: "Audit and synchronize the Bifrost documentation site with active Bifrost Business Central app repositories, including app logos, documentation content, validation, branches, and pull requests."
name: "Sync Bifrost Documentation"
---

# Synchronize Bifrost documentation with source repositories

You are working in the Bifrost documentation repository. Complete this task end to end in the current session. Do not stop after producing a plan: inspect the repositories, make the required changes, validate them, push branches, and create pull requests.

## Workspace layout

- Documentation repository: `D:\Git\Public\bifrost`
- Public source repositories: `D:\Git\Public`
- Private source repositories: `D:\Git\Private`
- Documentation site: `https://businesscentralal.github.io/bifrost/`

The documentation repository is a Docusaurus site for the Bifrost family of Microsoft Dynamics 365 Business Central extensions.

## Repository scope

Discover the current repositories from GitHub and local folders. Include repositories whose GitHub organization is `businesscentralal` or `OrigoSoftwareSolutions`, whose name contains `bifrost` case-insensitively, and which are not archived.

Always exclude these repositories/folders:

- Any repository or folder containing `temp` in its name, especially `bc-origo-bifrost-temp-install-helper`.
- `ce-takeover`, especially `bc-origo-bifrost-ce-takeover`.
- `_bifrost-migration-archive`.

Do not assume every name-matching repository is a product app. Inspect the repository tree and `app/app.json`. Framework/template repositories without a product `app/app.json` are not app documentation targets unless the user explicitly asks for them.

## Safety rules

1. Preserve all existing user changes. Never run `git reset --hard`, `git checkout --`, or any destructive cleanup on an existing working tree.
2. Before fetching or editing, inspect `git status`, current branch, and remote for every source repository involved.
3. If a source repository has local changes, do not edit or switch its existing working tree. Use `git fetch origin main --prune` and create an isolated worktree from `origin/main`.
4. Do not overwrite or regenerate unrelated files.
5. Use one isolated branch/worktree per repository. Branch names should be descriptive, for example `docs/sync-app-logos` or `docs/sync-<app-name>`.
6. Do not commit or create branches unless they contain an actual required change.
7. Do not change app help URLs or Docusaurus route slugs merely because repository names changed. Check the app README and CHANGELOG first: legacy route slugs may be intentionally retained until a coordinated migration.
8. Never invent an app logo without evidence. Prefer the product app's `app/assets/Logo250x250.png` or equivalent from `origin/main`. If the source app logo is itself wrong or copied from another app, create a separate source-app PR to correct it and mirror that exact asset into the docs PR.
9. Do not include secrets, tokens, credentials, tenant details, or Application Insights connection strings in commits, PR descriptions, or reports.
10. Do not merge PRs. Create them and report their URLs.

## Audit procedure

### 1. Establish the current documentation model

Read the documentation repository's relevant files before editing:

- `README.md`
- `apps.ts`
- `data/apps.json`
- `data/apps.schema.json`
- `src/pages/index.tsx`
- `src/components/AppRegistry/index.tsx`
- `tools/validate-apps.mjs`
- Relevant app documentation under `docs/<app>/`

Determine:

- Which app IDs and routes are currently documented.
- Whether the home page and app registry use different logo paths.
- Which files are generated and must not be edited directly.
- Which scripts validate and build the site.

### 2. Refresh and inspect source repositories

For every in-scope repository:

- Fetch `origin/main` without disturbing the checked-out branch.
- Read the product `app/app.json` from `origin/main` when it exists.
- Record app name, app ID, version, dependencies, logo path, help URL fields, supported locales, and repository URL.
- Read the latest relevant `README.md` and `CHANGELOG.md` entries from `origin/main`.
- Inspect source message-type help codeunits and generated help/reference sources when recent changes indicate an API contract change.
- Locate all product logo assets and compare them with the documentation repository's corresponding assets.

Use exact evidence from source, not assumptions based on repository names.

### 3. Compare documentation and assets

For each documented app:

- Compare the app name, summary, domains, Foundation minimum version, status, documentation URL, repository link, and logo path in `data/apps.json` with the source app.
- Compare the home-page logo path used by `src/pages/index.tsx` with the registry logo path used by `src/components/AppRegistry/index.tsx`.
- Compare both the root asset (`static/img/<app-id>.png`) and registry asset (`static/img/apps/<app-id>.png`) with the authoritative source logo.
- Use image inspection and SHA-256 hashes where useful.
- Check both English and Icelandic output paths. The same corrected app asset must appear in both locale builds.
- Update documentation pages only when source changes are concrete and user-facing. Do not copy internal implementation churn into product documentation.
- Generated message-type pages must be regenerated from their source help codeunits using the repository's existing generator, not hand-edited, unless the task is only a small clearly documented correction and the project convention permits it.

Pay special attention to:

- New or removed message types.
- Changed request/response fields.
- Changed setup flow, permissions, prerequisites, or supported providers.
- Current app versions and Foundation dependency requirements.
- Product logos that are stale, duplicated, mislabeled, or mapped to the wrong app.

### 4. Decide the smallest correct change set

Before editing, state internally one falsifiable hypothesis about each issue and one cheap check that can disconfirm it. Then make the smallest change that tests the hypothesis.

Typical documentation changes may include:

- Replacing stale root home-page assets with the already-correct `static/img/apps/<app-id>.png` assets.
- Replacing an incorrect source app logo and mirroring it into the docs repository.
- Updating a specific reference page when the source help codeunit now returns a different response shape.
- Updating `data/apps.json` only when source metadata proves it is stale.
- Updating translated registry content only when the corresponding source or English summary changed.

Do not add a new app to the registry unless it has a real product app manifest and a documentation route or the user explicitly requests a placeholder.

### 5. Implement in isolated branches

Create an isolated worktree and branch per repository that needs changes.

For the docs repository:

- Keep app logos in both locations in sync when both are used:
  - `static/img/<app-id>.png`
  - `static/img/apps/<app-id>.png`
- Preserve image dimensions and PNG format. The registry validator expects 250x250 PNG files.
- Update relevant Markdown/reference files with concise, factual documentation.

For a source app repository:

- Change only the authoritative source files required to correct the app metadata or logo.
- Do not update historical CHANGELOG entries just to remove old route names.
- Do not rename legacy routes unless the docs repository and all affected apps are being migrated together.

### 6. Validate before committing

Run focused checks immediately after the first substantive edit, then run the full checks for the affected repository.

Documentation repository checks:

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

Verify that:

- All changed manifests parse as JSON.
- Registry logo files exist, are PNGs, and are 250x250.
- Home-page and registry logo files have matching hashes for every corrected app.
- Both `build/en-us/` and `build/is-is/` contain the corrected output assets.
- Any broken-link or broken-anchor warnings are reported as pre-existing unless introduced by this task.

Source app checks:

- Run the repository's available AL validation/build/test command if the environment supports it.
- At minimum, parse changed JSON and run `git diff --check`.
- Do not claim an AL compile passed if no BC compiler/container is available.

### 7. Commit, push, and create pull requests

For each repository with changes:

1. Commit only the intended files with a clear imperative commit message.
2. Push the branch with upstream tracking.
3. Create a non-draft pull request against `main`.
4. Include a concise summary, validation commands, and any known unrelated warnings.
5. Do not create a PR for repositories that had no required changes.

Use the repository's actual GitHub owner and name. Verify every PR is open and targets `main`.

### 8. Close out

Before finishing:

- Confirm all in-scope product apps were audited.
- Confirm excluded repositories were not modified.
- Confirm the original existing working trees retain their prior branches and changes.
- Remove only temporary worktrees created by this task.
- Report every changed repository, branch, commit, PR URL, validation result, and unresolved issue.
- Clearly call out source-side logo defects that require a separate app PR from docs-only changes.

## Expected final report

Use this structure:

1. Scope audited: product repositories included; explicitly excluded repositories.
2. Changes made: repository, files, and behavior.
3. Pull requests: one bullet per PR with clickable URL and target branch.
4. Validation: commands that passed and warnings that remain.
5. Unresolved items: only concrete blockers or source issues requiring separate work.

Continue until the audit, edits, validation, pushes, and PR creation are complete, unless a required operation is genuinely blocked by missing access or credentials. In that case, preserve all local work, explain the exact blocker, and provide the next actionable command.