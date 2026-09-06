---
id: landsbankinn-card-ledgerkeys
title: "Landsbankinn.Card.LedgerKeys"
sidebar_label: "Landsbankinn.Card.LedgerKeys"
sidebar_position: 84
description: "Request and response contract for the Landsbankinn.Card.LedgerKeys Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists ledger key mappings configured in the Landsbankinn Cards portal.
Ledger keys categorize card transactions for accounting (e.g. G/L account codes).

**Direction:** Outbound  
**API endpoint:** `GET /LedgerKeys`  
**Content-Type:** text/json

## Request
```json
{ "skip": 0, "take": 100 }
```

## Response
```json
{
  "totalCount": 1,
  "ledgerKeys": [
    {
      "id": "6c9f4fc8-4b46-478e-a90d-e0ea93fe575c",
      "companyId": "6306251060",
      "created": "2026-07-16T11:03:17",
      "createdBy": "L630625B2B11",
      "identifier": "6100",
      "description": "Office Supplies"
    }
  ]
}
```

## AI/Agent playbook
Use this to discover available ledger keys before assigning one to a transaction 
via Landsbankinn.Card.TransactionUpdate. The `id` field (GUID) is the value to 
pass as `ledgerKeyId`. To create new keys, use Landsbankinn.Card.LedgerKeyCreate.

**Typical workflow:**
1. LedgerKeyGroups → list groups
2. LedgerKeySubGroups → list sub-groups
3. **LedgerKeys** → list keys (this endpoint)
4. Card.Transactions → get transactions
5. Card.TransactionUpdate → assign a ledger key to each transaction

