---
id: user-scenarios
title: "Notendasviðsmyndir fyrir AppSource"
sidebar_label: "Notendasviðsmyndir"
sidebar_position: 8
description: "Sviðsmyndir sem staðfestingarteymi Microsoft keyrir til að votta viðbótina fyrir AppSource."
---

**Útgefandi:** Origo
**Útgáfa:** 28.0.0.0
**Prófunarumhverfi:** Íslenskt BC-sandbox með IS Core-staðfærslu.

Prófandinn vinnur gegnum gervigreindaraðstoðarmann sem er tengdur Business Central með MCP-þjóni
Bifrastar (sjá [Tengdu gervigreindaraðstoðarmanninn](/setup/connect-your-ai/)), eða kallar á Bifröst úr öðrum
biðlara. Hvert skref segir hvað á að biðja um og hvað á að staðfesta í Business Central eða í svarinu.
Uppsettar aðgerðir og samningar þeirra eru alltaf listaðir með MCP-tólunum `list_message_types` og
`describe_message_type`, eða á síðunni Bifrost Message Types.

## Prófunarskilríki

Opinberar þjónustur Seðlabankans og island.is þurfa engin skilríki. Skatturinn, Skilagrein og SMS
krefjast prófunarskilríkja sem taka við gervigögnum án raunverulegra skattalegra afleiðinga.

## Sviðsmynd 1: Uppsetning og virkjun

Settu upp Bifröst Foundation og Bifröst Iceland í hreinu íslensku sandboxi. Opnaðu Uppsetning
Bifröst Ísland og staðfestu að flipar fyrir Umsjá, SMS, Skattinn, Skilagrein og Já Gagnatorg birtist.
Opnaðu síðuna Bifrost Message Types og staðfestu að íslensku aðgerðirnar séu skráðar.

## Sviðsmynd 2: Íslensku aðgerðirnar fundnar

Spyrðu aðstoðarmanninn: „Hvaða íslensku þjónustur getur þú notað í Business Central?" Svarið skal
lista íslensku aðgerðirnar flokkaðar eftir þjónustu, með stuttri lýsingu á hverri.

## Sviðsmynd 3: Íslenskir frídagar

Biddu um lista yfir almenna frídaga á Íslandi árið 2026 og spyrðu hvort 25. desember 2026 sé
frídagur. Fyrra svarið skal innihalda frídaga ársins með íslenskum heitum og það síðara staðfesta
að dagurinn sé frídagur.

## Sviðsmynd 4: Póstnúmeraskrá

Biddu um íslensku póstnúmeraskrána. Svarið skal innihalda póstnúmer, staðarheiti og sveitarfélag,
þar á meðal 101 fyrir Reykjavík.

## Sviðsmynd 5: ISO-gjaldmiðlar

Biddu um ISO 4217-gjaldmiðlalistann. Svarið skal innihalda ISK, EUR, USD og aðra gjaldmiðla ásamt
kóða, heiti og tölukóða.

## Sviðsmynd 6: Gengi Seðlabanka

Biddu um gengi Seðlabankans 1. júlí 2026 og daglegt gengi í júní 2026. Svörin skulu innihalda gengi
gjaldmiðla gagnvart ISK fyrir dagsetninguna og alla daga mánaðarins.

## Sviðsmynd 7: Gengi uppfært í Business Central

Biddu aðstoðarmanninn að uppfæra gengi Business Central frá Seðlabankanum fyrir 1. júlí 2026. Opnaðu
síðan Gengi gjaldmiðla í Business Central og staðfestu að nýtt gengi sé skráð fyrir dagsetninguna.

## Sviðsmynd 8: Vextir og vísitala neysluverðs

Spyrðu um núgildandi vexti Seðlabankans, nýjustu vísitölu neysluverðs og núgildandi dráttarvexti.
Svörin skulu innihalda stýrivexti, vísitöluna með 12 mánaða verðbólgu og dráttarvexti.

## Sviðsmynd 9: Kennitölusannprófun

