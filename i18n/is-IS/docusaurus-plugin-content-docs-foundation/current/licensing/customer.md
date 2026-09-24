---
id: customer
title: "Að vera viðskiptavinur"
sidebar_position: 6
description: "Hvernig leigjandi þiggur boð samstarfsaðila, hvað breytist á áskriftarleyfi, mánaðarlegur kvóti og þrep álagsþaks, og hvernig sagt er skilið við samstarfsaðila."
---

**Viðskiptavinur** er leigjandi sem hefur þegið boð frá samstarfsaðila Bifröst. Viðskiptavinur er á
**áskriftarleyfi** og samstarfsaðilinn rukkar hann fyrir skilaboðin sem hann notar í hverjum mánuði.

## Boð þegið

1. Gakktu úr skugga um að Bifröst Foundation sé uppsett og að
   [Uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/) sé lokið - leigjandinn
   byrjar á fyrirframgreiddu leyfi með samþykktan notendaleyfissamning og virkt prufuleyfi.
2. Gefðu samstarfsaðilanum upp **Microsoft Entra leigjandaauðkenni** þitt (birtist sem **Azure
   leigjandakenni** á Uppsetningu Bifröst).
3. Þegar samstarfsaðilinn hefur sent boðið skaltu opna **Uppsetning Bifröst** (keyrðu **Samstilla**
   ef tilkynningin birtist ekki strax) og velja **Skrá sem viðskiptavinur** í tilkynningunni
   *Bifröst samstarfsaðili hefur boðið þessum leigjanda sem viðskiptavin*.
4. Ef fleiri en einn samstarfsaðili hefur boðið þér opnast
   [Óafgreidd boð viðskiptavinar](/help/foundation/pending-customer-invites/): veldu samstarfsaðilann og
   veldu **Samþykkja**.

Aðeins leyfisstjóri getur þegið boð, því það færir reikningsfærslu leigjandans til
samstarfsaðilans.

## Hvað breytist á áskrift

- **Öll fyrirtæki leigjandans** eru á áskrift - líka fyrirtæki sem byrja að nota Bifröst síðar.
- Samstarfsaðilinn rukkar þig fyrir skilaboðin sem þú notar í hverjum mánuði. Enginn keyptur
  kvóti er til að klárast.
- Þú getur sett þak á eigin notkun - og þar með reikninginn - með **mánaðarlegum kvóta**:
  - **Mánaðarlegur skilaboðakvóti fyrirtækis** á síðunni Uppsetning Bifröst;
  - **Mánaðarlegur skilaboðakvóti notanda** fyrir hvern notanda í Uppsetningu notanda Bifröst.

  `0` þýðir engin takmörk. Þegar kvóta er náð er köllum hafnað fram að næsta almanaksmánuði.
- Þú getur valið hærra **álagsþak** með **Stilla álagsþak** á Uppsetningu Bifröst (aðeins í
  framleiðsluumhverfi). Spyrðu samstarfsaðilann fyrst um verðið. Sjá [Álagsþak](./rate-limits.md).

## Fylgst með notkun

- Upplýsingareiturinn **Leyfi** á Uppsetningu Bifröst sýnir tegund leyfis og skilaboð sem enn hafa
  ekki verið tilkynnt.
- [Leyfisnotkun](/help/foundation/license-usage/) sýnir notkunarfærslurnar þínar eftir degi,
  fyrirtæki og potti.
- `Bifrost.Subscription.GetStatus` og `Bifrost.Subscription.GetUsage` skila sömu upplýsingum til
  samþættingar - sjá [Notkun og reikningsfærsla](./usage-and-billing.md).

## Úrsögn frá samstarfsaðila

Veldu **Óska eftir uppsögn hjá samstarfsaðila** á Uppsetningu Bifröst og tilgreindu ástæðu ef þú
vilt. Samstarfsaðilinn fer yfir beiðnina:

- **Staðfest** - við næstu samstillingu lýkur sambandinu og leigjandinn fer aftur á
  **fyrirframgreitt leyfi**. Álagsþakið fer aftur á Frítt og köll nota aftur keyptan skilaboðakvóta.
- **Hafnað** - eftir næstu samstillingu sýnir Uppsetning Bifröst ástæðu samstarfsaðilans. Þú ert
  áfram viðskiptavinur.

## Þegar samstarfsaðilinn segir upp

Samstarfsaðilinn getur slitið sambandinu (**Segja upp viðskiptavini**), og því lýkur einnig þegar
söluaðili samstarfsaðilans segir samstarfsaðilanum upp. Við næstu samstillingu sýnir Uppsetning
Bifröst *Samstarfi þessa leigjanda við Bifröst samstarfsaðila er lokið* og leigjandinn er aftur á
**fyrirframgreiddu leyfi**.

Hægt er að bjóða fyrrverandi viðskiptavini aftur - sami eða annar samstarfsaðili - og ef boðið er
þegið fer leigjandinn aftur á áskrift.

## Tengt efni

- [Tegundir leyfa](./license-types.md)
- [Úrsögn og uppsögn](./leaving-and-cancelling.md)
