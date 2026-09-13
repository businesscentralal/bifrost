---
id: kvikabanki-claim-query
title: "Kvikabanki.Claim.Query"
sidebar_label: "Kvikabanki.Claim.Query"
sidebar_position: 64
description: "Beiðni- og svarsamningur fyrir Kvikabanki.Claim.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a paged Listi of Kvika banki (IOBS) claims matching the supplied filters.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni (Allt fields valfrjálst)
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

`entryFrom` defaults til **1** og `entryTo` defaults til **100** Þegar omitted. The period filter er sent Aðeins Þegar `dateRef`, `dateFrom`, og `dateTo` eru Allt supplied.

## Svar
Skilar `status`, `returned`, `totalCount`, `entryFrom`, `entryTo`, `logEntryNo`, og a `claims` array. Each claim carries its key (`claimant`, `account`, `claimDate`), amounts, `status`, og computed charge fields.

## Errors
- `'dateRef' must be one of: dueDate, finalDueDate, cancellationDate, creationDate`
- `'status' must be one of: Unpaid, Paid, Cancelled, SecondaryCollection, LegalCollection`
- `'dateFrom' / 'dateTo' must be ISO dates YYYY-MM-DD when supplied`

## Troubleshooting — outbound HTTP blocked
Ef a Kallaðu á fails með a message that the outbound HTTP Kallaðu á til Kvika banki was blocked by the environment, open **Extension Management → Bifrost Kvika banki → Extension Settings** og turn on **Allow HttpClient Requests**. Ef your environment uses an Endapunktur allowlist, allow `https://netbanki-iobs.kvika.is`.


