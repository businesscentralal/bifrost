---
id: index
title: "Bifröst Ísland"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Íslenskar opinberar þjónustur og SMS-gáttir sem Bifrastar-skilaboðagerðir: Þjóðskrá gegnum Umsjá, Skatturinn, Seðlabanki, Skilagrein, island.is og Já Gagnatorg."
---

Bifröst Ísland bætir 75 íslenskum skilaboðagerðum við Bifröst Foundation. Ytra kerfi sendir beiðni á biðraðar-API-ið (`origo/bifrost/v1.0`), Business Central keyrir viðeigandi skilaboðagerð og niðurstaðan kemur til baka í gegnum svar-API-ið — sama mynstur og allar aðrar Bifrastar-skilaboðagerðir, nú með aðgangi að Þjóðskrá, Skattinum, Seðlabanka Íslands, Skilagrein, island.is, Já Gagnatorgi og íslensku SMS-gáttunum.

## Hvað það gerir

- **Þjóðskrá gegnum Umsjá** — heildarhleðsla og mánaðarlegar breytingar inn í staðbundið afrit, ásamt uppflettingum á einstaklingum, fyrirtækjum, heimilisföngum, tengslum, hlutverkum, hagsmunaaðilum, VSK-númerum og ÍSAT-flokkun.
- **Skil til Skattsins** — virðisaukaskattur, staðgreiðsla og fjármagnstekjuskattur: sækja tímabil, villuprófa, skila, leiðrétta, opna aftur og sækja PDF-kvittun.
- **Gögn Seðlabankans** — gengi, stýrivextir og vextir lánaviðskipta, IKON, REIBID/REIBOR, ávöxtunarkröfur lánstíma, dráttarvextir, vísitala neysluverðs, gengisvísitölur og SDDS-þjóðhagsgagnasafnið. Gengi má skrifa beint í gengistöflu Business Central.
- **Skilagrein** — innheimtuaðilar, lífeyrissjóðir, stéttarfélög, endurhæfingarsjóðir og lífeyrisaukar sem grunngögn, auk skilagreina og staðfestingar aukagreiðslna.
- **island.is** — staðfesting kennitölu, uppfletting ökutækis eftir númeri eða verksmiðjunúmeri, og tollskráin: flokkar, innsláttareiningar, vörpun landa á gjaldmiðla og útreikningur aðflutningsgjalda.
- **Já Gagnatorg** — frjáls textaleit í Símaskrá og uppflettingar í Þjóðskrá og Fyrirtækjaskrá.
- **SMS** — magnSMS Símans (REST eða SOAP) og Nova, með stöðu afhendingar.
- **Íslensk grunngögn** — almennir frídagar, póstnúmeraskrá Byggðastofnunar og ISO-listar yfir gjaldmiðla og tungumál.

Tvær skilaboðagerðir keyra alfarið innan Business Central án ytri þjónustu: `Finance.VATStatement.Preview` reiknar línur VSK-skýrslu eftir reitanúmerum, tilbúnar til vörpunar á RSK, og `Finance.VAT.CalcAndPostSettlement` keyrir uppgjör virðisaukaskatts.

## Hvernig það virkar

1. Settu upp Bifröst Foundation og því næst Bifröst Ísland. Leiðsagnarforritið **Uppsetning Bifröst Íslands** opnast við fyrstu uppsetningu.
2. Leyfðu útsendar HTTP-biðlarabeiðnir fyrir viðbótina — ekkert nær ytri þjónustu fyrr en það er virkt.
3. Skráðu aðgangsupplýsingar hverrar þjónustu, í **Ísland**-hópnum á uppsetningarsíðu Bifrastar eða í leiðsagnarforritinu. Lykilorð fara í Isolated Storage; þau eru aldrei skrifuð í töflu og eru hulin áður en nokkur beiðni ratar í beiðnaskrá Bifrastar.
4. Skráðu kennitölu fyrirtækisins í **Upplýsingar fyrirtækis → Kennitala**. Auðkenning gagnvart Skattinum les hana þaðan.
5. Kallendur senda Bifrastar-skilaboð sem nefna `Iceland.*`, `Ja.*` eða `Finance.VAT*` skilaboðagerð.

Hver tenging hefur **tegund biðlara** — raunþjónustu, prófunarþjónustu eða enga — svo fyrirtæki getur keyrt allt ferlið gegn prófunarendapunkti Skattsins áður en farið er í rekstur.

## Skilaboðagerðir

