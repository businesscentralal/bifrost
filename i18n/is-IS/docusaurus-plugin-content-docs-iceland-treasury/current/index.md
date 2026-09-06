---
id: index
title: "Bifröst fjárstýring Íslands"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Tengingar við íslenska banka sem Bifrastar-skilaboðagerðir: Landsbankinn, Arion, Íslandsbanki, Kvika og Sparisjóðir á sameiginlegri IOBS-undirritunarumgjörð."
---

Bifröst fjárstýring Íslands tengir Business Central við íslensku bankana. Hún byggir á Bifröst Foundation og birtir kröfur, greiðslur, yfirlit, reikninga, kort, gengi og rafræn skjöl sem skilaboðagerðir, þannig að ytra kerfi, MCP-biðlari eða ferli í Business Central nái til hvers banka gegnum sama biðraðar-, verk- og gagnamynstur og önnur Bifrastar-forrit.

Undir liggur **Draupnir**, undirritunarumgjörð IOBS (Icelandic Online Banking Standard, *Sambankaskema*). Sérhver bankaeining byggir WS-Security-undirrituð SOAP-umslög sín gegnum sama viðmót, svo ný bankatenging erfir flutninginn í stað þess að útfæra hann upp á nýtt.

## Einingar

| Eining | Hvað hún nær yfir |
| --- | --- |
| **Draupnir** | Undirritunarumgjörð IOBS — sex undirritunarsnið á bak við eitt viðmót. Sjálf ekki bankatenging. |
| **Landsbankinn** | Kröfur og kröfuskeyti, kröfusniðmát, kort og kortalyklar, reikningar, eignasöfn, gengi og vextir, rafræn skjöl, færsluhirðingaruppgjör, innlendar og erlendar greiðslur, og innlestur og afstemming bankayfirlita. |
| **Arion** | Fyrirspurnir um reikninga, yfirlit, greiðsluseðla og kreditkort, innheimtukröfur og kröfuskeyti, innlendar og erlendar greiðslur, erlend yfirlit, gengi, innsendingu rafrænna skjala og afstemmingu bankayfirlita. |
| **Íslandsbanki** | 23 skilaboðagerðir yfir B2B SOAP-þjónusturnar: reikningsyfirlit, gengi, staðfesting reiknings, ógreiddir reikningar, greiðsluskeyti, debetkortafærsla, kröfur, milliinnheimta, erlendar greiðslur, innsending skráa og viðskiptasaga verðbréfa. |
| **Kvika banki** | 11 skilaboðagerðir yfir IOBS-þjónustur netbanka Kviku: kröfufyrirspurnir og ósamstilltar skeytaaðgerðir, reikningsyfirlit, gengi, greiðsluskeyti og niðurstöðuskeyti greiðslna. |
| **Sparisjóðir** | 26 skilaboðagerðir yfir Sambankaskema 2013 hjá Sparisjóðunum: yfirlit, kröfur og ósamstillt kröfuskeyti, greiðslur, gengi, reikningar, greiðsluseðlar, kreditkort og lestur beiðnaskrár, auk innlesturs yfirlita í bankaafstemmingu gegnum gagnaskiptaskilgreiningu. |

Hver eining hefur sínar eigin hjálparkóðaeiningar eftir sviðum, svo `Help.Implementation.Get` svarar fyrir hverja skilaboðagerð með nákvæmum beiðni- og svarsamningi hennar.

## Hvernig það virkar

1. Settu upp Bifröst Foundation og því næst Bifröst fjárstýringu Íslands.
2. Virkjaðu útsendar HTTP-biðlarabeiðnir fyrir viðbótina.
3. Stilltu þá banka sem fyrirtækið notar á uppsetningarsíðu Bifrastar. Skilríki og aðgangsupplýsingar eru skráð í sameiginlegu leyndarmálageymslu Foundation og rata aldrei í töflu.
4. Kallendur senda Bifrastar-skilaboð sem nefna skilaboðagerð banka; Draupnir undirritar umslagið og einingin talar við bankann.

## Ósamstilltar skeytaaðgerðir

Kröfuskeytaaðgerðir hjá Kviku, Sparisjóðunum og Íslandsbanka eru ósamstilltar: bankinn skilar auðkenni aðgerðar og niðurstaðan er sótt á eftir með `getOperationResult`. Kallandi sendir skeytið, geymir auðkennið og spyr um stöðu — hann bíður ekki eftir bankanum.

## Heimildasett

Skilaboðagerðir sem hreyfa fé eða stöðu liggja á bak við hliðtöflur, eitt heimildasett á hvert hlið, svo hægt er að veita lestur yfirlita án þess að veita heimild til að framkvæma greiðslur. Hver eining býður líka fullt sett sem víkkar `BIFROST Full ori` í Foundation — `BIFROST IBFull ori`, `BIFROST KVFull ori`, `BIFROST SPFull ori` og samsvarandi sett fyrir Landsbankann og Arion — og Sparisjóðirnir bæta við lesheimildasetti fyrir kröfur sem víkkar `BIFROST Read ori`.

## Í stað útgefnu forritanna

Fjárstýring Íslands er arftaki fimm útgefinna eða sérsniðinna Cloud Events forrita: *Origo Cloud Events Landsbankinn*, *Origo Cloud Events Arionbanki*, og sérsniðnu forritanna *Cloud Events Íslandsbanki*, *Cloud Events Kvika banki* og *Cloud Events Sparisjóðir*. Hver eining hefur sína uppsetningarkóðaeiningu sem tekur yfir gögn forvera síns við fyrstu uppsetningu meðan bæði forritin eru uppsett hlið við hlið, þar með talin svæði á sameiginlegum grunntöflum og úthlutuð heimildasett.

Geymdar aðgangsupplýsingar flytjast **ekki** yfir — Isolated Storage er bundið hverri viðbót og arftakinn er nýtt forrit. Skilríki og lykilorð eru skráð aftur eftir skiptin.

## Kröfur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra, Essentials eða Premium.
- Bifröst Foundation, fáanlegt sérstaklega á AppSource.
- Samning við bankann um þær þjónustur sem eru í notkun, ásamt þeim skilríkjum og aðgangsupplýsingum sem hann gefur út.
- Útsendar HTTP-biðlarabeiðnir virkjaðar fyrir viðbótina.

## Hvert næst

- [Hjálp í kerfinu](/help/iceland-treasury/)
- [Uppflettirit skilaboðagerða](./reference/message-types/) — beiðni- og svarsamningur hverrar gerðar, myndaður úr forritinu sjálfu
- [Byggja ofan á Bifröst](/extensibility/)
