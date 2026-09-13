---
id: landsbankinn-claim-delete
title: "Landsbankinn.Claim.Delete"
sidebar_label: "Landsbankinn.Claim.Delete"
sidebar_position: 94
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Claim.Delete Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Cancels a claim via DELETE /Claims/&#123;id&#125;.

## Beiðni
```json
{ "claimId": "013366000001630625106020260801" }
```

## Svar
Skilar bank Svar (typically empty on success með HTTP 200/204).