| Svið | Fjöldi | Skilaboðagerðir |
| --- | --- | --- |
| Skrá | 1 | `Help.Iceland.Get` |
| Umsjá — Þjóðskrá | 15 | `Iceland.NationalRegistry.Sync`, `Iceland.NationalRegistryCheck.Get`, `Iceland.DeltaMonthly.Sync`, `Iceland.Member.Get`, `Iceland.Search.Get`, `Iceland.SearchByName.Get`, `Iceland.SearchBySocialID.Get`, `Iceland.Address.Get`, `Iceland.AddressInfo.Get`, `Iceland.Relations.Get`, `Iceland.Roles.Get`, `Iceland.Parties.Get`, `Iceland.Stakeholders.Get`, `Iceland.VatNumber.Get`, `Iceland.Isat.Get` |
| Skatturinn — VSK | 9 | `Iceland.VAT.GetPeriodEntries`, `Iceland.VAT.Validate`, `Iceland.VAT.Submit`, `Iceland.VAT.Correct`, `Iceland.VAT.GetNumbers`, `Iceland.VAT.GetInfo`, `Iceland.VAT.GetRSKDeclaration`, `Iceland.VAT.Receipt`, `Iceland.VAT.DeleteInTest` |
| Skatturinn — staðgreiðsla | 6 | `Iceland.Payroll.GetPeriodPrereqs`, `Iceland.Payroll.GetAllPeriods`, `Iceland.Payroll.Validate`, `Iceland.Payroll.Send`, `Iceland.Payroll.Receipt`, `Iceland.Payroll.Reopen` |
| Skatturinn — fjármagnstekjuskattur | 8 | `Iceland.CapitalTax.Submit`, `Iceland.CapitalTax.GetStatus`, `Iceland.CapitalTax.GetOverview`, `Iceland.CapitalTax.GetTypes`, `Iceland.CapitalTax.GetPeriods`, `Iceland.CapitalTax.GetSubmittablePeriods`, `Iceland.CapitalTax.GetExemptions`, `Iceland.CapitalTax.Reopen` |
| VSK í Business Central | 2 | `Finance.VATStatement.Preview`, `Finance.VAT.CalcAndPostSettlement` |
| Seðlabanki Íslands | 11 | `Iceland.CurrencyRates.Get`, `Iceland.Currency.Sync`, `Iceland.InterestRates.Get`, `Iceland.IkonRates.Get`, `Iceland.InterbankRates.Get`, `Iceland.LoanTermRates.Get`, `Iceland.PenaltyInterest.Get`, `Iceland.ConsumerPriceIndex.Get`, `Iceland.ExchangeRateIndex.Get`, `Iceland.EconomicData.Get`, `Iceland.Language.Get` |
| Skilagrein | 7 | `Iceland.Collector.Get`, `Iceland.PensionFund.Get`, `Iceland.Union.Get`, `Iceland.RehabFund.Get`, `Iceland.PensionSupplement.Get`, `Iceland.CollectorPayment.Send`, `Iceland.CollectorExtraAmount.Confirm` |
| island.is | 6 | `Iceland.Kennitala.Validate`, `Iceland.Vehicle.Get`, `Iceland.Customs.Categories`, `Iceland.Customs.Calculate`, `Iceland.Customs.Units`, `Iceland.Customs.CountryCurrencies` |
| SMS | 2 | `Iceland.SMS.Send`, `Iceland.SMS.Status` |
| Grunngögn | 4 | `Iceland.Holidays.Get`, `Iceland.Holidays.IsHoliday`, `Iceland.PostCode.Get`, `Iceland.Currency.Get` |
| Já Gagnatorg | 4 | `Help.Ja.Get`, `Ja.Search.Query`, `Ja.Person.Get`, `Ja.Company.Get` |

## Heimildasett

`BIFROST ISFull ori` er heimildasettsviðbót: hún bætir öllum hlutum Íslandsforritsins við `BIFROST Full ori` í Bifröst Foundation, svo það er settið sem á að úthluta fyrir fullan aðgang. Hin settin verja eina þjónustu hvert og eru úthlutuð sérstaklega þegar kallandi á aðeins að ná í hluta forritsins.

| Heimildasett | Úthlutanlegt | Nær yfir |
| --- | --- | --- |
| `BIFROST ISFull ori` | Viðbót við `BIFROST Full ori` | Alla hluti Íslandsforritsins |
| `BIFROST Umsja ori` | Nei — fylgir `BIFROST ISFull ori` | Uppflettingar í Umsjá og afrit þjóðskrár |
| `BIFROST NatReg ori` | Já | Samstillingu þjóðskrár |
| `BIFROST VAT ori` | Já | Skil virðisaukaskatts |
| `BIFROST Payroll ori` | Já | Skil staðgreiðslu |
| `BIFROST CapTax ori` | Já | Skil fjármagnstekjuskatts |
| `BIFROST Collect ori` | Já | Skilagreinar til innheimtuaðila |
| `BIFROST SMS ori` | Já | SMS á íslensk númer |
| `BIFROST SMS Fgn ori` | Já | SMS á erlend númer |
| `BIFROST Ja ori` | Já | Leit og uppflettingar í Já Gagnatorgi |

## Kröfur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra, Essentials eða Premium.
- Bifröst Foundation, fáanlegt sérstaklega á AppSource.
- Útsendar HTTP-biðlarabeiðnir virkjaðar fyrir viðbótina.
- Aðgangsupplýsingar fyrir hverja þjónustu sem fyrirtækið notar: Umsjár-leyfi með notandanafni og lykilorði, lykilorð Skattsins fyrir VSK, staðgreiðslu og fjármagnstekjuskatt, lykilorð hvers innheimtuaðila í Skilagrein, SMS-reikning hjá Símanum eða Nova, og API-lykla Já Gagnatorgs fyrir leit og skrár. Opnu gagnaþjónusturnar — Seðlabanki, island.is, frídagar, póstnúmer — krefjast engra aðgangsupplýsinga.

## Hvert næst

- [Hjálp í kerfinu](/help/iceland/)
- [Uppflettirit skilaboðagerða](./reference/message-types/) — beiðni- og svarsamningur hverrar gerðar, myndaður úr forritinu sjálfu
- [Notkunartilvik fyrir AppSource](./user-scenarios)
- [Skráning í Partner Center](./listing)
- [Byggja ofan á Bifröst](/extensibility/)
