---
id: clockify-webhooks
title: "Clockify vefkrókar"
sidebar_label: "Vefkrókar"
sidebar_position: 4
---

Síðan **Clockify vefkrókar** sýnir vefkrókana sem tengingin hefur skráð í Clockify fyrir þetta fyrirtæki. Þeir gera samstillingu tímafærslna rauntíma: þegar einhver hefur, breytir eða eyðir færslu í Clockify kallar Clockify á móttakarann og móttakarinn áframsendir atburðinn í Business Central.

Síðan er einungis til lestrar. Vefkrókar eru stofnaðir og fjarlægðir með aðgerðunum **Skrá vefkróka** og **Fjarlægja vefkróka** á [Uppsetningu Clockify](/help/clockify/clockify-setup/), og listinn er opnaður með aðgerðinni **Skráðir vefkrókar** á sama spjaldi.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| Atburður | Clockify-atburðurinn sem vefkrókurinn bregst við. |
| Heiti vefkróks | Heitið sem tengingin gaf vefkróknum í Clockify. |
| Kenni vefkróks | Kennið sem Clockify úthlutaði vefkróknum. |
| Vinnusvæði | Clockify vinnusvæðið sem vefkrókurinn tilheyrir. |
| Slóð | Móttökuslóðin sem vefkrókurinn sendir á. |
| Skráð þann | Hvenær tengingin skráði vefkrókinn. |

## Atburðirnir þrír

Skráning býr til einn vefkrók fyrir hvern atburð:

| Clockify atburður | Hvað hann þýðir fyrir Business Central |
| --- | --- |
| `NEW_TIME_ENTRY` | Færsla var stofnuð. Hún er samstillt þegar henni er lokið — færsla í gangi hefur enga tímalengd til að bóka. |
| `TIME_ENTRY_UPDATED` | Færslu var breytt. Tengingin greinir að hún var þegar samstillt og bókar leiðréttingu í stað tvítekningar. |
| `TIME_ENTRY_DELETED` | Færsla var fjarlægð í Clockify. |

Móttökuslóðin ber markafyrirtækið, og tengingin bætir vinnusvæðinu aftan við hana við skráningu, svo móttakarinn geti séð frá hvaða vinnusvæði atburður kom.

## Undirritunarlyklar

Clockify býr til undirritunarlykil fyrir hvern vefkrók þegar hann er stofnaður. Móttakarinn notar lyklana til að staðfesta að kall hafi raunverulega komið frá Clockify. Þeir eru birtir einu sinni af **Skrá vefkróka**, og hægt er að sækja þá aftur með **Sýna undirritunarlykla** á [Uppsetningu Clockify](/help/clockify/clockify-setup/). Þeir eru ekki geymdir í Business Central og eru ekki sýndir á þessari síðu.
