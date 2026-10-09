---
id: how-it-works
title: "Hvernig Bifröst virkar"
sidebar_label: "Hvernig Bifröst virkar"
sidebar_position: 1
description: "Hugmyndirnar á bak við Bifröst, útskýrðar einu sinni: aðgerðir sem lýsa sér sjálfar, hliðið eina sem hvert kall fer í gegnum, og hvernig fulltrúi finnur og kallar á rétta aðgerð."
---

# Hvernig Bifröst virkar

**Spurðu Business Central. Það finnur út hvernig.**

Að fá nýtt svar úr bókhaldskerfi hefur alltaf þýtt að einhver þurfi fyrst að smíða það: skýrslu, samþættingu, verkefni
með fjárhagsáætlun og biðröð. Bifröst fjarlægir það skref. Þú spyrð með þínum eigin orðum, í Copilot, Claude eða öðrum
gervigreindaraðstoðarmanni, og **fulltrúi** vinnur verkið í Business Central. (Á þessari síðu þýðir *fulltrúi*
gervigreindin, eða annað kerfi, sem vinnur fyrir þig.)

Það getur gert það vegna þess að hver aðgerð sem Bifröst býður lýsir sér sjálf. Aðgerð gerir eitt, til dæmis að athuga
framboð vöru, breyta tilboði í pöntun eða bóka skjal, og hún segir hvað hún gerir, hvað hún þarf, hverju hún skilar og
hvað getur farið úrskeiðis. Fulltrúinn les þessar lýsingar, velur réttu aðgerðirnar og kallar á þær. (Forritarar þekkja
aðgerð sem *skilaboðategund*; það er eini staðurinn þar sem orðið skiptir máli.)

## Af hverju Bifröst {#why-bifrost}

Með Bifröst vinnur gervigreindaraðstoðarmaðurinn þinn verkið í Business Central, undir þinni stjórn.

1. **Það vinnur verkið.** Hver aðgerð er fullbúið verk í Business Central, allt frá því að athuga
   lánstraust viðskiptamanns til þess að breyta tilboði í pöntun eða bóka skjal. Hún notar eigin rökfræði Business
   Central, þá sömu og þegar manneskja gerir það í biðlaranum. Það þarf ekkert að smíða, eða viðhalda, fyrir hverja nýja
   spurningu.
2. **Þú sérð bókun áður en hún er bókuð.** Fulltrúinn getur forskoðað bókun: færslurnar sem hún myndi búa til,
   án þess að bóka neitt. Og fulltrúi bókar aðeins fyrir notanda sem þú hefur opnað bókunarhliðið fyrir, jafnvel þótt sá
   notandi megi bóka í Business Central.
3. **Þú ákveður hvað fulltrúar mega snerta.** Ofan á eigin heimildir hvers notanda geturðu falið reiti fyrir
   fulltrúum, krafist þess að hver reitur sem fulltrúi breytir sé rakinn í breytingaskránni, sett mánaðarleg mörk á hvern
   notanda og fyrir fyrirtækið, og séð hvert kall í þínu eigin Business Central. Sjá
   [Heimildasamstæður og hlið](/documentation/end-customers/permissions/) og
   [Hvað fulltrúar lesa og breyta](/documentation/end-customers/data-access/).
4. **Það passar við hvernig þú vinnur nú þegar.** Copilot, ChatGPT, Claude eða hver annar aðstoðarmaður sem styður MCP,
   svo þú ert ekki bundinn einum þjónustuaðila. Samþættingarnar þínar kalla á sömu aðgerðir, líka í bakgrunni, og
   Business Central lætur þær vita þegar verkinu er lokið. Í skýinu og á eigin netþjónum.

Hvert Bifröst forrit bætir aðgerðum í sama safnið, á bak við sömu stýringar, og hver tengdur aðstoðarmaður getur notað
þær sama dag.

## Lén og aðgerðir {#domains-and-operations}

Aðgerðunum er skipt í **lén**, til dæmis Customer, Sales eða Item. Til dæmis:

| Lén | Aðgerð í því |
|---|---|
| **Customer** | Athugar lánstraust viðskiptamanns: stöðu, gjaldfallna upphæð, opnar pantanir og hvað er eftir |
| **Sales** | Bókar söluskjal |
| **Item** | Reiknar út hve mikið af vöru þú getur lofað |

