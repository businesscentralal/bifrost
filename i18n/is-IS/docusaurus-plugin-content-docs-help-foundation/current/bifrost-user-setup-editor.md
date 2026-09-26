---
id: bifrost-user-setup-editor
title: "Ritill notandauppsetningar"
sidebar_label: "Ritill notandauppsetningar"
sidebar_position: 27
---

Í **Ritli notandauppsetningar** stillir þú hvern notanda Bifröst: mánaðarlegan skilaboðakvóta,
hvernig uppruni setu er samþykktur, tengingu notandans við færslur í Business Central og eigin
kerfisleiðbeiningar.

## Mánaðarlegur kvóti {#monthly-quota}

| Reitur | Lýsing |
| --- | --- |
| **Mánaðarlegur skilaboðakvóti notanda** | Hámarksfjöldi gjaldskyldra skilaboða sem notandinn má nota í almanaksmánuði, á hvorri leyfistegundinni sem er. `0` þýðir engin takmörk. Þegar kvótanum er náð er köllum notandans hafnað til næsta mánaðar. Ekki framfylgt í sandkassa. Telur öll skilaboð notandans í mánuðinum, hver sem gjaldfærslutegund þeirra er - sjá [Hvernig mánaðarlegu kvótarnir eru taldir](/foundation/licensing/license-types/#how-monthly-quotas-are-counted). |
| **Gjaldfærslutegund** | Lesskráð. Sem hvað skilaboð þessa notanda eru gjaldfærð: **Notandi**, **Forritsskráning**, og í áskrift **Innri**, **Sýniumhverfi** eða **Þjónustuaðili**. Ákvörðuð þegar notandinn er settur upp og uppfærð með **Samstilla** á síðunni Uppsetning Bifröst og með daglegu notkunarsamstillingunni. Sjá [Gjaldfærslutegundir í áskrift](/foundation/licensing/license-types/#charge-types). |

## Uppruni setu {#session-source}

| Reitur | Lýsing |
| --- | --- |
| **Tegund samþykktar uppruna setu** | Hvort uppruni skilaboða er samþykktur sjálfvirkt eða krefst samþykktar fyrir þennan notanda. |

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

Eigin texti á markdown-sniði sem gefur mállíkaninu viðbótarleiðbeiningar í samtölum í Bifrost
Language Models (spjalli). Notaðu hann til að laga hegðun gervigreindarinnar að notandanum, bæta við
samhengi fyrirtækisins eða takmarka svör við tiltekin svið.

## Sjá einnig

-   [Forskoðun notandauppsetningar](/help/foundation/bifrost-user-setup-fact-box/) – Fljótlegt yfirlit
