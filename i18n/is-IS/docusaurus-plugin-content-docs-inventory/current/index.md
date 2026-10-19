---
id: index
title: "Bifröst birgðir"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Birgðavinna í Business Central úr aðstoð eða samþættingu — flutningar, samsetning, vörurakning, frátektir, talningar, kostnaður og tímabil."
---

# Bifröst birgðir

**Vinndu birgðaverkin í Business Central úr aðstoðinni eða kerfinu sem þú notar nú þegar.** Bifröst
birgðir gera vöruhúsakerfi, samþættingu eða gervigreindaraðstoð kleift að flytja birgðir milli
birgðageymslna, setja saman vörur, rekja lotur og raðnúmer, taka frá birgðir, telja birgðir og loka
tímabilinu.

Hver aðgerð keyrir eigin birgðarökfræði Business Central, nákvæmlega eins og ef notandi ynni verkið,
og niðurstöðurnar birtast á stöðluðum síðum Business Central: flutningspöntunum,
samsetningarpöntunum, vörubókum, vörufærslum og vöruspjaldinu.

*Viðbótarforrit ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert {#what-you-can-do}

- **Flutt birgðir milli birgðageymslna.** Stofnaðu, losaðu, opnaðu aftur og bókaðu
  flutningspantanir, forskoðaðu bókunina fyrst, lestu tölfræði þeirra og afturkallaðu bókaða
  flutningsafhendingu eða -móttöku.
- **Sett saman vörur.** Stofnaðu samsetningarpantanir, endurnýjaðu línur þeirra, losaðu, opnaðu
  aftur, forskoðaðu og bókaðu þær, og afturkallaðu bókaða samsetningu.
- **Rakið lotur, raðnúmer og pakka.** Úthlutaðu eða fjarlægðu vörurakningu á línu og sjáðu hve mikið
  er eftir af hverri lotu, hverju raðnúmeri eða pakka.
- **Tekið frá birgðir.** Sjáðu frátektir sem fyrir eru, taktu frá birgðir fyrir eftirspurn og
  hættu við frátekt.
- **Talið birgðir.** Reiknaðu áætlað magn inn í birgðatalningarbók, skráðu talið magn, forskoðaðu
  niðurstöðuna og bókaðu bókina.
- **Endurflokkað.** Athugaðu, forskoðaðu og bókaðu endurflokkunarbók.
- **Haldið kostnaði réttum og lokað tímabilinu.** Lestu kostnað vöru, keyrðu kostnaðarleiðréttingu,
  bókaðu birgðakostnað í fjárhag, reiknaðu endurmat, uppfærðu einingarverð, afturkallaðu og endurgerðu
  vörujöfnun, og lokaðu eða opnaðu birgðatímabil aftur.
- **Haldið vörueigindum réttum.** Lestu eigindir vöru, gefðu henni eigindagildi og skilgreindu nýjar
  eigindir með valgildum sínum.

## Svið {#capabilities}

| Lén | Svið |
|---|---|
| **Inventory** | Flutnings- og samsetningarpantanir frá stofnun til bókunar og afturköllunar, vörurakning, frátektir, birgðatalning, endurflokkun, vörujöfnun, kostnaðarleiðrétting og bókun birgðakostnaðar í fjárhag, endurmat, einingarverð, birgðatímabil og vörueigindir |

## Sæktu forritið {#get-it}

Settu **Bifrost Inventory** upp við hlið Bifröst Foundation, af AppSource eða í gegnum Business
Central samstarfsaðilann þinn. Það þarf Business Central 28.3 eða nýrra, Essentials eða Premium, og
Bifröst Foundation 28.0.3.530 eða nýrra. Hafðu samband við Business Central samstarfsaðilann þinn
varðandi verð.

## Uppsetning {#set-it-up}

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Settu upp Bifröst Foundation og ljúktu uppsetningu þess, og settu síðan upp **Bifrost Inventory**. | Kerfisstjóri Business Central |
| 2 | Opnaðu **Uppsetning birgða** og kveiktu á sviðunum sem á að nota í þessu fyrirtæki. | Kerfisstjóri Business Central |
| 3 | Gakktu úr skugga um að fólk og þjónustur sem kalla á forritið hafi `BIFROST Read ori` eða `BIFROST Full ori` úr Bifröst; Bifröst birgðir bæta heimildum sínum við þau söfn. | Kerfisstjóri Business Central |
| 4 | Úthlutaðu **Bókunarhlið birgða** (`BIFROST InvPost ori`) aðeins þeim sem mega bóka, keyra kostnaðarleiðréttingu eða bóka birgðakostnað í fjárhag. | Kerfisstjóri Business Central |
| 5 | Athugaðu uppsetninguna í Business Central sem verkin þurfa: birgðageymslur og flutningsleiðir, samsetningaruppsetningu, vörurakningarkóta, bókarsniðmát og -keyrslur, birgðatímabil og bókunaruppsetningu. | Kerfisstjóri Business Central eða samstarfsaðili |

Hjálp uppsetningarsíðunnar segir nánar frá: [Uppsetning birgða](/help/inventory/inventory-setup/).

## Gott að vita {#good-to-know}

- **Það vinnur sem þú.** Hvert kall keyrir með eigin heimildum þess sem kallar í Business Central og
  er skráð á **Bifrost Messages**.
- **Bókun er sérstök heimild.** Til að bóka flutnings-, samsetningar-, talningar- og
  endurflokkunarskjöl, keyra kostnaðarleiðréttingu og bóka birgðakostnað í fjárhag þarf
  `BIFROST InvPost ori` til viðbótar við lestrar- og skrifheimildirnar. Samþætting getur stofnað og
  losað skjöl án þess að geta bókað þau.
- **Slökkva má á hverju sviði.** Svið sem slökkt er á í **Uppsetning birgða** er ekki boðið
  aðstoðarmönnum í því fyrirtæki, og aðgerðir þess svara með villu sem segir frá því.
- **Sumum töflum er aðeins breytt með þessum aðgerðum.** Aðstoð getur ekki breytt vörueigindagögnum,
  vörurakningarlínum, frátektarfærslum eða Uppsetningu birgða í gegnum almennar gagnaaðgerðir
  Bifröst; hún notar aðgerðir þessa forrits, sem halda eigin athugunum Business Central.
- **Skilaboðategundir.** Aðgerðirnar sem þetta forrit bætir við eru taldar upp með öllum hinum af
  MCP-verkfærunum (`list_domains`, `describe_domains`, `describe_message_type`) og á síðunni
  **Bifrost Message Types**, og hver þeirra útskýrir sig sjálf með `Help.Implementation.Get`.
