---
id: documentexchange-advania-getuseraccess
title: "DocumentExchange.Advania.GetUserAccess"
sidebar_label: "DocumentExchange.Advania.GetUserAccess"
sidebar_position: 23
description: "Request and response contract for the DocumentExchange.Advania.GetUserAccess Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


> **Availability:** Advania only.

Lists users with access to a specific endpoint. Returns per-user permissions
(send, receive, view) and login history.

## When to Use
- Auditing who has access to a company's document exchange
- Checking your own permission level
- Troubleshooting "access denied" errors on other operations

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | No | Endpoint ID (kennitala). Omit to list all accessible endpoints |

## Response
```json
{ "items": [{ "national_identifier": "4112032630", "name": "Kappi ehf",
  "endpoint": "0196:4112032630", "user_accesses": [
    { "username": "api_user", "can_send": 1, "can_get": 1, "can_view": 1, "enabled_flag": "Y" }
] }] }
```

| Field | Type | Description |
|-------|------|-------------|
| national_identifier | string | Endpoint kennitala |
| name | string | Company name |
| endpoint | string | Full endpoint ID (scheme:kennitala) |
| user_accesses[].username | string | Login username |
| user_accesses[].can_send | integer | 1 = can send documents |
| user_accesses[].can_get | integer | 1 = can fetch incoming documents |
| user_accesses[].can_view | integer | 1 = can view in web UI |
| user_accesses[].enabled_flag | string | Y = account active |
| user_accesses[].last_login | datetime | Last login (nullable) |

## Related
- **GetAuthorizedPartners** — simpler list of endpoints you can manage

