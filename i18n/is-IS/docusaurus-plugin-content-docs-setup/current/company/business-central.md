---
id: business-central
sidebar_position: 2
slug: /business-central
title: "Skref 2: Settu upp Business Central"
sidebar_label: "2. Settu upp Business Central"
description: "Keyrðu uppsetningarleiðsögnina einu sinni í hverju fyrirtæki, veittu fólki og forritum heimildir, og ákveddu hvaða verkfæri mega starfa fyrir notanda."
---

# Skref 2: Settu upp Business Central

**Hvern þarf:** Kerfisstjóra Business Central (SUPER fyrir útleið HTTP, SECURITY eða SUPER fyrir heimildir), og einhvern
sem hefur umboð til að samþykkja skilmála fyrir fyrirtækið.

## Keyrðu uppsetningarleiðsögnina {#run-the-setup-wizard}

Opnaðu **Uppsetning Bifröst**: veldu leitartáknið (*Segðu mér*) og skrifaðu *Uppsetning Bifröst*.

![Leitin finnur Uppsetningu Bifröst](/img/guides/is-is/tell-me.png)

Í fyrsta sinn segir tilkynning efst á síðunni að notendaleyfissamningurinn hafi ekki verið samþykktur fyrir
fyrirtækið. **Hefja uppsetningarleiðsögn** í tilkynningunni opnar **uppsetningarleiðsögnina**. Hún nær yfir öll
Bifröst forrit sem þú hefur sett upp, svo ekkert forrit biður um uppsetningu á eigin vegum. Önnur Bifröst forrit hafa
líka uppsetningarsíðu fyrir sitt svið, sem er opnuð úr flokknum **Forrit** á Uppsetningu Bifröst og lýst í hjálp
forritsins.

![Uppsetning Bifröst áður en leiðsögnin hefur verið keyrð](/img/guides/is-is/setup-first-run.png)

Leiðsögnin fer með þér í gegnum notendaleyfissamninginn, útleið HTTP fyrir öll uppsett Bifröst forrit, leyfismál og,
í skýinu, tenginguna við Bifröst MCP-þjóninn. Í staðbundinni uppsetningu biður hún líka um auðkennin sem forritin þurfa.
**Hvert fyrirtæki keyrir hana einu sinni: þar til henni er lokið hafnar Bifröst köllum fyrir það fyrirtæki.**

Í framleiðsluumhverfi í skýinu virkjar leiðsögnin prufuleyfið þegar henni lýkur, hafi Microsoft Entra leigjandinn þinn
ekki fengið það áður. Sandkassi þarf ekkert prufuleyfi. Í staðbundinni uppsetningu er tengingin við leyfisþjónustuna
staðfest fyrst.

Leiðsögnin er í sex skrefum. Skref 1, 2, 4 og 6 eru fyrir þig. Skref 3, auðkenni, birtist aðeins í staðbundinni
uppsetningu. Í skýinu gefur skref 5 tengilinn til að samþykkja forritið fyrir
[uppsetningarskref 3](/setup/consent/); þú getur lokið leiðsögninni fyrst og sent Entra-kerfisstjóranum
tengilinn.

Samningurinn er samþykktur, og prufuleyfið virkjað, aðeins þegar þú velur **Ljúka**, svo þú getur farið fram og til baka
með **Til baka** og **Áfram**. Útleið HTTP (skref 2) og auðkenni (skref 3) eru vistuð um leið og þú stillir þau.

**Skref 1: Velkomin.** Síðan sýnir einstefnutætigildi Microsoft Entra leigjandakennisins sem Origo geymir vegna leyfa,
og hvað annað er geymt: stillingar og fjölda skilaboða, aldrei efni skilaboðanna eða viðskiptagögnin þín. Lestu
samninginn og kveiktu síðan á **Ég samþykki notendaleyfissamninginn**; **Áfram** er óvirkt þar til þú gerir það.

![Skref 1 í leiðsögninni, með samninginn samþykktan](/img/guides/is-is/wizard-1.png)

**Skref 2: Virkja HTTP-biðlarabeiðnir.** Listinn sýnir hvert uppsett Bifröst forrit og hvort útleið HTTP sé virk fyrir
það. Veldu **Virkja HTTP fyrir öll forrit** til að kveikja á henni fyrir öll forrit sem eru ekki með hana; **Áfram** er
óvirkt þar til kveikt er á henni fyrir þau öll. Til að kveikja á henni þarf SUPER (eða skrifheimild á NAV App Setting).

![Skref 2: útleið HTTP fyrir hvert Bifröst forrit](/img/guides/is-is/wizard-2.png)

**Skref 4: Virkjun prufuleyfis.** Fyrirtæki í framleiðsluumhverfi fær prufuleyfi með 1.000 notendaskilaboðum og 1.000
skilaboðum forritsskráninga, einu sinni fyrir hvern Microsoft Entra leigjanda; **Staða** segir hvort það sé þegar
virkt. Í sandkassa heitir þetta skref **Sandkassaleyfi**.

