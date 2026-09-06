---
id: subscription-deferral-release
title: "Subscription.Deferral.Release"
sidebar_label: "Subscription.Deferral.Release"
sidebar_position: 10
description: "Request and response contract for the Subscription.Deferral.Release Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Runs Microsoft's "Contract Deferrals Release" report, which releases every eligible deferred
revenue and cost entry - customer (table 8066) and vendor (table 8072) - and posts the
release to the general ledger.

**The report always uses the session work date.** Its two dates live on its request page,
`SetRequestPageParameters` is internal to Microsoft's app, and request page XML is not
applied to this report, so an external app cannot tell it where to stop. It releases
everything eligible up to the work date, posted under the work date.

`postingDate` and `postUntilDate` are therefore **not instructions - they are a guard**. This
call checks what the report is about to do and refuses to run when that is more than the
caller asked for, rather than posting to the general ledger and reporting a number that does
not match what happened. To release up to an earlier date, set the session work date first.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| postingDate | Date | No | The date the caller expects the release to post under. Must equal the work date, because that is the only date Business Central will use. Defaults to the work date. |
| postUntilDate | Date | No | The latest deferral posting date the caller is willing to release. The call is refused if the report would go past it. Defaults to postingDate. Must not be later than postingDate. |

Dates use the ISO format `YYYY-MM-DD`.

## Request Example

```json
{
  "postingDate": "2026-08-31",
  "postUntilDate": "2026-08-31"
}
```

## Response Shape

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

The counts are measured across **every** unreleased deferral, not only the ones inside the
requested window, so they say what the run actually released. A run that finds nothing
eligible is still a success, with every count at 0.

If anything outside the window is released anyway, the response carries
`releasedOutsideRequestedWindow` and a `warning`, so a run that got past the guard is
still visible in the response rather than only in the ledger.

## Errors

| Condition | Message |
| --- | --- |
| postUntilDate is later than postingDate | The parameter 'postUntilDate' (%1) must not be later than 'postingDate' (%2). |
| postingDate is not the work date | Business Central posts this release under the work date (%1) ... so 'postingDate' (%2) cannot be honoured. |
| The report would release deferrals past postUntilDate | Refusing to run: Business Central would release %1 deferral(s) posted between 'postUntilDate' (%2) and the work date (%3). |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is posted.

## Safety

**This message type posts to the general ledger and cannot be undone**, except by posting a
compensating credit memo through the normal deferral correction process. It is **not scoped**
to a single contract - it releases every eligible customer and vendor deferral, across every
Subscription Contract, up to the work date. The `postUntilDate` guard is what keeps that from
reaching further than the caller intended; it cannot narrow the run, only refuse it. Confirm
the work date carefully before calling this in a production environment.

## Related Message Types

- `Subscription.Analysis.Recalculate`

