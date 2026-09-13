---
id: listing
title: "Partner Center-skráning"
sidebar_label: "Skráning"
sidebar_position: 9
description: "Texti fyrir markaðstorgsskráningu viðbótarinnar: heiti, samantekt, flokkar og ítarleg lýsing."
---

> Afritaðu þennan texta í Partner Center þegar tilboð er stofnað eða uppfært.
>
> App id `e1276ba8-3405-4589-ba68-51d725992ef6` · Útgefandi **Origo** · Útgáfa **28.0.0.0**

---

## Heiti tilboðs
Bifrost Iceland

## Samantekt í leitarniðurstöðu (hámark 100 stafir)
Íslensk skattaskil, skrárleit, gengi Seðlabanka og SMS fyrir Business Central. (87)

## Stutt lýsing (hámark 100 stafir)
Skatturinn, Þjóðskrá, Seðlabanki, Skilagrein og SMS sem Bifrost-skilaboðategundir. (77)

## Leitarorð
1. Íslenskur skattur
2. RSK VSK
3. Seðlabanki

## Flokkar
- **Aðalflokkur:** Finance > Tax/Audit
- **Aukaflokkur:** IT & Admin Tools > Data Integration

## Atvinnugreinar
- Fjármálaþjónusta
- Fagleg þjónusta

---

## Lýsing

Sjá ítarlega lýsingu hér að neðan.

## Studdar útgáfur og markaðir

- **Útgáfur:** Business Central Essentials og Premium
- **Lönd/svæði:** Ísland
- **Studd tungumál:** English (United States), Icelandic (Iceland)

## Forsendur

- **Bifrost Foundation** (Origo) `7505e808-6e52-4b96-a328-82573391297a` v28.0.0.0
- **IS Core** (Microsoft) `cd6afb88-73aa-406f-a087-50a6149d5779` v28.0.0.0

---

## Stuðningstengill
https://www.origo.is/

## Hjálpartengill
https://bifrost.origo.is/en-us/iceland/

## Persónuverndarstefna
https://www.origo.is/um-origo/stefnur/personuverndarstefna

## Vörur sem appið vinnur með
- Dynamics 365 Business Central

---

## Ítarleg lýsing

**Bifrost Iceland** bætir sértækum íslenskum eiginleikum við Bifrost — skilaboðamiðað samþættingarlag sem veitir ytri kerfum, gervigreindaröflum og sjálfvirkniverkfærum skipulagðan aðgang að gögnum og ferlum Business Central í gegnum OData. Það tengir Business Central við íslenska opinbera þjónustu, Seðlabankann og samskiptaþjónustur með sömu Queue → Task → Data API-leið og notuð er um allan Bifrost-vettvanginn. Hvaða MCP-samhæfður viðskiptavinur, REST-kallandi eða BC-ferli sem er getur kallað á aðgerðirnar án sérsmiðaðrar þróunar.

Appið bætir 71 skilaboðategundum við ofan á **Bifrost Foundation**.

### Fyrir hverja er þetta?

**Íslensk fyrirtæki og upplýsingatækniteymi þeirra** sem þurfa að láta Business Central eiga samskipti við íslenska opinbera þjónustu (Skattinn, Þjóðskrá, Seðlabankann, Skilagrein) og samskiptaþjónustur (Símann, Nova). Það fjarlægir handvirka skráningu við skattaskil, gengisuppfærslur, skrárleit og launaskil.

**Markhópar:** allar atvinnugreinar á Íslandi — fjármálaþjónusta, fagleg þjónusta, smásala, framleiðsla og dreifing. Öll fyrirtæki sem skila VSK eða staðgreiðslu, eða þurfa opinber íslensk gögn á borð við póstnúmer, frídaga og gengi.

### Skattaskil (Skatturinn / RSK)

