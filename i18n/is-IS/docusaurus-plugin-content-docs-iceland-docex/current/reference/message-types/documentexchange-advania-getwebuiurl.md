---
id: documentexchange-advania-getwebuiurl
title: "DocumentExchange.Advania.GetWebUIUrl"
sidebar_label: "DocumentExchange.Advania.GetWebUIUrl"
sidebar_position: 24
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetWebUIUrl Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


> **Availability:** Advania Aðeins.

Generates a stakan sign-on URL í the skjal exchange partner web portal.
Fetches a short-lived web token using stored credentials og builds a login link.

## Þegar til Notaðu
- Opening the partner portal fyrir manual skjal management
- Providing users a "Go til exchange portal" action
- Troubleshooting — viewing skjöl directly on the exchange

## Beiðni
No parameters nauðsynlegt. Uses credentials frá the active partner setup.

## Svar
```json
{ "url": "https://exchange.example.com/login.html?webtoken=..." }
```
The URL er short-lived — open it promptly eftir generation.

## Related
- **GetPresentation** — view a specific skjal without opening the fulla portal


