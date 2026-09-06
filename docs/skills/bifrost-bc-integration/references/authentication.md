---
id: authentication
title: "Base URL and authentication"
sidebar_label: "Base URL and authentication"
sidebar_position: 2
description: "How to address a Business Central environment and prove who you are: the base URL and its four placeholders, the OAuth 2.0 scope, and the Entra application boundary that isolates one caller’s messages from another’s."
---

How to address a Business Central environment and prove who you are: the base URL and its four placeholders, the OAuth 2.0 scope, and the Entra application boundary that isolates one caller’s messages from another’s.

[← back to SKILL.md](../index.md) · originally sections 2 of the single-file skill.

---

## 2. Base URL

```
https://api.businesscentral.dynamics.com/v2.0/{tenantId}/{environment}/api/origo/bifrost/v1.0/companies({companyId})/
```

| Placeholder | Source | Example |
|---|---|---|
| `{tenantId}` | Tenant domain or GUID | `dynamics.is` |
| `{environment}` | BC environment name | `UAT`, `Production` |
| `{companyId}` | Company GUID | fetched from `/companies` endpoint |

**Authentication:** OAuth 2.0 Bearer token via Microsoft Entra ID (Azure AD).  
Scope: `https://api.businesscentral.dynamics.com/.default`

> **Data Isolation — Entra Application Boundary**  
> Every Bifrost endpoint (`/tasks`, `/queues`, `/responses`, `/requests`) automatically
> filters all results to the **Entra Application (Client ID)** that authenticated the request.
> This is enforced server-side via `SystemCreatedBy = UserSecurityId()` — it cannot be bypassed
> by any query parameter or OData filter.  
> **One Entra Application will never see messages, history, or responses that were created by
> a different Entra Application**, even within the same BC company and environment.

> **Tenant GUID note:** The `data` URL returned in task/queue responses uses the internal
> tenant GUID (e.g. `9069b642-…`), not the named tenant (`dynamics.is`). When using
> the returned URL verbatim it will always work. If you construct the URL from a known
> message ID (e.g. from a webhook), use the named-tenant form — both forms are accepted.
