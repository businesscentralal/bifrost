---
id: bifrost-integration
title: "Bifröst samþætting"
sidebar_label: "Bifröst samþætting"
sidebar_position: 8
---

Síðan **Bifröst samþætting** er rekstrarleg atburðaskrá. Hún skráir upprunakerfi, Business Central töflu og tímastimpil fyrir hverja samþættingaraðgerð. Notaðu þessa síðu til að fylgjast með, fara yfir og stjórna samþættingaratburðum — til dæmis til að sjá hvaða ytra kerfi skrifaði í hvaða töflu á tilteknum tíma, eða til að merkja ranglega búnar færslur sem bakfærðar.

Opnaðu síðuna í gegnum **Bifröst uppsetning → Skilaboð → Bifröst samþætting**.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Uppruni** | Auðkennir ytra kerfið eða forritið sem ræsti atburðinn. Þetta er venjulega URI eða lýsandi auðkenni eins og `https://erp.example.com` eða `WMS`. Þennan reit þarf að fylla út — hann getur ekki verið auður. |
| **Töflukenni** | Kenni Business Central töflunnar sem þátt átti í samþættingaratburðinum. Til dæmis `18` fyrir Viðskiptamann eða `37` fyrir Sölulínu. |
| **Heiti töflu** | Reiknað heiti töflunnar, fundið upp sjálfkrafa út frá töflukenninu. Þessi reitur er skrifvarinn og er sýndur til hægðarauka þegar farið er yfir skrána. |
| **Dagsetning og tími** | Dagsetning og tími þegar samþættingaratburðurinn átti sér stað. Þennan reit þarf að fylla út og hann er hluti af einkvæmum auðkenni færslunnar ásamt **Uppruna** og **Töflukenninu**. |
| **Bakfært** | Merkir færsluna sem bakfærða. Notaðu þennan flögg til að gefa til kynna að samþættingaratburðurinn hafi verið skráður fyrir mistök eða hafi verið leiðréttur. Bakfærðar færslur eru áfram í skránni til endurskoðunarformála og eru ekki eytt sjálfkrafa. |

## Algengar aðgerðir

### Fara yfir samþættingarvirkni

Opnaðu síðuna til að sjá alla samþættingaratburði raðaða eftir aðallykli sínum (Uppruni, Töflukenni, Dagsetning og tími). Notaðu dálkinn **Heiti töflu** til að bera fljótt kennsl á hvaða Business Central tafla var sett af stað án þess að þurfa að fletta upp töflukennin handvirkt.

### Merkja færslur sem bakfærðar

Ef samþættingaratburður var skráður fyrir mistök skaltu velja færsluna og haka við reitinn **Bakfært**. Þetta merkir færsluna án þess að eyða henni og varðveitir þannig alla endurskoðunarslóð.

### Sía eftir uppruna eða töflu

Notaðu staðlaða Business Central síur til að þrengja listann. Til dæmis:

-   Sía á **Uppruna** til að sjá atburði frá ákveðnu ytra kerfi.
-   Sía á **Töflukennið** til að sjá atburði sem tengjast ákveðinni töflu (t.d. `18` fyrir viðskiptamenn).
-   Sía á **Dagsetningu og tíma** til að takmarka yfirlitið við ákveðið tímabil.
-   Sía á **Bakfært = Nei** til að útiloka bakfærðar færslur.

## API-aðgangur

Hægt er að lesa og skrifa samþættingarfærslur forritunarlega í gegnum skilaboðagerðir Bifröst:

-   **Data.Records.Get** — sæki samþættingarfærslur sem JSON
-   **Data.Records.Set** — settu inn eða uppfærðu samþættingarfærslur
-   **CSV.Records.Get** — flytu út alla skrána sem CSV-skrá fyrir Open Mirroring leiðslur

## Varðveislureglur

Hægt er að eyða gamlarri samþættingarfærslum sjálfkrafa með varðveisluregluramma Business Central. Farðu í **Stjórnun → Gagnastjórnun → Varðveislureglur** til að stilla hreinsunarskemalega fyrir töfluna _Bifröst samþætting_.

## Ábendingar

-   Aðallykillinn er **Uppruni + Töflukenni + Dagsetning og tími**. Hvert samsetning verður að vera einkvæm.
-   Dálkurinn **Heiti töflu** er reiknaður reitur — hann er auður þegar Töflukennið er 0 eða ósett.
-   Notaðu reitinn **Bakfært** til að halda virku skránni hreinu án þess að eyða sögulegum gögnum varanlega.
