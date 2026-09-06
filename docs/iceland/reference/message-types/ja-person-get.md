---
id: ja-person-get
title: "Ja.Person.Get"
sidebar_label: "Ja.Person.Get"
sidebar_position: 74
description: "Request and response contract for the Ja.Person.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Use this for person registry data from Þjóðskrá through Já Skrá v1.

## Message metadata
- Direction: Outbound
- Content-Type: text/json
- Requires: Já Registry API key in Bifrost Setup
- **Permission required**: BIFROST Ja

## Request — single lookup
```json
{ "kennitala": "0102034579" }   // 10 digits, no hyphen
```

## Request — search (at least one parameter)
```json
{ "name": "Jón Jónsson", "street": "Álfheimar", "postal_code": "104", "start": 1, "count": 10, "sort": "full_name" }
```

## Request fields
| Field | Required | Description |
|---|---|---|
| `kennitala` | Conditional | Required for exact lookup; 10 digits without hyphen. |
| `name` | Conditional | Person name search text. |
| `street`, `postal_code`, `municipality` | No | Address and location filters. |
| `start`, `count`, `sort` | No | Paging and sorting for search mode. |

## Response — single lookup
```json
{ "status": "Success", "person": { "kennitala": "0102034579", "full_name": "Jón Jónsson",
  "legal_address": { "street": { "nominative": "Álfheimar 74" }, "postal_code": 104, "town": { "nominative": "Reykjavík" } } } }
```

## Response — search
```json
{ "status": "Success", "items": [ { "type": "person", "...": "..." } ], "meta": { "total_items": 12 } }
```

## Errors
- `No person found for kennitala ...` — HTTP 404 from the single lookup.
- `Provide a 'kennitala' ... or at least one search parameter` — empty request.
- `The Já Registry API key is not configured` — set the key in Bifrost Setup.
- `Access denied` — the BIFROST Ja permission set is not assigned.

## Related message types
- Use `Ja.Search.Query` when you need discovery from free text before person lookup.
- Use `Ja.Company.Get` when the identifier or intent is company-focused.

