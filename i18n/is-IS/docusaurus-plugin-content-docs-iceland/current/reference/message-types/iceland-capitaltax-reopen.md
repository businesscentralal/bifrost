---
id: iceland-capitaltax-reopen
title: "Iceland.CapitalTax.Reopen"
sidebar_label: "Iceland.CapitalTax.Reopen"
sidebar_position: 13
description: "Beiðni- og svarsamningur fyrir Iceland.CapitalTax.Reopen Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Reopens a Submitted capital tax period back til Open fyrir correction.
Sets Adgerd til "Leiðrétta" so the next submit er treated as a correction by RSK.

## Beiðni
```json
{ "year": 2025, "quarter": 3 }
```


