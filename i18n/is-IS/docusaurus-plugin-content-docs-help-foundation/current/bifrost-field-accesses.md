---
id: bifrost-field-accesses
title: "Reitaaðgangur Bifröst"
---

Með reitaaðgangi ákveður kerfisstjóri, fyrir hvern notanda eða Microsoft Entra forrit, hvaða töflur og reiti Bifröst má
lesa og breyta fyrir hann. Hann gildir aðeins um það sem Bifröst les og skrifar; Business Central biðlarinn verður ekki
fyrir áhrifum. Þessi hjálp nær yfir þrjár síður: **Yfirlit reitaaðgangs Bifröst**, **Reitaaðgangar Bifröst** (línur eins
notanda) og **Næmi reita Bifröst**. Heildarmyndina, með dæmum, finnurðu í
[Stjórnaðu því hvað fulltrúar lesa og breyta](/documentation/end-customers/data-access/).

## Yfirlit reitaaðgangs Bifröst {#overview}

**Reitaaðgangur** á [Uppsetningu Bifröst](/help/foundation/bifrost-setup/) opnar þessa síðu: allar línur reitaaðgangs
allra notenda og forrita í fyrirtækinu, aðeins til lestrar. Hægt er að raða og sía eftir öllum dálkum.

| Reitur | Lýsing |
| --- | --- |
| **Notandanafn** / **Fullt nafn** | Notandinn eða forritið sem línan á við um. Fyrir forrit er **Fullt nafn** lýsing þess. |
| **Tegund uppruna** | **Notandi** eða **Microsoft Entra forrit**. |
| **Töflunúmer** / **Heiti töflu** | Taflan. **0** þýðir allar töflur. |
| **Reitur nr.** / **Heiti reits** | Reiturinn. **0** þýðir allir reitir töflunnar. |
| **Tegund takmarkana** | Sjá [Tegundir takmarkana](#restriction-types). |

| Aðgerð | Lýsing |
| --- | --- |
| **Breyta** | Opnar línur notandans á völdu línunni til að breyta þeim. Yfirlitið uppfærist þegar þú lokar. |
| **Nýtt fyrir notanda...** | Veldu notanda eða forrit og opnaðu línur þess til að bæta við nýjum. |

## Reitaaðgangar Bifröst {#lines-of-one-user}

Línur eins notanda eða forrits. **Notandanafn** efst sýnir hvers línurnar eru.

| Reitur | Lýsing |
| --- | --- |
| **Töflunúmer** / **Heiti töflu** | Taflan. **0** þýðir allar töflur. |
| **Reitur nr.** / **Heiti reits** | Reiturinn. **0** þýðir allir reitir töflunnar. |
| **Tegund takmarkana** | Sjá [Tegundir takmarkana](#restriction-types). |

| Aðgerð | Lýsing |
| --- | --- |
| **Beita ráðlögðu sniðmáti...** | Veldu einn eða fleiri notendur eða forrit. Bifröst bætir við **Lesa**-línum fyrir símanúmer, netföng, kennitölur og bankareikningsreiti viðskiptamanna, lánardrottna, tengiliða, söluskjala og bankareikninga. Línu sem er til er aldrei breytt, og notandi með línu fyrir heila töflu eða allar töflur er látinn í friði fyrir það svið. Óhætt að keyra aftur. |
| **Eyða öllu fyrir notanda** | Eyðir öllum línum notandans, að fenginni staðfestingu. |
| **Eyða öllu fyrir töflu** | Eyðir öllum línum fyrir töflu valinnar línu, að fenginni staðfestingu. |

## Tegundir takmarkana {#restriction-types}

| Tegund takmarkana | Lesa | Breyta | Breytingaskrárvernd |
| --- | --- | --- | --- |
| **Bæði** | Nei | Nei | - |
| **Lesa** | Nei | Já | Gildir |
| **Skrifa** | Já | Nei | - |
| **Engin** | Já | Já | Gildir |
| **Framhjá** | Já | Já | Sleppt fyrir þennan notanda |

- **Nákvæmasta línan ræður.** Lína fyrir reitinn gengur framar línu fyrir töfluna, sem gengur framar línu fyrir allar
  töflur. Aðeins sú eina lína er notuð, svo **Engin**-lína á töflu opnar hana aftur undir **Skrifa**-línu fyrir allar
  töflur.
- **Engin** opnar líka, fyrir þann notanda, reitina sem Bifröst felur eða lokar sjálfgefið (bankaupplýsingar,
  persónuupplýsingar starfsmanna og reiti sem **Virða næmi gagna** felur). **Framhjá** opnar sjálfgefið lokaða reiti
  fyrir breytingum. Hvorug opnar það sem Bifröst ver alltaf.
- Notandi með einhverja **Lesa**- eða **Bæði**-línu fær engin FlowField-gildi í gegnum Bifröst, því Bifröst getur ekki
  séð hvaða reiti FlowField les.
- Línur taka gildi strax fyrir næstu beiðni.

## Næmi reita Bifröst {#field-sensitivities}

**Næmi reita** á Uppsetningu Bifröst opnar eigin flokkun fyrirtækisins á reitum. Hver lína merkir reit **Viðkvæmt** eða
**Persónulegt**. Þegar **Virða næmi gagna** á Uppsetningu Bifröst er **Viðkvæmt** eru viðkvæmu reitirnir faldir fyrir
öllum notendum; með **Viðkvæmt + Persónulegt** eru persónulegu reitirnir líka faldir. Með **Slökkt** (sjálfgefið) er
ekkert falið. **Engin**-lína á Reitaaðgöngum Bifröst opnar falinn reit fyrir einn notanda.

| Reitur | Lýsing |
| --- | --- |
| **Töflunúmer** / **Heiti töflu** | Tafla reitsins. |
| **Reitur nr.** / **Heiti reits** | Reiturinn. |
| **Næmi** | **Viðkvæmt** eða **Persónulegt**. |

| Aðgerð | Lýsing |
| --- | --- |
| **Beita ráðlagðri flokkun** | Bætir við ráðlögðum viðkvæmum reitum starfsmanna, og síma, farsíma, netfangi og kennitölu viðskiptamanna, lánardrottna og tengiliða sem persónulegum. Reitur sem er þegar með línu heldur henni. |

Listanum er aðeins breytt á þessari síðu, aldrei í gegnum Bifröst sjálft.
