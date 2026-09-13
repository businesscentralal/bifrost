---
id: iceland-payroll-reopen
title: "Iceland.Payroll.Reopen"
sidebar_label: "Iceland.Payroll.Reopen"
sidebar_position: 45
description: "Beiðni- og svarsamningur fyrir Iceland.Payroll.Reopen Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Reopens a Validated eða Submitted payroll period back til Open fyrir correction.
Clears Allt validation og submission Svar fields. Entry data og Tryggingagjald Amount eru preserved.

## Tables
| Table | Effect |
|---|---|
| Iceland PAYE Period ori | Val.* og Sub.* fields cleared, Status → Open |
| Iceland PAYE Period Entry ori | Not touched — entries preserved fyrir correction |

## Beiðni
```json
{ "year": 2026, "month": "08" }
```

## Svar
```json
{ "operation": "Reopen", "managed": true, "year": 2026, "month": 8, "status": "Open" }
```

## Correction Verkflæði
```
Reopen -> modify entries/tryggingagjald -> Validate -> Send
```
RSK treats the second Send fyrir the same period as a correction sjálfkrafa.

## State gates
| Current Status | Behavior |
|---|---|
| Validated | Clears validation fields, sets Open |
| Submitted | Clears validation + submission fields, sets Open |
| Open | Error — already Open |


