---
id: arionbanki-claim-query
title: "Arionbanki.Claim.Query"
sidebar_label: "Arionbanki.Claim.Query"
sidebar_position: 11
description: "Beiðni- og svarsamningur fyrir Arionbanki.Claim.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a paged Listi of Arion banki claims matching the supplied filters.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Note
`claimDate` er the BC/JSON claim key date og `dueDate` er the final due date. The bank SOAP/XML API uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message til search claims by claimant, identifier, date span, payor, status, state, og paging window. Notaðu `Arionbanki.Claim.QueryOne` Þegar you already know the fulla claim key.

## Beiðni (Allt fields valfrjálst)
```json
{
  "claimant":   "1234567",
  "identifier": "INV-2026-0001",
  "dateRef":    "claimDate",        // claimDate | dueDate | CancellationDate | CreationDate
  "dateFrom":   "2026-01-01",
  "dateTo":     "2026-12-31",
  "payor":      "1101012220",
  "claimStatus":"Unpaid",            // Unpaid | Paid | Cancelled | Invalid
  "claimState": "PrimaryCollection", // PrimaryCollection | SecondaryCollection | LegalCollection
  "recordFrom": 1,                   // 1-based start row
  "recordTo":   100                  // 1-based end row (inclusive)
}
```

## Paging defaults
`recordFrom` defaults til **1** og `recordTo` defaults til **100** Þegar omitted.

## Date filters
| `dateRef` | Filters by | Bank XML value |
|---|---|---|
| `claimDate` | Claim key date | `DueDate` |
| `dueDate` | Final due date / eindagi | `FinalDueDate` |
| `CancellationDate` | Cancellation date | `CancellationDate` |
| `CreationDate` | Creation date | `CreationDate` |

## Svar
Skilar `status`, `returned`, `totalCount`, `recordFrom`, `recordTo`, `logEntryNo`, og a `claims` array.

## nauðsynlegt setup (áður en Notaðu)
These mappings verður að exist áður en Fyrirspurn/post workflows eru used:
- A greiðsla Aðferð selected fyrir the viðskiptavinur eða process context.
- greiðsla Aðferð extension fields populated: `ORI Arion Claim Identifier` og `ORI Arion Last Claim No.` (tableextension 10036152, "Arion greiðsla Aðferð Ext").
- fyrirtæki Information "Registration No." set (used as claimant Þegar not explicitly supplied).
- staðlaða greiðsla Aðferð balancing fields (`Bal. Account Type`, `Bal. Account No.`) configured fyrir posting workflows.

## Related tables
- `Payment Method` (table 289): balancing behavior og posting target metadata.
- `Arion Payment Method Ext` (tableextension 10036152): claim identifier og claim-sequence metadata (`ORI Arion Claim Identifier`, `ORI Arion Last Claim No.` Aðeins — there er no claim reikningur Reitur on greiðsla Aðferð).
- `Arion Claim Header` (table 10036172): persisted claim key og status history.
- `Arion Payment Batch` (table 10036185) og `Arion Payment Line` (table 10036186): posting context fyrir greiðsla results.

## Usage notes
Notaðu one claimant window og one date span per Kallaðu á. Keep `claimStatus` og `claimState` explicit, keep dates ISO, og treat the returned claim Listi as bank-confirmed data fyrir downstream reconciliation eða follow-up queries.
This Endapunktur er fyrir claim discovery/status Aðeins. fyrir unpaid-invoice amount detail, Notaðu the bank's unpaid-invoice og greiðsla-slip Fyrirspurn message types Ef available fyrir this connector.
Persist `logEntryNo` fyrir traceability Þegar using results in downstream processing.

## Errors
- `'dateRef' must be one of: claimDate, dueDate, CancellationDate, CreationDate`
- `'claimStatus' must be one of: Unpaid, Paid, Cancelled, Invalid`
- `'claimState' must be one of: PrimaryCollection, SecondaryCollection, LegalCollection`
- `'dateFrom' / 'dateTo' must be ISO dates YYYY-MM-DD when supplied`

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add outbound allowlist entries based on this help text. Contact your Business Central administrator eða Origo support so they getur verify the correct outbound Endapunktur og apply the change through the normal extension/security review process.


