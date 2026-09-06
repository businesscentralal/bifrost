---
id: landsbankinn-card-ledgerkeygroupcreate
title: "Landsbankinn.Card.LedgerKeyGroupCreate"
sidebar_label: "Landsbankinn.Card.LedgerKeyGroupCreate"
sidebar_position: 81
description: "Request and response contract for the Landsbankinn.Card.LedgerKeyGroupCreate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a new ledger key group in the Landsbankinn Cards portal.
Groups organize ledger keys into accounting categories.

**Direction:** Outbound  
**API endpoint:** `POST /LedgerKeyGroups`  
**Content-Type:** text/json

## Request
```json
{
  "identifier": "OPEX",                     // (required) Group identifier
  "description": "Operating Expenses"       // (required) Group description
}
```

## Response
The created ledger key group object as returned by the bank API.
```json
{
  "id": "2b2fe8c3-4ee7-4aa2-b8be-9282768073bd",
  "companyNationalId": "6306251060",
  "created": "2026-07-16T11:03:07",
  "createdBy": "L630625B2B11",
  "identifier": "OPEX",
  "description": "Operating Expenses",
  "logEntryNo": 92
}
```

## AI/Agent playbook
Groups are the top level of the hierarchy: Group → SubGroup → Key.
Create groups first, then sub-groups, then ledger keys.
The returned `id` (GUID) is used for LedgerKeyGroupDelete.

**Ledger key setup workflow:**
1. **LedgerKeyGroupCreate** → create a group (this endpoint)
2. LedgerKeySubGroupCreate → create a sub-group
3. LedgerKeyCreate → create a key (e.g. G/L account code)
4. LedgerKeys → verify the key was created

