---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Útgefandi:** Origo
**Prófunarumhverfi:** Krefst Telegram-vélmennislykils fyrir tilkynningasviðsmyndirnar, og aðstoðarmanns sem er tengdur við Bifröst. Sjá „Prófunarauðkenni“ og „Aðstoðarmaður“ hér fyrir neðan.

---

## Prófunarauðkenni {#test-credentials}

Þessi viðbót notar Telegram Bot API til að senda tilkynningar.

**Útvegið:** Telegram-vélmennislykil (frá @BotFather) og Telegram-spjallauðkenni fyrir prófunarnotanda.
Vélmennislykillinn er sleginn inn með **Skrá Telegram-vélmennislykil** á síðunni „Uppsetning Bifröst
stjórnanda“ og er geymdur í leyndarmálageymslu Bifröst í Business Central; síðan sýnir aðeins hvort hann
sé skráður. Spjallauðkennið er slegið inn fyrir hvern notanda í reitinn **Telegram-spjallauðkenni** í
Bifröst-notandauppsetningu hans (Bifröst notandauppsetning, Bifrost Foundation).

Fyrir tölvupósttilkynningar þarf að setja upp tölvupóstreikning í Business Central.

---

## Aðstoðarmaður {#ai-assistant}

Sumar sviðsmyndir eru keyrðar í gegnum aðstoðarmann (til dæmis Copilot, ChatGPT eða Claude) sem er
tengdur við sandkassann í gegnum MCP-þjón Bifröst, eins og lýst er í
[Tengdu aðstoðarmanninn](/setup/connect-your-ai/). Hver beiðni aðstoðarmannsins er skráð á síðunni
**Bifrost Messages** í Business Central, þar sem prófandinn getur skoðað stöðu hennar og niðurstöðu.

---

## Sviðsmynd 1: Uppsetning viðbótar og leiðsögn {#scenario-1-extension-installation-and-setup-wizard}

**Svið:** Uppsetning og virkjun

### Undirbúningur {#setup}
1. Byrjið með hreinan Business Central-sandkassa (sýnifyrirtæki)
2. Setjið upp viðbótina „Bifrost Foundation“ (forsenda)
3. Setjið upp viðbótina „Bifrost Orchestrator“

### Skref {#steps}
1. Opnið síðuna „Uppsetning Bifröst“ úr leitarstikunni
2. Ef síðan sýnir tilkynninguna um HTTP-biðlarabeiðnir, veljið „Hefja uppsetningarleiðsögn“ í henni og ljúkið leiðsögninni
3. Opnið síðuna „Aðstoðuð uppsetning“ úr leitarstikunni og ræsið „Uppsetning Bifröst stjórnanda“
4. Staðfestið að skref 1 (Velkomin í Bifröst stjórnanda) birtist og veljið „Áfram“
5. Staðfestið að skref 2 (Virkja HTTP-biðlarabeiðnir) sýni núverandi stöðu
6. Ef þær eru ekki virkar, veljið „Virkja HTTP-biðlarabeiðnir“ og síðan „Staðfesta“
7. Veljið „Áfram“ í skref 3 (Vinnsluraðari), sem sýnir stöðu vinnsluraðarinnar
8. Veljið „Ræsa vinnsluröð“ til að ræsa stjórnunarvinnsluraðafærsluna
9. Veljið „Áfram“ í skref 4 (Uppsetningu lokið) og síðan „Ljúka“
10. Opnið „Uppsetning Bifröst“ aftur og veljið „Uppsetning Bifröst stjórnanda“ í flokknum „Forrit“

### Væntar niðurstöður {#expected-results}
- Uppsetningarleiðsögn Bifröst leyfir HTTP-biðlarabeiðnir fyrir uppsett Bifröst-forrit
- Aðstoðaða uppsetningin „Uppsetning Bifröst stjórnanda“ leiðir í gegnum 4 skref; skref 2 sýnir HTTP-biðlarabeiðnir sem virkar, eða gerir kleift að virkja þær
- Stjórnunarvinnsluraðafærslan ræsist
- Skref 10: „Uppsetning Bifröst“ sýnir ekki lengur HTTP-tilkynninguna; „Uppsetning Bifröst stjórnanda“ opnast og „Staða vinnsluraðara“ sýnir vinnsluröðina í gangi

---

