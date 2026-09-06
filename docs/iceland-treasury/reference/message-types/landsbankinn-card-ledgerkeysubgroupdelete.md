---
id: landsbankinn-card-ledgerkeysubgroupdelete
title: "Landsbankinn.Card.LedgerKeySubGroupDelete"
sidebar_label: "Landsbankinn.Card.LedgerKeySubGroupDelete"
sidebar_position: 86
description: "Request and response contract for the Landsbankinn.Card.LedgerKeySubGroupDelete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a ledger key sub-group from the Landsbankinn Cards portal.

**Direction:** Outbound  
**API endpoint:** `DELETE /LedgerKeySubGroups/{id}`  
**Content-Type:** text/json

## Request
```json
{
  "id": "9bc1a4a5-488c-4e4d-befe-23f07b42a074"  // (required) GUID from LedgerKeySubGroups
}
```

## Response
```json
{
  "status": "Deleted",
  "id": "9bc1a4a5-488c-4e4d-befe-23f07b42a074",
  "logEntryNo": 102
}
```

## AI/Agent playbook
Get the GUID `id` from Landsbankinn.Card.LedgerKeySubGroups first.
Delete ledger keys that reference this sub-group before deleting it.

**Cleanup order:** LedgerKeyDelete → **LedgerKeySubGroupDelete** → LedgerKeyGroupDelete

