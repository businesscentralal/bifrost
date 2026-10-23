---
id: statement-import-summary
title: "Innfærsla yfirlits — samantekt"
---

**Innfærsla yfirlits — samantekt** opnast þegar bankayfirlit hefur verið flutt inn í afstemmingu
bankareiknings. Hún sýnir hvað barst og hvernig stöðurnar ganga upp, svo bókarinn geti athugað
innflutninginn áður en línur eru paraðar.

Allt á henni er aðeins til lestrar. Að loka henni afturkallar ekki innflutninginn.

## Niðurstaða {#result}

| Reitur | Lýsing |
| --- | --- |
| **Bankareikningur** | Bankareikningurinn í Business Central sem yfirlitið var flutt inn á. |
| **Yfirlitsnúmer** | Yfirlitsnúmer afstemmingarinnar. |
| **Innfærðar línur** | Hversu margar afstemmingarlínur innflutningurinn stofnaði. |

## Aðvörun {#warning}

Aðvörun birtist þegar eitthvað stemmir ekki, oftast þegar opnunarstaðan sem reiknuð er út frá yfirlitinu
er önnur en staðan sem afstemmingin byrjar á. Það þýðir yfirleitt að innflutningurinn hófst á röngum
degi, eða að hluti tímabilsins var fluttur inn áður. Línurnar eru samt til staðar: athugaðu þær og
fluttu inn aftur fyrir rétt tímabil ef stöðurnar eru rangar.

## Stöður {#balances}

| Reitur | Lýsing |
| --- | --- |
| **Reiknuð opnunarstaða** | Opnunarstaðan reiknuð út frá yfirlitinu: staða fyrstu línu að frádreginni upphæð hennar. |
| **Reiknuð lokastaða** | Lokastaðan reiknuð út frá yfirlitinu: staða síðustu línu. |
| **Staða frá banka** | Lokastaðan sem bankinn gaf upp. |
| **Ráðstöfunarfé** | Fjárhæðin sem er til ráðstöfunar á reikningnum, eins og bankinn gaf hana upp. |
| **Yfirdráttur** | Yfirdráttarheimild reikningsins. |
| **Upphæð í bið** | Samtala færslna sem bíða bókunar á reikningnum. |

**Reiknuð lokastaða** og **Staða frá banka** ættu að stemma. **Ráðstöfunarfé** getur verið annað en
lokastaðan, því það tekur yfirdráttinn og upphæðir í bið með.

## Reikningur {#account}

Flokkurinn **Reikningur** endurtekur það sem bankinn sendi um reikninginn: reikningsnúmer, IBAN, mynt,
kennitölu eiganda, sérheiti reikningsins, stöðu hans og aðrar upplýsingar. Notaðu hann til að athuga að
yfirlitið sé fyrir reikninginn sem þú ætlaðir.

## Gott að vita {#good-to-know}

- Hvert innflutt yfirlit er líka borið saman við opnar greiðslur reikningsins. Greiðsla sem yfirlitið
  sýnir er merkt greidd í [Greiðslubunkar í banka](/help/iceland-treasury/bank-payment-batches/).
- Hvernig upphaf tímabilsins er valið: [Veldu upphafsdagsetningu](/help/iceland-treasury/date-input-dialog/).