## Sviðsmynd 2: Setja vinnsluraðafærslu undir eftirlit og keyra hana {#scenario-2-supervise-a-job-queue-entry-and-run-it}

**Svið:** Kjarnavirkni — umsjón færslna

### Undirbúningur {#setup-1}
1. Ljúkið sviðsmynd 1
2. Gangið úr skugga um að að minnsta kosti ein vinnsluraðafærsla sé til, önnur en stjórnunarfærsla forritsins sjálfs

### Skref {#steps-1}
1. Opnið síðuna „Uppsetning Bifröst stjórnanda“
2. Skoðið hlutann „Vinnsluraðarfærslur“
3. Veljið „Vinnsluraðafærslur“ og skrifið hjá ykkur lýsingu einhverrar vinnsluraðafærslu
4. Biðjið aðstoðarmanninn: „Settu vinnsluraðafærsluna [lýsing úr skrefi 3] undir Bifröst stjórnanda.“
5. Biðjið aðstoðarmanninn: „Keyrðu þessa vinnsluraðarfærslu einu sinni núna.“

### Væntar niðurstöður {#expected-results-1}
- Skref 4: Aðstoðarmaðurinn staðfestir að færslan hafi verið skráð
- Skref 5: Aðstoðarmaðurinn segir frá því að færslan hafi keyrt
- Færslan birtist í hlutanum „Vinnsluraðarfærslur“ á uppsetningarsíðunni, og „Tímaröðun virk“ er valið fyrir vinnsluraðafærsluna á „Vinnsluraðafærslur“

---

## Sviðsmynd 3: Telegram-tilkynning um vinnsluraðarfærslu {#scenario-3-telegram-notification-on-an-orchestrator-entry}

**Svið:** Tilkynningar — Telegram

### Undirbúningur {#setup-2}
1. Ljúkið sviðsmynd 1
2. Opnið „Uppsetning Bifröst stjórnanda“, veljið „Skrá Telegram-vélmennislykil“ og sláið inn vélmennislykilinn
3. Sláið inn Telegram-spjallauðkenni fyrir núverandi notanda í Bifröst-notandauppsetningu hans
4. Notið vinnsluraðarfærsluna úr sviðsmynd 2

### Skref {#steps-2}
1. Opnið „Spjald vinnsluraðarafærslu“ fyrir færsluna
2. Setjið „Gerð tilkynningar“ á „Telegram“
3. Staðfestið að „Viðtakandi tilkynningar“ sé fylltur út með spjallauðkenninu úr skrefi 3 í undirbúningnum
4. Veljið aðstoðarhnappinn (…) við „Viðtakandi tilkynningar“ til að senda prófunartilkynningu
5. Athugið hvort skilaboðin hafi borist í Telegram-spjallið

### Væntar niðurstöður {#expected-results-2}
- Skref 2: „Telegram-vélmennislykill“ á uppsetningarsíðunni sýnir „Skráð“
- Skref 4: Engin villa; prófunartilkynningin er send
- Skref 5: Skilaboð með lýsingu færslunnar birtast í Telegram-spjallinu
- Ef HTTP-biðlarabeiðnir eru ekki virkar birtast skýr villuboð

---

## Sviðsmynd 4: Senda Telegram-skilaboð frá aðstoðarmanninum {#scenario-4-send-a-telegram-message-from-the-assistant}

**Svið:** Afhending — Telegram

### Undirbúningur {#setup-3}
1. Ljúkið undirbúningi sviðsmyndar 3 (vélmennislykill skráður, spjallauðkenni í Bifröst-notandauppsetningu notandans)

### Skref {#steps-3}
1. Biðjið aðstoðarmanninn: „Sendu mér Telegram-skilaboð sem segja: Hello from Business Central!“
2. Athugið hvort skilaboðin hafi borist í Telegram-spjallið

### Væntar niðurstöður {#expected-results-3}
- Skref 1: Aðstoðarmaðurinn staðfestir að skilaboðin hafi verið send
- Skref 2: „Hello from Business Central!“ birtist í Telegram-spjalli notandans
- Spjallauðkennið er sótt í Bifröst-notandauppsetningu notandans sem kallar

