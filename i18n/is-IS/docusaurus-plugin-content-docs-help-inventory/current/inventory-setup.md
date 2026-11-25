---
id: inventory-setup
title: "Uppsetning birgða"
sidebar_position: 1
---

**Uppsetning birgða** kveikir og slekkur á sviðum Bifröst birgða fyrir þetta fyrirtæki. Síðan er fyrir
kerfisstjórann sem ákveður hvaða birgðaverk aðstoð og samþættingar mega vinna hér.

Leitaðu að **Uppsetning birgða** í Business Central, eða opnaðu síðuna úr lista uppsettra forrita á
[Uppsetning Bifröst](/help/foundation/bifrost-setup/). Ein uppsetningarfærsla er til fyrir hvert
fyrirtæki; hún er stofnuð þegar forritið er sett upp, þegar nýtt fyrirtæki er stofnað, eða í fyrsta sinn
sem síðan er opnuð.

## Svið {#domains}

Hver reitur kveikir eða slekkur á einu sviði. **Slökkt er á öllum sviðum sjálfgefið**, og fyrirtæki án
uppsetningarfærslu telst vera með slökkt á öllum sviðum. Þegar slökkt er á sviði eru aðgerðir þess ekki
listaðar fyrir aðstoð í þessu fyrirtæki. Rofinn breytir aðeins þeim lista: aðgerð sem er kölluð er aldrei
hafnað vegna þess að slökkt er á sviðinu, og heimildir þess sem kallar í Business Central gilda áfram.
Til að aðstoð sjái aðgerðir sviðs skaltu kveikja á því hér, eða nota
[Tillögu að uppsetningu](#suggest-setup).

Reitirnir birtast í þessari röð:

| Reitur | Kveikir eða slekkur á |
| --- | --- |
| **Eiginleikar** | Lestri vörueiginda, eigindagildum á vörum og skilgreiningu nýrra eiginda. |
| **Flutningspantanir** | Stofnun, losun, enduropnun, forskoðun og bókun flutningspantana og tölfræði þeirra. |
| **Samsetning** | Stofnun, endurnýjun, losun, enduropnun, forskoðun og bókun samsetningarpantana, tölfræði þeirra og afturköllun bókaðra samsetninga. |
| **Frátektir** | Lestri, stofnun og afturköllun frátekta, sjálfvirkri frátekt sölulínu og lestri pöntunarrakningarkeðju línu. |
| **Vörurakning** | Lestri lotu-, rað- og pakkarakningar á línu eða vöru, og eftirstandandi magni á hverja lotu, raðnúmer eða pakka. |
| **Birgðatalning** | Útreikningi, skráningu, forskoðun og bókun birgðatalningarbóka. |
| **Kostnaður** | Lestri og breytingu á kostnaði vöru, kostnaðarleiðréttingu, bókun birgðakostnaðar í fjárhag og útreikningi, forskoðun og bókun endurmats. |
| **Endurflokkun** | Athugun, forskoðun og bókun endurflokkunarbóka. |
| **Vörujöfnun** | Lestri vörujafnana og afturköllun og endurgerð þeirra. |
| **Birgðatímabil** | Lestri, lokun og enduropnun birgðatímabila. |
| **Vöruverð** | Uppfærslu einingarverðs vöru. |
| **Vörutilvísun** | Að leysa strikamerki, vörutilvísun viðskiptavinar eða birgja, vörunúmer eða GTIN upp í vöru. |
| **Framboð** | Lestri áætlaðs framboðs vara eftir degi, viku, mánuði, ársfjórðungi eða ári. |
| **Kostnaðarauki** | Úthlutun kostnaðarauka á innkaupa- eða söluskjali á vörulínur þess og lestri á því hvernig honum er dreift. |
| **Vöruskipti** | Lestri beinna staðgengla vöru og núverandi birgða þeirra. |
| **Vöruflokkur** | Lestri vöruflokkatrésins og stofnun eða uppfærslu vöruflokka með sjálfgefnum eigindum þeirra. |
| **Innkaupaskil** | Stofnun innkaupaskilapöntunar eða kreditreiknings úr bókuðum vörumóttökum eða reikningslínum. |
| **Vörulistavörur** | Stofnun vöru úr vörulistavöru með vörusniðmáti vörulistavörunnar. |
| **Áætlun** | Útreikningi áætlunarbókar og framkvæmd tillagna hennar til að stofna innkaups- eða flutningspantanir. |

### Ný og eldri fyrirtæki {#new-and-existing-companies}

Nýtt fyrirtæki fær uppsetningarfærslu sína með slökkt á öllum sviðum. Þegar Bifröst birgðir eru settar upp
eða uppfærðar keyrir Tillaga að uppsetningu einu sinni í hverju fyrirtæki sem á enn enga uppsetningarfærslu,
án þess að spyrja, og kveikir á þeim sviðum sem fyrirtækið getur notað. Fyrirtæki sem á þegar
uppsetningarfærslu breytist aldrei við uppsetningu eða uppfærslu: færslan er val kerfisstjórans.

## Tillaga að uppsetningu {#suggest-setup}

**Tillaga að uppsetningu** er aðgerð á **Uppsetning birgða** og í leiðsagðri uppsetningu (skrefinu
**Svið**). Hún les uppsetningu fyrirtækisins í Business Central og metur hvaða svið fyrirtækið getur notað.

1. Veldu **Tillaga að uppsetningu**.
2. Listi sýnir hvert svið með tillögu, **virkja**, **hafa óvirkt** eða **þegar virkt**, og ástæðu sem
   nefnir sviðið og segir hvað fannst.
3. Veldu **Í lagi** til að framkvæma tillöguna, eða **Hætta við** til að breyta engu. Engu er breytt fyrr
   en þú staðfestir. Ef ekkert myndi breytast birtast skilaboð um það í staðinn.

Tillaga að uppsetningu kveikir aðeins á sviðum. Hún slekkur aldrei á rofa, svo svið sem þú kveiktir á
helst á, og þú getur keyrt hana aftur hvenær sem er, til dæmis eftir að þú hefur sett upp staðsetningar
eða kostnaðarauka. Til að slökkva á sviði skaltu taka hakið úr reitnum þess í **Uppsetning birgða**.

### Hvernig tillagan er metin {#how-suggest-setup-decides}

| Svið | Lagt til að kveikja á því þegar |
| --- | --- |
| **Flutningspantanir** | Fyrirtækið á staðsetningu sem er notuð sem flutningsstaðsetning (Nota sem í flutningi) og að minnsta kosti tvær aðrar staðsetningar. |
| **Samsetning** | Að minnsta kosti einn samsetningarlisti er uppsettur, það er efnislína af gerðinni Vara. |
| **Vörurakning** | Að minnsta kosti ein vara notar rakningarkóða. |
| **Kostnaðarauki** | Að minnsta kosti einn kostnaðarauki er uppsettur. |
| **Birgðatímabil** | Að minnsta kosti eitt birgðatímabil er uppsett. |
| **Eiginleikar**, **Frátektir**, **Birgðatalning**, **Kostnaður**, **Endurflokkun**, **Vörujöfnun**, **Vöruverð**, **Vörutilvísun**, **Framboð**, **Vöruskipti**, **Vöruflokkur**, **Innkaupaskil**, **Vörulistavörur** og **Áætlun** | Fyrirtækið á að minnsta kosti eina vöru. |

Þegar sviði er haldið óvirku segir ástæðan hvað vantar, til dæmis að engin flutningsstaðsetning sé
uppsett eða að fyrirtækið eigi engar vörur.

## Gott að vita {#good-to-know}

- Að kveikja á sviði veitir enga heimild. Þau sem kalla þurfa áfram eigin heimildir í Business Central
  og `BIFROST Read ori` eða `BIFROST Full ori` úr Bifröst.
- Bókun flutnings- og samsetningarpantana, bókun eða forskoðun endurflokkunar- og endurmatsbóka,
  kostnaðarleiðrétting og bókun birgðakostnaðar í fjárhag þurfa auk þess heimildasafnið
  **Bókunarhlið birgða** (`BIFROST InvPost ori`). Það safn leyfir notanda líka að opna þessa síðu og
  breyta henni.
- Aðstoð getur ekki breytt stillingum þessarar síðu í gegnum almennar gagnaaðgerðir Bifröst; breyttu
  þeim hér.
