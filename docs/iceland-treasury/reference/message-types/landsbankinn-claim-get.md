---
id: landsbankinn-claim-get
title: "Landsbankinn.Claim.Get"
sidebar_label: "Landsbankinn.Claim.Get"
sidebar_position: 95
description: "Request and response contract for the Landsbankinn.Claim.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a single claim by ID via GET /Claims/&#123;id&#125;.
Replaces SOAP `Landsbankinn.Claim.QueryOne`.

## Request
```json
{ "claimId": "<30-char claim ID from Claim.List>" }
```

The claim ID is the full composite key returned by Claim.List (`id` field).
Format: bank(4) + ledger(2=66) + number(6) + claimantKt(10) + date(8).

## Response
Returns the full claim object from the bank API, plus `logEntryNo`.

