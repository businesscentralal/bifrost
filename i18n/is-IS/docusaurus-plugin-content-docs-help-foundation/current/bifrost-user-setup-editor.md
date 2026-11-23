---
id: bifrost-user-setup-editor
title: "Ritill notandauppsetningar"
---

Í **Ritli notandauppsetningar** stillir þú hvern notanda Bifröst: hóp, gjaldfærslutegund,
hvernig uppruni setu er samþykktur, mánaðarlegan skilaboðakvóta, tengingu notandans við færslur í
Business Central og eigin kerfisleiðbeiningar.

## Almennt {#general}

| Reitur | Lýsing |
| --- | --- |
| **Notandi** | Notandinn sem þú breytir uppsetningu fyrir. |
| **Hópkóði** | Hópur þessa notanda eða forrits. Tómt gildi notar sjálfgefinn hóp. Aðeins notandi sem má breyta hópum getur breytt honum. |
| **Er með reitaaðgangsfærslu** | Lesskráð. Hvort notandinn hefur eigin línur í reitaaðgangi. Eigin línur koma í stað allra reitaaðgangsreglna hópsins. |
| **Virkur uppruni leiðbeininga** | Lesskráð. Hvort kerfisleiðbeiningarnar koma frá notandanum, hópi notandans eða sjálfgefna hópnum. |
| **Gjaldfærslutegund** | Lesskráð. Sem hvað skilaboð þessa notanda eru gjaldfærð: **Notandi**, **Forritsskráning**, **Innri**, **Sýniumhverfi** eða **Þjónustuaðili**. Ákvörðuð þegar notandinn er settur upp og uppfærð með **Samstilla** á síðunni Uppsetning Bifröst og með daglegu notkunarsamstillingunni. Notandi samstarfsaðila með framselda heimild er **Þjónustuaðili** á öllum leyfistegundum; annars eru aðeins **Notandi** og **Forritsskráning** notuð á prufuleyfi. Sjá [Gjaldfærslutegundir í áskrift](/licensing/license-types/#charge-types). |
| **Tegund samþykktar** | Hvort uppruni skilaboða er samþykktur sjálfvirkt eða krefst samþykktar fyrir þennan notanda. Þegar krafist er samþykktar þarf að samþykkja nýjan uppruna á síðunni [Samþykkja uppruna setu](/help/foundation/session-source-approval/) áður en skilaboð frá honum eru móttekin. |
| **Kóði mállíkans** | Sýndur þegar [Bifröst mállíkön](/language-models/) eru uppsett: mállíkanið sem þessi notandi spjallar við í [Spjalla með Bifröst](/help/language-models/bifrost-chat/). Þegar hann er auður er spjallið ekki í boði fyrir þennan notanda. |

## Mánaðarlegur kvóti {#monthly-quota}

| Reitur | Lýsing |
| --- | --- |
| **Mánaðarlegur skilaboðakvóti notanda** | Hámarksfjöldi gjaldskyldra skilaboða sem notandinn má nota í almanaksmánuði, á hvorri leyfistegundinni sem er. `0` þýðir engin takmörk. Þegar kvótanum er náð er köllum notandans hafnað til næsta mánaðar. Telur öll skilaboð notandans í mánuðinum, hver sem gjaldfærslutegund þeirra er - sjá [Hvernig mánaðarlegu kvótarnir eru taldir](/licensing/license-types/#how-monthly-quotas-are-counted). |

## Tengdar færslur {#linked-records}

Þessir reitir tengja notandann við færslur í Business Central svo kerfið þekki samhengi hans sjálfkrafa.

| Reitur | Lýsing |
| --- | --- |
| **Fjárhagsreikn.nr. (til/frá eiganda)** | Fjárhagsreikningurinn sem notaður er fyrir viðskipti til/frá eiganda. |
| **Starfsmannanr.** | Starfsmaðurinn sem er tengdur notandanum. |
| **Viðskiptavinarnr.** | Viðskiptavinurinn sem er tengdur notandanum. |
| **Lánardrottnsnr.** | Lánardrottinninn sem er tengdur notandanum. |
| **Forðanr.** | Forðinn sem er tengdur notandanum. |
| **Kóði sölumanns** | Sölumaðurinn/innkaupaaðilinn sem er tengdur notandanum. |
| **Tengiliðsnr.** | Tengiliðurinn sem er tengdur notandanum. |
| **Kóði birgðageymslu** | Sjálfgefin birgðageymsla notandans. |

## Kerfisleiðbeiningar {#system-prompt}

Eigin texti á markdown-sniði sem gefur gervigreindinni viðbótarleiðbeiningar í spjalli, þegar
forrit sem býður upp á spjall, svo sem [Bifröst mállíkön](/language-models/), hefur verið sett upp og stillt. Notaðu hann til að laga hegðun gervigreindarinnar að notandanum, bæta við
samhengi fyrirtækisins eða takmarka svör við tiltekin svið.

Upplýsingareiturinn [Forskoðun notandauppsetningar](/help/foundation/bifrost-user-setup-fact-box/) sýnir gjaldskyld skilaboð notandans í þessum og síðasta mánuði og heiti tengdu færslnanna.

## Sjá einnig

-   [Forskoðun notandauppsetningar](/help/foundation/bifrost-user-setup-fact-box/) – Fljótlegt yfirlit
-   [Samþykkja uppruna setu](/help/foundation/session-source-approval/) – Samþykkja uppruna skilaboða fyrir notandann þinn
-   [Mánaðarlegir kvótar](/licensing/license-types/#monthly-quotas) – Mánaðarlegur kvóti fyrirtækis og notanda
