---
id: index
title: "Bifröst mállíkön"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Spjallaðu við Business Central við hliðina á færslunni sem þú ert með opna, með mállíkaninu sem þú velur, og gefðu sjálfvirkum ferlum svar frá mállíkani þegar þeir þurfa."
---

# Bifröst mállíkön

**Spjallaðu við Business Central þar sem þú vinnur nú þegar.** Bifröst mállíkön (Bifrost Language
Models) setja spjall við hliðina á viðskiptamanninum, vörunni, skjalinu eða færslunum sem þú ert með
opin. Aðstoðarmaðurinn veit hvaða færslu þú ert að skoða, les lifandi gögn úr Business Central til að
svara og vinnur sem þú, innan þinna heimilda. Þú velur mállíkanið sem hann notar: Copilot, OpenAI,
Azure OpenAI, Anthropic, Google Gemini, xAI eða líkan sem þú hýsir sjálf(ur).

Þessi síða er fyrir þau sem ákveða að nota forritið og setja það upp. Bifröst mállíkön eru
viðbótarforrit ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).

## Hvað þú getur gert {#what-you-can-do}

- **Spurt um færsluna sem er fyrir framan þig.** Á sölupöntun: *„Vantar eitthvað á lager fyrir þessa
  pöntun?“* Á viðskiptamanni: *„Taktu saman opnar færslur þessa viðskiptamanns.“* Spjallið veit þegar
  hvaða pöntun eða viðskiptamann þú átt við.
- **Fengið svör úr gögnunum þínum.** Aðstoðarmaðurinn les Business Central í gegnum Bifröst meðan hann
  vinnur, svo svörin koma úr gögnunum þínum eins og þau eru á þeirri stundu. Ef svar inniheldur
  viðskiptatölur sem aðstoðarmaðurinn hefur ekki lesið í þeirri umferð biður Bifröst hann einu sinni að
  sannreyna þær í Business Central eða segja að hann geti það ekki.
- **Verið áfram í Business Central.** Spjallið, **Spjalla með Bifröst**, er í upplýsingareitasvæði
  viðskiptamanna-, lánardrottna- og vörusíðna, sölu- og innkaupaskjala og lista þeirra, færslusíðna og
  innkominna skjala. **Fókus** opnar það á heilli síðu.
- **Valið líkan fyrir hvern hóp.** Hvert mállíkan ber veitanda sinn, stillingar og hæfni: leiðbeiningar
  sem móta hvernig aðstoðarmaðurinn svarar. Söluteymi og fjármálateymi geta hvort um sig spjallað við
  líkan sem er sett upp fyrir þeirra vinnu.
- **Notað líkan inni í sjálfvirku ferli.** Tímasett verk eða verkferill getur beðið mállíkan um eitt
  svar, til dæmis til að flokka eða taka saman skjal.

## Svið {#capabilities}

| Lén | Svið |
|---|---|
| **LLM** | Eitt svar frá mállíkani fyrir sjálfvirkt ferli eða samþættingu, án samtals |

Í samtali notar aðstoðarmaðurinn svið allra uppsettra Bifröst-forrita: það sem hann getur lesið og gert
er það sem Foundation og hin forritin bjóða.

## Sæktu forritið {#get-it}

Settu **Bifrost Language Models** upp við hlið Bifröst Foundation, af AppSource eða í gegnum Business
Central samstarfsaðilann þinn. Það þarf Business Central 28.0 eða nýrra. Um verð: hafðu samband við
Business Central samstarfsaðilann þinn.

Þegar forritið er sett upp eða uppfært verður það veita spjalls Bifröst, nema annað forrit sjái þegar um
spjallið.

