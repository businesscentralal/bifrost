---
id: index
title: "Bifröst Warehouse — Hjálp"
sidebar_label: "Bifröst Warehouse — Hjálp"
sidebar_position: 1
slug: /
---

**Bifröst Warehouse** er vöruhúsaeining Bifrastar, viðbót við Business Central frá Origo. Hún birtir Warehouse-skilaboðategundirnar ofan á Bifröst Foundation, svo að utanaðkomandi kerfi geti stofnað og bókað vöruhúsaafhendingar og vöruhúsamóttökur, stofnað og skráð tínslu og frágang, og forskoðað bókanir gegnum API Bifrastar.

## Þessi viðbót hefur engar eigin síður

Það er ekkert að opna í Business Central biðlaranum. Viðbótin bætir hvorki við síðum, síðuviðbótum, aðgerðum né reitum á fyrirliggjandi síðum — hún er alfarið keyrð gegnum skilaboðategundir Bifrastar.

Það sem hún gerir sést hins vegar á stöðluðum vöruhúsasíðum Business Central: afhending sem `Warehouse.Shipment.Create` stofnar birtist í **Warehouse Shipments**, tínsla sem `Warehouse.Pick.Create` stofnar birtist í **Warehouse Picks**, bókuð móttaka birtist í **Posted Whse. Receipts**, og svo framvegis. Notaðu síður Microsoft sjálfs til að fara yfir niðurstöðurnar.

Tvennt er stillt utan þessarar viðbótar:

- **Bifrost Setup**, í Bifröst Foundation, geymir þær stillingar sem skilaboðabiðröðin keyrir á. Sjá [Bifrost Setup](/help/foundation/bifrost-setup/).
- **Birgðageymslur**, **starfsmenn vöruhúss**, hólf og númeraraðir tilheyra Business Central og eru stillt þar.

## Skilaboðategundir

| Tegund | Lýsing |
| --- | --- |
| Warehouse.Shipment.Create | Stofnar vöruhúsaafhendingar úr losuðum sölupöntunum og millifærslupöntunum á útleið. |
| Warehouse.Shipment.Post | Bókar vöruhúsaafhendingu (afhending, valfrjálst með reikningi). |
| Warehouse.Shipment.PreviewPost | Hermir eftir bókun vöruhúsaafhendingar (afhending + reikningur) og skilar færslunum án þess að neitt sé vistað. |
| Warehouse.Receipt.Create | Stofnar vöruhúsamóttökur úr losuðum innkaupapöntunum, vöruskilapöntunum og millifærslupöntunum á innleið. |
| Warehouse.Receipt.Post | Bókar vöruhúsamóttöku (móttaka). |
| Warehouse.Receipt.Post.Preview | Hermir eftir bókun vöruhúsamóttöku og skilar færslunum án þess að neitt sé vistað. |
| Warehouse.Pick.Create | Stofnar vöruhúsatínslu úr vöruhúsaafhendingu. |
| Warehouse.Pick.Register | Skráir vöruhúsatínslu. |
| Warehouse.Putaway.Create | Stofnar, eða skilar fyrirliggjandi, frágangi fyrir bókaða vöruhúsamóttöku. |
| Warehouse.Putaway.Register | Skráir vöruhúsafrágang. |

Kallaðu á `Help.MessageTypes.Get` til að fá skrána yfir skráðar tegundir, eða biddu hverja skilaboðategund um eigið hjálparskjal með `Help.Implementation.Get` til að sjá nákvæmar færibreytur beiðnar, reiti svars og villutilvik.

## Fyrstu skref

1. Settu upp og virkjaðu **Bifröst Foundation**.
2. Settu upp **Bifröst Warehouse**.
3. Gefðu notandanum eða þjónustunni sem kallar þau heimildasöfn Foundation sem þarf. Bókun og skráning krefjast líka `BIFROST WhsePost ori`, og bókun afhendingar með reikningi krefst líka `BIFROST GL Post ori`.
4. Gakktu úr skugga um að birgðageymslurnar sem þú notar krefjist þeirra vöruhúsaskjala sem þú ætlar að stofna (`Require Shipment`, `Require Receive`, `Require Pick`, `Require Put-away`).
5. Sendu Bifröst-skilaboð sem heita `Warehouse.*` gegnum biðröð Bifrastar.

## Nánar

- [Vörulýsing](/warehouse/) — hvað viðbótin gerir, hvernig hún virkar og hvað hún krefst
- [Tilvísun skilaboðategunda](/warehouse/reference/message-types/) — beiðni- og svarsamningur hverrar tegundar
- [Bifrost Setup](/help/foundation/bifrost-setup/) — síða Bifröst Foundation sem geymir stillingar vettvangsins
