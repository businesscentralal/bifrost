---
id: vend-vat-gl-map
title: "VSK fjárhagsreikningsvörpun lánardrottins"
sidebar_label: "VSK fjárhagsreikningsvörpun"
sidebar_position: 4
---

Síðan **VSK fjárhagsreikningsvörpun lánardrottins** ræður á hvaða fjárhagsreikning lína úr skjali á innleið er bókuð, eftir lánardrottni og VSK-prósentu. Hún er notuð þegar móttekinn rafrænn reikningur er gerður að innkaupaskjali og línan ber enga aðra reikningsúthlutun.

Síðan er opnuð með aðgerðinni **VSK fjárhagsreikningsvörpun** á [uppsetningarsíðu Bifröst DocEx](/help/iceland-docex/docex-setup/).

## Reitir

| Reitur | Lýsing |
| --- | --- |
| Lánardrottinsnr. | Lánardrottinninn sem vörpunin á við um. |
| Fjárhagsreikningsnr. | Fjárhagsreikningurinn sem er notaður fyrir línur á innleið með útreiknaða VSK %. Reikningurinn verður að hafa **Alm. bókunartegund** = Innkaup, **Bein bókun** = Já og má ekki vera lokaður. |
| VSK % | Ekki breytanlegt. Reiknað út frá VSK viðsk.bókunarflokki lánardrottins og VSK vörubókunarflokki fjárhagsreikningsins. |
| Lýsing | Valfrjáls lýsing á vörpunarfærslunni. |

## Ábendingar

-   Þar sem VSK-prósentan er leidd út skal skrá eina línu fyrir hvern reikning frekar en fyrir hverja prósentu: það er val á öðrum fjárhagsreikningi sem breytir VSK-prósentunni.
-   Ef lánardrottinn sendir línur með fleiri en einni VSK-prósentu skal búa til eina vörpunarlínu fyrir hvern reikning sem ber eina af þeim prósentum.
