---
id: documentexchange-unimaze-retrymessage
title: "DocumentExchange.Unimaze.RetryMessage"
sidebar_label: "DocumentExchange.Unimaze.RetryMessage"
sidebar_position: 71
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.RetryMessage Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Retries a failed message (Unimaze Aðeins). Aðeins works Þegar message status er `failed` eða `retrying`.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | UUID of the failed message |

## Svar
Empty Svar on success (HTTP 200). Error on invalid state (HTTP 422).

## Verkflæði
```
1. StatusSync or GetDocumentInfo → find messages with status "failed"
2. GetValidations { "messageId": "<id>" } → understand why it failed
3. If transient failure: RetryMessage { "messageId": "<id>" }
4. If permanent failure: fix data and SubmitTransaction again
```


