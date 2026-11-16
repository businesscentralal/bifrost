---
id: license-fact-box
title: "Leyfi"
---

Upplýsingareiturinn **Leyfi** á [Uppsetningu Bifröst](/help/foundation/bifrost-setup/) sýnir upplýsingar
um núverandi leigjanda og fyrirtæki fyrir notendur með leyfisstjórnunarheimild (`BIFROST LicAdm ori`).
Hvernig Foundation er sett upp ræður því hvaða reitir birtast. **Tegund leyfis** og notendaleyfissamningurinn
birtast í báðum tilvikum.

## DEV-útgáfa og staðbundin uppsetning {#dev-published-and-on-premises-installations}

DEV-viðbót í SaaS-sandkassa í Business Central sýnir sömu leyfisupplýsingar og staðbundin uppsetning.

| Reitur | Lýsing |
| --- | --- |
| **Tegund leyfis** | **Prufuleyfi** eða **Áskrift**. Prufuleyfi á þessum reit er fyrirframgreitt leyfi. Sjá [Tegundir leyfa](/licensing/license-types/). |
| **Staða leyfis** | Ekki virkjað, prufuleyfi, með leyfi, frestur, útrunnið eða hermt. |
| **Staðfest til** | Hve lengi síðasta leyfisathugun sem tókst gildir. Eftir þann tíma hefst fresturinn. |
| **Frestur til** | Hvenær leyfið rennur út ef önnur leyfisathugun tekst ekki. |
| **Notendur Bifröst** | Fjöldi færslna í notendauppsetningu Bifröst og, þegar talan er tiltæk, fjöldi notenda sem leyfið heimilar. |
| **Síðasta villa leyfisathugunar** | Ástæðukóði síðustu leyfisathugunar sem tókst ekki. |

Tætigildi leigjandakennis, mánaðarleg notkun, óskráð skilaboð og síðasta samstilling notkunar eru falin.
Aðgerðirnar **Tengingastaða** og **Leyfisnotkun** á Uppsetningu Bifröst eru einnig faldar. **Samstilla**
er áfram tiltæk til að uppfæra leyfið.

## SaaS-uppsetning úr AppSource {#saas-installations-from-appsource}

Leyfisstöðureitirnir hér að ofan eru faldir. Uppsetning úr AppSource sýnir áfram tætigildi leigjandakennis,
notkunarflokkana **Þessi mánuður** og **Síðasti mánuður**, **Óskráð skilaboð** og **Síðast samstillt**.
Notandi og Forritsskráning birtast alltaf í hvorum mánuði. Innri, Sýniumhverfi og Þjónustuaðili birtast
aðeins þegar notkun er ekki núll. Ef ekki næst í leyfisþjónustuna sýna mánaðartölurnar **Óþekkt**.
Ef notkunartala er valin opnast notkunarfærslur síaðar eftir fyrirtæki, mánuði og gjaldtegund.

**Notendaleyfi** og **Forritsskráningarleyfi** birtast fyrir prufuleyfi og eru falin fyrir áskrift.
**Tengingastaða** og **Leyfisnotkun** eru áfram tiltækar leyfisstjórum. Neikvæð eftirstaða þýðir að
potturinn er að nota vikmörk sín upp á 100 skilaboð. Á áskrift eru pottarnir taldir en ekki takmarkaðir;
samstarfsaðilinn þinn rukkar fyrir notkunina. Veldu **Samstilla** til að tilkynna óskráða notkun og
uppfæra gildin.

## Notendaleyfissamningur {#end-user-license-agreement}

Báðar uppsetningar sýna hvort samningurinn sé samþykktur, hver samþykkti hann og hvenær. Eldra samþykki
án skráðs samþykktaraðila sýnir **samþykktaraðili ekki skráður**. Undanþegið matsfyrirtæki sýnir að
samþykki sé ekki nauðsynlegt.

Staðbundin uppsetning, og DEV-viðbót í SaaS-sandkassa í Business Central, notar fyrri birtinguna.
Foundation sem er sett upp úr AppSource í Business Central í skýinu notar seinni birtinguna. DEV-viðbót
sem er birt í framleiðsluumhverfi í skýinu notar einnig þá birtingu.
