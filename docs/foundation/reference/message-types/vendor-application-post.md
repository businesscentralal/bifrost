---
id: vendor-application-post
title: "Vendor.Application.Post"
sidebar_label: "Vendor.Application.Post"
sidebar_position: 142
description: "Request and response contract for the Vendor.Application.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Applies an open `Vendor Ledger Entry` (the *applying* entry, identified via subject/request JSON) against one or more open vendor ledger entries (the *applies-to* entries) using Microsoft codeunit `VendEntry-Apply Posted Entries`. Persists the application immediately — no preview.

Implementation delegates to codeunit `Vend. Apply Post Process` via `Codeunit.Run`; any error is caught and returned via `Argument.RespondWithLastError()`.

**Direction**: Inbound  **Content-Type**: text/json

## Idempotency / Safety
Not idempotent. A second call replaying the same request will either re-apply an entry that is still open (creating duplicate applications) or fail with `Applying vendor ledger entry {n} is closed and cannot be applied.` if the prior application closed the applying entry. Use `Vendor.Application.Reverse` to undo.

Each application is tagged with `Apply Unapply Parameters."Apply ID" = 'BIF-' + <applyingEntryNo> + '-' + UserId()` for traceability.

## Identifier Resolution Order (Applying Entry)
Resolved by `Argument.FindVendorLedgerEntry`:
1. `subject` as GUID → `VendorLedgerEntry.GetBySystemId`.
2. `subject` parseable as integer (`Evaluate` fmt 9) → `Get` by `Entry No.`.
3. Request JSON keys (every key supplied is tried; identifiers that point to different records are refused): `systemId`, `recordSystemId`, `id` (all GUID); `entryNo`, `entryNumber` (integers).

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| appliesToEntries | Array | Yes | Non-empty array of *applies-to* vendor ledger entries. Each element may be: an integer Entry No.; a GUID; a string GUID; or an object with `entryNo` / `systemId` / `recordSystemId` / `id`. |
| postingDate | Date | No | Application posting date. Defaults to the applying entry's `Posting Date`. |
| documentNo | Text[20] | No | Document No. tagged onto the application. Defaults to the applying entry's `Document No.`. |
| amountToApply | Decimal | No | Amount to apply on the applying entry. Defaults to the applying entry's `Remaining Amount`. |

All applies-to entries must belong to the same vendor as the applying entry. The full applied amount on the applying entry side equals `amountToApply`; the sum across applying and applies-to sides must be zero for a full apply (sign convention: Invoice / Refund negative, Payment / Credit Memo positive).

## Request Example
Pay invoice 4001 (Entry 12) with payment Entry 21:
```json
{ "type": "Vendor.Application.Post", "subject": "21", "data": { "appliesToEntries": [ 12 ] } }
```

Pay multiple invoices with a single payment and an explicit posting date:
```json
{
  "type": "Vendor.Application.Post",
  "subject": "21",
  "data": { "appliesToEntries": [ { "entryNo": 12 }, { "entryNo": 14 } ], "postingDate": "2026-03-15" }
}
```

## Response Shape
```json
{
  "status": "Success",
  "applyingEntryNo": 21,
  "applyingRecordSystemId": "<guid>",
  "vendorNo": "V01",
  "documentNo": "PMT-001",
  "postingDate": "2026-03-15",
  "amountToApply": 1500.00,
  "totalApplied": 1500.00,
  "remainingAmount": 0,
  "open": false,
  "applications": [
    { "entryNo": 12, "recordSystemId": "<guid>", "documentType": "Invoice", "documentNo": "INV-001", "amountApplied": 1000.00 },
    { "entryNo": 14, "recordSystemId": "<guid>", "documentType": "Invoice", "documentNo": "INV-002", "amountApplied": 500.00 }
  ]
}
```

Partial apply of 1000 against a larger open invoice (invoice Remaining Amount -170275 → -169275):
```json
{
  "amountToApply": 1000.00,
  "totalApplied": 1000.00,
  "remainingAmount": 0,
  "open": false,
  "applications": [
    { "entryNo": 1578, "documentType": "Invoice", "amountApplied": 1000.00 }
  ]
}
```

| Property | Description |
|----------|-------------|
| applyingEntryNo | `Entry No.` of the applying ledger entry. |
| amountToApply | The applying-side amount as written. |
| totalApplied | `amountToApply` minus the applying entry's Remaining Amount after posting. Equals the sum of `applications[].amountApplied`. |
| remainingAmount | `Remaining Amount` on the applying entry after the application is posted. |
| open | `Open` flag on the applying entry after the call. |
| applications[].amountApplied | Target entry Remaining Amount **after** posting minus Remaining Amount **before** posting (FlowField via `CalcFields`). Formatted with `Format(..., 0, 9)`. Vendor invoice partial apply of 1000 → `amountApplied = 1000`. |

## Posting Date Constraint

**Always supply `postingDate` explicitly.** When omitted, BC defaults to the applying entry's `Posting Date` — but if that date is before the BC company `Work Date`, or before any applies-to entry's `Posting Date`, BC will reject the application.

The posting date must satisfy all three conditions:
1. ≥ the applying entry's `Posting Date`
2. ≥ every applies-to entry's `Posting Date` (cannot apply a payment against a future-dated invoice)
3. ≥ the BC company `Work Date`

If any condition fails, BC returns: *"Innfærð bókunardagsetning má ekki vera á undan bókunardagsetningunni á lánardrottinsfærslu"* ("The entered posting date may not be before the posting date of the vendor ledger entry.")

**Best practice:** pass today's date or a date that is clearly later than all involved entries and the BC work date.

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors
| Error | Cause |
|-------|-------|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Request JSON must include 'appliesToEntries' as a non-empty array.` | `appliesToEntries` missing, not an array, or empty. |
| `Applying vendor ledger entry {n} is closed and cannot be applied.` | Applying entry is already closed (`Open = false`). |
| `Target vendor ledger entry {n} not found.` | Applies-to entry resolution returned no record. |
| `Target entry {n} belongs to vendor {a}; expected vendor {b}.` | Applies-to entry belongs to a different vendor than the applying entry. |
| `Target vendor ledger entry {n} is closed and cannot be applied.` | Applies-to entry is already closed. |
| `Failed to post application for entry {n}.` | `VendEntry-Apply Posted Entries` raised an error during post. The underlying BC error text is also included via `RespondWithLastError()`. |
| `Vendor Ledger Entry identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, entryNo, entryNumber.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Vendor Ledger Entry "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |

## Related Message Types
- `Vendor.Application.Reverse` — Unapply a posted application.
- `Data.Records.Get` on `Vendor Ledger Entry` / `Detailed Vendor Ledg. Entry` — Inspect entry state.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

