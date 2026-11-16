---
id: license-fact-box
title: "Leyfi"
---

Upplýsingareiturinn **Leyfi** á [Uppsetningu Bifröst](/help/foundation/bifrost-setup/) sýnir upplýsingar
um núverandi leigjanda og fyrirtæki fyrir notendur með leyfisstjórnunarheimild (`BIFROST LicAdm ori`).
Leyfisstilling uppsetningarinnar ræður því hvaða reitir birtast. Tegund leyfis og notendaleyfissamningur
birtast í báðum stillingum.

## DEV-útgáfa og staðbundin uppsetning

Foundation sem er birt sem DEV-viðbót í SaaS-sandkassa sýnir sömu leyfisupplýsingar og staðbundin uppsetning.

| Reitur | Lýsing |
| --- | --- |
| **Tegund leyfis** | Prufuleyfi eða áskrift. |
| **Staða leyfis** | Ekki virkjað, prufuleyfi, með leyfi, frestur, útrunnið eða hermt. Prófunarforritið notar hermda stöðu. |
| **Staðfest til** | Hve lengi síðasta leyfisathugun gildir. |
| **Frestur til** | Hvenær leyfið rennur út ef önnur leyfisathugun tekst ekki. |
| **Notendur Bifröst** | Fjöldi færslna í notendauppsetningu Bifröst og, þegar talan er tiltæk, fjöldi notenda sem leyfið heimilar. |
| **Síðasta villa leyfisathugunar** | Ástæðukóði síðustu leyfisathugunar sem tókst ekki. |

Tætigildi leigjandakennis, mánaðarleg notkun, óskráð skilaboð og síðasta samstilling notkunar eru falin.
Aðgerðirnar **Tengingastaða** og **Leyfisnotkun** á Uppsetningu Bifröst eru einnig faldar. **Samstilla**
er áfram tiltæk til að uppfæra leyfið.

## SaaS-uppsetning úr AppSource

Leyfisstöðureitirnir hér að ofan eru faldir. SaaS sýnir áfram tætigildi leigjandakennis, notkunarflokkana
**Þessi mánuður** og **Síðasti mánuður**, **Óskráð skilaboð** og **Síðast samstillt**. Notandi og
Forritsskráning birtast alltaf í hvorum mánuði; Innri, Sýniumhverfi og Þjónustuaðili birtast aðeins þegar
notkun er ekki núll. Ef ekki næst í leyfisþjónustuna sýna mánaðartölurnar **Óþekkt**. Notkunartölur opna
notkunarfærslur síaðar eftir fyrirtæki, mánuði og gjaldtegund.

Flokkarnir Notendaleyfi og Forritsskráningarleyfi birtast áfram fyrir prufuleyfi en eru faldir fyrir
áskrift. **Tengingastaða** og **Leyfisnotkun** eru áfram tiltækar leyfisstjórum. Veldu **Samstilla**
Neikvæð eftirstaða þýðir að potturinn er að nota vikmörk sín upp á 100 skilaboð. Á áskrift eru pottarnir
taldir en ekki takmarkaðir; samstarfsaðilinn þinn rukkar fyrir notkunina. Veldu **Samstilla** til að tilkynna
óskráða notkun og uppfæra gildin.

## Notendaleyfissamningur

Báðar stillingar sýna hvort samningurinn sé samþykktur, hver samþykkti hann og hvenær. Eldra samþykki
án skráðs samþykktaraðila sýnir **samþykktaraðili ekki skráður**. Undanþegið matsfyrirtæki sýnir að
samþykki sé ekki nauðsynlegt.

Stillingin fylgir leyfiskóðanum: staðbundnar uppsetningar og gámar teljast ekki SaaS; DEV-birting í
raunverulegum SaaS-sandkassa telst ekki SaaS. PTE/Global-birting í SaaS og DEV-birting í SaaS-framleiðslu
nota áfram SaaS-birtingu. Heiti forrita ráða ekki stillingunni.
