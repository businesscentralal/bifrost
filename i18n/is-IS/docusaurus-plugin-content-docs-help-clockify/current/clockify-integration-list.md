---
id: clockify-integration-list
title: "Clockify tengingar"
sidebar_label: "Tengingar"
sidebar_position: 3
---

Síðan **Clockify tengingar** sýnir tengslin milli Business Central færslna og Clockify-hluta — hvaða viðskiptavinur í Business Central er hvaða viðskiptavinur í Clockify, hvaða verkefni er hvaða Clockify-verkefni, hvaða vinnutegund er hvaða Clockify-merkimiði og svo framvegis. Tengingin les þessi tengsl þegar hún samstillir tímafærslur, svo hægt sé að rekja Clockify-færslu til rétta verksins, starfsmannsins og vinnutegundarinnar í Business Central.

Síðan er stjórnunarsýn og ekki hægt að breyta henni. Tengingar eru stofnaðar og viðhaldið af samþættingaraðilum gegnum Bifröst-skilaboðategundirnar `Data.Records.Get` og `Data.Records.Set`, ekki af þessari síðu. Hún er opnuð með aðgerðinni **Clockify tengingar** á [Uppsetningu Clockify](/help/clockify/clockify-setup/).

## Reitir

| Reitur | Lýsing |
| --- | --- |
| Færslunúmer | Færslunúmer tengingarinnar. |
| BC tafla | BC taflan sem tengda færslan tilheyrir. |
| BC lykill | Læsilegur lykill BC-færslunnar. |
| BC kerfiskenni | Kerfiskenni tengdu BC-færslunnar. Falið sjálfgefið; bættu því við með **Sérsníða** þegar nákvæmt auðkenni færslunnar skiptir máli. |
| Clockify tegund | Tegund Clockify-hlutarins sem færslan er tengd við. |
| Clockify heiti | Heiti tengda Clockify-hlutarins. |
| Clockify kenni | Kenni tengda Clockify-hlutarins. |
| Clockify vinnusvæði | Clockify vinnusvæðið sem hluturinn tilheyrir. Falið sjálfgefið. |
| Afturkallað | Hvort tengingin hafi verið rofin. |
| Afturkallað þann | Hvenær tengingin var afturkölluð. |

## Hvernig tengingar eru teknar úr notkun

Tengingu er aldrei eytt beint. Þegar hún er rofin er hún merkt **Afturkölluð** og stimpluð með **Afturkallað þann**, svo sagan um hvað var eitt sinn tengt hverju varðveitist. Varðveisluregla hreinsar afturkallaðar línur um mánuði síðar.

Þess vegna geta verið fleiri en ein lína fyrir sömu BC-færsluna í listanum: virka tengingin er sú sem er ekki afturkölluð.
