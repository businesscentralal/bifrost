---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Útgefandi:** Origo
**Prófunarumhverfi:** Flestar sviðsmyndirnar þurfa engin bankaauðkenni. Sviðsmyndir 6 og 7 þurfa
prófunarauðkenni fyrir einn banka og aðstoðarmann sem er tengdur við Bifröst. Sjá „Prófunarauðkenni“ og
„Aðstoðarmaður“ hér fyrir neðan.

---

## Prófunarauðkenni {#test-credentials}

Þessi viðbót kallar á vefþjónustur Arion banka, Íslandsbanka og Landsbankans.

**Útvegið:** Origo lætur fylgja umsókninni notandanafn, lykilorð, biðlaraskírteini (`.pfx`) og lykilorð
skírteinis fyrir einn banka, og reikningsnúmer prófunarreiknings í þeim banka. Þau eru skráð í **Bifröst
Ísland Fjárstýring - uppsetning** með **Skrá lykilorð fyrirtækis** og **Skrá skírteini** og geymd í
varinni geymslu; síðan sýnir aðeins hvort þau séu vistuð.

Sviðsmyndir 1 til 5 og 8 þurfa engin auðkenni.

---

## Aðstoðarmaður {#ai-assistant}

Sviðsmynd 7 er keyrð í gegnum aðstoðarmann (til dæmis Copilot, ChatGPT eða Claude) sem er tengdur við
prófunarumhverfið í gegnum Bifröst MCP-þjóninn, eins og lýst er í
[Tengdu aðstoðarmanninn](/setup/connect-your-ai/). Hver beiðni aðstoðarmannsins er skráð á síðunni
**Bifröst skilaboð** í Business Central, þar sem prófandinn getur skoðað stöðu hennar og niðurstöðu. Hvert
kall til banka er líka skráð á síðunni **Annáll beiðna Bifröst**, með lykilorðin falin.

---

## Sviðsmynd 1: Uppsetning og uppsetningarsíða {#scenario-1-installation-and-setup-page}

**Svið:** Uppsetning og virkjun

### Undirbúningur {#setup}
1. Byrjið með hreint Business Central prófunarumhverfi (sýnifyrirtæki)
2. Setjið upp viðbótina „Bifrost Foundation“ (forsenda) og ljúkið uppsetningu hennar
3. Setjið upp viðbótina „Bifrost Iceland Treasury“
4. Úthlutið prófunarnotandanum heimildasamstæðunni „BIFROST TAdmin ori“

### Skref {#steps}
1. Opnið síðuna „Uppsetning Bifröst“ úr leitarstikunni
2. Ef síðan sýnir tilkynninguna um HTTP-biðlarabeiðnir, veljið „Hefja uppsetningarleiðsögn“ á henni og ljúkið leiðsögninni
3. Veljið „Ísland Fjárstýring“ í flokknum „Forrit“

### Væntar niðurstöður {#expected-results}
- Viðbótin er sett upp án villna
- „Bifröst Ísland Fjárstýring - uppsetning“ opnast með einni línu fyrir hvern banka: „Arion banki“, „Íslandsbanki“ og „Landsbankinn“
- Hver lína er virk og sýnir „Vantar“ undir „Leyndarmál“

---

## Sviðsmynd 2: Uppsetning með leiðsögn {#scenario-2-guided-setup}

**Svið:** Uppsetning

### Undirbúningur {#setup-1}
1. Ljúkið sviðsmynd 1

### Skref {#steps-1}
1. Opnið „Uppsetning með hjálp“ úr leitarstikunni
2. Ræsið „Setja upp banka Bifröst Ísland Fjárstýringar“
3. Veljið „Áfram“ í upphafsskrefinu
4. Í skrefinu „Arion banki“, sláið inn notandanafn í „Notandanafn“
5. Veljið „Áfram“ þar til komið er að skrefinu „Landsbankinn“ og veljið svo „Ljúka“
6. Opnið „Bifröst Ísland Fjárstýring - uppsetning“ aftur

