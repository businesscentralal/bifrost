---
id: bifrost-storage
title: "Bifröst geymsla"
sidebar_label: "Bifröst geymsla"
sidebar_position: 23
---

Síðan **Bifröst geymsla** sýnir tvíundarefni sem Bifröst viðbótin hefur geymt. Hver færsla geymir tvíundarfarm sem tengist ákveðnu upprunakerfi og er auðkennd með einkvæmri GUID. Þú getur flutt inn nýtt efni og flutt út fyrirliggjandi efni beint af þessari síðu.

Opnaðu síðuna í gegnum **Bifröst uppsetning → Skilaboð → Bifröst geymsla**.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Uppruni** | Auðkennir ytra kerfið eða forritið sem sendi inn geymda efnið. Þetta er venjulega sama auðkenni og notað er í tengdum Bifröst skilaboðum (t.d. `https://erp.example.com`). |
| **Kenni** | Einkvæm GUID sem auðkennir þessa geymsluferrslu. Ytri kerfi nota þetta kenni til að vísa til geymsluefnisins þegar þau senda Bifröst skilaboð. |
| **Stærð gagna** | Sýnir stærð geymdra tvíundarfarms í bætum. Þessi reitur er skrifvarinn og uppfærist sjálfkrafa þegar efni er flutt inn. |

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Flytja inn** | Opnar skráaval svo þú getir hlaðið upp skrá af tölvunni þinni. Innihald skrárinnar er geymt í reitnum **Gögn** í völdu færslunni. Ef þú hefur ekki búið til færslu enn, skaltu búa hana til fyrst og nota síðan Flytja inn til að tengja efni. |
| **Flytja út** | Hleður niður geymda tvíundarfarm á tölvuna þína. Notaðu þessa aðgerð til að skoða eða dreifa efni sem ytri kerfi hafa hlaðið upp. |

## Algengar aðgerðir

### Hlaða upp efni

1.  Búðu til nýja færslu með því að slá inn auðkenni í **Uppruna**.
2.  Skráðu eða afritaðu myndað **Kenni** (GUID).
3.  Veldu **Flytja inn** og veldu skrána til að hlaða upp.
4.  Dálkurinn **Stærð gagna** uppfærist til að endurspegla hlaðið efni.
5.  Gefðu ytra kerfinu **Kennið** svo það geti vísað til þessa efnis í framtíðarskilaboðum.

### Niðurhal efnis

1.  Veldu færsluna sem inniheldur efnið sem þú vilt sækja.
2.  Veldu **Flytja út**.
3.  Vistaðu skrána á þann stað sem þú vilt.

## Ábendingar

-   Hver geymslufærsla er auðkennd með GUID-inu **Kenninu**. Gakktu úr skugga um að ytri kerfi geymir þetta kenni svo þau geti síðar vísað til rétts efnis.
-   Reiturinn **Stærð gagna** sýnir `0` (autt) þegar ekkert efni hefur verið flutt inn.
-   Notaðu reitinn **Uppruni** til að flokka geymslufærslurnar eftir kerfinu sem sendi þær, sem auðveldar síun og stjórnun á mörgum samþættingum.
