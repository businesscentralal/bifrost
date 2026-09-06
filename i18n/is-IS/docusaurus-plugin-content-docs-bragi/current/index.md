---
id: index
title: "Bifröst Bragi"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Gervigreindarspjall í Business Central: mállíkön, sjö spjallveitendur, MCP-verkfæraþjónn og skilaboðategund fyrir einskotssvör."
---

Bifröst Bragi er spjalleining Bifrastar. Hún byggir á Bifröst Foundation og bætir samræðuaðstoð við Business Central: spjallreit á stöðluðum síðum, mállíkön sem geyma stillingar spjallveitanda, MCP-verkfæraþjón sem leyfir aðstoðinni að lesa og vinna með gögn í Business Central undir heimildum innskráðs notanda, og skilaboðategundina `LLM.Prompt.Complete` fyrir einskotssvör í keðjum og tímasettum verkum.

## Hvað hún gerir

- **Bifröst-spjall** — stýring og upplýsingareitur á 36 stöðluðum síðum, auk heilsíðuspjalls. Spjallið veit hvaða færslu þú ert að skoða.
- **Mállíkön** — færslur sem geyma stillingar spjallveitandans, líkansstillingarnar og hæfnitextann sem settur er inn í hvert gagnvirkt samtal.
- **Sjö spjallveitendur** — Copilot, OpenAI, Azure OpenAI, Custom LLM, Anthropic, xAI (Grok) og Google (Gemini).
- **MCP-verkfæraþjónn** — aðstoðin les og uppfærir gögn í Business Central með heimildum innskráðs notanda og getur því svarað með rauntímatölum.
- **`LLM.Prompt.Complete`** — einskotssvar án verkfæra, án ræsingar og án samtalsstöðu, hugsað sem almennt reikniskref fyrir keðjur og tímasett verk.
- **Skráainntak** — einskotssvar getur borið innfellda base64-skrá, eða tilvísun í viðhengi á innkomandi skjali eða skjalaviðhengi sem Bragi les og umbreytir, fyrir veitendur sem taka við skjölum og myndum.
- **Lyklar á notanda eða sameiginlegir** — hver notandi getur sett sinn eigin lykil úr spjallstýringunni, eða stjórnandi með sérstakt heimildasett fyrir þjónustulykla setur einn sameiginlegan lykil á mállíkanið. Copilot þarf engan lykil.
- **Lagskiptar heimildir** — hliðið sem leyfir notanda í raun að spjalla er sérstakt heimildasett sem er úthlutað sérstaklega ofan á les- eða fullaðgangssett Braga.

## Hvernig hún virkar

1. Úthlutaðu `BIFROST Bragi ori` (eða `BIFROST Bragi Rd ori`) ásamt `BIFROST Chat ori` til þeirra notenda sem mega spjalla.
2. Opnaðu **Bifröst uppsetningu**, veldu **Bifröst mállíkön**, búðu til mállíkan, veldu spjallveitanda, fylltu út líkansstillingarnar og skrifaðu hæfnitextann.
3. Settu inn API-lykil: persónulegan lykil úr spjallstýringunni, eða sameiginlegan lykil settan af notanda með `BIFROST ChatSvc ori`. Copilot notar í staðinn auðlindir í umsjón Microsoft og þarf að vera virkjaður í **Copilot & AI Capabilities**.
4. Merktu eitt mállíkan sem **Sjálfgefið**, eða tengdu tiltekið mállíkan við hvern notanda í ritli notandauppsetningar í reitnum **Language Model Code**.
5. Opnaðu viðskiptamann, vöru eða sölupappír og spurðu aðstoðina í upplýsingareitnum **Bifrost Chat**.

## Skilaboðategundir

| Skilaboðategund | Stefna | Tilgangur |
| --- | --- | --- |
| `LLM.Prompt.Complete` | Út | Einskotssvar frá mállíkani — sendu kerfiskvaðningu og notandakvaðningu, fáðu texta til baka. |

## Kröfur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrri.
- Bifröst Foundation 28.0.0.0, uppsett við hlið Braga.
- Uppsett mállíkan. Allir ytri veitendur þurfa API-lykil — persónulegan á hvern notanda eða einn sameiginlegan þjónustulykil. Copilot þarf engan lykil en verður að vera virkjaður í **Copilot & AI Capabilities**.
- HTTP-biðlarabeiðnir verða að vera leyfðar fyrir viðbótina þegar ytri veitandi er notaður.
- Heimildasettið `BIFROST Chat ori`, úthlutað á hvern notanda; það fylgir ekki með öðrum heimildasettum Braga.

## Hvert skal halda næst

- [Hjálp í kerfinu](/help/bragi/)
- [Uppflettirit skilaboðategunda](./reference/message-types/) — beiðni og svar fyrir hverja tegund, búið til beint úr forritinu
- [Skilaboðategundir spjalls](./message-types)
- [Að bæta spjallveitanda við Braga](./extensibility)
- [Byggja á Bifröst](/extensibility/)