### Væntar niðurstöður {#expected-results-1}
- Leiðsögnin sýnir eitt skref fyrir hvern banka, hvert með „Virkt“, „Notandanafn“, „Lykilorð fyrirtækis“ og „Skírteini“; aðeins skref Landsbankans sýnir „API-lykill“
- „Lykilorð fyrirtækis“ og „Skírteini“ sýna „Ekki vistað“
- Eftir „Ljúka“ er leiðsögnin merkt lokið í „Uppsetning með hjálp“
- Lína Arion banka sýnir notandanafnið sem slegið var inn í skrefi 4

---

## Sviðsmynd 3: Vista og hreinsa leyndarmál {#scenario-3-store-and-clear-a-secret}

**Svið:** Uppsetning / Öryggi

### Undirbúningur {#setup-2}
1. Ljúkið sviðsmynd 1

### Skref {#steps-2}
1. Í „Bifröst Ísland Fjárstýring - uppsetning“, veljið línu „Landsbankinn“
2. Veljið „Skrá lykilorð fyrirtækis“, sláið inn hvaða gildi sem er í „Gildi“ og veljið „Í lagi“
3. Veljið „Skrá API-lykil“, sláið inn hvaða gildi sem er og veljið „Í lagi“
4. Veljið línu „Arion banki“ og skoðið aðgerðirnar
5. Veljið línu „Landsbankinn“ aftur og veljið „Hreinsa leyndarmál fyrirtækis“, og staðfestið

### Væntar niðurstöður {#expected-results-2}
- Gildið er hulið meðan það er slegið inn og birtist aldrei á síðunni á eftir
- „Skrá API-lykil“ er í boði fyrir Landsbankann en ekki fyrir Arion banka
- Upplýsingareiturinn „Skírteini“ segir að ekkert skírteini sé vistað
- Eftir skref 5 er ekkert vistað fyrir Landsbankann og „Leyndarmál“ sýnir „Vantar“

---

## Sviðsmynd 4: Uppsetning er aðeins til lestrar án heimildasamstæðu uppsetningar {#scenario-4-setup-is-read-only-without-the-setup-permission-set}

**Svið:** Heimildir

### Undirbúningur {#setup-3}
1. Ljúkið sviðsmynd 1
2. Skráið ykkur inn sem annar prófunarnotandi sem hefur „BIFROST Full ori“ en ekki „BIFROST TAdmin ori“

### Skref {#steps-3}
1. Opnið „Uppsetning Bifröst“ og veljið „Ísland Fjárstýring“
2. Reynið að breyta „Notandanafn“ á línu og skoðið „Skrá lykilorð fyrirtækis“

### Væntar niðurstöður {#expected-results-3}
- Síðan opnast aðeins til lestrar: ekki er hægt að breyta „Notandanafn“
- „Skrá lykilorð fyrirtækis“, „Skrá skírteini“ og „Hreinsa leyndarmál fyrirtækis“ eru ekki í boði

---

## Sviðsmynd 5: Rakningarsíðurnar {#scenario-5-the-tracking-pages}

**Svið:** Notagildi

### Undirbúningur {#setup-4}
1. Ljúkið sviðsmynd 1

### Skref {#steps-4}
1. Í „Bifröst Ísland Fjárstýring - uppsetning“, veljið „Greiðslubunkar í banka“
2. Lokið henni og veljið „Kröfur í banka“, „Kröfubunkar í banka“, „Greiðslur krafna í banka“ og „Ferilskrá bankaaðgerða“ hverja á eftir annarri

### Væntar niðurstöður {#expected-results-4}
- Hver síða opnast án villna og er aðeins til lestrar (ekki hægt að stofna, breyta eða eyða)
- „Greiðslubunkar í banka“ sýnir hlutana „Greiðslur“ og „Kostnaður greiðslna“; „Kröfur í banka“ sýnir „Færslur“ og „Greiðslur kröfu“
- Í nýju fyrirtæki eru listarnir tómir

---

## Sviðsmynd 6: Lesa bankayfirlit inn í bankaafstemmingu {#scenario-6-import-a-bank-statement-into-bank-reconciliation}

