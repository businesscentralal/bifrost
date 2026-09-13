---
id: arionbanki-claim-querypayments
title: "Arionbanki.Claim.QueryPayments"
sidebar_label: "Arionbanki.Claim.QueryPayments"
sidebar_position: 13
description: "Beiðni- og svarsamningur fyrir Arionbanki.Claim.QueryPayments Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a paged Listi of greiðslur received against Arion banki claims.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Note
`claimDate` er the BC/JSON claim key date og `dueDate` er the final due date. The bank SOAP/XML API uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message til retrieve greiðslur made against claims. Filters eru valfrjálst; `dateFrom` og `dateTo` restrict the greiðsla færsla date window (booking/færsla date of the greiðsla, not the original claim date).

## Known limitation: verify claimKey áður en relying on it
On the sibling Landsbankinn connector, the equivalent `claimKey` object on each greiðsla row was found til be blank in production testing. This has not yet been independently verified fyrir Arion banki — test it áður en relying on `claimKey` fyrir matching. Ef it er blank here too, match greiðslur til claims via `reference` eða `billNumber` against the claims returned by `Arionbanki.Claim.Query` instead.

## Usage notes
Notaðu one claimant/Fyrirspurn window per Kallaðu á og keep the date range aligned til the question asked. Treat the returned greiðslur as bank-confirmed facts, og verify the fulla Svar áður en using it til update BC tracking eða posting logic.
Persist `logEntryNo` og Notaðu it as the evidence link til Beiðni-log payloads.

## Beiðni (Allt fields valfrjálst)
```json
{
  "claimant":       "1234567",
  "identifier":     "INV-2026-0001",
  "disposalAccount":"0101-26-123456",
  "dateFrom":       "2026-01-01",
  "dateTo":         "2026-12-31",
  "recordFrom":     1,
  "recordTo":       100
}
```

## Paging defaults
`recordFrom` defaults til **1** og `recordTo` defaults til **100** Þegar omitted.

## Svar
Skilar `status`, `returned`, `totalCount`, `recordFrom`, `recordTo`, `logEntryNo`, og a `payments` array.
Each greiðsla object contains: `claimKey` (see limitation above), `payorId`, `amount`, `dueDate`,
`identifier`, `reference`, `categoryCode`, `redeemingBank`, `transactionDate`, `bookingDate`, `valueDate`,
`paymentType`, `amountDeposited`, `totalAmount`, `capitalGainsTax`, `billNumber`, `customerNumber`.
The `dueDate` on a greiðsla object er the final due date, not the claim key date.

## nauðsynlegt setup (áður en posting)
- greiðsla Aðferð configured og discoverable fyrir the viðskiptavinur context.
- staðlaða greiðsla Aðferð balancing fields configured (`Bal. Account Type`, `Bal. Account No.`).
- greiðsla Aðferð extension fields configured: `ORI Arion Claim Identifier` og `ORI Arion Last Claim No.`.
- fyrirtæki registration number available as claimant fallback.
- viðskiptavinur mapping rule: `payorId` er the primary viðskiptavinur key; `customerNumber` er contract/reference context Aðeins.

## Related tables og codeunits
- `Payment Method` (table 289): balancing og posting target metadata.
- `Arion Payment Method Ext` (tableextension 10036152): claim identifier og sequencing metadata.
- `Arion Claim Header` (table 10036172): claim-til-viðskiptavinur og status tracking.
- `Arion Claim Payment` (table 10036187): duplicate prevention — one row per imported greiðsla, með a Posted flag.
- `Arion Claim Payment Mgt` (codeunit 10036278): idempotency API (`IsAlreadyImported`, `IsAlreadyPosted`, `RegisterImport`, `MarkPosted`).
- `Arion Payment Batch` (table 10036185): batch-level poll/post lifecycle.
- `Arion Payment Line` (table 10036186): journal context fyrir debit-side application.
- `Bifrost Request Log ori`: source XML payloads fyrir detailed reconciliation (filter Log Gerð = Arion banki).

