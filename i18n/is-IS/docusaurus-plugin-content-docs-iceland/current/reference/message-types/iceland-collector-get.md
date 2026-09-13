---
id: iceland-collector-get
title: "Iceland.Collector.Get"
sidebar_label: "Iceland.Collector.Get"
sidebar_position: 15
description: "Beiðni- og svarsamningur fyrir Iceland.Collector.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads Allt Skilagrein collectors (innheimtuaðilar) frá skilagrein.er.
A collector aggregates multiple funds og provides a stakan web service Endapunktur fyrir submissions.

**Stefna:** Outbound
**Efnisgerð:** text/json

## Beiðni
```json
{}
```
No parameters nauðsynlegt.

## Svar
```json
{
  "status": "Success",
  "source": "skilagrein.is - CollectorEntity",
  "count": 42,
  "collectors": [{
    "no": 1005,
    "name": "Almenni-Lífsverk lífeyrissjóður",
    "registrationNo": "4502902549",
    "address": "Dalvegi 30",
    "postCode": "201",
    "city": "Kópavogur",
    "phone": "510 2500",
    "webServiceUrl": "https://...",
    "webServiceActive": true,
    "webServiceAuthenticates": true
  }]
}
```

## Submission Verkflæði
```
Step 1: Iceland.Collector.Get → get all collectors (this call)
Step 2: Iceland.PensionFund/Union/RehabFund/PensionSupplement.Get → get fund entities
Step 3: Iceland.CollectorPayment.Send → submit contribution return
Step 4: Iceland.CollectorExtraAmount.Confirm → confirm/reject extra charges (if flagged)
```

## Tracking Tables
| Table | Tilgangur |
|-------|---------|
| Iceland Skg Collector ori (10077146) | Cached collector master data |
| Iceland Skg Fund ori (10077147) | Cached fund entities frá Allt Sækja calls |
| Iceland Skg Period ori (10077152) | Tracks submission periods per Collector+Fund+Period |
| Iceland Skg Period Entry ori (10077153) | Employee contribution lines within a period |
| Beiðni Log ori (10077136) | Audit log fyrir every HTTP Kallaðu á (Beiðni/Svar bodies, status, timing) |

## Beiðni Log
Every outbound HTTP Kallaðu á er logged til `Request Log ori` með Gerð = "Skilagrein".
Fields: Entry No., Sent At, Operation, Service URL, HTTP Status, Elapsed, Success, Error Text, Beiðni Body (blob), Svar Body (blob).
The Period table links back via "Beiðni Log Entry No.".

## Leiðbeiningar fyrir gervigreind/umboð
1. Kallaðu á með empty body `{}` til Sækja Allt collectors.
2. Notaðu `webServiceActive` til find collectors accepting electronic submissions.
3. Match `no` til the `collectorNo` Reitur in fund responses og submission calls.
4. Aðeins collectors með `webServiceActive: true` getur receive greiðslur via Iceland.CollectorPayment.Send.


