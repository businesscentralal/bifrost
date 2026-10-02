---
id: index
title: "Bifröst fjárstýring Íslands"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Tengir Business Central við Landsbankann, Arion banka, Íslandsbanka, Kviku banka og Sparisjóðina: yfirlit, greiðslur, kröfur, kort og rafræn skjöl."
---

# Bifröst fjárstýring Íslands

**Íslensku bankarnir þínir, inni í Business Central.** Sæktu yfirlit, sendu greiðslur og haltu utan um
kröfur hjá Landsbankanum, Arion banka, Íslandsbanka, Kviku banka og Sparisjóðunum án þess að fara út
úr Business Central.

Allir bankarnir virka eins gegnum Bifröst, svo ferli, samþætting eða aðstoðarmaður nær til hvers
banka á sama hátt. Þú setur aðeins upp þá banka sem þú notar.

*Viðbótarforrit ofan á [Bifröst Foundation](/foundation/), fyrir fyrirtæki á Íslandi. Nýr notandi
Bifrastar? Byrjaðu á [Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert

- **Lesið bankayfirlit inn í afstemmingu.** Hjá Landsbankanum, Arion banka og Sparisjóðunum er
  yfirlit lesið beint inn í **Bankareikningsafstemmingu** og þú sérð samantekt yfir línur og
  stöður. Landsbankinn og Arion banki geta lesið inn kortafærslur á sama hátt.
- **Lesið yfirlit, reikninga og stöður.** Lesið reikningsyfirlit hjá öllum bönkunum og flett upp eða
  staðfest reikninga. Landsbankinn gefur einnig dagslokastöður og Íslandsbanki viðskiptasögu
  verðbréfa.
- **Sent greiðslur.** Sent bunka innlendra greiðslna hjá öllum bönkunum og sótt niðurstöðuna.
  Landsbankinn, Arion banki og Íslandsbanki taka einnig við erlendum greiðslum.
- **Stofnað kröfur og fylgt þeim eftir.** Stofnað og fellt niður kröfur, breytt þeim þar sem bankinn
  leyfir það og séð greiðslur sem borist hafa inn á þær.
- **Unnið með kort, skjöl og gengi.** Kortafærslur og kortalyklar hjá Landsbankanum, kreditkort hjá
  Arion banka og Sparisjóðunum, rafræn skjöl hjá Landsbankanum og Arion banka, og gengi hjá öllum
  bönkunum.
- **Afstemmt eftir tímaáætlun.** Fjárstýringin sækir yfirlitið og bankaafstemming Foundation parar
  það. Með [Orchestrator](/orchestrator/) keyrir sama ferli sjálfkrafa, til dæmis á hverjum morgni,
  og segir þér hvað paraðist ekki. Sjá
  [What it covers, and how it grows](/documentation/how-it-works/#what-it-covers-and-how-it-grows).

## Fáðu það

Settu **Bifrost Iceland Treasury** upp við hlið Bifröst Foundation, af AppSource eða gegnum
samstarfsaðila. Það krefst Business Central 28.0 eða nýrra, Essentials eða Premium.

## Settu það upp

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Gerðu samning við hvern banka um þær þjónustur sem þú notar og fáðu notandanafn, lykilorð og skilríki eða lykla sem hann gefur út. | Fjármálasvið, með bankanum |
| 2 | Leyfðu útsendar HTTP-beiðnir fyrir Bifröst-forrit, einu sinni, í **uppsetningarleiðsögn Bifrastar** í Foundation. | Kerfisstjóri Business Central |
| 3 | Keyrðu **Bifröst Ísland Fjárstýring - Bankauppsetning** úr **Leiðsögn við uppsetningu**. Ein leiðsögn nær yfir alla fimm bankana; skráðu notandanafn fyrirtækisins og leyndarmál fyrir bankana sem þú notar. | Kerfisstjóri Business Central |
| 4 | Fyrir kröfur hjá Landsbankanum, Arion banka eða Sparisjóðunum: skráðu kröfuauðkenni bankans á greiðslumátann. Fyrir innlestur yfirlita: veldu innlestrarsnið bankans á bankareikningi Business Central. | Kerfisstjóri Business Central |
| 5 | Gefðu hverjum notanda eða þjónustu heimildasettin fyrir það sem hann má gera hjá bankanum. Notendur sem skrá sig inn sem þeir sjálfir skrá eigin bankaaðgang. | Kerfisstjóri Business Central, síðan hver notandi |

Leiðbeiningar skref fyrir skref eru í hjálpinni í forritinu:
[Uppsetningarleiðsögn fjárstýringar](/help/iceland-treasury/treasury-setup-wizard/),
[Uppsetning Bifröst Ísland Fjárstýringar](/help/iceland-treasury/treasury-setup/),
[Leyndarmál banka](/help/iceland-treasury/treasury-secrets/),
[Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/) og
[Greiðslumátar](/help/iceland-treasury/payment-methods/).

Hvað hver banki þarf og nær yfir: [Landsbankinn](./banks/landsbankinn),
[Arion banki](./banks/arion), [Íslandsbanki](./banks/islandsbanki), [Kvika banki](./banks/kvika)
og [Sparisjóðir](./banks/sparisjodir).

## Gott að vita

- **Það vinnur sem þú.** Kall notar eigin bankaaðgang notandans ef hann hefur skráð hann, annars
  sjálfgefin gildi fyrirtækisins. Hvert kall er skráð.
- **Lykilorð, skilríki og lyklar** eru slegin inn í huldum gluggum og geymd í dulkóðaðri geymslu
  forritsins sjálfs. Þau eru aldrei skrifuð í töflu eða sýnd í svari. Uppsetningarsíðan sýnir
  upplýsingar um skilríkin, svo þú sjáir hvenær þarf að endurnýja þau.
- **Greiðslur og kröfur hreyfa fé.** Þær eru á bak við eigin heimildasett, svo notandi getur fengið
  að lesa yfirlit án þess að mega greiða. Prófaðu þær fyrst í prófunarfyrirtæki.
- **Beiðnir eru undirritaðar.** Landsbankinn, Arion banki, Kvika banki og Sparisjóðirnir undirrita
  hverja beiðni með biðlaraskilríki, gegnum Draupni. Íslandsbanki notar aðeins notandanafn og
  lykilorð.
- **Að færa þig frá eldri Cloud Events bankaforritunum?** Gögn eru tekin yfir við uppsetningu, en
  geymd lykilorð og skilríki flytjast ekki. Skráðu þau aftur eftir skiptin.

## Finndu aðgerðirnar

Uppsettar skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með
MCP-tólunum `list_message_types` og `describe_message_type`, eða á síðunni Bifrost Message Types.

- [Draupnir-undirritarar](./reference/draupnir-signers): hvernig beiðnir til bankanna eru undirritaðar
- [Notendasviðsmyndir fyrir AppSource](./user-scenarios) · [Texti AppSource-skráningar](./listing)
- Heimildasett: eitt fyrir hvert svið sem les eða hreyfir fé hjá hverjum banka, talin upp á síðu
  hvers banka. Fullt sett fyrir hvern banka víkkar `BIFROST Full ori` í Foundation, til dæmis
  `BIFROST LBFull ori` fyrir Landsbankann.
