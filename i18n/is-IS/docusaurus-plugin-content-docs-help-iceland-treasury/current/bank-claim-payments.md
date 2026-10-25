---
id: bank-claim-payments
title: "Greiðslur krafna í banka"
---

**Greiðslur krafna í banka** sýnir hverja greiðslu kröfu sem banki eða innheimtufyrirtæki gaf upp, með kröfunni sem hún greiðir
og bankareikningnum sem féð barst inn á. Síðan er fyrir bókarann sem parar greiðslur viðskiptamanna.

Opnaðu hana með aðgerðinni **Greiðslur krafna í banka** í
[Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/). Sömu greiðslur birtast
fyrir eina kröfu undir **Greiðslur kröfu** á síðunni [Kröfur í banka](/help/iceland-treasury/bank-claims/). Síðan
er aðeins til lestrar: Bifröst skráir hverja greiðslu einu sinni, þegar greiðslur krafna eru lesnar í
bankanum.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Banki** | Bankinn eða innheimtufyrirtækið sem gaf greiðsluna upp. |
| **Bókunardagur** | Dagurinn sem bankinn bókaði greiðsluna. |
| **Kröfureikningur**, **Kröfudagur** | Krafan sem greiðslan er fyrir. |
| **Viðskiptamannanúmer** | Viðskiptamaður kröfunnar. |
| **Kennitala greiðanda** | Kennitala þess sem greiddi. |
| **Upphæð**, **Innlögð upphæð**, **Heildarupphæð** | Upphæðirnar sem bankinn gaf upp vegna greiðslunnar. |
| **Fjármagnstekjuskattur** | Fjármagnstekjuskattur sem bankinn gaf upp vegna greiðslunnar, ef einhver er. |
| **Greiðslutegund** | **Full greiðsla** eða **Hlutagreiðsla**, þegar bankinn segir til um það. |
| **Tilvísun** | Tilvísun greiðslunnar. |
| **Bankareikningur** | Bankareikningurinn í Business Central sem féð barst inn á, úr greiðslumáta kröfunnar. |
| **Bókað**, **Fylgiskjalsnúmer**, **Bókunardagsetning**, **Heiti færslubókarsniðmáts**, **Heiti færslubókarkeyrslu**, **Línunúmer færslubókar**, **Bókað þann** | Fyrir bókun í Business Central. Bifröst bókar ekki, svo þessir reitir eru auðir. |
| **Sótt** | Hvenær Bifröst skráði greiðsluna. |
| **Kröfufærslunúmer** | Krafan á síðunni [Kröfur í banka](/help/iceland-treasury/bank-claims/). Autt þegar greiðslan passar ekki við neina kröfu sem Bifröst stofnaði. |
| **Færslunúmer** | Númer greiðslunnar í rakningu Bifrastar. |

## Gott að vita {#good-to-know}

- Þegar sömu greiðslur eru lesnar aftur eru þær aldrei skráðar tvisvar.
- **Finna færslur** á fylgiskjali finnur líka greiðslur krafna með fylgiskjalsnúmeri þess og
  bókunardagsetningu.
- Þegar forritið [Bifröst mállíkön](/language-models/) er sett upp svarar upplýsingareiturinn **Spjalla
  með Bifröst** til hægri spurningum um valda greiðslu.
