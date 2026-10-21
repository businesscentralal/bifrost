---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Útgefandi:** Origo
**Prófunarumhverfi:** Krefst prófunarauðkenna fyrir skjalaskiptanet, og aðstoðarmanns sem er tengdur við
Bifröst. Sjá „Prófunarauðkenni“ og „Aðstoðarmaður“ hér fyrir neðan.

---

## Prófunarauðkenni {#test-credentials}

Þessi viðbót skiptist á skjölum í gegnum skjalaskiptanet Advania og Unimaze.

**Útvegið:** Prófunarauðkenni fyrir prófunarumhverfi Unimaze fyrir tvo prófunaraðila, sendanda og
viðtakanda, hvorn með þeirri kennitölu sem aðilinn er skráður með. Origo lætur þau fylgja umsókninni.
Auðkennin eru slegin inn með **Skrá notandanafn** og **Skrá lykilorð eða API lykil** á síðunni
**Uppsetning skjalaskipta** og geymd í leyndarmálageymslu Bifröst; síðan sýnir aðeins hvort þau séu
geymd. Netið finnur fyrirtækið eftir **Kennitala** í **Fyrirtækjaupplýsingum**, svo sviðsmyndirnar skipta
henni á milli prófunaraðilanna tveggja.

Peppol-kóðalistarnir krefjast engra auðkenna.

---

## Aðstoðarmaður {#ai-assistant}

Flestar sviðsmyndirnar eru keyrðar í gegnum aðstoðarmann (til dæmis Copilot, ChatGPT eða Claude) sem er
tengdur við prófunarumhverfið í gegnum Bifröst MCP-þjóninn, eins og lýst er í
[Tengdu aðstoðarmanninn](/setup/connect-your-ai/). Hver beiðni aðstoðarmannsins er skráð á síðunni
**Bifröst skilaboð** í Business Central, þar sem prófandinn getur skoðað stöðu hennar og niðurstöðu. Hvert
kall til skjalaskiptanets er líka skráð í **Annál beiðna**, með innskráningarupplýsingarnar faldar.

---

## Sviðsmynd 1: Uppsetning {#scenario-1-installation-and-setup}

**Svið:** Uppsetning og virkjun

### Undirbúningur {#setup}
1. Byrjaðu með hreint Business Central prófunarumhverfi (sýnifyrirtæki)
2. Settu upp viðbótina „Bifrost Foundation“ (forsenda) og ljúktu uppsetningu hennar
3. Settu upp viðbótina „Bifrost Iceland DocEx“

### Skref {#steps}
1. Opnaðu síðuna „Uppsetning Bifröst“ úr leitarstikunni
2. Ef síðan sýnir tilkynninguna um HTTP-beiðnir velur þú „Hefja uppsetningarleiðsögn“ og lýkur leiðsögninni
3. Veldu „Uppsetning skjalaskipta“ í flokknum „Forrit“

### Væntar niðurstöður {#expected-results}
- Viðbótin er sett upp án villna
- „Uppsetning skjalaskipta“ opnast með flokkunum „Advania“ og „Unimaze“, hvorum með umhverfi og stöðunni „Ekki skráðar“ í „Innskráningarupplýsingar“

---

## Sviðsmynd 2: Prófa tenginguna {#scenario-2-test-the-connection}

**Svið:** Uppsetning

### Undirbúningur {#setup-1}
1. Í „Fyrirtækjaupplýsingum“ setur þú „Kennitala“ á kennitölu sendandans

### Skref {#steps-1}
1. Á „Uppsetning skjalaskipta“ setur þú „Unimaze umhverfi“ á „Prófun“
2. Veldu „Skrá notandanafn“ og „Skrá lykilorð eða API lykil“ og sláðu inn prófunarauðkenni sendandans
3. Veldu „Prófa Unimaze tengingu“
4. Veldu „Hreinsa innskráningarupplýsingar“, staðfestu, og veldu „Prófa Unimaze tengingu“ aftur

