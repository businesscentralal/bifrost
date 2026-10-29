---
id: bank-payment-batches
title: "Greiðslubunkar í banka"
---

**Greiðslubunkar í banka** sýnir hvern greiðslubunka sem Bifröst skráði í banka, innlendan og erlendan,
með stöðunni sem bankinn gaf síðast upp. Undir listanum sýnir **Greiðslur** greiðslur valins bunka og
**Kostnaður greiðslna** kostnaðinn sem bankinn gaf upp vegna þeirra. Síðan er fyrir fjármálasviðið sem
fylgir greiðslum eftir þar til þær eru greiddar.

Opnaðu hana með aðgerðinni **Greiðslubunkar í banka** í
[Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/). Síðan er aðeins til
lestrar: Bifröst skrifar hana þegar bunki er skráður, þegar niðurstaða hans er lesin í bankanum og þegar
yfirlit sýnir greiðslu. Nýjasti bunkinn er efst.

## Bunkar {#batches}

| Reitur | Lýsing |
| --- | --- |
| **Banki** | Bankinn sem bunkinn var skráður í. |
| **Tegund** | **Innlend** eða **Erlend**. |
| **Heiti bunka** | Heitið sem sent var til bankans. |
| **Sýnilegur öllum notendum** | Hvort heitið byrjar á `*`, svo allir notendur netbanka fyrirtækisins sjá bunkann, ekki aðeins vefþjónustunotandinn. |
| **Staða** | Staða bunkans í bankanum, til dæmis **Skráður**, **Bíður samþykktar**, **Í vinnslu**, **Lokið**, **Lokið með villum**, **Eytt** eða **Hafnað**. **Óstaðfest** er erlendur bunki sem er skráður en ekki enn staðfestur. **Óþekkt** er bunki sem bankinn leyfir Bifröst ekki lengur að lesa (innlendur bunki í Íslandsbanka eftir að hann var samþykktur); yfirlit úttektarreikningsins sýnir hvenær greiðslur hans eru greiddar. |
| **Fjöldi greiðslna**, **Heildarupphæð**, **Gjaldmiðill** | Fjöldi greiðslna og samtala þeirra. |
| **Úttektarreikningur** | Reikningurinn sem bunkinn er greiddur af. |
| **Framvirk greiðsludagsetning** | Dagurinn sem bankinn greiðir bunkann þegar hann hefur verið samþykktur. |
| **Auðkenni bunka í banka** | Auðkenni bunkans í bankanum. |
| **Skráður**, **Skráður af** | Hvenær og af hverjum bunkinn var skráður. |
| **Greiddur** | Hvenær síðasta greiðsla bunkans var staðfest greidd. |
| **Síðast athugaður** | Hvenær Bifröst las síðast niðurstöðu bunkans í bankanum. |
| **Bankareikningur** | Bankareikningurinn í Business Central sem hefur úttektarreikninginn sem númer bankareiknings. Auður ef enginn passar. |
| **Bókað**, **Fylgiskjalsnúmer**, **Bókunardagsetning** | Fyrir bókun í Business Central. Bifröst bókar ekki, svo þessir reitir eru auðir. |

## Greiðslur {#payments}

| Reitur | Lýsing |
| --- | --- |
| **Reikningur viðtakanda**, **Kennitala viðtakanda**, **Nafn viðtakanda** | Hverjum greiðslan fer til. |
| **Upphæð**, **Gjaldmiðill** | Upphæðin sem var skráð. |
| **Staða** | **Óframkvæmd**, **Greidd**, **Villa**, **Eytt** eða **Fjarlægð í banka**. |
| **Villutexti** | Hvers vegna bankinn hafnaði greiðslunni. |
| **Tilvísun**, **Skýring** | Tilvísun og texti greiðslunnar. |
| **Tegund greiðslu** | Millifærsla eða greiðsluseðill. |
| **Greidd upphæð**, **Gjaldmiðill greiðslu**, **Vaxtadagur**, **Gengi**, **Greidd upphæð (ISK)**, **Kostnaður (ISK)** | Það sem bankinn gefur upp sem greitt, einkum fyrir erlendar greiðslur. |
| **Uppruni greiðslu** | Hvernig Bifröst veit að greiðslan er greidd: **Reikningsyfirlit** (yfirlit úttektarreikningsins), **Niðurstaða banka** eða **Kvittun**. |
| **Greidd** | Hvenær greiðslan var staðfest greidd. |
| **Tegund uppruna**, **Upprunanúmer**, **Upprunaskjal**, **Upprunafærsla**, **Sniðmát upprunabókar**, **Keyrsla upprunabókar**, **Línunúmer upprunabókar** | Hvað greiðslan greiðir, þegar skráningin tilgreindi það: innkaupareikningur, lánardrottna- eða viðskiptamannafærsla, lánardrottinn, lína í greiðslubók, fjárhagsreikningur eða bankareikningur. |
| **Fylgiskjalsnúmer**, **Bókunardagsetning**, **Bókað**, **Bókað þann**, **Heiti færslubókarsniðmáts**, **Heiti færslubókarkeyrslu**, **Línunúmer færslubókar** | Fyrir bókun í Business Central. Bifröst bókar ekki, svo þessir reitir eru auðir. |

## Kostnaður greiðslna {#payment-charges}

**Kostnaður greiðslna** sýnir kostnaðinn sem bankinn gaf upp vegna greiðslna bunkans: **Tegund kostnaðar**
(til dæmis þóknun, skeytagjald eða erlendur kostnaður), **Upphæð** og **Gjaldmiðill**, **Upphæð (ISK)**
og **Greitt af** (greiðandi, viðtakandi eða skipt). **Bókað** og **Fylgiskjalsnúmer** eru fyrir bókun í
Business Central og eru auðir.

## Algeng verk {#common-tasks}

**Sjá hvort bunki er greiddur.** Veldu hann og skoðaðu reitinn **Staða** í greiðslum hans. Greiðsla er **Greidd**
þegar yfirlit úttektarreikningsins sýnir hana: lestu eða flyttu inn yfirlit þess reiknings.

**Finna bunka sem bíður samþykktar.** Síaðu reitinn **Staða** á **Bíður samþykktar**. Starfsmaður
samþykkir bunkann í netbanka bankans; ef hann finnst ekki þar skaltu athuga **Sýnilegur öllum notendum**.

**Spyrja um bunka.** Þegar forritið [Bifröst mállíkön](/language-models/) er sett upp svarar upplýsingareiturinn
**Spjalla með Bifröst** til hægri spurningum um valinn bunka.

## Gott að vita {#good-to-know}

- Bifröst skráir bunka og les stöðu þeirra. Bifröst hvorki samþykkir né greiðir bunka.
- Hver aðgerð á bunka er líka í [Ferilskrá bankaaðgerða](/help/iceland-treasury/bank-tracking-log/).
- Hvernig greiðslu er fylgt frá upphafi til enda: [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/).
