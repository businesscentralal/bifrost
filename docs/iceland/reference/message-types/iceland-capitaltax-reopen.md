---
id: iceland-capitaltax-reopen
title: "Iceland.CapitalTax.Reopen"
sidebar_label: "Iceland.CapitalTax.Reopen"
sidebar_position: 13
description: "Request and response contract for the Iceland.CapitalTax.Reopen Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Reopens a Submitted capital tax period back to Open for correction.
Sets Adgerd to "Leiðrétta" so the next submit is treated as a correction by RSK.

## Request
```json
{ "year": 2025, "quarter": 3 }
```

