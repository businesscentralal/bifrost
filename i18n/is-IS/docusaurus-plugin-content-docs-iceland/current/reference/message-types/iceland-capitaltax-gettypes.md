---
id: iceland-capitaltax-gettypes
title: "Iceland.CapitalTax.GetTypes"
sidebar_label: "Iceland.CapitalTax.GetTypes"
sidebar_position: 12
description: "Beiðni- og svarsamningur fyrir Iceland.CapitalTax.GetTypes Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir valid income types fyrir capital income tax using FaTegundir.

**Stefna:** Outbound
**RSK Operation:** FaTegundir

## Verkflæði position
```
>>> GetTypes <<< -> GetSubmittablePeriods -> entries -> Submit
```
Kallaðu á first til discover valid Gerð Id values fyrir period entries.

## Key dividend types
| id | heiti | Category |
|---|---|---|
| 11 | Hlutabref | Ardur (dividends) |
| 12 | Stofnfe | Ardur |
| 6 | Bankareikningur | Vextir (interest) |

## Beiðni
```json
{}
```

## Credentials
FTS Password (eða Payroll Password fallback) + fyrirtæki Registration No.

## Troubleshooting
- Beiðni Log: LogType=Capital Tax, Operation=FaTegundir