Spyrðu hvort 4502692829 og 1234567890 séu gildar kennitölur. Gild kennitala skal staðfest með
upplýsingum um hvort hún tilheyri einstaklingi eða fyrirtæki; ógild kennitala skal fá skýra
villulýsingu.

## Sviðsmynd 10: Uppfletting ökutækis

Biddu um upplýsingar um ökutækið með númerinu AA001. Svarið skal innihalda upplýsingar um ökutækið
eða segja skýrt að það hafi ekki fundist, án óvæntrar villu.

## Sviðsmynd 11: Villuprófun VSK-skýrslu

Skráðu kennitölu prófunarfyrirtækis og prófunarlykilorð Skattsins, með biðlarategundina Prófun.
Spyrðu hvaða VSK-númer Skatturinn hafi fyrir fyrirtækið, biddu um tímabilsupplýsingar janúar 2026 og
biddu aðstoðarmanninn að villuprófa VSK-skýrslu fyrir tímabilið. Staðfestu VSK-númer,
tímabilsupplýsingar og sundurliðaða niðurstöðu villuprófunar.

## Sviðsmynd 12: Innsending VSK og kvittun

Biddu aðstoðarmanninn að senda villuprófuðu skýrsluna til prófunarþjónustu Skattsins og sæktu
kvittunina sem PDF. Biddu síðan um að prófunarskilunum sé eytt (aðeins hægt í prófunarumhverfi).

## Sviðsmynd 13: Staðgreiðsla

Spyrðu hvaða staðgreiðslutímabil séu opin og biddu um villuprófun staðgreiðsluskila fyrir eitt
prófunartímabil. Staðfestu að tímabil og villuboð komi rétt til baka.

## Sviðsmynd 14: Fjármagnstekjuskattur

Spyrðu hvaða tímabil fjármagnstekjuskatts megi skila og hvaða tekjutegundir séu notaðar. Staðfestu
tímabil og tegundir.

## Sviðsmynd 15: SMS

Biddu aðstoðarmanninn að senda SMS á prófunarnúmer og spyrðu svo hvort það hafi borist. Staðfestu
að skilaboðanúmer og afhendingarstaða komi fram.

## Sviðsmynd 16: Lífeyrissjóður og stéttarfélag

Biddu aðstoðarmanninn að sækja lífeyrissjóði, stéttarfélög og innheimtuaðila úr Skilagrein. Svörin
skulu innihalda gildar upplýsingar og sömu gögn skulu birtast á grunngagnasíðum Skilagreinar.

## Sviðsmynd 17: Ógild skilríki Skattsins

Settu viljandi inn rangt lykilorð og spyrðu um VSK-númer fyrirtækisins. Svarið skal vera skipulögð
villa um að auðkenning hafi mistekist, án þess að lykilorð birtist.

## Sviðsmynd 18: Þjónusta óaðgengileg

Láttu ytri þjónustu vera óaðgengilega (til dæmis með því að banna útsendar HTTP-beiðnir fyrir
viðbótina) og endurtaktu beiðnina. Staðfestu að Bifröst skili skýrri, skipulagðri villu.

## Sviðsmynd 19: Lágmarksheimildir

Tengdu aðstoðarmanninn sem notanda með `BIFROST Full ori` og D365 BASIC og biddu um frídaga ársins.
Staðfestu að aðgerðin virki.

## Sviðsmynd 20: Engar heimildir

Tengdu aðstoðarmanninn sem notanda með aðeins D365 BASIC og biddu um aðgerð sem krefst íslenskra
heimilda. Notandinn skal fá skýra heimildavillu og engin gögn skulu birtast eða breytast.

## Sviðsmynd 21: Fjarlæging viðbótar

Fjarlægðu viðbótina í Extension Management og staðfestu að íslensku aðgerðirnar hverfi af síðunni
Bifrost Message Types og að Bifröst Foundation virki áfram.

## Hreinsun

Eyddu prófunarskilum hjá Skattinum, hreinsaðu prófunarskilríki með Hreinsa-aðgerðunum á Uppsetning
Bifröst Ísland og fjarlægðu viðbótina ef það hefur ekki þegar verið gert.
