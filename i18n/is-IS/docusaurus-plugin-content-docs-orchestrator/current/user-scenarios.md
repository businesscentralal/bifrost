---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Útgefandi:** Origo
**Útgáfa:** 28.0.0.0
**Skiladagur:** 2026-09-05
**Prófunarumhverfi:** Krefst uppsetts Telegram-vélmennislykils fyrir tilkynningasviðsmyndirnar, og gervigreindaraðstoðar sem er tengd við Bifröst. Sjá „Prófunarauðkenni“ og „Gervigreindaraðstoð“ hér fyrir neðan.

---

## Prófunarauðkenni

Þessi viðbót notar Telegram Bot API til að senda tilkynningar.

**Útvegið:** Telegram-vélmennislykil (frá @BotFather) og spjallauðkenni í Telegram fyrir prófunarnotanda.
Vélmennislykillinn er sleginn inn á síðunni „Job Queue Orchestrator Setup“ og geymdur dulkóðaður í Business Central.
Spjallauðkennið er geymt fyrir hvern notanda í „Bifrost User Setup“ (Bifrost Foundation).

Fyrir tölvupósttilkynningar þarf að setja upp tölvupóstreikning í BC.

---

## Gervigreindaraðstoð

Sumar sviðsmyndir eru keyrðar í gegnum gervigreindaraðstoð (til dæmis Copilot, ChatGPT eða
Claude) sem er tengd við sandkassann í gegnum MCP-þjón Bifrastar, eins og lýst er í
[Tengdu gervigreindaraðstoðina](/setup/connect-your-ai/). Hver beiðni aðstoðarinnar er skráð á
síðunni **Bifrost Messages** í Business Central, þar sem prófandinn getur skoðað stöðu hennar og
niðurstöðu.

---

## Sviðsmynd 1: Uppsetning viðbótar og leiðsagnarforrit

**Svið:** Uppsetning og virkjun

### Undirbúningur
1. Byrjið með hreinan BC-sandkassa (sýnifyrirtæki)
2. Setjið upp viðbótina „Bifrost Foundation“ (forsenda)
3. Setjið upp viðbótina „Bifrost Orchestrator“

### Skref
1. Opnið síðuna „Bifrost Setup“ úr leitarstiku BC
2. Ef síðan sýnir tilkynninguna um HTTP-biðlarabeiðnir, smellið á „Hefja uppsetningarleiðsögn“ í henni og ljúkið leiðsögninni
3. Opnið síðuna „Aðstoðuð uppsetning“ úr leitarstiku BC og ræsið „Bifrost Orchestrator Setup“
4. Staðfestið að skref 1 (Velkomin í Bifrost Orchestrator) birtist og smellið á „Áfram“
5. Staðfestið að skref 2 (Virkja HTTP-biðlarabeiðnir) sýni núverandi stöðu
6. Ef það er ekki virkt, smellið á „Virkja HTTP-biðlarabeiðnir“ og síðan „Staðfesta“
7. Smellið á „Áfram“ í skref 3 (Job Queue Orchestrator), sem sýnir stöðu vinnsluraðarinnar
8. Smellið á „Ræsa vinnsluröð“ til að ræsa stjórnunarvinnsluröðina
9. Smellið á „Áfram“ í skref 4 (Uppsetningu lokið) og smellið á „Ljúka“
10. Opnið „Bifrost Setup“ aftur

### Væntar niðurstöður
- Uppsetningarleiðsögn Bifrastar kveikir á HTTP-biðlarabeiðnum fyrir uppsett Bifröst-forrit
- Leiðsagnaruppsetningin „Bifrost Orchestrator Setup“ opnast og leiðir í gegnum 4 skref; skref 2 sýnir að HTTP-biðlarabeiðnir séu virkar, eða gerir kleift að virkja þær
- Stjórnunarvinnsluröðin ræsist
- Skref 10: „Bifrost Setup“ sýnir ekki lengur HTTP-tilkynninguna

---

## Sviðsmynd 2: Skrá og keyra tímasetta færslu

**Svið:** Kjarnavirkni — stjórnun færslna

### Undirbúningur
1. Ljúkið sviðsmynd 1 (leiðsagnarforritinu lokið)
2. Gangið úr skugga um að að minnsta kosti ein vinnsluraðarfærsla sé til (til dæmis eigin stjórnunarfærsla appsins)

### Skref
1. Opnið síðuna „Job Queue Orchestrator Setup“
2. Skoðið undirsíðuna „Orchestrator Entries“
3. Farið í „Vinnsluraðarfærslur“ úr aðgerðavalmyndinni og skrifið hjá ykkur lýsingu einhverrar vinnsluraðarfærslu
4. Biðjið aðstoðina: „Settu vinnsluraðarfærsluna <lýsing úr skrefi 3> undir eftirlit Orchestrator.“
5. Biðjið aðstoðina: „Keyrðu þessa Orchestrator-færslu núna.“

