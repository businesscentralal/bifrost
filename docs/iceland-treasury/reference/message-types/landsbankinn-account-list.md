---
id: landsbankinn-account-list
title: "Landsbankinn.Account.List"
sidebar_label: "Landsbankinn.Account.List"
sidebar_position: 73
description: "Request and response contract for the Landsbankinn.Account.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists all bank accounts accessible via the system access at Landsbankinn.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{ "skip": 0, "take": 50 }
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `ownerNationalId` | string | no | Filter accounts by owner kennitala. |
| `skip` | integer | no | Number of records to skip (default 0). |
| `take` | integer | no | Number of records to return (default all). |

## Response
```json
{
  "data": [...],
  "page": 1,
  "perPage": 50,
  "totalItems": 3,
  "logEntryNo": 123
}
```
`totalItems` is the total number of records available at the bank (from `X-Paging-TotalItems` header).

## AI/Agent playbook
Use this to discover which accounts are available before querying transactions.

## Validation rules (from Landsbankinn API spec)
- **BBAN**: 5-14 chars, pattern `^\d{1,4}-?\d{1,2}-?\d{1,6}$`. Output: always 12 digits, no hyphens.
- **Kennitala**: 10-11 chars, pattern `^\d{6}-?\d{4}$`. Output: always 10 digits, no hyphen.

