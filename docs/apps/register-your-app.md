---
id: register-your-app
title: "Register your app"
sidebar_label: "Register your app"
sidebar_position: 2
description: "How to list a Business Central extension on the Apps built on Bifröst registry: the rules, the JSON entry, and the pull request flow."
---

# Register your app

The [app registry](/apps/) is a single JSON file,
[`data/apps.json`](https://github.com/businesscentralal/bifrost/blob/main/data/apps.json),
validated against
[`data/apps.schema.json`](https://github.com/businesscentralal/bifrost/blob/main/data/apps.schema.json).
Adding your app means adding one entry to that file, plus a logo, in a pull
request.

## Who can register

Any Business Central extension that **depends on Bifröst Foundation**. It does
not need to be published on Microsoft AppSource yet — `preview` and
`coming-soon` are valid statuses, so you can list an app while it is still in
development.

## Rules

- **Dependency.** Your `app.json` must declare a dependency on Bifröst
  Foundation (id `7505e808-6e52-4b96-a328-82573391297a`, publisher `Origo`).
- **Factual summary.** `summary` is one sentence, at most 200 characters,
  describing what the app does. No marketing language, no superlatives.
- **Links point only to AppSource, GitHub, or documentation.** `appSource`,
  `repository` and `docs` must each resolve to one of those three kinds of
  page (or be `null`). `support` may also be a `mailto:` link.
- **Logo.** A 250×250 PNG, added under `static/img/apps/<your-slug>.png`.
  Reuse your app's existing AppSource/`Logo250x250.png` icon — do not design a
  new one just for this listing.
- **Status reflects reality.** Use `available` only once the app is live on
  AppSource under the name in this entry; otherwise use `preview` (installable,
  not yet marketplace-listed) or `coming-soon`.
- **One entry per app.** `appId` must be your `app.json` `id` GUID, and must
  be unique in the registry — the validator rejects duplicates.

## The entry

Add one object to the `apps` array in `data/apps.json`, following
[`data/apps.schema.json`](https://github.com/businesscentralal/bifrost/blob/main/data/apps.schema.json):

```json
{
  "appId": "00000000-0000-0000-0000-000000000000",
  "name": "Your App Name",
  "publisher": "Your Company",
  "summary": "One factual sentence describing what your app does, under 200 characters.",
  "domains": ["integration"],
  "foundationMinVersion": "28.0.0.0",
  "status": "preview",
  "links": {
    "appSource": null,
    "docs": "https://your-docs-url/",
    "repository": "https://github.com/your-org/your-repo",
    "support": "https://your-support-url/",
    "logo": "static/img/apps/your-slug.png"
  }
}
```

`domains` is a fixed list — pick every domain that applies:
`finance`, `sales`, `purchasing`, `inventory`, `projects`, `hr-payroll`,
`banking`, `e-documents`, `integration`, `ai`, `documents`, `scheduling`,
`time-tracking`, `billing`, `iceland`, `other`.

An optional `summary_is` field gives an Icelandic translation of `summary`
for the `is-IS` build of this page; omit it and the English summary is
reused.

## Pull request flow

1. Fork [businesscentralal/bifrost](https://github.com/businesscentralal/bifrost).
2. Add your logo under `static/img/apps/<your-slug>.png` and your entry to
   `data/apps.json`.
3. Run the validator locally: `node tools/validate-apps.mjs`. It checks the
   JSON Schema, `appId` uniqueness, that the logo file exists and is a
   250×250 PNG, and that every link is well-formed.
4. Open a pull request. `.github/workflows/validate-apps.yml` runs the same
   validator plus a full site build on every PR that touches `data/**` or
   `static/img/apps/**`.
5. A maintainer from `@businesscentralal/bifrost-maintainers` reviews and
   merges — `data/apps.json` and `static/img/apps/` are routed to that team
   through `CODEOWNERS`.

Prefer not to use git? Open an
[app registration issue](https://github.com/businesscentralal/bifrost/issues/new?template=register-app.yml)
instead — it collects the same fields and a maintainer will open the pull
request for you.

## Updating an existing entry

Once your app is listed on AppSource, send a follow-up pull request that
fills in `links.appSource` and sets `status` to `available`. The same rules
and validator apply to updates as to new entries.
