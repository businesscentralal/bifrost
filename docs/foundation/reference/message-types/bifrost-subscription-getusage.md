---
id: bifrost-subscription-getusage
title: "Bifrost.Subscription.GetUsage"
sidebar_label: "Bifrost.Subscription.GetUsage"
sidebar_position: 2.4
description: "Request and response contract for the Bifrost.Subscription.GetUsage Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns paged usage entries reported to the licensing service. Requires the caller to have the License Admin permission set.
The message does not synchronise or modify data.

## Scopes
The optional `scope` field selects the query mode. When omitted, `CurrentCompany` is used for backward compatibility.

| Scope | Purpose | Required role | Extra fields |
|-------|---------|--------------|--------------|
| CurrentCompany | Usage for a company in the caller's tenant. | License Admin | `companyId` (GUID, optional; defaults to current company). |
| CurrentTenant | Usage for every company in the caller's tenant. | License Admin | — |
| CustomerTenant | Usage for a single customer tenant that the caller is linked to. | License Admin + Vendor or Partner role. The target must be a production customer of the caller. | `customerTenantId` (raw Entra tenant GUID). |
| Partner | Usage aggregated across every customer of a Partner. | License Admin + Vendor role (any Partner). Partners may only pass their own tenant id. | `partnerTenantId` (raw Entra tenant GUID). |
| Vendor | Usage aggregated across every customer of the caller Vendor tenant. | License Admin + Vendor role. | — |

The Partner and Vendor scopes cover every production customer linked to that Partner or Vendor, including customers whose relationship has ended, so usage from before a cancellation stays visible.
A customer is linked when it has accepted an invitation from a Partner of the Vendor.

## Common filters
`licenseType` restricts to a pool (e.g. `User` or `App Registration`). `startDate` and `endDate` bound the usage date (yyyy-MM-dd). `skip` / `take` provide bounded paging. All filters apply to every scope, including the Partner and Vendor scopes.

## Request examples
CurrentCompany (default):
```json
{ "companyId": "00000000-0000-0000-0000-000000000000", "licenseType": "User", "startDate": "2026-09-01", "endDate": "2026-09-30", "skip": 0, "take": 50 }
```
CurrentTenant:
```json
{ "scope": "CurrentTenant", "skip": 0, "take": 50 }
```
CustomerTenant (Vendor or Partner):
```json
{ "scope": "CustomerTenant", "customerTenantId": "00000000-0000-0000-0000-000000000000", "skip": 0, "take": 50 }
```
Partner (Vendor):
```json
{ "scope": "Partner", "partnerTenantId": "00000000-0000-0000-0000-000000000000", "skip": 0, "take": 50 }
```
Vendor:
```json
{ "scope": "Vendor", "skip": 0, "take": 50 }
```

## Response
```json
{ "status": "Success", "scope": "Vendor", "totalCount": 128, "count": 50, "skip": 0, "take": 50, "items": [ /* usage documents */ ] }
```

## Authorization errors
- `The specified customer tenant is not linked to the caller.` — CustomerTenant scope requested for a tenant not present in the caller's customer set.
- `Partners may only request usage for their own tenant.` — Partner scope requested by a Partner-only caller against a different partner id.
- `Scope '<scope>' requires the Vendor role.` — Vendor or Partner scope requested without the Vendor role (except Partner=self).

