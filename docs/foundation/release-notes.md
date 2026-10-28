---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Foundation published on Microsoft AppSource."
---

# Bifröst Foundation release notes

This page is for Business Central administrators and users who want to know what changed in Bifröst Foundation. It lists the versions published on Microsoft AppSource, newest first. To see which version you have installed, open **Extension Management** in Business Central and look for **Bifrost Foundation**.

## 28.0.10 — 28 October 2026

### Changed
- **Unknown parameters are refused before anything runs.** When a request that writes data or performs an action contains a parameter name the operation does not know, Bifröst now refuses the whole request with an unknown parameter error and executes nothing. Before, the extra parameter could be ignored. Requests that only read data still go ahead and return a warning about the unknown parameter. Incoming webhooks are not affected: they keep passing everything they receive on unchanged, and the receiving app checks the content. If you have an integration that writes through Bifröst, make sure it sends only the parameters the operation's help describes before you update.

### Fixed
- **Subscription tenants no longer need a trial.** On a Business Central SaaS environment with a Subscription license, calls were refused with a message saying that the Bifröst trial had not been started, although a trial does not apply to Subscription. Calls now continue to the monthly user and company quota checks. Prepaid and on-premises environments still need an active trial or purchased calls, as before. The setup wizard also explains that Subscription needs no trial, and it no longer offers a trial or shows a trial activation status for it.
- **Help works for users whose permissions come from another Bifröst app.** Users who received their Bifröst permissions only through another Bifröst app could be refused when they opened help chapters. They can now read help again. Nothing else in the permission sets changes.
- **Complete Icelandic texts.** The texts of webhook errors and of change log write-guard refusals now have Icelandic translations, so these messages no longer appear in English in an Icelandic client.

## 28.0.8 — 21 October 2026

### Added
- **Recovery guidance for unexpected errors.** When a Bifröst app meets an unexpected Business Central error, it can now add a translated explanation of what was expected and what to do next. The guidance survives the rollback of the failed operation, so the assistant or system that made the call can act on it.
- **Budget comparison by statement type.** Comparing a budget with actual figures can be limited to the income statement or the balance sheet, next to the existing account and dimension filters. Leaving the choice out keeps both, as before.

### Fixed
- **Journal checks match posting.** Checking a general journal now reports, per line and field, every purchase document problem that posting would refuse, such as a missing mandatory External Document No. or a duplicate document. A journal is reported as ready only after a posting preview that is rolled back.
- **Posting previews keep Business Central's own errors.** All posting previews keep the errors Business Central logs during the preview. One error is answered as a Business Central error, and several errors are answered together with each message, its record and field, and the document or journal line. The help keeps request validation and logged refusals apart.
- **Journal preview refusals name the right line.** Item and general journal previews name a line only when it exists and is not blank. Otherwise they name the batch and give translated recovery guidance.
- **Clearer value errors when writing records.** Invalid values, including malformed base64 data for a BLOB field, are found before anything is written. The answer names the field, the expected format and a translated next step.
- **Better suggestions for misspelled parameters.** The suggestion for an unknown request key now prefers the closest declared key and keeps the declared spelling.
- **Budget comparison reports every problem at once.** Independent problems in a request are reported together, in a fixed order, instead of one at a time.
- **Approving a session source with restricted permission sets.** Approving works for users with restricted permission sets. API integrations keep their existing access.
- **User Setup Editor shows whose setup it is.** The user name and full name appear in the page caption and in the first field, with a fallback for deleted users. The User Setup action in the chat FactBox opens the current user's own setup.
- **Old help text removed.** The English help for creating and updating journal lines no longer shows an outdated sentence.

## 28.0.7 — 19 October 2026

### Added
- **Deleting journal lines and renumbering.** General, item and project journals can now delete selected lines, or whole documents, within one existing batch. Afterwards Business Central's own document renumbering can be run. Everything happens in one rollback boundary, and the answer shows the surviving lines with their document numbers.
- **Help for calculated totals on master records.** The help now explains how to read calculated totals (FlowFields) on G/L accounts, customers, vendors, bank accounts, items, resources, projects, employees and fixed asset depreciation books, including the filters that apply, when to use which approach and what to watch for.

### Changed
- **Journal help explains replacing a line.** Replacing a journal line is done by deleting it and creating it again. The help says so, warns that renumbering can give documents the same number, and shows the surviving lines in its combined example.

### Fixed
- **Production companies always need approval of the Terms of Use.** An evaluation company in a production environment needs Terms of Use approval, trial activation and Foundation HTTP like any other company. Outside production nothing changes.
- **Sandboxes and evaluation companies process local operations without a trial.** Evaluation companies and all sandboxes, including on-premises development environments, no longer need trial activation or Foundation HTTP to process operations. Ordinary companies keep their checks.
- **Budget refusals are clearer.** Refusals keep the first error per field, repeat the submitted value, suggest ISO dates, and name the right line in single-entry requests. Partial budget updates keep the fields that were left out.
- **Renumbering without a number series is refused up front.** A request to renumber a journal whose batch has no number series is refused before anything is deleted, and the refusal names the batch.
- **Field Access restrictions apply when deleting journal lines.** Table and field restrictions you have set are honored before a line is deleted or renumbered.
- **Permission refusals name the table.** When a table permission is missing, the refusal now identifies the table directly.

