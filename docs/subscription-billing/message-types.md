---
id: message-types
title: "Message type guide"
sidebar_label: "Message type guide"
sidebar_position: 2
description: "The request and response contract shared by all 22 Subscription Billing message types, what each one does, and the limitations worth knowing before you call one."
---

Every message type in this app is named `Subscription.<Domain>.<Action>`, for example `Subscription.Billing.CreateProposal`, across ten domains: Commitments, Customer Contracts, Vendor Contracts, Billing Pipeline, Price Updates, Renewal, Usage, Deferrals, Analysis and Import.

This page covers the contract they all share and the behaviour that is worth reading before you call one. The per-type detail — every parameter, a worked example, the response shape and the exact error messages — is served by the app itself: call `Help.MessageTypes.Get` to list the registered types, and `Help.Implementation.Get` with a type name as the subject to fetch that type's own Markdown help document.

## The shared contract

- The request body is a JSON object. Every message type reads it with the same helper, so parsing is consistent: dates are read and written as ISO `YYYY-MM-DD` regardless of the caller's locale, decimals use a decimal point, and booleans accept `true`/`false`/`1`/`0`, case-insensitively.
- Most message types accept their primary key — a contract number, a subscription number, a template code — either as a named JSON property or as the Bifröst message **subject**. The named property wins when both are supplied.
- A successful response is a JSON object with `"status": "Success"` plus the type's own keys:

  ```json
  {
    "status": "Success",
    "contractNo": "CC000010",
    "billingLineCount": 3,
    "documents": [
      { "documentType": "Invoice", "documentNo": "SINV-000123" }
    ]
  }
  ```

- A failed call responds with `{"status": "Error", "error": "...", "callstack": "..."}` and writes nothing, except where a limitation below says otherwise.
- Every write-capable message type runs its work through a shared isolated-transaction wrapper, so a failure partway through rolls back rather than leaving half-written records. Three types are explicit exceptions, listed under [Not everything is atomic](#not-everything-is-atomic).
- Nothing found is not an error. A run that matches no candidate line, no due subscription and no pending proposal still returns `"status": "Success"` with a count of zero and a `message` explaining which of the possible cases it was.
- Assign the permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) to let a user or service invoke these types, in addition to their Foundation permissions.

## What each type does

Of the 22 message types, 15 write, 3 are read-only previews, and 4 are permanently blocked.

| Message type | Behaviour | Purpose |
| --- | --- | --- |
| `Subscription.Line.Create` | Writes | Applies a Subscription Package to a Subscription, creating Subscription Lines |
| `Subscription.Contract.GetLines` | Writes | Attaches unassigned Subscription Lines to a customer contract |
| `Subscription.Contract.CreateInvoice` | Writes | Bills a customer contract to an unposted sales invoice |
| `Subscription.Contract.PreviewInvoice` | Preview | Shows what `Contract.CreateInvoice` would bill, without keeping anything |
| `Subscription.Contract.UpdateLineDates` | Blocked | Would roll contract line dates forward; no public API exists |
| `Subscription.Contract.UpdateExchangeRates` | Blocked | Would recalculate foreign-currency amounts; no public API, and the flow is unsafe unattended |
| `Subscription.VendorContract.GetLines` | Writes | Attaches unassigned Subscription Lines to a vendor contract |
| `Subscription.VendorContract.CreateInvoice` | Writes | Bills a vendor contract to an unposted purchase invoice, never posted |
| `Subscription.VendorContract.PreviewInvoice` | Preview | Shows what `VendorContract.CreateInvoice` would bill, without keeping anything |
| `Subscription.Billing.CreateProposal` | Writes | Generates billing proposal lines for a Billing Template |
| `Subscription.Billing.CreateDocuments` | Writes | Turns a template's unbilled proposal lines into documents in bulk |
| `Subscription.Billing.PreviewDocuments` | Preview | Reads a template's existing proposal lines and reports how they would group into documents |
| `Subscription.PriceUpdate.SetTemplateFilter` | Writes | Writes a contract, subscription or line view filter on a Price Update Template |
| `Subscription.PriceUpdate.CreateProposal` | Blocked | Would build a price update proposal; no public API exists |
| `Subscription.PriceUpdate.Perform` | Blocked | Would apply a price update proposal; no public API exists |
| `Subscription.Renewal.Extend` | Writes | Extends a Subscription onto a customer and/or vendor contract |
| `Subscription.Renewal.CreateQuote` | Writes | Builds renewal lines and a sales quote for a customer contract |
| `Subscription.Usage.ImportData` | Writes | Imports a usage data file into Usage Data Import lines |
| `Subscription.Usage.Process` | Writes | Advances a Usage Data Import entry through its processing stages |
| `Subscription.Deferral.Release` | Writes, **posts to G/L** | Releases deferred revenue and cost up to a date, across every contract |
| `Subscription.Analysis.Recalculate` | Writes | Rebuilds Subscription Contract analysis entries as of today |
| `Subscription.Import.CreateContracts` | Writes | Builds real Subscription and contract records from staged import rows |

