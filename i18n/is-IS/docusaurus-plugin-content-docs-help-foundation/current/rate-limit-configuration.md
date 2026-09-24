---
id: rate-limit-configuration
title: "Stilla álagsþak"
sidebar_label: "Stilla álagsþak"
sidebar_position: 44
---

Í svarglugganum **Stilla álagsþak** velur þú hve mörg API-köll á dag Bifröst MCP-þjónninn leyfir fyrir
leigjandann þinn. Hann opnast með aðgerðinni **Stilla álagsþak** á síðunni [Uppsetning Bifröst](/help/foundation/bifrost-setup/),
en hún birtist aðeins viðskiptavini Bifröst samstarfsaðila (áskriftarleyfi) í framleiðsluumhverfi.

| Reitur | Lýsing |
| --- | --- |
| **Núverandi þrep** | Þrepið sem er stillt fyrir leigjandann núna. |
| **Núverandi þak á dag** | Fjöldi API-kalla á dag sem það þrep leyfir. |
| **Nýtt þrep** | Þrepið sem á að nota: **Frítt** (1.000), **Silfur** (5.000), **Gull** (10.000), **Platína** (50.000) eða **Fyrirtæki** (100.000 köll á dag). |

Veldu **Í lagi** til að vista. Samstarfsaðilinn getur rukkað fyrir þrep ofan við Frítt - kannaðu verðið
hjá samstarfsaðilanum fyrst. Ef þú velur **Frítt** er sérsniðna þrepið fjarlægt.

Þrepið fer sjálfkrafa aftur í Frítt ef samstarfinu við samstarfsaðilann lýkur. Sandkassaumhverfi nota
alltaf þrepið Frítt. Sjá [Álagsþök](/foundation/licensing/rate-limits/).
