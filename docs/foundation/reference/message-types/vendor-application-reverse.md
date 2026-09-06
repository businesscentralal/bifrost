---
id: vendor-application-reverse
title: "Vendor.Application.Reverse"
sidebar_label: "Vendor.Application.Reverse"
sidebar_position: 143
description: "Request and response contract for the Vendor.Application.Reverse Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Unapplies a previously posted vendor ledger application using Microsoft codeunit `VendEntry-Apply Posted Entries.PostUnApplyVendor`. Reopens both the applying and applies-to entries (if they were closed by the application) and posts a reversing detailed ledger entry.

Implementation delegates to codeunit `Vend. Apply Reverse Process` via `Codeunit.Run`; any error is caught and returned via `Argument.RespondWithLastError()`.

**Direction**: Inbound  **Content-Type**: text/json

## Idempotency / Safety
**Not idempotent.** When `detailedEntryNo` is omitted, the impl resolves the last application entry via `VendEntryApplyPostedEntries.FindLastApplEntry`. Calling Reverse twice without `detailedEntryNo` will reverse two **different** applications (if any exist). Always pass `detailedEntryNo` explicitly when retrying.

## Identifier Resolution Order (Vendor Ledger Entry)
Resolved by `Argument.FindVendorLedgerEntry`:
1. `subject` as GUID → `VendorLedgerEntry.GetBySystemId`.
2. `subject` parseable as integer (`Evaluate` fmt 9) → `Get` by `Entry No.`.
3. Request JSON keys (first hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `entryNo`, `entryNumber` (integers).

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| detailedEntryNo | Integer | No (recommended) | `Entry No.` of the `Detailed Vendor Ledg. Entry` row that represents the application to reverse. Must have `Entry Type = Application`. When omitted, the impl reverses the **last** application on the vendor ledger entry. |
| postingDate | Date | **Recommended** | Posting date for the reversal. Defaults to `WorkDate()` (BC default in `PostUnApplyVendor`). Always supply explicitly — must be ≥ the vendor ledger entry's `Posting Date` and ≥ the BC work date. |
| documentNo | Text[20] | No | Document No. tagged onto the reversal. Defaults to BC behaviour (typically the original application's `Document No.`). |

## Request Example
Reverse the last application on entry 21:
```json
{ "type": "Vendor.Application.Reverse", "subject": "21" }
```

Reverse a specific application by detailed entry number:
```json
{ "type": "Vendor.Application.Reverse", "subject": "21", "data": { "detailedEntryNo": 5043, "postingDate": "2026-03-15" } }
```

## Response Shape
```json
{
  "status": "Success",
  "entryNo": 21,
  "recordSystemId": "<guid>",
  "vendorNo": "V01",
  "reversedDetailedEntryNo": 5043,
  "reversedAmount": -1500.00,
  "postingDate": "2026-03-15",
  "documentNo": "PMT-001",
  "remainingAmount": 1500.00,
  "open": true
}
```

| Property | Description |
|----------|-------------|
| entryNo | `Entry No.` of the vendor ledger entry the request was issued against. |
| reversedDetailedEntryNo | `Entry No.` of the detailed ledger application that was reversed. |
| reversedAmount | `Detailed Vendor Ledg. Entry.Amount` of the reversed application (signed). |
| remainingAmount | `Remaining Amount` on the vendor ledger entry after the reversal — typically returns to the original signed amount when the application is fully reversed. |
| open | `Open` flag on the vendor ledger entry after the reversal. |

## Posting Date Guidance

**Always supply `postingDate` explicitly.** When omitted, BC defaults to `WorkDate()`. The reversal date must be ≥ the vendor ledger entry's `Posting Date` and ≥ the BC work date.

## detailedEntryNo Guidance

When `detailedEntryNo` is omitted, the implementation reverses the **last** `Detailed Vendor Ledg. Entry` of type `Application` on the entry. Supply `detailedEntryNo` explicitly when:
- Reversing a specific older application (not the last one)
- Retrying after a failed reversal to avoid accidentally reversing a different application

To find the `detailedEntryNo`, call `Data.Records.Get` on `Detailed Vendor Ledg. Entry` with a filter like `WHERE(Vendor Ledger Entry No.=CONST(21),Entry Type=CONST(Application))`.

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors
| Error | Cause |
|-------|-------|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `No posted application found on vendor ledger entry {n} to reverse.` | `detailedEntryNo` omitted and `FindLastApplEntry` returned 0 — no application exists on the entry. |
| `Detailed vendor ledger entry {n} not found.` | Explicit `detailedEntryNo` does not exist. |
| `Detailed vendor ledger entry {n} is not an application entry.` | The detailed entry exists but its `Entry Type` is not `Application`. |
| Underlying BC error text | Any error raised by `CheckVendorLedgerEntryToUnapply` or `PostUnApplyVendor` (e.g. dimensions changed since application, posting period closed). |
| `Vendor ledger entry identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, entryNo, entryNumber).` | No vendor ledger entry resolved by `FindVendorLedgerEntry`. |

## Related Message Types
- `Vendor.Application.Post` — Post the original application.
- `Data.Records.Get` on `Vendor Ledger Entry` / `Detailed Vendor Ledg. Entry` — Inspect entry state.

