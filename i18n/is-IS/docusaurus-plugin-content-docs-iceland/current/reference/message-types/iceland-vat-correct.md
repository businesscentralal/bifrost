---
id: iceland-vat-correct
title: "Iceland.VAT.Correct"
sidebar_label: "Iceland.VAT.Correct"
sidebar_position: 62
description: "Beiðni- og svarsamningur fyrir Iceland.VAT.Correct Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til a new revision of a submitted VAT period fyrir correction. **Local Aðeins** — no RSK Kallaðu á.
The next Submit mun auto-Notaðu `LeidrettaVSKSkyrslu` (correction operation).

**Stefna:** Local

## Lifecycle
```
Submit → [Submitted] → **Correct** → [Open] (new rev) → Validate → Submit (LeidrettaVSKSkyrslu)
                            ↓
                   old rev → [Reversed]
```

## What Correct Does
1. Staðfestir active period er Submitted.
2. Býr til new header (Rev N+1) copying fyrirtæki/period metadata.
3. Copies entry lines með VAT Rate, Entry Gerð Heiti, Category Id, Lýsing.
4. Entry amounts start at RSK Amount (the originally imported values).
5. Old revision → Reversed. New revision → Open.

## Beiðni
```json
{ "vat": { "vskNumer": "101067", "ar": 2026, "timabil": "16" } }
```

## Svar
```json
{
  "period": { "vskNumber": "101067", "year": 2026, "period": "16", "revisionNo": 2, "status": "Opin" },
  "entries": [ { "categoryId": "67", "amount": 0 }, ... ]
}
```

## Agent Playbook — Correction Verkflæði
1. Post additional færslur fyrir the period.
2. `Finance.VAT.CalcAndPostSettlement` → close the new entries.
3. `Iceland.VAT.Correct` → Býr til new revision (this Kallaðu á).
4. `Finance.VATStatement.Preview` með selection "Closed" → Sækja updated totals fyrir fulla period.
5. `set_records` on new revision entries → map updated amounts by boxNo = categoryId.
6. `Iceland.VAT.Validate` → RSK Staðfestir the corrected amounts.
7. `Iceland.VAT.Submit` → auto-detects prior submission, uses LeidrettaVSKSkyrslu.
8. `Iceland.VAT.Receipt` → Sækja updated PDF receipt.

## Errors
- Status ≠ Submitted → error (verður að submit áður en correcting).
- Period not found → Kallaðu á GetInfo first.


