---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Afritaðu þessa texta inn í Partner Center þegar skráning tilboðsins er búin til eða uppfærð.

---

## Offer Name
Bifröst Attachments

## Search Result Summary (max 50 chars)
Skýgeymsla fyrir Business Central

## Offer Summary (max 100 chars)
Azure Blob, File Share og SharePoint geymsla fyrir skrár og viðhengi í Business Central.

## Search Keywords
1. Skýgeymsla
2. Azure Blob
3. Skjalastjórnun

## Categories
- **Primary:** IT & Admin Tools > Data Integration
- **Secondary:** Operations > Supply Chain

## Industries
- Professional Services
- Manufacturing

---

## Lýsing

Heildartexti lýsingarinnar er [hér fyrir neðan](#full-description-text).

---

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central

---

## Heildartexti lýsingar {#full-description-text}

**Bifröst Attachments** tengir Business Central við skýgeymslu í gegnum Bifröst, skilaboðabyggt samþættingarlag sem veitir ytri kerfum, gervigreindarþjónum og sjálfvirkniverkfærum skipulegan aðgang að gögnum og ferlum Business Central um OData. Það gerir stöðluðu tengla Business Central fyrir ytri skráageymslu — Azure Blob Storage, Azure File Share og SharePoint — aðgengilega hvaða MCP-biðlara, REST-kalli eða ferli í Business Central sem er, í gegnum sama Queue → Task → Data API og allt Bifröst-umhverfið notar.

### Fyrir hverja?

**Upplýsingatækniteymi og samþættingarforritara** sem þurfa að tengja Business Central við skýgeymslu fyrir skjalastjórnun, geymslu og skráaskipti. Hentar fyrirtækjum sem vilja minnka gagnagrunninn með því að færa viðhengi út í skýgeymslu, eða þurfa að láta ytri kerfi lesa og skrifa skrár í gegnum eitt API án sérsmíðaðrar samþættingar.

**Markhópar:** Sérfræðiþjónusta, framleiðsla, dreifing, smásala — hvert það fyrirtæki sem meðhöndlar skjöl, viðhengi eða skráabundin gagnaskipti samhliða Business Central.

### Hvað það gerir

- **Skráaaðgerðir** — Skrá, sækja, hlaða upp, afrita, færa, eyða og kanna hvort skrár séu til í hvaða geymslutengingu sem er
- **Möppuaðgerðir** — Skrá, búa til, eyða og kanna hvort möppur séu til
- **Upphleðsla í bútum** — Hlaða stórum skrám upp í hlutum: hefja upphleðslu, senda bútana og ljúka henni eða hætta við, og skoða stöðuna hvenær sem er. Hentar skrám sem eru of stórar fyrir eitt API-kall
- **Útfærsla viðhengja** — Færa fylgiskjöl Business Central í skýgeymslu til að minnka gagnagrunninn, og sækja þau aftur eftir þörfum
- **Tengd viðhengi** — Hengja skrár sem þegar eru í geymslu við innsend skjöl, eða búa til fylgiskjal á hvaða færslu sem er, án þess að hlaða þeim upp aftur

### Hvernig það virkar

1. Geymslutengingar eru settar upp í **Bifrost Storage Setup**, þar sem stuttur kóði er bundinn skráareikningi í Business Central
2. Ytri kerfi og gervigreindarþjónar vísa á geymslutenginguna með kóða hennar
3. Allar aðgerðir fara í gegnum staðlaða skráageymslulag Business Central — tengiöppin sjá um auðkenni, aldrei þessi viðbót

### Studdir tenglar

Hver sá tengill sem er skráður í ytri skráageymslukerfi Business Central:
- Azure Blob Storage
- Azure File Share
- SharePoint

### Studdar útgáfur og lönd

- **Útgáfur:** Business Central Essentials og Premium
- **Lönd:** Ísland, Bretland, Danmörk, Noregur, Svíþjóð, Finnland, Þýskaland, Frakkland, Holland, Austurríki, Sviss, Írland, Portúgal, Spánn

### Kröfur og forsendur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra
- Bifrost Foundation-viðbótin frá Origo (fáanleg sérstaklega á AppSource)
- Að minnsta kosti eitt tengiapp fyrir skráageymslu uppsett og stillt (t.d. Azure Blob Storage Connector frá Microsoft)
