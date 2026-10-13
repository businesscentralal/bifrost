---
id: chat
title: "Spjalla með Bifröst í Business Central"
sidebar_label: "Spjalla með Bifröst"
sidebar_position: 2
sidebar_custom_props:
  top: true
description: "Spjallaðu við gervigreindaraðstoðarmann við hliðina á færslunni sem þú ert með opna í Business Central: hvað þarf fyrst, hvernig þú spyrð, hvernig svörin eru sannreynd og hvað þú gerir þegar spjallið svarar ekki."
---

# Spjalla með Bifröst í Business Central

**Spurðu um viðskiptamanninn, vöruna eða skjalið sem er fyrir framan þig, á venjulegu máli, án þess að fara
úr Business Central.** Þessi síða er fyrir þau sem spjalla og kerfisstjórana sem setja spjallið upp. Að lestri
loknum getur þú komið spjallinu í gang fyrir notanda, spurt það gagnlegra spurninga og séð hvað fór úrskeiðis
þegar það svarar ekki.

Spjallið fylgir Bifröst mállíkönum. Hvað forritið er og hvernig það er sett upp kemur fram í
[yfirlitinu](/language-models/).

## Hvar spjallið er {#where-you-find-the-chat}

Spjallið er hlutinn **Spjalla með Bifröst** í upplýsingareitasvæðinu hægra megin á þessum síðum:

- viðskiptamenn og lánardrottnar: spjöldin og listarnir;
- vörur: vöruspjaldið og vörulistinn;
- sölu- og innkaupatilboð, -pantanir, -reikningar, -kreditreikningar og -vöruskilapantanir, og listar þeirra;
- færslusíðurnar: fjárhagsfærslur, viðskiptamannafærslur, sundurliðaðar viðskiptamannafærslur,
  lánardrottnafærslur, birgðafærslur, virðisfærslur, VSK-færslur og bankareikningsfærslur;
- innkomin skjöl, spjaldið og listinn;
- notandauppsetning Bifröst hjá þér, svo þú getir prófað spjallið um leið og þú hefur fengið mállíkan.

Titill hlutans er færslan sem þú ert á, til dæmis númer og heiti viðskiptamannsins. Þegar þú ferð í aðra færslu
fylgir spjallið þér og byrjar nýtt samtal um hana.

![Spjalla með Bifröst á viðskiptamannaspjaldi, með spurningu um stöðu viðskiptamannsins og svarinu](/img/language-models/is-is/chat-customer-card.png)

Í valmyndinni við titilinn eru tvær aðgerðir:

![Valmynd spjallsins með aðgerðunum Fókus og Notandauppsetning](/img/language-models/is-is/chat-actions.png)

- **Fókus** opnar spjallið á heilli síðu fyrir sömu færslu, með rými fyrir lengri svör og töflur. Lokaðu
  síðunni til að fara aftur í færsluna.
- **Notandauppsetning** opnar [notandauppsetningu Bifröst](/help/foundation/bifrost-user-setup-editor/) hjá þér.

![Spjallið opnað á heilli síðu með Fókus](/img/language-models/is-is/chat-focus.png)

## Áður en þú byrjar {#before-you-start}

Spjallið birtist aðeins þegar allt eftirfarandi er til staðar. Fram að því sést það ekki á síðunum hér fyrir
ofan.

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Settu upp mállíkan: kóða, veitu og hæfni, leiðbeiningarnar sem eru sendar með hverju spjalli. Sjá [Uppsetning Bifröst mállíkana](/help/language-models/language-models-setup/) og [Bifröst mállíkan](/help/language-models/bifrost-lang-model-card/). | Kerfisstjóri |
| 2 | Gefðu líkaninu leið til að svara. Fyrir OpenAI, Azure OpenAI, Anthropic, Google Gemini, xAI eða eigið líkan: API-lykil, annaðhvort sameiginlegan lykil fyrir fyrirtækið eða persónulegan lykil fyrir hvern notanda, skráðan á spjaldi líkansins. Fyrir Copilot: engan lykil, sjá hér fyrir neðan. | Kerfisstjóri, eða hver notandi fyrir persónulegan lykil |
| 3 | Úthlutaðu heimildasamstæðunum: `BIFROST Chat ori` og `BIFROST LLM Rd ori` öllum sem spjalla, og líka `BIFROST LLM Chat ori` þegar veita líkansins er ekki Copilot. | Kerfisstjóri |
| 4 | Veldu líkanið í **Kóði mállíkans** í notandauppsetningu Bifröst hjá hverjum og einum. | Kerfisstjóri, eða notandinn |

