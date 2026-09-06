---
id: iceland-payroll-reopen
title: "Iceland.Payroll.Reopen"
sidebar_label: "Iceland.Payroll.Reopen"
sidebar_position: 45
description: "Request and response contract for the Iceland.Payroll.Reopen Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Reopens a Validated or Submitted payroll period back to Open for correction.
Clears all validation and submission response fields. Entry data and Tryggingagjald Amount are preserved.

## Tables
| Table | Effect |
|---|---|
| Iceland PAYE Period ori | Val.* and Sub.* fields cleared, Status → Open |
| Iceland PAYE Period Entry ori | Not touched — entries preserved for correction |

## Request
```json
{ "year": 2026, "month": "08" }
```

## Response
```json
{ "operation": "Reopen", "managed": true, "year": 2026, "month": 8, "status": "Open" }
```

## Correction Workflow
```
Reopen -> modify entries/tryggingagjald -> Validate -> Send
```
RSK treats the second Send for the same period as a correction automatically.

## State gates
| Current Status | Behavior |
|---|---|
| Validated | Clears validation fields, sets Open |
| Submitted | Clears validation + submission fields, sets Open |
| Open | Error — already Open |

