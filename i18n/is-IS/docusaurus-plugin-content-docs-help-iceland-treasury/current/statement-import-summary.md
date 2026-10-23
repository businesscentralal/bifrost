---
id: statement-import-summary
title: "Innfærsla yfirlits — samantekt"
---

**Innfærsla yfirlits — samantekt** opnast þegar bankayfirlit hefur verið flutt inn í afstemmingu
bankareiknings. Hún sýnir hvað barst og hvernig stöðurnar ganga upp, svo bókarinn geti farið yfir
innflutninginn áður en línurnar eru paraðar.

Allt á henni er aðeins til lestrar. Innflutningurinn gengur ekki til baka þótt henni sé lokað.

## Niðurstaða {#result}

| Reitur | Lýsing |
| --- | --- |
| **Númer bankareiknings** | Bankareikningurinn í Business Central sem yfirlitið var flutt inn á. Hjá Arion banka heitir reiturinn **Bankareikningsnúmer**. |
| **Nr. yfirlits** | Yfirlitsnúmer afstemmingarinnar. |
| **Línur innfærðar** | Hversu margar afstemmingarlínur innflutningurinn stofnaði. |

## Aðvörun {#warning}

Aðvörun birtist þegar eitthvað stemmir ekki, oftast þegar opnunarstaðan sem reiknuð er út frá yfirlitinu
er önnur en staðan sem afstemmingin byrjar á. Það þýðir yfirleitt að innflutningurinn hófst á röngum
degi, eða að hluti tímabilsins hafi verið fluttur inn áður. Línurnar eru samt komnar inn: farðu yfir þær
og flyttu inn aftur fyrir rétt tímabil ef stöðurnar eru rangar.

## Stöður {#balances}

| Reitur | Lýsing |
| --- | --- |
| **Reiknuð opnunarstaða** | Opnunarstaðan reiknuð út frá yfirlitinu: staða fyrstu línu að frádreginni upphæð hennar. |
| **Reiknuð lokastaða** | Lokastaðan reiknuð út frá yfirlitinu: staða síðustu línu. |
| **Staða frá banka** | Lokastaðan sem bankinn gaf upp. |
| **Ráðstöfunarfé** | Upphæðin sem er til ráðstöfunar á reikningnum, eins og bankinn gaf hana upp. |
| **Yfirdráttur** | Yfirdráttarheimild reikningsins. |
| **Heild bíður færslu** | Samtala færslna sem bíða bókunar á reikningnum. |

**Reiknuð lokastaða** og **Staða frá banka** ættu að stemma. **Ráðstöfunarfé** getur verið annað en
lokastaðan, því þar eru yfirdrátturinn og upphæðir í bið teknar með.

## Reikningur {#account}

Flokkurinn **Reikningur** endurtekur það sem bankinn sendi um reikninginn: reikningsnúmer, IBAN, mynt,
kennitölu eiganda, sérheiti reikningsins, stöðu hans og aðrar upplýsingar. Notaðu hann til að ganga úr
skugga um að yfirlitið sé fyrir reikninginn sem þú ætlaðir.

## Gott að vita {#good-to-know}

- Hvert innflutt yfirlit er líka borið saman við opnar greiðslur reikningsins. Greiðsla sem yfirlitið
  sýnir er merkt greidd í [Greiðslubunkar í banka](/help/iceland-treasury/bank-payment-batches/).
- Hvernig upphaf tímabilsins er valið: [Veldu upphafsdagsetningu](/help/iceland-treasury/date-input-dialog/).
