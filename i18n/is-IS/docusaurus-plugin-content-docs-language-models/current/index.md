---
id: index
title: "Bifröst Language Models"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Gervigreindarspjall fyrir Business Central: mállíkön, sjö spjallveitur, MCP-verkfæraþjónn og stakar útfyllingar fyrir sjálfvirk ferli."
---

# Bifröst Language Models

**Spjallaðu við Business Central þar sem þú ert þegar að vinna.** Spjallgluggi situr við hliðina á
viðskiptamanninum, vörunni eða pöntuninni sem þú ert með opna, veit hvaða færsla það er og svarar
út frá lifandi gögnum með þínum eigin heimildum.

{/* OPEN-20 */}

*Viðbótarapp ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert

- **Spurt um færsluna sem er fyrir framan þig.** Á sölupöntun: *„Vantar eitthvað á lager fyrir
  þessa pöntun?“* Á viðskiptamanni: *„Taktu saman opnar færslur þessa viðskiptamanns.“* Spjallið
  veit þegar hvaða pöntun eða viðskiptamann þú átt við.
- **Fengið lifandi tölur.** Spjallið les Business Central í gegnum skilaboðategundir Bifrastar,
  svo svörin koma úr gögnunum þínum eins og þau eru á þeirri stundu.
- **Verið áfram í Business Central.** Spjallið er á 36 stöðluðum síðum: viðskiptamönnum,
  lánardrottnum, vörum, sölu- og innkaupaskjölum, færslum og innsendum skjölum. **Focus** opnar það
  á heilli síðu.
- **Valið veitu.** Copilot, OpenAI, Azure OpenAI, Anthropic, Google Gemini, xAI eða þitt eigið
  líkan. Copilot þarf engan API-lykil.
- **Notað líkan inni í sjálfvirku ferli.** Verkferill eða tímasett verk getur beðið líkan um eitt
  svar, til dæmis til að flokka eða taka saman skjal.

## Sæktu appið

Settu **Bifrost Language Models** upp við hlið Bifröst Foundation, af AppSource eða í gegnum
samstarfsaðila þinn. Það þarf Business Central 28.0 eða nýrra.

## Uppsetning

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Veldu veitu. Fyrir **Copilot** skaltu kveikja á því undir **Copilot & AI Capabilities**; fyrir aðra veitu skaltu hafa API-lykil hennar tilbúinn. | Kerfisstjóri Business Central |
| 2 | Á **Uppsetningu Bifrost** skaltu opna **Uppsetningu Bifrost Language Models** og keyra **Setup Wizard**, eða búa mállíkan til handvirkt og velja síðan **Import Defaults** fyrir hæfnitextann. Merktu eitt líkan sem **Default**. | Kerfisstjóri Business Central |
| 3 | Gefðu hverjum sem má spjalla heimildasafnið **`BIFROST Chat ori`**, við hlið `BIFROST LLM ori` (eða `BIFROST LLM Rd ori`). Spjall fylgir aldrei öðrum heimildasöfnum. | Kerfisstjóri Business Central |
| 4 | Opnaðu viðskiptamann, vöru eða sölupöntun: spjallið birtist hægra megin. | Hver notandi |

Leiðbeiningar skref fyrir skref eru í hjálpinni í appinu:
[Uppsetning Language Models](/help/language-models/language-models-setup/) og
[Bifrost Chat](/help/language-models/bifrost-chat/).

## Gott að vita

- **Það vinnur sem þú.** Spjallið getur aðeins lesið og breytt því sem þínar eigin heimildir í
  Business Central leyfa, og hvert kall er skráð á **Bifrost Messages**.
- **Engin spjallheimild, ekkert spjall.** Án `BIFROST Chat ori` eða nothæfs mállíkans birtist
  spjallglugginn alls ekki. Engin villuboð koma; athugaðu þessi tvö atriði fyrst.
- **API-lyklar** eru geymdir í Business Central, fyrir hvern notanda eða sem einn sameiginlegur
  lykill fyrir hvert líkan. Copilot keyrir á auðlindum sem Microsoft rekur og þarf engan lykil.
- **Samtölin þín fara til veitunnar sem þú velur**, samkvæmt samningi þínum við hana.
  Sjá [Hvert gögnin þín fara](/documentation/how-it-works/#where-your-data-goes).

## Tilvísun

Uppsettar skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með
MCP-verkfærunum `list_message_types` og `describe_message_type`, eða á síðunni **Bifrost Message
Types**.

- [Ný spjallveita](./extensibility)
- Heimildasöfn: `BIFROST LLM ori` eða `BIFROST LLM Rd ori` fyrir appið, `BIFROST Chat ori` fyrir
  spjall, `BIFROST ChatSvc ori` til að setja sameiginlegan lykil.
