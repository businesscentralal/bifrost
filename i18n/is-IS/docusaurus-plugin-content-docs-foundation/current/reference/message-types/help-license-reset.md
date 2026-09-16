---
id: help-license-reset
title: "Help.License.Reset"
sidebar_label: "Help.License.Reset"
sidebar_position: 60
description: "Beiðni- og svarsamningur fyrir Help.License.Reset Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Hreinsar leyfisfærslur (reikning, leyfi og notkun) fyrir núverandi leigjanda hjá
leyfisþjónustunni og hreinsar staðbundnar vistaðar eftirstöðvar og samstillingarmerki svo
næsta `Help.License.Sync` byrji á hreinu borði. Ætlað fyrir prófunar- og þjónustuatvik.

## Full reset (Sjálfgefið)
```json
{}
```

## Fine-grained

Valfrjálsir fánar velja hvort fjartengdar leyfisfærslur og/eða staðbundin skyndiminni eru
hreinsuð, og hvort keyra eigi sem dry run (skýra hvað yrði hreinsað án þess að beita):

```json
{
  "cache": true,
  "dryRun": false
}
```

## Response
```json
{
  "status": "Success",
  "tenantIdHash": "...",
  "dryRun": false,
  "cache":  { "userRemainingCleared": true, "appRemainingCleared": true, "lastSyncCleared": true, "scheduledCleared": true },
  "documents": [ { "id": "...", "docType": "..." } ]
}
```
