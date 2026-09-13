---
id: message-types
title: "Message type guide"
sidebar_label: "Message type guide"
sidebar_position: 2
description: "The request and response contract shared by all 22 Subscription Billing message types, what each one does, and the limitations worth knowing before you call one."
---

Every message tegund in this app er heitid `Subscription.<Domain>.<Action>`, fyrir example `Subscription.Billing.CreateProposal`, across ten domains: Commitments, Customer Contracts, Vendor Contracts, Billing Pipelína, Price Uppfærir, Renewal, Usage, Deferrals, Analysis og Import.

This page covers the samningur they allir share og the behaviour that er worth reading áður en you call one. The per-tegund detail — every parameter, a worked example, the response shape og the exact villa messages — er served by the app itself: call `Help.MessageTypes.Get` to list the registered tegunds, og `Help.Implementation.Get` með a tegund heiti as the subject to fetch that tegund's own Markdown help skjal.

## The shared samningur

- Beiðnin body er a JSON object. Every message tegund reads it með the same helper, so parsing er consistent: dagsetnings eru read og written as ISO `YYYY-MM-DD` regardless of the caller's locale, decimals use a decimal point, og booleans accept `true`/`false`/`1`/`0`, case-insensitively.
- Most message tegunds accept their primary key — a samningur number, a subscription number, a template kóði — either as a heitid JSON property eða as the Bifröst message **subject**. The heitid property wins þegar both eru supplied.
- A successful response er a JSON object með `"status": "Success"` plus the tegund's own keys:

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

- A failed call responds með `{"status": "Error", "error": "...", "callstack": "..."}` og writes nothing, except þar sem a limitation below says otherwise.
- Every write-capable message tegund runs its work through a shared isolated-transaction wrapper, so a failure partway through rolls back rather than leaving half-written færslur. Three tegunds eru explicit exceptions, listed under [Not everything er atomic](#not-everything-er-atomic).
- Ekkert found er not an villa. A run that matches no geturdidagsetning lína, no due subscription og no pending proposal still returns `"status": "Success"` með a count of zero og a `message` explaining which of the possible cases it was.
- Assign the permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) to let a notandi eða service invoke these tegunds, in addition to their Foundation permissions.

## What hver tegund does

Of the 22 message tegunds, 15 write, 3 eru read-only previews, og 4 eru permanently blocked.

| Skilaboð tegund | Behaviour | Purpose |
| --- | --- | --- |
| `Subscription.Line.Create` | Writes | Applies a Subscription Package to a Subscription, creating Subscription Lines |
| `Subscription.Contract.GetLines` | Writes | Attaches unassigned Subscription Lines to a viðskiptavinur samningur |
| `Subscription.Contract.CreateInvoice` | Writes | Bills a viðskiptavinur samningur to an unposted sales reikningur |
| `Subscription.Contract.PreviewInvoice` | Preview | Shows what `Contract.CreateInvoice` would bill, án keeping anything |
| `Subscription.Contract.UpdateLineDates` | Blocked | Would roll samningur lína dagsetnings forward; no public API er til |
| `Subscription.Contract.UpdateExchangeRates` | Blocked | Would recalculate foreign-currency fjárhæðs; no public API, og the flow er unsafe unattended |
| `Subscription.VendorContract.GetLines` | Writes | Attaches unassigned Subscription Lines to a vendor samningur |
| `Subscription.VendorContract.CreateInvoice` | Writes | Bills a vendor samningur to an unposted purchase reikningur, never posted |
| `Subscription.VendorContract.PreviewInvoice` | Preview | Shows what `VendorContract.CreateInvoice` would bill, án keeping anything |
| `Subscription.Billing.CreateProposal` | Writes | Generates billing proposal línur fyrir a Billing Template |
| `Subscription.Billing.CreateDocuments` | Writes | Turns a template's unbilled proposal línur í skjöl in bulk |
| `Subscription.Billing.PreviewDocuments` | Preview | Lestus a template's existing proposal línur og reports how they would group í skjöl |
| `Subscription.PriceUpdate.SetTemplateFilter` | Writes | Writes a samningur, subscription eða lína view filter on a Price Updagsetning Template |
| `Subscription.PriceUpdate.CreateProposal` | Blocked | Would build a price updagsetning proposal; no public API er til |
| `Subscription.PriceUpdate.Perform` | Blocked | Would apply a price updagsetning proposal; no public API er til |
| `Subscription.Renewal.Extend` | Writes | Extends a Subscription onto a viðskiptavinur and/or vendor samningur |
| `Subscription.Renewal.CreateQuote` | Writes | Builds renewal línur og a sales quote fyrir a viðskiptavinur samningur |
| `Subscription.Usage.ImportData` | Writes | Flytur inn a usage data skrá í Usage Data Import línur |
| `Subscription.Usage.Process` | Writes | Advances a Usage Data Import entry through its processing stages |
| `Subscription.Deferral.Release` | Writes, **posts to G/L** | Releases deferred revenue og cost up to a dagsetning, across every samningur |
| `Subscription.Analysis.Recalculate` | Writes | Rebuilds Subscription Contract analysis entries as of today |
| `Subscription.Import.CreateContracts` | Writes | Builds real Subscription og samningur færslur úr staged import rows |

