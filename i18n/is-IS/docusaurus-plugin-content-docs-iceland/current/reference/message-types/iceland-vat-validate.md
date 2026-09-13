---
id: iceland-vat-validate
title: "Iceland.VAT.Validate"
sidebar_label: "Iceland.VAT.Validate"
sidebar_position: 70
description: "Beiðni- og svarsamningur fyrir Iceland.VAT.Validate Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Staðfestir VAT period entries með Skatturinn (RSK). Reads amounts frá the local table og sends fyrir validation.

**Stefna:** Both
**RSK Operation:** `VilluprofaVSKSkyrslu`

## Lifecycle
```
GetInfo → [Open] → **Validate** → [Validated] → Submit → [Submitted]
```

## State Gates
| Status | Behavior |
|---|---|
| Open | Reads entry amounts → builds SOAP → calls RSK → Status = Validated |
| Validated | Skilar cached result (idempotent) |
| Submitted/Reversed | Error |

## Beiðni
```json
{ "vat": { "vskNumer": "101067", "ar": 2026, "timabil": "16" } }
```
No `lines` needed — amounts eru read frá Iceland VAT Period Entry ori table.

## Svar
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

## How Amounts Sækja til RSK
The validate step reads Allt entry lines frá the local table og builds a SOAP envelope.
Each entry includes: Tegund (entry Gerð + Heiti), Threp (level id + VAT rate),
Flokkur (category id), Heiti (Lýsing), Fjarhaed (amount).
RSK Staðfestir that turnover × rate = output tax fyrir each rate tier.

## Agent Playbook
1. Kallaðu á `Iceland.VAT.GetInfo` first (Býr til period + entry structure).
2. Run `Finance.VAT.CalcAndPostSettlement` til close VAT entries.
3. Run `Finance.VATStatement.Preview` með selection "Closed" til Sækja amounts by Box No.
4. Write amounts til Iceland VAT Period Entry ori (Reitur 15) matching boxNo = categoryId.
5. Kallaðu á this til validate. RSK checks turnover × rate = output tax consistency.
6. Ef RSK Skilar error 999 about consistency, the amounts don't add up — fix og retry.
7. eftir success, proceed til `Iceland.VAT.Submit`.

## Common RSK Errors
| Code | Message | Fix |
|------|---------|-----|
| 119 | Engin færsla er skráð | No entries have amounts — set at least one |
| 104 | Þrep hefur rangt heiti | VAT Rate Reitur not populated — force re-import með GetInfo |
| 105 | Tegund hefur rangt heiti | Entry Gerð Heiti not populated — force re-import |
| 999 | Ekki samræmi milli veltu og útskatts | turnover × rate ≠ output tax — fix amounts |


