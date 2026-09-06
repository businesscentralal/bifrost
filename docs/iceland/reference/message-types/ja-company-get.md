---
id: ja-company-get
title: "Ja.Company.Get"
sidebar_label: "Ja.Company.Get"
sidebar_position: 73
description: "Request and response contract for the Ja.Company.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Use this for business registry data from Fyrirtækjaskrá through Já Skrá v1.

## Message metadata
- Direction: Outbound
- Content-Type: text/json
- Requires: Já Registry API key in Bifrost Setup
- **Permission required**: BIFROST Ja

## Request — single lookup
```json
{ "kennitala": "4308050530" }   // 10 digits, no hyphen
```

## Request — search (at least one parameter)
```json
{ "name": "já hf", "street": "Álfheimar", "postal_code": "104", "business_type": "D1", "include_deregistered": "false", "start": 1, "count": 10, "sort": "full_name" }
```

## Request fields
| Field | Required | Description |
|---|---|---|
| `kennitala` | Conditional | Required for exact lookup; 10 digits without hyphen. |
| `name` | Conditional | Company name search text. |
| `street`, `postal_code`, `municipality`, `business_type` | No | Address and classification filters. |
| `include_deregistered` | No | Include deregistered companies (`true`/`false`). |
| `start`, `count`, `sort` | No | Paging and sorting for search mode. |

## Response — single lookup
```json
{ "status": "Success", "company": { "kennitala": "4308050530", "full_name": "Já hf.",
  "business_type": { "code": "D1", "name": { "is": "Hlutafélag, almennt (hf)", "en": "Public limited company" } },
  "legal_address": { "street": { "nominative": "Álfheimar 74" }, "postal_code": 104, "town": { "nominative": "Reykjavík" } },
  "date_established": "2005-07-19", "deregistered": false } }
```

## Response — search
```json
{ "status": "Success", "items": [ { "type": "business", "...": "..." } ], "meta": { "total_items": 12 } }
```

## Errors
- `No business found for kennitala ...` — HTTP 404 from the single lookup.
- `Provide a 'kennitala' ... or at least one search parameter` — empty request.
- `The Já Registry API key is not configured` — set the key in Bifrost Setup.
- `Access denied` — the BIFROST Ja permission set is not assigned.

## Related message types
- Use `Ja.Search.Query` when you need discovery from free text before company lookup.
- Use `Ja.Person.Get` when the identifier or intent is person-focused.

