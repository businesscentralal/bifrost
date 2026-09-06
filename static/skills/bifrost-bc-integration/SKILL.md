---
name: bifrost-bc-integration
description: >
  Domain knowledge for writing integration code that drives Microsoft Dynamics 365
  Business Central through the Origo Bifröst API. Use when a task involves calling
  Business Central over Bifröst: reading or writing records, posting or previewing
  sales, purchase, finance, inventory, warehouse, project or resource documents,
  document approvals, incoming documents, notifications, memory, Change Log history
  and the Write Guard, webhooks, translations, or discovering what an environment
  offers. Also covers the queue envelope, synchronous and asynchronous submission,
  pagination, tableView filtering and sorting, field selection with fieldNumbers,
  enum and binary field conversions, the error contract, and the BC Metadata MCP
  server. Load a reference file from references/ for the area you need — this file
  is the map, not the manual.
license: MIT
metadata:
  docsTitle: Bifröst BC integration
  version: 2.0.0
  updated: 2026-09-06
  source: https://github.com/businesscentralal/bifrost
  api: Bifröst API v1.0 (origo/bifrost/v1.0)
  references: 25
---

# Bifrost BC Integration Skill

This skill gives you accurate, verified knowledge of the **Origo Bifrost API** so
you can write integration code (TypeScript, JavaScript, Python, C#, AL, etc.) that
interacts with Microsoft Business Central through this API.

---

## When to use this skill

Load it when you are about to write or debug code that talks to Business Central
through Bifröst — a script, a service, a UI, an agent tool, a test. Load it before
you write the first request, not after the first failure: almost everything that
goes wrong against this API goes wrong in the envelope, the field names or the
error order, and all three are covered here.

Do **not** use it for AL development inside a Business Central extension. Bifröst
is the outside-in API; writing the extension itself is a different job.

This file is short on purpose. It carries the model and the rules; the detail
lives in `references/`, one file per area, listed at the bottom. Read this file
first, then load only the reference you need.

---

## The mental model

Ten things, and the rest follows.

1. **Everything is a message.** There are no entity endpoints. One JSON envelope,
   posted to one of three URLs, does every operation there is.
2. **`type` selects the operation.** `Data.Records.Get`, `Sales.Document.Post`,
   `Help.MessageTypes.Get` — the type field is the whole routing decision.
3. **`data` is a JSON *string*, not an object.** It is the single most common
   mistake. Stringify the payload before putting it in the envelope.
4. **`subject` is the shorthand argument.** A table name, a document number, a
   GUID — what it means depends on the message type, and the type's own help says
   which forms it accepts.
5. **`/tasks` is synchronous, `/queues` is asynchronous.** Use `/tasks` when you
   want the answer now; use `/queues` for long work and poll for it.
6. **A task returns a pointer, not the payload.** The response carries a `data`
   URL; fetch that URL to get the result. Some message types answer inline
   instead — both patterns are documented, and a client has to handle both.
7. **Status is the truth, HTTP is not.** HTTP 200 with `status: "Error"` is a
   failed operation. Check transport, then task status, then the payload — in
   that order.
8. **Errors are messages, not stack traces.** A well-behaved call that cannot
   succeed returns `status: "Error"` with a usable message. A 5xx is a defect,
   not a business outcome.
9. **Field names are normalised.** `"No."` becomes `no`, `"Posting Date"` becomes
   `postingDate`. The normalised name is what goes in JSON; the original name is
   what goes in a `tableView` filter.
10. **The environment is the authority.** Which message types exist, which tables
    and fields are readable, which permissions the caller has — all of it is
    queryable at runtime and none of it should be assumed.

---

## I want to …

| I want to … | Read |
| --- | --- |
| Understand the envelope, the endpoints, polling, message history | [references/queue-api.md](references/queue-api.md) |
| Work out the base URL, the token, the tenant isolation rules | [references/authentication.md](references/authentication.md) |
| Know what a failure looks like and in what order to check | [references/error-handling.md](references/error-handling.md) |
| Read or write records in any table, export CSV, page through results | [references/data-operations.md](references/data-operations.md) |
| Find out which message types and tables an environment has | [references/help-and-discovery.md](references/help-and-discovery.md) |
| See the whole message-type catalogue at a glance | [references/message-types.md](references/message-types.md) |
| Filter and sort a query | [references/filters-and-sorting.md](references/filters-and-sorting.md) |
| Ask for fewer fields, or handle Blob / Media / MediaSet | [references/field-selection.md](references/field-selection.md) |
| Handle currency, dimensions, options and enums | [references/field-conversions.md](references/field-conversions.md) |
| Quote, create, release, post or cancel a sales document | [references/sales.md](references/sales.md) |
| Do the same on the purchase side | [references/purchasing.md](references/purchasing.md) |
| Post a general journal, reconcile a bank, settle VAT, adjust rates | [references/finance.md](references/finance.md) |
| Move, assemble, ship, pick, put away or receive inventory | [references/inventory.md](references/inventory.md) |
| Post a project or resource journal | [references/projects.md](references/projects.md) |
| Send a document for approval, approve, reject or delegate | [references/approvals.md](references/approvals.md) |
| Create or process an incoming document | [references/incoming-documents.md](references/incoming-documents.md) |
| Read change history, restore a value, or get past the Write Guard | [references/changelog-guard.md](references/changelog-guard.md) |
| Notify a user or draft an email | [references/notifications.md](references/notifications.md) |
| Keep small state in BC without adding a table | [references/memory.md](references/memory.md) |
| Receive an inbound webhook or subscribe to an outbound event | [references/webhooks.md](references/webhooks.md) |
| Translate record data, or pick a language by LCID | [references/translations.md](references/translations.md) |
| Translate my own interface from the BC translation table | [references/ui-translations.md](references/ui-translations.md) |
| Fill a dropdown from the right lookup table | [references/lookups.md](references/lookups.md) |
| See a complete worked example | [references/examples.md](references/examples.md) |
| Reach the same metadata over MCP | [references/mcp-server.md](references/mcp-server.md) |

Message types belonging to the other Bifröst apps — Bragi, Hnitbjörg, Nornir,
Iceland, Iceland Treasury, Iceland DocEx, Clockify, Subscription Billing — are
not in this skill. Each app has a thin skill of its own that links to its
generated reference pages; load that one alongside this one.

---

## Hard rules

Break these and the call fails, or worse, quietly does the wrong thing.

**Discovery before invention**

- Call `Help.MessageTypes.Get` before you use a message type you have not used in
  this environment before. The catalogue differs per environment: which apps are
  installed decides what exists.
- Call `Help.Implementation.Get` for the contract of a specific type rather than
  guessing its arguments from its name.
- Call `Help.Fields.Get` before you name a field. Never invent a JSON key — a key
  the message type does not know is ignored silently, so a typo looks like a
  successful call that did nothing.
- Call `Help.Permissions.Get` before a write that matters. A permission failure
  after a half-finished sequence is much more expensive than a check before it.

**Envelope discipline**

- `data` is a **string**. Stringify it.
- One message type per call. Do not batch unrelated operations into one envelope.
- Send `specversion`, `type`, `source` and `id` on every message; a missing `id`
  costs you the ability to correlate the response.
- Treat the returned `data` URL as opaque and fetch it verbatim. Do not rebuild it
  from parts you think you recognise.

**Rate and concurrency**

- **Make calls serially.** Business Central is not a farm of stateless workers;
  a burst of parallel calls against one environment degrades it and can take the
  service down for everyone on that tenant. If you are running several test
  streams, keep each stream serial.
- Poll a queued message on a back-off, not in a tight loop.
- Never retry a write blindly. Read back first, decide, then retry — most write
  message types are not idempotent.

**Data safety**

- **Prefix every record you create in a shared or test environment with `BIFT-`**
  plus a letter for your stream, e.g. `BIFT-A`. It marks the row as yours and
  makes cleanup possible.
- **Never delete existing master data.** Not customers, not items, not vendors,
  not accounts. Create your own, work on your own, leave the rest alone.
- Do not write to a production environment to find out what a message type does.
  `*.PreviewPost` exists for exactly this, and rolls back.
- Credentials belong in the caller's secret store. Never write a token, password
  or client secret into a file, a command, a commit or a log line.

**Reading the result**

- Check transport, then `status`, then the payload. In that order, every time.
- An empty result set is a result, not an error. Distinguish "no rows matched"
  from "the call failed" before you branch on it.
- Do not parse an error message to decide control flow. Branch on `status` and on
  documented error codes.

---

## Reference index

Every file below sits in `references/` next to this one. The "sections" column
gives the section numbers those pages carried in the single-file version of this
skill, which is what an in-text reference like "see §11" points at.

| File | Sections | Covers |
| --- | --- | --- |
| [queue-api.md](references/queue-api.md) | 1, 3, 3b, 4 | What the API is, the three endpoints, message history, polling, the request envelope |
| [authentication.md](references/authentication.md) | 2 | Base URL, OAuth 2.0 scope, Entra application isolation |
| [error-handling.md](references/error-handling.md) | 5, 16 | The two response patterns, the error-check order, common mistakes |
| [data-operations.md](references/data-operations.md) | 6, 7.1, 8, 22 | Generic record read/write, CSV export, deleted records, notes, pagination, existence checks |
| [message-types.md](references/message-types.md) | 7 | Index of the message-type catalogue by area |
| [help-and-discovery.md](references/help-and-discovery.md) | 7.2, 17 | `Help.*` message types, schema discovery, field-metadata caching |
| [translations.md](references/translations.md) | 7.2, 14 | Record field translations, language by LCID |
| [sales.md](references/sales.md) | 7.3 | Customers, items, sales documents, statements, PDFs |
| [purchasing.md](references/purchasing.md) | 7.4 | Purchase documents, vendor application, corrections |
| [finance.md](references/finance.md) | 7.5, 7.5a, 7.5b | General journal, bank reconciliation, VAT, currency adjustment, FA journal |
| [inventory.md](references/inventory.md) | 7.5c–7.5c.4 | Item journal, transfer, assembly, warehouse shipment, pick, put-away, receipt |
| [projects.md](references/projects.md) | 7.5d, 7.5e | Project journal, resource journal |
| [changelog-guard.md](references/changelog-guard.md) | 7.6 | Field history, restore, delta feed, the ChangeLog Write Guard |
| [incoming-documents.md](references/incoming-documents.md) | 7.7 | Create, attach, process and read incoming documents |
| [approvals.md](references/approvals.md) | 7.8 | Send, approve, reject, delegate, cancel, and read approvals |
| [memory.md](references/memory.md) | 7.9 | Company-scoped and user-scoped key-value storage |
| [notifications.md](references/notifications.md) | 7.10 | Notification count, get, read, send, thread, email draft |
| [webhooks.md](references/webhooks.md) | 7.11, 13 | Inbound webhook fan-out, outbound external business events |
| [field-conversions.md](references/field-conversions.md) | 9, 10 | Currency, dimension set, BLOB, Media, MediaSet, enums and options |
| [filters-and-sorting.md](references/filters-and-sorting.md) | 11, 19 | `tableView` filter and sort syntax, paging a sorted result |
| [field-selection.md](references/field-selection.md) | 18 | `fieldNumbers`, metadata-driven forms, binary field shapes |
| [lookups.md](references/lookups.md) | 21 | Reference tables behind dropdowns, auto-fill chains |
| [ui-translations.md](references/ui-translations.md) | 20 | Driving your own UI labels from the `Translation ori` table |
| [examples.md](references/examples.md) | 12, 15 | Sales order end to end, JavaScript/TypeScript helper |
| [mcp-server.md](references/mcp-server.md) | 23 | Local BC MCP server: install, configure, start, register with a client, message-type/record/table tools, config and encryption helpers |

## Related skills

| Skill | Load it when |
| --- | --- |
| [bifrost-foundation](../bifrost-foundation/SKILL.md) | You need the generated per-message-type reference pages for the kernel |
| [bifrost-iceland](../bifrost-iceland/SKILL.md) | Icelandic ERP message types |
| [bifrost-iceland-treasury](../bifrost-iceland-treasury/SKILL.md) | Icelandic bank connectors, claims, payments |
| [bifrost-iceland-docex](../bifrost-iceland-docex/SKILL.md) | Electronic document exchange, Peppol/BIS 3.0 |
| [bifrost-bragi](../bifrost-bragi/SKILL.md) | Chat and language model providers |
| [bifrost-hnitbjorg](../bifrost-hnitbjorg/SKILL.md) | Azure Blob, Azure File Share and SharePoint storage |
| [bifrost-nornir](../bifrost-nornir/SKILL.md) | Job queue scheduling and declarative playbooks |
| [bifrost-clockify](../bifrost-clockify/SKILL.md) | Clockify time tracking |
| [bifrost-subscription-billing](../bifrost-subscription-billing/SKILL.md) | Recurring and subscription billing |
