---
id: projects
title: "Uppsetning verkefna"
sidebar_position: 1
---

**Uppsetning verkefna** kveikir og slekkur á verkefnaaðgerðum Bifröst verkefna fyrir þetta fyrirtæki.
Síðan er fyrir kerfisstjórann sem ákveður hvort aðstoð og samþættingar megi vinna með verkefni hér.

Opnaðu síðuna úr lista uppsettra forrita á [Uppsetning Bifröst](/help/foundation/bifrost-setup/), eða
leitaðu að **Uppsetning verkefna** í Business Central. Business Central er með staðlaða síðu fyrir eigin
verkefnastillingar sem getur borið sama heiti; þessi síða hefur einn reit, **Virkt**. Ein
uppsetningarfærsla er til fyrir hvert fyrirtæki; hún er stofnuð þegar forritið er sett upp, eða í
fyrsta sinn sem síðan er opnuð.

## Reitir {#fields}

| Reitur | Hvað hann gerir |
| --- | --- |
| **Virkt** | Þegar kveikt er á reitnum geta aðstoð og samþættingar notað verkefnaaðgerðirnar í þessu fyrirtæki: verkefni, verkhluta og áætlunarlínur, stöðu, afrit, vistaðar útgáfur, tilboð, notkun, VÍV, tölfræði, skýrslur og ráðstöfun forða. Þegar slökkt er á honum eru þessar aðgerðir ekki boðnar, og kall á eina þeirra svarar með villu sem segir að slökkt sé á verkefnum og hvernig kveikt er á þeim. Kveikt er á reitnum þegar uppsetningarfærslan er stofnuð. |

## Gott að vita {#good-to-know}

- **Tímaskýrsluaðgerðirnar eru óháðar reitnum.** Stofnun, innsending, samþykkt, bókun og geymsla
  tímaskýrslna í gegnum Bifröst fer ekki eftir þessum reit heldur eftir heimildum þess sem kallar til
  tímaskýrslna.
- **Að kveikja á reitnum veitir enga heimild.** Þau sem kalla þurfa áfram eigin heimildir til verkefna
  í Business Central og `BIFROST Read ori` eða `BIFROST Full ori` úr Bifröst. Aðgerð sem sá sem kallar
  hefur ekki heimild til er ekki boðin aðstoðinni.
- **Bókun krefst `BIFROST Full ori`.** Bókun VÍV, bókun vörunotkunar, tenging innkaupalína við verkefni
  og vistun útgáfu verkefnis þurfa það safn til viðbótar við eigin heimildir í Business Central.
  `BIFROST Full ori` leyfir notanda líka að opna þessa síðu og breyta henni.
- **Breyttu stillingunni hér.** Aðstoð getur ekki breytt stillingu þessarar síðu í gegnum almennar
  gagnaaðgerðir Bifröst.

Meira um forritið: [Bifröst verkefni](/projects/).
