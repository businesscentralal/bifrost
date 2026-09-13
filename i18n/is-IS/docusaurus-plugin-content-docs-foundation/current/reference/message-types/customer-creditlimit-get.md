---
id: customer-creditlimit-get
title: "Customer.CreditLimit.Get"
sidebar_label: "Customer.CreditLimit.Get"
sidebar_position: 11
description: "Beiðni- og svarsamningur fyrir Customer.CreditLimit.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar a viðskiptamanni credit exposure snapshot — posted balance, outstanding overdue balance, outstanding sales orders, remaining credit, tolerance, og an `isCreditLimitExceeded` decision. The virkt implementation er resolved úr `Bifrost Setup.Customer Credit Limit Implementation`; Sjálfgefið er `Default Credit Limit Impl` (codeunit 65330).

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `text/json`

## Forgangsröð auðkenna

1. `subject` envelope attribute — GUID = `Customer.SystemId`, otherwise `No.`.
2. `data.customerNo` / `data.customerId` — assigned til Subject during request parsing.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `customerNo` | strengur | Sjá above | viðskiptamanni `No.` (Code[20]). |
| `customerId` | GUID | Sjá above | viðskiptamanni `SystemId`. |

### Dæmi um beiðni
```json
{ "customerNo": "10000" }
```

## Uppbygging svars

### Tókst
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

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `balanceLCY` | `Customer."Balance (LCY)"` (FlowField, CalcFields). |
| `outstandingBalanceDueLCY` | `Customer."Balance Due (LCY)"`. |
| `creditLimitLCY` | `Customer."Credit Limit (LCY)"`. |
| `outstandingAmountLCY` | `Sales Line.CalcSums("Outstanding Amount (LCY)" + "Shipped Not Invoiced (LCY)")` filtered til `Document Type = Order` og `Sell-to Customer No.` = viðskiptamanni. |
| `remainingCredit` | `creditLimitLCY - balanceLCY - outstandingAmountLCY`. |
| `tolerancePercent` | `Bifrost Setup."Credit Limit Tolerance %"`. |
| `remainingCreditWithTolerance` | `remainingCredit + creditLimitLCY * tolerancePercent / 100`. |
| `isCreditLimitExceeded` | `creditLimitLCY > 0` og posted+outstanding exposure exceeds `creditLimitLCY * (1 + tolerancePercent/100)`. |

A `creditLimitLCY` of `0` means "no limit configured" og `isCreditLimitExceeded` er always `false`.

## Dæmi (úr einingaprófum)

úr `Customer Credit Limit Tests` (`test/test/Sales/CustomerCreditLimitTests.Codeunit.al`) — covers subject með viðskiptamanni No. og SystemId, JSON `customerNo`/`customerId`, balance/outstanding/exceeded scenarios, og the tolerance threshold.

## Villur

| Villa | Orsök |
|---|---|
| `Customer {no} not found.` | No `Customer` matched the supplied `No.`. |
| `Customer with System ID {id} not found.` | No `Customer` matched the supplied `SystemId`. |

## Tengdar skilaboðategundir

- `Customer.Statement.Pdf` — full statement PDF fyrir the sama viðskiptamanni.
- `Customer.SalesHistory.Get` — sales-með-vöru history.
- `Data.Records.Get` — raw `Customer` færsla.