## 28.0.6 — 18 October 2026

### Added
- **Budget export and import.** Budget entries can be exported in filtered pages and imported into a target budget. An import is atomic, reports errors per row, creates new identities, checks dimension compatibility, and can carry an optional closing date marker so dates are preserved exactly.
- **Field Sensitivity for a whole table.** A Field Sensitivity row with Field No. 0 applies to every field in that table. A row for a single field can only raise the class, never lower it. The Field Sensitivities page shows such rows as **(All fields)**, and the Field Access overview shows them too.

### Changed
- **CSV exports continue from the last record.** CSV exports of records and of deleted records continue from the last record returned, not with skip and take paging. The deleted-records export resumes at the next visible Delete Log entry and keeps its table and date filters. Skip and take now give the standard warning for unknown parameters.
- **One policy for evaluation companies.** The dispatcher, the setup wizard and the license panel use the same Terms of Use policy for evaluation companies.

### Fixed
- **Deleted-records refusals repeat what you sent.** When the Store Record setting is off, the refusal repeats the table exactly as you sent it, in English and in Icelandic, instead of the translated caption.
- **Malformed paging values in budget names.** A malformed value for the number of rows to return now gives one clear format error instead of a range error.
- **No misleading suggestion for a document number.** When a request for sales or purchase document statistics names a document number under the wrong key, the next step no longer suggests the document type.

## 28.0.5 — 17 October 2026

### Added
- **Budget operations.** Foundation can read and write G/L budget entries, with atomic batches, automatic entry numbers and dimensions. It can manage budget names, including descriptions, blocking and the four budget dimensions, and it can copy a budget from another budget or from G/L entries with a date formula, a factor and rounding. Generic writes to the budget tables are refused with a pointer to these operations.
- **Budget compared with actual.** A budget can be compared with actual net change per posting G/L account and period, with global and budget dimension filters, stable refusals and paging.
- **Flexible table names.** When a table name does not match exactly, Foundation tries a normalized name (case, spaces, dots and punctuation ignored), the caption in your session language, the English caption and a set of common aliases. An exact name always wins, and an ambiguous name is refused with the candidates.

### Changed
- **Posting requires approval first.** Posting a sales or purchase document that needs workflow approval is refused with a clear explanation, even before an approval request exists. The refusal names the document and the next steps.
- **No trial gate in SaaS sandboxes.** A company in a SaaS sandbox no longer needs the Bifröst trial after the setup wizard. This fixes the refusal "Bifrost trial has not been started" and works after upgrading without any action. The Terms of Use check is unchanged.
- **The license panel shows when the trial has not started.** The panel shows **Trial not started** instead of a valid license when the trial still applies. The **Activate trial** action opens the setup wizard at the trial step.
- **Setup wizard shows the connection details everywhere.** Steps 5 and 6 show the connection address and the authorization link in every environment, including environments installed for testing.
- **Paging keys on customer sales history.** Reading a customer's sales history still returns the full list. Skip and take give a low-severity warning, and a strict request refuses them.

### Fixed
- **Primary-key fields in a write request.** When a write request includes primary-key fields, they are ignored with a low-severity warning and the update still succeeds. The refusal hint mentions the force option only when it was requested and the user holds the force permission.
- **Values that look like secrets are not echoed.** If a refused request contains a value that looks like a secret, the refusal names the key and shows the value as redacted. The stored copy of the request is redacted too.
- **Metadata lookups for restricted users.** Table name resolution and table metadata readers work for users with restricted permission sets, without giving them access to customer data.
- **Icelandic wording.** Several refusal messages and operation descriptions were corrected to consistent Icelandic terms.

## 28.0.4 — 15 October 2026

### Changed
- **Posting always commits.** Posting, converting blanket orders and quotes into orders, and cancelling or correcting posted invoices always commit their result, and the help says so. Posting and conversion no longer depend on the caller's transaction.
- **Setup wizard explains quotas.** The wizard separates the sandbox default from the production monthly quota guidance, names the **Configure Rate Limit** action in any production environment of the same Microsoft Entra tenant, and shows the exact quota captions.
- **Only administrators open the setup wizard.** The wizard opens only for a Bifröst administrator. Others get a clear message and nothing is changed.
- **HTTP settings stay as you set them.** Foundation no longer changes **Allow HttpClient Requests** on its own. A new installation sets it only if it is missing, and an administrator's choice to turn it off is kept.
- **Narrower change log permissions.** The `BIFROST API ori` permission set no longer includes the broad **Changelog - Read** permission. The change log operations read what they need on their own.
- **Webhooks are forwarded as received.** Receiving a webhook now forwards the body and headers as JSON text of any shape, and accepts an empty subject. Checking the content and the sender is left to the app that subscribes.
- **Evaluation sandboxes.** An evaluation company in a SaaS sandbox does not need Terms of Use approval or an active trial to process operations.
- **Database lock errors can be retried.** A lock or deadlock timeout is answered with a new **Retryable** code and translated guidance, in English and in Icelandic.

