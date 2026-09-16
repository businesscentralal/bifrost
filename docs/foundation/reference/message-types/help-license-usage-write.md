---
id: help-license-usage-write
title: "Help.License.Usage.Write"
sidebar_label: "Help.License.Usage.Write"
sidebar_position: 63
description: "Request and response contract for the Help.License.Usage.Write Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Writes usage entries to the licensing service using the same document id formula as the
production daily sync. Intended for test scenarios.

## Explicit entries
```json
{
  "entries": [
    { "date": "2026-06-01", "licenseType": "User", "quantity": 4213 },
    { "date": "2026-06-01", "licenseType": "App Registration", "quantity": 831 }
  ]
}
```

## Random data generation
```json
{ "days": 14, "maxQuantity": 8000 }
```
Writes one entry per pool per day for the last `days` days (default 7),
random quantity 1–`maxQuantity` (default 5000).

## Response
```json
{ "status": "Success", "written": 14, "documents": [ { "id": "...", "...": "..." } ] }
```
