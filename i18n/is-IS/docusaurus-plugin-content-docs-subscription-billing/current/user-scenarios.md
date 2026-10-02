---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Útgefandi:** Origo
**App:** Bifrost Subscription Billing (`dd7b8bd8-f93e-4ac4-a251-1a132a14ef3d`)
**Útgáfa:** 29.0.0.0
**Skiladagur:** 2026-09-06
**Prófunarumhverfi:** Sandkassi í Business Central með appi Microsoft, **Subscription Billing**, og **Bifrost Foundation** uppsettum, og gervigreindaraðstoð sem er tengd við Bifröst. Sjá „Prófunarauðkenni“ og „Forsendur“ hér fyrir neðan.

---

## Prófunarauðkenni

| Reitur | Gildi |
| --- | --- |
| Umhverfi | Sandkassi með Subscription Billing virkt |
| Fyrirtæki | Sýnifyrirtækið, eða hvaða fyrirtæki sem er með Subscription Billing uppsett |
| Notandi | Notandi með SUPER, eða með `BIFROST SubBil ori` auk heimildasafns Bifröst Foundation |

Þessi viðbót geymir engin eigin leyndarmál og kallar ekki á neina ytri þjónustu. Allt sem hún gerir keyrir inni í Business Central, á móti appi Microsoft, Subscription Billing.

---

## Forsendur

1. Setjið **Bifrost Foundation** upp og virkjið það — sjá uppsetningarleiðbeiningar Foundation-appsins.
2. Setjið **Subscription Billing** (Microsoft) upp og keyrið leiðsagnaruppsetningu þess, svo Subscription Contract Setup, númeraraðir og reikningssniðmát séu til.
3. Setjið **Bifrost Subscription Billing** upp.
4. Úthlutið prófunarnotandanum heimildasafninu **Bifrost Sub. Billing** (`BIFROST SubBil ori`), auk heimilda hans í Bifröst Foundation.
5. Tengið gervigreindaraðstoð (til dæmis Copilot, ChatGPT eða Claude) við sandkassann í gegnum MCP-þjón Bifrastar, eins og lýst er í [Tengdu gervigreindaraðstoðina](/setup/connect-your-ai/). Hver beiðni aðstoðarinnar er skráð á síðunni **Bifrost Messages** í Business Central.

### Uppsetning fyrirtækis sem síðari sviðsmyndir byggja á

Sviðsmyndir 1 til 5 þurfa ekkert umfram skrefin hér að ofan. Sviðsmyndir um reikningagerð, frestanir og notkun bóka í fjárhag, svo fyrirtækið þarf líka að vera sett upp fyrir það. Þetta eru eigin forsendur Microsoft fyrir Subscription Billing frekar en þessa apps, en auðvelt er að missa af þeim í nýjum sandkassa.

| Uppsetning | Hvers vegna hún þarf | Einkenni ef hana vantar |
| --- | --- | --- |
| **Almenn bókunaruppsetning** fyrir samsetningu bókunarflokka áskriftarvörunnar: *Cust. Sub. Contract Account*, *Cust. Sub. Contr. Def Account*, *Vend. Sub. Contract Account*, *Vend. Sub. Contr. Def. Account* | Frestanir samninga bókast á þessa reikninga | Bókun reikningsskjals mistekst með *„Cust. Sub. Contract Deferral Account must have a value in General Posting Setup...“* |
| **Almenn bókunaruppsetning**: afsláttarreikningar sölu- og innkaupalína og reikninga, kreditreikningar | Færslubók losunar frestana þarf þá | Losun frestana mistekst með *„Sales Line Disc. Account must have a value...“* |
| **VSK-bókunaruppsetning** fullgerð fyrir VSK-vörubókunarflokk áskriftarvörunnar | Öll bókun | Bókun mistekst með *„...VAT Posting Setup is blocked“* |
| **Source Code Setup → Sub. Contr. Deferrals Release** | Merkir færslur losunar frestana | Losun frestana mistekst með *„Subscription Contract Deferral must have a value in Source Code Setup“* |
| **Subscription Contract Setup → Def. Rel. Jnl. Template Name / Def. Rel. Jnl. Batch Name** | Færslubókin sem losunin bókast í gegnum | Losun frestana getur ekki bókað |
| **Subscription Contract Setup → Vend. Sub. Contract Nos.** | Númerun samninga lánardrottna | Stofnun Vendor Subscription Contract mistekst |
| Lína í **Item Unit of Measure** fyrir áskriftarvöruna, og sami kóði á haus áskriftarinnar | Reikningsvaran verður að hafa sömu einingu og áskriftin | Reikningur fyrir samning mistekst með *„The subscription's unit of measure contains a value that is not found in the item unit of measure...“* |
| **Gengi gjaldmiðla** sem ná yfir bókunardagsetningarnar — líka fyrir **viðbótarskýrslugjaldmiðil**, ef fyrirtækið hefur hann | Bókun umreiknar upphæðir í viðbótarskýrslugjaldmiðilinn á bókunardegi | Bókun mistekst með *„There is no Currency Exchange Rate within the filter“*. Gjaldmiðilskóðinn sem nefndur er getur verið **staðbundni** gjaldmiðillinn jafnvel þegar öll skjöl eru í staðbundnum gjaldmiðli og gengið sem vantar tilheyrir skýrslugjaldmiðlinum, svo athugið hvort tveggja |

