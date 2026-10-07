---
id: connect-your-ai
slug: /connect-your-ai
title: "Tengdu aðstoðarmanninn"
sidebar_label: "2. Tengdu aðstoðarmanninn"
sidebar_position: 2
description: "Fyrir hvern notanda: bættu Bifröst við Claude, Copilot, ChatGPT eða annan aðstoðarmann, og skráðu þig inn sem þú sjálf(ur)."
---

# Tengdu aðstoðarmanninn

*Fyrir hvern notanda. Þú þarft slóð MCP-þjónsins frá kerfisstjóranum; sjá
[Veldu aðstoðarmanninn](/setup/pick-your-assistant/#what-you-need-first).*

Þú tengist einu sinni og skráir þig inn sem þú sjálf(ur), svo aðstoðarmaðurinn vinnur með nákvæmlega
þínar heimildir í Business Central.

## Claude {#claude}

Í Claude heitir tengingin **Bifröst Origo**. Skrefin eru þau sömu á vefnum og í
[Claude Desktop](https://claude.ai/download). Hjálp Claude lýsir þeim í
[Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
(á ensku).

1. **Bættu tengingunni við.** Í Claude opnarðu **Customize** og síðan **Connectors** (í eldri útgáfum af Claude
   Desktop: **Settings › Connectors**) og velur **+ Add**. Þar til Bifröst er komið í tengingaskrá Claude velurðu
   **Add custom connector**: gefðu tengingunni nafn og límdu inn slóð MCP-þjónsins sem þú fékkst hjá kerfisstjóranum.
   Láttu valkostina sem eru merktir *Detected* standa og veldu **Add**. Þeir þýða að hver og einn skráir sig inn
   sjálfur og að ekkert biðlarakenni eða leyndarmál þarf; finnist þeir ekki, athugaðu slóðina. Í Claude Team eða
   Enterprise bætir eigandi henni við einu sinni fyrir alla, og eigandinn gæti þurft að leyfa eigin tengingar fyrst.
   Þegar hún er komin á skrá opnar aðgerðin **Anthropic Claude** undir *Tengingar* á **Uppsetningu Bifröst** hana.
2. **Skráðu þig inn.** Veldu **Connect** og skráðu þig inn með aðganginum sem hefur aðgang að Business Central; sértu
   með fleiri en einn, veldu þann. Microsoft sýnir hvað tengingin biður um: hún vinnur í umboði þínu og kemst því
   aðeins í það sem þú kemst sjálf(ur) í. Veldu **Accept**. Láttu *Consent on behalf of your organization* eiga sig
   nema þú sért kerfisstjórinn sem veitir samþykki fyrir alla. Tengingin er komin á þegar **Disconnect** sést.

   ![Tengingalisti Claude, með Bifröst Origo tengt](/img/setup/claude-connector.png)

3. **Kveiktu á henni í spjalli.** Veldu **+**, síðan **Connectors**, og gættu þess að kveikt sé á Bifröst Origo.

   ![Kveikt á Bifröst Origo fyrir spjall](/img/setup/claude-connector-in-chat.png)

4. **Leyfðu verkfæri hennar.** Í fyrsta sinn sem Claude vill nota Bifröst-verkfæri spyr það. **Allow once** leyfir þér
   að skoða hvert kall; **Always allow** hættir að spyrja um það verkfæri. Byrjaðu á **Allow once** svo þú sjáir hvað
   er kallað á; í stillingum tengingarinnar geturðu síðar valið hvaða verkfæri spyrja alltaf.

   ![Claude spyr áður en það notar Bifröst-verkfæri í fyrsta sinn](/img/setup/claude-allow-tool.png)

5. **Spurðu fyrstu spurningarinnar**: sjá [Spurðu fyrstu spurningarinnar](/setup/first-question/).

## Microsoft Copilot {#microsoft-copilot}

Bifröst-tengingin er ekki enn komin í verslun Microsoft. Þangað til opnar aðgerðin **Microsoft Copilot** undir
*Tengingar* á **Uppsetningu Bifröst** opinberan vörulista verslunarinnar, án Bifröst.

Á meðan, ef Copilot hjá þér leyfir að bæta við fjartengdum MCP-þjóni eða sérsniðinni tengingu, bættu Bifröst við
þannig: sjá [Aðrir aðstoðarmenn](#other-assistants). Hvort það er hægt fer eftir Copilot hjá þér og stillingum
fyrirtækisins; spurðu kerfisstjórann.

## ChatGPT {#chatgpt}

Bifröst-tengingin er ekki enn komin í verslun OpenAI. Þangað til opnar aðgerðin **OpenAI ChatGPT** undir *Tengingar* á
**Uppsetningu Bifröst** opinberan vörulista verslunarinnar, án Bifröst.

Á meðan, ef ChatGPT-vinnusvæðið þitt leyfir að bæta við fjartengdum MCP-þjóni eða sérsniðinni tengingu, bættu Bifröst
við þannig: sjá [Aðrir aðstoðarmenn](#other-assistants). Hvort það er hægt fer eftir áskriftinni og stillingum
fyrirtækisins; spurðu kerfisstjórann.

## Aðrir aðstoðarmenn {#other-assistants}

Skrefin fylgja sama mynstri og fyrir Claude: bættu tengingunni við, skráðu þig inn, kveiktu á henni, leyfðu verkfæri
hennar, spurðu.

Aðstoðarmaður sem styður fjartengda MCP-þjóna getur líka tengst: bættu slóð Bifröst MCP-þjónsins við sem fjartengdum
MCP-þjóni eða sérsniðinni tengingu í stillingum hans, og skráðu þig inn með vinnureikningnum þínum. Hvar sú stilling
er kemur fram í hjálp aðstoðarmannsins sjálfs.

**Næst:** [Spurðu fyrstu spurningarinnar](/setup/first-question/)
