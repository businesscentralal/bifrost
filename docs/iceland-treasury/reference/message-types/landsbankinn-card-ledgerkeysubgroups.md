---
id: landsbankinn-card-ledgerkeysubgroups
title: "Landsbankinn.Card.LedgerKeySubGroups"
sidebar_label: "Landsbankinn.Card.LedgerKeySubGroups"
sidebar_position: 87
description: "Request and response contract for the Landsbankinn.Card.LedgerKeySubGroups Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists ledger key sub-groups from the Landsbankinn Cards portal.
Sub-groups provide finer categorization within a group.

**Direction:** Outbound  
**API endpoint:** `GET /LedgerKeySubGroups`  
**Content-Type:** text/json

## Request
```json
{
  "groupId": "2b2fe8c3-...",  // (optional) GUID — filter by group
  "skip": 0,
  "take": 100
}
```

## Response
```json
{
  "totalCount": 1,
  "ledgerKeySubGroups": [
    {
      "id": "9bc1a4a5-488c-4e4d-befe-23f07b42a074",
      "companyNationalId": "6306251060",
      "created": "2026-07-16T11:03:13",
      "createdBy": "L630625B2B11",
      "identifier": "OFFICE",
      "description": "Office related expenses"
    }
  ]
}
```

## AI/Agent playbook
Sub-groups sit between groups and keys in the hierarchy: Group → SubGroup → Key.
Use Landsbankinn.Card.LedgerKeySubGroupCreate to create new sub-groups.
Use Landsbankinn.Card.LedgerKeySubGroupDelete with the `id` (GUID) to remove.

