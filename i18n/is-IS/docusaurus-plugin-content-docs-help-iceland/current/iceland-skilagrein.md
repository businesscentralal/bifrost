---
id: iceland-skilagrein
title: "Innheimtuaðilar skilagreinar"
sidebar_position: 2
---

**Innheimtuaðilar skilagreinar** sýnir innheimtuaðila sem taka við skilagreinum í gegnum skilagrein.is.
Síðan er fyrir bókara eða kerfisstjóra sem setur upp tenginguna við hvern innheimtuaðila sem fyrirtækið
sendir skilagreinar til.

Opnaðu hana með **Innheimtuaðilar** á [Uppsetning Bifröst Ísland](/help/iceland/iceland-setup/). Listinn
er lesinn frá skilagrein.is í hvert sinn sem síðan opnast og er ekki geymdur í Business Central; síðunni
er ekki hægt að breyta. Lífeyrissjóðir, stéttarfélög, endurhæfingarsjóðir og lífeyrisaukar hafa lista af
sama tagi: þeir sýna **Númer**, **Nafn**, **Kennitala**, **Númer innheimtuaðila**, **Staður**,
**Símanúmer** og **Tölvupóstur**, og hafa aðgerðina **Endurnýja**.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Númer** | Númer innheimtuaðilans. |
| **Nafn** | Nafn innheimtuaðilans. |
| **Kennitala** | Kennitala innheimtuaðilans. |
| **Vefþjónusta virk** | Hvort vefþjónusta innheimtuaðilans er virk. |
| **Vefþjónusta krefst auðkenningar** | Hvort vefþjónustan krefst lykilorðs. |
| **Lykilorð skráð** | Hvort lykilorð er geymt fyrir innheimtuaðilann í varinni geymslu Bifröst. |
| **Staður** | Staður innheimtuaðilans. |
| **Símanúmer** | Símanúmer innheimtuaðilans. |
| **Tölvupóstur** | Netfang innheimtuaðilans. |

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Endurnýja** | Hleður listann aftur frá skilagrein.is. |
| **Skrá lykilorð vefþjónustu** | Opnar faldan glugga og vistar lykilorð vefþjónustu valins innheimtuaðila. Gildið birtist aldrei aftur. |
| **Eyða lykilorði vefþjónustu** | Fjarlægir geymt lykilorð valins innheimtuaðila eftir að þú hefur staðfest. Í boði þegar lykilorð er geymt. |
| **Leyndarmál forrits** | Opnar [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/) síuð á þetta forrit, til að sjá hvaða innskráningarupplýsingar eru geymdar. |

## Algeng verk {#common-tasks}

**Tengja innheimtuaðila.** Finndu innheimtuaðilann, veldu **Skrá lykilorð vefþjónustu** og sláðu inn
lykilorðið sem innheimtuaðilinn gaf þér. Þá er kveikt á **Lykilorð skráð** fyrir hann.

**Skipta um lykilorð.** Veldu **Skrá lykilorð vefþjónustu** aftur; nýja gildið kemur í stað þess gamla.

## Gott að vita {#good-to-know}

- Sá sem sendir skilagrein þarf að hafa `BIFROST Collect ori`; sjá [Heimildir](/iceland/#permissions).
- Lykilorð er aldrei sent í beiðninni sjálfri. Forritið notar það sem er geymt hér og hafnar beiðni sem
  ber lykilorð.
- Yfirfarðu skilagreinina áður en þú sendir hana. Hún er þín skilagrein til innheimtuaðilans.
