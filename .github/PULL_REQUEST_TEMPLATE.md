## Summary

<!-- What does this PR change, and why? Into `staging` unless it is an urgent fix. -->

## Review in the preview

<!-- Preview: the address in the bot's comment on the staging pull request (or on this one, if it targets main).
     Link each page to look at, and say what to check on it. -->

- [Page title](https://PREVIEW/en-us/...): what to check
- [Same page in Icelandic](https://PREVIEW/is-is/...)

## Questions for the reviewer

<!-- Decisions you need, numbered. Delete if none. -->

## Checks

- [ ] `npm run check:ip-boundary` passes
- [ ] `node tools/check-links.mjs` passes
- [ ] `npm run build` succeeds
- [ ] `node tools/validate-apps.mjs` passes (if `data/**` or `static/img/apps/**` changed)
- [ ] English and Icelandic pages changed together
