---
id: consent
slug: /consent
title: "Skref 3: Samþykktu einu sinni fyrir fyrirtækið"
sidebar_label: "3. Samþykktu einu sinni"
sidebar_position: 3
description: "Veittu Bifröst MCP-þjóninum samþykki einu sinni í Microsoft Entra ID, svo aðstoðarmenn geti skráð notendurna inn."
---

# Skref 3: Samþykktu einu sinni fyrir fyrirtækið

**Hvern þarf:** Global Administrator eða Application Administrator í Microsoft Entra ID, einu sinni fyrir
allt fyrirtækið, eftir skref 2.

Aðstoðarmenn tengjast Bifröst með **MCP**, staðlinum sem gervigreindaraðstoðarmenn nota til að ná í önnur kerfi. Bifröst
rekur MCP-þjón fyrir þetta; þú setur ekkert upp. Áður en nokkur getur skráð sig inn á hann veitir fyrirtækið samþykki
sitt einu sinni.

## Það sem uppsetningarleiðsögnin gefur þér {#what-you-get-from-the-setup-wizard}

Í skýinu gefur skref 5 í uppsetningarleiðsögninni þér:

- **slóð Bifröst MCP-þjónsins**, sem aðstoðarmenn tengjast. Notendurnir þurfa hana í
  [Tengdu aðstoðarmanninn](/setup/connect-your-ai/), svo hafðu hana við höndina;
- **samþykkistengilinn** (*Opna heimildasíðu*) fyrir fyrirtækjaforritið *Origo Bifrost*;
- **tengla á Bifröst-tenginguna** í verslunum aðstoðarmannanna. Þar til tengingin er birt í verslun opnar tengillinn
  opinbera vörulista verslunarinnar.

![Skref 5 í leiðsögninni: slóð MCP-þjónsins (falin á myndinni), heimildasíðan og verslanir tenginganna](/img/setup/wizard-5-mcp.png)

## Veittu samþykkið {#give-the-consent}

Entra-kerfisstjórinn opnar samþykkistengilinn einu sinni og samþykkir. Eftir það getur MCP-þjónninn skráð notendurna
inn. Hann vinnur í umboði hvers notanda og kemst því aðeins í það sem sá notandi kemst í í Business Central.

Þú getur lokið leiðsögninni fyrst og sent Entra-kerfisstjóranum tengilinn.

Ef skref 5 sýnir enga þjónsslóð eða samþykkistengil, eða slóð sem lítur ekki rétt út, hafðu samband við Business Central
samstarfsaðilann þinn.

## Finndu það aftur síðar {#find-it-again-later}

Opnaðu uppsetningarleiðsögnina aftur af **Uppsetningu Bifröst** (**Leyfi › Uppsetningarleiðsögn**) og farðu í skref 5;
lokaðu henni með **X** ef þú vilt ekki ljúka henni aftur. Flokkurinn **Tengingar** á Uppsetningu Bifröst opnar
Bifröst-tenginguna í verslun hvers aðstoðarmanns.

![Flokkurinn Tengingar](/img/guides/is-is/menu-connectors.png)

**Næst:** [Skref 4: Settu upp gögnin þín](/setup/data-setup/)
