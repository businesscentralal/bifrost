---
id: index
title: "Bifröst vöruhús"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Vöruhúsavinna í Business Central úr aðstoð eða samþættingu — móttökur, frágangur, tínsla, afhendingar og innihald hólfa."
---

# Bifröst vöruhús

**Vinndu vöruhúsaverkin í Business Central úr aðstoðinni eða kerfinu sem þú notar nú þegar.** Bifröst
vöruhús gerir skannaforriti, vöruhúsakerfi, samþættingu eða gervigreindaraðstoð kleift að taka á móti
vörum, ganga frá þeim, tína þær og afhenda, og sjá hvað er í hverju hólfi.

Hver aðgerð keyrir eigin vöruhúsarökfræði Business Central, nákvæmlega eins og ef starfsmaður í
vöruhúsi ynni verkið, og niðurstöðurnar birtast á stöðluðum síðum Business Central:
vöruhúsamóttökum og vöruhúsaafhendingum, tínslum og frágangi, skráðum og bókuðum skjölum þeirra og
innihaldi hólfa.

*Viðbótarforrit ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert {#what-you-can-do}

- **Séð stöðuna í vöruhúsinu.** Lestu innihald hvers hólfs eftir vöru, birgðageymslu, hólfi og
  afbrigði, og sjáðu opnar tínslur, fráganga og aðra vöruhúsavirkni, með línum ef þarf.
- **Tekið á móti vörum.** Stofnaðu vöruhúsamóttökur úr útgefnum innkaupapöntunum,
  söluskilapöntunum og millifærslupöntunum, forskoðaðu bókunina og bókaðu móttökuna.
- **Gengið frá vörum.** Stofnaðu frágang fyrir bókaða móttöku og skráðu hann þegar vörurnar eru komnar
  í hillu.
- **Tínt vörur.** Stofnaðu tínslu fyrir vöruhúsaafhendingu og skráðu hana þegar vörurnar hafa verið
  tíndar.
- **Afhent vörur.** Stofnaðu vöruhúsaafhendingar úr útgefnum sölupöntunum og millifærslupöntunum,
  forskoðaðu bókunina og bókaðu afhendinguna, með eða án þess að reikningsfæra sölupöntunina.

## Svið {#capabilities}

| Lén | Svið |
|---|---|
| **Warehouse** | Innihald hólfa og opin vöruhúsavirkni, vöruhúsamóttökur og -afhendingar frá stofnun gegnum forskoðun til bókunar, tínsla og frágangur frá stofnun til skráningar |

## Sæktu forritið {#get-it}

Settu **Bifrost Warehouse** upp við hlið Bifröst Foundation, af [AppSource](https://marketplace.microsoft.com/en-US/product/dynamics-365-business-central/PUBID.origo%7CAID.origo_bifrost_warehouse%7CPAPPID.47acac54-3873-496f-9e88-157f36413e89) eða í gegnum Business
Central samstarfsaðilann þinn. Það þarf Business Central 28.3 eða nýrra, Essentials eða Premium, og
Bifröst Foundation 28.0.3.530 eða nýrra. Hafðu samband við Business Central samstarfsaðilann þinn
varðandi verð.

## Uppsetning {#set-it-up}

Bifröst vöruhús hefur enga uppsetningarsíðu.

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Settu upp Bifröst Foundation og ljúktu uppsetningu þess, og settu síðan upp **Bifrost Warehouse**. | Kerfisstjóri Business Central |
| 2 | Gakktu úr skugga um að fólk og þjónustur sem kalla á forritið hafi `BIFROST Read ori` eða `BIFROST Full ori` úr Bifröst; Bifröst vöruhús bætir heimildum sínum við þau söfn. Lestur þarf `BIFROST Read ori`; til að stofna móttökur, afhendingar, tínslur og fráganga þarf `BIFROST Full ori`. | Kerfisstjóri Business Central |
| 3 | Úthlutaðu **Bókunarhlið vörugeymslu** (`BIFROST WhsePost ori`) aðeins þeim sem mega bóka móttökur og afhendingar og skrá tínslur og fráganga. | Kerfisstjóri Business Central |
| 4 | Úthlutaðu líka **Reikningshlið vörugeymslu** (`BIFROST WhseInv ori`) þeim sem mega reikningsfæra sölupöntunina þegar afhending er bókuð. | Kerfisstjóri Business Central |
| 5 | Athugaðu uppsetninguna í Business Central sem verkin þurfa: birgðageymslur sem krefjast móttöku, afhendingar, tínslu og frágangs, hólf, starfsmenn vöruhúss og bókunaruppsetningu upprunaskjalanna. | Kerfisstjóri Business Central eða samstarfsaðili |

## Gott að vita {#good-to-know}

- **Það vinnur sem þú.** Hvert kall keyrir með eigin heimildum þess sem kallar í Business Central og
  er skráð á **Bifrost Messages**.
- **Bókun er sérstök heimild.** Til að bóka móttökur og afhendingar og skrá tínslur og fráganga þarf
  `BIFROST WhsePost ori` til viðbótar við lestrar- og skrifheimildirnar, og til að reikningsfæra
  afhendingu þarf líka `BIFROST WhseInv ori`. Samþætting getur stofnað vöruhúsaskjöl án þess að geta
  bókað þau.
- **Forskoðun breytir engu.** Forskoðun móttöku eða afhendingar sýnir færslurnar sem bókun myndi búa
  til og afturkallar svo allt.
- **Vöruhúsaskjölum er aðeins breytt með þessum aðgerðum.** Aðstoð getur ekki breytt vöruhúsamóttökum,
  -afhendingum eða vöruhúsavirkni í gegnum almennar gagnaaðgerðir Bifröst; hún notar aðgerðir þessa
  forrits, sem halda eigin athugunum Business Central.
- **Skilaboðategundir.** Aðgerðirnar sem þetta forrit bætir við eru taldar upp með öllum hinum af
  MCP-verkfærunum (`list_domains`, `describe_domains`, `describe_message_type`) og á síðunni
  **Bifrost Message Types**, og hver þeirra útskýrir sig sjálf með `Help.Implementation.Get`.
