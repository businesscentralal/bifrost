---
id: iceland-vat-validate
title: "Iceland.VAT.Validate"
sidebar_label: "Iceland.VAT.Validate"
sidebar_position: 70
description: "Request and response contract for the Iceland.VAT.Validate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Validates VAT period entries with Skatturinn (RSK). Reads amounts from the local table and sends for validation.

**Direction:** Both
**RSK Operation:** `VilluprofaVSKSkyrslu`

## Lifecycle
```
GetInfo → [Open] → **Validate** → [Validated] → Submit → [Submitted]
```

## State Gates
| Status | Behavior |
|---|---|
| Open | Reads entry amounts → builds SOAP → calls RSK → Status = Validated |
| Validated | Returns cached result (idempotent) |
| Submitted/Reversed | Error |

## Request
```json
{ "vat": { "vskNumer": "101067", "ar": 2026, "timabil": "16" } }
```
No `lines` needed — amounts are read from Iceland VAT Period Entry ori table.

## Response
```json
{
  "period": {
    "vskNumber": "101067", "year": 2026, "period": "16", "revisionNo": 1,
    "status": "Villupróf keyrð",
    "assessmentAmount": 223000, "penaltyAmount": 0, "amountToPay": 223000
  },
  "entries": [ { "categoryId": "67", "amount": 1000000 }, ... ]
}
```
`assessmentAmount` = total útskattur - innskattur (net VAT payable).

## How Amounts Get to RSK
The validate step reads ALL entry lines from the local table and builds a SOAP envelope.
Each entry includes: Tegund (entry type + name), Threp (level id + VAT rate),
Flokkur (category id), Heiti (description), Fjarhaed (amount).
RSK validates that turnover × rate = output tax for each rate tier.

## Agent Playbook
1. Call `Iceland.VAT.GetInfo` first (creates period + entry structure).
2. Run `Finance.VAT.CalcAndPostSettlement` to close VAT entries.
3. Run `Finance.VATStatement.Preview` with selection "Closed" to get amounts by Box No.
4. Write amounts to Iceland VAT Period Entry ori (field 15) matching boxNo = categoryId.
5. Call this to validate. RSK checks turnover × rate = output tax consistency.
6. If RSK returns error 999 about consistency, the amounts don't add up — fix and retry.
7. After success, proceed to `Iceland.VAT.Submit`.

## Common RSK Errors
| Code | Message | Fix |
|------|---------|-----|
| 119 | Engin færsla er skráð | No entries have amounts — set at least one |
| 104 | Þrep hefur rangt heiti | VAT Rate field not populated — force re-import with GetInfo |
| 105 | Tegund hefur rangt heiti | Entry Type Name not populated — force re-import |
| 999 | Ekki samræmi milli veltu og útskatts | turnover × rate ≠ output tax — fix amounts |

