---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Útgefandi:** Origo
**Prófunarumhverfi:** Sandkassi í Business Central með sýnifyrirtækinu, Bifrost Foundation uppsett af
AppSource, og aðstoðarmaður sem er tengdur við Bifröst. Engin ytri auðkenni þarf. Sjá „Aðstoðarmaður“ og
„Prófunarnotendur“ hér fyrir neðan.

---

## Prófunarauðkenni {#test-credentials}

Þessi viðbót kallar ekki á neina ytri þjónustu og þarf engin eigin auðkenni. Bifrost Foundation, sem hún
byggir á, er sett upp af AppSource í sama sandkassa.

---

## Aðstoðarmaður {#ai-assistant}

Flestar sviðsmyndir eru keyrðar í gegnum aðstoðarmann (til dæmis Copilot, ChatGPT eða Claude) sem er
tengdur við sandkassann með MCP-þjóni Bifröst, eins og lýst er í
[Tengdu aðstoðarmanninn](/setup/connect-your-ai/). Hver beiðni aðstoðarmannsins er skráð á síðunni
**Bifrost Messages** í Business Central, þar sem prófandinn getur skoðað stöðu hennar og niðurstöðu.
Niðurstöðurnar eru staðfestar á stöðluðum síðum Business Central.

---

## Prófunarnotendur {#test-users}

Sviðsmynd 4 þarf tvo notendur í Business Central, því enginn getur samþykkt eigin tímaskýrslu:
**starfsmann** sem á tímaskýrsluna og **samþykkjanda**. Hinar sviðsmyndirnar eru keyrðar sem einn
notandi. Úthlutaðu heimildasöfnunum sem eru talin upp neðst á síðunni.

---

## Sviðsmynd 1: Uppsetning forritsins og síðan Uppsetning verkefna {#scenario-1-installation-and-projects-setup}

**Svið:** Uppsetning og virkjun

### Undirbúningur {#setup}
1. Byrjaðu með sandkassa í Business Central með sýnifyrirtækinu
2. Settu upp „Bifrost Foundation“ af AppSource og ljúktu uppsetningu þess eins og lýst er í sviðsmyndum þess
3. Settu upp viðbótina „Bifrost Projects“

### Skref {#steps}
1. Opnaðu „Uppsetning Bifröst“ úr leitarstikunni og finndu „Bifrost Projects“ í lista uppsettra forrita
2. Leitaðu að „Uppsetning verkefna“ og opnaðu síðuna sem tilheyrir Bifrost Projects (hún hefur flokkana „Almennt“ og „Vettvangsþjónusta“)
3. Staðfestu að hakað sé við „Virkt“
4. Staðfestu sjálfgildin í „Vettvangsþjónusta“: „Námundun í mínútum“ = 1, „Vikmörk biðlaratíma (klst.)“ = 24, ekki hakað við „Leyfa óáætlaða verkþætti“
5. Veldu hjálpartáknið á síðunni

### Væntar niðurstöður {#expected-results}
- Skref 1: Bifrost Projects er skráð sem uppsett
- Skref 3: Kveikt er á verkefnum fyrir fyrirtækið eftir uppsetningu
- Skref 4: Reitir vettvangsþjónustu sýna sjálfgildi sín
- Skref 5: Hjálparsíðan fyrir Uppsetning verkefna opnast á docs.bifrost.origo.is

---

## Sviðsmynd 2: Stofna verkefni með verkhlutum og áætlunarlínum {#scenario-2-create-a-project-with-tasks-and-planning-lines}

**Svið:** Kjarnavirkni — Verkefni

### Undirbúningur {#setup-1}
1. Ljúktu sviðsmynd 1
2. Skráðu hjá þér viðskiptamannsnúmer og forðanúmer úr sýnigögnunum

