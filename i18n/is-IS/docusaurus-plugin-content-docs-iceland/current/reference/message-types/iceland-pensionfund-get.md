---
id: iceland-pensionfund-get
title: "Iceland.PensionFund.Get"
sidebar_label: "Iceland.PensionFund.Get"
sidebar_position: 49
description: "Beiðni- og svarsamningur fyrir Iceland.PensionFund.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads Icelandic pension funds (lífeyrissjóðir) frá skilagrein.er.
These eru Gerð 1 entities (Númer starts með 1).

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
  "source": "skilagrein.is - PensionFunds",
  "count": 120,
  "funds": [{
    "no": "1005",
    "name": "Almenni-Lífsverk lífeyrissjóður",
    "registrationNo": "4502902549",
    "address": "Dalvegi 30",
    "postCode": "201",
    "city": "Kópavogur",
    "collectorNo": 1005
  }]
}
```

## Fund Types by First Digit
| Digit | Gerð | Message Gerð |
|---|---|---|
| 1 | Pension Fund | **Iceland.PensionFund.Sækja** |
| 2 | Union | Iceland.Union.Sækja |
| 3 | Rehabilitation Fund | Iceland.RehabFund.Sækja |
| 4 | Pension Supplement | Iceland.PensionSupplement.Sækja |

## Submission Verkflæði
```
Step 1: Iceland.Collector.Get → get all collectors
Step 2: Iceland.PensionFund.Get → get pension fund entities (this call)
Step 3: Iceland.CollectorPayment.Send → submit with entityType "L" + entityNo from this response
Step 4: Iceland.CollectorExtraAmount.Confirm → if extra charges flagged
```

## Tracking Tables
| Table | Tilgangur |
|-------|---------|
| Iceland Skg Fund ori (10077147) | Cached fund master data (Allt types 1-4) |
| Iceland Skg Period ori (10077152) | Tracks submission state per Collector+Fund+Period |
| Iceland Skg Period Entry ori (10077153) | Employee contribution lines within a period |
| Beiðni Log ori (10077136) | HTTP audit log — every Kallaðu á logged með Gerð "Skilagrein" |

## Leiðbeiningar fyrir gervigreind/umboð
1. Kallaðu á með empty body `{}` til Sækja Allt pension funds.
2. The `collectorNo` Reitur tells you which collector handles this fund.
3. Notaðu the fund `no` as `entityNo` og "L" as `entityType` Þegar building greiðsla entries.
4. Refresh master data periodically — new funds getur be added by skilagrein.er.


