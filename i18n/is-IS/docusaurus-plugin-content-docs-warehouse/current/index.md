---
id: index
title: "Bifröst Warehouse"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Vöruhúsaskilaboðategundir ofan á Bifröst Foundation: stofna og bóka vöruhúsaafhendingar og vöruhúsamóttökur, stofna og skrá tínslu og frágang, og forskoða bókanir."
---

Bifröst Warehouse er vöruhúsaeining Bifrastar, viðbótarforrit ofan á Bifröst Foundation. Hún birtir **Warehouse**-skilaboðategundirnar, svo að utanaðkomandi kerfi, MCP-biðlari eða ferli í Business Central geti stýrt vöruhúsaafhendingum, vöruhúsamóttökum, tínslu og frágangi gegnum sama mynstur biðraðar, verks og gagna og restin af Bifröst notar.

Vöruhúsastjórnun er sérhæft svið sem mörg fyrirtæki nota ekki, og því eru þessar skilaboðategundir í sérstöku forriti en ekki í Foundation. Settu Bifröst Warehouse aðeins upp í fyrirtækjum sem nota vöruhúsaskjöl.

## Hvað hún gerir

- **Útleið** — `Warehouse.Shipment.Create` stofnar eina vöruhúsaafhendingu fyrir hverja losaða sölupöntun eða millifærslupöntun á útleið. `Warehouse.Pick.Create` og `Warehouse.Pick.Register` stofna og skrá tínsluna þar sem birgðageymslan krefst hennar. `Warehouse.Shipment.Post` bókar afhendinguna, valfrjálst með reikningi.
- **Innleið** — `Warehouse.Receipt.Create` stofnar eina vöruhúsamóttöku fyrir hverja losaða innkaupapöntun, vöruskilapöntun eða millifærslupöntun á innleið. `Warehouse.Receipt.Post` bókar móttökuna. `Warehouse.Putaway.Create` og `Warehouse.Putaway.Register` stofna (eða skila) og skrá fráganginn.
- **Forskoðaðu áður en þú bókar** — `Warehouse.Shipment.PreviewPost` og `Warehouse.Receipt.Post.Preview` skila færslunum sem bókun myndi búa til og rúlla öllu til baka.
- **Samningur sem lýsir sér sjálfur** — hver skilaboðategund skilar eigin hjálparskjali í Markdown (færibreytur, dæmi, snið svars og villur) gegnum `Help.Implementation.Get`.

## Hvernig hún virkar

1. Settu upp og virkjaðu **Bifröst Foundation**.
2. Settu upp **Bifröst Warehouse**. Hún er aðeins háð Foundation.
3. Utanaðkomandi kerfi senda Bifröst-skilaboð sem heita `Warehouse.*` gegnum hefðbundna mynstrið biðröð → verk → gögn.
4. Bókun, forskoðun bókunar og skráning fara gegnum bókunarhlið Foundation. `Warehouse.Shipment.Post`, `Warehouse.Shipment.PreviewPost`, `Warehouse.Receipt.Post`, `Warehouse.Receipt.Post.Preview`, `Warehouse.Pick.Register` og `Warehouse.Putaway.Register` krefjast heimildasafnsins `BIFROST WhsePost ori` á notandanum sem kallar; án þess eru þær óvirkar fyrir þann notanda (`isEnabled = false` í `Help.MessageTypes.Get`). `Warehouse.Shipment.Post` með `invoice = true` krefst líka `BIFROST GL Post ori`. Aðeins stofnunartegundirnar (`Warehouse.Shipment.Create`, `Warehouse.Receipt.Create`, `Warehouse.Pick.Create`, `Warehouse.Putaway.Create`) eru án bókunarhliðs.

## Skilaboðategundir

