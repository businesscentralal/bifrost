---
id: iceland-collectorextraamount-confirm
title: "Iceland.CollectorExtraAmount.Confirm"
sidebar_label: "Iceland.CollectorExtraAmount.Confirm"
sidebar_position: 16
description: "Beiðni- og svarsamningur fyrir Iceland.CollectorExtraAmount.Confirm Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Confirms eða rejects extra charges (aukagreiðslur) flagged by a previous submission.
This er Step 4 (final step) of the submission Verkflæði.

**Stefna:** Outbound
**Access Gate:** Requires write permission on Iceland Skg Period ori table.

## Beiðni
```json
{
  "collectorNo": 1005,
  "refno": "12345",
  "confirm": "yes"
}
```

## Parameters
| Reitur | nauðsynlegt | Lýsing |
|-------|----------|-------------|
| collectorNo | Yes | The collector that flagged the extra charges |
| refno | Yes | Reference number frá Iceland.CollectorPayment.Send Svar |
| confirm | Yes | "yes" til accept, "no" til reject extra charges |
| username | No | Override (defaults til fyrirtæki Registration No.) |
| password | No | Override (defaults til stored password fyrir collector) |

## Svar
```json
{
  "success": true,
  "replyState": "OK",
  "refNo": "12345",
  "postedAmount": "100000",
  "correctedAmount": "5000",
  "httpStatusCode": 200
}
```

## Submission Verkflæði
```
Step 1: Iceland.Collector.Get → identify active collector
Step 2: Iceland.PensionFund/Union/RehabFund/PensionSupplement.Get → resolve fund data
Step 3: Iceland.CollectorPayment.Send → submit payment, get refNo
Step 4: Iceland.CollectorExtraAmount.Confirm → confirm/reject extras (THIS CALL)
```
Aðeins needed Þegar Step 3 Svar has `extraPayments` flagged.

## Tracking Tables
| Table | Tilgangur |
|-------|---------|
| Iceland Skg Period ori (10077152) | Period.Confirmation Status updated eftir this Kallaðu á |
| Iceland Skg Period Entry ori (10077153) | The original lines that triggered extra charges |
| Beiðni Log ori (10077136) | HTTP audit: Beiðni og Svar logged |

## Period Status Flow
eftir Iceland.CollectorPayment.Send: Status = Submitted, Confirmation Status = Pending.
eftir this Kallaðu á með "yes": Confirmation Status = Confirmed.
eftir this Kallaðu á með "no": Confirmation Status = Rejected.

## Beiðni Log
Every HTTP Kallaðu á er logged til `Request Log ori` með:
- Operation: "ConfirmExtraAmount"
- Service Heiti: "Skilagrein"
- Beiðni/Svar bodies stored as blobs fyrir auditing

## Leiðbeiningar fyrir gervigreind/umboð
1. Aðeins Kallaðu á this eftir Iceland.CollectorPayment.Send returned extra greiðslur flagged.
2. Notaðu the same `collectorNo` og the `refNo` frá the Send Svar.
3. "yes" accepts the collector corrected amounts; "no" rejects (employer verður að resubmit).
4. This Kallaðu á er idempotent — calling again með same refno Skilar current state.
5. Ef unsure whether til confirm, review the Period færsla's Total Posted vs Total Corrected amounts.


