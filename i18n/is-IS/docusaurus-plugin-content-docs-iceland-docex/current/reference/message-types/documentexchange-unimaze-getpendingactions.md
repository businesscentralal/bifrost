---
id: documentexchange-unimaze-getpendingactions
title: "DocumentExchange.Unimaze.GetPendingActions"
sidebar_label: "DocumentExchange.Unimaze.GetPendingActions"
sidebar_position: 64
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.GetPendingActions Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a summary of pending actions fyrir a party (Unimaze Aðeins).
Shows counts of unprocessed inbound/outbound messages.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Party identifier (e.g. `0196:2020202222` eða plain kennitala) |

## Svar
Summary object með counts per category. Structure varies by Unimaze version.

## Verkflæði
Notaðu as a dashboard indicator: Kallaðu á periodically til check Ef there eru items needing attention.
Follow up með GetUnread eða GetInbox fyrir details.