### Skref {#steps-1}
1. Biddu aðstoðarmanninn: „Stofnaðu verkefnið TEST-PROJ fyrir viðskiptamann [viðskiptamannsnúmer] með lýsingunni AppSource prófunarverkefni. Bættu við verkhluta 1000 Uppsetning með áætlunarlínu upp á 8 stundir fyrir forða [forðanúmer], og verkhluta 2000 Efni.“
2. Opnaðu „Verkefni“ og opnaðu verkefnið TEST-PROJ
3. Opnaðu verkhlutana og áætlunarlínur verkhluta 1000
4. Biddu aðstoðarmanninn: „Breyttu stöðu verkefnisins TEST-PROJ í Opið.“
5. Biddu aðstoðarmanninn: „Sýndu mér áætlun á móti rauntölum fyrir verkefnið TEST-PROJ.“

### Væntar niðurstöður {#expected-results-1}
- Skref 1: Aðstoðarmaðurinn staðfestir verkefnið með tveimur verkhlutum og einni áætlunarlínu
- Skref 2: Verkefnisspjaldið sýnir viðskiptamann og lýsingu eins og beðið var um
- Skref 3: Verkhluti 1000 hefur áætlunarlínu forða upp á 8 stundir; verkhluti 2000 er til
- Skref 4: Verkefnisspjaldið sýnir stöðuna Opið
- Skref 5: Svarið sýnir áætlaðar tölur verkhluta 1000 og engar rauntölur enn

### Villutilvik {#error-cases}
- Viðskiptamaður sem er ekki til: aðstoðarmaðurinn segir frá villunni og ekkert verkefni er stofnað

---

## Sviðsmynd 3: Slökkva á verkefnum fyrir fyrirtæki {#scenario-3-turn-projects-off-for-a-company}

**Svið:** Uppsetning — Rofi fyrirtækis

### Undirbúningur {#setup-2}
1. Ljúktu sviðsmynd 2

### Skref {#steps-2}
1. Opnaðu „Uppsetning verkefna“ og taktu hakið af „Virkt“
2. Biddu aðstoðarmanninn: „Breyttu lýsingu verkefnisins TEST-PROJ í Breytt.“
3. Opnaðu „Uppsetning verkefna“ aftur og hakaðu við „Virkt“
4. Endurtaktu beiðnina úr skrefi 2

### Væntar niðurstöður {#expected-results-2}
- Skref 2: Aðstoðarmaðurinn getur ekki gert breytinguna: aðgerðin er ekki í boði, eða beiðninni er hafnað með skilaboðum um að verkefni séu óvirk fyrir þetta fyrirtæki og séu virkjuð í Uppsetning verkefna; verkefnið er óbreytt
- Skref 4: Lýsingu verkefnisins TEST-PROJ er breytt

---

## Sviðsmynd 4: Senda inn og samþykkja tímaskýrslu {#scenario-4-submit-and-approve-a-time-sheet}

**Svið:** Kjarnavirkni — Tímaskýrslur

### Undirbúningur {#setup-3}
1. Ljúktu sviðsmynd 2
2. Í „Forðagrunnur“ skaltu athuga stillingar tímaskýrslna (til dæmis fyrsta vikudag)
3. Á forðaspjaldi forðans úr sviðsmynd 2 skaltu haka við „Nota tímaskýrslu“, setja starfsmannsnotandann sem eiganda tímaskýrslu og samþykkjandanotandann sem samþykkjanda tímaskýrslu

### Skref {#steps-3}
1. Skráður inn sem starfsmaðurinn, biddu aðstoðarmanninn: „Stofnaðu tímaskýrsluna mína fyrir þessa viku.“
2. Biddu aðstoðarmanninn: „Bættu 4 stundum í dag á verkefnið TEST-PROJ, verkhluta 1000, á tímaskýrsluna mína.“
3. Biddu aðstoðarmanninn: „Sendu tímaskýrsluna mína inn.“
4. Skráður inn sem samþykkjandinn, biddu aðstoðarmanninn: „Hvaða tímaskýrslulínur bíða samþykktar minnar?“
5. Biddu aðstoðarmanninn: „Samþykktu þessar línur.“
6. Opnaðu „Tímaskýrslur“ og tímaskýrslu forðans

