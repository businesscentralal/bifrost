---
id: iceland-pensionsupplement-get
title: "Iceland.PensionSupplement.Get"
sidebar_label: "Iceland.PensionSupplement.Get"
sidebar_position: 50
description: "Beiðni- og svarsamningur fyrir Iceland.PensionSupplement.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads Icelandic pension supplement funds (lífeyrisaukar/safnsjóðir) frá skilagrein.er.
These eru Gerð 4 entities (Númer starts með 4).

**Stefna:** Outbound
**Efnisgerð:** text/json

## Beiðni
```json
{}
```
No parameters nauðsynlegt.

## Svar
Same structure as Iceland.PensionFund.Sækja með `"source": "skilagrein.is - PensionSupplements"`.

## Dæmi
- Gildi lífeyrissjóður - lífeyrisauki (4200)
- Birta lífeyrissjóður - lífeyrisauki (4430)
- Stapi lífeyrissjóður - lífeyrisauki (4500)

## Submission Verkflæði
```
Step 1: Iceland.Collector.Get → get all collectors
Step 2: Iceland.PensionSupplement.Get → get supplement entities (this call)
Step 3: Iceland.CollectorPayment.Send → submit with entityType "X" + entityNo from this response
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
1. Kallaðu á með empty body `{}` til Sækja Allt pension supplement funds.
2. The `collectorNo` Reitur tells you which collector handles this supplement.
3. Notaðu the fund `no` as `entityNo` og "X" (private pension/séreign) as `entityType` Þegar building entries.
4. Supplements eru typically additional voluntary savings on top of the mandatory pension contribution.


