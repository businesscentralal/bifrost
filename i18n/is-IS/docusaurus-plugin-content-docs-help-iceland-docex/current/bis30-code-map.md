---
id: bis30-code-map
title: "BIS30 kóðavörpun"
sidebar_label: "BIS30 kóðavörpun"
sidebar_position: 3
---

Síðan **BIS30 kóðavörpun** þýðir Peppol BIS 3.0 kóða sem berast í XML-skjali á innleið yfir í þá Business Central kóða sem notaðir eru í þessu fyrirtæki. Án vörpunarfærslu heldur skjal á innleið hráa Peppol-kóðanum, sem fellur yfirleitt á staðfestingu þegar skjalinu er breytt í innkaupaskjal.

Síðan er opnuð með aðgerðinni **BIS30 kóðavörpun** á [uppsetningarsíðu Bifröst DocEx](/help/iceland-docex/docex-setup/).

## Reitir

| Reitur | Lýsing |
| --- | --- |
| Tegund vörpunar | Tegund kóðans sem er varpað — mælieining, gjaldmiðill, VSK-flokkur og svo framvegis. |
| Upprunakóði | BIS30/Peppol kóðinn eins og hann birtist í XML-skjali á innleið. |
| Markkóði | Business Central kóðinn sem upprunakóðanum er þýtt yfir í. |
| Lýsing | Frjáls lýsing á vörpunarfærslunni. |
| Lokað | Lokar færslunni án þess að eyða henni. Lokaðri færslu er sleppt við umbreytingu. |

## Ábendingar

-   Hvern upprunakóða má aðeins varpa einu sinni fyrir hverja tegund vörpunar. Notið **Lokað** frekar en að eyða þegar vörpun á að hætta að gilda en sagan skiptir máli.
-   Peppol-uppflettilistarnir sjálfir eru aðgengilegir án auðkenna gegnum skilaboðategundirnar `DocumentExchange.BIS30.*` — notið þær til að fletta upp gildum upprunakóðum.