- **Aðgerð** gerir eitt, og það er hún sem fulltrúi kallar á. Hver þeirra lýsir sér sjálf.
- **Lén** er hópur aðgerða um sama hlut, til dæmis viðskiptamenn eða söluskjöl. Fulltrúi skoðar lénin fyrst og velur
  síðan aðgerð innan rétta lénsins.
- **Forrit** er það sem þú setur upp. Það bætir við lénum, eða fleiri aðgerðum í lén sem er til: Foundation kemur með
  hefðbundin lén Business Central (sjá [hvað Foundation nær yfir](/foundation/#capabilities)), og hvert annað forrit
  bætir við sínum.

```mermaid
flowchart LR
  F["Forrit: Foundation"] --> C1["Lén: Customer"]
  F --> C2["Lén: Sales"]
  F --> C3["Lén: Finance"]
  T["Forrit: annað Bifröst forrit"] --> C4["Lén: þess eigið"]
  C1 --> M1["Athuga hámarksskuld"]
  C1 --> M2["Viðskiptamannayfirlit sem PDF"]
  C2 --> M3["Bóka söluskjal"]
  C3 --> M4["Para bankaafstemmingu"]
  C4 --> M5["Þess eigin aðgerðir"]
```

*Í orðum: forrit bætir við lénum, og hvert lén geymir aðgerðir. Foundation bætir meðal annars við Customer, Sales og
Finance; annað Bifröst forrit bætir við sínu eigin léni. Að athuga hámarksskuld og prenta viðskiptamannayfirlit tilheyra
bæði Customer.*

Vegna þess að hver aðgerð lýsir sér sjálf er ný aðgerð nothæf um leið og forrit hennar er uppsett, uppsetningu þess lokið
og heimild veitt; það þarf ekkert að kenna aðstoðarmanninum fyrst.

## Hvernig það hangir saman {#how-it-fits-together}

import PlatformMap from '@site/src/components/PlatformMap';

<PlatformMap />

[Bifröst Foundation](/foundation/) er hliðið eina. Það geymir skrána yfir aðgerðir, afhendir hjálp þeirra, athugar
heimildir og leyfi, og skráir hvert kall. Allt annað í fjölskyldunni eru forrit sem bæta eigin aðgerðum við sömu skrá.
[Forritalistinn](/apps/) sýnir forritin sem eru í boði.

## Hvað gerist þegar þú spyrð {#what-happens-when-you-ask}

> „Hve mikið af vöru 1896-S getum við enn lofað í þessari viku, og hvar er það?"

1. **Fulltrúinn leitar** í skránni með þínum orðum og fær stuttan lista af möguleikum.
2. **Hann velur** eftir einnar línu lýsingum þeirra. Framboðsaðgerðin skilar útreiknuðu framboði eftir birgðageymslu,
   með fráteknu magni og væntanlegum móttökum, sem er það sem spurningin snýst um; birgðastaðan ein og sér svaraði henni
   ekki.
3. **Hann les hjálpina** fyrir þá aðgerð: hvernig á að nefna vöruna, hvað kemur til baka.
4. **Hann kallar á hana.** Foundation athugar að þú megir það, keyrir hana sem þú og skráir kallið.
5. **Hann svarar** á mæltu máli, með tölunum eftir birgðageymslu.

Breyting gengur eins fyrir sig, með einni öryggisráðstöfun til viðbótar: fulltrúinn getur skoðað áður en hann gerir.

> „Breyttu tilboði SQ-1042 í pöntun og sýndu mér hvað bókun hennar myndi gera."

Fulltrúinn breytir tilboðinu í pöntun og forskoðar síðan bókunina, sem sýnir færslurnar sem bókunin myndi stofna **án þess
að bóka nokkuð**. Þú sérð niðurstöðuna áður en nokkuð er bókað, og hvort fulltrúinn má yfirleitt bóka ræðst af heimildum
auðkennisins sem hann keyrir sem.

Þegar eitthvað fer úrskeiðis segir svarið hvað á að gera næst, til dæmis að númer sé ekki til og hvernig á að fletta því
upp. Fulltrúinn leiðréttir sig eða spyr þig.

## Hvert gögnin þín fara {#where-your-data-goes}

import DataFlow from '@site/src/components/DataFlow';

<DataFlow />

Nánar:

- **Origo** geymir hvorki efni skilaboða né viðskiptagögnin þín, og þau eru ekki notuð til að þjálfa gervigreindarlíkön.
  Leyfisþjónusta Origo geymir Bifröst stillingarnar þínar (auðkenningu fyrirtækis, heiti umhverfis og tengiupplýsingar),
  fjölda notkunar með tímum og heitum aðgerðanna sem kallað var á, og tætt kenni leigjandans; forritin senda henni líka
  tæknileg greiningargögn (fjarmælingar). Uppsetningarleiðsögnin sýnir hvað leyfisþjónustan geymir áður en þú samþykkir.
- **Bifröst skilaboð** í Business Central hjá þér geyma hvert kall með gögnunum sem það skilaði, eins lengi og þú
  ákveður; sjá [Annálar og varðveisla](/documentation/end-customers/administrators/#logs-and-retention).

Öll yfirlýsingin: [Persónuvernd](/licensing/privacy/).

## Hve langt það nær {#how-far-it-goes}

Frá einu svari að keðju aðgerða: [Prófaðu](/try-it-out/#what-to-ask-first) fer í gegnum þrepin, með spurningu til að
prófa fyrir hvert.

## Hvað það nær yfir, og hvernig það vex {#what-it-covers-and-how-it-grows}

Uppsetning Bifröst Foundation opnar ekki allt Business Central fyrir aðstoðarmanni. Hún opnar það sem hefur verið smíðað
fyrir það, og það er mikið:

| | Hve langt það nær | Hvernig |
|---|---|---|
| **Lesa** | Flest gögnin þín | Almennur lestur nær til hverrar töflu sem er ekki takmörkuð, innan heimilda þinna og [reitaaðgangs](/documentation/end-customers/data-access/#field-access). Flestum spurningum er hægt að svara. |
| **Gera** | Það sem hefur aðgerð | Stofnun, umbreyting, útgáfa og bókun þurfa hver sína aðgerð. Lén Foundation ná meðal annars yfir sölu, innkaup, fjármál, birgðir og verk. Ekki hvert verk í Business Central hefur slíka aðgerð enn. |
| **Breyta reit** | Þröng, varin leið | Almenn skrif geta breytt reitum færslu, sjálfgefið aðeins reitum sem breytingaskráin nær til ([breytingaskrárvernd](/documentation/end-customers/data-access/#the-changelog-write-guard)). Þau koma ekki í stað aðgerðar með eigin rökum Business Central. |

Þegar engin aðgerð er til fyrir verk getur aðstoðarmaðurinn ekki unnið það í gegnum Bifröst, og hann ætti að segja það.
Það eru mörk þess sem er uppsett, ekki villa.

### Hvert forrit færir mörkin {#every-app-moves-the-edge}

Aðgerðir koma úr forritum, og þær sameinast allar í sömu skrá, á bak við sömu heimildir og sama annál. Önnur Bifröst
forrit bæta við eigin lénum. Hvert þeirra hefur sína eigin uppsetningarsíðu, sem er opnuð úr flokknum **Forrit** á
Uppsetningu Bifröst, sína eigin hjálp, og geymir auðkenni sín í sameiginlegu leyndarmálageymslunni; sjá
[forritalistann](/apps/).

Aðstoðarmaðurinn sameinar aðgerðir úr mismunandi forritum í einu samtali.

**Vantar eitthvað?**

1. Spurðu aðstoðarmanninn: *„Hvað geturðu gert hér?"* Hann telur upp það sem uppsetningin þín hefur.
2. Skoðaðu [forritalistann](/apps/): það gæti verið í forriti sem þú hefur ekki sett upp enn.
3. Ef ekki, spurðu Business Central samstarfsaðilann þinn. Það er hægt að smíða það,
   annaðhvort sem nýtt forrit eða sem fleiri aðgerðir í forriti sem er til.

**Næst:** [Settu það upp](/setup/), eða síðan fyrir þitt hlutverk:
[Notendur](/documentation/end-customers/users/) · [Kerfisstjórar](/documentation/end-customers/administrators/) ·
[Forritarar](/documentation/end-customers/developers/).
