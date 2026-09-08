---
id: iceland-skilagrein
title: "Grunngögn skilagreinar"
sidebar_label: "Grunngögn skilagreinar"
sidebar_position: 3
---

Skilagreinarsíðurnar sýna grunngögn sem sótt eru úr vefþjónustu Skilagreinar — kóða lífeyrissjóða, stéttarfélaga og upplýsingar um innheimtuaðila. Þessi gögn eru grunnurinn að launaskilum. Síðurnar eru opnaðar af spjaldinu [Uppsetning Bifröst Ísland](/help/iceland/iceland-setup/).

## Tiltækar síður

| Síða | Hlutur | Lýsing |
| --- | --- | --- |
| Innheimtuaðilar | `Iceland Skg Collectors ori` | Innheimtuaðilar skráðir fyrir launafrádrátt. |
| Lífeyrissjóðir | `Iceland Skg Pension Funds ori` | Íslenskir lífeyrissjóðir með kóðum og nöfnum. |
| Stéttarfélög | `Iceland Skg Unions ori` | Íslensk stéttarfélög með kóðum. |
| Endurhæfingarsjóðir | `Iceland Skg Rehab Funds ori` | Endurhæfingarsjóðir. |
| Lífeyrisaukar | `Iceland Skg Pen Suppl ori` | Lífeyrisaukasjóðir. |

## Lykilorð innheimtuaðila

Hver innheimtuaðili auðkennir sig með eigin lykilorði fyrir vefþjónustu. Veldu innheimtuaðilann á síðunni **Innheimtuaðilar** og notaðu aðgerðina **Skrá lykilorð vefþjónustu**; gildið fer í leyndarmálageymslu Bifrastar-grunnsins undir kóðanum `SKG-COLLECTOR-<númer innheimtuaðila>-PASSWORD` og verður ekki lesið til baka. Ekkert lykilorð Skilagreinar er á spjaldinu [Uppsetning Bifröst Ísland](/help/iceland/iceland-setup/).

## Hvernig gögnin eru uppfærð

Kallaðu á skilaboðategundirnar hér að neðan gegnum Bifrastar-vefþjónustuna til að uppfæra staðbundnu afritin úr Skilagrein. Síðurnar sjálfar sýna aðeins það sem þegar hefur verið sótt.

| Skilaboðategund | Uppfærir |
| --- | --- |
| `Iceland.Collector.Get` | Innheimtuaðila |
| `Iceland.PensionFund.Get` | Lífeyrissjóði |
| `Iceland.Union.Get` | Stéttarfélög |
| `Iceland.RehabFund.Get` | Endurhæfingarsjóði |
| `Iceland.PensionSupplement.Get` | Lífeyrisauka |

## Skil

`Iceland.CollectorPayment.Send` sendir skilagrein til innheimtuaðila og `Iceland.CollectorExtraAmount.Confirm` staðfestir aukagreiðslu. Hvort tveggja krefst heimildasettsins **BIFROST Collect ori** og geymds lykilorðs fyrir viðkomandi innheimtuaðila.
