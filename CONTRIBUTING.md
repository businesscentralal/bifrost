# Contributing to the Bifröst documentation

This repository is public, and so is everything in it: pages, source, commit messages, pull
requests and their history. These rules apply to every change, whether a person or an agent
writes it.

## What belongs on the site

**Document the contract fully.** Partners and customers build on it:

- message types: names, descriptions, help, request and response, errors;
- the public extension surface of Bifrost Foundation and how a dependent app uses it;
- setup, permissions and behaviour as administrators and users experience them;
- licensing as customers experience it.

**Keep off the site how Origo runs and builds the product:**

- infrastructure: hosts, environments, storage and vault products, identifiers of Origo's own
  tenants and companies;
- credentials in any form, secret names used as worked examples, storage-key formats;
- internal object names, object IDs, source paths, test apps and internal code;
- how enforcement works internally, and where a control does not reach;
- internal working practice, programme notes and dates;
- real personal or company data. Use obvious placeholders.

If you are unsure, leave it out and ask the maintainers.

## What makes a good page

- **One owner per topic.** Link to the page that owns a topic instead of explaining it again.
- **Stays current.** No hand-typed counts ("N message types"), no lists that claim to be complete,
  no versions or dates unless the page is explicitly versioned. Point to the live catalogue
  (`Help.MessageTypes.Get`) or the generated reference instead.
- **No promises beyond the product and the Terms of Use.** Describe what the product does; avoid
  "guaranteed", "unconditional", "never" unless the product and the terms back it.
- **Purpose first.** The first paragraph says who the page is for and what they can do afterwards.
- **Plain language.** Outcome first, terms defined the first time, product names instead of
  internal codenames.
- **Actionable.** Steps in order, decisions named, a next step at the end.
- **Responsibility visible.** Where a setting affects data, permissions or bookkeeping, say so.

## Where to make a change

- **Generated message-type pages** (`docs/<app>/reference/message-types/`) come from each app's
  help text. Fix the app, release it, and regenerate. Don't hand-edit them for a lasting fix.
- **Everything else** is written here: open a pull request.
- **Building on Bifröst** is documented in the partner reference repository
  ([bc-bifrost-reference](https://github.com/businesscentralal/bc-bifrost-reference)). This site
  explains the ideas and links there for the details.

## Before you open a pull request

```powershell
npm run check:ip-boundary
npm run build
```

Review the diff with the rules above in mind, including files the checker does not scan. Keep
commit messages and pull request descriptions as brief as the change allows; send sensitive
context to the maintainers privately.

## Languages

English pages live under `docs/` and `help/`; Icelandic under `i18n/is-IS/`. A change that removes
content must also remove it from the Icelandic page.
