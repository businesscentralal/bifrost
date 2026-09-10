---
id: index
title: "Bifröst Attachments — Help"
sidebar_label: "Bifröst Attachments — Help"
sidebar_position: 1
slug: /
---

**Bifröst Attachments** er geymslueining Bifrastar, viðbót við Business Central frá Origo. Hún birtir staðlaða ytri skráageymslutengla Business Central (Azure Blob Storage, Azure File Share og SharePoint) sem Bifröst-skilaboðategundir. Ytri kerfi fá þannig beinan les- og skrifaðgang að skýgeymslu í gegnum Bifröst-vefþjónustuna.

Einingin bætir skráa-, möppu-, viðhengja- og bútaupphleðsluaðgerðum við skilaboðaskrá Bifrastar. Hver aðgerð er vistuð með `storageCode` sem vísar á uppsetta geymslutengingu. Auðkenni eru áfram í tengilsforritum Business Central – þessi viðbót geymir aðeins tilvísun í skráðan skráareikning.

## Síður

| Síða | Lýsing |
| --- | --- |
| [Uppsetning Bifröst Hnitbjargar](/help/attachments/attachments-setup/) | Uppsetningarsíða forritsins, opnuð úr flokknum Forrit á uppsetningarsíðu Bifrastar. Geymslutengingar, skráareikningar og umsýsla á einum stað. |
| [Uppsetning Bifröst-geymslu](/help/attachments/storage-setup/) | Listi yfir uppsettar geymslutengingar. Hver lína tengir geymslukóða við skráareikning í BC. |
| [Bifröst-geymslutenging](/help/attachments/storage-card/) | Spjald til að breyta einni geymslutengingu – tengill, skráareikningur, grunnslóð og prófun. |
| [Velja skráareikning](/help/attachments/storage-account-lookup/) | Uppfletting á skráareikningum sem skráðir eru fyrir valinn tengil. |

## Skilaboðategundir

| Tegund | Lýsing |
| --- | --- |
| Help.Storage.Get | Skilar Markdown-yfirliti yfir geymslueininguna og allar skilaboðategundir hennar. |
| Storage.Account.List | Listar uppsettar geymslutengingar (kóðar og tengiltegundir; engin leyniorð). |
| Storage.File.List | Listar skrár í möppu. |
| Storage.File.Get | Sækir skrá sem base64. |
| Storage.File.Create | Hleður upp einni lítilli base64-skrá í geymslu. |
| Storage.File.Delete | Eyðir skrá. |
| Storage.File.Copy | Afritar skrá á nýja slóð. |
| Storage.File.Move | Flytur skrá á nýja slóð. |
| Storage.File.Exists | Athugar hvort skrá sé til. |
| Storage.Directory.List | Listar möppur á slóð. |
| Storage.Directory.Create | Býr til möppu. |
| Storage.Directory.Delete | Eyðir möppu. |
| Storage.Directory.Exists | Athugar hvort mappa sé til. |
| Storage.Attachment.Offload | Útvistar viðhengisskrá í geymslu og hreinsar hana úr gagnagrunninum. |
| Storage.Attachment.Restore | Endurheimtir útvistað viðhengi úr geymslu aftur í gagnagrunninn. |
| Storage.Attachment.CreateLinked | Tengir skrá sem þegar er í geymslu við nýtt eða núverandi innkomandi skjal. |
| Storage.Attachment.CreateForRecord | Býr til skjalaviðhengi á hvaða færslu sem er – úr base64, úr geymslu eða með afritun á fyrirliggjandi viðhengi. |
| Storage.Upload.Begin | Opnar bútaupphleðslulotu fyrir stórar skrár. |
| Storage.Upload.Append | Bætir einum base64-búti við opna upphleðslulotu. |
| Storage.Upload.Commit | Setur saman bútana og skrifar skrána í geymsluna. |
| Storage.Upload.Abort | Hættir við upphleðslulotu án þess að skrifa í geymsluna. |
| Storage.Upload.Status | Skilar stöðu og framvindu upphleðslulotu. |
| Storage.Upload.CommitToRecord | Setur saman bútana og hengir skrána beint á færslu, án ytri geymslu. |

Sendið `Help.Storage.Get` til að fá heildarskrána á Markdown-formi, eða biðjið einstaka skilaboðategund um hjálparskjal hennar til að sjá nákvæmlega hvaða viðföng, svarreiti og villur hún styður.

## Hafist handa

1.  Setjið upp tengilsforrit fyrir skráageymslu í BC (Azure Blob Storage, Azure File Share eða SharePoint).
2.  Stillið skráareikning í uppsetningu tengilsins.
3.  Opnið **Uppsetningu Bifrastar**, veljið **Uppsetning Bifröst Hnitbjargar** í flokknum **Forrit** og hreinsið HTTP-tilkynninguna ef hún birtist.
4.  Búið til tengingu á [Uppsetningu Bifröst Hnitbjargar](/help/attachments/attachments-setup/) sem bindur kóða við reikninginn.
5.  Notið aðgerðina **Prófa tengingu** á [geymslutengingarspjaldinu](/help/attachments/storage-card/) til að staðfesta.
6.  Sendið Bifröst-skilaboð með `"storageCode": "KÓÐINN-YKKAR"` í beiðninni.
