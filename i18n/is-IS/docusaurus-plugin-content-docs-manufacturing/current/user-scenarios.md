---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Útgefandi:** Origo
**App:** Bifrost Manufacturing (`bd08a710-8845-4316-a53b-afd28f21f75a`)
**Prófunarumhverfi:** Sandkassi í Business Central Premium með **Bifrost Foundation** uppsettu, sýnifyrirtækinu og gervigreindaraðstoð sem er tengd við Bifröst. Sjá „Prófunarauðkenni“ og „Forsendur“ hér fyrir neðan.

---

## Prófunarauðkenni

| Reitur | Gildi |
| --- | --- |
| Umhverfi | Premium-sandkassi |
| Fyrirtæki | Sýnifyrirtækið, eða hvaða fyrirtæki sem er með uppsetta framleiðslu |
| Notandi | Notandi með SUPER, eða með `BIFROST Mfg ori` og `BIFROST MfgPost ori` auk heimildasafns Bifröst Foundation |

Þessi viðbót geymir engin eigin leyndarmál og kallar ekki á neina ytri þjónustu. Allt sem hún gerir keyrir inni í Business Central.

---

## Forsendur

1. Setjið **Bifrost Foundation** upp og virkjið það — sjá uppsetningarleiðbeiningar Foundation-appsins.
2. Notið fyrirtæki með uppsetta framleiðslu: vöru með áfyllingaraðferðina Framleiðslupöntun, vottaðan framleiðsluefnislista og vinnsluleið, og númeraröð framleiðslupantana. Sýnifyrirtækið hefur þetta.
3. Setjið **Bifrost Manufacturing** upp.
4. Úthlutið prófunarnotandanum heimildasöfnunum **Bifröst - framleiðsla** (`BIFROST Mfg ori`) og **Bifröst - framleiðslubókun** (`BIFROST MfgPost ori`), auk heimilda hans í Bifröst Foundation.
5. Tengið gervigreindaraðstoð (til dæmis Copilot, ChatGPT eða Claude) við sandkassann í gegnum Bifröst MCP-þjóninn, eins og lýst er í [Tengdu gervigreindaraðstoðina þína](/setup/connect-your-ai/). Hver beiðni aðstoðarinnar er skráð á síðunni **Bifrost Messages** í Business Central.

---

## Sviðsmynd 1: Uppsetning og virkjun

**Svið:** Uppsetning og virkjun

### Skref
1. Opnið **Extension Management**.
2. Staðfestið að **Bifrost Manufacturing** sé á listanum og uppsett.
3. Staðfestið að **Bifrost Foundation** sé uppsett.
4. Opnið **Users**, veljið prófunarnotandann og staðfestið að hægt sé að úthluta heimildasöfnunum **Bifröst - framleiðsla** og **Bifröst - framleiðslubókun**.

### Væntar niðurstöður
- Viðbótin setur sig upp án villna.
- Heimildasöfn hennar er hægt að úthluta notanda.

---

## Sviðsmynd 2: Finna aðgerðirnar

**Svið:** Kjarnavirkni

### Skref
1. Opnið síðuna **Bifrost Message Types** í Business Central.
2. Spyrjið aðstoðina: „Hvað getur þú gert í framleiðslu?“

### Væntar niðurstöður
- Síðan sýnir framleiðsluaðgerðir þessa forrits, hverja með lýsingu, sem innkomandi og virkar.
- Aðstoðin lýsir sömu aðgerðum — framleiðslupantanir, stöður, framleiðsluefnislistar og vinnsluleiðir, hvar notað, framboð, framleiðslubók og leiðréttingar — lesnum úr Business Central sjálfu.

---

## Sviðsmynd 3: Stofna og endurnýja framleiðslupöntun

**Svið:** Kjarnavirkni

### Skref
1. Biðjið aðstoðina: „Stofnaðu áætlaða framleiðslupöntun fyrir 10 stykki af framleiðsluvöru í sýnifyrirtækinu og endurnýjaðu hana svo.“
2. Opnið **Planned Production Orders** í biðlaranum og opnið nýju pöntunina.

### Væntar niðurstöður
- Aðstoðin tilkynnir númer nýju pöntunarinnar og að endurnýjunin tókst.
- Pöntunin er á síðunni með línu fyrir vöruna og með íhluti og vinnsluleiðarlínur reiknaðar út frá vottuðum efnislista og vinnsluleið.

---

## Sviðsmynd 4: Votta útgáfu framleiðsluefnislista

