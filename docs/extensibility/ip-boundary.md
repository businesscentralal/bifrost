---
id: ip-boundary
title: "Public site IP boundary"
sidebar_label: "Public site IP boundary"
sidebar_position: 10
description: "What may appear on the public Bifröst documentation site, and what must stay off it."
---

# Public site IP boundary

The public site at [`businesscentralal/bifrost`](https://github.com/businesscentralal/bifrost)
publishes **only public information**. Customer-facing licence behaviour belongs here when it
is part of the contract callers and administrators rely on. Internal implementation detail
does not.

This page is the house standard the programme can grow. Locked programme decisions (2026-09-16)
are the source of truth when they conflict with older prose.

## Always allowed

- Customer-facing product behaviour: quota pools, what counts, trial sizes that are published,
  sandbox / MCP limits that are already public product copy, request-licence flow.
- Public message-type contracts: request and response shapes callers see, including
  `Help.Bifrost.Get` licence status fields such as `blockOnMissingQuota`.
- Exhausted-quota error shapes and other documented public API errors (without naming backing
  stores in the example bodies).

Licence behaviour that callers and administrators rely on is **public contract**. Document it
on the [Licensing](/foundation/reference/licensing/) overview and on live message-type pages
such as `Help.Bifrost.Get` — not as a tour of the licensing backend. Do not invent retired
`Help.License.*` message-type pages.

## Never publish on this site

| Forbidden | Why |
|-----------|-----|
| Secret names and secret-name prefixes used as worked examples | Teaches how to find or forge credentials |
| Cloud secret-vault product names or vault host URIs | Infrastructure detail, not customer contract |
| Backing-store product names for licensing | Implementation, not the public API |
| Access-key shapes, connection-string fragments, account / database / container literals | Credential material |
| `TODO` markers and unfinished internal design notes | Not customer-facing |
| Internal codeunit names that only exist to implement licensing storage or sync | Not part of the public contract |

Run `npm run check:ip-boundary` before opening a docs PR. The checker
(`tools/check-docs.mjs` in `ipBoundary` mode) scans `docs/` and `help/` (and the matching
`i18n/` mirrors) for a fixed forbidden vocabulary list. This policy page is excluded from
that scan so it can describe the rule without failing itself.

## Still open — do not invent answers

Until programme decisions close them, **do not** fill these gaps with guessed prose:

- Full A/B/C tier split (Q1)
- Whether `app.json` Application Insights / vault URL exposure is inherent and how to document
  it (Q4)
- Exact public guarantees for grace size, fail-open behaviour, and Connection Status
  visibility (§4 row 7)

For grace / fail-open / Connection Status: prefer **contract-safe** wording. If grace must be
mentioned, say only that a small grace allowance may exist and that exhausted pools are
refused with the documented error. Do not publish exact grace sizes, storage-key tables, or
internal sync codeunit names until §4 row 7 is confirmed.

## How to write licensing contract docs

1. Prefer the [Licensing](/foundation/reference/licensing/) overview and live types such as
   `Help.Bifrost.Get`. Do not recreate retired `Help.License.*` message-type pages.
2. Describe what the caller sends and what the caller receives.
3. Say "licensing service" when you need a noun for the remote side — never a store product.
4. For on-premises secrets: state that Origo supplies the values with an on-premises licence;
   do not paste worked account names, keys, or database ids.
5. Keep `blockOnMissingQuota` and other fields that appear in the public JSON response; do
   not explain how or where those flags are stored.

## Related

- [Help codeunits](/extensibility/help-codeunits) — Markdown contract shipped with each type
- [Licensing](/foundation/reference/licensing/) — public licence model
- [Foundation public surface](/extensibility/public-surface) — what dependent apps may rely on
