---
id: ja-person-get
title: "Ja.Person.Get"
sidebar_label: "Ja.Person.Get"
sidebar_position: 74
description: "Beiðni- og svarsamningur fyrir Ja.Person.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Notaðu this fyrir person registry data frá Þjóðskrá through Já Skrá v1.

## Message metadata
- Stefna: Outbound
- Efnisgerð: text/json
- Requires: Já Registry API key in Bifrost Setup
- **Permission nauðsynlegt**: BIFROST Ja

## Beiðni — stakan lookup
```json
{ "kennitala": "0102034579" }   // 10 digits, no hyphen
```

## Beiðni — search (at least one parameter)
```json
{ "name": "Jón Jónsson", "street": "Álfheimar", "postal_code": "104", "start": 1, "count": 10, "sort": "full_name" }
```

## Beiðni fields
| Reitur | nauðsynlegt | Lýsing |
|---|---|---|
| `kennitala` | Conditional | nauðsynlegt fyrir exact lookup; 10 digits without hyphen. |
| `name` | Conditional | Person Heiti search text. |
| `street`, `postal_code`, `municipality` | No | Address og location filters. |
| `start`, `count`, `sort` | No | Paging og sorting fyrir search mode. |

## Svar — stakan lookup
```json
{ "status": "Success", "person": { "kennitala": "0102034579", "full_name": "Jón Jónsson",
  "legal_address": { "street": { "nominative": "Álfheimar 74" }, "postal_code": 104, "town": { "nominative": "Reykjavík" } } } }
```

## Svar — search
```json
{ "status": "Success", "items": [ { "type": "person", "...": "..." } ], "meta": { "total_items": 12 } }
```

## Errors
- `No person found for kennitala ...` — HTTP 404 frá the stakan lookup.
- `Provide a 'kennitala' ... or at least one search parameter` — empty Beiðni.
- `The Já Registry API key is not configured` — set the key in Bifrost Setup.
- `Access denied` — the BIFROST Ja permission set er not assigned.

## Related message types
- Notaðu `Ja.Search.Query` Þegar you need discovery frá free text áður en person lookup.
- Notaðu `Ja.Company.Get` Þegar the identifier eða intent er fyrirtæki-focused.


