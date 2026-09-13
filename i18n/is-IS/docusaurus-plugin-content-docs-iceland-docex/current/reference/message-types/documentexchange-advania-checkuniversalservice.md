---
id: documentexchange-advania-checkuniversalservice
title: "DocumentExchange.Advania.CheckUniversalService"
sidebar_label: "DocumentExchange.Advania.CheckUniversalService"
sidebar_position: 1
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.CheckUniversalService Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Checks Ef the authenticated user er enrolled in the Advania universal distribution service.

## Beiðni
No parameters nauðsynlegt. Uses the stored credentials fyrir authentication.

## Svar
Skilar enrollment status. HTTP 400 = not enrolled. HTTP 200 = enrolled með service details.


