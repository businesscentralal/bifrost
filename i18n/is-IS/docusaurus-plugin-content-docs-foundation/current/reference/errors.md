---
id: errors
title: "Villur og viðvaranir"
sidebar_position: 2.5
description: "Villu- og viðvörunarsnið allra skilaboðategunda Bifröst: stöðugir kóðar, beiðnihlutinn sem á í hlut, hvað barst og hvað var vænst, næsta skref og öll vandamál í einu."
---

Allar skilaboðategundir Bifröst tilkynna vandamál á sama hátt. Villa segir hvaða hluti beiðninnar
var rangur, hvað Bifröst tók við, hvers var vænst og hvað á að gera næst - og þegar beiðni hefur
fleiri en eitt vandamál eru **þau öll talin upp í einu**, svo næsta kall geti lagað allt.

## Ein villa

```json
{
  "status": "Error",
  "code": "RecordNotFound",
  "error": "Vendor \"99999\" was not found (from subject).",
  "parameter": "subject",
  "received": "99999",
  "nextStep": "Check the number with Data.Records.Get on table Vendor.",
  "hint": "For usage details, call the \"Help.Implementation.Get\" message type with subject \"Purchase.Document.Create\"."
}
```

| Reitur | Merking |
|---|---|
| `status` | `Error`. |
| `code` | Stöðugur kóði, óháður tungumáli - sjá [Kóðar](#codes). Byggðu á honum, ekki textanum. |
| `error` | Skilaboðin fyrir manneskju. Þau geta verið þýdd. |
| `parameter` | Beiðnihlutinn sem villan varðar: `subject`, JSON-lykill eins og `entryNo` eða slóð eins og `lines[2].no`. |
| `received` | Gildið sem Bifröst tók við (mest 250 stafir). |
| `expected` | Hvers var vænst, t.d. `number`, `GUID` eða `integer`. |
| `nextStep` | Hvað á að gera núna vegna þessarar villu. |
| `hint` | Hvar má lesa meira: eigin hjálp skilaboðategundarinnar. Ekki gefið fyrir `Help.*` tegundirnar. |

Reitum sem eiga ekki við er sleppt.

## Fleiri villur

Þegar beiðni hefur fleiri en eitt vandamál eru þau öll talin upp í `errors`, hvert með reitunum hér
að ofan, undir `code` efst (yfirleitt `MultipleErrors`) og samantekt:

```json
{
  "status": "Error",
  "code": "InvalidLine",
  "error": "3 problems in the request. Nothing was created.",
  "errors": [
    { "code": "RecordNotFound", "error": "Item \"1896-X\" was not found.", "parameter": "lines[2].no", "received": "1896-X",
      "nextStep": "Check the item number with Data.Records.Get on table Item." },
    { "code": "InvalidParameterFormat", "error": "\"abc\" is not a valid number.", "parameter": "lines[3].quantity", "received": "abc", "expected": "number" },
    { "code": "MissingParameter", "error": "Required parameter \"quantity\" is missing.", "parameter": "lines[4].quantity" }
  ],
  "hint": "For usage details, call the \"Help.Implementation.Get\" message type with subject \"Purchase.Document.Create\"."
}
```

Lagaðu þau öll áður en þú kallar aftur.

## Viðvaranir

Árangursríkt svar getur borið `warnings`: vandamál sem stöðvuðu ekki kallið.

```json
{
  "status": "Success",
  "warnings": [
    { "code": "LinesSkipped", "message": "Line 2 was skipped.", "parameter": "lines[2]", "nextStep": "Fix line 2 and send it again." }
  ]
}
```

Hver viðvörun hefur `code` og `message`, og `parameter` og `nextStep` þegar þau eiga við.
Leyfisviðvaranir nota sama fylki - sjá [Leyfismál](./licensing.md#warnings).

## Kóðar {#codes}

| Kóði | Merking |
|---|---|
| `MissingParameter` | Nauðsynlega færibreytu eða auðkenni vantar. |
| `InvalidParameterFormat` | Gildi er á röngu sniði - texti þar sem vænst er tölu, dagsetningar eða GUID. |
| `InvalidParameter` | Gildi er ekki leyft. |
| `RecordNotFound` | Færslan sem beiðnin nefnir er ekki til. `parameter` og `received` segja hvaða auðkenni. |
| `AmbiguousRecord` | Auðkennið passar við fleiri en eina færslu - t.d. skjalanúmer sem er til bæði sem pöntun og reikningur. Sendu það í lykli þeirrar gerðar sem þú átt við. |
| `ConflictingIdentifiers` | Tvö auðkenni voru send sem vísa á mismunandi færslur. Sendu aðeins eitt. |
| `InvalidFilterField` | Sía nefnir reit sem er ekki til. |
| `InvalidLine` | Ein eða fleiri skjala- eða færslubókarlínur eru ógildar. |
| `NothingToPreview` | Það er ekkert til að forskoða. |
| `LinesSkipped` | Viðvörun: sumum línum var sleppt. |
| `BlockedByWriteGuard` | Skrifvörn breytingaskrár hindrar skriftina. |
| `PreconditionFailed` | Gögnin eru ekki í því ástandi sem aðgerðin krefst - t.d. færslubók sem stemmir ekki. |
| `PermissionDenied` | Kallandinn hefur ekki heimildina sem aðgerðin þarf, eða taflan er takmörkuð. |
| `LimitExceeded` | Beiðnin fer yfir mörk. |
| `BusinessCentralError` | Business Central hafnaði aðgerðinni; `error` er þess eigin skilaboð. |
| `MultipleErrors` | Kóðinn efst í svari sem telur upp fleiri villur í `errors`. |

Forrit sem byggð eru á Bifröst Foundation geta bætt við eigin kóðum. Villa án `code` kemur frá forriti
sem notar kóðana ekki enn.

## Auðkenni færslna

Skilaboðategund sem vinnur með eina færslu - viðskiptavin, skjal, færslu í höfuðbók - finnur hana út
frá `subject` eða JSON-lyklum eins og `no`, `systemId` eða `orderNo` (hjálp hverrar tegundar telur
þá upp). Öll auðkenni sem þú sendir eru prófuð og svarið greinir tilvikin í sundur:

- ekkert gefið → `MissingParameter`, með þeim lyklum sem eru samþykktir;
- gefið en fannst ekki → `RecordNotFound`, með gildinu og hvaðan það kom;
- gefið en á röngu sniði → `InvalidParameterFormat`;
- tvö auðkenni fyrir mismunandi færslur → `ConflictingIdentifiers`;
- venjulegt skjalanúmer sem passar við fleiri skjalagerðir → `AmbiguousRecord`.

## Enginn kallastafli (call stack)

Villusvör innihalda aldrei kallastafla. Origo fær hann í gegnum fjarmælingar þegar skilaboðategund
mistekst, ásamt kenni skilaboðanna - vísaðu í kenni skilaboðanna þegar þú tilkynnir vandamál.
