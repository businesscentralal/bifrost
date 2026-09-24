---
id: rate-limits
title: "Álagsþak"
sidebar_position: 3
description: "Þrep álagsþaks í Bifröst, hvar þeim er framfylgt og hver getur valið hærra þrep."
---

Álagsþak takmarkar hve mörg API-köll leigjandi getur gert á dag í gegnum Bifröst MCP-þjóninn. Það
er aðskilið frá skilaboðakvóta: kvótinn ræður því hvað leigjandi greiðir fyrir, en álagsþakið
verndar þjónustuna.

Álagsþakinu er **framfylgt af MCP-þjóninum**. Business Central geymir þrepið sem leigjandinn hefur
valið; um köll sem fara beint í Bifröst API í Business Central gildir eingöngu leyfiskvótinn.

## Þrep

| Þrep | API-köll á dag |
|---|---|
| **Frítt** (Free) | 1.000 |
| **Silfur** (Silver) | 5.000 |
| **Gull** (Gold) | 10.000 |
| **Platína** (Platinum) | 50.000 |
| **Fyrirtæki** (Enterprise) | 100.000 |

## Hver fær hvaða þrep

| Leigjandi | Þrep |
|---|---|
| Fyrirframgreitt | Alltaf **Frítt**. Ekki er hægt að breyta þrepinu. |
| Áskrift (viðskiptavinur samstarfsaðila), framleiðsluumhverfi | **Frítt** sjálfgefið. Viðskiptavinurinn getur valið hvaða þrep sem er; samstarfsaðilinn getur rukkað fyrir þrep ofan við Frítt. |
| Öll sandkassaumhverfi | Alltaf **Frítt**, jafnvel þótt framleiðsluleigjandinn hafi valið hærra þrep. |

## Þrep valið

Viðskiptavinur á áskriftarleyfi velur þrep með **Stilla álagsþak** á síðunni Uppsetning Bifröst
(aðeins í framleiðsluumhverfi - sjá [Stilla álagsþak](/help/foundation/rate-limit-configuration/)).
Kannaðu verðið hjá samstarfsaðilanum áður en þú velur þrep ofan við Frítt. Ef **Frítt** er valið
er sérvalda þrepið fjarlægt.

Aðeins er hægt að velja þrep á meðan leigjandinn er tengdur samstarfsaðila. Þegar sambandinu við
samstarfsaðilann lýkur og leigjandinn fer aftur á fyrirframgreitt leyfi er þrepið sjálfkrafa
endurstillt á **Frítt**.

## Hvað samstarfsaðilinn og söluaðilinn sjá

Samstarfsaðilar og söluaðilar sjá þrep hvers viðskiptavinar, köll hans á dag og hvort hann er
**yfir fría þrepinu** á [Umsjón viðskiptavina](/help/foundation/customer-management/), og samtölur
fyrir hvert þrep í skilaboðategundum reikningsfærslunnar - sjá
[Notkun og reikningsfærsla](./usage-and-billing.md).
