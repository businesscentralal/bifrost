---
id: sparisjodir-claim-querypayments
title: "Sparisjodir.Claim.QueryPayments"
sidebar_label: "Sparisjodir.Claim.QueryPayments"
sidebar_position: 149
description: "Beiðni- og svarsamningur fyrir Sparisjodir.Claim.QueryPayments Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a paged Listi of greiðslur received against Sparisjóður claims.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## AI note
Notaðu `claimDate` fyrir the BC/JSON claim key date og `dueDate` fyrir the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message til retrieve greiðslur made against claims. Filters eru valfrjálst; `dateFrom` og `dateTo` restrict the greiðsla færsla date window.

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
Each greiðsla object contains: `claimKey` (claimant/reikningur/claimDate), `payorId`, `amount`, `dueDate`,
`identifier`, `reference`, `categoryCode`, `redeemingBank`, `transactionDate`, `bookingDate`, `valueDate`,
`paymentType`, `amountDeposited`, `totalAmount`, `capitalGainsTax`, `billNumber`, `customerNumber`.
The `dueDate` on a greiðsla object er the final due date returned by ClaimService, not the claim key date.

## AI setup contract (nauðsynlegt áður en posting)
- greiðsla Aðferð configured og discoverable fyrir the viðskiptavinur context.
- staðlaða greiðsla Aðferð balancing fields configured (`Bal. Account Type`, `Bal. Account No.`).
- greiðsla Aðferð extension fields configured: `Spar Claim Identifier` og `Spar Last Claim No.`
- fyrirtæki registration number available as claimant fallback.
- viðskiptavinur mapping rule defined: `payorId` er primary viðskiptavinur key; `customerNumber` er contract/reference context Aðeins.

## Mapping sources (reuse existing data)
- `Payment Method` (table 289): balancing og posting target metadata.
- `Spar Payment Method Ext` (tableextension 10035891): claim identifier og sequencing metadata.
- `Spar Claim Header` (table 10035922): claim-til-viðskiptavinur og status tracking.
- `Spar Payment Batch` (table 10035960): batch-level poll/post lifecycle.
- `Spar Payment Line` (table 10035961): journal context fyrir debit-side application.
- `Bifrost Request Log` (Log Gerð = Sparisjodir): source XML payloads fyrir detailed reconciliation.

## AI Fyrirspurn baseline (validated Dæmi)
fyrir this viðskiptavinur, Notaðu claimant = fyrirtæki registration number frá statement `accountOwnerId`.

```json
{
  "claimant": "<company-registration-no>",
  "dateFrom": "2025-11-01",
  "dateTo": "2025-11-30",
  "recordFrom": 1,
  "recordTo": 200
}
```

Observed result in this dataset: returned 13 greiðsla rows fyrir November 2025.

## AI posting guidance (journal conversion)
- `bookingDate` er the posting date til Notaðu.
- `payorId` er the primary viðskiptavinur key og should match viðskiptavinur No./registration-number mapping.
- `customerNumber` er a contract reference, not a direct viðskiptavinur key.
- Notaðu setup-driven accounts Aðeins (do not hardcode reikningur numbers in prompts, Dæmi, eða automation).
  In this pattern: viðskiptavinur control reikningur (innheimtukrafa) og bankareikningur eru role-based targets.

### Amount model
- Principal = `amount`
- Finance component = `totalAmount - amount`
- Withholding tax = `capitalGainsTax`
- Net bank amount = `amountDeposited` = `totalAmount - capitalGainsTax`

### Validated posting Dæmi
greiðsla row `reference=200000002057`, `bookingDate=2025-11-03`:
- `amount` = 39,663
- `totalAmount` = 41,051
- `capitalGainsTax` = 228
- `amountDeposited` = 40,823
- Finance component = 1,388 (posted til configured fee/interest revenue lines in this setup).

Journal pattern fyrir the Dæmi:
- Credit viðskiptavinur control reikningur: 39,663 (viðskiptavinur principal)
- Credit configured fee/interest revenue lines: 1,388 (split by business rules)
- Debit configured withholding-tax reikningur: 228
- Debit bankareikningur: 40,823

### AI posting contract (no hardcoded accounts)
1. Posting date = `bookingDate`.
2. viðskiptavinur candidate = `payorId`; verify against viðskiptavinur mapping policy.
3. Principal = `amount`; finance component = `totalAmount - amount`.
4. Net bank amount verður að equal `amountDeposited` (`totalAmount - capitalGainsTax`).
5. Notaðu role-based accounts frá setup (viðskiptavinur control, bank, fee/interest, tax).
6. Ef viðskiptavinur eða applies-til skjal er unresolved, place in exception flow rather than silent posting.

Always enforce idempotency áður en posting (recommended key: claimant + reference + bookingDate + amountDeposited).

## Errors
- `'dateFrom' / 'dateTo' must be ISO dates YYYY-MM-DD when supplied`

## Tracking tables update

Þegar greiðslur eru received, update the "Spar Claim Header" (table 10035922):

1. Match the greiðsla til a header using the claim key (claimant + reikningur + claimDate) eða identifier.
2. Set `Status` = Paid og `Last Modified At` = now on matched headers.
3. The greiðsla amount may be partial — Aðeins mark Paid Ef the fulla claim amount er covered.

## Finance note
greiðslur may include finance revenue (interest, collection fees) posted til an income G/L reikningur, og a withholding tax (fjármagnstekjuskattur) on that revenue posted til an asset reikningur. The specific G/L accounts eru viðskiptavinur-configured.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Sparisjóður was blocked by the Business Central environment...`, verify permission til change `Allow HttpClient Requests` og then enable it in Extension Management.

### Check permission áður en changing the setting
- Verify you have permission til update table **NAV App Setting** (AppID = 0FB9B76C-D2BE-462D-B026-D490D0724164) og til manage extension settings.
- Ef you do not have permission, ask a BC administrator til perform the change.

### Steps til resolve
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Spar Banki** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://<bank>-iobs.heimabanki.is`.


