<!--
  Thanks for contributing to the Bifröst documentation site.
  If this PR registers or updates an app in the "Apps built on Bifröst"
  registry, please also work through the checklist below — see
  docs/apps/register-your-app.md for the full rules.
  If this PR is unrelated to the app registry, delete the checklist and just
  describe the change.
-->

## Summary

<!-- What does this PR change, and why? -->

## App registry checklist

_Delete this section if the PR does not touch `data/apps.json` or `static/img/apps/`._

- [ ] The app depends on Bifröst Foundation (`7505e808-6e52-4b96-a328-82573391297a`, publisher `Origo`)
- [ ] `appId` matches the app's `app.json` `id` and is not already used by another entry
- [ ] `summary` is one factual sentence, 200 characters or fewer, with no marketing language
- [ ] `domains` only uses values from the fixed list in `data/apps.schema.json`
- [ ] `links.appSource`, `links.repository` and `links.docs` each point only to AppSource, GitHub, or documentation (or are `null`)
- [ ] `links.logo` points to a 250×250 PNG under `static/img/apps/`
- [ ] `status` reflects reality (`available` only once live on AppSource under this name)
- [ ] `node tools/validate-apps.mjs` passes locally

## Test plan

- [ ] `npm run build` succeeds for both locales
- [ ] `node tools/validate-apps.mjs` passes (if `data/**` or `static/img/apps/**` changed)
