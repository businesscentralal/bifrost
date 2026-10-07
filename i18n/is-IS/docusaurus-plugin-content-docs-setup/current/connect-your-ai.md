---
id: connect-your-ai
title: "Skref 3: Tengdu gervigreindaraðstoðarmanninn"
sidebar_label: "3. Tengdu aðstoðarmanninn"
sidebar_position: 4
description: "Samþykktu Bifröst MCP-þjóninn einu sinni fyrir fyrirtækið, og bættu Bifröst við Copilot, ChatGPT, Claude eða annan aðstoðarmann."
---

# Skref 3: Tengdu gervigreindaraðstoðarmanninn

**Hvern þarf:** Global Administrator eða Application Administrator í Microsoft Entra ID, einu sinni, eftir skref 2; síðan
kerfisstjóra Business Central. Notendur tengja eigin aðstoðarmenn eftir [skref 5](/setup/first-call/), þegar gögnin eru
uppsett.

Aðstoðarmenn tengjast Bifröst með **MCP**, staðlinum sem gervigreindaraðstoðarmenn nota til að ná í önnur kerfi. Bifröst
rekur MCP-þjón fyrir þetta; þú setur ekkert upp.

## Samþykktu einu sinni fyrir fyrirtækið {#consent-once-for-your-organisation}

Í skýinu gefur skref 5 í uppsetningarleiðsögninni þér:

- **slóð Bifröst MCP-þjónsins**, sem aðstoðarmenn tengjast;
- **samþykkistengilinn** (*Opna heimildasíðu*) fyrir fyrirtækjaforritið *Origo Bifrost*. Entra-kerfisstjóri opnar hann
  einu sinni, svo MCP-þjónninn geti skráð notendurna þína inn;
- **tengla á Bifröst-tenginguna** í verslunum aðstoðarmannanna. Þar til tengingin er birt í verslun opnar tengillinn
  opinbera vörulista verslunarinnar.

![Skref 5 í leiðsögninni: slóð MCP-þjónsins (falin á myndinni), heimildasíðan og verslanir tenginganna](/img/setup/wizard-5-mcp.png)

Ef skref 5 sýnir enga þjónsslóð eða samþykkistengil, eða slóð sem lítur ekki rétt út, hafðu samband við Business Central
samstarfsaðilann þinn.

Þarftu slóðina eða tenglana aftur síðar? Opnaðu uppsetningarleiðsögnina aftur af **Uppsetningu Bifröst** og farðu í skref
5; lokaðu henni með **X** ef þú vilt ekki ljúka henni aftur.

## Bættu Bifröst við aðstoðarmanninn {#add-bifröst-to-the-assistant}

Sömu skref gilda fyrir kerfisstjórann núna og fyrir hvern notanda síðar. Hver og einn skráir sig inn sem hann sjálfur,
svo aðstoðarmaðurinn vinnur með nákvæmlega heimildir þess notanda.

Flokkurinn **Tengingar** á Uppsetningu Bifröst opnar Bifröst-tenginguna í verslun hvers aðstoðarmanns.

![Flokkurinn Tengingar](/img/guides/is-is/menu-connectors.png)

### Microsoft Copilot {#microsoft-copilot}

Bættu Bifröst-tengingunni við úr verslun hennar. Á **Uppsetningu Bifröst** opnar aðgerðin **Microsoft Copilot** undir
*Tengingar* hana.

### ChatGPT {#chatgpt}

Bættu Bifröst-tengingunni við úr verslun hennar. Á **Uppsetningu Bifröst** opnar aðgerðin **OpenAI ChatGPT** undir
*Tengingar* hana.

### Claude {#claude}

Í Claude heitir tengingin **Bifröst Origo**. Skrefin eru þau sömu á vefnum og í Claude Desktop.

1. **Bættu tengingunni við.** Í Claude opnarðu **Customize** og síðan **Connectors** (í eldri útgáfum af Claude
   Desktop: **Settings › Connectors**) og velur **+ Add**. Þar til Bifröst er komið í tengingaskrá Claude velurðu
   **Add custom connector**: gefðu tengingunni nafn og límdu inn slóð MCP-þjónsins úr skrefi 5 í leiðsögninni.
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

5. **Spurðu fyrstu spurningarinnar**, eins og í [skrefi 5](/setup/first-call/).

### Aðrir aðstoðarmenn {#other-assistants}

Skrefin fylgja sama mynstri og fyrir Claude: bættu tengingunni við, skráðu þig inn, kveiktu á henni, leyfðu verkfæri
hennar, spurðu.

Aðstoðarmaður sem styður fjartengda MCP-þjóna getur líka tengst: bættu slóð Bifröst MCP-þjónsins við sem fjartengdum
MCP-þjóni eða sérsniðinni tengingu í stillingum hans, og skráðu þig inn með vinnureikningnum þínum.

## Segðu aðstoðarmanninum hvar hann á að vinna {#tell-the-assistant-where-to-work}

Í skýinu er **Biðja um Tengingu** á **Uppsetningu Bifröst**, í hlutanum *Umhverfi*, með leigjandanum, umhverfinu og
fyrirtækinu. Límdu hana inn í spjallið, svo aðstoðarmaðurinn viti hvar hann á að vinna. Hvert fyrirtæki hefur sína eigin;
til að skipta um fyrirtæki límirðu inn texta hins fyrirtækisins, eða biður aðstoðarmanninn að telja upp fyrirtækin þín
og skipta.

Tengirðu annað kerfi frekar en aðstoðarmann? Sjá [Leiðbeiningar fyrir forritara](/documentation/end-customers/developers/).

**Næst:** [Skref 4: Settu upp gögnin þín](/setup/data-setup/)