**Svið:** Kjarnavirkni

### Skref
1. Búið til nýja útgáfu framleiðsluefnislista með línu í biðlaranum og látið hana vera í vinnslu.
2. Biðjið aðstoðina: „Vottaðu þessa útgáfu framleiðsluefnislistans.“
3. Opnið útgáfuna í biðlaranum.

### Væntar niðurstöður
- Aðstoðin tilkynnir að útgáfan sé vottuð.
- Útgáfan sýnir stöðuna Vottað.
- Útgáfu sem ekki er hægt að votta, til dæmis með auðum íhlut, er hafnað með skýrri ástæðu á tungumáli lotunnar og staða hennar breytist ekki.

---

## Sviðsmynd 5: Athuga framboð og tölfræði

**Svið:** Kjarnavirkni

### Skref
1. Spyrjið aðstoðina: „Eigum við alla íhlutina fyrir framleiðslupöntunina sem þú stofnaðir?“
2. Spyrjið: „Sýndu mér kostnaðar- og magntölfræði þeirrar pöntunar.“

### Væntar niðurstöður
- Aðstoðin telur upp hvern íhlut með magni sem þarf, magni sem er til og skorti.
- Tölfræðin stemmir við tölurnar á tölfræðisíðu pöntunarinnar í biðlaranum.
- Engu er breytt.

---

## Sviðsmynd 6: Forskoða og bóka framleiðslubókina

**Svið:** Kjarnavirkni

### Skref
1. Gefið út pöntunina úr sviðsmynd 3 (biðjið aðstoðina að breyta stöðu hennar í Útgefin og staðfestið fjöldann sem hún tilkynnir).
2. Biðjið aðstoðina: „Forskoðaðu bókun afkasta og notkunar fyrir þá pöntun.“
3. Skoðið síðuna **Item Ledger Entries**. Biðjið síðan aðstoðina að bóka sömu bók og staðfestið fjöldann sem hún tilkynnir.
4. Skoðið síðuna **Item Ledger Entries** aftur.

### Væntar niðurstöður
- Forskoðunin sýnir færslurnar sem bókun myndi búa til og vörufærslur eru óbreyttar eftir hana.
- Án staðfests fjölda er bókuninni hafnað og ekkert er bókað.
- Eftir staðfesta bókun eru afkasta- og notkunarfærslurnar á síðunni.

---

## Sviðsmynd 7: Ljúka pöntun og opna aftur

**Svið:** Kjarnavirkni

### Skref
1. Spyrjið aðstoðina: „Er hægt að ljúka þessari framleiðslupöntun?“
2. Biðjið aðstoðina að ljúka henni og staðfestið fjöldann sem hún tilkynnir.
3. Biðjið aðstoðina að opna hana aftur.

### Væntar niðurstöður
- Athugunin tilkynnir allt sem hún finnur, til dæmis vantandi afköst, og breytir engu.
- Lokna pöntunin er á síðunni **Finished Production Orders**.
- Opnun aftur færir hana til baka, einu sinni. Seinni opnun er hafnað.

---

## Sviðsmynd 8: Bakfæra bókun

**Svið:** Kjarnavirkni

### Skref
1. Biðjið aðstoðina: „Bakfærðu afkastafærsluna sem við bókuðum.“ Staðfestið fjöldann sem hún tilkynnir.
2. Skoðið síðuna **Item Ledger Entries**.

### Væntar niðurstöður
- Leiðréttingarfærsla fyrir alla afkastafærsluna birtist og upprunalega færslan er merkt sem bakfærð.
- Án staðfests fjölda er ekkert bakfært.

---

## Sviðsmynd 9: Heimildir

**Svið:** Öryggi

### Skref
1. Skráið inn notanda sem hefur `BIFROST Mfg ori` en ekki `BIFROST MfgPost ori`.
2. Biðjið aðstoðina að breyta stöðu framleiðslupöntunar.

### Væntar niðurstöður
- Aðgerðin er ekki í boði, eða henni er hafnað með skilaboðum sem nefna heimildina sem vantar.
- Engri pöntun er breytt.

---

## Sviðsmynd 10: Íslenska

**Svið:** Staðfærsla

### Skref
1. Stillið tungumál lotunnar á íslensku.
2. Biðjið aðstoðina að votta útgáfu framleiðsluefnislista sem er með auðan íhlut.

### Væntar niðurstöður
- Höfnunin kemur á íslensku og staða útgáfunnar breytist ekki.
