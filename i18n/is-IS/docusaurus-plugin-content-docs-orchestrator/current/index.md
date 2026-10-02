---
id: index
title: "Bifröst Orchestrator"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Tímasetning, vöktun og endurræsing vinnsluraðar í Business Central, auk keðja sem tengja aðgerðir Business Central saman í föst ferli."
---

# Bifröst Orchestrator

**Föst ferli sem keyra sig sjálf, og vinnsluröð sem passar upp á sig sjálf.** Tengdu aðgerðir
Bifrastar saman í keðju, keyrðu hana eftir tímaáætlun og fáðu að vita þegar eitthvað bregst.

{/* OPEN-21 */}

*Viðbótarapp ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert

- **Breytt föstu ferli í keðju.** Keðja er listi af skrefum, hvert skref aðgerð í
  Business Central, þar sem svar eins skrefs nærir það næsta: finndu pantanir sem eru komnar fram
  yfir dagsetningu, losaðu þær og láttu réttan aðila vita. Enginn kóði.
- **Keyrt hana þegar hún á að keyra.** Handvirkt, eftir tímaáætlun í gegnum vinnsluröðina, eða þegar
  aðstoð eða annað kerfi biður um það.
- **Hætt að passa vinnsluröðina.** Orchestrator vaktar færslur vinnsluraðar, endurræsir þær þegar þær
  bregðast og reynir aftur eftir reglunum sem þú setur.
- **Fengið að vita þegar það skiptir máli.** Tölvupóstur eða Telegram-skilaboð þegar verk bregst
  eða er endurræst.
- **Séð hvað gerðist.** Hver keyrsla keðju er geymd, skref fyrir skref, með því sem hvert skref
  fékk sent og hverju það svaraði.
- **Keyrt skýrslur eftir þörfum.** Skráð, keyrt og vistað skýrslur sem PDF, Excel eða Word, með
  vistuðum forstillingum beiðna.

Keðjur geta notað skilaboðategundir úr hvaða Bifröst-appi sem er, svo hvert app sem þú bætir
við gefur föstu ferlunum þínum meira til að vinna með. Aðstoð getur líka smíðað keðjur fyrir þig
í samtali.

## Sæktu appið

Settu **Bifrost Orchestrator** upp við hlið Bifröst Foundation, af AppSource eða í gegnum
samstarfsaðila þinn. Það þarf Business Central 28.0 eða nýrra, Essentials eða Premium.

## Uppsetning

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Á **Uppsetningu Bifrost** skaltu keyra **leiðsagnarforrit** Orchestrator: leyfa HTTP-beiðnir fyrir appið og ræsa stjórnunarvinnsluröð þess. | Kerfisstjóri Business Central |
| 2 | Fyrir Telegram-viðvaranir skaltu bæta við bot-teikni (frá `@BotFather` í Telegram) í leiðsagnarforritinu, og spjallauðkenni hvers og eins á **Bifrost User Setup**. Fyrir tölvupóstviðvaranir skaltu setja upp tölvupóstreikning í Business Central. | Kerfisstjóri Business Central |
| 3 | Skráðu færslur vinnsluraðar sem Orchestrator á að vakta og veldu hvernig hver þeirra lætur vita. | Kerfisstjóri Business Central |
| 4 | Smíðaðu eða fluttu inn keðjur, prófaðu þær og tímasettu síðan þær sem eiga að keyra sjálfar. | Eigandi ferlisins |

Leiðbeiningar skref fyrir skref eru í hjálpinni í appinu: [Uppsetning Orchestrator](/help/orchestrator/orchestrator-setup/)
og [Keðjur](/help/orchestrator/playbooks/).

## Gott að vita

- **Keðja keyrir með heimildum þess sem ræsir hana**; tímasett keðja með heimildum
  notandans sem færsla vinnsluraðarinnar keyrir sem. {/* OPEN-22 */} Hvert skref er skráð á **Bifrost Messages** auk
  keyrslu keðjunnar.
- **Prófaðu keðju áður en þú tímasetur hana**, í sandkassa, með tilviki þar sem eitthvað er að
  gera, tilviki þar sem ekkert er að gera og tilviki með röngu inntaki.
- **Bot-teikn Telegram** er geymt dulkóðað í Business Central.

## Tilvísun

Uppsettar skilaboðategundir og samningar þeirra, þar með taldar aðgerðirnar sem skref í keðju
getur kallað á, eru lesnir úr Business Central sjálfu: með MCP-verkfærunum `list_message_types` og
`describe_message_type`, eða á síðunni **Bifrost Message Types**.

- [Texti AppSource-skráningar](./listing) · [Prófunarsviðsmyndir fyrir AppSource](./user-scenarios)
- [Hvað einkennir gott skref í keðju](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/Bifrost%20Reference%20Playbooks/README.md), í tilvísunarsafni samstarfsaðila
