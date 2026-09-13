---
id: customer-application-reverse
title: "Customer.Application.Reverse"
sidebar_label: "Customer.Application.Reverse"
sidebar_position: 10
description: "Beiðni- og svarsamningur fyrir Customer.Application.Reverse Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Reverses (un-applies) a posted viðskiptamanni bók færsla jöfnun með unapplying a specific `Detailed Cust. Ledg. Entry` row of Gerð `Application`. Runs inside isolated process codeunit 65561 (`Cust. Apply Reverse Process`).

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: hver call performs another reversal posting. Re-running eftir a tókst unapply on the sama `detailedEntryNo` mun fail because the row no longer exists.
- þegar `detailedEntryNo` er omitted, the **síðasta** jöfnun detailed færsla fyrir the viðskiptamanni bók færsla (`CustEntryApply.FindLastApplEntry`) er selected. Supply `detailedEntryNo` skýrt þegar reversing a specific older jöfnun.

## viðskiptamanni bók færsla Forgangsröð auðkenna

Via `FindCustLedgerEntry` (sama as `Customer.Application.Post`).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| Cust. bók færsla keys | — | Yes (Subject eða JSON) | Sjá Forgangsröð úrlausnar. |
| `detailedEntryNo` | heiltala | No | `Detailed Cust. Ledg. Entry."Entry No."` of the jöfnun row til reverse. Sjálfgefið: latest jöfnun færsla. |
| `postingDate` | dagsetning | **Recommended** | Format 9. Reversal posting dagsetning. Gefðu alltaf upp skýrt — Ef það er ekki gefið upp BC defaults til `WorkDate()`. verður að be ≥ the viðskiptamanni bók færsla's `Posting Date`. |
| `documentNo` | strengur | No | Reversal skjal númer. |

### Dæmi um beiðni
```json
{
  "entryNo": 5001,
  "detailedEntryNo": 9123,
  "postingDate": "2026-02-01"
}
```

## Uppbygging svars

### Tókst
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

### Mistókst
```json
{ "status": "Error", "error": "...", "callstack": "..." }
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `reversedDetailedEntryNo` | The actual `Detailed Cust. Ledg. Entry` row that was unapplied (resolved Gildi þegar `detailedEntryNo` was omitted). |
| `reversedAmount` | `Detailed Cust. Ledg. Entry."Amount"` of the reversed row. |
| `remainingAmount` / `open` | Re-lesa úr the viðskiptamanni bók færsla eftir the reversal. |

## Posting dagsetning Guidance

**Gefðu alltaf upp `postingDate` skýrt.** Ef það er ekki gefið upp, BC defaults til `WorkDate()` which may be different úr the original jöfnun dagsetning. The reversal dagsetning verður að be ≥ the viðskiptamanni bók færsla's `Posting Date` og ≥ the BC work dagsetning.

## detailedEntryNo Guidance

þegar `detailedEntryNo` er omitted, the implementation reverses the **síðasta** `Detailed Cust. Ledg. Entry` of Gerð `Application` on the færsla. This er convenient fyrir reversing the most recent jöfnun, but supply `detailedEntryNo` skýrt þegar:
- Reversing a specific older jöfnun (ekki the síðasta one)
- Retrying eftir a mistókst reversal til avoid accidentally reversing a different jöfnun

til find the `detailedEntryNo`, call `Data.Records.Get` on `Detailed Cust. Ledg. Entry` með a filter like `WHERE(Cust. Ledger Entry No.=CONST(5001),Entry Type=CONST(Application))`.

## Dæmi (úr einingaprófum)

úr `Cust. Application Tests` (`test/test/Sales/CustApplicationTests.Codeunit.al`) — covers reversal með og án `detailedEntryNo`, the no-jöfnun-fannst Villa, the wrong-detailed-færsla-Gerð Villa, og the no-jöfnun-fannst Villa.

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `Customer ledger entry identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, entryNo, entryNumber).` | viðskiptamanni bók færsla could ekki be resolved. |
| `No posted application found on customer ledger entry {entryNo} to reverse.` | `detailedEntryNo` omitted og `FindLastApplEntry` returned nothing. |
| `Detailed customer ledger entry {detailedEntryNo} not found.` | Supplied `detailedEntryNo` did ekki exist. |
| `Detailed customer ledger entry {detailedEntryNo} is not an application entry.` | The row exists but its `Entry Type` er ekki `Application`. |
| BC unapply Villur | Bubble up úr `CustEntryApplyPostedEntries.PostUnApplyCustomer`. |

## Tengdar skilaboðategundir

- `Customer.Application.Post` — the operation this reverses.
- `Customer.CreditLimit.Get` — Sjá exposure eftir the reversal.

