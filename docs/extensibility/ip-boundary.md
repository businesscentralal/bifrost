---
id: ip-boundary
title: "Public site IP boundary"
sidebar_label: "Public site IP boundary"
sidebar_position: 10
description: "What may appear on the public Bifröst documentation site, and what must stay off it."
---

# Public site IP boundary

The public site at [`businesscentralal/bifrost`](https://github.com/businesscentralal/bifrost)
publishes **only public information**. Bifröst is built to be extended, so the contract partners
build on is public and belongs here in full. What stays off the site is how Origo runs and
implements the product.

## Public: document it fully

- **Message types.** Names, descriptions, help documents, request and response shapes, and
  error answers, including `Help.Bifrost.Get` licence status fields such as
  `blockOnMissingQuota`.
- **The extension surface.** Everything a partner uses to build a dependent app: the message
  type enum and interface, the message argument, the dispatcher, app registration, the secret
  store API, the public events, and the patterns shown in the reference repository (separate
  implementation, isolated write and help objects; isolated writes with `Codeunit.Run`; the
  version and licence guards; registration).
- **Customer-facing behaviour.** Quota pools, what counts, the published trial (1000 User +
  1000 App Registration messages), the grace (100 messages), the rate-limit tiers and their
  daily limits, the request-licence flow, and that calls run while the remaining quota is still
  unknown.
- **Documented API errors,** including exhausted-quota error shapes, without naming backing
  stores in the example bodies.

Licence behaviour that callers and administrators rely on is public contract. Document it on
the [Licensing](/foundation/reference/licensing/) overview and on live message-type pages such as
`Help.Bifrost.Get`, not as a tour of the licensing backend.

## Never publish on this site

| Forbidden | Why |
|-----------|-----|
| Secret names and secret-name prefixes used as worked examples | Teaches how to find or forge credentials |
| Cloud secret-vault product names or vault host URIs | Infrastructure detail, not customer contract |
| Backing-store product names for licensing | Implementation, not the public API |
| Access-key shapes, connection-string fragments, account / database / container literals | Credential material |
| Environment host names, URLs, tenant and company ids of Origo's own environments | Points at a live system |
| Origo's internal object names (for example `… Impl ori`, `… Handler ori`) and internal codeunits that implement licensing storage or sync | Implementation, not part of the public contract. Partners learn the pattern from the reference repository, with their own names |
| Origo's internal working practice: shared workbooks, shared containers, telemetry resources, internal repositories, programme decisions | Not customer-facing |
| `TODO` markers and unfinished internal design notes | Not customer-facing |

The **Connection Status** and **On-Premises Secrets** pages stay off the site: they name the
secret store and the backing store.

Environment URLs and credentials never go into `tools/` or `.github/` either. Scripts read them
from environment variables and repository secrets.

## Checking a change

Run `npm run check:ip-boundary` before opening a docs PR. The checker
(`tools/check-docs.mjs` in `ipBoundary` mode) scans `docs/` and `help/` (and the matching
`i18n/` mirrors) for a fixed forbidden vocabulary list. This policy page is excluded from
that scan so it can describe the rule without failing itself. The checker does not scan
`tools/` or `.github/`, so review those by hand.

## How to write licensing contract docs

1. Prefer the [Licensing](/foundation/reference/licensing/) overview and live types such as
   `Help.Bifrost.Get`. Do not recreate retired `Help.License.*` message-type pages.
2. Describe what the caller sends and what the caller receives.
3. Say "licensing service" when you need a noun for the remote side, never a store product.
4. For on-premises secrets: state that Origo supplies the values with an on-premises licence;
   do not paste worked account names, keys, or database ids.
5. Keep `blockOnMissingQuota` and other fields that appear in the public JSON response; do
   not explain how or where those flags are stored.

## Related

- [Help codeunits](/extensibility/help-codeunits) — Markdown contract shipped with each type
- [Licensing](/foundation/reference/licensing/) — public licence model
- [Foundation public surface](/extensibility/public-surface) — what dependent apps may rely on