![Skref 4: prufuleyfið](/img/guides/is-is/wizard-4.png)

**Skref 6: Uppsetningu lokið.** Tenglar á hjálparskjölin. Veldu **Ljúka**.

![Skref 6: ljúka](/img/guides/is-is/wizard-6.png)

Eftir **Ljúka** sýnir Uppsetning Bifröst ekki lengur tilkynninguna, og svæðið **Leyfi** sýnir tegund leyfis og hve mörg
skilaboð eru eftir.

![Uppsetning Bifröst eftir leiðsögnina](/img/guides/is-is/setup-after-wizard.png)

:::note
**Sjálfgefinn tungumálakóði** er merktur sem skyldureitur, en Bifröst virkar án hans. Hann er tungumálið sem Bifröst
svarar á þegar kall biður ekki um annað. Ef hann er auður gildir tungumál fyrirtækisins, og enska ef það er líka autt.
:::

Skref fyrir skref: [Uppsetningarleiðsögn](/help/foundation/bifrost-setup-wizard/).

:::note Athugaðu
Með því að samþykkja notendaleyfissamninginn eru [notkunarskilmálarnir](/licensing/eula/) samþykktir fyrir
fyrirtækið. Fyrsta skref leiðsagnarinnar segir hvað Bifröst geymir hjá Origo; sjá líka
[Persónuvernd](/licensing/privacy/). Lestu hvort tveggja áður en þú samþykkir.
:::

## Áttaðu þig á Uppsetningu Bifröst {#find-your-way-around-bifrost-setup}

Uppsetning Bifröst er heimili Bifröst í hverju fyrirtæki. Flokkarnir á aðgerðastikunni:

| Flokkur | Hvað er í honum |
|---|---|
| **Skilaboð** | **Bifröst skilaboð** (hvert kall til Bifröst) og **annáll beiðna** (köll sem Bifröst gerir til annarra kerfa) |
| **Uppsetning** | Uppsetning notenda, reitaaðgangur, næmi reita, undanþágur breytingaskrárverndar, uppsetning breytingaskrár, varðveislureglur, leyndarmál |
| **Leyfi** | **Uppsetningarleiðsögn** (keyrðu hana aftur hvenær sem er), **Samstilla**, **Tengingastaða**, **Afturkalla samþykki notendaleyfissamnings** |
| **Tengingar** | Bifröst-tengingin í verslunum aðstoðarmannanna |
| **Forrit** | Önnur uppsett Bifröst forrit, og **Finna forrit** fyrir þau sem þú hefur ekki |

![Flokkurinn Uppsetning](/img/guides/is-is/menu-setup.png)

## Veittu fólki og forritum heimildir {#give-people-and-apps-permission}

Fólk notar Bifröst í gegnum aðstoðarmann sem það sjálft. Samþætting notar það sem **Microsoft Entra forrit**: eigið
forritsauðkenni, skráð í Microsoft Entra ID fyrirtækisins. Bæði fá heimildir sínar í Business Central, á **Notendur**
eða **Microsoft Entra forrit**. Venjulegur notandi þarf `BIFROST API ori` (heimildasamstæðuna sem leyfir auðkenni að kalla í
Bifröst), venjulegar heimildir sínar í Business Central fyrir gögnin sem hann vinnur með, og **bókunarhlið** fyrir hverja
höfuðbók sem hann bókar í í gegnum Bifröst, til dæmis `BIFROST GL Post ori` fyrir sölu- og innkaupaskjöl.

Allar samstæðurnar, algengar samsetningar fyrir samþættingar, þjónustufólk og kerfisstjóra, og hvernig hliðin virka ofan á
eigin heimildir notanda: [Heimildasamstæður og hlið](/documentation/end-customers/permissions/).

## Ákveddu hvaða verkfæri mega starfa fyrir notanda {#decide-which-tools-may-act-for-a-user}

Þegar aðstoðarmaður kallar sem tiltekinn notandi skráir Bifröst hvaðan kallið kemur, og notandinn gæti þurft að
samþykkja þann uppruna einu sinni. Í **Uppsetningu notenda** ræður **Tegund samþykktar** hvers notanda hvort nýr
uppruni er samþykktur sjálfkrafa (sjálfgefið) eða þarf að samþykkja hann fyrst. Að krefjast samþykktar er öruggara þegar
fólk getur tengt aðstoðarmenn sem þú hefur ekki valið. Opnaðu notanda til að breyta **Tegund samþykktar** eða setja
**mánaðarlegan skilaboðakvóta notanda**.

![Bifröst uppsetning notanda](/img/guides/is-is/user-setup-card.png)

Sjá [Samþykkja uppruna setu](/help/foundation/session-source-approval/).

**Næst:** [Skref 3: Samþykktu einu sinni fyrir fyrirtækið](/setup/consent/)
