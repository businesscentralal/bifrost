# Contributing to the Bifröst documentation

This repository is public, and so is everything in it: pages, source, commit messages, pull
requests and their history. These rules apply to every change, whether a person or an agent
writes it.

## What belongs on the site

- what each app does, in Business Central terms;
- setup, permissions and behaviour as administrators and users experience them;
- licensing as customers experience it: license types, quotas, rate limits, their own usage, the
  Terms of Use and privacy;
- one help page per Business Central page that opens help (no index pages).

**Keep off the site:**

- message types: no names, parameters, examples or errors. Readers and agents read them from the
  environment, where they follow the installed apps (`Help.MessageTypes.Get` and
  `Help.Implementation.Get`, or the MCP tools `list_message_types` and `describe_message_type`);
- the partner program (working as a Vendor or Partner), content for partners and ISVs building on
  Bifröst, and agent skills;

and how Origo runs and builds the product:

- infrastructure: hosts, environments, development containers, storage and vault products,
  identifiers of Origo's own tenants and companies;
- credentials in any form, secret names used as worked examples, storage-key formats;
- internal object names, object IDs, source paths, test apps and internal code;
- telemetry event ids and storage keys;
- how enforcement works internally, and where a control does not reach;
- internal working practice, programme notes and dates;
- real personal or company data. Use obvious placeholders.

If you are unsure, leave it out and ask the maintainers.

## What makes a good page

- **One owner per topic.** Link to the page that owns a topic instead of explaining it again.
- **Stays current.** No hand-typed counts ("N message types"), no lists that claim to be complete,
  no versions or dates unless the page is explicitly versioned. Point to the live catalogue
  (`Help.MessageTypes.Get`) instead.
- **No promises beyond the product and the Terms of Use.** Describe what the product does; avoid
  "guaranteed", "unconditional", "never" unless the product and the terms back it.
- **Purpose first.** The first paragraph says who the page is for and what they can do afterwards.
- **Plain language.** Outcome first, terms defined the first time, product names instead of
  internal codenames.
- **Actionable.** Steps in order, decisions named, a next step at the end.
- **Responsibility visible.** Where a setting affects data, permissions or bookkeeping, say so.

## Where to make a change

- **Everything on the site** is written here: open a pull request.

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
