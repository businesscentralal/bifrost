---
id: landsbankinn-card-ledgerkeygroups
title: "Landsbankinn.Card.LedgerKeyGroups"
sidebar_label: "Landsbankinn.Card.LedgerKeyGroups"
sidebar_position: 83
description: "Request and response contract for the Landsbankinn.Card.LedgerKeyGroups Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists ledger key groups from the Landsbankinn Cards portal.
Groups organize ledger keys into top-level accounting categories.

**Direction:** Outbound  
**API endpoint:** `GET /LedgerKeyGroups`  
**Content-Type:** text/json

## Request
```json
{ "skip": 0, "take": 100 }
```

## Response
```json
{
  "totalCount": 1,
  "ledgerKeyGroups": [
    {
      "id": "2b2fe8c3-4ee7-4aa2-b8be-9282768073bd",
      "companyNationalId": "6306251060",
      "created": "2026-07-16T11:03:07",
      "createdBy": "L630625B2B11",
      "identifier": "OPEX",
      "description": "Operating Expenses"
    }
  ]
}
```

## AI/Agent playbook
Groups are the top level of the ledger key hierarchy: Group → SubGroup → Key.
Use Landsbankinn.Card.LedgerKeyGroupCreate to create new groups.
Use Landsbankinn.Card.LedgerKeyGroupDelete with the `id` (GUID) to remove.