### Villutilvik {#error-cases}
- Enginn vélmennislykill: „Telegram-vélmennislykill er ekki stilltur í uppsetningu vinnsluraðara.“
- Notandinn hefur ekkert spjallauðkenni: „Ekkert Telegram-spjallauðkenni stillt fyrir núverandi notanda. Stilltu það í uppsetningu Bifröst notanda.“
- HTTP er ekki virkt: „HTTP-biðlarabeiðnir eru ekki virkar fyrir þessa viðbót. …“

---

## Sviðsmynd 5: Búa til og keyra keðju {#scenario-5-create-and-run-a-playbook}

**Svið:** Kjarnavirkni — keðjur

### Undirbúningur {#setup-4}
1. Ljúkið sviðsmynd 1

### Skref {#steps-4}
1. Opnið „Bifröst keðjur“ (af „Uppsetning Bifröst stjórnanda“)
2. Stofnið keðju með Kóði = „TEST-SCENARIO“ og Lýsing = „AppSource Test Playbook“
3. Bætið við skrefi 10: í „Skilaboðagerð“ veljið aðgerðina sem les stöðu Bifröst stjórnanda; setjið „Næsta skref (árangur)“ = 20
4. Bætið við skrefi 20: í „Skilaboðagerð“ veljið aðgerðina sem sendir Telegram-skilaboð (ef Telegram er uppsett)
5. Í sniðmáti beiðni skrefs 20 („Breyta“ í upplýsingareitnum „Sniðmát beiðni“ opnar „Ritill keðjusniðmáts“) sláið inn textann „Orchestrator status check complete“ sem skilaboðin
6. Veljið „Keyra núna“ á keðjuspjaldinu

### Væntar niðurstöður {#expected-results-4}
- Skref 6: Keyrslunni lýkur og skilaboð sýna stöðu hennar
- Keðjan keyrir bæði skrefin í röð; dálkurinn „Síðasta keyrsla“ sýnir ✓ fyrir bæði
- „Keyrsluskrá keðju“ sýnir keyrsluna með stöðuna Lokið, 2 skref keyrð og 0 skref sem mistókust

### Athugasemdir {#notes}
- Aðgerðirnar sem skref getur kallað á, og hvað hver þeirra tekur við, eru taldar upp í „Tiltækar skilaboðategundir“ á „Uppsetning Bifröst“

---

## Sviðsmynd 6: Tímasetja keðju {#scenario-6-schedule-a-playbook}

**Svið:** Kjarnavirkni — tímasetning keðja

### Undirbúningur {#setup-5}
1. Ljúkið sviðsmynd 5 (keðjan „TEST-SCENARIO“ er til)
2. Á „Endurtekningarsniðmát vinnsluraða“ (af „Uppsetning Bifröst stjórnanda“) veljið „Setja inn sýnishorn sniðmáta“

### Skref {#steps-5}
1. Opnið spjaldið „Bifröst keðja“ fyrir „TEST-SCENARIO“
2. Veljið „Tímasetja“; glugginn „Tímasetja keðju“ opnast
3. Veljið „Endurtekningarsniðmát“, til dæmis „DAILY“, veljið „Gerð tilkynningar“ og staðfestið með Í lagi
4. Staðfestið að „Tímasett“ á keðjuspjaldinu sé nú Já
5. Veljið „Vinnsluraðarstjórafærsla“ til að opna vinnsluraðarfærsluna sem varð til
6. Eyðið vinnsluraðarfærslunni og staðfestið að „Tímasett“ á keðjuspjaldinu verði aftur Nei

### Væntar niðurstöður {#expected-results-5}
- Skref 3: Keðjan er tímasett með vinnsluraðarfærslu sem er ekki lokuð
- Skref 5: „Spjald vinnsluraðarafærslu“ opnast á færslunni sem varð til fyrir keðjuna
- Skref 6: Þegar færslan er fjarlægð hverfur tímasetningin

---

## Sviðsmynd 7: Keðja með ítrun {#scenario-7-playbook-with-iteration}

**Svið:** Kjarnavirkni — keðjur (ítarlegri)

### Undirbúningur {#setup-6}
1. Ljúkið sviðsmynd 1
2. Gangið úr skugga um að að minnsta kosti 2 viðskiptamenn séu til

