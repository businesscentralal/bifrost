---
id: vendor
title: "Að starfa sem söluaðili"
sidebar_position: 4
description: "Hvernig söluaðili Bifröst skráir sig, býður og stýrir samstarfsaðilum, fylgist með viðskiptavinum þeirra og notkun og rukkar samstarfsaðila sína."
---

**Söluaðili** kemur Bifröst á markað í gegnum samstarfsaðila. Söluaðilinn rukkar ekki
endaviðskiptavini beint: hann býður samstarfsaðilum, hver samstarfsaðili býður og rukkar sína eigin
viðskiptavini, og söluaðilinn **rukkar samstarfsaðila sína** fyrir áskriftarnotkun þessara
viðskiptavina.

Origo samþykkir söluaðila; Bifröst býður ekki upp á skráningu söluaðila að eigin frumkvæði.
Samþykktur leigjandi sér aðgerðir söluaðila sem hér er lýst á síðunni **Uppsetning Bifröst**.

## Skráning

1. Opnaðu **Uppsetning Bifröst**. Samþykktur leigjandi sér tilkynninguna *Þessi leigjandi má skrá
   sig sem söluaðili í Bifröst* og aðgerðina **Skrá söluaðila** undir **Leyfi**.
2. Keyrðu [Bifröst söluaðilaskráningu](/help/foundation/vendor-onboarding-wizard/). Hún sýnir
   leigjandann og **fyrirtækisupplýsingar** núverandi fyrirtækis, sem eru það sem samstarfsaðilar og
   Origo sjá um söluaðilann. Leiðréttu fyrirtækisupplýsingarnar fyrst ef þörf krefur.
3. Veldu **Ljúka**. Leigjandinn er skráður sem söluaðili, og **Umsjón samstarfsaðila**,
   **Umsjón viðskiptavina**, **Óafgreiddar uppsagnarbeiðnir samstarfsaðila** og **Afskrá sem
   söluaðili** birtast á Uppsetningu Bifröst.

Hlutverk söluaðila tilheyrir fyrirtækinu sem skráði það. Önnur fyrirtæki sama leigjanda fá ekki
aðgerðir söluaðila. Keyrðu skráninguna aftur eftir að fyrirtækisupplýsingum hefur verið breytt til
að uppfæra skráninguna.

## Samstarfsaðilum boðið {#inviting-partners}

Á [Umsjón samstarfsaðila](/help/foundation/partner-management/) velur þú **Bjóða samstarfsaðila** og
slærð inn **Microsoft Entra leigjandaauðkenni** væntanlegs samstarfsaðila (eða 64 stafa
tætigildi leigjandans) og, ef þú vilt, gælunafn sem birtist þar til samstarfsaðilinn hefur skráð sig.

- Samstarfsaðilinn verður þegar að hafa sett upp Bifröst og samþykkt notendaleyfissamninginn -
  annars er boðinu hafnað með *Umræddur leigjandi hefur ekki sett upp Bifröst*.
- Boðið birtist á síðunni Uppsetning Bifröst hjá samstarfsaðilanum sem tilkynningin **Skrá sem
  samstarfsaðili**. Þegar samstarfsaðilinn þiggur það breytist lína hans úr **Óskráður** í
  **Opinn** og sýnir skráðar fyrirtækisupplýsingar samstarfsaðilans.
- **Að þjóna viðskiptavinum sjálfur.** Sláðu inn eigið leigjandaauðkenni til að skrá söluaðilann
  sem eigin samstarfsaðila. Samþykktu síðan tilkynninguna *Skrá sem samstarfsaðili* á eigin síðu
  Uppsetning Bifröst; línan er merkt **Söluaðili sem samstarfsaðili**. Upp frá því getur þú boðið
  viðskiptavinum eins og hver annar samstarfsaðili.

## Fylgst með samstarfsaðilum og viðskiptavinum þeirra

| Hvar | Hvað þú sérð |
|---|---|
| [Umsjón samstarfsaðila](/help/foundation/partner-management/) | Alla samstarfsaðila sem þú hefur boðið, stöðu þeirra, skráðar fyrirtækisupplýsingar og hvenær þær voru síðast uppfærðar. **Skoða viðskiptavini** opnar viðskiptavini samstarfsaðilans og **Skoða notkun** notkunarfærslur viðskiptavina hans. |
| [Umsjón viðskiptavina](/help/foundation/customer-management/) | Alla viðskiptavini allra samstarfsaðila þinna: fyrirtæki, umhverfi, hvenær sambandið var samþykkt, þrep álagsþaks og notendaskilaboð og forritsskráningarskilaboð það sem af er mánuði. Söluaðili sem er einnig skráður sem eigin samstarfsaðili sér hér eigin viðskiptavini; notaðu **Skoða viðskiptavini** á Umsjón samstarfsaðila fyrir hina samstarfsaðilana. |
| [Leyfisnotkun](/help/foundation/license-usage/) | Einstakar notkunarfærslur, sem hægt er að sía eftir fyrirtæki, potti og dagsetningu. |
| Skilaboðategundir reikningsfærslu | `Bifrost.Vendor.GetBillingSummary`, `Bifrost.Vendor.GetPartners` og `Bifrost.Vendor.GetCustomers` skila tölunum sem reikningsfært er eftir - sjá [Notkun og reikningsfærsla](./usage-and-billing.md). |

## Samstarfsaðila sagt upp

Veldu samstarfsaðilann á Umsjón samstarfsaðila og veldu **Segja upp samstarfsaðila**. Þú getur
tilgreint ástæðu, sem samstarfsaðilinn sér. Við næstu samstillingu samstarfsaðilans er skráningu
hans lokað, og hver viðskiptavinur hans fær uppsögn og fer aftur á **fyrirframgreitt leyfi** við
eigin næstu samstillingu. Áskriftarnotkun þeirra fram að því er áfram í reikningsfærslutölum þínum
fyrir tímabilið.

## Þegar samstarfsaðili óskar eftir uppsögn

Samstarfsaðili getur sent þér uppsagnarbeiðni (**Óska eftir uppsögn hjá söluaðila** á síðunni
Uppsetning Bifröst hjá honum). Uppsetning Bifröst sýnir þá *Óafgreiddar uppsagnarbeiðnir
samstarfsaðila bíða yfirferðar*. Opnaðu
[Óafgreiddar uppsagnarbeiðnir samstarfsaðila](/help/foundation/pending-partner-leave-requests/) og:

- **Staðfesta** - samstarfsaðilanum er sagt upp nákvæmlega eins og ef þú hefðir valið Segja upp
  samstarfsaðila;
- **Hafna** - sláðu inn ástæðu; samstarfsaðilinn sér hana við næstu samstillingu og er áfram
  samstarfsaðili.

## Afskráning sem söluaðili

**Afskrá sem söluaðili** á Uppsetningu Bifröst lokar skráningu söluaðilans og segir upp **öllum**
samstarfsaðilum hans; hver viðskiptavinur þeirra fer aftur á fyrirframgreitt leyfi. Ekki er hægt að
afturkalla þetta í forritinu.

## Tengt efni

- [Að starfa sem samstarfsaðili](./partner.md)
- [Úrsögn og uppsögn](./leaving-and-cancelling.md)
- [Notkun og reikningsfærsla](./usage-and-billing.md)