## Known limitations

These are the behaviours that surprise callers. Each one is a deliberate choice, and each is enforced rather than papered over.

### Four message types are permanently blocked

Four types are registered and discoverable, so tooling can list and describe them, but every call returns a structured error and writes nothing. Each names the exact Microsoft procedure that would need to become public first:

| Message type | Microsoft procedure that would need to become public |
| --- | --- |
| `Subscription.Contract.UpdateLineDates` | `Customer Subscription Contract.UpdateServicesDates` (with `Subscription Header.UpdateServicesDates` and codeunit 8058 "Update Sub. Lines Term. Dates") |
| `Subscription.Contract.UpdateExchangeRates` | `Customer Subscription Contract.UpdateAndRecalculateServiceCommitmentCurrencyData` |
| `Subscription.PriceUpdate.CreateProposal` | `Price Update Management.CreatePriceUpdateProposal` |
| `Subscription.PriceUpdate.Perform` | `Price Update Management.PerformPriceUpdate` |

All four are internal in Microsoft's Subscription Billing app in Business Central 28.4. None of them reimplement the underlying logic: term dates, billing rhythms, rounding, currency and binding periods interact in ways that are easy to get subtly wrong, and a divergent implementation could mis-price or corrupt live customer contracts in a way that is hard to detect and hard to undo. Use the equivalent action in the Business Central client instead — each type's own help document names it.

`Subscription.Contract.UpdateExchangeRates` has a second reason to stay blocked even if the procedure were made public. Microsoft's flow opens the interactive **Exchange Rate Selection** page so a user can confirm the rate. When `GuiAllowed` is false — as it always is for an unattended call — that page returns false rather than failing, and the flow proceeds with a zero exchange rate, silently zeroing foreign-currency amounts on the contract.

### Deferral release cannot be scoped to a date from outside

`Subscription.Deferral.Release` runs Microsoft's **Contract Deferrals Release** report, whose posting date and cut-off date live on its request page. `SetRequestPageParameters` is internal, and the request page XML handed to `Report.Execute` is not applied to this report, so neither date can be set from an external app. The report uses the session work date for both: it releases everything eligible up to the work date and posts it under the work date.

Because the call posts irreversibly to the general ledger, `postingDate` and `postUntilDate` are enforced as a **guard, not an instruction**. The call inspects what the report is about to do and refuses when that reaches further than the caller asked, rather than posting and then reporting a number that does not match what happened. To release up to an earlier date, set the session work date before calling.

This is also the one message type that is not scoped to a single contract: it releases every eligible customer and vendor deferral across every Subscription Contract. Confirm the work date carefully before calling it in production.

### A contract cannot be billed again while its last document is unposted

