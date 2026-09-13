---
id: finance-bankreconciliation-match
title: "Finance.BankReconciliation.Match"
sidebar_label: "Finance.BankReconciliation.Match"
sidebar_position: 36
description: "Beiðni- og svarsamningur fyrir Finance.BankReconciliation.Match Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Dæmi um beiðni
```json
{
  "subject": "<reconciliation-systemid>",
  "data": {
    "statementLines": [10000, 20000],
    "ledgerEntries": [30000, 40000],
    "strict": true
  }
}
```
Classifies a match mode úr the two arrays og applies the match using standard BC routines fyrir Statement Gerð = `Bank Reconciliation`.

## Yfirlit
- Innkomandi operation. Statement Gerð = `Bank Reconciliation`.
- Resolves reconciliation úr `subject` SystemId eða request JSON keys.
- Mode classification: `Auto`, `0-N`, `1-1`, `1-N`, `N-1`, `N-N-Strict`, `Custom`.
- Strict validation er enforced fyrir `N-N` matching.
- Duplicate-guard: skips a pair þegar the BLE er already stamped með the sama `Statement No.` og `Statement Line No.`.

## Data Effects
fyrir every BLE matched til a statement line, the standard helpers `Match Bank Rec. Lines` og `Bank Acc. Entry Set Recon.-No.` skrifa:
- `Bank Account Ledger Entry."Statement No."` = reconciliation `Statement No.`
- `Bank Account Ledger Entry."Statement Line No."` = matched statement line númer
- `Bank Account Ledger Entry."Statement Status"` = `Bank Acc. Entry Applied`
- fyrir 1-N og N-1, additional `Bank Acc. Rec. Match Buffer` rows eru written til track multi-færsla relations

On hver matched `Bank Acc. Reconciliation Line`:
- `Applied Amount` = sum of matched BLE amounts (signed: a -1000 BLE contributes -1000)
- `Applied Entries` = count of matched BLEs
- `Difference` = `Statement Amount` - `Applied Amount`

No `Applied Payment Entry` rows eru written. That tafla er aðeins notað með Statement Gerð = `Payment Application`, which this skilaboðategund does ekki support.

## Request Fields
- `subject` (Guid, recommended): reconciliation SystemId.
- `data.systemId` / `data.recordSystemId` (Guid, valfrjálst): reconciliation GUID fallback fields.
- `data.bankAccountNo` + `data.statementNo` (Code[20], valfrjálst): composite-key fallback fields.
- `data.statementLines` (heiltala[], valfrjálst): `Bank Acc. Reconciliation Line` `Statement Line No.` values.
- `data.ledgerEntries` (heiltala[], valfrjálst): `Bank Account Ledger Entry` `Entry No.` values.
- `data.strict` (sanngildi, valfrjálst): áskilið til be `true` fyrir N-N mode.

## Tókst Dæmi um svar
```json
{
  "status": "Success",
  "mode": "N-N-Strict",
  "strict": true,
  "statementLinesCount": 2,
  "ledgerEntriesCount": 2,
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

## Mode Rules
- Empty `statementLines` + empty `ledgerEntries` -> `Auto`. Runs `Match Bank Rec. Lines.BankAccReconciliationAutoMatch(BankAccReconciliation, 0)`.
- `statementLines` empty + bók færslur present -> `0-N`.
- 1 statement line + 1 bók færsla -> `1-1`.
- 1 statement line + many bók færslur -> `1-N`. Many BLEs eru stamped against the single line.
- Many statement lines + 1 bók færsla -> `N-1`. One BLE er split across many lines via the match buffer.
- Many + many með `strict=true` og equal counts -> `N-N-Strict`. Pairs eru formed með fylki position.
- Other combinations -> `Custom`.

## Villa Handling
- Raises AL Villa þegar reconciliation identifier getur ekki be resolved.
- Raises AL Villa þegar N-N matching er requested án `strict=true`.
- Raises AL Villa þegar strict N-N arrays have different lengths.
- Raises AL Villa þegar a referenced statement line eða BLE does ekki exist fyrir the resolved reconciliation.

## AI-Oriented Usage
- Always pass `subject` = `systemId` returned með `Finance.BankReconciliation.Create`.
- nota `strict=true` aðeins þegar you intentionally send pairwise N-N Sýnir lista yfir.
- fyrir autopilot matching, send no arrays og inspect returned `mode` + counts -- Svarið does ekki list which BLEs matched. til Sjá the result, lesa `Bank Account Ledger Entry` filtered með reconciliation `Statement No.` eða lesa the lines fyrir updated `Applied Amount` / `Applied Entries`.
- Call this skilaboðategund repeatedly til add matches; fyrirliggjandi stamps eru preserved. nota `Reset` fyrsta ef you need til start over.
- `Applied Payment Entry` er the wrong tafla til inspect -- it stays empty fyrir Bank Reconciliation flow.

## Tengdar skilaboðategundir
- `Finance.BankReconciliation.Create`
- `Finance.BankReconciliation.Reset`
- `Finance.BankReconciliation.Post`

