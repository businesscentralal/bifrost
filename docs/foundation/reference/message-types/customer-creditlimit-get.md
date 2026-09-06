---
id: customer-creditlimit-get
title: "Customer.CreditLimit.Get"
sidebar_label: "Customer.CreditLimit.Get"
sidebar_position: 11
description: "Request and response contract for the Customer.CreditLimit.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns a customer credit exposure snapshot — posted balance, outstanding overdue balance, outstanding sales orders, remaining credit, tolerance, and an `isCreditLimitExceeded` decision. The active implementation is resolved from `Bifrost Setup.Customer Credit Limit Implementation`; default is `Default Credit Limit Impl` (codeunit 65330).

**Direction**: Outbound (read-only)  **Content-Type**: `text/json`

## Identifier Resolution Order

1. `subject` envelope attribute — GUID = `Customer.SystemId`, otherwise `No.`.
2. `data.customerNo` / `data.customerId` — assigned to Subject during request parsing.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `customerNo` | string | See above | Customer `No.` (Code[20]). |
| `customerId` | GUID | See above | Customer `SystemId`. |

### Request Example
```json
{ "customerNo": "10000" }
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "balanceLCY": 12500.00,
  "outstandingBalanceDueLCY": 2500.00,
  "creditLimitLCY": 20000.00,
  "outstandingAmountLCY": 4000.00,
  "remainingCredit": 3500.00,
  "tolerancePercent": 5.0,
  "remainingCreditWithTolerance": 4500.00,
  "hasOverdueBalance": true,
  "isCreditLimitExceeded": false
}
```

### Response Fields

| Field | Source |
|---|---|
| `balanceLCY` | `Customer."Balance (LCY)"` (FlowField, CalcFields). |
| `outstandingBalanceDueLCY` | `Customer."Balance Due (LCY)"`. |
| `creditLimitLCY` | `Customer."Credit Limit (LCY)"`. |
| `outstandingAmountLCY` | `Sales Line.CalcSums("Outstanding Amount (LCY)" + "Shipped Not Invoiced (LCY)")` filtered to `Document Type = Order` and `Sell-to Customer No.` = customer. |
| `remainingCredit` | `creditLimitLCY - balanceLCY - outstandingAmountLCY`. |
| `tolerancePercent` | `Bifrost Setup."Credit Limit Tolerance %"`. |
| `remainingCreditWithTolerance` | `remainingCredit + creditLimitLCY * tolerancePercent / 100`. |
| `isCreditLimitExceeded` | `creditLimitLCY > 0` AND posted+outstanding exposure exceeds `creditLimitLCY * (1 + tolerancePercent/100)`. |

A `creditLimitLCY` of `0` means "no limit configured" and `isCreditLimitExceeded` is always `false`.

## Examples (from unit tests)

From `Customer Credit Limit Tests` (`test/test/Sales/CustomerCreditLimitTests.Codeunit.al`) — covers subject by customer No. and SystemId, JSON `customerNo`/`customerId`, balance/outstanding/exceeded scenarios, and the tolerance threshold.

## Errors

| Error | Cause |
|---|---|
| `Customer {no} not found.` | No `Customer` matched the supplied `No.`. |
| `Customer with System ID {id} not found.` | No `Customer` matched the supplied `SystemId`. |

## Related Message Types

- `Customer.Statement.Pdf` — full statement PDF for the same customer.
- `Customer.SalesHistory.Get` — sales-by-item history.
- `Data.Records.Get` — raw `Customer` record.

