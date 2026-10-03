---
id: rate-limit-configuration
title: "Stilla álagsþak"
---

Í svarglugganum **Stilla álagsþak** velur þú þrep álagsþaks fyrir leigjandann þinn: hve mörg skilaboð á
24 klukkustundum **sandkassaumhverfin** þín mega senda um opinbera Bifröst MCP-þjóninn. Notkun í
framleiðsluumhverfi ber aldrei álagsþak og Bifröst sjálft hefur engin skilaboðatakmörk. Glugginn opnast
með aðgerðinni **Stilla álagsþak** á síðunni [Uppsetning Bifröst](/help/foundation/bifrost-setup/), en
hún birtist aðeins viðskiptavini Bifröst samstarfsaðila (áskriftarleyfi) í framleiðsluumhverfi. Þrepið er
valið í framleiðsluumhverfi og gildir um sandkassanotkun leigjandans.

| Reitur | Lýsing |
| --- | --- |
| **Núverandi þrep** | Þrepið sem er stillt fyrir leigjandann núna. |
| **Núverandi þak á dag** | Fjöldi sandkassaskilaboða á 24 klukkustundum sem það þrep leyfir. |
| **Nýtt þrep** | Þrepið sem á að nota: **Frítt** (1.000), **Silfur** (5.000), **Gull** (10.000), **Platína** (50.000) eða **Fyrirtæki** (100.000 skilaboð á 24 klukkustundum). |

Veldu **Í lagi** til að vista. Samstarfsaðilinn verðleggur þrep ofan við Frítt - athugaðu verðskrá
álagsþaka hjá samstarfsaðilanum fyrst. Ef þú velur **Frítt** er sérsniðna þrepið fjarlægt.

Þrepið fer sjálfkrafa aftur í Frítt ef samstarfinu við samstarfsaðilann lýkur. Fyrir ótakmarkaða
sandkassanotkun skaltu nota staðbundinn MCP-þjón í stað þess opinbera. Sjá [Álagsþak](/licensing/rate-limits/).
