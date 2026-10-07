---
id: consent
slug: /consent
title: "Skref 3: Samþykktu einu sinni fyrir fyrirtækið"
sidebar_label: "3. Samþykktu einu sinni"
sidebar_position: 3
description: "Veittu Bifröst MCP-þjóninum samþykki einu sinni í Microsoft Entra ID, svo aðstoðarmenn geti skráð notendurna inn: hvað það veitir, hvernig þú athugar það og hvernig þú afturkallar það."
---

# Skref 3: Samþykktu einu sinni fyrir fyrirtækið

**Hvern þarf:** Global Administrator eða Application Administrator í Microsoft Entra ID, einu sinni fyrir
allt fyrirtækið, eftir skref 2.

Aðstoðarmenn tengjast Bifröst með **MCP**, staðlinum sem gervigreindaraðstoðarmenn nota til að ná í önnur kerfi. Origo
rekur Bifröst MCP-þjóninn fyrir þetta; þú setur ekkert upp. Áður en nokkur getur skráð sig inn á hann veitir fyrirtækið
samþykki sitt einu sinni.

## Það sem uppsetningarleiðsögnin gefur þér {#what-you-get-from-the-setup-wizard}

Í skýinu gefur skref 5 í uppsetningarleiðsögninni þér:

- **slóð Bifröst MCP-þjónsins**, sem aðstoðarmenn tengjast. Notendurnir þurfa hana í
  [Tengdu aðstoðarmanninn](/setup/connect-your-ai/), svo hafðu hana við höndina;
- **samþykkistengilinn** (*Opna heimildasíðu*) fyrir fyrirtækjaforritið *Origo Bifrost*;
- **tengla á Bifröst-tenginguna** í verslunum aðstoðarmannanna. Þar til tengingin er birt í verslun opnar tengillinn
  opinbera vörulista verslunarinnar.

![Skref 5 í leiðsögninni: slóð MCP-þjónsins (falin á myndinni), heimildasíðan og verslanir tenginganna](/img/setup/wizard-5-mcp.png)

## Hvað samþykkið veitir {#what-the-consent-grants}

Samþykkið er stjórnandasamþykki fyrir allan leigjandann, fyrir eitt fyrirtækjaforrit, *Origo Bifrost*, í Microsoft
Entra ID fyrirtækisins.

- **Það leyfir Bifröst MCP-þjóninum að skrá notendurna inn** og kalla í Business Central í umboði hvers notanda. Hann
  hefur engan eigin aðgang: hvert kall keyrir sem innskráði notandinn, svo hann kemst aðeins í það sem sá notandi kemst
  í í Business Central.
- **Það veitir engum aðgang eitt og sér.** Notandi skráir sig enn inn sem hann sjálfur, og þarf enn notanda í Business
  Central með Bifröst-heimildunum úr [skrefi 2](/setup/business-central/#give-people-and-apps-permission).
- **Entra sýnir nákvæmar heimildir áður en þú samþykkir.** Farðu yfir þær á samþykkisskjánum. Hvað stjórnandasamþykki
  fyrir allan leigjandann þýðir:
  [Grant tenant-wide admin consent to an application](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/grant-admin-consent)
  (á ensku) hjá Microsoft.

MCP-þjónninn kemur beiðnum og svörum áfram. Hvað Origo geymir, og hvað ekki, er í [Persónuvernd](/licensing/privacy/).

## Veittu samþykkið {#give-the-consent}

Entra-kerfisstjórinn opnar samþykkistengilinn einu sinni, fer yfir heimildirnar og samþykkir. Eftir það getur
MCP-þjónninn skráð notendurna inn.

Þú getur lokið leiðsögninni fyrst og sent Entra-kerfisstjóranum tengilinn.

Ef skref 5 sýnir enga þjónsslóð eða samþykkistengil, eða slóð sem lítur ekki rétt út, hafðu samband við Business Central
samstarfsaðilann þinn.

## Athugaðu að það virkaði {#check-that-it-worked}

- Í [Microsoft Entra admin center](https://entra.microsoft.com) er *Origo Bifrost* á listanum **Enterprise
  applications**.
- Notandi sem [tengir aðstoðarmann](/setup/connect-your-ai/) getur skráð sig inn, og svarið við
  *„Hver er ég í Business Central?“* listar fyrirtækin hans. Ef engin fyrirtæki birtast vantar samþykkið.

## Afturkallaðu það {#withdraw-it}

Í Microsoft Entra admin center opnarðu **Enterprise applications**, velur *Origo Bifrost* og síðan **Properties**:

- stilltu **Enabled for users to sign-in?** á **No** til að stöðva allar innskráningar og halda uppsetningunni
  ([Disable user sign-in](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/disable-user-sign-in-portal),
  á ensku);
- eða veldu **Delete** til að fjarlægja forritið og samþykki þess
  ([Delete an enterprise application](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/delete-application-portal),
  á ensku).

Aðstoðarmenn ná þá ekki lengur í Business Central í gegnum Bifröst. Samþættingar sem kalla í Bifröst með eigin Entra
forriti verða ekki fyrir áhrifum.

## Á staðnum (on-premises) {#on-premises}

Hýsti MCP-þjónninn og þetta samþykki eru fyrir Business Central í skýinu. Á staðnum vísar uppsetningarleiðsögnin þér í
staðinn á staðbundna MCP-þjóninn, sem þú keyrir samhliða Business Central-uppsetningunni þinni. Tengdu aðstoðarmenn við hann.

## Finndu það aftur síðar {#find-it-again-later}

Opnaðu uppsetningarleiðsögnina aftur af **Uppsetningu Bifröst** (**Leyfi › Uppsetningarleiðsögn**) og farðu í skref 5;
lokaðu henni með **X** ef þú vilt ekki ljúka henni aftur. Flokkurinn **Tengingar** á Uppsetningu Bifröst opnar
Bifröst-tenginguna í verslun hvers aðstoðarmanns.

![Flokkurinn Tengingar](/img/guides/is-is/menu-connectors.png)

**Næst:** [Skref 4: Settu upp gögnin þín](/setup/data-setup/)
