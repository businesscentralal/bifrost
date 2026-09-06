---
id: clockify-workspace-lookup
title: "Clockify vinnusvæði"
sidebar_label: "Uppfletting vinnusvæða"
sidebar_position: 5
---

**Clockify vinnusvæði** er uppflettigluggi sem sýnir þau Clockify-vinnusvæði sem geymdi API lykill fyrirtækisins nær til. Hann opnast úr reitnum **Sjálfgefið vinnusvæði** á [Uppsetningu Clockify](/help/clockify/clockify-setup/); þegar lína er valin eru bæði auðkenni vinnusvæðisins og heiti þess skrifuð á uppsetningarspjaldið.

Listinn er sóttur frá Clockify í hvert sinn sem uppflettingin opnast, svo hann sýnir alltaf það sem lykillinn sér í raun. Hann er ekki geymdur í Business Central og honum verður ekki breytt.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| Heiti | Heiti Clockify vinnusvæðisins. |
| Kenni vinnusvæðis | Auðkenni Clockify vinnusvæðisins. Þetta er gildið sem Bifröst-beiðni sendir sem `workspaceId`. |

## Hvers vegna sjálfgefið vinnusvæði skiptir máli

Flestar Clockify-skilaboðategundir taka við `workspaceId` í beiðninni. Þegar beiðni sleppir því grípur tengingin til sjálfgefna vinnusvæðisins sem valið er hér. Skráning rauntíma vefkróka krefst líka sjálfgefins vinnusvæðis, því vefkrókur tilheyrir einu vinnusvæði.

## Ef listinn er tómur eða opnast ekki

- **Enginn lykill geymdur** — uppflettingin þarf API lykil fyrirtækisins. Skráðu hann fyrst með **Skrá API lykil fyrirtækis** á [Uppsetningu Clockify](/help/clockify/clockify-setup/).
- **Engin vinnusvæði tiltæk** — lykillinn er gildur en Clockify-notandinn sem hann tilheyrir er ekki meðlimur í neinu vinnusvæði. Bættu notandanum við vinnusvæði í Clockify, eða notaðu lykil frá notanda sem er það.
- **Ekki tókst að sækja vinnusvæðin** — Clockify svaraði með villu. Skilaboðin innihalda það sem Clockify sagði; hafnaður lykill og óaðgengileg þjónusta líta ólíkt út, svo lestu textann áður en þú skiptir um lykil.
