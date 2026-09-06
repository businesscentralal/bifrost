---
id: landsbankinn-card-ledgerkeygroupdelete
title: "Landsbankinn.Card.LedgerKeyGroupDelete"
sidebar_label: "Landsbankinn.Card.LedgerKeyGroupDelete"
sidebar_position: 82
description: "Request and response contract for the Landsbankinn.Card.LedgerKeyGroupDelete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a ledger key group from the Landsbankinn Cards portal.

**Direction:** Outbound  
**API endpoint:** `DELETE /LedgerKeyGroups/{id}`  
**Content-Type:** text/json

## Request
```json
{
  "id": "2b2fe8c3-4ee7-4aa2-b8be-9282768073bd"  // (required) GUID from LedgerKeyGroups
}
```

## Response
```json
{
  "status": "Deleted",
  "id": "2b2fe8c3-4ee7-4aa2-b8be-9282768073bd",
  "logEntryNo": 103
}
```

## AI/Agent playbook
Get the GUID `id` from Landsbankinn.Card.LedgerKeyGroups first.
Delete ledger keys and sub-groups that reference this group before deleting the group.

**Cleanup order:** LedgerKeyDelete → LedgerKeySubGroupDelete → **LedgerKeyGroupDelete**

