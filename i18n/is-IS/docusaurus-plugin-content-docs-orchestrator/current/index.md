---
id: index
title: "Bifröst stjórnandi"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Tímasetning, eftirlit og endurræsing vinnsluraða í Business Central, auk keðja sem tengja aðgerðir Business Central saman í föst ferli."
---

# Bifröst stjórnandi

**Föst ferli sem keyra sig sjálf, og vinnsluröð sem gætir sín sjálf.** Bifröst stjórnandi (Bifrost
Orchestrator) tengir aðgerðir Bifröst saman í keðjur, keyrir þær eftir tímaáætlun, hefur eftirlit með
vinnsluraðafærslunum þínum og lætur þig vita þegar eitthvað bregst.

Þessi síða er fyrir þau sem ákveða að nota forritið og setja það upp. Bifröst stjórnandi er
viðbótarforrit ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).

## Hvað þú getur gert {#what-you-can-do}

- **Breytt föstu ferli í keðju.** Keðja er listi af skrefum, hvert þeirra aðgerð í Business Central,
  þar sem svar eins skrefs nærir það næsta: finndu pantanir sem eru komnar fram yfir dagsetningu, losaðu
  þær og láttu réttan aðila vita. Enginn kóði.
- **Keyrt hana þegar hún á að keyra.** Með **Keyra núna**, eftir tímaáætlun í gegnum vinnsluröðina, eða
  þegar aðstoðarmaður eða annað kerfi biður um það.
- **Hætt að vakta vinnsluröðina.** Bifröst stjórnandi hefur eftirlit með vinnsluraðafærslum, endurræsir
  þær þegar þær bregðast og reynir aftur eftir reglunum sem þú setur.
- **Fengið að vita þegar það skiptir máli.** Tölvupóstur eða Telegram-skilaboð þegar verk bregst eða er
  endurræst, og Telegram-skilaboð frá aðstoðarmanni þegar þú biður um þau.
- **Séð hvað gerðist.** Hver keyrsla keðju er geymd, skref fyrir skref, með því sem hvert skref sendi og
  fékk.
- **Keyrt skýrslur eftir þörfum.** Aðstoðarmaður eða keðja getur fundið skýrslu, keyrt hana með
  valkostunum sem hún gefur eða með vistuðum forsendum beiðnisíðu, og vistað hana sem PDF, Excel, Word
  eða XML, með útliti sem er valið fyrir þá keyrslu eingöngu. Útlit skýrslna má telja upp, flytja út og
  flytja inn.

Keðjur geta kallað á aðgerðir allra uppsettra Bifröst-forrita, svo hvert forrit sem þú bætir við gefur
föstu ferlunum þínum meira að vinna með. Aðstoðarmaður getur líka smíðað keðju með þér í samtali.

## Svið {#capabilities}

| Lén | Svið |
|---|---|
| **Orchestrator** | Eftirlit með og endurræsing vinnsluraðafærslna, keyrsla og tímasetning keðja, keyrsla og vistun skýrslna og umsjón með útliti þeirra, og sending Telegram-skilaboða og tölvupósts |

## Sæktu forritið {#get-it}

