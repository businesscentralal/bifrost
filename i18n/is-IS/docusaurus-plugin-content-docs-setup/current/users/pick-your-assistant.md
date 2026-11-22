---
id: pick-your-assistant
slug: /pick-your-assistant
title: "Veldu aðstoðarmanninn"
sidebar_label: "1. Veldu aðstoðarmanninn"
sidebar_position: 1
description: "Fyrir hvern notanda: hvaða gervigreindaraðstoðarmenn virka með Bifröst, og hvað þú þarft áður en þú tengir einn."
---

# Veldu aðstoðarmanninn

*Fyrir hvern þann sem notar Bifröst, til dæmis í fjármálum eða sölu. Fyrirtækið þitt hefur þegar sett Bifröst upp í
Business Central ([Fyrir fyrirtækið](/setup/)); þetta er þinn hluti, og hann tekur um tíu mínútur.*

## Hvaða aðstoðarmaður {#which-assistant}

Bifröst virkar með gervigreindaraðstoðarmanninum sem þú notar þegar. Fyrirtækið ákveður yfirleitt hver það er:

| Aðstoðarmaður | Hvernig hann tengist |
|---|---|
| **Claude** (á vefnum eða [Claude Desktop](https://claude.ai/download)) | Tenging sem þú bætir við sjálf(ur); skref fyrir skref í [Tengdu aðstoðarmanninn](/setup/connect-your-ai/#claude) |
| **Microsoft 365 Copilot** | Tvær leiðir: sem viðbót (plugin) í Copilot Cowork ([hvernig](/setup/connect-your-ai/#copilot-user)), eða sem fulltrúi (agent) í Copilot Chat. Bifröst er fulltrúi (agent) í Microsoft 365 Copilot, í prófun: spurðu Origo hvort hann sé í boði fyrir fyrirtækið þitt. Kerfisstjórinn birtir hann einu sinni, svo bætir þú honum við í Copilot ([hvernig](/setup/connect-your-ai/#copilot-user)) |
| **ChatGPT** | Ekki enn í verslun hans; þangað til sem fjartengdur MCP-þjónn þar sem ChatGPT hjá þér leyfir það ([hvernig](/setup/connect-your-ai/#chatgpt)) |
| **Annar aðstoðarmaður** | Hver sá aðstoðarmaður sem styður fjartengda MCP-þjóna |

## Það sem þú þarft fyrst {#what-you-need-first}

- **Aðgang að aðstoðarmanninum**, og í vinnusvæði fyrirtækis, heimild til að bæta við tengingu. Sum fyrirtæki leyfa
  aðeins eiganda vinnusvæðisins að bæta við tengingum; spurðu kerfisstjórann.
- **Notandann þinn í Business Central**, með Bifröst-heimildunum sem kerfisstjórinn hefur gefið þér. Aðstoðarmaðurinn
  vinnur sem þú, með nákvæmlega þín réttindi.
- **Fyrir Claude, ChatGPT, Copilot Studio og aðra aðstoðarmenn: slóð MCP-þjónsins**. Þú límir hana inn þegar þú
  bætir tengingunni við:

  ```text title="Slóð MCP-þjónsins"
  bifrost.origo.is/mcp
  ```

  Fyrir fulltrúann í Copilot Chat þarftu hana ekki: fulltrúinn þekkir hana þegar.

Tvennt að vita: aðstoðarmaðurinn þarf sitt eigið leyfi frá sínum þjónustuaðila, eins og í dag; og það sem
aðstoðarmaðurinn les úr Business Central fer til þess þjónustuaðila, samkvæmt samningi fyrirtækisins við hann. Sjá
[Hvert gögnin þín fara](/documentation/how-it-works/#where-your-data-goes).

**Næst:** [Tengdu aðstoðarmanninn](/setup/connect-your-ai/)
