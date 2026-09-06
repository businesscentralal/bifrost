---
id: bifrost-delete-log
title: "Bifröst eyðingaskrá"
sidebar_label: "Bifröst eyðingaskrá"
sidebar_position: 4
---

**Bifröst eyðingaskrá** er lesskráð eftirlitsskrá sem skráir allar eyðingar úr töflum sem raktar eru í [uppsetningu eyðingarskráningar](/help/foundation/bifrost-delete-setup/). Hver færsla greinir frá töflu, SystemId eyddu færslunnar, tíma eyðingar og notandanum sem framkvæmdi hana.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Færslunúmer** | Raðnúmer sem er úthlutað sjálfkrafa þegar eyðing er skráð. |
| **Tafla nr.** | Auðkenni töflunnar sem færslan var eytt úr. |
| **Töfluheiti** | Heiti töflunnar sem færslan var eytt úr. |
| **Kerfisauðkenni færslu** | SystemId (GUID) eyddu færslunnar. Ytri kerfi geta notað þetta til að bera kennsl á hvaða færslu var fjarlægð. |
| **Eytt þann** | Dagsetning og tími þegar færslunni var eytt. |
| **Notandakenni** | Auðkenni notandans sem eyddi færslunni. |

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Flytja út JSON** | Sækir JSON-mynd sem vistuð var fyrir valda færslu. Aðeins virkt þegar færslan inniheldur geymd gögn (stillt í **Vista færslu** í [uppsetningu eyðingarskráningar](/help/foundation/bifrost-delete-setup/)). |

## Ábendingar

-   Þessi síða er lesskráð. Færslur eru settar inn sjálfkrafa af eyðingaraðgerðum og er ekki hægt að breyta eða eyða af notendaviðmóti.
-   Hægt er að nota **Kerfisauðkenni færslu** með `Data.DeletedRecordIds.Get` skilaboðategundinni til að staðfesta eyðingar frá ytri kerfum.
-   JSON-gögn eru aðeins tiltæk þegar **Vista færslu** er virkt á viðeigandi töflu í [uppsetningu eyðingarskráningar](/help/foundation/bifrost-delete-setup/).
