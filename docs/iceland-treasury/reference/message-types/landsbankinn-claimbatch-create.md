---
id: landsbankinn-claimbatch-create
title: "Landsbankinn.ClaimBatch.Create"
sidebar_label: "Landsbankinn.ClaimBatch.Create"
sidebar_position: 99
description: "Request and response contract for the Landsbankinn.ClaimBatch.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a batch of claim actions (create, update, or cancel) to Landsbankinn.

**Direction:** Inbound  
**Content-Type:** text/json

## Date mapping (IMPORTANT)
| BC field | REST API field | Meaning |
|---|---|---|
| `claimDate` | `dueDate` | Claim key date |
| `dueDate` | `finalDueDate` | Final due date / eindagi |

## Request
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

| Field | Required | Values |
|---|---|---|
| `method` | **Yes** | `create`, `update`, `cancel` |
| `actions` | **Yes** | Array of action objects (schema depends on method) |

## Response
Returns 201 Created with batch `id` for status polling via `ClaimBatch.Get`.

## SOAP equivalent
`Landsbankinn.Claim.CreateBatch` / `AlterBatch` / `CancelBatch` — three separate SOAP message types consolidated into one REST endpoint with a `method` discriminator.

