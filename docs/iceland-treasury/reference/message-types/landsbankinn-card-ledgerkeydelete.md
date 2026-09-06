---
id: landsbankinn-card-ledgerkeydelete
title: "Landsbankinn.Card.LedgerKeyDelete"
sidebar_label: "Landsbankinn.Card.LedgerKeyDelete"
sidebar_position: 80
description: "Request and response contract for the Landsbankinn.Card.LedgerKeyDelete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a ledger key from the Landsbankinn Cards portal.

**Direction:** Outbound  
**API endpoint:** `DELETE /LedgerKeys/{id}`  
**Content-Type:** text/json

## Request
```json
{
  "id": "6c9f4fc8-4b46-478e-a90d-e0ea93fe575c"  // (required) GUID from LedgerKeys
}
```

## Response
```json
{
  "status": "Deleted",
  "id": "6c9f4fc8-4b46-478e-a90d-e0ea93fe575c",
  "logEntryNo": 101
}
```

## AI/Agent playbook
Get the GUID `id` from Landsbankinn.Card.LedgerKeys first.
This is a destructive operation — the key cannot be recovered after deletion.

**Cleanup order:** Delete keys before sub-groups, sub-groups before groups.