### Skref {#steps-6}
1. Stofnið keðjuna „TEST-FOREACH“ með:
   - Skrefi 10: aðgerðinni sem les færslur, með sniðmáti beiðni sem biður um allt að 5 viðskiptamenn
   - Skrefi 20: aðgerðinni sem les stöðu Bifröst stjórnanda, endurtekinni yfir svar skrefs 10 („Slóð fylkis til ítrunar“ = „result“, „Upprunaskref ítrunar“ = 10)
   - Skrefi 30: aðgerðinni sem sendir Telegram-skilaboð, með skilaboðum um að keyrslu sé lokið
2. Veljið „Keyra núna“ á keðjuspjaldinu, eða biðjið aðstoðarmanninn: „Keyrðu keðjuna TEST-FOREACH.“

### Væntar niðurstöður {#expected-results-6}
- Skref 20 keyrir einu sinni fyrir hvern viðskiptamann sem skref 10 skilar
- Skref 30 sendir Telegram-skilaboð þegar allri ítrun er lokið
- „Upplýsingar um keðjukeyrslu“ sýnir fleiri en 2 keyrð skref, og „Hlutir unnir“ passar við fjölda viðskiptamanna

---

## Sviðsmynd 8: Staða Bifröst stjórnanda {#scenario-8-bifrost-orchestrator-status}

**Svið:** Staða og eftirlit

### Undirbúningur {#setup-7}
1. Ljúkið sviðsmynd 1

### Skref {#steps-7}
1. Spyrjið aðstoðarmanninn: „Hver er staða Bifröst stjórnanda?“
2. Biðjið aðstoðarmanninn: „Endurræstu Bifröst stjórnanda ef þess þarf.“
3. Spyrjið aðstoðarmanninn aftur um stöðuna og opnið „Uppsetning Bifröst stjórnanda“

### Væntar niðurstöður {#expected-results-7}
- Skref 1: Svarið gefur stöðuna, vinnsluraðaflokkinn og hve margar færslur eru alls, lokaðar og virkar
- Skref 2: Aðstoðarmaðurinn segir hvort endurræsingar hafi verið þörf og hvort hún hafi verið gerð
- Skref 3: Staðan passar við „Staða vinnsluraðara“ á uppsetningarsíðunni

---

## Sviðsmynd 9: Keyra skýrslu eftir þörfum {#scenario-9-run-a-report-on-request}

**Svið:** Skýrslugerð

### Undirbúningur {#setup-8}
1. Ljúkið sviðsmynd 1

### Skref {#steps-8}
1. Spyrjið aðstoðarmanninn: „Hvaða skýrslur getur þú keyrt?“
2. Biðjið aðstoðarmanninn að lýsa einni skýrslu úr skrefi 1, ásamt útlitum hennar
3. Biðjið aðstoðarmanninn að vista þá skýrslu sem PDF, með síum sem gefnar eru í spjallinu
4. Biðjið aðstoðarmanninn að vista sömu skýrslu aftur með öðru útliti hennar

### Væntar niðurstöður {#expected-results-8}
- Skref 1: Svarið telur upp tiltækar skýrslur, án úreltra skýrslna
- Skref 2: Svarið gefur upplýsingar um skýrsluna og útlit hennar, og tengil á spjaldið „Forsendur skýrslu“ þar sem notandinn getur vistað valkosti beiðnisíðu
- Skref 3: Aðstoðarmaðurinn skilar skýrslunni, sem opnast sem PDF með væntu innihaldi
- Skref 4: Seinna PDF-skjalið notar valið útlit; sjálfgefið útlit skýrslunnar í Business Central er óbreytt

---

## Heimildasöfn {#permission-sets}

Sviðsmyndirnar hér að ofan nota eitt eða fleiri af eftirfarandi úthlutanlegu heimildasöfnum, auk heimildasafna Bifrost Foundation:

| Heimildasafn | Veitir |
| --- | --- |
| `BIFROST Orchestr ori` | Fulla notkun Bifröst stjórnanda |
| `BIFROST OrchSet ori` | Uppsetninguna, auðkenni biðlara, endurtekningarsniðmát, uppsetningarleiðsögnina og leyndarmál forritsins |
| `BIFROST OrchMgt ori` | Eftirlit með, keyrslu og endurræsingu vinnsluraðarfærslna, og lestur uppsetningarinnar |
| `BIFROST PlaybAdm ori` | Smíði, keyrslu og tímasetningu keðja, keyrsluskrá þeirra og forsendur skýrslna |
| `BIFROST PlaybVw ori` | Skoðun keðja og keyrsluskrár þeirra |
