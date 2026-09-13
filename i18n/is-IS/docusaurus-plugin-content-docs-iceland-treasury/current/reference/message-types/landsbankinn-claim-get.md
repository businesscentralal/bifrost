---
id: landsbankinn-claim-get
title: "Landsbankinn.Claim.Get"
sidebar_label: "Landsbankinn.Claim.Get"
sidebar_position: 95
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Claim.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir stakan claim by ID via Sækja /Claims/&#123;id&#125;.
Replaces SOAP `Landsbankinn.Claim.QueryOne`.

## Beiðni
```json
{ "claimId": "<30-char claim ID from Claim.List>" }
```

The claim ID er the fulla composite key returned by Claim.Listi (`id` Reitur).
Format: bank(4) + ledger(2=66) + number(6) + claimantKt(10) + date(8).

## Svar
Skilar fulla claim object frá the bank API, plus `logEntryNo`.