Settu **Bifrost Orchestrator** upp við hlið Bifröst Foundation, af [AppSource](https://marketplace.microsoft.com/en-US/product/dynamics-365-business-central/PUBID.origo%7CAID.origo_bifrost_orchestrator%7CPAPPID.7da3f512-5c19-47cd-bbe4-4c2bc713f1db) eða í gegnum Business
Central samstarfsaðilann þinn. Það þarf Business Central 28.0 eða nýrra. Um verð: hafðu samband við
Business Central samstarfsaðilann þinn.

## Uppsetning {#set-it-up}

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Á **Uppsetning Bifröst** skaltu keyra uppsetningarleiðsögnina ef tilkynning biður þig um það. Hún leyfir Bifröst-forritunum að senda HTTP-beiðnir, sem tilkynningar og ytri þjónustur þurfa. | Kerfisstjóri Business Central |
| 2 | Keyrðu aðstoðuðu uppsetninguna **Uppsetning Bifröst stjórnanda** til að ræsa stjórnunarvinnsluraðafærsluna. | Kerfisstjóri Business Central |
| 3 | Fyrir Telegram-tilkynningar skaltu skrá vélmennislykilinn (frá `@BotFather` í Telegram) með **Skrá Telegram-vélmennislykil** á **Uppsetning Bifröst stjórnanda**, og Telegram-spjallauðkenni hvers og eins í Bifröst-notandauppsetningu hans. Fyrir tölvupósttilkynningar skaltu setja upp tölvupóstreikning í Business Central. | Kerfisstjóri Business Central |
| 4 | Settu vinnsluraðafærslurnar sem Bifröst stjórnandi á að hafa eftirlit með undir hann með **Bæta við Bifröst stjórnandann**, og veldu hvernig hver þeirra tilkynnir. | Kerfisstjóri Business Central |
| 5 | Smíðaðu keðjur, prófaðu þær með **Keyra núna** og tímasettu síðan þær sem eiga að keyra sjálfar. | Eigandi ferlisins |

Hjálp hverrar síðu segir nánar frá:
[Uppsetning Bifröst stjórnanda](/help/orchestrator/orchestrator-setup/),
[aðstoðaða uppsetningin](/help/orchestrator/scheduler-setup-wizard/),
[Bifröst keðjur](/help/orchestrator/playbooks/) og
[Spjald vinnsluraðarafærslu](/help/orchestrator/scheduled-entry-card/).

### Heimildasöfn {#permission-sets}

| Safn | Fyrir |
|---|---|
| `BIFROST Orchestr ori` | Fulla notkun forritsins: allt hér fyrir neðan |
| `BIFROST OrchSet ori` | Kerfisstjórana sem viðhalda uppsetningunni, auðkennum biðlara, endurtekningarsniðmátum og leyndarmálum forritsins |
| `BIFROST OrchMgt ori` | Þau sem fylgjast með, keyra og endurræsa verk undir eftirliti, án þess að breyta uppsetningunni |
| `BIFROST PlaybAdm ori` | Þau sem smíða, keyra og tímasetja keðjur |
| `BIFROST PlaybVw ori` | Þau sem aðeins skoða keðjur og keyrsluskrá þeirra |

Úthlutaðu þeim ásamt þeim Bifröst-söfnum sem fólk notar Bifröst með; sjá
[Heimildasöfn og hlið](/documentation/end-customers/permissions/). Til að tímasetja verk þarf líka
hefðbundnar vinnsluraðaheimildir Business Central.

## Gott að vita {#good-to-know}

- **Keðja keyrir með heimildum notandans sem keyrir hana**; tímasett keðja með heimildum notandans sem
  vinnsluraðafærsla hennar keyrir sem. Hvert skref er skráð á **Bifrost Messages** auk keyrsluskrár
  keðjunnar.
- **Prófaðu keðju áður en þú tímasetur hana**, í sandkassa, með tilviki þar sem eitthvað er að gera,
  tilviki þar sem ekkert er að gera og tilviki með röngu inntaki.
- **Leyndarmál eru í leyndarmálageymslu Bifröst.** Telegram-vélmennislykillinn og biðlaraauðkenni og
  leyniorð hvers auðkennispars biðlara eru aldrei sýnd á síðu eða geymd í töflu.
- **Hver keyrir verk og hvert tilkynningar þess fara er stillt í Business Central.**
  Gervigreindarfulltrúi getur ekki breytt notanda vinnsluraðafærslu eða viðtakanda tilkynninga hennar í
  gegnum almennar gagnaaðgerðir Bifröst; því er breytt á færsluspjaldinu og uppsetningarsíðunni.
- **Tilkynningar birtast aðeins á Uppsetning Bifröst.** Síður Bifröst stjórnanda sýna engar
  uppsetningartilkynningar sjálfar.
- **Skilaboðategundir.** Aðgerðirnar sem þetta forrit bætir við eru taldar upp með öllum hinum af
  MCP-verkfærunum (`list_domains`, `describe_domains`, `describe_message_type`) og á Uppsetning Bifröst,
  og hver þeirra útskýrir sig sjálf með `Help.Implementation.Get`.

[Texti AppSource-skráningar](./listing) · [Prófunarsviðsmyndir fyrir AppSource](./user-scenarios)
