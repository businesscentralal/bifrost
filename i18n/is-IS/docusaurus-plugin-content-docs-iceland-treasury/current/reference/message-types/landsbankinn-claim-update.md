---
id: landsbankinn-claim-update
title: "Landsbankinn.Claim.Update"
sidebar_label: "Landsbankinn.Claim.Update"
sidebar_position: 97
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Claim.Update Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Uppfærir a claim via PUT /Claims/&#123;id&#125;.
Replaces SOAP `Landsbankinn.Claim.AlterBatch`.

## Date mapping
| This message Gerð | Bank API Reitur | Meaning |
|---|---|---|
| `dueDate` | `finalDueDate` | Final due date / eindagi |

## Beiðni (nauðsynlegt fields)
```json
{
  "claimId": "<30-char claim ID>",        // required
  "templateCode": "<3-char code>",        // required by bank
  "dueDate": "<final due date>",          // required (maps to bank finalDueDate)
  "autoCancellation": "<auto-cancel date>", // required
  "principalAmount": 500,                 // optional — include to change
  "description": "Updated description"    // optional
}
```

The bank requires a fulla PUT (not partial). `claimId`, `templateCode`, `dueDate`, og `autoCancellation` eru always nauðsynlegt.
Other fields eru valfrjálst — Aðeins include what you want til change.

## Svar
Skilar bank Svar (HTTP 202 on success), plus `logEntryNo`.


