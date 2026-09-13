---
id: documentexchange-advania-getuseraccess
title: "DocumentExchange.Advania.GetUserAccess"
sidebar_label: "DocumentExchange.Advania.GetUserAccess"
sidebar_position: 23
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetUserAccess Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


> **Availability:** Advania Aðeins.

Lists users með access til a specific Endapunktur. Skilar per-user Heimildir
(send, receive, view) og login history.

## Þegar til Notaðu
- Auditing who has access til a fyrirtæki's skjal exchange
- Checking your own permission level
- Troubleshooting "access denied" errors on other operations

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | No | Endapunktur ID (kennitala). Omit til Listi Allt accessible endpoints |

## Svar
```json
{ "items": [{ "national_identifier": "4112032630", "name": "Kappi ehf",
  "endpoint": "0196:4112032630", "user_accesses": [
    { "username": "api_user", "can_send": 1, "can_get": 1, "can_view": 1, "enabled_flag": "Y" }
] }] }
```

| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| national_identifier | string | Endapunktur kennitala |
| Heiti | string | fyrirtæki Heiti |
| Endapunktur | string | fulla Endapunktur ID (scheme:kennitala) |
| user_accesses[].username | string | Login username |
| user_accesses[].can_send | integer | 1 = getur send skjöl |
| user_accesses[].can_get | integer | 1 = getur fetch incoming skjöl |
| user_accesses[].can_view | integer | 1 = getur view in web UI |
| user_accesses[].enabled_flag | string | Y = reikningur active |
| user_accesses[].last_login | datetime | Last login (nullable) |

## Related
- **GetAuthorizedPartners** — simpler Listi of endpoints you getur manage