**Svið:** Kjarnavirkni

### Undirbúningur {#setup-5}
1. Ljúkið sviðsmynd 1, og vistið prófunarauðkennin úr „Prófunarauðkenni“ á línu bankans með „Skrá lykilorð fyrirtækis“ og „Skrá skírteini“, og notandanafnið í „Notandanafn“
2. Á bankareikningi í Business Central, setjið „Númer bankareiknings“ á prófunarreikningsnúmerið og „Innflutningssnið bankayfirlits“ á snið bankans: „ARION-FEED-IN“, „ISB-FEED-IN“ eða „LBI-FEED-IN“

### Skref {#steps-5}
1. Opnið „Afstemming bankareikninga“ og stofnið nýja afstemmingu fyrir bankareikninginn, með gærdaginn sem yfirlitsdag
2. Veljið „Flytja inn bankayfirlit“
3. Í „Veldu upphafsdagsetningu“, sláið inn dagsetningu mánuði aftur í tímann og veljið „Í lagi“

### Væntar niðurstöður {#expected-results-5}
- Lína bankans sýnir „Fullskráð“ undir „Leyndarmál“ fyrir innflutninginn
- „Innfærsla yfirlits — samantekt“ opnast og sýnir bankareikninginn, fjölda innfærðra lína og stöðurnar
- Afstemmingin hefur línu fyrir hverja færslu tímabilsins
- Kallið er skráð á síðunni „Annáll beiðna Bifröst“ með lykilorðið falið

---

## Sviðsmynd 7: Spyrja aðstoðarmanninn um bankann {#scenario-7-ask-the-assistant-about-the-bank}

**Svið:** Kjarnavirkni

### Undirbúningur {#setup-6}
1. Ljúkið sviðsmynd 6
2. Tengið aðstoðarmanninn eins og lýst er í „Aðstoðarmaður“

### Skref {#steps-6}
1. Spyrjið aðstoðarmanninn: „Hvert er gengi dagsins hjá bankanum?“ (nefnið bankann sem auðkennin eru vistuð fyrir)
2. Spyrjið aðstoðarmanninn hvort prófunarreikningsnúmerið úr „Prófunarauðkenni“ sé gildur reikningur í bankanum

### Væntar niðurstöður {#expected-results-6}
- Aðstoðarmaðurinn svarar með gengi bankans í dag
- Aðstoðarmaðurinn svarar hvort reikningurinn sé til
- Báðar beiðnirnar eru skráðar á síðunni „Bifröst skilaboð“ með stöðuna „Bakgrunnsverkefni lokið“

---

## Sviðsmynd 8: Ekki er kallað á banka án leyndarmála {#scenario-8-a-bank-without-secrets-is-not-called}

**Svið:** Villumeðhöndlun

### Undirbúningur {#setup-7}
1. Ljúkið sviðsmynd 1, án leyndarmála fyrir „Íslandsbanki“

### Skref {#steps-7}
1. Á bankareikningi í Business Central, setjið „Númer bankareiknings“ á hvaða 12 stafa reikningsnúmer sem er og „Innflutningssnið bankayfirlits“ á „ISB-FEED-IN“
2. Stofnið afstemmingu bankareiknings fyrir hann og veljið „Flytja inn bankayfirlit“

### Væntar niðurstöður {#expected-results-7}
- Innflutningurinn stöðvast með villu sem nefnir Íslandsbanka og notandanafnið eða lykilorðið sem vantar
- Engar afstemmingarlínur eru stofnaðar
- Business Central er áfram nothæft

---

## Frágangur {#cleanup}

1. Í „Bifröst Ísland Fjárstýring - uppsetning“, veljið „Hreinsa leyndarmál fyrirtækis“ á hverri bankalínu sem hefur leyndarmál
2. Eyðið prófunarafstemmingunum
3. Fjarlægið „Bifrost Iceland Treasury“ og síðan „Bifrost Foundation“ ef prófunarumhverfið er endurnýtt