### Væntar niðurstöður {#expected-results-3}
- Skref 1: Tímaskýrsla fyrir vikuna er stofnuð fyrir forða starfsmannsins
- Skref 2: Verkefnalínu með 4 stundum í dag er bætt við
- Skref 3: Línan hefur stöðuna Send inn
- Skref 4: Svarið sýnir innsendu línu starfsmannsins
- Skref 5: Aðstoðarmaðurinn staðfestir samþykktina
- Skref 6: Línan hefur stöðuna Samþykkt

### Villutilvik {#error-cases-1}
- Starfsmaðurinn biður aðstoðarmanninn að samþykkja eigin tímaskýrslu: beiðninni er hafnað

---

## Sviðsmynd 5: Skrá vettvangsheimsókn {#scenario-5-record-a-field-visit}

**Svið:** Kjarnavirkni — Vettvangsþjónusta

### Undirbúningur {#setup-4}
1. Ljúktu sviðsmynd 4 (tímaskýrsla starfsmannsins fyrir vikuna er til og hefur línu fyrir verkhluta 1000)
2. Á „Uppsetning verkefna“ skaltu velja vinnutegund í „Vinnutegund ferðar“, forða sem er ekki lokaður og hefur grunnmælieiningu í „Akstursforði“, og setja „Námundun í mínútum“ á 15
3. Gakktu úr skugga um að forðinn úr sviðsmynd 2 hafi klukkustundir sem mælieiningu

### Skref {#steps-4}
1. Skráður inn sem starfsmaðurinn, biddu aðstoðarmanninn: „Ég byrjaði að vinna á verkefninu TEST-PROJ, verkhluta 1000, fyrir klukkustund. Skráðu upphafið.“
2. Biddu aðstoðarmanninn: „Stöðvaðu heimsóknina núna.“
3. Biddu aðstoðarmanninn: „Ljúktu heimsókninni á verkefninu TEST-PROJ, verkhluta 1000, ég ók 42 km, skipt var um dæluna.“
4. Opnaðu tímaskýrslu starfsmannsins
5. Opnaðu „Notkunarlínur tímaskýrslna“

### Væntar niðurstöður {#expected-results-4}
- Skref 1: Aðstoðarmaðurinn staðfestir að heimsókn sé í gangi, hafin fyrir klukkustund
- Skref 2: Heimsóknin stöðvast og um 1 stund, námunduð að margfeldi af 15 mínútum, bætist á tímaskýrsluna
- Skref 3: Heimsókninni er lokið
- Skref 4: Stundir heimsóknarinnar birtast í opinni línu fyrir verkhluta 1000 (nýrri línu, því línan úr sviðsmynd 4 er þegar samþykkt)
- Skref 5: Notkunarlína upp á 42 fyrir akstursforðann hefur stöðuna Opin

### Villutilvik {#error-cases-2}
- Heimsókn hafin á verkhluta sem forðinn er ekki áætlaður á, og ekki hakað við „Leyfa óáætlaða verkþætti“: beiðninni er hafnað

---

## Sviðsmynd 6: Eftirfylgnibeiðni og umbreyting {#scenario-6-follow-up-request-and-conversion}

**Svið:** Kjarnavirkni — Vettvangsþjónusta

### Undirbúningur {#setup-5}
1. Ljúktu sviðsmynd 5
2. Samþykkjandanotandinn er verkefnisstjóri verkefnisins TEST-PROJ og má breyta verkhlutum og áætlunarlínum

### Skref {#steps-5}
1. Skráður inn sem starfsmaðurinn, biddu aðstoðarmanninn: „Biddu um eftirfylgni á verkefninu TEST-PROJ, verkhluta 1000: skipta um seinni ventilinn, um 3 stundir.“
2. Opnaðu „Eftirfylgnibeiðnir verkefna“
3. Skráður inn sem samþykkjandinn, biddu aðstoðarmanninn: „Sýndu eftirfylgnibeiðnirnar á verkefninu TEST-PROJ.“
4. Biddu aðstoðarmanninn: „Breyttu þessari beiðni í nýjan verkhluta.“
5. Opnaðu „Eftirfylgnibeiðnir verkefna“ og síðan verkhluta TEST-PROJ