### Fixed
- **Journal totals per currency.** Check, post and preview of general journals return totals per currency, and no total when currencies are mixed.
- **Checks sum Balance (LCY).** Checking a general journal sums Balance (LCY) for readiness, so lines with balancing accounts balance themselves.
- **Clearer refusals.** Approval, invoice e-mail, bank statement date and project VAT refusals now say what to do. Journal previews keep the source document numbers, report skipped and processed line counts, and list each duplicate item once.
- **Posting subscription items.** Posting a sales document that contains contract-only subscription items is refused with an explanation, because Business Central's subscription billing posts them.
- **Setting fields in the right order.** Writing sales lines and purchase lines applies the fields in dependency order, so a quantity and a price set before the item number keep their values.
- **Quota checks for API callers.** The monthly quota per user is checked correctly for callers who hold only the API permission set.
- **Fewer extra permissions.** Standard Business Central actions that Foundation reacts to, such as approvals, notifications and incoming documents, work for ordinary users without extra Bifröst execute permissions.
- **More accurate help.** The help for generic data operations, the change log, purchase posting and exchange rate adjustment describes the real preconditions and the two-step validation.

## 28.0.3 — 7 October 2026

### Changed
- **Help for the memory operations.** The help recommends the array form for saving memory entries, keeps the other accepted forms, warns about parenthesized comparisons, and shows insert and update by id.

### Fixed
- **Delete logging and message protection for ordinary users.** The automatic checks that log deletions and protect unreported messages now work for ordinary Business Central users who hold no Bifröst execute permission. Deletion logging, protection and data permissions are unchanged.

## 28.0.2 — 7 October 2026

### Added
- **Licensing panel with monthly usage.** The license panel shows **This Month** and **Last Month**, headed by the charge types, with the usage the licensing service has received from your company. The quota groups appear only where a quota applies. The former **Usage** group is now **Status**, with unreported messages and the last time the company was synced.
- **More tables for guarded writes.** Users who hold the force permission can write to more Business Central tables through the guarded write path. Existing read restrictions are unchanged.
- **Warning when Business Central changes a value.** When a write request sets a field and Business Central later changes it during validation, the answer succeeds and warns, so you can compare the returned values.

### Changed
- **Licensing actions in one place.** Bifrost Setup lists all licensing actions in the **Licensing** group, ordered by role, with **Revoke EULA Approval** last.
- **Optional paging in help lists.** Help lists accept skip and take, with sensible defaults and a maximum. Help for reading and writing records says that field values are returned as strings and that decimals use a dot.
- **Consistent record identifiers.** Every operation that targets a record reads its identifier from the same set of keys, and a strict request refuses unknown keys before anything runs.

### Fixed
- **Sync in a sandbox.** **Sync** on Bifrost Setup no longer fails in a SaaS sandbox with "The licensing connection material is not valid". Sync stays available there and verifies the setup and reports sandbox usage.
- **Open approval requests are respected.** Posting, releasing or reopening a sales or purchase document that has an open approval request is refused with an explanation, as in Business Central. Sending a document for approval lists every problem at once, and reading the approval log for one document returns only that document's rows.
- **Sent fields are validated in order.** Writing records validates the fields in the order you send them, as Business Central does. Changing the quantity or amount on a released or pending approval sales or purchase line is refused, and the refusal names the document status.
- **Notes stay in the current company.** Reading and writing notes no longer reaches notes of another company. The generic data operations refuse the Record Link table and point to the dedicated note operations.
- **Setting a default incoming document.** Choosing the default attachment of an incoming document no longer loses attachments if something fails halfway.
- **Cancelling an invoice keeps the reason.** When cancelling or correcting an invoice fails, the answer keeps every reason Business Central gave.
- **CSV export of deleted records.** Company-scoped exports of deleted records always include the company column, and the help explains technical and display names and empty results.
- **Project credit memo help.** The help shows positive credit memo amounts and describes which planning lines are eligible.

## 28.0.0 — 4 October 2026

### First version on Microsoft AppSource
- **Your Business Central, available to the AI you already use.** Foundation lets AI assistants and other systems answer from live data, carry out tasks and run routines in Business Central, as the signed-in user and within that user's permissions.
- **Operations that do the work.** Each operation is a complete Business Central task built on Business Central's own logic: sales and purchase documents from the first line to posting, payments applied to customer and vendor entries, journals, bank reconciliation, financial reports, projects, approvals and more.
- **Operations explain themselves.** Each operation tells the assistant what it is for, what it needs, what it changes and what can go wrong. The installed operations are listed by the MCP tools and by the help operations `Help.MessageTypes.Get` and `Help.Implementation.Get`.
- **Control made for agents.** Posting gates, fields hidden from agents, the change log guard, monthly quotas, and one log of every call in your own company.
- **One setup for the whole family.** The setup page and setup wizard, the secret store, permission sets, licensing, the message log and the help work the same way for every Bifröst app.
- **Any assistant and any connection.** Use your own assistant, integrations and automation, online and on-premises. Foundation needs Business Central 28.0 or later.