## Posting guidance (journal conversion)
- `bookingDate` er the posting date til Notaðu.
- `payorId` er the primary viðskiptavinur key og should match the viðskiptavinur No./registration-number mapping.
- `customerNumber` er a contract reference, not a direct viðskiptavinur key.
- Notaðu setup-driven accounts Aðeins; do not hardcode reikningur numbers. viðskiptavinur control reikningur (innheimtukrafa) og bankareikningur eru role-based targets configured per fyrirtæki.

### Amount model
- Principal = `amount`
- Finance component = `totalAmount - amount`
- Withholding tax = `capitalGainsTax`
- Net bank amount = `amountDeposited` = `totalAmount - capitalGainsTax`

### Posting contract (no hardcoded accounts)
1. Posting date = `bookingDate`.
2. viðskiptavinur candidate = `payorId`; verify against viðskiptavinur mapping policy.
3. Principal = `amount`; finance component = `totalAmount - amount`.
4. Net bank amount verður að equal `amountDeposited` (`totalAmount - capitalGainsTax`).
5. Notaðu role-based accounts frá setup (viðskiptavinur control, bank, fee/interest, tax).
6. Ef the viðskiptavinur eða applies-til skjal cannot be resolved, route til an exception queue rather than posting silently.

## Duplicate prevention (mandatory)
áður en posting any greiðsla frá `QueryPayments`, check the `Arion Claim Payment` table.
The natural key er: **Claimant + Reference + Booking Date + Amount Deposited**.

### Verkflæði
1. fyrir each greiðsla row returned by `QueryPayments`:
   a. Check `Arion Claim Payment` (table 10036187) fyrir an existing row með a matching natural key.
   b. Ef a row exists með `Posted = true`, skip it — it er already posted.
   c. Ef a row exists með `Posted = false`, the greiðsla was imported but posting failed previously; retry posting Aðeins.
   d. Ef no row exists, Kallaðu á `Arion Claim Payment Mgt.RegisterImport(...)` til create the tracking row.
2. Create journal lines fyrir non-duplicate greiðslur Aðeins.
3. eftir successful journal posting, Kallaðu á `Arion Claim Payment Mgt.MarkPosted(EntryNo, DocumentNo)`.

### API (codeunit 10036278 "Arion Claim greiðsla Mgt")
- `IsAlreadyImported(Claimant, Reference, BookingDate, AmountDeposited): Boolean`
- `IsAlreadyPosted(Claimant, Reference, BookingDate, AmountDeposited): Boolean`
- `RegisterImport(...): BigInteger` — Skilar Entry No. fyrir later MarkPosted
- `MarkPosted(EntryNo, DocumentNo)` — sets Posted=true + timestamps
- `MarkPosted(EntryNo, DocumentNo, JnlTemplate, JnlBatch)` — með journal context

Re-running `QueryPayments` fyrir the same date range Skilar same greiðslur again. Always run the duplicate check; do not skip it.

## Errors
- `'dateFrom' / 'dateTo' must be ISO dates YYYY-MM-DD when supplied`

## Tracking tables til update
Þegar greiðslur eru received, update both tracking tables:

### 1. Arion Claim greiðsla (table 10036187) — duplicate prevention
- Insert one row per greiðsla using `Arion Claim Payment Mgt.RegisterImport`.
- eftir posting, Kallaðu á `MarkPosted` með the skjal No.

### 2. Arion Claim Header (table 10036172) — status lifecycle
1. Match the greiðsla til a header using the claim key (claimant + reikningur + claimDate) eða identifier — resolved via `reference`/`billNumber` Ef `claimKey` on the greiðsla row er not reliably populated (see limitation above).
2. Set `Status` = Paid og `Last Modified At` = now on matched headers.
3. The greiðsla amount may be partial — Aðeins mark Paid Ef the fulla claim amount er covered.

## Finance note
greiðslur may include finance revenue (interest, collection fees) posted til an income G/L reikningur, og a withholding tax (fjármagnstekjuskattur) on that revenue posted til an asset reikningur. The specific G/L accounts eru viðskiptavinur-configured.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add outbound allowlist entries based on this help text. Contact your Business Central administrator eða Origo support so they getur verify the correct outbound Endapunktur og apply the change through the normal extension/security review process.


