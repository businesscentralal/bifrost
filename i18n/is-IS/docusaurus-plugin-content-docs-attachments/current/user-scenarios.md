---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Útgefandi:** Origo
**App:** Bifrost Attachments (`672df32a-a0c5-4a22-b591-0efa38023e95`)
**Útgáfa:** 28.0.0.0
**Skiladagur:** 2026-09-05
**Prófunarumhverfi:** Krefst uppsetts Azure Blob Storage reiknings eða SharePoint-skjalasafns sem BC-sandkassinn nær til, og gervigreindaraðstoðar sem er tengd við Bifröst. Sjá „Prófunarauðkenni“ og „Gervigreindaraðstoð“ hér fyrir neðan.

---

## Prófunarauðkenni

Þessi viðbót tengist ytri skýgeymslu í gegnum stöðluðu tengla Business Central fyrir ytri
skráageymslu (Azure Blob Storage, Azure File Share, SharePoint).

**Valkostur:** Útvegið prófunarreikning í Azure Blob Storage með gám sem þegar hefur verið búinn til.
Látið fylgja heiti geymslureikningsins, heiti gámsins og SAS-teikn eða aðgangslykil
sem gildir í að minnsta kosti 4 vikur frá skiladegi.

Viðbótin sjálf geymir engin leyndarmál — hún lætur tengiöpp Business Central um þau
(t.d. „Azure Blob Storage Connector“ frá Microsoft). Prófandinn þarf að setja upp
viðeigandi tengiapp og stilla það áður en prófun hefst.

---

## Gervigreindaraðstoð

Sviðsmyndirnar hér fyrir neðan eru keyrðar í gegnum gervigreindaraðstoð (til dæmis Copilot,
ChatGPT eða Claude) sem er tengd við sandkassann í gegnum MCP-þjón Bifrastar, eins og lýst er í
[Tengdu gervigreindaraðstoðina](/setup/connect-your-ai/). Hver beiðni aðstoðarinnar er skráð á
síðunni **Bifrost Messages** í Business Central, þar sem prófandinn getur skoðað stöðu hennar og
niðurstöðu.

---

## Sviðsmynd 1: Uppsetning viðbótar og stillingar

**Svið:** Uppsetning og virkjun

### Undirbúningur
1. Byrjið með hreinan BC-sandkassa (sýnifyrirtæki)
2. Setjið upp viðbótina „Bifrost Foundation“ (forsenda)
3. Setjið upp viðbótina „Bifrost Attachments“

### Skref
1. Leitið að „Bifrost Storage Setup“ í leitarstiku BC
2. Staðfestið að listasíðan opnist án villu
3. Veljið „Nýtt“ til að búa til nýja geymslutengingu
4. Sláið inn „TEST“ í reitinn „Kóði“
5. Sláið inn „Test Storage Connection“ í reitinn „Lýsing“
6. Setjið reitinn „Tengill“ á uppsetta tengilinn (t.d. „Azure Blob Storage“)
7. Veljið aðgerðina „Velja skráareikning“ og veljið uppsetta skráareikninginn
8. Setjið „Virkt“ á já
9. Veljið „Prófa tengingu“ og staðfestið skilaboðin um árangur
10. Lokið spjaldinu

### Væntar niðurstöður
- Síðan „Bifrost Storage Setup“ opnast og er breytanleg
- Ný geymslutenging er vistuð með Kóða = „TEST“
- Tengingin birtist á listasíðunni
- „Prófa tengingu“ segir að hægt sé að ná í tenginguna

### Athugasemdir
- Fellilistinn „Tengill“ sýnir aðeins tengla úr uppsettum tengiöppum BC
- Uppflettingin „Velja skráareikning“ sýnir reikninga sem valinn tengill hefur skráð
- „Grunnslóð“ má skilja eftir auða til að vísa á rót reikningsins

---

## Sviðsmynd 2: Skrá geymslutengingarnar

