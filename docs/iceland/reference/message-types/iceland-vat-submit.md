---
id: iceland-vat-submit
title: "Iceland.VAT.Submit"
sidebar_label: "Iceland.VAT.Submit"
sidebar_position: 69
description: "Request and response contract for the Iceland.VAT.Submit Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a validated VAT return to Skatturinn. Auto-detects first submission vs correction.

**Direction:** Both
**RSK Operation:** `SkilaVSKSkyrslu` (first) or `LeidrettaVSKSkyrslu` (correction)

## Lifecycle
```
GetInfo → [Open] → Validate → [Validated] → **Submit** → [Submitted]
                                                            ↓
                                                  Correct → [Open] → Validate → Submit (correction)
```

## Auto-Detection Logic
- **No prior successful submission** for this VSK/Period → `SkilaVSKSkyrslu` (first submission)
- **Prior submission exists** (Submitted or Reversed with SubmissionSucceeded) → `LeidrettaVSKSkyrslu` (correction)

## Request
```json
{ "vat": { "vskNumer": "101067", "ar": 2026, "timabil": "16" } }
```
No `lines` needed — amounts are read from the local table.

## Response (successful submission)
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

## Response Fields
| Field | Description |
|-------|-------------|
| submissionSucceeded | true if RSK accepted |
| submissionAssessment | Net VAT amount from RSK |
| submissionAmountToPay | Amount due to RSK |
| ocr | Payment reference (OCR string for bank transfer) |
| claimNumber | RSK claim number (kröfunúmer) |

**PDF receipt** is stored locally but NOT in the response. Use `Iceland.VAT.Receipt` to retrieve it.

## Agent Playbook — First Submission
1. `Iceland.VAT.GetInfo` → import RSK period structure
2. `Finance.VAT.CalcAndPostSettlement` → close VAT entries
3. `Finance.VATStatement.Preview` (selection: "Closed") → get amounts by Box No.
4. `set_records` on Iceland VAT Period Entry ori → map boxNo = categoryId
5. `Iceland.VAT.Validate` → RSK validates
6. `Iceland.VAT.Submit` → RSK accepts, returns OCR + claim number
7. `Iceland.VAT.Receipt` → get PDF receipt

## Agent Playbook — Correction
1. Post additional transactions for the period.
2. `Finance.VAT.CalcAndPostSettlement` → close new entries
3. `Iceland.VAT.Correct` → creates new revision, old → Reversed
4. `Finance.VATStatement.Preview` (selection: "Closed") → updated totals
5. `set_records` → map updated amounts to new revision entries
6. `Iceland.VAT.Validate` → RSK validates correction
7. `Iceland.VAT.Submit` → auto-uses LeidrettaVSKSkyrslu, returns new claim

## Accessing Submission Data
After submission, read the period record:
```
get_records on Iceland VAT Period ori
  filter: VSK Number, Year, Period, Status=Submitted
  fields: Submission Assessment, Submission Amount to Pay, OCR, Claim Number
```

## Errors
- Status = Open → must validate first
- RSK 999 "Skýrsla sem á að leiðrétta fannst ekki" → using correction but no prior submission on RSK
- RSK 999 "Skýrsla hefur þegar verið skráð" → already submitted, call Correct first

