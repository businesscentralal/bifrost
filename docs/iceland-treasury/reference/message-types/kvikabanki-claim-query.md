---
id: kvikabanki-claim-query
title: "Kvikabanki.Claim.Query"
sidebar_label: "Kvikabanki.Claim.Query"
sidebar_position: 64
description: "Request and response contract for the Kvikabanki.Claim.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a paged list of Kvika banki (IOBS) claims matching the supplied filters.

**Direction:** Outbound  
**Content-Type:** text/json

## Request (all fields optional)
```json
{
  "claimant":   "1234567",
  "identifier": "INV-2026-0001",
  "dateRef":    "dueDate",          // dueDate | finalDueDate | cancellationDate | creationDate
  "dateFrom":   "2026-01-01",
  "dateTo":     "2026-12-31",
  "payor":      "1101012220",
  "status":     "Unpaid",           // Unpaid | Paid | Cancelled | SecondaryCollection | LegalCollection
  "entryFrom":  1,                  // 1-based start row
  "entryTo":    100                 // 1-based end row (inclusive)
}
```

`entryFrom` defaults to **1** and `entryTo` defaults to **100** when omitted. The period filter is sent only when `dateRef`, `dateFrom`, and `dateTo` are all supplied.

## Response
Returns `status`, `returned`, `totalCount`, `entryFrom`, `entryTo`, `logEntryNo`, and a `claims` array. Each claim carries its key (`claimant`, `account`, `claimDate`), amounts, `status`, and computed charge fields.

## Errors
- `'dateRef' must be one of: dueDate, finalDueDate, cancellationDate, creationDate`
- `'status' must be one of: Unpaid, Paid, Cancelled, SecondaryCollection, LegalCollection`
- `'dateFrom' / 'dateTo' must be ISO dates YYYY-MM-DD when supplied`

## Troubleshooting — outbound HTTP blocked
If a call fails with a message that the outbound HTTP call to Kvika banki was blocked by the environment, open **Extension Management → Bifrost Kvika banki → Extension Settings** and turn on **Allow HttpClient Requests**. If your environment uses an endpoint allowlist, allow `https://netbanki-iobs.kvika.is`.

