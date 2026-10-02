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
  "nextStep": "Check the number in the Vendor table.",
  "hint": "For usage details, call the \"Help.Implementation.Get\" message type with subject \"{message-type}\"."
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
að ofan, undir `code` efst og samantekt. Efsti kóðinn er `MultipleErrors`, eða kóði sem vandamálin
eiga sameiginlegan - `lines` í Create-gerð svara `InvalidLine`. Beiðni með aðeins eitt vandamál gefur
það upp efst, án `errors`:

```json
{
  "status": "Error",
  "code": "InvalidLine",
  "error": "3 problems in the request. Nothing was created.",
  "errors": [
    { "code": "RecordNotFound", "error": "Item \"1896-X\" was not found.", "parameter": "lines[2].no", "received": "1896-X",
      "nextStep": "Check the item number in the Item table." },
    { "code": "InvalidParameterFormat", "error": "\"abc\" is not a valid number.", "parameter": "lines[3].quantity", "received": "abc", "expected": "number" },
    { "code": "MissingParameter", "error": "Required parameter \"quantity\" is missing.", "parameter": "lines[4].quantity" }
  ],
  "hint": "For usage details, call the \"Help.Implementation.Get\" message type with subject \"{message-type}\"."
}
```

Lagaðu þau öll áður en þú kallar aftur.

## Snið gilda í beiðni

Gildi í beiðni eru lesin á einu sniði, óháð tungumáli beiðninnar eða fyrirtækisins:

| Tegund | Sendu | Ekki tekið gilt |
|---|---|---|
| Dagsetning | `"2026-09-26"` (`YYYY-MM-DD`) | `26.09.2026`, `09/26/2026`, tveggja stafa ár |
| Dagsetning og tími | `"2026-09-26T14:30:00Z"` (ISO 8601 með `Z` eða hliðrun) | dagsetning án tíma |
| Upphæð | JSON-tala `1234.56`, eða `"1234.56"` | `"1.234,56"`, `"1,234.56"`, `"12,5"` |
| Heiltala | JSON-heiltala `12`, eða `"12"` | `"12.0"`, `"abc"` |
| Boolean-gildi | `true` eða `false` | `"true"`, `"yes"`, `1` |

Öll önnur gildi svara `InvalidParameterFormat`, með `parameter`, `received` og `expected`. Fyrir
ótvírætt staðbundið form á borð við `26.09.2026` eða `12,5` gefur `nextStep` gildið sem á að senda
aftur (`Resend postingDate as 2026-09-26.`); tvírætt form á borð við `01/02/2026` fær sniðið í staðinn.
Öll röng gildi í beiðni eru gefin upp saman.

## Staðfestingarvillur úr Business Central

Bifröst yfirfer gildin í beiðninni fyrst og gefur upp öll vandamál sem finnast í einu. Þegar gildin
standast staðfestir Business Central færsluna um leið og hún er skrifuð. Fyrsta villan sem Business
Central vekur stöðvar kallið og er gefin upp ein og sér, með texta Business Central og þeim hluta
beiðninnar sem verið var að nota:

```json
{
  "status": "Error",
  "code": "BusinessCentralError",
  "error": "Direct Posting must be equal to 'Yes'  in G/L Account: No.=1110. Current value is 'No'.",
  "parameter": "lines[1].accountNo"
}
```

Ekkert er skrifað. Lagaðu gildið og kallaðu aftur; síðari lína getur þá vakið sína eigin villu.

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
