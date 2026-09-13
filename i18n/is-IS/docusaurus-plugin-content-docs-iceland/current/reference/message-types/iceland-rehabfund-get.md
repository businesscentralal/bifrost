---
id: iceland-rehabfund-get
title: "Iceland.RehabFund.Get"
sidebar_label: "Iceland.RehabFund.Get"
sidebar_position: 52
description: "Beiðni- og svarsamningur fyrir Iceland.RehabFund.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads Icelandic rehabilitation/education funds (endurhæfingarsjóðir) frá skilagrein.er.
These eru Gerð 3 entities (Númer starts með 3).

**Stefna:** Outbound
**Efnisgerð:** text/json

## Beiðni
```json
{}
```
No parameters nauðsynlegt.

## Svar
Same structure as Iceland.PensionFund.Sækja með `"source": "skilagrein.is - RehabFunds"`.

## Dæmi
- Gildi - endurhæfingarsjóður (3200)
- Birta - endurhæfingarsjóður (3430)
- LSR B-deild - Endurhæfingarsj. (3650)

## Submission Verkflæði
```
Step 1: Iceland.Collector.Get → get all collectors
Step 2: Iceland.RehabFund.Get → get rehab fund entities (this call)
Step 3: Iceland.CollectorPayment.Send → submit with entityType "E" + entityNo from this response
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
1. Kallaðu á með empty body `{}` til Sækja Allt rehabilitation funds.
2. The `collectorNo` Reitur tells you which collector handles this fund.
3. Notaðu the fund `no` as `entityNo` og "E" as `entityType` Þegar building greiðsla entries.
4. Rehab fund contributions eru typically paired með the parent pension fund submission.