| Svið | Skilaboðategundir |
| --- | --- |
| Vöruhúsaafhendingar | `Warehouse.Shipment.Create`, `Warehouse.Shipment.Post`, `Warehouse.Shipment.PreviewPost` |
| Vöruhúsamóttökur | `Warehouse.Receipt.Create`, `Warehouse.Receipt.Post`, `Warehouse.Receipt.Post.Preview` |
| Tínsla | `Warehouse.Pick.Create`, `Warehouse.Pick.Register` |
| Frágangur | `Warehouse.Putaway.Create`, `Warehouse.Putaway.Register` |

| Tegund | Stefna | Tilgangur |
|------|-----------|---------|
| [`Warehouse.Shipment.Create`](./reference/message-types/warehouse-shipment-create) | Inn á við | Stofna vöruhúsaafhendingar úr losuðum sölupöntunum og millifærslupöntunum á útleið |
| [`Warehouse.Shipment.Post`](./reference/message-types/warehouse-shipment-post) | Inn á við | Bóka vöruhúsaafhendingu (afhending, valfrjálst með reikningi) |
| [`Warehouse.Shipment.PreviewPost`](./reference/message-types/warehouse-shipment-previewpost) | Inn á við | Forskoða bókun vöruhúsaafhendingar (afhending + reikningur); rúllað til baka |
| [`Warehouse.Receipt.Create`](./reference/message-types/warehouse-receipt-create) | Inn á við | Stofna vöruhúsamóttökur úr losuðum innkaupapöntunum, vöruskilapöntunum og millifærslupöntunum á innleið |
| [`Warehouse.Receipt.Post`](./reference/message-types/warehouse-receipt-post) | Inn á við | Bóka vöruhúsamóttöku |
| [`Warehouse.Receipt.Post.Preview`](./reference/message-types/warehouse-receipt-post-preview) | Inn á við | Forskoða bókun vöruhúsamóttöku; rúllað til baka |
| [`Warehouse.Pick.Create`](./reference/message-types/warehouse-pick-create) | Inn á við | Stofna vöruhúsatínslu úr vöruhúsaafhendingu |
| [`Warehouse.Pick.Register`](./reference/message-types/warehouse-pick-register) | Inn á við | Skrá vöruhúsatínslu |
| [`Warehouse.Putaway.Create`](./reference/message-types/warehouse-putaway-create) | Inn á við | Stofna, eða skila fyrirliggjandi, frágangi fyrir bókaða vöruhúsamóttöku |
| [`Warehouse.Putaway.Register`](./reference/message-types/warehouse-putaway-register) | Inn á við | Skrá vöruhúsafrágang |

## Dæmigert verkflæði

**Útleið:** `Sales.Document.Release` → `Warehouse.Shipment.Create` → `Warehouse.Pick.Create` → `Warehouse.Pick.Register` → `Warehouse.Shipment.Post`. Tínsluskrefin tvö eiga aðeins við þar sem birgðageymslan hefur `Require Pick` (eða stýrðan frágang og tínslu).

**Innleið:** `Purchase.Document.Release` → `Warehouse.Receipt.Create` → `Warehouse.Receipt.Post` → `Warehouse.Putaway.Create` → `Warehouse.Putaway.Register`. Frágangsskrefin tvö eiga aðeins við þar sem birgðageymslan hefur `Require Put-away`.

## Kröfur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra, Essentials eða Premium.
- **Bifröst Foundation**, fáanlegt sérstaklega á AppSource.
- Birgðageymslur uppsettar fyrir vöruhúsastjórnun (`Require Shipment`, `Require Receive`, `Require Pick`, `Require Put-away` eftir því sem ferlið þitt krefst).
- Númerasvið hluta (Object ID): forrit `10036935–10036984`.

## Næstu skref

- [Hjálp í forritinu](/help/warehouse/)
- [Tilvísun skilaboðategunda](./reference/message-types/) — beiðni- og svarsamningur hverrar tegundar, úr hjálparkóðaeiningum forritsins
- [Skráning í Partner Center](./listing)
- [Bókunarhlið í Foundation](/foundation/reference/setup/#bókunarhlið-bifröst-gl--item--fa--job--resource--warehouse-posting)
- [Byggðu á Bifröst](/extensibility/)