### Væntar niðurstöður {#expected-results-1}
- Eftir skref 2 sýnir „Innskráningarupplýsingar“ „Geymdar“; gildin sjálf birtast aldrei
- Skref 3 sýnir heiti prófunaraðilans á netinu og hve mörg skeyti eru í innhólfinu og ósótt
- Skref 4 segir að engin auðkenni séu geymd og hvað eigi að gera, án villuglugga
- Sláðu auðkennin aftur inn fyrir næstu sviðsmynd

---

## Sviðsmynd 3: Peppol-kóðalistar {#scenario-3-peppol-code-lists}

**Svið:** Viðmiðunargögn

### Skref {#steps-2}
1. Spyrðu aðstoðarmanninn: „Sýndu mælieiningakóða Peppol BIS 3.0 fyrir stykki og klukkustundir.“
2. Spyrðu aðstoðarmanninn: „Hvaða skjalategundarkóði Peppol er kreditreikningur?“

### Væntar niðurstöður {#expected-results-2}
- Svörin sýna kóðana með heitum þeirra (til dæmis `H87` stykki, `381` kreditreikningur)
- Engin auðkenni þarf

---

## Sviðsmynd 4: Athuga viðtakanda {#scenario-4-check-a-recipient}

**Svið:** Sala

### Skref {#steps-3}
1. Spyrðu aðstoðarmanninn: „Getur prófunarviðtakandinn [kennitala] tekið á móti rafrænum reikningum í gegnum Unimaze?“

### Væntar niðurstöður {#expected-results-3}
- Svarið nefnir aðilann og segir að hann geti tekið á móti reikningum

---

## Sviðsmynd 5: Senda bókaðan sölureikning {#scenario-5-send-a-posted-sales-invoice}

**Svið:** Sala

### Undirbúningur {#setup-2}
1. Viðskiptamaður fyrir prófunarviðtakandann, með kennitölu hans, í sýnifyrirtækinu
2. Bókaður sölureikningur á þann viðskiptamann

### Skref {#steps-4}
1. Spyrðu aðstoðarmanninn: „Sendu bókaða sölureikninginn [reikningsnr.] til viðskiptamannsins sem rafrænan reikning í gegnum Unimaze.“
2. Opnaðu bókaða sölureikninginn og skoðaðu stöðu skjalaskipta
3. Eftir mínútu spyrðu aðstoðarmanninn: „Uppfærðu afhendingarstöðu reikninganna sem ég sendi í gegnum Unimaze.“
4. Biddu aðstoðarmanninn að senda sama reikning aftur

### Væntar niðurstöður {#expected-results-4}
- Skref 1 staðfestir að reikningurinn hafi verið sendur og að netið hafi tekið við honum
- Skref 2 sýnir að skjalið hafi verið sent til skjalaskiptaþjónustu
- Skref 3 uppfærir bókaða reikninginn í „afhent viðtakanda“
- Skrefi 4 er hafnað: svarið segir að reikningurinn hafi þegar verið sendur og hvernig megi senda hann aftur viljandi; ekkert er sent

---

## Sviðsmynd 6: Taka á móti reikningi inn í Business Central {#scenario-6-receive-an-invoice-into-business-central}

**Svið:** Innkaup

### Undirbúningur {#setup-3}
1. Í „Fyrirtækjaupplýsingum“ setur þú „Kennitala“ á kennitölu prófunarviðtakandans, og slærð inn auðkenni hans á „Uppsetning skjalaskipta“
2. Á „Uppsetning skjalaskipta“ velur þú „Uppfæra BII gagnaskiptaskilgreiningar“
3. Lánardrottinn fyrir sendandann, með kennitölu hans í „Kennitala“
4. Í „BIS30 kóðavörpun“ færsla af tegundinni „Mælieining“ frá `H87` í þína mælieiningu fyrir stykki; í „Vörpun texta á reikning“ í Business Central eða „VSK fjárhagsreikn.vörpun“ reikningur fyrir línur reikningsins

