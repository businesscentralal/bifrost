---
id: iceland-vat-submit
title: "Iceland.VAT.Submit"
sidebar_label: "Iceland.VAT.Submit"
sidebar_position: 69
description: "Beiðni- og svarsamningur fyrir Iceland.VAT.Submit Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a validated VAT return til Skatturinn. Auto-detects first submission vs correction.

**Stefna:** Both
**RSK Operation:** `SkilaVSKSkyrslu` (first) eða `LeidrettaVSKSkyrslu` (correction)

## Lifecycle
```
GetInfo → [Open] → Validate → [Validated] → **Submit** → [Submitted]
                                                            ↓
                                                  Correct → [Open] → Validate → Submit (correction)
```

## Auto-Detection Logic
- **No prior successful submission** fyrir this VSK/Period → `SkilaVSKSkyrslu` (first submission)
- **Prior submission exists** (Submitted eða Reversed með SubmissionSucceeded) → `LeidrettaVSKSkyrslu` (correction)

## Beiðni
```json
{ "vat": { "vskNumer": "101067", "ar": 2026, "timabil": "16" } }
```
No `lines` needed — amounts eru read frá the local table.

## Svar (successful submission)
```json
{
  "period": {
    "vskNumber": "101067", "year": 2026, "period": "16", "revisionNo": 1,
    "status": "Skilað",
    "submissionSucceeded": true,
    "submissionAssessment": 223000, "submissionAmountToPay": 223000,
    "ocr": "101067162026> 4112032+ 31< 000126> 025300+",
    "claimNumber": "107440"
  }
}
```

## Svar Fields
| Reitur | Lýsing |
|-------|-------------|
| submissionSucceeded | true Ef RSK accepted |
| submissionAssessment | Net VAT amount frá RSK |
| submissionAmountToPay | Amount due til RSK |
| ocr | greiðsla reference (OCR string fyrir bank transfer) |
| claimNumber | RSK claim number (kröfunúmer) |

**PDF receipt** er stored locally but NOT in Svarið. Notaðu `Iceland.VAT.Receipt` til retrieve it.

## Agent Playbook — First Submission
1. `Iceland.VAT.GetInfo` → import RSK period structure
2. `Finance.VAT.CalcAndPostSettlement` → close VAT entries
3. `Finance.VATStatement.Preview` (selection: "Closed") → Sækja amounts by Box No.
4. `set_records` on Iceland VAT Period Entry ori → map boxNo = categoryId
5. `Iceland.VAT.Validate` → RSK Staðfestir
6. `Iceland.VAT.Submit` → RSK accepts, Skilar OCR + claim number
7. `Iceland.VAT.Receipt` → Sækja PDF receipt

## Agent Playbook — Correction
1. Post additional færslur fyrir the period.
2. `Finance.VAT.CalcAndPostSettlement` → close new entries
3. `Iceland.VAT.Correct` → Býr til new revision, old → Reversed
4. `Finance.VATStatement.Preview` (selection: "Closed") → updated totals
5. `set_records` → map updated amounts til new revision entries
6. `Iceland.VAT.Validate` → RSK Staðfestir correction
7. `Iceland.VAT.Submit` → auto-uses LeidrettaVSKSkyrslu, Skilar new claim

## Accessing Submission Data
eftir submission, read the period færsla:
```
get_records on Iceland VAT Period ori
  filter: VSK Number, Year, Period, Status=Submitted
  fields: Submission Assessment, Submission Amount to Pay, OCR, Claim Number
```

## Errors
- Status = Open → verður að validate first
- RSK 999 "Skýrsla sem á að leiðrétta fannst ekki" → using correction but no prior submission on RSK
- RSK 999 "Skýrsla hefur þegar verið skráð" → already submitted, Kallaðu á Correct first


