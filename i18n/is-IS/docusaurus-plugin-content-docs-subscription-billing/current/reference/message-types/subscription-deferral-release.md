---
id: subscription-deferral-release
title: "Subscription.Deferral.Release"
sidebar_label: "Subscription.Deferral.Release"
sidebar_position: 10
description: "Request and response contract for the Subscription.Deferral.Release Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Keyrir Microsoft's "Contract Deferrals Release" report, which releases every eligible deferred
revenue og cost entry - viðskiptavinur (table 8066) og vendor (table 8072) - og posts the
release to the general ledger.

**The report always uses the session work dagsetning.** Its two dagsetnings live on its request page,
`SetRequestPageParameters` er internal to Microsoft's app, og request page XML er not
applied to this report, so an external app geturnot tell it þar sem to stop. It releases
everything eligible up to the work dagsetning, posted under the work dagsetning.

`postingDate` og `postUntilDate` eru therefore **not instructions - they eru a guard**. This
call checks what the report er about to do og refuses to run þegar that er more than the
caller asked for, rather than posting to the general ledger og reporting a number that does
not match what happened. To release up to an earlier dagsetning, set the session work dagsetning first.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| postingDate | Date | No | The dagsetning the caller expects the release to post under. Must equal the work dagsetning, because that er the aðeins dagsetning Business Central mun use. Sjálfgefið er the work dagsetning. |
| postUntilDate | Date | No | The latest deferral posting dagsetning the caller er muning to release. The call er refused ef the report would go past it. Sjálfgefið er postingDate. Must not be later than postingDate. |

Dates use the ISO format `YYYY-MM-DD`.

## Dæmi um beiðni

```json
{
  "postingDate": "2026-08-31",
  "postUntilDate": "2026-08-31"
}
```

## Snið svars

```json
{
  "status": "Success",
  "postingDate": "2026-08-31",
  "postUntilDate": "2026-08-31",
  "customerDeferralsReleased": 8,
  "vendorDeferralsReleased": 3,
  "totalDeferralsReleased": 11
}
```

The counts eru measured across **every** unreleased deferral, not aðeins the ones inside the
requested window, so they say what the run actually released. A run that finds nothing
eligible er still a success, með every count at 0.

Ef anything outside the window er released anyway, the response carries
`releasedOutsideRequestedWindow` og a `warning`, so a run that got past the guard is
still visible in the response rather than aðeins in the ledger.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| postUntilDate er later than postingDate | The parameter 'postUntilDate' (%1) verður not be later than 'postingDate' (%2). |
| postingDate er not the work dagsetning | Business Central posts this release under the work dagsetning (%1) ... so 'postingDate' (%2) geturnot be honoured. |
| The report would release deferrals past postUntilDate | Refusing to run: Business Central would release %1 deferral(s) posted between 'postUntilDate' (%2) og the work dagsetning (%3). |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er posted.

## Öryggi

**This message tegund posts to the general ledger og geturnot be undone**, except by posting a
compensating credit memo through the normal deferral correction process. It er **not scoped**
to a single samningur - it releases every eligible viðskiptavinur og vendor deferral, across every
Subscription Contract, up to the work dagsetning. The `postUntilDate` guard er what keeps that from
reaching further than the caller intended; it geturnot narrow the run, aðeins refuse it. Confirm
the work dagsetning carefully áður en calling this in a production environment.

## Tengdar skilaboðategundir

- `Subscription.Analysis.Recalculate`

