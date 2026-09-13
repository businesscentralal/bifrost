---
id: iceland-union-get
title: "Iceland.Union.Get"
sidebar_label: "Iceland.Union.Get"
sidebar_position: 61
description: "Beiðni- og svarsamningur fyrir Iceland.Union.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads Icelandic unions (stéttarfélög) frá skilagrein.er.
These eru Gerð 2 entities (Númer starts með 2).

**Stefna:** Outbound
**Efnisgerð:** text/json

## Beiðni
```json
{}
```
No parameters nauðsynlegt.

## Svar
Same structure as Iceland.PensionFund.Sækja með `"source": "skilagrein.is - Unions"`.

## Dæmi
- Efling, stéttarfélag (2112)
- VR (2511)
- Eining-Iðja (2235)

## Submission Verkflæði
```
Step 1: Iceland.Collector.Get → get all collectors
Step 2: Iceland.Union.Get → get union entities (this call)
Step 3: Iceland.CollectorPayment.Send → submit with entityType "F" + entityNo from this response
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
1. Kallaðu á með empty body `{}` til Sækja Allt unions.
2. The `collectorNo` Reitur tells you which collector handles this union.
3. Notaðu the union `no` as `entityNo` og "F" as `entityType` Þegar building greiðsla entries.
4. Union dues eru typically combined með pension contributions in the same greiðsla submission.