**Svið:** Kjarnavirkni

### Undirbúningur
1. Ljúkið sviðsmynd 1 (geymslutengingin „TEST“ er til)
2. Tengið gervigreindaraðstoðina við sandkassann

### Skref
1. Spyrjið aðstoðina: „Hvaða geymslutengingar eru uppsettar í Business Central?“
2. Opnið **Bifrost Messages** í Business Central og finnið beiðnina

### Væntar niðurstöður
- Svarið sýnir tenginguna „TEST“ og tegund tengils hennar
- Engin leyndarmál (lyklar, teikn) eru í svarinu
- Beiðnin birtist sem lokið á **Bifrost Messages**

---

## Sviðsmynd 3: Skrá skrár í möppu

**Svið:** Kjarnavirkni

### Undirbúningur
1. Ljúkið sviðsmynd 1 (geymslutengingin „TEST“ er til)
2. Gangið úr skugga um að tengdi geymslureikningurinn innihaldi að minnsta kosti 2 skrár í rótinni eða þekktri möppu

### Skref
1. Spyrjið aðstoðina: „Sýndu skrárnar í rót geymslutengingarinnar TEST.“

### Væntar niðurstöður
- Svarið sýnir skrárnar með heiti, slóð og stærð
- Að minnsta kosti 2 skrár eru sýndar, í samræmi við skrárnar í geymslunni

---

## Sviðsmynd 4: Hlaða upp og sækja skrá

**Svið:** Kjarnavirkni

### Undirbúningur
1. Ljúkið sviðsmynd 1 (geymslutengingin „TEST“ er til)

### Skref
1. Biðjið aðstoðina: „Búðu til skrána test-upload.txt í geymslutengingunni TEST með textanum Hello World.“
2. Athugið í geymslureikningnum (til dæmis í Azure-gáttinni) að skráin sé til
3. Biðjið aðstoðina: „Lestu skrána test-upload.txt úr geymslutengingunni TEST og sýndu mér innihaldið.“

### Væntar niðurstöður
- Skref 1: Aðstoðin segir að skráin hafi verið búin til, án villu
- Skref 2: Skráin „test-upload.txt“ er í geymslureikningnum
- Skref 3: Innihaldið sem birtist er „Hello World“

---

## Sviðsmynd 5: Kanna hvort skrá sé til

**Svið:** Kjarnavirkni

### Undirbúningur
1. Ljúkið sviðsmynd 4 (skráin „test-upload.txt“ er í geymslunni)

### Skref
1. Spyrjið aðstoðina: „Er skráin test-upload.txt til í geymslutengingunni TEST?“
2. Spyrjið aðstoðina: „Er skráin nonexistent-file.txt til í geymslutengingunni TEST?“

### Væntar niðurstöður
- Skref 1: Svarið er að skráin sé til
- Skref 2: Svarið er að skráin sé ekki til

---

## Sviðsmynd 6: Afrita og færa skrá

**Svið:** Kjarnavirkni

### Undirbúningur
1. Ljúkið sviðsmynd 4 (skráin „test-upload.txt“ er í geymslunni)

### Skref
1. Biðjið aðstoðina: „Afritaðu test-upload.txt í test-copy.txt í geymslutengingunni TEST.“
2. Spyrjið aðstoðina hvort „test-copy.txt“ sé til
3. Biðjið aðstoðina: „Færðu test-copy.txt í test-moved.txt í geymslutengingunni TEST.“
4. Athugið í geymslureikningnum að „test-copy.txt“ sé ekki lengur til en „test-moved.txt“ sé til

### Væntar niðurstöður
- Skref 1: Afritun lýkur án villu
- Skref 2: Afritaða skráin er til
- Skref 3: Flutningi lýkur án villu
- Skref 4: Upprunalega slóðin er horfin, nýja slóðin er til

---

## Sviðsmynd 7: Möppuaðgerðir