### Viðbótaruppsetning fyrir sviðsmyndir um reikninga eftir notkun

Innflutningur notkunargagna les skrána í gegnum almennan notkunargagnatengil Microsoft, sem þarf, auk þess sem að ofan greinir:

- **Usage Data Supplier** af tegundinni Generic;
- **Generic Import Settings** fyrir þann birgi, sem vísa á **Data Exchange Definition** sem varpar dálkum skrárinnar á töfluna *Usage Data Generic Import*;
- línur í **Usage Data Supplier Reference**, **Usage Data Supp. Customer** og **Usage Data Supp. Subscription** sem tengja auðkenni viðskiptamanna og áskrifta í skránni við viðskiptamanninn í Business Central og notkunarbundnu áskriftarlínuna.

Án Data Exchange Definition lýkur innflutningnum samt sem beiðni og skilar vinnslustöðunni Error með eigin skýringu Business Central — hann kastar ekki villu.

---

## Sviðsmynd 1: Uppsetning og virkjun

**Svið:** Uppsetning og virkjun

### Skref
1. Opnið **Extension Management**.
2. Staðfestið að **Bifrost Subscription Billing** sé á listanum og uppsett.
3. Staðfestið að forsendan **Bifrost Foundation** sé uppsett og birtist fyrir ofan.
4. Opnið **Notendur**, veljið prófunarnotandann og staðfestið að hægt sé að úthluta heimildasafninu **Bifrost Sub. Billing**.

### Væntar niðurstöður
- Viðbótin setst upp án villna.
- Hægt er að úthluta heimildasafni hennar á notanda.

---

## Sviðsmynd 2: Finna aðgerðirnar

**Svið:** Kjarnavirkni

### Skref
1. Opnið síðuna **Bifrost Message Types** í Business Central.
2. Spyrjið aðstoðina: „Hvað getur þú gert í Subscription Billing?“

### Væntar niðurstöður
- Síðan sýnir aðgerðir þessa apps í Subscription Billing, hverja með lýsingu, sem innleið og virka.
- Aðstoðin lýsir sömu aðgerðum — samningum, reikningstillögum, forskoðun, notkunargögnum, frestunum, endurnýjun og innflutningi — lesnum úr Business Central sjálfu.

---

## Sviðsmynd 3: Lesa hjálp aðgerðar

**Svið:** Kjarnavirkni

### Skref
1. Biðjið aðstoðina: „Sýndu mér hjálpina fyrir aðgerðina sem býr til reikningstillögu.“ (Aðstoðin les hana með `Help.Implementation.Get`.)
2. Endurtakið fyrir einhverja aðra aðgerð Subscription Billing.

### Væntar niðurstöður
- Hjálparskjal fyrir aðgerðina, með köflunum Overview, Request Parameters, Request Example, Response Shape, Errors, Safety og Related Message Types.
- Allar aðrar aðgerðir Subscription Billing skila sömu uppbyggingu.

---

## Sviðsmynd 4: Kjarnavirkni — búa til reikningstillögu

**Svið:** Kjarnavirkni

### Undirbúningur
1. Í biðlaranum opnið **Billing Templates** og skrifið hjá ykkur kóða sniðmáts sem er til, eða búið til sniðmát fyrir viðskiptamenn.

### Skref
1. Biðjið aðstoðina: „Búðu til reikningstillögu fyrir reikningssniðmátið MONTHLY með reikningsdagsetningu 31. ágúst 2026.“ (Notið kóða sniðmátsins úr undirbúningnum.)
2. Opnið **Recurring Billing** í biðlaranum og síið á sama sniðmát.

### Væntar niðurstöður
- Aðstoðin segir að beiðnin hafi tekist og hve margar tillögulínur hafi orðið til.
- Jafnmargar línur reikningstillögu sjást í Recurring Billing.
- Ef ekkert var á gjalddaga tekst beiðnin samt og 0 línur verða til — það er ekki villa.

---

## Sviðsmynd 5: Kjarnavirkni — óbókaður reikningur fyrir samning

**Svið:** Kjarnavirkni

### Undirbúningur
1. Veljið Customer Subscription Contract með áskriftarlínum sem komnar eru á reikning.

### Skref
1. Biðjið aðstoðina: „Gerðu reikning fyrir áskriftarsamning viðskiptamanns CC000010 með reikningsdagsetningu 31. ágúst 2026.“ (Notið samningsnúmerið úr undirbúningnum.)
2. Opnið **Sölureikninga** í biðlaranum.

