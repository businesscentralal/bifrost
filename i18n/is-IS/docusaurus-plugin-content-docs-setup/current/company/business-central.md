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
í skýinu, tenginguna við MCP-þjóninn. Í staðbundinni uppsetningu biður hún líka um auðkennin sem forritin þurfa.
**Hvert fyrirtæki keyrir hana einu sinni: þar til henni er lokið hafnar Bifröst köllum fyrir það fyrirtæki.**

Í framleiðsluumhverfi í skýinu virkjar leiðsögnin prufuleyfið þegar henni lýkur, hafi Microsoft Entra leigjandinn þinn
ekki fengið það áður. Sandkassi þarf ekkert prufuleyfi. Í staðbundinni uppsetningu er tengingin við leyfisþjónustuna
staðfest fyrst.

Leiðsögnin er í sex skrefum. Skref 1, 2, 4 og 6 eru fyrir þig. Skref 3, auðkenni, birtist aðeins í staðbundinni
uppsetningu. Í skýinu gefur skref 5 tengilinn til að samþykkja forritið fyrir
[uppsetningarskref 3](/setup/consent/); þú getur lokið leiðsögninni fyrst og sent Entra-kerfisstjóranum
tengilinn.

Ekkert er vistað fyrr en þú velur **Ljúka**, svo þú getur farið fram og til baka með **Til baka** og **Áfram**.

**Skref 1: Velkomin.** Síðan sýnir einstefnutætigildi Microsoft Entra leigjandakennisins sem Origo geymir vegna leyfa,
og hvað annað er geymt: stillingar og fjölda skilaboða, aldrei efni skilaboðanna eða viðskiptagögnin þín. Lestu
samninginn og kveiktu síðan á **Ég samþykki notendaleyfissamninginn**; **Áfram** er óvirkt þar til þú gerir það.

![Skref 1 í leiðsögninni, með samninginn samþykktan](/img/guides/is-is/wizard-1.png)

**Skref 2: Virkja HTTP-biðlarabeiðnir.** Listinn sýnir hvert uppsett Bifröst forrit og hvort útleið HTTP sé virk fyrir
það. Leiðsögnin kveikir á henni fyrir þau öll þegar þú lýkur.

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
eða **Microsoft Entra forrit**:

- **`BIFROST API ori`**, heimildasamstæðan sem leyfir auðkenni að kalla í Bifröst;
- venjulegar heimildir Business Central fyrir gögnin sem unnið er með;
- **bókunarhlið** fyrir hverja höfuðbók sem má bóka í. Bókunarhlið er sérstök heimildasamstæða, ekki hluti af almennu
  Bifröst samstæðunum: `BIFROST GL Post ori`, `BIFROST ItemPost ori`, `BIFROST FA Post ori`, `BIFROST Job Post ori`
  og `BIFROST Res Post ori`.

Algeng uppsetning:

| Hver | Heimildasamstæður Bifröst | Auk þess |
|---|---|---|
| Sá sem notar aðstoðarmann og spyr og undirbýr, án þess að bóka | `BIFROST API ori` | Venjulegar heimildir hans í Business Central. Forskoðun bókunar þarf líka bókunarhliðið |
| Sá sem má líka bóka í gegnum Bifröst | `BIFROST API ori` og bókunarhlið hverrar höfuðbókar, til dæmis `BIFROST GL Post ori` fyrir sölu- og innkaupaskjöl | Það sama |
| Samþætting (Entra forrit) | `BIFROST API ori`, og bókunarhlið aðeins ef hún bókar | Heimildir fyrir gögnin sem hún vinnur með |
| Þjónustufólk sem les annála | `BIFROST Read ori` | – |
| Umsjónarmenn Bifröst | `BIFROST Full ori` | – |

Á **Heimildasamstæður** leitarðu að *BIFROST* til að sjá þær allar. Í algengri uppsetningu þarftu aðeins samstæðurnar
sem eru nefndar hér.

![Heimildasamstæður Bifröst](/img/guides/is-is/permission-sets.png)

Allar samstæðurnar, og hvernig bókunarhliðin virka ofan á eigin heimildir notanda:
[Heimildasamstæður og hlið](/documentation/end-customers/permissions/).

## Ákveddu hvaða verkfæri mega starfa fyrir notanda {#decide-which-tools-may-act-for-a-user}

Þegar aðstoðarmaður kallar sem tiltekinn notandi skráir Bifröst hvaðan kallið kemur, og notandinn gæti þurft að
samþykkja þann uppruna einu sinni. Í **Uppsetningu notenda** ræður **Tegund samþykktar** hvers notanda hvort nýr
uppruni er samþykktur sjálfkrafa (sjálfgefið) eða þarf að samþykkja hann fyrst. Að krefjast samþykktar er öruggara þegar
fólk getur tengt aðstoðarmenn sem þú hefur ekki valið. Opnaðu notanda til að breyta **Tegund samþykktar** eða setja
**mánaðarlegan skilaboðakvóta notanda**.

![Bifröst uppsetning notanda](/img/guides/is-is/user-setup-card.png)

Sjá [Samþykkja uppruna setu](/help/foundation/session-source-approval/).

**Næst:** [Skref 3: Samþykktu einu sinni fyrir fyrirtækið](/setup/consent/)