**Svið:** Kjarnavirkni

### Undirbúningur
1. Ljúkið sviðsmynd 1 (geymslutengingin „TEST“ er til)

### Skref
1. Biðjið aðstoðina: „Búðu til möppuna test-dir í geymslutengingunni TEST.“
2. Spyrjið aðstoðina hvort mappan „test-dir“ sé til
3. Biðjið aðstoðina að sýna möppurnar í rót geymslutengingarinnar TEST
4. Biðjið aðstoðina: „Eyddu möppunni test-dir í geymslutengingunni TEST.“

### Væntar niðurstöður
- Skref 1: Mappan er búin til
- Skref 2: Svarið er að mappan sé til
- Skref 3: Listinn inniheldur „test-dir“
- Skref 4: Möppunni er eytt

---

## Sviðsmynd 8: Hlaða upp stórri skrá í bútum

**Svið:** Kjarnavirkni

### Undirbúningur
1. Ljúkið sviðsmynd 1 (geymslutengingin „TEST“ er til)
2. Hafið tilbúna skrá upp á nokkur megabæti sem aðstoðin getur lesið (til dæmis hengda við spjallið)

### Skref
1. Biðjið aðstoðina: „Hladdu þessari skrá upp í geymslutenginguna TEST sem large-file.dat, í bútum.“
2. Spyrjið aðstoðina um framvinduna á meðan upphleðslan stendur yfir
3. Athugið í geymslureikningnum að skráin sé komin

### Væntar niðurstöður
- Skref 1: Aðstoðin hefur upphleðslu, sendir bútana og lýkur henni, án villu
- Skref 2: Framvindan sýnir hve margir bútar hafa borist
- Skref 3: Öll skráin er í geymslunni, jafnstór upprunalegu skránni

---

## Sviðsmynd 9: Hætta við upphleðslu

**Svið:** Villumeðhöndlun

### Undirbúningur
1. Ljúkið sviðsmynd 1 (geymslutengingin „TEST“ er til)

### Skref
1. Biðjið aðstoðina að hefja upphleðslu skrárinnar „cancelled-file.dat“ í bútum í geymslutenginguna TEST og hætta við hana áður en henni lýkur
2. Athugið í geymslureikningnum að engin skrá „cancelled-file.dat“ hafi verið skrifuð

### Væntar niðurstöður
- Skref 1: Hætt er við upphleðsluna án villu
- Skref 2: Skráin er ekki til í geymslunni

---

## Sviðsmynd 10: Villumeðhöndlun — ógildur geymslukóði

**Svið:** Villumeðhöndlun

### Undirbúningur
1. Gangið úr skugga um að engin geymslutenging með kóðann „INVALID“ sé til

### Skref
1. Biðjið aðstoðina: „Sýndu skrárnar í geymslutengingunni INVALID.“
2. Opnið **Bifrost Messages** og finnið beiðnina

### Væntar niðurstöður
- Aðstoðin skilar skýrri villu um að geymslutengingin hafi ekki fundist
- Beiðnin birtist með villustöðu og læsilegum skilaboðum
- Engin ómeðhöndluð undantekning eða kallstafli birtist notandanum

---

## Sviðsmynd 11: Villumeðhöndlun — ógild slóð

**Svið:** Villumeðhöndlun

### Undirbúningur
1. Ljúkið sviðsmynd 1 (geymslutengingin „TEST“ er til)

### Skref
1. Biðjið aðstoðina: „Lestu skrána this/path/does/not/exist.txt úr geymslutengingunni TEST.“

### Væntar niðurstöður
- Aðstoðin skilar skýrri villu um að skráin hafi ekki fundist
- Beiðnin birtist á **Bifrost Messages** með villustöðu, ekki sem óunninn villugluggi í BC

---

## Sviðsmynd 12: Heimildaprófun — lágmarksheimildir