### Væntar niðurstöður {#expected-results-5}
- Skref 2: Starfsmaðurinn sér beiðni sína með stöðuna Opin
- Skref 3: Samþykkjandinn sér sömu beiðni
- Skref 4: Aðstoðarmaðurinn staðfestir umbreytinguna
- Skref 5: Beiðnin hefur stöðuna Umbreytt og „Stofnaður verkþáttur“ er fylltur út; nýi verkhlutinn er til með áætlunarlínu forða upp á 3 stundir

### Villutilvik {#error-cases-3}
- Starfsmaðurinn biður aðstoðarmanninn að breyta beiðninni: beiðninni er hafnað
- Beiðni sem hefur þegar stöðuna Umbreytt er breytt aftur: beiðninni er hafnað

---

## Sviðsmynd 7: Dagsetning vinnuskýrslu á sölureikningi {#scenario-7-time-sheet-date-on-a-sales-invoice}

**Svið:** Kjarnavirkni — Reikningsfærsla

### Undirbúningur {#setup-6}
1. Ljúktu sviðsmynd 2
2. Bættu reikningshæfri áætlunarlínu með áætlunardagsetningu við verkhluta 1000 í verkefninu TEST-PROJ

### Skref {#steps-6}
1. Opnaðu áætlunarlínur verkhluta 1000 og veldu „Stofna sölureikning“
2. Opnaðu sölureikninginn sem var stofnaður
3. Skoðaðu dálkinn „Dagsetning vinnuskýrslu“ í reikningslínunum

### Væntar niðurstöður {#expected-results-6}
- Skref 3: Línan úr verkefninu sýnir dagsetningu skjals (eða áætlunardagsetningu) áætlunarlínunnar í „Dagsetning vinnuskýrslu“, næst á undan „Lýsing“; ekki er hægt að breyta dálkinum

---

## Heimildasöfn {#permission-sets}

Sviðsmyndirnar hér fyrir ofan nota þessi úthlutanlegu heimildasöfn, til viðbótar við heimildasöfn Bifrost
Foundation:

| Heimildasafn | Veitir | Úthlutað með |
| --- | --- | --- |
| `PROJ TS SELF ori` | Eigin tímaskýrslur notandans | `BIFROST Read ori` |
| `PROJ TS APPROVER ori` | Samþykkt og höfnun tímaskýrslna sem beinast að notandanum | `BIFROST Read ori` |
| `PROJ TS POST ori` | Bókun tímaskýrslna og að setja þær í safn | `BIFROST Read ori` |
| `PROJ TS ADMIN ori` | Umsjón tímaskýrslna annarra, og Uppsetning tæknimanna | `BIFROST Full ori` |
| `PROJ USAGE ori` | Meðferð notkunarlína | `BIFROST Full ori` |
| `PROJ FIELD TECH ori` | Vettvangstæknimenn: eigin tímaskýrslur og notkun, heimsóknir, birgðir í bíl, undirritun og eftirfylgnibeiðnir | `BIFROST Read ori` |
| `PROJ VISIT ori` | Vettvangsheimsóknir | `BIFROST Read ori` og `PROJ TS SELF ori` |

Fyrir sviðsmyndirnar: starfsmaðurinn þarf `BIFROST Read ori` og `PROJ FIELD TECH ori`, ásamt venjulegum
lesaðgangi í Business Central (til dæmis `D365 READ`); samþykkjandinn þarf `BIFROST Full ori` og
`PROJ TS APPROVER ori`, ásamt heimild í Business Central til að breyta verkefnum. Notandi sviðsmynda 1 til
3 og 7 þarf `BIFROST Full ori` og heimild í Business Central til verkefna og sölureikninga.
