---
id: date-input-dialog
title: "Veldu upphafsdagsetningu"
---

**Veldu upphafsdagsetningu** opnast þegar þú flytur bankayfirlit inn í afstemmingu bankareiknings og
Bifröst getur ekki séð hvar yfirlitið á að byrja. Glugginn er fyrir bókarann sem afstemmir
bankareikninginn.

Það gerist í fyrsta sinn sem þú flytur inn yfirlit fyrir bankareikning: ekkert bókað yfirlit er enn til
að halda áfram frá. Eftir það hefst innflutningurinn daginn eftir síðasta bókaða yfirlit og þessi gluggi
opnast ekki.

## Reitur {#field}

| Reitur | Lýsing |
| --- | --- |
| **Upphafsdagsetning** | Fyrsti dagurinn sem færslur eru sóttar frá. Yfirlitið nær frá þessum degi til yfirlitsdags afstemmingarinnar, og aldrei lengra en til gærdagsins. |

## Val á dagsetningu {#choosing-a-date}

Veldu daginn eftir síðustu færsluna sem þú hefur þegar afstemmt í Business Central.

- Of snemma, og færslur sem þegar eru í Business Central eru fluttar inn aftur sem óparaðar línur.
- Of seint, og færslur vantar; opnunarstaðan stemmir þá ekki við bankann og
  [samantekt innfærslu yfirlits](/help/iceland-treasury/statement-import-summary/) varar þig við.

Þegar innflutningurinn keyrir í bakgrunni, til dæmis úr tímasettri keyrslu, getur hann ekki spurt: hann
byrjar einu ári fyrir yfirlitsdaginn.
