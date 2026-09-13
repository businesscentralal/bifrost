---
id: help-license-get
title: "Help.License.Get"
sidebar_label: "Help.License.Get"
sidebar_position: 56
description: "Beiðni- og svarsamningur fyrir Help.License.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar license færslur úr Cosmos DB fyrir this tenant með server-side filtering
og pagination. Does ekki force a sync — aðeins Les fyrirliggjandi skjöl.

nota `Help.License.Sync` fyrsta ef you need fresh data reported til Cosmos.

## Stefna
Útgående (lesa-aðeins)

## Content Gerð
`text/json`

## Beiðnibreytur
| Færibreyta | Gerð | Sjálfgefið | Lýsing |
|-----------|------|---------|-------------|
| `docType` | strengur | — | Filter með skjal Gerð: `license`, `usage`, eða `account`. |
| `licenseType` | strengur | — | Filter með pool: `User` eða `App Registration`. |
| `startDate` | strengur | — | Inclusive start dagsetning filter (yyyy-MM-dd). Applies til the `date` Reitur on usage docs. |
| `endDate` | strengur | — | Inclusive end dagsetning filter (yyyy-MM-dd). Applies til the `date` Reitur on usage docs. |
| `skip` | int | 0 | númer of skjöl til skip (server-side OFFSET). |
| `take` | int | 100 | Maximum skjöl til return (server-side LIMIT). Max 1000. |

All parameters eru valfrjálst. An empty request `{}` Skilar up til 100 færslur.

## Request Examples

### All færslur (fyrsta page)
```json
{}
```

### Usage færslur fyrir User pool in dagsetning range
```json
{
  "docType": "usage",
  "licenseType": "User",
  "startDate": "2026-06-01",
  "endDate": "2026-06-30",
  "skip": 0,
  "take": 50
}
```

### License skjöl aðeins
```json
{ "docType": "license" }
```

### Paginate through all færslur
```json
{ "skip": 100, "take": 100 }
```

## Response Format
```json
{
  "status": "Success",
  "tenantIdHash": "a7f3c1...",
  "totalCount": 63,
  "count": 50,
  "skip": 0,
  "take": 50,
  "items": [
    {
      "id": "usage-a7f3c1...-b2d4e6...-20260623-user",
      "docType": "usage",
      "tenantId": "a7f3c1...",
      "companyId": "b2d4e6...",
      "date": "2026-06-23",
      "licenseType": "User",
      "quantity": 4213,
      "reportedAt": "Mon, 23 Jun 2026 19:24:53 GMT"
    }
  ]
}
```

## Svarreitir
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| `status` | strengur | `Success` eða `Error` |
| `tenantIdHash` | strengur | SHA256 hash of tenant ID |
| `totalCount` | int | Total matching skjöl (áður en pagination) |
| `count` | int | skjöl in this page |
| `skip` | int | OFFSET notað |
| `take` | int | LIMIT notað |
| `items` | fylki | Raw Cosmos skjöl |

## skjal Types
| docType | Fields | Lýsing |
|---------|--------|-------------|
| `license` | id, tenantId, licenseType, quantity, purchasedAt | Purchased quota per pool |
| `usage` | id, tenantId, companyId, dagsetning, licenseType, quantity, reportedAt | Daily usage per company per pool |
| `account` | id, tenantId, userRemaining, appRemaining, updatedAt | Remaining quota summary |

## Villa Response
```json
{
  "status": "Error",
  "error": "Bifrost Cosmos request failed. Status: 401. Response: ..."
}
```

## Tengdar skilaboðategundir
- `Help.License.Sync` — forces an immediate usage sync áður en reading
- `Help.License.Usage.Write` (test aðeins) — seeds usage skjöl
- `Help.License.Reset` (test aðeins) — deletes all skjöl fyrir the tenant

