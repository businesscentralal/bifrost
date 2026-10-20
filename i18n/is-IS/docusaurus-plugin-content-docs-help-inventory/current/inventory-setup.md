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
| **Flutningspantanir** | Stofnun, losun, enduropnun, forskoðun og bókun flutningspantana og tölfræði þeirra. |
| **Samsetning** | Stofnun, endurnýjun, losun, enduropnun, forskoðun og bókun samsetningarpantana, tölfræði þeirra og afturköllun bókaðra samsetninga. |
| **Frátektir** | Lestri, stofnun og afturköllun frátekta, sjálfvirkri frátekt sölulínu og lestri pöntunarrakningarkeðju línu. |
| **Vörurakning** | Lestri lotu-, rað- og pakkarakningar á línu eða vöru, og eftirstandandi magni á hverja lotu, raðnúmer eða pakka. |
| **Birgðatalning** | Útreikningi, skráningu, forskoðun og bókun birgðatalningarbóka. |
| **Kostnaður** | Lestri og breytingu á kostnaði vöru, kostnaðarleiðréttingu, bókun birgðakostnaðar í fjárhag og útreikningi, forskoðun og bókun endurmats. |
| **Endurflokkun** | Athugun, forskoðun og bókun endurflokkunarbóka. Slökkt þegar uppsetningarfærslan er stofnuð; kveiktu á því þegar þú þarft það. |
| **Vörujöfnun** | Lestri vörujafnana og afturköllun og endurgerð þeirra. |
| **Birgðatímabil** | Lestri, lokun og enduropnun birgðatímabila. |
| **Vöruverð** | Uppfærslu einingarverðs vöru. |
| **Vörutilvísun** | Að leysa strikamerki, vörutilvísun viðskiptavinar eða birgja, vörunúmer eða GTIN upp í vöru. |
| **Framboð** | Lestri áætlaðs framboðs vara eftir degi, viku, mánuði, ársfjórðungi eða ári. |
| **Kostnaðarauki** | Úthlutun kostnaðarauka á innkaupa- eða söluskjali á vörulínur þess og lestri á því hvernig honum er dreift. |
| **Vöruflokkur** | Lestri vöruflokkatrésins og stofnun eða uppfærslu vöruflokka með sjálfgefnum eigindum þeirra. |

Þegar ný uppsetningarfærsla er stofnuð er kveikt á fjórtán af fimmtán sviðum; slökkt er á **Endurflokkun**.

### Fyrirtæki sem voru til áður {#companies-that-existed-before}

Í fyrirtæki sem var þegar með Bifröst birgðir áður en fjórum nýjustu sviðunum var bætt við
(**Vörutilvísun**, **Framboð**, **Kostnaðarauki** og **Vöruflokkur**) er áfram slökkt á þessum fjórum
eftir uppfærsluna. Kerfisstjóri kveikir á þeim hér þegar aðstoð og samþættingar eiga að nota þau.

## Gott að vita {#good-to-know}

- Að kveikja á sviði veitir enga heimild. Þau sem kalla þurfa áfram eigin heimildir í Business Central
  og `BIFROST Read ori` eða `BIFROST Full ori` úr Bifröst.
- Bókun flutnings- og samsetningarpantana, bókun eða forskoðun endurflokkunar- og endurmatsbóka,
  kostnaðarleiðrétting og bókun birgðakostnaðar í fjárhag þurfa auk þess heimildasafnið
  **Bókunarhlið birgða** (`BIFROST InvPost ori`). Það safn leyfir notanda líka að opna þessa síðu og
  breyta henni.
- Aðstoð getur ekki breytt stillingum þessarar síðu í gegnum almennar gagnaaðgerðir Bifröst; breyttu
  þeim hér.
