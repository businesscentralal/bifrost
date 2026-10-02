---
id: index
title: "Bifröst Iceland DocEx"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Rafræn skjalaskipti fyrir Business Central gegnum Advania, Unimaze og InExchange, með Peppol BIS 3.0 gögnum og UBL-myndun."
---

# Bifröst Iceland DocEx

**Sendu og taktu á móti rafrænum reikningum úr Business Central.** Bifröst Iceland DocEx tengir
Business Central við skjalaskiptanet Advania, Unimaze og InExchange, á Peppol BIS 3.0 sniði.

Mótteknir reikningar berast sem innkomandi skjöl í Business Central, tilbúnir til að verða
innkaupaskjöl. Uppsetningin og skrefin eru þau sömu, sama á hvaða neti þú ert.

*Viðbótarforrit ofan á [Bifröst Foundation](/foundation/), fyrir fyrirtæki á Íslandi. Nýr notandi
Bifrastar? Byrjaðu á [Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert

- **Tekið á móti reikningum sem innkomandi skjölum.** Móttekið skjal verður innkomandi skjal í
  Business Central, sem síðan má vinna áfram með getu Foundation fyrir innkomandi skjöl. Hvert skjal
  er aðeins stofnað einu sinni og verður síðan að innkaupaskjali eða færslubókarlínum, eftir því
  hvernig lánardrottinn er stilltur.
- **Sent reikninga og önnur skjöl.** Sent reikninga, kreditreikninga, pantanir, afhendingartilkynningar
  og yfirlit úr skjölum Business Central, sem UBL 2.1 XML á Peppol BIS 3.0 sniði.
- **Fylgst með hverju skjali.** Skoðað innhólf og send skjöl, lesið stöðu og sögu skjals og sótt PDF
  þess. Með Unimaze má einnig skrá greiðslu eða höfnun.
- **Fundið viðskiptafélaga.** Flett upp kaupendum, seljendum og viðskiptafélögum á netinu áður en þú
  sendir.
- **Bókað innkomandi línur á rétta reikninga.** Varpað línum lánardrottins á fasta fjárhagsreikninga
  eftir VSK-prósentu, og þýtt Peppol-kóða yfir í kóðana sem fyrirtækið notar.

## Fáðu það

Settu **Bifrost Iceland DocEx** upp við hlið Bifröst Foundation, af AppSource eða gegnum
samstarfsaðila. Það krefst Business Central 28.0 eða nýrra, Essentials eða Premium.

## Settu það upp

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Fáðu aðgangsupplýsingar frá að minnsta kosti einu neti: Advania, Unimaze eða InExchange. Peppol-viðmiðunargögnin þurfa engar. | Fjármálasvið, með þjónustuaðila netsins |
| 2 | Leyfðu HTTP-beiðnir fyrir viðbótina í **uppsetningarleiðsögn Bifrastar** í Foundation (einnig opnuð með **Uppsetningarleiðsögn** á uppsetningarsíðu skjalaskipta). | Kerfisstjóri Business Central |
| 3 | Á **Uppsetning Bifröst** skaltu opna **Uppsetning skjalaskipta**. Veldu Live eða Test fyrir hvert net sem þú notar, skráðu aðgangsupplýsingar þess og prófaðu tenginguna. | Kerfisstjóri Business Central |
| 4 | Ef þú tekur á móti reikningum: veldu **Uppfæra BII-gagnaskiptaskilgreiningar** og fylltu síðan út BIS30-kóðavörpunina og VSK-fjárhagsreikningsvörpunina. | Kerfisstjóri Business Central eða samstarfsaðili |
| 5 | Gefðu hverjum notanda eða þjónustu sem sendir eða tekur á móti skjölum `BIFROST Full ori`; forritið bætir hlutum sínum við það og við stöðluðu D365-heimildasettin. | Kerfisstjóri Business Central |

Leiðbeiningar skref fyrir skref eru í hjálpinni í forritinu:
[Uppsetning Bifröst DocEx](/help/iceland-docex/docex-setup/),
[BIS30 kóðavörpun](/help/iceland-docex/bis30-code-map/) og
[VSK fjárhagsreikningsvörpun lánardrottins](/help/iceland-docex/vend-vat-gl-map/).

## Gott að vita

- **Það vinnur sem þú.** Kall getur aðeins gert það sem þínar eigin heimildir leyfa.
- **Aðgangsupplýsingar eru geymdar fyrir hvert net og hvert umhverfi** í leyndarmálageymslu Bifröst
  Foundation, svo prófunarlykill er aldrei notaður í raunkall. Uppsetningarsíðan sýnir aðeins hvort
  gildi sé geymt.
- **Hvert kall til nets er skráð** í beiðnaskrá Bifrastar, með aðgangsupplýsingarnar huldar, svo
  rekja megi misheppnuð samskipti.
- **Sending skjals er raunveruleg.** Í Live-umhverfi fer það til viðtakandans. Prófaðu sendingu fyrst
  í Test-umhverfinu.
- **Að færa þig frá Origo Cloud Events DocEx?** Settu þetta forrit upp við hliðina á því.
  Kóðavarpanir og VSK-fjárhagsreikningsvarpanir eru afritaðar, en aðgangsupplýsingar flytjast ekki.
  Skráðu þær aftur.

## Finndu aðgerðirnar

Uppsettar skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með
MCP-tólunum `list_message_types` og `describe_message_type`, eða á síðunni Bifrost Message Types.

- [Notendasviðsmyndir fyrir AppSource](./user-scenarios) · [Texti AppSource-skráningar](./listing)
- Heimildasett: víkkar út `BIFROST Full ori` (`DocEx Full ori`) og stöðluðu D365-settin.
