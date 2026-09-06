---
id: landsbankinn-card-ledgerkeycreate
title: "Landsbankinn.Card.LedgerKeyCreate"
sidebar_label: "Landsbankinn.Card.LedgerKeyCreate"
sidebar_position: 79
description: "Request and response contract for the Landsbankinn.Card.LedgerKeyCreate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a new ledger key in the Landsbankinn Cards portal.
Ledger keys are used to categorize card transactions for accounting.

**Direction:** Outbound  
**API endpoint:** `POST /LedgerKeys`  
**Content-Type:** text/json

## Request
```json
{
  "identifier": "6100",          // (required) Ledger key identifier prefix
  "description": "Office Supplies" // (required) Ledger key description
}
```

## Response
The created ledger key object as returned by the bank API.
```json
{
  "id": "6c9f4fc8-4b46-478e-a90d-e0ea93fe575c",
  "companyId": "6306251060",
  "created": "2026-07-16T11:03:17",
  "createdBy": "L630625B2B11",
  "identifier": "6100",
  "description": "Office Supplies",
  "logEntryNo": 94
}
```

## AI/Agent playbook
Use this to sync G/L account mappings from BC to the Landsbankinn Cards portal.
The `identifier` typically corresponds to the G/L account number.
The returned `id` (GUID) is used for TransactionUpdate and LedgerKeyDelete.

**Ledger key setup workflow:**
1. LedgerKeyGroupCreate → create a group (e.g. "OPEX")
2. LedgerKeySubGroupCreate → create a sub-group (e.g. "OFFICE")
3. **LedgerKeyCreate** → create a key (e.g. G/L 6100) (this endpoint)
4. LedgerKeys → verify the key was created

**Cleanup (reverse order):** LedgerKeyDelete → LedgerKeySubGroupDelete → LedgerKeyGroupDelete