Business Central will not propose a new billing period for a Subscription Line whose previous billing document is still unposted. This is Microsoft's rule, not something this app adds, and it applies to `Subscription.Contract.CreateInvoice`, `Subscription.VendorContract.CreateInvoice` and `Subscription.Billing.CreateProposal` alike.

The practical consequence is that billing the same contract twice in a row bills once. The second call succeeds and reports an empty `documents` array, a count of zero and a message saying nothing new could be billed — it does not silently re-report the first call's document. Post or delete the outstanding document and the next call bills the next period.

### CreateInvoice refuses to run past another contract's pending lines

`Subscription.Contract.CreateInvoice` and `Subscription.VendorContract.CreateInvoice` bill one contract by copying its due Subscription Lines into an ad-hoc billing proposal — Billing Line rows with a **blank** Billing Template Code. That proposal is company-wide, not scoped to one contract: Microsoft's document-creation codeunit converts every blank-template Billing Line standing in the company when it runs.

Both implementations therefore check first whether such a line already exists for a **different** contract, and refuse to run if so, naming that other contract in the error, rather than quietly invoicing someone else's unfinished proposal alongside this one. The two invoice previews apply the same check, because they build the same kind of rows temporarily.

### Vendor billing documents are never posted on this path

`Subscription.VendorContract.CreateInvoice` and the vendor path of `Subscription.Billing.CreateDocuments` always produce an **unposted** purchase invoice or credit memo. Business Central's billing-document creation ignores any post flag for vendor documents on this route, so posting is always a separate, deliberate step after review. No parameter on either type can post a vendor document directly.

### Two of the three previews build and delete real proposal lines

`Subscription.Contract.PreviewInvoice` and `Subscription.VendorContract.PreviewInvoice` are not rolled-back transactions. Microsoft's billing proposal codeunit commits internally partway through its own run, so an ordinary error-based rollback would not undo it. Each preview instead notes the last Billing Line entry number, builds the real proposal rows through the same entry point the write call uses, reads back exactly the rows it created, and deletes exactly those rows again — newest first — on both the success path and if the proposal call fails partway through. Newest-first lets Business Central rewind the billing chain cleanly, including fields such as Next Billing Date that a later row can advance.

`Subscription.Billing.PreviewDocuments` is different: it never builds or deletes anything. It only reads Billing Line rows that already exist because the caller ran `Subscription.Billing.CreateProposal` earlier.

No preview ever creates a document, even temporarily.

### Not everything is atomic

Three message types cannot be rolled back as a whole, because Business Central commits inside them:

- `Subscription.Billing.CreateDocuments` — each billing document is committed as it is created. A failure part way through leaves the documents created before it standing; the error response names them explicitly under `documents` and sets `"rolledBack": false` rather than failing blind.
- `Subscription.Usage.Process` — each requested stage commits once it completes. Rerun the remaining steps instead of retrying the whole call.
- `Subscription.Import.CreateContracts` — each staging row is committed as it is processed. One bad row does not stop the batch; its error is recorded on the staging row and the next row is still attempted.

### Array parameters must be arrays

Every type that takes a list — `subscriptionLineEntryNos`, `subscriptionPackageCodes`, `steps`, `stages` — rejects a value that is present but is not a JSON array. Omitting the parameter, or sending null, still selects the documented default.

Quietly ignoring a malformed list would turn a typo into a much larger run than the caller asked for: a mistyped `steps` would run every processing stage, and a mistyped `subscriptionLineEntryNos` would attach every eligible Subscription Line rather than the two that were named.

## Where to go next

- [Overview](/subscription-billing/) — what the app is and what it requires
- [Message type reference](/subscription-billing/reference/message-types/) — the request and response contract for every type, generated from the app itself
- [In-product help](/help/subscription-billing/)
- [AppSource user scenarios](/subscription-billing/user-scenarios) — a worked path through the app, including the company setup the billing and deferral scenarios depend on
- [Build on Bifröst](/extensibility/)
