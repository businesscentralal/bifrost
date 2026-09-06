---
id: arionbanki-claim-query
title: "Arionbanki.Claim.Query"
sidebar_label: "Arionbanki.Claim.Query"
sidebar_position: 11
description: "Request and response contract for the Arionbanki.Claim.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a paged list of Arion banki claims matching the supplied filters.

**Direction:** Outbound  
**Content-Type:** text/json

## Note
`claimDate` is the BC/JSON claim key date and `dueDate` is the final due date. The bank SOAP/XML API uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message to search claims by claimant, identifier, date span, payor, status, state, and paging window. Use `Arionbanki.Claim.QueryOne` when you already know the full claim key.

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

## Required setup (before use)
These mappings must exist before query/post workflows are used:
- A Payment Method selected for the customer or process context.
- Payment Method extension fields populated: `ORI Arion Claim Identifier` and `ORI Arion Last Claim No.` (tableextension 10036152, "Arion Payment Method Ext").
- Company Information "Registration No." set (used as claimant when not explicitly supplied).
- Standard Payment Method balancing fields (`Bal. Account Type`, `Bal. Account No.`) configured for posting workflows.

## Related tables
- `Payment Method` (table 289): balancing behavior and posting target metadata.
- `Arion Payment Method Ext` (tableextension 10036152): claim identifier and claim-sequence metadata (`ORI Arion Claim Identifier`, `ORI Arion Last Claim No.` only — there is no claim account field on Payment Method).
- `Arion Claim Header` (table 10036172): persisted claim key and status history.
- `Arion Payment Batch` (table 10036185) and `Arion Payment Line` (table 10036186): posting context for payment results.

## Usage notes
Use one claimant window and one date span per call. Keep `claimStatus` and `claimState` explicit, keep dates ISO, and treat the returned claim list as bank-confirmed data for downstream reconciliation or follow-up queries.
This endpoint is for claim discovery/status only. For unpaid-invoice amount detail, use the bank's unpaid-invoice and payment-slip query message types if available for this connector.
Persist `logEntryNo` for traceability when using results in downstream processing.

## Errors
- `'dateRef' must be one of: claimDate, dueDate, CancellationDate, CreationDate`
- `'claimStatus' must be one of: Unpaid, Paid, Cancelled, Invalid`
- `'claimState' must be one of: PrimaryCollection, SecondaryCollection, LegalCollection`
- `'dateFrom' / 'dateTo' must be ISO dates YYYY-MM-DD when supplied`

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

