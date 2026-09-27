---
id: listing
title: "Skráning í Partner Center"
sidebar_label: "Skráning"
sidebar_position: 9
description: "Texti markaðsskráningar þessarar viðbótar: heiti tilboðs, samantekt, flokkar og full lýsing."
---

> Afritaðu þessa texta í Partner Center þegar skráning tilboðsins er stofnuð eða uppfærð. Textarnir í Partner Center eru á ensku; sjá ensku útgáfu þessarar síðu fyrir orðréttan texta.

---

## Heiti tilboðs
Bifröst Warehouse

## Samantekt í leitarniðurstöðum (hámark 50 stafir)
Vöruhúsaskjöl með Bifröst-skilaboðum

## Samantekt tilboðs (hámark 100 stafir)
Stofnaðu, bókaðu og forskoðaðu vöruhúsaafhendingar, móttökur, tínslu og frágang með Bifröst-skilaboðum.

## Leitarorð
1. Vöruhús
2. Vöruhúsaafhending
3. Tínsla og frágangur
4. Bifröst
5. Samþætting við Business Central

## Flokkar
- **Aðalflokkur:** Operations > Supply Chain
- **Aukaflokkur:** IT & Admin Tools > Data Integration

## Atvinnugreinar
- Dreifing
- Framleiðsla
- Smásala

---

## Lýsing

Full lýsing er [hér að neðan](#full-lýsing).

---

## Tengill á þjónustu
https://www.origo.is/

## Vörur sem forritið vinnur með
- Dynamics 365 Business Central
- Bifrost Foundation (nauðsynlegt forsenduforrit)

---

## Full lýsing

**Bifröst Warehouse** bætir vöruhúsaskilaboðategundum við Bifröst — skilaboðamiðað samþættingarlag sem veitir utanaðkomandi kerfum, gervigreindarfulltrúum og sjálfvirkniverkfærum skipulegan aðgang að Business Central. Í stað þess að vinna á vöruhúsasíðunum í höndunum stofna, skrá og bóka kallendur vöruhúsaskjöl með sérstökum skilaboðategundum og fá skipulegt JSON til baka.

### Fyrir hverja er hún?

**Forritara í samþættingu og gervigreindarfulltrúa** sem keyra vöruhúsaferlið utan Business Central: vefverslun sem losar pantanir og afhendir þær, skannaforrit sem skráir tínslu og frágang, eða fulltrúa sem tekur á móti innkaupapöntunum.

**Markhópar:** dreifing, framleiðsla og smásala — öll fyrirtæki sem nota vöruhúsaafhendingar, vöruhúsamóttökur, tínslu eða frágang í Business Central.

### Hvað hún gerir

- **Warehouse.Shipment.Create / Post / PreviewPost** — stofna vöruhúsaafhendingar úr losuðum upprunaskjölum, bóka þær (valfrjálst með reikningi) og forskoða bókunina
- **Warehouse.Receipt.Create / Post / Post.Preview** — stofna vöruhúsamóttökur úr losuðum upprunaskjölum, bóka þær og forskoða bókunina
- **Warehouse.Pick.Create / Register** — stofna tínslu úr vöruhúsaafhendingu og skrá hana
- **Warehouse.Putaway.Create / Register** — stofna eða skila frágangi fyrir bókaða móttöku og skrá hann

### Hvernig hún virkar

1. Settu upp **Bifröst Foundation** og **Bifröst Warehouse**
2. Kallendur senda Bifröst-skilaboð með skjalinu í `subject` eða `data`
3. Bókun og skráning eru varðar með bókunarheimildasöfnum Bifrastar
4. Niðurstöður skila sér sem skipulegt JSON gegnum hefðbundið gagna-API Bifrastar

### Studdar útgáfur og lönd

- **Útgáfur:** Business Central Essentials og Premium
- **Lönd:** Ísland, Bretland, Danmörk, Noregur, Svíþjóð, Finnland, Þýskaland, Frakkland, Holland, Austurríki, Sviss, Írland, Portúgal, Spánn

### Kröfur og forsendur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra
- Bifrost Foundation viðbót frá Origo (fáanleg sérstaklega á AppSource)