## Uppsetning {#set-it-up}

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Veldu veitu. Copilot þarf ekkert utan Business Central. Fyrir aðra veitu skaltu hafa API-lykil hennar tilbúinn, og fyrir Azure OpenAI eða eigið líkan slóð þess. | Kerfisstjóri Business Central |
| 2 | Keyrðu uppsetningarleiðsögn Bifröst (**Uppsetningarleiðsögn** á **Uppsetning Bifröst**) ef það hefur ekki verið gert síðan forritið var sett upp. Hún leyfir forritinu að ná í veiturnar um netið. | Kerfisstjóri Business Central |
| 3 | Á **Uppsetning Bifröst** skaltu velja **Uppsetning Bifröst mállíkana** í flokknum **Forrit** og síðan **Mállíkön**. Búðu til mállíkan með kóða, veitu og hæfni. Fyrir Copilot býr **Frumstilla Copilot sjálfgildi** á listanum til tilbúið líkan. | Kerfisstjóri Business Central |
| 4 | Skráðu API-lykilinn á spjaldi mállíkansins: sameiginlegan lykil fyrir allt fyrirtækið, eða persónulegan lykil sem hver notandi skráir. | Kerfisstjóri, eða hver notandi |
| 5 | Úthlutaðu heimildasamstæðunum (hér fyrir neðan) og veldu **Kóða mállíkans** sem hver og einn spjallar við í notandauppsetningu Bifröst. | Kerfisstjóri Business Central |
| 6 | Opnaðu viðskiptamann, vöru eða sölupöntun: **Spjalla með Bifröst** birtist í upplýsingareitasvæðinu. | Hver notandi |

Hjálp hverrar síðu segir nánar frá:
[Uppsetning Bifröst mállíkana](/help/language-models/language-models-setup/),
[Bifröst mállíkan](/help/language-models/bifrost-lang-model-card/) og
[Spjalla með Bifröst](/help/language-models/bifrost-chat/).

### Heimildasamstæður {#permission-sets}

| Samstæða | Fyrir |
|---|---|
| `BIFROST Chat ori` (úr Foundation) | Alla sem mega spjalla, og auðkennið sem sjálfvirkt ferli keyrir sem þegar það biður líkan um svar. Hún fylgir aldrei annarri samstæðu |
| `BIFROST LLM Rd ori` | Alla sem spjalla: lestur mállíkananna |
| `BIFROST LLM Chat ori` | Alla sem spjalla við OpenAI, Azure OpenAI, Anthropic, Google Gemini, xAI eða eigið líkan. Ekki þörf fyrir Copilot |
| `BIFROST LLM ori` | Kerfisstjórana sem búa til og breyta mállíkönum |
| `BIFROST ChatSvc ori` | Þau sem skrá eða hreinsa sameiginlegan API-lykil líkans |

Þau sem spjalla þurfa líka Bifröst-samstæðurnar sem þau nota Bifröst með; sjá
[Heimildasamstæður og hlið](/documentation/end-customers/permissions/).

## Gott að vita {#good-to-know}

- **Hann vinnur sem þú.** Aðstoðarmaðurinn getur aðeins lesið og breytt því sem þínar eigin heimildir í
  Business Central og varnir Bifröst leyfa. Hvert kall sem hann gerir fyrir þig eru Bifröst-skilaboð: þau
  eru skráð á **Bifröst skilaboð** og talin eins og öll önnur (sjá
  [Notkun og reikningsfærsla](/licensing/usage-and-billing/)).
- **Ekkert spjall fyrr en þrennt er til staðar:** heimildasamstæðan `BIFROST Chat ori`, mállíkan valið í
  notandauppsetningu Bifröst og líkan sem getur svarað (API-lykill, eða kveikt á Copilot). Fram að því
  birtist spjallið ekki og engin villuboð koma.
- **API-lyklar eru í leyndarmálageymslu Bifröst**, aldrei á síðu eða í töflu. Líkan hefur sameiginlegan
  lykil fyrir fyrirtækið og, ef vill, persónulegan lykil fyrir hvern notanda. Copilot keyrir á auðlindum
  sem Microsoft rekur og þarf engan lykil.
- **Slóð líkansins er varin.** Grunnslóð og slóðum mállíkans er aðeins hægt að breyta á spjaldi þess í
  Business Central, ekki af gervigreindarfulltrúa í gegnum Bifröst, svo fulltrúi getur ekki sent lykil
  eitthvert annað.
- **Samtölin þín fara til veitunnar sem þú velur**, samkvæmt samningi þínum við hana. Sjá
  [Hvert gögnin þín fara](/documentation/how-it-works/#where-your-data-goes).
- **Skilaboðategundir.** Aðgerðirnar sem þetta forrit bætir við eru taldar upp með öllum hinum af
  MCP-verkfærunum (`list_message_types`, `describe_message_type`) og á síðunni **Tiltækar
  skilaboðategundir**, og hver þeirra útskýrir sig sjálf í gegnum `Help.Implementation.Get`.
