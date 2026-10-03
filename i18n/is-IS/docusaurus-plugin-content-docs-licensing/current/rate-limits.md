---
id: rate-limits
title: "Álagsþak"
sidebar_position: 3
description: "Hvað álagsþak Bifröst nær til, þrepin og hvernig viðskiptavinur hækkar það."
---

Þessi síða er fyrir stjórnendur sem tengja gervigreindarþjóna við Business Central í gegnum opinbera
Bifröst MCP-þjóninn. Hún útskýrir hvaða notkun ber álagsþak, hve hátt það er og hvernig hægt er að
hækka það eða komast hjá því.

## Hvað er takmarkað

Álagsþak gildir **aðeins um sandkassanotkun á opinbera Bifröst MCP-þjóninum**. Sjálfgefið er
sandkassanotkun hvers Microsoft Entra leigjanda þar takmörkuð við **1.000 skilaboð á 24 klukkustundum**
(þrepið **Frítt**).

Það sem er ekki takmarkað:

- **Framleiðsluumhverfi.** Notkun MCP-þjónsins í framleiðsluumhverfi ber aldrei álagsþak.
- **Bifröst sjálft.** Bifröst hefur engin skilaboðatakmörk. Álagsþakið eru takmörk opinbera
  MCP-þjónsins, ekki forritsins.
- **Staðbundinn MCP-þjónn.** Fyrir ótakmarkaða sandkassanotkun skaltu nota staðbundinn MCP-þjón.
  Uppsetningarleiðsögn Bifröst vísar á hann sem **origo-bc-mcp (staðbundinn MCP-þjónn)**; hann er gefinn
  út á [businesscentralal/origo-bc-mcp](https://github.com/businesscentralal/origo-bc-mcp).

Álagsþakið er aðskilið frá [skilaboðakvótum](./license-types.md#monthly-quotas): kvóti telur skilaboðin
sem leigjandi greiðir fyrir, en álagsþakið takmarkar aðeins sandkassaumferð um opinbera MCP-þjóninn.

## Þrep

| Þrep | Sandkassaskilaboð á 24 klukkustundum |
|---|---|
| **Frítt** (Free) | 1.000 |
| **Silfur** (Silver) | 5.000 |
| **Gull** (Gold) | 10.000 |
| **Platína** (Platinum) | 50.000 |
| **Fyrirtæki** (Enterprise) | 100.000 |

## Hver fær hvaða þrep

| Leigjandi | Sandkassanotkun á opinbera MCP-þjóninum | Notkun í framleiðsluumhverfi |
|---|---|---|
| Fyrirframgreitt | Alltaf **Frítt** (1.000 skilaboð á 24 klukkustundum). Ekki er hægt að breyta þrepinu. | Ekkert álagsþak |
| Áskrift (viðskiptavinur samstarfsaðila) | **Frítt** sjálfgefið. Viðskiptavinurinn getur valið hærra þrep; samstarfsaðilinn verðleggur þrep ofan við Frítt. | Ekkert álagsþak |

## Álagsþakið hækkað

Viðskiptavinur á áskriftarleyfi hækkar sandkassaþakið sitt með því að velja þrep með
**Stilla álagsþak** á síðunni Uppsetning Bifröst (sjá
[Stilla álagsþak](/help/foundation/rate-limit-configuration/)):

- Þrepið er valið **úr framleiðsluumhverfinu**. Því er hafnað í sandkassa, en það gildir um
  sandkassanotkun leigjandans.
- Aðeins er hægt að velja það á áskriftarleyfi, á meðan leigjandinn er tengdur samstarfsaðila.
- Athugaðu verðskrá álagsþaka hjá samstarfsaðilanum áður en þú velur þrep ofan við Frítt.
- Ef **Frítt** er valið er sérvalda þrepið fjarlægt.

Þegar sambandinu við samstarfsaðilann lýkur og leigjandinn fer aftur á fyrirframgreitt leyfi er
þrepið sjálfkrafa endurstillt á **Frítt**.

Ef þú þarft meiri sandkassaumferð án þreps skaltu nota staðbundinn MCP-þjón í stað þess opinbera.