## Known limitations

These eru the behaviours that surprise callers. Each one er a deliberate choice, og hver er enforced rather than papered over.

### Four message tegunds eru permanently blocked

Four tegunds eru registered og discoverable, so tooling getur list og describe them, but every call returns a structured villa og writes nothing. Each heitis the exact Microsoft procedure that would need to become public first:

| Skilaboð tegund | Microsoft procedure that would need to become public |
| --- | --- |
| `Subscription.Contract.UpdateLineDates` | `Customer Subscription Contract.UpdateServicesDates` (with `Subscription Header.UpdateServicesDates` og kóðiunit 8058 "Updagsetning Sub. Lines Term. Dates") |
| `Subscription.Contract.UpdateExchangeRates` | `Customer Subscription Contract.UpdateAndRecalculateServiceCommitmentCurrencyData` |
| `Subscription.PriceUpdate.CreateProposal` | `Price Update Management.CreatePriceUpdateProposal` |
| `Subscription.PriceUpdate.Perform` | `Price Update Management.PerformPriceUpdate` |

All four eru internal in Microsoft's Subscription Billing app in Business Central 28.4. None of them reimplement the underlying logic: term dagsetnings, billing rhythms, rounding, currency og binding periods interact in ways that eru easy to get subtly wrong, og a divergent implementation could mis-price eða corrupt live viðskiptavinur samningar in a way that er hard to detect og hard to undo. Notaðu the equivalent action in the Business Central client instead — hver tegund's own help skjal heitis it.

`Subscription.Contract.UpdateExchangeRates` has a second reason to stay blocked even ef the procedure were made public. Microsoft's flow opens the interactive **Exchange Rate Selection** page so a notandi getur confirm the rate. When `GuiAllowed` er false — as it always er fyrir an unattended call — that page returns false rather than failing, og the flow proceeds með a zero exchange rate, silently zeroing foreign-currency fjárhæðs on the samningur.

### Deferral release geturnot be scoped to a dagsetning úr outside

`Subscription.Deferral.Release` runs Microsoft's **Contract Deferrals Release** report, whose posting dagsetning og cut-off dagsetning live on its request page. `SetRequestPageParameters` er internal, og the request page XML handed to `Report.Execute` er not applied to this report, so neither dagsetning getur be set úr an external app. The report uses the session work dagsetning fyrir both: it releases everything eligible up to the work dagsetning og posts it under the work dagsetning.

Because the call posts irreversibly to the general ledger, `postingDate` og `postUntilDate` eru enforced as a **guard, not an instruction**. The call inspects what the report er about to do og refuses þegar that reaches further than the caller asked, rather than posting og then reporting a number that gerir ekki match what happened. To release up to an earlier dagsetning, set the session work dagsetning áður en calling.

This er also the one message tegund that er not scoped to a single samningur: it releases every eligible viðskiptavinur og vendor deferral across every Subscription Contract. Confirm the work dagsetning carefully áður en calling it in production.

### A samningur geturnot be billed again while its last skjal er unposted

