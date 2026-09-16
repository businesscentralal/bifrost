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
Skilar leyfisfærslum fyrir þennan leigjanda úr leyfisþjónustunni, með síun og blaðsíðun
á þjóninum. Þvingar **ekki** samstillingu — les aðeins núverandi færslur.

Notaðu `Help.License.Sync` fyrst ef þú þarft ferska notkun tilkynnta til leyfisþjónustunnar.

## Stefna
Út (aðeins lestur)

## Efnistegund
`text/json`

## Beiðnifæribreytur
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `docType` | string | — | Filter by document type: `license`, `usage`, or `account`. |
| `licenseType` | string | — | Filter by pool: `User` or `App Registration`. |
| `startDate` | string | — | Inclusive start date filter (yyyy-MM-dd). Applies to the `date` field on usage docs. |
| `endDate` | string | — | Inclusive end date filter (yyyy-MM-dd). Applies to the `date` field on usage docs. |
| `skip` | int | 0 | Number of documents to skip (server-side OFFSET). |
| `take` | int | 100 | Maximum documents to return (server-side LIMIT). Max 1000. |

All parameters are optional. An empty request `{}` returns up to 100 entries.

## Request Examples

### All entries (first page)
```json
{}
```

### Usage entries for User pool in date range
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

### License documents only
```json
{ "docType": "license" }
```

### Paginate through all entries
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

## Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `Success` or `Error` |
| `tenantIdHash` | string | SHA256 hash of tenant ID |
| `totalCount` | int | Total matching documents (before pagination) |
| `count` | int | Documents in this page |
| `skip` | int | OFFSET used |
| `take` | int | LIMIT used |
| `items` | fylki | Samræmdar leyfis-, notkunar- eða reikningsfærslur |

## Document Types
| docType | Fields | Description |
|---------|--------|-------------|
| `license` | id, tenantId, licenseType, quantity, purchasedAt | Purchased quota per pool |
| `usage` | id, tenantId, companyId, date, licenseType, quantity, reportedAt | Daily usage per company per pool |
| `account` | id, tenantId, userRemaining, appRemaining, updatedAt | Remaining quota summary |

## Error Response
```json
{
  "status": "Error",
  "error": "License request failed. Status: 401. Response: ..."
}
```

## Related Message Types
- `Help.License.Sync` — forces an immediate usage sync before reading
- `Help.License.Usage.Write` (test only) — seeds usage documents
- `Help.License.Reset` (test only) — clears licensing records for the tenant