- **VSK-skýrslur** — staðfesta, senda inn, leiðrétta og sækja kvittanir fyrir VSK-skýrslur
- **Staðgreiðsla** — senda inn og staðfesta skil, sækja forsendur tímabils og opna tímabil aftur til leiðréttingar
- **Fjármagnstekjuskattur** — senda inn skýrslur, kanna stöðu og sækja tímabil, tegundir og undanþágur

Öll skil styðja bæði framleiðslu- og prófgerð viðskiptavinar. Prófhamur sendir í RSK-sandkassann án raunverulegra skattalegra afleiðinga.

### Þjóðskrá (í gegnum Umsjá)

- **Samstilling skrár** — full lestur þjóðskrár og mánaðarlegar delta-uppfærslur í staðbundið skyndiminni
- **Leitir** — fólk og fyrirtæki eftir kennitölu, nafni eða heimilisfangi; fjölskyldu- og fyrirtækjatengsl; hlutverk, aðilar og hagsmunaaðilar
- **Fyrirtækjagögn** — VSK-númer og ÍSAT-atvinnugreinaflokkun

### Gögn Seðlabanka Íslands

- **Gengi** — daglegt viðmiðunargengi, samstillt beint í Currency Exchange Rate-töflu BC
- **Vextir** — stýrivextir, inn- og útlánavextir, IKON-festingar, millibankavextir (REIBID/REIBOR) og ávöxtun eftir lánstíma
- **Hagvísar** — vísitala neysluverðs, dráttarvextir, gengisvísitölur og SDDS-hagstofugögn

### Opinberar skrár (island.is)

- **Kennitölustaðfesting** — staðfesta íslenskar kennitölur og ákvarða hvort um einstakling eða fyrirtæki sé að ræða
- **Ökutækjaskrá** — leita að ökutækjum eftir skráningarnúmeri eða VIN
- **Tollamál** — fletta upp tollflokkum, reikna innflutningsgjöld og sækja nauðsynlegar einingar og landa-/gjaldmiðlatengingar

### Launaþjónusta (Skilagrein)

- **Stofngögn** — lífeyrissjóðir, stéttarfélög, innheimtuaðilar, endurhæfingarsjóðir og viðbótarlífeyrir
- **Skil** — senda iðgjaldaskil og staðfesta aukafjárhæðir

### Samskipti (SMS)

- **Senda SMS** — í gegnum magnSMS Símans (REST eða SOAP) eða Nova
- **Afhendingarstaða** — fylgjast með afhendingu skilaboða

### Íslensk viðmiðunargögn

- **Almennir frídagar** — skrá frídaga fyrir hvaða ár sem er eða kanna hvort tiltekin dagsetning sé frídagur
- **Póstnúmer** — heildarskrá íslenskra póstnúmera frá Byggðastofnun
- **ISO-gjaldmiðlar** — birtur ISO 4217-gjaldmiðlalisti

### Öryggi

Skilríki fyrir Umsjá, Símann, Nova, Skattinn, Skilagrein og Já Gagnatorg eru geymd í leyndageymslu Bifröst, studd af Business Central IsolatedStorage, og grímuð áður en ytri beiðni er skrifuð í request-logginn. Aðgangi er stjórnað með sérstökum heimildasettum: BIFROST ISFull ori, BIFROST Umsja ori, BIFROST NatReg ori, BIFROST VAT ori, BIFROST Payroll ori, BIFROST CapTax ori, BIFROST Collect ori, BIFROST SMS ori og BIFROST SMS Fgn ori.

### Studdar útgáfur og lönd

- **Útgáfur:** Business Central Essentials og Premium
- **Lönd:** Ísland
- **Krefst:** Bifrost Foundation (Origo), IS Core (Microsoft)

### Kröfur

- Business Central 28.0 eða nýrra
- Bifrost Foundation-viðbót uppsett
- IS Core-staðfærsla (Microsoft) uppsett
- Útleið HTTP-client beiðna leyfð fyrir viðbótina
- RSK-, Umsjá-, Skilagrein- eða SMS-skilríki fyrir samsvarandi eiginleika; opinber gögn virka án skilríkja
