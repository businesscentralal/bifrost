---
id: sparisjodir-claim-query
title: "Sparisjodir.Claim.Query"
sidebar_label: "Sparisjodir.Claim.Query"
sidebar_position: 147
description: "Beiðni- og svarsamningur fyrir Sparisjodir.Claim.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a paged Listi of Sparisjóður claims matching the supplied filters.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## AI note
Notaðu `claimDate` fyrir the BC/JSON claim key date og `dueDate` fyrir the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message til search claims by claimant, identifier, date span, payor, status, state, og paging window. Notaðu `Sparisjodir.Claim.QueryOne` Þegar you already know the fulla claim key.

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

## AI setup contract (nauðsynlegt inputs)
fyrir reliable AI/agent execution, these mappings verður að exist áður en Fyrirspurn/post workflows:
- greiðsla Aðferð selected on viðskiptavinur eða process context.
- greiðsla Aðferð extension fields: `Spar Claim Identifier`, valfrjálst legacy `Spar Claim Account`, og `Spar Last Claim No.`
- fyrirtæki Information registration number (used as claimant Þegar not explicitly supplied).
- staðlaða greiðsla Aðferð balancing fields (`Bal. Account Type`, `Bal. Account No.`) configured fyrir posting workflows.

## Mapping sources (existing tables)
- `Payment Method` (table 289): balancing behavior og posting target metadata.
- `Spar Payment Method Ext` (tableextension 10035891): claim identifier og claim-sequence metadata.
- `Spar Claim Header` (table 10035922): persisted claim key og status history.
- `Spar Payment Batch` (table 10035960) og `Spar Payment Line` (table 10035961): posting context fyrir greiðsla results.

## AI Fyrirspurn baseline (validated Dæmi)
Þegar querying claims fyrir this viðskiptavinur, Notaðu claimant = fyrirtæki registration number frá statement `accountOwnerId`.

```json
{
  "claimant": "<company-registration-no>",
  "dateRef": "claimDate",
  "dateFrom": "2025-11-01",
  "dateTo": "2025-11-30",
  "recordFrom": 1,
  "recordTo": 200
}
```

## November 2025 observations (claimant frá `accountOwnerId`)
- `claimDate` + `claimStatus=Paid` => returned 12.
- `claimDate` + `claimStatus=Unpaid` => returned 0.
- `claimDate` + `claimStatus=Cancelled` => returned 0.
- `claimDate` + `claimStatus=Invalid` returned the same paid rows in this dataset. Treat this as bank-side behavior og verify áður en using `Invalid` as a strict filter.
- `dueDate` og `CreationDate` in the same span returned 0 fyrir this claimant.

## AI Verkflæði recommendation
1. Fyrirspurn með `claimDate` first.
2. Run explicit status queries (`Paid`, `Unpaid`, `Cancelled`) og compare counts.
3. Ef `Invalid` differs frá expected behavior, treat as non-authoritative og confirm via `Sparisjodir.Claim.QueryOne` on specific keys.

## Errors
- `'dateRef' must be one of: claimDate, dueDate, CancellationDate, CreationDate`
- `'claimStatus' must be one of: Unpaid, Paid, Cancelled, Invalid`
- `'claimState' must be one of: PrimaryCollection, SecondaryCollection, LegalCollection`
- `'dateFrom' / 'dateTo' must be ISO dates YYYY-MM-DD when supplied`

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