![Kóði mállíkans í notandauppsetningu Bifröst, með spjallið tilbúið við hliðina](/img/language-models/is-is/chat-user-setup.png)

Þegar þú hefur breytt **Kóða mállíkans** skaltu loka síðunni og opna hana aftur: spjallið les líkanið þegar
síðan opnast.

**Copilot** keyrir á auðlindum sem Microsoft rekur, svo það þarf hvorki API-lykil né `BIFROST LLM Chat ori`.
Það þarf Business Central á netinu, og kerfisstjóri þarf að kveikja á **Bifröst Copilot** á síðunni **Copilot
og eiginleikar fulltrúa**. **Frumstilla Copilot sjálfgildi** á listanum **Bifröst mállíkön** býr til tilbúið
Copilot-líkan.

Þau sem spjalla þurfa líka Bifröst-heimildasamstæðurnar fyrir gögnin sem þau vinna með. Aðstoðarmaðurinn getur
ekki gert meira en þau sjálf; sjá [Heimildasamstæður og hlið](/documentation/end-customers/permissions/).

## Spurðu spurningar {#ask-a-question}

Skrifaðu í reitinn neðst í spjallinu og veldu **Senda**, eða ýttu á Enter.

- **Færslan er samhengið.** Spjallið segir aðstoðarmanninum hvaða færslu þú ert á, svo *„Hver er staða þessa
  viðskiptamanns og hve mikið af henni er gjaldfallið?“* þarf ekkert viðskiptamannsnúmer.
- **Hann les lifandi gögn.** Aðstoðarmaðurinn notar aðgerðir Bifröst sem verkfæri: hann finnur færslur, telur
  þær og leggur saman og rekur skjal til færslna þess. Ein spurning getur tekið nokkur skref; spjallið sýnir að
  hann er að vinna þar til svarið kemur.
- **Hann vinnur sem þú.** Hver lestur og hver breyting er gerð með þínum eigin heimildum í Business Central og
  innan varna Bifröst, og hvert kall er skráð á **Bifröst skilaboð** eins og öll önnur köll í Bifröst.
- **Hann spyr áður en hann skrifar.** Áður en aðstoðarmaðurinn stofnar eða breytir færslu segir hann hvað hann
  ætlar að gera og bíður eftir staðfestingu frá þér.
- **Hann svarar á þínu tungumáli**, tungumáli Business Central-setunnar þinnar.
- **Hann getur munað.** Biddu hann að muna eitthvað og hann geymir það fyrir næstu samtöl. Hann les líka það sem
  hefur verið geymt fyrir allt fyrirtækið.

Góð spurning segir hvað þú vilt vita og um hvað: *„Hvaða reikningar þessa viðskiptamanns eru gjaldfallnir,
elstu fyrst?“*, *„Vantar eitthvað á lager fyrir þessa pöntun?“*, *„Taktu þessar færslur saman eftir
reikningum.“*

## Svör sem þú getur treyst {#answers-you-can-trust}

- **Tölur koma úr gögnum sem lesin voru í þessari umferð.** Aðstoðarmanninum er sagt að nefna aldrei
  viðskiptatölu sem hann hefur ekki lesið. Ef svar inniheldur samt tölur sem hann hefur ekki lesið úr Business
  Central í þessari umferð sendir Bifröst svarið einu sinni til baka og biður líkanið að sannreyna tölurnar með
  verkfæri eða segja að það geti það ekki.
