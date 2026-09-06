---
id: sparisjodir-claim-query
title: "Sparisjodir.Claim.Query"
sidebar_label: "Sparisjodir.Claim.Query"
sidebar_position: 147
description: "Request and response contract for the Sparisjodir.Claim.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a paged list of Sparisjóður claims matching the supplied filters.

**Direction:** Outbound  
**Content-Type:** text/json

## AI note
Use `claimDate` for the BC/JSON claim key date and `dueDate` for the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message to search claims by claimant, identifier, date span, payor, status, state, and paging window. Use `Sparisjodir.Claim.QueryOne` when you already know the full claim key.

## Request (all fields optional)
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
`recordFrom` defaults to **1** and `recordTo` defaults to **100** when omitted.

## Date filters
| `dateRef` | Filters by | Bank XML value |
|---|---|---|
| `claimDate` | Claim key date | `DueDate` |
| `dueDate` | Final due date / eindagi | `FinalDueDate` |
| `CancellationDate` | Cancellation date | `CancellationDate` |
| `CreationDate` | Creation date | `CreationDate` |

## Response
Returns `status`, `returned`, `totalCount`, `recordFrom`, `recordTo`, `logEntryNo`, and a `claims` array.

## AI setup contract (required inputs)
For reliable AI/agent execution, these mappings must exist before query/post workflows:
- Payment method selected on customer or process context.
- Payment Method extension fields: `Spar Claim Identifier`, optional legacy `Spar Claim Account`, and `Spar Last Claim No.`
- Company Information registration number (used as claimant when not explicitly supplied).
- Standard Payment Method balancing fields (`Bal. Account Type`, `Bal. Account No.`) configured for posting workflows.

## Mapping sources (existing tables)
- `Payment Method` (table 289): balancing behavior and posting target metadata.
- `Spar Payment Method Ext` (tableextension 10035891): claim identifier and claim-sequence metadata.
- `Spar Claim Header` (table 10035922): persisted claim key and status history.
- `Spar Payment Batch` (table 10035960) and `Spar Payment Line` (table 10035961): posting context for payment results.

## AI query baseline (validated example)
When querying claims for this customer, use claimant = company registration number from statement `accountOwnerId`.

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

## November 2025 observations (claimant from `accountOwnerId`)
- `claimDate` + `claimStatus=Paid` => returned 12.
- `claimDate` + `claimStatus=Unpaid` => returned 0.
- `claimDate` + `claimStatus=Cancelled` => returned 0.
- `claimDate` + `claimStatus=Invalid` returned the same paid rows in this dataset. Treat this as bank-side behavior and verify before using `Invalid` as a strict filter.
- `dueDate` and `CreationDate` in the same span returned 0 for this claimant.

## AI workflow recommendation
1. Query with `claimDate` first.
2. Run explicit status queries (`Paid`, `Unpaid`, `Cancelled`) and compare counts.
3. If `Invalid` differs from expected behavior, treat as non-authoritative and confirm via `Sparisjodir.Claim.QueryOne` on specific keys.

## Errors
- `'dateRef' must be one of: claimDate, dueDate, CancellationDate, CreationDate`
- `'claimStatus' must be one of: Unpaid, Paid, Cancelled, Invalid`
- `'claimState' must be one of: PrimaryCollection, SecondaryCollection, LegalCollection`
- `'dateFrom' / 'dateTo' must be ISO dates YYYY-MM-DD when supplied`

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Sparisjóður was blocked by the Business Central environment...`, verify permission to change `Allow HttpClient Requests` and then enable it in Extension Management.

### Check permission before changing the setting
- Verify you have permission to update table **NAV App Setting** (AppID = 0FB9B76C-D2BE-462D-B026-D490D0724164) and to manage extension settings.
- If you do not have permission, ask a BC administrator to perform the change.

### Steps to resolve
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Spar Banki** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://<bank>-iobs.heimabanki.is`.