### Skref {#steps-5}
1. Spyrðu aðstoðarmanninn: „Hvaða reikningar bíða mín í Unimaze?“
2. Spyrðu aðstoðarmanninn: „Sæktu reikning [skjalanr.] inn í Business Central sem skjal á innleið og búðu til innkaupareikninginn.“
3. Opnaðu „Skjöl á innleið“ og innkaupareikninginn sem var búinn til
4. Biddu aðstoðarmanninn að sækja sama reikning aftur
5. Spyrðu aðstoðarmanninn: „Merktu þennan reikning afhentan í Unimaze.“

### Væntar niðurstöður {#expected-results-5}
- Skref 1 sýnir móttekna reikninginn með sendanda og númeri
- Skref 3 sýnir skjal á innleið með rafræna reikningnum og PDF-skjali hans, og innkaupareikning á lánardrottininn þar sem upphæð með VSK stemmir við móttekna reikninginn
- Skref 4 skilar sama skjali á innleið; ekkert annað er búið til
- Skref 5 staðfestir; reikningurinn birtist ekki lengur meðal reikninga sem bíða

---

## Sviðsmynd 7: Svara birgjanum {#scenario-7-answer-the-supplier}

**Svið:** Innkaup

### Skref {#steps-6}
1. Spyrðu aðstoðarmanninn: „Láttu birgjann vita að reikningur [skjalanr.] hafi verið greiddur.“
2. Spyrðu aðstoðarmanninn: „Hafnaðu reikningi [annað skjalanr.] af því að verðin passa ekki við samninginn, og biddu um nýjan reikning.“

### Væntar niðurstöður {#expected-results-6}
- Hvert svar staðfestir að svar hafi verið sent til birgjans í gegnum netið

---

## Sviðsmynd 8: Röng auðkenni {#scenario-8-wrong-credentials}

**Svið:** Villumeðhöndlun

### Skref {#steps-7}
1. Á „Uppsetning skjalaskipta“ slærð þú inn rangt lykilorð með „Skrá lykilorð eða API lykil“
2. Veldu „Prófa Unimaze tengingu“
3. Spyrðu aðstoðarmanninn: „Hvaða reikningar bíða mín í Unimaze?“

### Væntar niðurstöður {#expected-results-7}
- Skref 2 segir að netið hafi hafnað auðkennunum og hvað eigi að athuga, án villuglugga
- Skref 3 skilar skýrri villu, ekki óunninni undantekningu; villan er skráð á „Bifröst skilaboð“
- Sláðu rétta lykilorðið aftur inn á eftir

---

## Sviðsmynd 9: Heimildir {#scenario-9-permissions}

**Svið:** Öryggi

### Undirbúningur {#setup-4}
1. Prófunarnotandi með heimildasafnið „D365 Basic - Read“ og engin heimildasöfn Bifröst

### Skref {#steps-8}
1. Skráðu þig inn sem prófunarnotandinn og biddu aðstoðarmanninn að senda bókaðan sölureikning
2. Úthlutaðu `BIFROST Full ori` til prófunarnotandans og endurtaktu skref 1 með öðrum bókuðum reikningi

### Væntar niðurstöður {#expected-results-8}
- Skrefi 1 er hafnað með heimildavillu; ekkert er sent
- Skref 2 sendir reikninginn

---

## Sviðsmynd 10: Fjarlæging {#scenario-10-uninstall}

**Svið:** Uppsetning

### Skref {#steps-9}
1. Opnaðu „Umsjón viðbóta“ og fjarlægðu „Bifrost Iceland DocEx“
2. Settu hana upp aftur

### Væntar niðurstöður {#expected-results-9}
- Viðbótin er fjarlægð og sett upp aftur án villna
- Bifrost Foundation og önnur Bifröst-forrit virka áfram
