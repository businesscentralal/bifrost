---
id: customer-application-post
title: "Customer.Application.Post"
sidebar_label: "Customer.Application.Post"
sidebar_position: 9
description: "Request and response contract for the Customer.Application.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Posts a customer ledger entry application — pairs an *applying* entry (a Payment, Refund or Credit Memo, typically) against one or more *target* invoices/charges. Runs `Cust. Entry-Apply Posted Entries` inside isolated process codeunit 65558 (`Cust. Apply Post Process`), so any failure rolls back the whole application.

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- Not idempotent: each call posts a new application — re-running on the same entries posts another application (subject to BC rules and the resulting `Remaining Amount`).
- Closed entries cannot participate — both the applying entry and each target are validated to have `Open = true` before applying.
- All targets must belong to the **same customer** as the applying entry.
- Application is posted under an `ApplyId = 'BIF-' + Format(EntryNo) + '-' + UserId()` so the resulting `Detailed Cust. Ledg. Entry` rows can be traced back to the call.

## Applying-Entry Identifier Resolution Order

Via `FindCustLedgerEntry` — Subject first, then JSON:
1. `subject` — GUID = `Cust. Ledger Entry.SystemId`, otherwise interpreted as the integer `Entry No.`.
2. JSON `systemId` / `recordSystemId` / `id` — `Cust. Ledger Entry.SystemId`.
3. JSON `entryNo` / `entryNumber` — integer `Entry No.`.

## Target Entry Format (`appliesToEntries`)

Required, non-empty JSON array. Each element may be:
- A **scalar** — number (`Entry No.`) or string (numeric `Entry No.` or GUID `SystemId`).
- An **object** with one of: `entryNo` / `entryNumber` (integer) or `systemId` / `recordSystemId` / `id` (GUID).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| Applying entry keys | — | Yes (Subject or JSON) | See resolution order. |
| `appliesToEntries` | array | **Yes** | One or more target entries. Format above. |
| `postingDate` | date | No | Format 9. Default: applying entry's `Posting Date`. |
| `documentNo` | string | No | Default: applying entry's `Document No.`. |
| `amountToApply` | decimal | No | Override `Amount to Apply` on the applying entry. |

### Request Example
```json
{
  "entryNo": 5001,
  "appliesToEntries": [
    { "entryNo": 4900 },
    { "systemId": "11111111-2222-3333-4444-555555555555" }
  ],
  "postingDate": "2026-01-15"
}
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "applyingEntryNo": 5001,
  "applyingRecordSystemId": "...",
  "customerNo": "10000",
  "documentNo": "PAY-005",
  "postingDate": "2026-01-15",
  "amountToApply": -2500.00,
  "totalApplied": 2500.00,
  "remainingAmount": 0.00,
  "open": false,
  "applications": [
    {
      "entryNo": 4900,
      "recordSystemId": "...",
      "documentType": "Invoice",
      "documentNo": "PS-INV103001",
      "amountApplied": 2500.00
    }
  ]
}
```

### Failure
```json
{ "status": "Error", "error": "...", "callstack": "..." }
```

### Response Fields

| Field | Source |
|---|---|
| `remainingAmount` / `open` | Re-read from the applying entry after posting. |
| `applications[]` | One entry per target. `amountApplied` comes from the matched `Detailed Cust. Ledg. Entry` rows created under the `ApplyId`. |

## Posting Date Constraint

**Always supply `postingDate` explicitly.** When omitted, BC defaults to `WorkDate()` — which may differ from the applying entry's posting date and cause unexpected errors.

The posting date must satisfy all three conditions:
1. ≥ the applying entry's `Posting Date`
2. ≥ every applies-to entry's `Posting Date` (cannot apply a payment against a future-dated invoice)
3. ≥ the BC company `Work Date` (BC enforces this internally)

If any condition fails, BC returns: *"The entered posting date may not be before the posting date of the customer ledger entry."*

**Best practice:** pass today's date or a date that is later than all involved entries.

## Payment Discount Behaviour

When an invoice has an active payment discount (`Pmt. Discount Date` not yet expired), BC absorbs the discount automatically:
- `totalApplied` will be **less** than the invoice amount (reduced by the discount)
- `remainingAmount` on the applying entry reflects the unabsorbed discount portion (the entry stays `open: true` with a small residual)
- The invoice closes fully despite the reduced payment amount

To prevent discount absorption, set `postingDate` after the `Pmt. Discount Date` on the invoice.

## Examples (from unit tests)

From `Cust. Application Tests` (`test/test/Sales/CustApplicationTests.Codeunit.al`) — covers single and multi-target application, scalar vs object entry references, override of `postingDate`/`documentNo`/`amountToApply`, closed-entry rejections, and cross-customer rejections.

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Customer ledger entry identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, entryNo, entryNumber).` | Applying entry could not be resolved. |
| `Request JSON must include 'appliesToEntries' as a non-empty array.` | `appliesToEntries` missing, not an array, or empty. |
| `Applying customer ledger entry {entryNo} is closed and cannot be applied.` | Applying entry `Open = false`. |
| `Target customer ledger entry {entryNo} not found.` | One of `appliesToEntries` did not match a `Cust. Ledger Entry`. |
| `Target entry {entryNo} belongs to customer {targetCustomerNo}; expected customer {applyingCustomerNo}.` | Cross-customer application rejected. |
| `Target customer ledger entry {entryNo} is closed and cannot be applied.` | Target entry `Open = false`. |
| `Failed to post application for entry {entryNo}.` | `Cust. Entry-Apply Posted Entries` returned false / rolled back. |

## Related Message Types

- `Customer.Application.Reverse` — reverse a previously posted application.
- `Customer.CreditLimit.Get` — see how the application affects exposure.
- `Sales.Document.Post` — produces the invoices/credit memos that get applied here.