- **Núverandi spurning er alltaf send.** Líkan getur aðeins tekið við ákveðnu magni í einu, samhengisglugga
  sínum, sem er stilltur í **Samhengistákn** á spjaldi mállíkansins. Í löngu samtali sleppir Bifröst elstu
  samskiptunum fyrst og styttir mjög stór gögn sem hafa verið lesin, svo samtalið komist fyrir. Núverandi
  spurning og það sem var lesið fyrir hana halda sér alltaf. Byrjaðu nýtt samtal fyrir nýtt verk: opnaðu
  síðuna aftur.
- **Samtalið er ekki vistað.** Þegar síðunni er lokað lýkur því, svo afritaðu það sem þú vilt halda í.

## Þegar eitthvað fer úrskeiðis {#when-something-goes-wrong}

| Það sem þú sérð | Hvað þú gerir |
|---|---|
| Spjallið birtist ekki á síðu | Eitt skrefanna í [Áður en þú byrjar](#before-you-start) vantar: heimildasamstæðu, **Kóða mállíkans** í notandauppsetningu þinni eða lykil fyrir líkanið. Opnaðu notandauppsetningu Bifröst: þar birtist spjallið alltaf. Það segist vera óvirkt þegar ekkert líkan er valið og biður um lykil þegar líkanið hefur engan. |
| *Spjalla með Bifröst er óvirkt. Úthlutaðu mállíkani með veitanda í Bifröst notandauppsetningu til að virkja spjall.* | Veldu **Kóða mállíkans** í notandauppsetningu Bifröst, lokaðu síðunni og opnaðu hana aftur. Ef kóði er þegar valinn skaltu spyrja kerfisstjórann hvort líkanið hafi veitu. |
| *Copilot er ekki virkjað fyrir Bifröst spjall. Biddu kerfisstjóra um að virkja það á síðunni Copilot og eiginleikar fulltrúa.* | Kerfisstjóri kveikir á **Bifröst Copilot** á síðunni **Copilot og eiginleikar fulltrúa**. Copilot er aðeins í boði í Business Central á netinu. |
| *LLM API skilaði stöðu 401* eða *403* | Veitan hafnaði API-lyklinum. Kerfisstjórinn skráir sameiginlega lykilinn aftur, eða þú skráir persónulega lykilinn þinn aftur, á spjaldi mállíkansins og velur svo **Prófa tengingu**. |
| *LLM API skilaði stöðu 429* | Hámark eða kvóti veitunnar fyrir lykilinn er uppurinn. Bíddu og reyndu aftur, eða hækkaðu hámarkið hjá veitunni. |
| *Náði ekki sambandi við LLM API* | Business Central náði ekki sambandi við veituna. Athugaðu **Grunnslóð** líkansins, og að veitan sé virk. |
| *HttpClient köll eru lokuð í þessu umhverfi* | Forritið má ekki kalla út á netið. Kerfisstjóri keyrir uppsetningarleiðsögnina á **Uppsetning Bifröst**, sem leyfir það. |
| Svörin passa ekki við vinnuna þína | Athugaðu hæfnina á spjaldi mállíkansins og kerfisleiðbeiningarnar í notandauppsetningu Bifröst hjá þér. Spurðu aðstoðarmanninn hvað hann las til að svara. |

![Í notandauppsetningu Bifröst segir spjallið að það sé óvirkt meðan ekkert mállíkan er valið](/img/language-models/is-is/chat-user-setup-disabled.png)

## Næstu skref {#next-steps}

- [Spjalla með Bifröst](/help/language-models/bifrost-chat/): hjálp spjallsins sjálfs
- [Bifröst mállíkan](/help/language-models/bifrost-lang-model-card/): veita, líkan, lykill, samhengistákn og hæfni
- [Notkun og reikningsfærsla](/licensing/usage-and-billing/): hvernig köll spjallsins eru talin
