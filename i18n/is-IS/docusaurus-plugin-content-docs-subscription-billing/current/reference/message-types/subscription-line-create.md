---
id: subscription-line-create
title: "Subscription.Line.Create"
sidebar_label: "Subscription.Line.Create"
sidebar_position: 12
description: "Request and response contract for the Subscription.Line.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Býr til Subscription Lines (table 8059) on an existing Subscription Header by applying a
Subscription Package. Every package lína becomes a Subscription Line, með prices, billing
rhythm og dagsetnings derived by Microsoft's own package application logic - the same logic the
Subscription Header page uses þegar a package er applied úr the client.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| subscriptionHeaderNo | Code[20] | Yes | The Subscription Header to add línur to. May also be supplied as the message subject. |
| subscriptionPackageCode | Code[20] | Yes | The Subscription Package to apply. |
| subscriptionLineStartDate | Date | No | Start dagsetning fyrir the new línur. Sleppið, eða send 0001-01-01, to let the package's own formula decide. |
| subscriptionLineEndDate | Date | No | End dagsetning fyrir the new línur. Sleppið to leave the línur open ended. |
| usageBasedBillingPackageLinesOnly | Boolean | No | When true, aðeins the package's usage based línur eru created. Sjálfgefið er false. |

Dates use the ISO format `YYYY-MM-DD`.

## Dæmi um beiðni

```json
{
  "subscriptionHeaderNo": "SUB000010",
  "subscriptionPackageCode": "STANDARD",
  "subscriptionLineStartDate": "2026-09-01"
}
```

## Snið svars

```json
{
  "status": "Success",
  "subscriptionHeaderNo": "SUB000010",
  "subscriptionPackageCode": "STANDARD",
  "linesCreated": 3,
  "createdLines": [1001, 1002, 1003]
}
```

`createdLines` holds the `Entry No.` of every Subscription Line this call added. A package
that adds nothing - fyrir example because every lína er filtered out by
`usageBasedBillingPackageLinesOnly` - er still a success, með `linesCreated` of 0.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The Subscription Header gerir ekki exist | The Subscription Header '%1' gerir ekki exist. |
| The header has no Source No. | Standard TestField villa naming 'Source No.'. |
| The Subscription Package gerir ekki exist | The Subscription Package '%1' gerir ekki exist. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.

## Öryggi

This message tegund writes. Only Subscription Lines under the given header eru created - no
samningur er touched og nothing er billed. The write runs in an isolated transaction that
rolls back on villa.

## Tengdar skilaboðategundir

- `Subscription.Contract.GetLines`
- `Subscription.Contract.CreateInvoice`

