---
id: bank-claims
title: "Kröfur í banka"
---

**Kröfur í banka** sýnir hverja kröfu sem Bifröst stofnaði í banka eða hjá innheimtufyrirtæki, með stöðu hennar, greiddri upphæð og
bankareikningnum sem hún er greidd inn á. Undir listanum sýnir **Færslur** viðskiptamannafærslurnar sem
valin krafa innheimtir og **Greiðslur kröfu** greiðslurnar sem bankinn gaf upp vegna hennar. Síðan er
fyrir bókarann sem fylgir eftir því sem viðskiptamenn skulda.

Opnaðu hana með aðgerðinni **Kröfur í banka** í [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/).
Síðan er aðeins til lestrar: Bifröst skrifar hana þegar krafa er stofnuð, henni breytt eða hún felld
niður í bankanum, þegar krafan er lesin aftur og þegar greiðslur hennar eru skráðar.

## Kröfur {#claims}

| Reitur | Lýsing |
| --- | --- |
| **Banki** | Bankinn eða innheimtufyrirtækið (Gjaldskil, InKasso) sem krafan er hjá. |
| **Kröfureikningur** | Reikningur kröfunnar í bankanum: banki, höfuðbók og kröfunúmer. Hjá Gjaldskilum byrjar hann á `08`, hjá InKasso á `09`. |
| **Kröfudagur**, **Eindagi** | Kröfudagurinn og eindaginn. |
| **Viðskiptamannanúmer** | Viðskiptamaðurinn sem krafan innheimtir hjá. |
| **Upphæð**, **Greidd upphæð** | Upphæð kröfunnar og hversu mikið af henni skráðar greiðslur ná yfir. |
| **Staða** | **Send** (send í bunka sem bankinn hefur ekki svarað enn), **Staðfest**, **Hafnað**, **Greidd að hluta**, **Greidd**, **Felld niður** eða **Útrunnin**. |
| **Greiðslumátakóði** | Greiðslumátinn, og þar með innheimtusamningurinn, sem krafan var stofnuð með. |
| **Bankareikningur** | Bankareikningurinn í Business Central sem krafan er greidd inn á: mótreikningur greiðslumátans. |
| **Bókað** | Fyrir bókun í Business Central. Bifröst bókar ekki, svo reiturinn er auður. |
| **Kennitala kröfuhafa** | Kennitala kröfuhafans. |
| **Kröfunúmer**, **Auðkenni kröfu**, **Tilvísun**, **Reikningsnúmer**, **Auðkenni kröfu hjá banka** | Númer kröfunnar, kröfuauðkenni innheimtusamningsins, tilvísun og reikningsnúmer sem send voru til bankans, og auðkenni kröfunnar í bankanum. |
| **Villuskilaboð** | Hvers vegna bankinn hafnaði kröfunni. |
| **Pakkafærslunúmer** | Bunkinn sem krafan var send í, á síðunni [Kröfubunkar í banka](/help/iceland-treasury/bank-claim-batches/). |
| **Stofnað**, **Síðast breytt**, **Síðast athuguð** | Hvenær krafan var stofnuð, síðast breytt og síðast lesin í bankanum. |

## Færslur {#ledger-entries}

Viðskiptamannafærslurnar sem krafan innheimtir: **Viðskiptamannafærsla nr.**, **Viðskiptamannanúmer**,
**Tegund fylgiskjals**, **Fylgiskjalsnúmer**, **Bókunardagsetning**, **Eindagi**, **Upphæð**,
**Eftirstöðvar við stofnun**, og **Bakfært** þegar færslan var síðar bakfærð.

## Greiðslur kröfu {#claim-payments}

Greiðslurnar sem bankinn gaf upp vegna kröfunnar, með sömu reitum og síðan
[Greiðslur krafna í banka](/help/iceland-treasury/bank-claim-payments/).

## Algeng verk {#common-tasks}

**Sjá hvað er enn opið.** Síaðu reitinn **Staða** á **Staðfest** og **Greidd að hluta**. Mismunurinn á
**Upphæð** og **Greidd upphæð** er það sem bankinn hefur ekki gefið upp sem greitt.

**Finna kröfuna fyrir reikning.** Veldu kröfuna, eða opnaðu viðskiptamannafærslu reikningsins:
upplýsingareitur hennar sýnir kröfureikning, kröfudag og stöðu kröfunnar.

## Gott að vita {#good-to-know}

- Krafa verður **Greidd að hluta** eða **Greidd** aðeins út frá greiðslunum sem eru skráðar á hana, og
  **Útrunnin** þegar niðurfellingardagur bankans er liðinn.
- Niðurfelld krafa opnast aftur þegar bankinn gefur hana upp sem opna, til dæmis eftir að hún var
  endurvakin í netbankanum.
- Hver aðgerð á kröfu er líka í [Ferilskrá bankaaðgerða](/help/iceland-treasury/bank-tracking-log/).
- Þegar forritið [Bifröst mállíkön](/language-models/) er sett upp svarar upplýsingareiturinn **Spjalla
  með Bifröst** til hægri spurningum um valda kröfu.
