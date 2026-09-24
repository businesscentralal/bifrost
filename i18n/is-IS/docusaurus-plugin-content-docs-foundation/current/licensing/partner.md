---
id: partner
title: "Að starfa sem samstarfsaðili"
sidebar_position: 5
description: "Hvernig samstarfsaðili Bifröst skráir sig, býður viðskiptavinum á áskriftarleyfi, fylgist með notkun þeirra og þrepi álagsþaks og rukkar þá."
---

**Samstarfsaðili** þjónar viðskiptavinum Business Central með Bifröst. Viðskiptavinur sem
samstarfsaðilinn hefur boðið og hefur þegið boðið er á **áskriftarleyfi**: **samstarfsaðilinn
rukkar viðskiptavininn** fyrir skilaboðin sem hann notar í hverjum mánuði (og fyrir þrep álagsþaks
ofan við Frítt, ef viðskiptavinurinn velur slíkt), og söluaðili samstarfsaðilans rukkar
samstarfsaðilann.

## Að gerast samstarfsaðili

Leigjandi verður samstarfsaðili þegar söluaðili býður honum.

1. Settu upp Bifröst Foundation og ljúktu við [Uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/)
   - söluaðilinn getur ekki boðið leigjanda sem hefur ekki samþykkt notendaleyfissamninginn.
2. Gefðu söluaðilanum upp **Microsoft Entra leigjandaauðkenni** þitt.
3. Þegar söluaðilinn hefur sent boðið skaltu opna **Uppsetning Bifröst** og velja **Samstilla** -
   boðið berst aðeins með samstillingu. Veldu **Skrá sem samstarfsaðili** í tilkynningunni *Bifröst
   söluaðili hefur boðið þessum leigjanda sem samstarfsaðila*.

Skráningin notar **fyrirtækisupplýsingar** núverandi fyrirtækis, sem eru það sem söluaðilinn og
viðskiptavinir þínir sjá. **Umsjón viðskiptavina**, **Óafgreiddar uppsagnarbeiðnir viðskiptavina**
og **Óska eftir uppsögn hjá söluaðila** birtast þá á Uppsetningu Bifröst. Hlutverk samstarfsaðila
tilheyrir fyrirtækinu sem skráði sig; önnur fyrirtæki leigjandans fá ekki aðgerðir samstarfsaðila.

## Viðskiptavinum boðið {#inviting-customers}

Á [Umsjón viðskiptavina](/help/foundation/customer-management/) velur þú **Bjóða viðskiptavin** og
slærð inn **Microsoft Entra leigjandaauðkenni** viðskiptavinarins (eða 64 stafa tætigildi
leigjandans) og, ef þú vilt, gælunafn. Viðskiptavinurinn sér boðið á síðunni Uppsetning Bifröst hjá
sér og þiggur það þar - sjá [Að vera viðskiptavinur](./customer.md). Frá þeirri stundu:

- er viðskiptavinurinn á **áskrift**, í öllum fyrirtækjum leigjanda síns;
- birtist notkun hans í Umsjón viðskiptavina og í notkunar- og reikningsfærslutölum þínum;
- getur viðskiptavinurinn sett mánaðarlegan kvóta og valið þrep álagsþaks.

Viðskiptavinur sem hefur fengið boð frá fleiri en einum samstarfsaðila velur hvert þeirra hann þiggur.

## Fylgst með viðskiptavinum

| Hvar | Hvað þú sérð |
|---|---|
| [Umsjón viðskiptavina](/help/foundation/customer-management/) | Hvert fyrirtæki viðskiptavinar: umhverfi, hvenær og af hverjum sambandið var samþykkt, þrep álagsþaks og köll á dag, hvort þrepið er **yfir fría þrepinu**, og notendaskilaboð og forritsskráningarskilaboð sem notuð hafa verið það sem af er mánuði. **Skoða notkun** opnar notkunarfærslur viðskiptavinarins. |
| [Leyfisnotkun](/help/foundation/license-usage/) | Einstakar notkunarfærslur, sem hægt er að sía eftir fyrirtæki, potti og dagsetningu. |
| Skilaboðategundir reikningsfærslu | `Bifrost.Partner.GetBillingSummary` og `Bifrost.Partner.GetCustomers` skila tölunum sem reikningsfært er eftir fyrir tímabil - sjá [Notkun og reikningsfærsla](./usage-and-billing.md). |

## Reikningsfærsla

Rukkaðu hvern viðskiptavin fyrir:

- **notendaskilaboðin** og **forritsskráningarskilaboðin** sem hann notaði á tímabilinu, á því
  áskriftarverði sem þið sömduð um;
- **þrep álagsþaks** hans, þegar það er ofan við Frítt, á því verði fyrir þrepið sem þið sömduð um.

Viðskiptavinur sem sambandinu lauk við á tímabilinu er áfram með í reikningsfærslutölunum fyrir þá
áskriftarnotkun sem hann hafði fyrir uppsögnina.

## Viðskiptavini sagt upp

Veldu viðskiptavininn á Umsjón viðskiptavina og veldu **Segja upp viðskiptavini**, ef þú vilt með
ástæðu sem viðskiptavinurinn sér. Við næstu samstillingu viðskiptavinarins lýkur sambandinu og hann
fer aftur á **fyrirframgreitt leyfi**; álagsþak hans fer aftur á Frítt. Viðskiptavinurinn birtist
ekki lengur á Umsjón viðskiptavina, en notkun hans fram að uppsögninni er áfram í
reikningsfærslutölum þínum.

## Þegar viðskiptavinur óskar eftir uppsögn

Viðskiptavinur getur sent þér uppsagnarbeiðni (**Óska eftir uppsögn hjá samstarfsaðila**).
Uppsetning Bifröst sýnir þá *Óafgreiddar uppsagnarbeiðnir viðskiptavina bíða yfirferðar*. Opnaðu
[Óafgreiddar uppsagnarbeiðnir viðskiptavina](/help/foundation/pending-customer-leave-requests/) og:

- **Staðfesta** - viðskiptavininum er sagt upp nákvæmlega eins og með Segja upp viðskiptavini og
  hann fer aftur á fyrirframgreitt leyfi;
- **Hafna** - sláðu inn ástæðu; viðskiptavinurinn sér hana við næstu samstillingu og er áfram
  viðskiptavinur þinn.

## Úrsögn frá söluaðila

**Óska eftir uppsögn hjá söluaðila** á Uppsetningu Bifröst biður söluaðilann að ljúka skráningu
þinni sem samstarfsaðila. Ef söluaðilinn staðfestir er skráningu þinni lokað og **allir
viðskiptavinir þínir fara aftur á fyrirframgreitt leyfi**. Ef söluaðilinn hafnar beiðninni sérðu
ástæðuna á Uppsetningu Bifröst eftir næstu samstillingu.

Það sama gerist án beiðni þegar söluaðilinn segir þér upp: Uppsetning Bifröst sýnir þá *Bifröst
söluaðili hefur sagt upp þessum samstarfsaðila*, og viðskiptavinir þínir fá sínar uppsagnir.

## Tengt efni

- [Að starfa sem söluaðili](./vendor.md)
- [Að vera viðskiptavinur](./customer.md)
- [Úrsögn og uppsögn](./leaving-and-cancelling.md)
- [Notkun og reikningsfærsla](./usage-and-billing.md)
