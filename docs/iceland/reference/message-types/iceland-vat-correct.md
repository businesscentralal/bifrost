---
id: iceland-vat-correct
title: "Iceland.VAT.Correct"
sidebar_label: "Iceland.VAT.Correct"
sidebar_position: 62
description: "Request and response contract for the Iceland.VAT.Correct Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a new revision of a submitted VAT period for correction. **Local only** — no RSK call.
The next Submit will auto-use `LeidrettaVSKSkyrslu` (correction operation).

**Direction:** Local

## Lifecycle
```
Submit → [Submitted] → **Correct** → [Open] (new rev) → Validate → Submit (LeidrettaVSKSkyrslu)
                            ↓
                   old rev → [Reversed]
```

## What Correct Does
1. Validates active period is Submitted.
2. Creates new header (Rev N+1) copying company/period metadata.
3. Copies entry lines with VAT Rate, Entry Type Name, Category Id, Description.
4. Entry amounts start at RSK Amount (the originally imported values).
5. Old revision → Reversed. New revision → Open.

## Request
```json
{ "vat": { "vskNumer": "101067", "ar": 2026, "timabil": "16" } }
```

## Response
```json
{
  "period": { "vskNumber": "101067", "year": 2026, "period": "16", "revisionNo": 2, "status": "Opin" },
  "entries": [ { "categoryId": "67", "amount": 0 }, ... ]
}
```

## Agent Playbook — Correction Workflow
1. Post additional transactions for the period.
2. `Finance.VAT.CalcAndPostSettlement` → close the new entries.
3. `Iceland.VAT.Correct` → creates new revision (this call).
4. `Finance.VATStatement.Preview` with selection "Closed" → get updated totals for full period.
5. `set_records` on new revision entries → map updated amounts by boxNo = categoryId.
6. `Iceland.VAT.Validate` → RSK validates the corrected amounts.
7. `Iceland.VAT.Submit` → auto-detects prior submission, uses LeidrettaVSKSkyrslu.
8. `Iceland.VAT.Receipt` → get updated PDF receipt.

## Errors
- Status ≠ Submitted → error (must submit before correcting).
- Period not found → call GetInfo first.