### Væntar niðurstöður
- Skref 4: Aðstoðin staðfestir að færslan hafi verið skráð og sé ekki lokuð
- Skref 5: Færslan keyrir; keyrslan birtist í **virkniskrá** færslunnar
- Tímasetta færslan birtist á undirsíðunni „Orchestrator Entries“ á uppsetningarsíðunni

---

## Sviðsmynd 3: Telegram-tilkynning um tímasetta færslu

**Svið:** Tilkynningar — Telegram

### Undirbúningur
1. Ljúkið sviðsmynd 1
2. Opnið „Job Queue Orchestrator Setup“ og sláið inn Telegram-vélmennislykil
3. Opnið „Bifrost User Setup“ og sláið inn spjallauðkenni í Telegram fyrir núverandi notanda
4. Búið til tímasetta færslu eða notið færslu sem er til

### Skref
1. Opnið „Job Queue Orchestrator Entry Card“ fyrir færsluna
2. Setjið „Tegund tilkynningar“ á „Telegram“
3. Setjið „Viðtakanda tilkynningar“ á spjallauðkenni prófunarinnar í Telegram
4. Smellið á aðgerðina „Senda prufutilkynningu“
5. Athugið hvort skilaboðin hafi borist í Telegram-spjallið

### Væntar niðurstöður
- Skref 4: Engin villa — prufutilkynningin er send
- Skref 5: Skilaboð með lýsingu færslunnar birtast í Telegram-spjallinu
- Ef HTTP-biðlarabeiðnir eru ekki virkar birtast skýr villuboð

---

## Sviðsmynd 4: Senda Telegram-skilaboð úr aðstoðinni

**Svið:** Afhending — Telegram

### Undirbúningur
1. Ljúkið undirbúningi sviðsmyndar 3 (vélmennislykill uppsettur, spjallauðkenni í Bifrost User Setup)

### Skref
1. Biðjið aðstoðina: „Sendu mér Telegram-skilaboð sem segja: Hello from Business Central!“
2. Athugið hvort skilaboðin hafi borist í Telegram-spjallið

### Væntar niðurstöður
- Skref 1: Aðstoðin staðfestir að skilaboðin hafi verið send
- Skref 2: Skilaboðin „Hello from Business Central!“ birtast í Telegram-spjalli notandans
- Spjallauðkennið er sótt sjálfkrafa úr Bifrost User Setup notandans sem kallar

### Villutilvik
- Ef enginn vélmennislykill er til: villan „Telegram Bot Token is not configured in Orchestrator Setup.“
- Ef notandinn hefur ekkert spjallauðkenni: villan „No Telegram Chat ID configured for the current user. Set it in Bifrost User Setup.“
- Ef HTTP er ekki virkt: villan „HTTP client requests are not enabled for this extension. …“

---

## Sviðsmynd 5: Búa til og keyra keðju

**Svið:** Kjarnavirkni — keðjuvél

### Undirbúningur
1. Ljúkið sviðsmynd 1

### Skref
1. Opnið listasíðuna „Bifrost Playbooks“
2. Búið til nýja keðju með Kóða = „TEST-SCENARIO“ og Lýsingu = „AppSource Test Playbook“
3. Bætið við skrefi 10: í „Skilaboðategund“ veljið aðgerðina sem les stöðu Orchestrator; setjið Næsta skref nr. (árangur) = 20
4. Bætið við skrefi 20: í „Skilaboðategund“ veljið aðgerðina sem sendir Telegram-skilaboð (ef Telegram er uppsett), eða skiljið reitinn eftir auðan
5. Í beiðnasniðmáti skrefs 20 (upplýsingareiturinn Request Template eða síðan „Playbook Template Editor“) sláið inn textann „Orchestrator status check complete“ sem skilaboðin
6. Veljið „Keyra núna“ á keðjuspjaldinu

### Væntar niðurstöður
- Skref 6: Keyrslunni lýkur og skilaboð segja frá niðurstöðunni
- Keðjan keyrir bæði skrefin í röð
- „Playbook Execution Log“ sýnir keyrsluna með stöðuna Lokið, 2 skref keyrð og 0 skref sem mistókust

### Athugasemdir
- Aðgerðirnar sem skref getur notað, og hvað hver þeirra tekur við, eru taldar upp á síðunni **Bifrost Message Types**

---

## Sviðsmynd 6: Tímasetja keðju

**Svið:** Kjarnavirkni — tímasetning keðja

### Undirbúningur
1. Ljúkið sviðsmynd 5 (keðjan „TEST-SCENARIO“ er til)

### Skref
1. Opnið spjaldið „Bifrost Playbook“ fyrir „TEST-SCENARIO“
2. Smellið á aðgerðina „Tímasetja“ — síðan „Schedule Playbook“ opnast
3. Setjið endurtekningarsniðmát eða gildi í „Fjöldi mínútna milli keyrslna“, veljið tegund tilkynningar og staðfestið með Í lagi
4. Staðfestið að „Tímasett“ á keðjuspjaldinu sé nú Já
5. Smellið á aðgerðina „Orchestrator-færsla“ til að opna tímasettu færsluna sem varð til
6. Eyðið tímasettu færslunni og staðfestið að „Tímasett“ á keðjuspjaldinu verði aftur Nei

