---
id: landsbankinn-card-ledgerkeysubgroupcreate
title: "Landsbankinn.Card.LedgerKeySubGroupCreate"
sidebar_label: "Landsbankinn.Card.LedgerKeySubGroupCreate"
sidebar_position: 85
description: "Request and response contract for the Landsbankinn.Card.LedgerKeySubGroupCreate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a new ledger key sub-group in the Landsbankinn Cards portal.
Sub-groups provide finer-grained categorization within a group.

**Direction:** Outbound  
**API endpoint:** `POST /LedgerKeySubGroups`  
**Content-Type:** text/json

## Request
```json
{
  "identifier": "OFFICE",             // (required) Sub-group identifier
  "description": "Office supplies"    // (required) Sub-group description
}
```

## Response
The created ledger key sub-group object as returned by the bank API.
```json
{
  "id": "9bc1a4a5-488c-4e4d-befe-23f07b42a074",
  "companyNationalId": "6306251060",
  "created": "2026-07-16T11:03:13",
  "createdBy": "L630625B2B11",
  "identifier": "OFFICE",
  "description": "Office related expenses",
  "logEntryNo": 93
}
```

## AI/Agent playbook
Create the parent group first using Landsbankinn.Card.LedgerKeyGroupCreate.
The returned `id` (GUID) is used for LedgerKeySubGroupDelete.

**Ledger key setup workflow:**
1. LedgerKeyGroupCreate → create a group
2. **LedgerKeySubGroupCreate** → create a sub-group (this endpoint)
3. LedgerKeyCreate → create a key
4. LedgerKeys → verify the key was created