Business Central mun not propose a new billing period fyrir a Subscription Line whose previous billing skjal er still unposted. This er Microsoft's rule, not something this app adds, og it applies to `Subscription.Contract.CreateInvoice`, `Subscription.VendorContract.CreateInvoice` og `Subscription.Billing.CreateProposal` alike.

The practical consequence er that billing the same samningur twice in a row bills once. The second call succeeds og reports an empty `documents` array, a count of zero og a message saying nothing new could be billed — it gerir ekki silently re-report the first call's skjal. Post eða delete the outstanding skjal og the next call bills the next period.

### CreateInvoice refuses to run past another samningur's pending línur

`Subscription.Contract.CreateInvoice` og `Subscription.VendorContract.CreateInvoice` bill one samningur by copying its due Subscription Lines í an ad-hoc billing proposal — Billing Line rows með a **blank** Billing Template Code. That proposal er company-wide, not scoped to one samningur: Microsoft's skjal-creation kóðiunit converts every blank-template Billing Line standing in the company þegar it runs.

Both implementations therefore check first whether such a lína already er til fyrir a **different** samningur, og refuse to run ef so, naming that other samningur in the villa, rather than quietly invoicing someone else's unfinished proposal alongside this one. The two reikningur previews apply the same check, because they build the same kind of rows temporarily.

### Vendor billing skjöl eru never posted on this slóð

`Subscription.VendorContract.CreateInvoice` og the vendor slóð of `Subscription.Billing.CreateDocuments` always produce an **unposted** purchase reikningur eða credit memo. Business Central's billing-skjal creation ignores any post flag fyrir vendor skjöl on this route, so posting er always a separate, deliberate step eftir review. No parameter on either tegund getur post a vendor skjal directly.

### Two of the three previews build og delete real proposal línur

`Subscription.Contract.PreviewInvoice` og `Subscription.VendorContract.PreviewInvoice` eru not rolled-back transactions. Microsoft's billing proposal kóðiunit commits internally partway through its own run, so an ordinary villa-based rollback would not undo it. Each preview instead notes the last Billing Line entry number, builds the real proposal rows through the same entry point the write call uses, reads back exactly the rows it created, og deletes exactly those rows again — newest first — on both the success slóð og ef the proposal call fails partway through. Newest-first lets Business Central rewind the billing chain cleanly, including fields such as Next Billing Date that a later row getur advance.

`Subscription.Billing.PreviewDocuments` er different: it never builds eða deletes anything. It aðeins reads Billing Line rows that already exist because the caller ran `Subscription.Billing.CreateProposal` earlier.

No preview ever creates a skjal, even temporarily.

### Not everything er atomic

Three message tegunds geturnot be rolled back as a whole, because Business Central commits inside them:

- `Subscription.Billing.CreateDocuments` — hver billing skjal er committed as it er created. A failure part way through leaves the skjöl created áður en it standing; the villa response heitis them explicitly under `documents` og sets `"rolledBack": false` rather than failing blind.
- `Subscription.Usage.Process` — hver requested stage commits once it completes. Rerun the remaining steps instead of retrying the whole call.
- `Subscription.Import.CreateContracts` — hver staging row er committed as it er processed. One bad row gerir ekki stop the batch; its villa er færslaed on the staging row og the next row er still attempted.

### Array parameters verður að vera arrays

Every tegund that takes a list — `subscriptionLineEntryNos`, `subscriptionPackageCodes`, `steps`, `stages` — rejects a gildi that er present but er not a JSON array. Sleppiðting the parameter, eða sending null, still velur the skjaled sjálfgefið.

Quietly ignoring a malformed list would turn a typo í a much larger run than the caller asked for: a mistegundd `steps` would run every processing stage, og a mistegundd `subscriptionLineEntryNos` would attach every eligible Subscription Line rather than the two that were heitid.

## Where to go next

- [Overview](/subscription-billing/) — what the app er og what it requires
- [Skilaboð tegund reference](/subscription-billing/reference/message-types/) — the request og response samningur fyrir every tegund, generated úr the app itself
- [In-product help](/help/subscription-billing/)
- [AppSource notandi scenarios](/subscription-billing/user-scenarios) — a worked slóð through the app, including the company setup the billing og deferral scenarios depend on
- [Build on Bifröst](/extensibility/)
