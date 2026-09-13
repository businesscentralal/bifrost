---
id: iceland-collectorpayment-send
title: "Iceland.CollectorPayment.Send"
sidebar_label: "Iceland.CollectorPayment.Send"
sidebar_position: 17
description: "Beiðni- og svarsamningur fyrir Iceland.CollectorPayment.Send Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a fund contribution return (SendPaymentInfo) til a skilagrein.er collector.
This er Step 3 of the submission Verkflæði — requires master data frá the Sækja calls.

**Stefna:** Outbound
**Access Gate:** Requires write permission on Iceland Skg Period ori table.

## Beiðni
```json
{
  "collectorNo": 1005,
  "username": "optional-override",
  "password": "optional-override",
  "employer": { "ssn": "1234567890", "name": "Company Name" },
  "entries": [
    {
      "entityType": "L",
      "entityNo": 1004,
      "personSSN": "0101012345",
      "monthYear": "2025-01",
      "personAmount": 50000,
      "employerAmount": 50000
    }
  ]
}
```

## Entity Types
| Code | Gerð | Source |
|------|------|--------|
| L | Common pension (lífeyrir sameign) | Iceland.PensionFund.Sækja |
| X | Private pension (séreign) | Iceland.PensionSupplement.Sækja |
| F | Union (stéttarfélag) | Iceland.Union.Sækja |
| S | Sick fund (sjúkrasjóður) | Iceland.Union.Sækja |
| O | Holiday fund (orlofsheimilasjóður) | Iceland.Union.Sækja |
| E | Vocational/Rehab fund (starfsmenntasjóður) | Iceland.RehabFund.Sækja |
| H | Community fund (félagsheimilasjóður) | Iceland.Union.Sækja |

## Svar
```json
{
  "success": true,
  "replyState": "OK",
  "refNo": "12345",
  "postedAmount": "100000",
  "correctedAmount": "0",
  "httpStatusCode": 200
}
```
Ef `extraPayments` eru flagged, Kallaðu á Iceland.CollectorExtraAmount.Confirm með the returned `refNo`.

## Submission Verkflæði
```
Step 1: Iceland.Collector.Get → identify active collector
Step 2: Iceland.PensionFund/Union/RehabFund/PensionSupplement.Get → resolve entityNo values
Step 3: Iceland.CollectorPayment.Send → submit payment (THIS CALL)
Step 4: Iceland.CollectorExtraAmount.Confirm → confirm extra charges using refNo from Step 3
```

## Tracking Tables
| Table | Tilgangur |
|-------|---------|
| Iceland Skg Period ori (10077152) | Tracks submission state: Open → Submitted → Confirmed |
| Iceland Skg Period Entry ori (10077153) | Employee contribution lines sent in this submission |
| Beiðni Log ori (10077136) | fulla HTTP audit: Beiðni XML, Svar, status, timing |

## Period Status Flow
`Open` → (submit) → `Submitted` → (confirm extras) → `Confirmed`
On error: `Open` → `Error` (re-open til retry).
Period table stores: Refno, Total Posted Amount, Total Corrected Amount, Extra greiðslur Flagged, Confirmation Status.

## Beiðni Log
Every HTTP Kallaðu á er logged til `Request Log ori` með:
- Operation: "SendPaymentInfo"
- Service Heiti: "Skilagrein"
- Beiðni Body (blob): the XML sent til the collector
- Svar Body (blob): raw collector Svar
- The Period færsla links back via "Beiðni Log Entry No."

## Leiðbeiningar fyrir gervigreind/umboð
1. Sækja the collector via Iceland.Collector.Sækja, note the `no` Reitur.
2. Build entries: one per employee × entity Gerð × fund fyrir the reporting month.
3. Username defaults til fyrirtæki Information "Registration No." Ef omitted.
4. Password er resolved frá secure storage per collector Ef omitted.
5. eftir success, check Svarið fyrir extra greiðslur. Ef flagged, proceed til Step 4.
6. Multiple entries fyrir different entity types getur be combined in a stakan Kallaðu á til the same collector.


