---
id: landsbankinn-claimbatch-create
title: "Landsbankinn.ClaimBatch.Create"
sidebar_label: "Landsbankinn.ClaimBatch.Create"
sidebar_position: 99
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ClaimBatch.Create Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a batch of claim actions (create, update, eða cancel) til Landsbankinn.

**Stefna:** Inbound  
**Efnisgerð:** text/json

## Date mapping (IMPORTANT)
| BC Reitur | REST API Reitur | Meaning |
|---|---|---|
| `claimDate` | `dueDate` | Claim key date |
| `dueDate` | `finalDueDate` | Final due date / eindagi |

## Beiðni
```json
{
  "method": "create",
  "actions": [
    {
      "payorNationalId": "1101012220",
      "dueDate": "2026-08-01",
      "finalDueDate": "2026-08-15",
      "templateId": "abc-123",
      "principalAmount": 50000.00
    }
  ]
}
```

| Reitur | nauðsynlegt | Values |
|---|---|---|
| `method` | **Yes** | `create`, `update`, `cancel` |
| `actions` | **Yes** | Array of action objects (schema depends on Aðferð) |

## Svar
Skilar 201 Created með batch `id` fyrir status polling via `ClaimBatch.Get`.

## SOAP equivalent
`Landsbankinn.Claim.CreateBatch` / `AlterBatch` / `CancelBatch` — three separate SOAP message types consolidated í one REST Endapunktur með a `method` discriminator.


