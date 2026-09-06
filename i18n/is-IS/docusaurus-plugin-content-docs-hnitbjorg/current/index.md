---
id: index
title: "Bifröst Hnitbjörg"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Azure Blob Storage, Azure File Share og SharePoint birt sem skilaboðategundir Bifrastar fyrir skráaaðgerðir í Business Central."
---

Bifröst Hnitbjörg tengir Business Central við skýgeymslu. Hún byggir á Bifröst Foundation og birtir staðlaða ytri skráageymslutengla Business Central — Azure Blob Storage, Azure File Share og SharePoint — sem skilaboðategundir, svo ytra kerfi, MCP-biðlari eða ferli í Business Central geti lesið og skrifað skrár gegnum sama biðraðar-, verk- og gagnamynstur og aðrar einingar Bifrastar nota.

## Hvað hún gerir

- **Skráaaðgerðir** — lista, sækja, hlaða upp, afrita, flytja, eyða og athuga hvort skrá sé til í hvaða uppsettu geymslutengingu sem er.
- **Möppuaðgerðir** — lista, búa til, eyða og athuga hvort mappa sé til.
- **Bútaupphleðsla** — stór skrá er afhent sem runa af litlum base64-bútum með lotustýringu (opna, bæta við, staðfesta, hætta við, staða), sem kemst hjá stærðarmörkum einstakrar beiðni.
- **Útvistun viðhengja** — færðu innihald skjalaviðhengis eða viðhengis á innkomandi skjali úr gagnagrunninum í geymslu og endurheimtu það eftir þörfum. Útvistað innihald opnast áfram eðlilega í Business Central.
- **Stofnun viðhengja** — tengdu skrá sem þegar er í geymslu við innkomandi skjal, eða búðu til skjalaviðhengi á hvaða færslu sem er úr base64, úr geymslu eða með afritun á fyrirliggjandi viðhengi.
- **Geymslutengingar** — hver tenging bindur stuttan kóða við skráðan skráareikning í Business Central, með valfrjálsri grunnslóð sem sett er framan við allar slóðir sem fara um tenginguna.
- **Engin leyniorð í þessari viðbót** — auðkenni tilheyra tengilsforritum Business Central; Hnitbjörg vísar aðeins í skráðan skráareikning með auðkenni hans.
- **Sjálflýsandi viðmót** — `Help.Storage.Get` skilar Markdown-yfirliti yfir eininguna og hver skilaboðategund svarar eigin hjálparskjali.

## Hvernig hún virkar

1. Settu upp tengilsforrit fyrir skráageymslu í Business Central — Azure Blob Storage, Azure File Share eða SharePoint — og skráðu skráareikning í því.
2. Virkjaðu HTTP-biðlarabeiðnir fyrir viðbótina; leiðsagnaruppsetningin *Setja upp Bifröst-geymslu* fer yfir það skref.
3. Búðu til geymslutengingu á **Uppsetningu Bifröst-geymslu** sem bindur kóða við skráareikninginn, og staðfestu hana með **Prófa tengingu**.
4. Ytri kerfi senda Bifröst-skilaboð með þessum `storageCode` til að beina aðgerðinni á tenginguna.
5. Allar aðgerðir fara um staðlaða ytri skráageymslu Business Central.

## Skilaboðategundir

| Svið | Skilaboðategundir |
| --- | --- |
| Uppfletting | `Help.Storage.Get`, `Storage.Account.List` |
| Skrár | `Storage.File.List`, `Storage.File.Get`, `Storage.File.Create`, `Storage.File.Delete`, `Storage.File.Copy`, `Storage.File.Move`, `Storage.File.Exists` |
| Möppur | `Storage.Directory.List`, `Storage.Directory.Create`, `Storage.Directory.Delete`, `Storage.Directory.Exists` |
| Viðhengi | `Storage.Attachment.Offload`, `Storage.Attachment.Restore`, `Storage.Attachment.CreateLinked`, `Storage.Attachment.CreateForRecord` |
| Upphleðsla | `Storage.Upload.Begin`, `Storage.Upload.Append`, `Storage.Upload.Commit`, `Storage.Upload.Abort`, `Storage.Upload.Status`, `Storage.Upload.CommitToRecord` |

## Kröfur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrri, Essentials eða Premium.
- Bifröst Foundation, fáanleg sér á AppSource.
- Að minnsta kosti eitt tengilsforrit fyrir skráageymslu uppsett og stillt í Business Central, til dæmis Azure Blob Storage Connector frá Microsoft, með skráðum skráareikningi.

## Hvert skal halda næst

- [Hjálp í kerfinu](/help/hnitbjorg/)
- [Notendasviðsmyndir fyrir AppSource](./user-scenarios)
- [Skráning í Partner Center](./listing)
- [Byggja á Bifröst](/extensibility/)