### Væntar niðurstöður
- Aðstoðin gefur upp númer skjalsins sem varð til.
- **Óbókaður** sölureikningur með því númeri er til fyrir viðskiptamann samningsins. Ekkert er bókað.
- Ef ekkert var á gjalddaga á samningnum tekst beiðnin, ekkert skjal verður til og aðstoðin útskýrir hvers vegna.

---

## Sviðsmynd 6: Forskoðun skrifar ekkert

**Svið:** Kjarnavirkni

### Undirbúningur
1. Skrifið hjá ykkur fjölda óbókaðra sölureikninga viðskiptamanns og fjölda reikningslína á einum af samningum hans.

### Skref
1. Biðjið aðstoðina: „Forskoðaðu reikninginn fyrir þann samning, án þess að búa neitt til.“
2. Athugið aftur lista sölureikninga og reikningslínur samningsins.

### Væntar niðurstöður
- Aðstoðin segir frá vel heppnaðri forskoðun sem var bakfærð og lýsir því sem yrði til.
- **Enginn nýr reikningur og engin ný reikningslína er til** — báðar tölurnar eru óbreyttar.

---

## Sviðsmynd 7: Villumeðhöndlun — ógilt inntak

**Svið:** Villumeðhöndlun

### Skref
1. Biðjið aðstoðina: „Búðu til reikningstillögu fyrir reikningssniðmátið DOES-NOT-EXIST.“
2. Biðjið aðstoðina að gera samningsreikning án þess að nefna samning, og segið henni að senda beiðnina eins og hún er.
3. Opnið **Bifrost Messages** og finnið báðar beiðnirnar.

### Væntar niðurstöður
- Báðum beiðnum lýkur með villustöðu og læsilegum skilaboðum — sú fyrri nefnir reikningssniðmátið sem vantar, sú síðari samninginn sem vantar.
- Ekkert er skrifað í hvorugu tilvikinu.
- Hvert svar vísar á `Help.Implementation.Get` fyrir rétta beiðni.
- Engin ómeðhöndluð undantekning eða óunninn villugluggi Business Central nær til notandans.

---

## Sviðsmynd 8: Skjalfestar takmarkanir skila skýrri villu

**Svið:** Villumeðhöndlun

### Skref
1. Biðjið aðstoðina: „Búðu til tillögu að verðuppfærslu í Subscription Billing.“

### Væntar niðurstöður
- Beiðninni lýkur með villustöðu.
- Skilaboðin segja að Microsoft hafi ekki opnað opinbert API fyrir þessa aðgerð í þessari útgáfu, nefna fall Microsoft sem um ræðir og vísa notandanum á síðuna **Contract Price Update** í biðlaranum.
- Þetta er skjalfest og ætluð hegðun — sjá breytingaskrá appsins.

---

## Sviðsmynd 9: Heilleiki gagna — engar eyðingar

**Svið:** Kjarnavirkni

### Skref
1. Farið yfir aðgerðir Subscription Billing á síðunni **Bifrost Message Types** úr sviðsmynd 2.

### Væntar niðurstöður
- Engin aðgerðanna eyðir færslum.
- Appið eyðir aldrei færslum áskrifta, samninga eða reikningagerðar.

---

## Sviðsmynd 10: Heimildaprófun

**Svið:** Heimildaprófun

### Undirbúningur
1. Búið til notanda **án** heimildasafnsins `BIFROST SubBil ori`, aðeins með aðgang að Bifröst Foundation.

### Skref
1. Tengið gervigreindaraðstoðina sem þann notanda og biðjið hana að búa til reikningstillögu fyrir reikningssniðmát sem er til.
2. Úthlutið `BIFROST SubBil ori` og reynið aftur.

### Væntar niðurstöður
- Án heimildasafnsins mistekst beiðnin með skýrri heimildavillu og ekkert er skrifað.
- Með því tekst beiðnin — háð eigin heimildum notandans á töflum Subscription Billing, sem þessi viðbót víkkar ekki.

---

## Sviðsmynd 11: Fjarlæging viðbótar

**Svið:** Fjarlæging

### Skref
1. Opnið **Extension Management**.
2. Fjarlægið **Bifrost Subscription Billing**.
3. Opnið síðuna **Bifrost Message Types** aftur.

### Væntar niðurstöður
- Viðbótin er fjarlægð án villu.
- Aðgerðir Subscription Billing birtast ekki lengur.
- Bifröst Foundation og Subscription Billing frá Microsoft virka áfram eðlilega, og engin gögn Subscription Billing eru fjarlægð við fjarlæginguna.

---

## Frágangur

Þegar öllum sviðsmyndum er lokið:

1. Eyðið eða bókið óbókaða sölureikninginn sem varð til í sviðsmynd 5.
2. Hreinsið allar línur reikningstillögu sem standa eftir undir sniðmátinu úr sviðsmynd 4.
3. Fjarlægið prófunarnotandann sem var búinn til í sviðsmynd 10.
4. Fjarlægið viðbótina, ef það var ekki gert í sviðsmynd 11.
