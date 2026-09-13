---
id: ja-company-get
title: "Ja.Company.Get"
sidebar_label: "Ja.Company.Get"
sidebar_position: 73
description: "Beiðni- og svarsamningur fyrir Ja.fyrirtæki.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Notaðu this fyrir business registry data frá Fyrirtækjaskrá through Já Skrá v1.

## Message metadata
- Stefna: Outbound
- Efnisgerð: text/json
- Requires: Já Registry API key in Bifrost Setup
- **Permission nauðsynlegt**: BIFROST Ja

## Beiðni — stakan lookup
```json
{ "kennitala": "4308050530" }   // 10 digits, no hyphen
```

## Beiðni — search (at least one parameter)
```json
{ "name": "já hf", "street": "Álfheimar", "postal_code": "104", "business_type": "D1", "include_deregistered": "false", "start": 1, "count": 10, "sort": "full_name" }
```

## Beiðni fields
| Reitur | nauðsynlegt | Lýsing |
|---|---|---|
| `kennitala` | Conditional | nauðsynlegt fyrir exact lookup; 10 digits without hyphen. |
| `name` | Conditional | fyrirtæki Heiti search text. |
| `street`, `postal_code`, `municipality`, `business_type` | No | Address og classification filters. |
| `include_deregistered` | No | Include deregistered companies (`true`/`false`). |
| `start`, `count`, `sort` | No | Paging og sorting fyrir search mode. |

## Svar — stakan lookup
```json
{ "status": "Success", "company": { "kennitala": "4308050530", "full_name": "Já hf.",
  "business_type": { "code": "D1", "name": { "is": "Hlutafélag, almennt (hf)", "en": "Public limited company" } },
  "legal_address": { "street": { "nominative": "Álfheimar 74" }, "postal_code": 104, "town": { "nominative": "Reykjavík" } },
  "date_established": "2005-07-19", "deregistered": false } }
```

## Svar — search
```json
{ "status": "Success", "items": [ { "type": "business", "...": "..." } ], "meta": { "total_items": 12 } }
```

## Errors
- `No business found for kennitala ...` — HTTP 404 frá the stakan lookup.
- `Provide a 'kennitala' ... or at least one search parameter` — empty Beiðni.
- `The Já Registry API key is not configured` — set the key in Bifrost Setup.
- `Access denied` — the BIFROST Ja permission set er not assigned.

## Related message types
- Notaðu `Ja.Search.Query` Þegar you need discovery frá free text áður en fyrirtæki lookup.
- Notaðu `Ja.Person.Get` Þegar the identifier eða intent er person-focused.


