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
Bifröst Inventory

## Search Result Summary (max 50 chars)
Vörueigindir í gegnum Bifröst-skilaboð

## Offer Summary (max 100 chars)
Lestu, settu og breyttu vörueigindum í Business Central í gegnum Bifröst Foundation.

## Search Keywords
1. Vörueigindir
2. Birgðir
3. Eigindir vara
4. Bifröst
5. Samþætting Business Central

## Categories
- **Primary:** Operations > Supply Chain
- **Secondary:** IT & Admin Tools > Data Integration

## Industries
- Manufacturing
- Distribution
- Retail
- Professional Services

---

## Lýsing

Heildartexti lýsingarinnar er [hér fyrir neðan](#full-description-text).

---

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central
- Bifrost Foundation (nauðsynleg forsenda)

---

## Heildartexti lýsingar {#full-description-text}

**Bifröst Inventory** bætir aðgerðum fyrir vörueigindir við Bifröst, skilaboðabyggt samþættingarlag sem veitir ytri kerfum, gervigreindarþjónum og sjálfvirkniverkfærum skipulegan aðgang að Business Central um OData. Í stað þess að tengja saman Item, Item Attribute og Item Attribute Value Mapping í gegnum almenn færslu-API nota kallendur sérstakar aðgerðir til að lesa eigindir, setja og breyta gildum og skilgreina eigindir.

### Fyrir hverja?

**Samþættingarforritara og gervigreindarþjóna** sem þurfa að lesa eða viðhalda eigindum vara án þess að tengja saman margar töflur. Hentar fyrir samstillingu vörulista, auðgun vöruupplýsinga og verkefni í grunngögnum sem gervigreindarþjónar vinna.

**Markhópar:** framleiðsla, dreifing, smásala — hvert það fyrirtæki sem flokkar vörur með vörueigindum Business Central.

### Hvað það gerir

- **Lesa eigindir** — skilgreiningar eiginda og úthlutuð gildi fyrir eina eða fleiri vörur, valkvætt ásamt eigindum sem hafa ekkert gildi enn
- **Úthluta gildum** — gefa vöru eigindargildi; ef sama gildi er sett aftur breytist ekkert, og öðru gildi er aðeins skipt út þegar beðið er um það
- **Breyta gildum** — breyta gildi sem er til, með gildinu fyrir og eftir í svarinu
- **Skilgreina eigindir** — búa til skilgreiningu eigindar, með valgildum hennar, áður en nokkur vara notar hana

### Hvernig það virkar

1. Settu upp **Bifröst Foundation** og **Bifröst Inventory**
2. Kallendur nefna vöruna með kerfisauðkenni hennar eða vörunúmeri
3. Niðurstöður skila sér sem skipulagt JSON í gegnum staðlað gagna-API Bifrastar

### Studdar útgáfur og lönd

- **Útgáfur:** Business Central Essentials og Premium
- **Lönd:** Ísland, Bretland, Danmörk, Noregur, Svíþjóð, Finnland, Þýskaland, Frakkland, Holland, Austurríki, Sviss, Írland, Portúgal, Spánn

### Kröfur og forsendur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra
- Bifrost Foundation-viðbótin frá Origo (fáanleg sérstaklega á AppSource)
