---
id: playbook-card
title: "Bifröst keðja"
sidebar_label: "Bifröst keðja"
sidebar_position: 6
---

Spjaldið **Bifröst keðja** er þar sem runa af Bifröst skilaboðategundum er skilgreind: skrefin, skilyrðin sem stýra þeim og JSON-gagnahlaðið sem fyrsta skrefið fær. Spjaldið sýnir einnig niðurstöðu síðustu keyrslu, skref fyrir skref.

## Almennt

| Reitur | Lýsing |
| --- | --- |
| **Kóði** | Einstæður kóði keðjunnar. |
| **Lýsing** | Lýsing keðjunnar. |
| **Tímasett** | Gefur til kynna hvort keðjan hafi virka vinnsluraðarafærslu tengda við sig. |
| **Upphafsbeiðni JSON** | JSON-gagnahlaðið sem sent er í fyrsta skrefið þegar engin beiðni er gefin við keyrslu. Breytt beint í reitnum. |

## Skref

Hlutinn **Skref** geymir skilgreiningar skrefanna í keyrsluröð. Skref sem ítra yfir fylki eru inndregin og óvirk skref eru daufari. Dálkurinn _Síðasta keyrsla_ sýnir niðurstöðu hvers skrefs í síðustu keyrslu.

| Dálkur | Lýsing |
| --- | --- |
| **Skref nr.** | Raðnúmer skrefsins. |
| **Síðasta keyrsla** | Niðurstaða þessa skrefs í síðustu keyrslu: lokið, mistókst, sleppt eða ekki keyrt. |
| **Lýsing** | Hvað skrefið gerir. |
| **Skilaboðagerð** | Bifröst skilaboðagerðin sem skrefið keyrir. |
| **Slóð fylkis til ítrunar** | JSON-slóð að fylki sem skrefið ítrar yfir. Skildu eftir autt fyrir eitt kall. |
| **Upprunaskref ítrunar** | Hvaða fyrra skref inniheldur fylkið sem á að ítra yfir. |
| **Gerð skrefs** | **Aðgerð** – ósatt árangursskilyrði telst villa. **Athugun** – skilyrðið er einfaldlega svarið og fellir ekki keyrsluna. |
| **Slóðir í samantekt** | Slóðir í svari sem afritast í keyrsluskýrslu þessa skrefs. Hafðu listann stuttan – hann fer í skýrsluna, ekki í síðari skref. |
| **Halda utan við stöðu keyrslu** | Heldur skrefinu utan við stöðu keyrslu og skýrslu. Notist fyrir skýrsluskrefin sjálf. |
| **Næsta skref (árangur)** | Skrefið sem haldið er áfram í þegar skilyrðið stenst. `0` lýkur keðjunni. |
| **Næsta skref (villa)** | Skrefið sem haldið er áfram í þegar skilyrðið bregst. `0` lýkur keðjunni. |
| **Stöðva við villu í hlut** | Stöðvar keðjuna þegar einn hlutur í ítrun bregst, í stað þess að halda áfram með hina hlutina. |
| **Óvirkt** | Keyrsluvélin sleppir skrefinu án þess að keyra það. |

## Skilyrði skrefa

Hlutinn **Skilyrði skrefa** sýnir skilyrði þess skrefs sem valið er að ofan. Öll skilyrði í sama hóp verða að vera sönn; nægilegt er að einn hópur sé sannur.

| Dálkur | Lýsing |
| --- | --- |
| **Skref nr.** | Skrefið sem skilyrðið tilheyrir. |
| **Gerð skilyrðis** | **Upphaf** stýrir hvort skrefið keyrir yfirhöfuð, **Árangur** velur leið og **Villa** merkir keyrsluna sem mistekna án þess að breyta leið. |
| **Hópur nr.** | Öll skilyrði í sama hópi verða að vera sönn; nægilegt er að einn hópur sé sannur. |
| **Slóð** | Slóð í vinnusvæði fyrir Upphaf og Villu, slóð í svari fyrir Árangur. |
| **Samanburðarvirki** | Hvernig gildið á slóðinni er borið saman. |
| **Gildi** | Gildið sem borið er saman við. |
| **Lýsing** | Valfrjáls skýring á tilgangi skilyrðisins. |

## Upplýsingareitir

| Upplýsingareitur | Lýsing |
| --- | --- |
| **Sniðmát beiðni** | Beiðnisniðmát þess skrefs sem valið er í skrefahlutanum. |
| **Síðasta keyrsla** | Samantekt á síðustu keyrslu þessarar keðju. |

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Keyra núna** | Keyrir keðjuna strax í forgrunni með upphafsbeiðninni af spjaldinu. Þegar keyrslu lýkur eru staða, tímastimpill og keyrslutilvik uppfærð og skilaboð sýna niðurstöðuna. |
| **Tímasetja** | Opnar gluggann [Tímasetja keðju](/help/nornir/schedule-playbook/) og býr til vinnsluraðarafærslu sem keyrir keðjuna reglulega. Óvirkt þegar keðjan er þegar tímasett. |
| **Vinnsluraðarafærsla** | Opnar tengda [vinnsluraðarafærslu](/help/nornir/scheduled-entry-card/) svo hægt sé að stjórna áætluninni. Aðeins virkt þegar keðjan er tímasett. |
| **Keyrsluskrá** | Opnar [Keyrsluskrá keðju](/help/nornir/playbook-instances/) fyrir þessa keðju. |
