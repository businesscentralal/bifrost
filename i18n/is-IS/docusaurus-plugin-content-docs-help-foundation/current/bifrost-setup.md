---
id: bifrost-setup
title: "Bifröst uppsetning"
sidebar_label: "Bifröst uppsetning"
sidebar_position: 22
---

Síðan **Bifröst uppsetning** er miðlæg uppsetningarsíða fyrir Bifröst viðbótina. Hér velur þú hvaða útfærsluaðferð er notuð fyrir hvern viðskiptaþátt, stillir vikmörk lánamarks í prósentum og velur sjálfgefið tungumál fyrir skilaboðavinnslu.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Tegund lánamarks viðskiptamanns** | Velur útfærslu sem notuð er þegar `Customer.CreditLimit.Get` skilaboðagerð er unnin. Sjálfgefna útfærslan notar staðlaða Business Central lánamarksútreikninga. Samstarfsaðilar geta bætt við öðrum útfærslum með því að stækka upptalninguna. |
| **Vikmörk lánamarks %** | Prósenta (0–100) sem bætir viðbótarbuffera ofan á lánamark viðskiptamanns. Til dæmis, með 10% vikmörkum og lánamarki upp á 10.000 ISK getur viðskiptamaðurinn notað allt að 11.000 ISK áður en hann er merktur sem búinn að fara yfir lánamarkið. Þetta hjálpar til við að draga úr handvirkri íhlutun í jaðartilvikum. |
| **Tegund birgðastöðu vöru** | Velur hvernig birgðastaða vöru er reiknuð fyrir `Item.Availability.Get` skilaboðagerð.
-   **Efnislegar birgðir** – skilar birgðamagni á lager úr birgðafærslum. Hratt og einfalt.
-   **Reiknað magn** – skilar áætlaðri birgðastöðu þar sem tekið er tillit til frátekningar, brúttóþarfa, áætlaðra og fyrirhugaðra móttöku.

 |
| **Tegund verðútreiknings vöru** | Velur hvernig vöruverð er sótt fyrir `Item.Price.Get` skilaboðagerð. Sjálfgefna útfærslan sækir virkar söluverðslistalínur, styður verðlista sem tengjast ákveðnum viðskiptamanni eða öllum viðskiptamönnum og inniheldur VSK-útreikninga. |
| **Sjálfgefinn tungumálakóði** | Tungumálið sem notað er við vinnslu skilaboða sem skila tungumálaháðum texta (yfirskriftir, lýsingar, reitaheiti). Ef skilaboð innihalda ekki `lcid` gildi er þetta tungumál notað sem vara. Ef reiturinn er auður er enska (1033) notuð. |
| **ChangeLog Write Guard** | Stýrir því hvaða reitir mega vera skrifaðir með `Data.Records.Set` skilaboðagerðinni, byggt á Breytingaskrárdekkingu.

-   **Open** (sjálfgefið) – allir reitir leyfðir; Breytingaskrá er ekki skoðuð.
-   **Blocked** – aðeins reitir sem eru tryggðir fyrir breytingaskráningu í Breytingaskráruppsetning eru leyfðir. Reitir án dekkunar er hafnað.
-   **Via force** – eins og Blocked, en kallari getur farið framhjá gæslunni með `"force": true` í beiðninni. Krefst `BIFROST Force ori` heimildasamstæðu. Án þeirrar heimildar er framhjágangan þögnulega nekeituð.

Gæslan er stækkanlegt með `ChangeLog Write Guard Type` enum (65308) og `ChangeLog Write Guard` viðmóti. |
| **Tegund útflutnings á heiti fyrirtækis** | Velur hvaða heiti fyrirtækis er skrifað í `$Company` dálkinn í `CSV.Records.Get` og `CSV.DeletedRecords.Get` útflutningum.

-   **Heiti fyrirtækis** (sjálfgefið) – notar tæknilegt `Company.Name`. Stöðugt þótt birtingarheitið sé endurnefnt; mælt með þegar móttökukerfi nota heitið sem auðkenni.
-   **Birtingarheiti fyrirtækis** – notar `Company."Display Name"`. Fellur til baka á `Company.Name` þegar birtingarheitið er autt. Mælt með þegar CSV-útflutningurinn er lesinn af fólki eða birtur í skýrslum.

Stækkanlegt með `Company Name Type ori` enum (65601) og `Company Name ori` viðmótinu — samstarfsaðilar geta bætt við fleiri útfærslum (t.d. þýddu lögheiti). |
| **Sjálfgefin sviðsmynd tölvupósts** | Sjálfgefið `Email Scenario` sem er notað til að finna sendiaðgang þegar beiðnin tilgreinir ekki sviðsmynd sérstaklega. |

## Leiðsöguaðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Bifröst skilaboð** | Opnar lista yfir öll Bifröst skilaboð í biðröðinni. |
| **Bifröst samþætting** | Opnar [samþættigarskrána](/help/foundation/bifrost-integration/), þar sem þú getur farið yfir samþættigaratburði eftir uppruna, töflu og tímastimpli og merkt færslur sem bakfærðar. |
| **Bifröst geymsla** | Opnar [geymsluna](/help/foundation/bifrost-storage/), þar sem þú getur skoðað, flutt inn og flutt út geymt tvíundarefni sem tengist Bifröst. |
| **Svæðisaðgangur** | Opnar síðuna [Bifröst svæðisaðgangar](/help/foundation/bifrost-field-accesses/), þar sem hægt er að skilgreina aðgangstakmörkunar á reit-stigi fyrir notendur og Entra ID forrit. |
| **Tungumál** | Opnar Windows tungumálasíðuna svo þú getir skoðað tiltæka tungumálakóða. |
| **Bifröst þýðingar** | Opnar þýðingarlistann til að stjórna uppruna-/marktextapörum sem ytri kerfi nota. |
| **Varðveislureglur** | Opnar uppsetningu varðveislureglna svo þú getir stillt sjálfvirka hreinsun á gömlum Bifröst skilaboðum og samþættigarfærslum. |

## Ábendingar

-   Uppsetningarfærslan er búin til sjálfkrafa þegar þú opnar síðuna í fyrsta skipti.
-   Breyting á **Sjálfgefnum tungumálakóða** tekur gildi strax fyrir alla síðari skilaboðavinnslu – enginn endurræsing er nauðsynleg.
-   Algengir tungumálakóðar: `ENU` (enska), `ISL` (íslenska), `DEU` (þýska), `FRA` (franska).