### Væntar niðurstöður
- Skref 3: Keðjan er tímasett með tímasettri færslu og endurtekinni vinnsluraðarfærslu
- Skref 5: „Job Queue Orchestrator Entry Card“ opnast á færslunni sem varð til fyrir keðjuna
- Skref 6: Þegar færslan er fjarlægð hverfur tímasetningin

---

## Sviðsmynd 7: Keðja með ítrun

**Svið:** Kjarnavirkni — keðjuvél (ítarlegri)

### Undirbúningur
1. Ljúkið sviðsmynd 1
2. Gangið úr skugga um að að minnsta kosti 2 viðskiptamenn séu til

### Skref
1. Búið til keðjuna „TEST-FOREACH“ með:
   - Skrefi 10: aðgerðinni sem les færslur, með beiðnasniðmáti sem biður um allt að 5 viðskiptamenn
   - Skrefi 20: aðgerðinni sem les stöðu Orchestrator, með ítrun yfir niðurstöðu skrefs 10 (Iterate Array Path = „result“, Iterate Source Step No. = 10)
   - Skrefi 30: aðgerðinni sem sendir Telegram-skilaboð — skilaboð um að keyrslu sé lokið
2. Veljið „Keyra núna“ á keðjuspjaldinu, eða biðjið aðstoðina: „Keyrðu keðjuna TEST-FOREACH.“

### Væntar niðurstöður
- Skref 20 keyrir einu sinni fyrir hvern viðskiptamann sem skref 10 skilar
- Skref 30 sendir Telegram-skilaboð eftir að allri ítrun er lokið
- „Playbook Execution Detail“ sýnir fleiri en 2 keyrð skref og fjölda unninna atriða sem passar við fjölda viðskiptamanna

---

## Sviðsmynd 8: Staða Orchestrator og heilbrigðisathugun

**Svið:** Staða og vöktun

### Undirbúningur
1. Ljúkið sviðsmynd 1

### Skref
1. Spyrjið aðstoðina: „Hver er staða Orchestrator?“
2. Biðjið aðstoðina: „Endurræstu Orchestrator ef þess þarf.“
3. Spyrjið aðstoðina aftur um stöðuna og opnið „Job Queue Orchestrator Setup“

### Væntar niðurstöður
- Skref 1: Svarið gefur stöðu Orchestrator, vinnsluraðarflokkinn og hve margar færslur eru alls, lokaðar og virkar
- Skref 2: Aðstoðin segir hvort endurræsingar hafi verið þörf og hvort hún hafi verið gerð
- Skref 3: Staðan endurspeglar endurræsinguna og passar við **stöðu vinnsluraðara** á uppsetningarsíðunni

---

## Sviðsmynd 9: Keyra skýrslu eftir þörfum

**Svið:** Skýrslugerð

### Undirbúningur
1. Ljúkið sviðsmynd 1

### Skref
1. Spyrjið aðstoðina: „Hvaða skýrslur getur þú keyrt?“
2. Biðjið aðstoðina að lýsa einni skýrslu úr skrefi 1, ásamt útlitum hennar
3. Biðjið aðstoðina að vista þá skýrslu sem PDF, með vistaðri forstillingu beiðni eða með síum sem gefnar eru í spjallinu

### Væntar niðurstöður
- Skref 1: Svarið telur upp tiltækar skýrslur, án úreltra skýrslna
- Skref 2: Svarið gefur upplýsingar um skýrsluna, tiltæk útlit hennar og vistuðu forstillinguna
- Skref 3: Aðstoðin skilar niðurstöðu skýrslunnar, sem opnast sem PDF með væntu innihaldi

---

## Heimildasöfn

Sviðsmyndirnar hér að ofan krefjast eins eða fleiri af eftirfarandi úthlutanlegu heimildasöfnum, auk heimildasafna Bifrost Foundation:

| Heimildasafn | Veitir |
| --- | --- |
| `BIFROST Orchestr ori` | Lesaðgang að tímasettum færslum, uppsetningu tímasetningar, endurtekningarsniðmátum og auðkennum biðlara |
| `BIFROST OrchSet ori` | Uppsetningaraðgang — uppsetning tímasetningar, endurtekningarsniðmát, auðkenni biðlara |
| `BIFROST OrchMgt ori` | Stjórnunaraðgang — viðhald tímasettra færslna |
| `BIFROST PlaybAdm ori` | Fulla stjórnun keðja, skrefa, skilyrða, keyrslna og forstillinga skýrslna |
| `BIFROST PlaybVw ori` | Lesaðgang að keðjum og keyrsluskrám |
