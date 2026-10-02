---
id: index
title: "Bifröst Inventory"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Vörueigindir á Bifröst Foundation: lestu, settu, breyttu og skilgreindu vörueigindir, hvert í einni beiðni."
---

# Bifröst Inventory

**Haltu vörueigindum uppfærðum úr öðrum kerfum og frá aðstoð.** Lestu eigindir vöru, settu gildi
þeirra og skilgreindu nýjar eigindir, hvert í einni beiðni.

Niðurstöðurnar birtast á vörunni í Business Central, undir stöðluðum vörueigindum. Appið hefur
engar síður sjálft.

*Viðbótarapp ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert

- **Séð eigindir vöru í einu lagi.** Sæktu eigindir og gildi þeirra fyrir eina eða fleiri vörur,
  og, ef þú vilt, eigindirnar sem hafa ekkert gildi enn.
- **Gefið vöru eigindargildi.** Ef sama gildi er sett aftur breytist ekkert. Öðru gildi er aðeins
  skipt út þegar beiðnin biður um það.
- **Breytt gildi sem þegar er sett.** Svarið sýnir gildið fyrir og eftir breytinguna.
- **Skilgreint nýja eigind.** Búðu til eigind, með valgildum hennar, áður en nokkur vara notar
  hana.
- **Stutt vinnu við vörulista og vörugögn.** Samstilling vörulista, auðgun vöruupplýsinga og
  verkefni í grunngögnum sem gervigreindaraðstoð vinnur geta öll notað sömu beiðnirnar.

## Sæktu appið

Settu **Bifrost Inventory** upp við hlið Bifröst Foundation, af AppSource eða í gegnum
samstarfsaðila þinn. Það þarf Business Central 28.0 eða nýrra, Essentials eða Premium, og Bifröst
Foundation 28.0.0.0 eða nýrra.

## Uppsetning

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Settu upp og virkjaðu Bifröst Foundation, og settu síðan upp Bifröst Inventory. | Kerfisstjóri Business Central |
| 2 | Gakktu úr skugga um að fólk og þjónustur sem kalla á appið hafi **`BIFROST Read ori`** eða **`BIFROST Full ori`**. Inventory bætir heimildum sínum við þau söfn. | Kerfisstjóri Business Central |
| 3 | Sendu beiðnir um vörueigindir og athugaðu síðan eigindirnar á vörunni í Business Central. | Sá sem smíðar samþættinguna |

Stillingar kerfisins eru á [Uppsetningu Bifrost](/help/foundation/bifrost-setup/) í Bifröst
Foundation.

## Gott að vita

- **Það vinnur sem þú.** Hvert kall keyrir með þínum eigin heimildum í Business Central og er skráð
  á **Bifrost Messages**.
- **Engin ný heimildasöfn.** Aðgangur fylgir heimildasöfnum Foundation, `BIFROST Read ori` og
  `BIFROST Full ori`.
- **Ekkert að opna í biðlaranum.** Appið bætir engum síðum, aðgerðum eða reitum við. Eigindagildi
  eru geymd í stöðluðum vörueigindatöflum Business Central og birtast á vörunni.
- **Vara er nefnd** með kerfisauðkenni sínu eða vörunúmeri.

## Tilvísun

Uppsettar skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með
MCP-verkfærunum `list_message_types` og `describe_message_type`, eða á síðunni **Bifrost Message
Types**. Aðgerðir Bifröst Inventory fyrir vörueigindir birtast við hlið eigin vöruaðgerða Bifröst
Foundation.

- [Texti AppSource-skráningar](./listing)
- [Byggðu á Bifröst](/extensibility/)
- Heimildasöfn: `BIFROST Read ori` eða `BIFROST Full ori`, úr Bifröst Foundation, útvíkkuð af þessu
  appi.
