---
id: customer-application-reverse
title: "Customer.Application.Reverse"
sidebar_label: "Customer.Application.Reverse"
sidebar_position: 10
description: "Request and response contract for the Customer.Application.Reverse Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Reverses (un-applies) a posted customer ledger entry application by unapplying a specific `Detailed Cust. Ledg. Entry` row of type `Application`. Runs inside isolated process codeunit 65561 (`Cust. Apply Reverse Process`).

**Direction**: Inbound (state change)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- Not idempotent: each call performs another reversal posting. Re-running after a successful unapply on the same `detailedEntryNo` will fail because the row no longer exists.
- When `detailedEntryNo` is omitted, the **last** application detailed entry for the customer ledger entry (`CustEntryApply.FindLastApplEntry`) is selected. Supply `detailedEntryNo` explicitly when reversing a specific older application.

## Customer Ledger Entry Identifier Resolution Order

Via `FindCustLedgerEntry` (same as `Customer.Application.Post`).

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| Cust. ledger entry keys | — | Yes (Subject or JSON) | See resolution order. |
| `detailedEntryNo` | integer | No | `Detailed Cust. Ledg. Entry."Entry No."` of the application row to reverse. Default: latest application entry. |
| `postingDate` | date | **Recommended** | Format 9. Reversal posting date. Always supply explicitly — when omitted BC defaults to `WorkDate()`. Must be ≥ the customer ledger entry's `Posting Date`. |
| `documentNo` | string | No | Reversal document number. |

### Request Example
```json
{
  "entryNo": 5001,
  "detailedEntryNo": 9123,
  "postingDate": "2026-02-01"
}
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "entryNo": 5001,
  "recordSystemId": "...",
  "customerNo": "10000",
  "reversedDetailedEntryNo": 9123,
  "reversedAmount": 2500.00,
  "postingDate": "2026-02-01",
  "documentNo": "REV-005",
  "remainingAmount": -2500.00,
  "open": true
}
```

### Failure
```json
{ "status": "Error", "error": "...", "callstack": "..." }
```

### Response Fields

| Field | Source |
|---|---|
| `reversedDetailedEntryNo` | The actual `Detailed Cust. Ledg. Entry` row that was unapplied (resolved value when `detailedEntryNo` was omitted). |
| `reversedAmount` | `Detailed Cust. Ledg. Entry."Amount"` of the reversed row. |
| `remainingAmount` / `open` | Re-read from the customer ledger entry after the reversal. |

## Posting Date Guidance

**Always supply `postingDate` explicitly.** When omitted, BC defaults to `WorkDate()` which may be different from the original application date. The reversal date must be ≥ the customer ledger entry's `Posting Date` and ≥ the BC work date.

## detailedEntryNo Guidance

When `detailedEntryNo` is omitted, the implementation reverses the **last** `Detailed Cust. Ledg. Entry` of type `Application` on the entry. This is convenient for reversing the most recent application, but supply `detailedEntryNo` explicitly when:
- Reversing a specific older application (not the last one)
- Retrying after a failed reversal to avoid accidentally reversing a different application

To find the `detailedEntryNo`, call `Data.Records.Get` on `Detailed Cust. Ledg. Entry` with a filter like `WHERE(Cust. Ledger Entry No.=CONST(5001),Entry Type=CONST(Application))`.

## Examples (from unit tests)

From `Cust. Application Tests` (`test/test/Sales/CustApplicationTests.Codeunit.al`) — covers reversal with and without `detailedEntryNo`, the no-application-found error, the wrong-detailed-entry-type error, and the no-application-found error.

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Errors

| Error | Cause |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks the `BIFROST GL Post ori` permission set. |
| `Customer ledger entry identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, entryNo, entryNumber).` | Customer ledger entry could not be resolved. |
| `No posted application found on customer ledger entry {entryNo} to reverse.` | `detailedEntryNo` omitted and `FindLastApplEntry` returned nothing. |
| `Detailed customer ledger entry {detailedEntryNo} not found.` | Supplied `detailedEntryNo` did not exist. |
| `Detailed customer ledger entry {detailedEntryNo} is not an application entry.` | The row exists but its `Entry Type` is not `Application`. |
| BC unapply errors | Bubble up from `CustEntryApplyPostedEntries.PostUnApplyCustomer`. |

## Related Message Types

- `Customer.Application.Post` — the operation this reverses.
- `Customer.CreditLimit.Get` — see exposure after the reversal.

