---
id: rate-limits
title: "Álagsþak"
sidebar_position: 3
description: "Þrep álagsþaks í Bifröst, hver getur valið hærra þrep."
---

Álagsþak takmarkar hve mörg API-köll leigjandi getur gert á dag í gegnum Bifröst MCP-þjóninn. Það
er aðskilið frá skilaboðakvóta: kvótinn ræður því hvað leigjandi greiðir fyrir, en álagsþakið
verndar þjónustuna.

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
