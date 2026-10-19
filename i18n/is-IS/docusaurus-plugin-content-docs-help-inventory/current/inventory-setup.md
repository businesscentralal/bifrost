---
id: inventory-setup
title: "Uppsetning birgða"
sidebar_position: 1
---

**Uppsetning birgða** kveikir og slekkur á sviðum Bifröst birgða fyrir þetta fyrirtæki. Síðan er fyrir
kerfisstjórann sem ákveður hvaða birgðaverk aðstoð og samþættingar mega vinna hér.

Leitaðu að **Uppsetning birgða** í Business Central, eða opnaðu síðuna úr lista uppsettra forrita á
[Uppsetning Bifröst](/help/foundation/bifrost-setup/). Ein uppsetningarfærsla er til fyrir hvert
fyrirtæki; hún er stofnuð þegar forritið er sett upp, eða í fyrsta sinn sem síðan er opnuð.

## Svið {#domains}

Hver reitur kveikir eða slekkur á einu sviði. Þegar slökkt er á sviði eru aðgerðir þess ekki boðnar
aðstoð í þessu fyrirtæki, og kall á eina þeirra svarar með villu sem nefnir sviðið.

| Reitur | Kveikir eða slekkur á |
| --- | --- |
| **Eiginleikar** | Lestri vörueiginda, eigindagildum á vörum og skilgreiningu nýrra eiginda. |
| **Flutningspantanir** | Stofnun, losun, enduropnun, forskoðun og bókun flutningspantana, tölfræði þeirra og afturköllun bókaðra flutningsafhendinga og -móttaka. |
| **Samsetning** | Stofnun, endurnýjun, losun, enduropnun, forskoðun og bókun samsetningarpantana, tölfræði þeirra og afturköllun bókaðra samsetninga. |
| **Frátektir** | Lestri, stofnun og afturköllun frátekta. |
| **Vörurakning** | Úthlutun og fjarlægingu lotu-, rað- og pakkanúmera, og eftirstandandi magni á hverja lotu, raðnúmer eða pakka. |
| **Birgðatalning** | Útreikningi, skráningu, forskoðun og bókun birgðatalningarbóka. |
| **Kostnaður** | Lestri á kostnaði vöru, kostnaðarleiðréttingu, bókun birgðakostnaðar í fjárhag og útreikningi endurmats. |
| **Endurflokkun** | Athugun, forskoðun og bókun endurflokkunarbóka. Slökkt þegar uppsetningarfærslan er stofnuð; kveiktu á því þegar þú þarft það. |
| **Vörujöfnun** | Lestri vörujafnana og afturköllun og endurgerð þeirra. |
| **Birgðatímabil** | Lestri, lokun og enduropnun birgðatímabila. |
| **Vöruverð** | Uppfærslu einingarverðs vöru. |

## Gott að vita {#good-to-know}

- Að kveikja á sviði veitir enga heimild. Þau sem kalla þurfa áfram eigin heimildir í Business Central
  og `BIFROST Read ori` eða `BIFROST Full ori` úr Bifröst.
- Bókun, kostnaðarleiðrétting og bókun birgðakostnaðar í fjárhag þurfa auk þess heimildasafnið
  **Bókunarhlið birgða** (`BIFROST InvPost ori`). Það safn leyfir notanda líka að opna þessa síðu og
  breyta henni.
- Aðstoð getur ekki breytt stillingum þessarar síðu í gegnum almennar gagnaaðgerðir Bifröst; breyttu
  þeim hér.