**Svið:** Heimildaprófun

### Undirbúningur
1. Búið til prófunarnotanda í BC-sandkassanum
2. Úthlutið notandanum aðeins heimildasafninu „BIFROST Attach ori“ (auk D365 BASIC)
3. Ljúkið sviðsmynd 1 sem stjórnandi

### Skref
1. Tengið gervigreindaraðstoðina sem prófunarnotandann
2. Biðjið aðstoðina: „Sýndu skrárnar í rót geymslutengingarinnar TEST.“

### Væntar niðurstöður
- Skráalistinn skilar sér
- Engar heimildavillur koma upp við venjulegan lestur úr geymslu

---

## Sviðsmynd 13: Heimildaprófun — engin heimild

**Svið:** Heimildaprófun

### Undirbúningur
1. Búið til prófunarnotanda með aðeins D365 BASIC (ekkert „BIFROST Attach ori“ heimildasafn)

### Skref
1. Tengið gervigreindaraðstoðina sem prófunarnotandann
2. Biðjið aðstoðina að sýna skrárnar í geymslutengingunni TEST

### Væntar niðurstöður
- Beiðnin mistekst með skýrri heimildavillu
- Engin gögn eru birt eða þeim breytt

---

## Sviðsmynd 14: Eyða skrá

**Svið:** Kjarnavirkni

### Undirbúningur
1. Ljúkið sviðsmynd 4 (skráin „test-upload.txt“ er til)

### Skref
1. Biðjið aðstoðina: „Eyddu skránni test-upload.txt í geymslutengingunni TEST.“
2. Spyrjið aðstoðina hvort „test-upload.txt“ sé enn til

### Væntar niðurstöður
- Skref 1: Eyðingu lýkur án villu
- Skref 2: Svarið er að skráin sé ekki til

---

## Sviðsmynd 15: Fjarlæging viðbótar

**Svið:** Fjarlæging

### Undirbúningur
1. Ljúkið sviðsmynd 1 (að minnsta kosti ein geymslutenging uppsett)

### Skref
1. Farið í „Extension Management“ í leitarstiku BC
2. Finnið „Bifrost Attachments“ í listanum
3. Veljið „Fjarlægja“
4. Staðfestið fjarlæginguna
5. Staðfestið að viðbótin sé horfin af listanum
6. Leitið að „Bifrost Storage Setup“ í leitarstiku BC

### Væntar niðurstöður
- Skref 4: Fjarlægingu lýkur án villu
- Skref 5: Viðbótin birtist ekki lengur í lista yfir uppsettar viðbætur
- Skref 6: Leitin skilar engum niðurstöðum (uppsetningarsíðan er horfin)
- Stöðluð virkni BC heldur áfram að virka eðlilega

---

## Sviðsmynd 16: Finna geymsluaðgerðirnar

**Svið:** Kjarnavirkni

### Undirbúningur
1. Ljúkið sviðsmynd 1 (viðbótin er uppsett)

### Skref
1. Spyrjið aðstoðina: „Hvað getur þú gert við skrár í geymslu Business Central?“
2. Opnið síðuna **Bifrost Message Types** í Business Central

### Væntar niðurstöður
- Aðstoðin lýsir geymsluaðgerðunum (skrár, möppur, upphleðslur, viðhengi), lesnum úr Business Central sjálfu
- Síðan **Bifrost Message Types** sýnir geymsluaðgerðir Bifrost Attachments með lýsingu á hverri

---

## Frágangur

Þegar öllum sviðsmyndum er lokið:
1. Eyðið prófunarskrám úr geymslunni: `test-upload.txt`, `test-moved.txt`, `large-file.dat`
2. Eyðið prófunarmöppunni: `test-dir`
3. Fjarlægið geymslutenginguna „TEST“ úr Bifrost Storage Setup
4. Fjarlægið viðbótina (ef það var ekki gert í sviðsmynd 15)
