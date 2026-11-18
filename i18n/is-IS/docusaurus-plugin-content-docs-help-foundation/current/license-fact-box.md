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
| **Tegund leyfis** | **Prufuleyfi** eða **Áskrift**. Sjá [Tegundir leyfa](/licensing/license-types/). |
| **Staða leyfis** | Ekki virkjað, prufuleyfi, með leyfi, frestur, útrunnið eða hermt. |
| **Staðfest til** | Hve lengi síðasta leyfisathugun sem tókst gildir. Eftir þann tíma hefst fresturinn. |
| **Frestur til** | Hvenær leyfið rennur út ef önnur leyfisathugun tekst ekki. |
| **Notendur Bifröst** | Fjöldi færslna í notendauppsetningu Bifröst og, þegar talan er tiltæk, fjöldi notenda sem leyfið heimilar. |
| **Síðasta villa leyfisathugunar** | Ástæðukóði síðustu leyfisathugunar sem tókst ekki. |
| **Prufuleyfi lýkur** | Dagurinn sem staðbundna prufuleyfið rennur út: 90 dögum eftir að það hófst, eða fyrr ef skilaboðamörkum er náð. |
| **Skilaboð prufuleyfis** | Hve mörg af þeim 1.000 skilaboðum sem staðbundið prufuleyfi leyfir hafa verið notuð, til dæmis **37 / 1.000**. |
| **Prufumörkum náð** | Hvaða mörk bundu enda á staðbundna prufuleyfið: 1.000 skilaboð, 90 dagar, hvort tveggja, eða teljari prufuleyfis sem ekki er hægt að lesa. |

Tætigildi leigjandakennis, mánaðarleg notkun, óskráð skilaboð og síðasta samstilling notkunar eru falin.
Aðgerðirnar **Tengingastaða** og **Leyfisnotkun** á Uppsetningu Bifröst eru einnig faldar. **Samstilla**
er áfram tiltæk til að uppfæra leyfið.

### Staðbundið prufuleyfi {#the-local-trial}

**Prufuleyfi lýkur**, **Skilaboð prufuleyfis** og **Prufumörkum náð** birtast aðeins í þessum uppsetningum
og aðeins eftir að staðbundið prufuleyfi hefur hafist. Þeir eru faldir í SaaS-uppsetningu úr AppSource, á
áskrift og þegar ekkert prufuleyfi hefur hafist. **Prufumörkum náð** birtist aðeins þegar prufuleyfið er
runnið út.

- **Hvenær prufuleyfið rennur út.** Staðbundið prufuleyfi leyfir 1.000 skilaboð eða 90 daga, hvort sem
  gerist fyrr. Bæði mörkin eru sameiginleg öllum fyrirtækjum í umhverfinu, þannig að skilaboð í hvaða
  fyrirtæki sem er telja í sömu 1.000.
- **Hvað sést þegar mörkum er náð.** **Prufumörkum náð** segir **Skilaboðamörkum náð (1.000 skilaboð)**,
  **Tímamörkum náð (90 dagar)** eða **Báðum mörkum náð (1.000 skilaboð, 90 dagar)** og leyfisstaðan sýnir
  útrunnið. Ef ekki er hægt að lesa teljara prufuleyfisins sýna **Skilaboð prufuleyfis** og **Prufuleyfi
  lýkur** **Óþekkt** og **Prufumörkum náð** segir **Ekki er hægt að lesa teljara prufuleyfis**.
- **Hvað á að gera næst.** Skráðu þig hjá samstarfsaðila til að fá áskrift. Leyfisveiting byrjar á
  prufuleyfi og verður að áskrift þegar þú tengir samstarfsaðila. Sjá [Tegundir leyfa](/licensing/license-types/).

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
