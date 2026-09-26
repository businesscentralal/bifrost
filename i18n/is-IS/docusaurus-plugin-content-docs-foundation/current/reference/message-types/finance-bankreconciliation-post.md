---
id: finance-bankreconciliation-post
title: "Finance.BankReconciliation.Post"
sidebar_label: "Finance.BankReconciliation.Post"
sidebar_position: 37
description: "Beiðni- og svarsamningur fyrir Finance.BankReconciliation.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Dæmi um beiðni
```json
{
  "subject": "<reconciliation-systemid>",
  "data": {}
}
```
Bókar the specified bank reconciliation using standard Business Central posting flow.

## Yfirlit
- Innkomandi operation. Statement Gerð = `Bank Reconciliation`.
- Resolves reconciliation úr `subject` SystemId eða request JSON keys.
- Runs codeunit `Bank Acc. Reconciliation Post`.

## Data Effects
Standard BC posting performs all of the following:
- Validates that `Statement Ending Balance` equals the bank account balance eftir the reconciliation.
- fyrir every matched `Bank Account Ledger Entry`:
  - `Open` -> `false`
  - `Statement Status` -> `Closed`
  - `Statement No.` / `Statement Line No.` remain populated fyrir audit
- Bókar G/L færslur þegar reconciliation lines have offsetting accounts.
- Deletes the `Bank Acc. Reconciliation` header og all of its `Bank Acc. Reconciliation Line` rows.
- Writes a `Posted Bank Acc. Reconciliation` history færsla.

No `Applied Payment Entry` rows eru lesa eða written. That tafla er aðeins notað með Statement Gerð = `Payment Application`.

## Request Fields
- `subject` (Guid, recommended): reconciliation SystemId.
- `data.systemId` / `data.recordSystemId` (Guid, valfrjálst): reconciliation GUID fallback fields.
- `data.bankAccountNo` + `data.statementNo` (Code[20], valfrjálst): composite-key fallback fields.

## Tókst Dæmi um svar
```json
{
  "status": "Success",
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villa Handling
- Raises AL Villa þegar reconciliation identifier getur ekki be resolved.
- Raises AL Villa þegar posting preconditions eru ekki met með standard posting logic.

Common posting preconditions:
- `Statement Ending Balance` verður að equal `Total Balance` eftir the reconciliation. Imbalance er the most common Orsök of Mistókst.
- Every reconciliation line með a non-zero `Difference` verður að have a gilt offsetting account (G/L eða bank account, depending on the line Gerð).
- The user verður að have posting heimild fyrir the bank account`s G/L account og hvaða offsetting accounts.

## AI-Oriented Usage
- nota as the final step eftir `Create` og `Match` (eða `Reset` + `Match`).
- eftir tókst post, the reconciliation header er gone -- subsequent `Match`/`Reset`/`Post` calls against the sama `reconciliationSystemId` mun fail með "fannst ekki".
- Keep `reconciliationSystemId` úr Svarið fyrir audit logs; the posted reconciliation getur be looked up via `Posted Bank Acc. Reconciliation` með `Bank Account No.` + `Statement No.`.

## Tengdar skilaboðategundir
- `Finance.BankReconciliation.Create`
- `Finance.BankReconciliation.Match`
- `Finance.BankReconciliation.Reset`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

