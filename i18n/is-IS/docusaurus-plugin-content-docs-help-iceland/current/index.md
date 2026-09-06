---
id: index
title: "Bifröst Iceland — Help"
sidebar_label: "Bifröst Iceland — Help"
sidebar_position: 1
slug: /
---

**Bifröst Ísland** er Business Central viðbót frá Origo sem bætir 75 íslenskri skilaboðategund við **Bifrastar-grunninn**. Hún tengir Business Central við íslenskar opinberar þjónustur (Þjóðskrá gegnum Umsjá, Skattinn, Seðlabanka, island.is, Skilagrein og Já Gagnatorg) og við SMS-gáttir Símans og Nova. Allar tegundirnar eru kallaðar á sama hátt og aðrar Bifrastar-skilaboðategundir: senda beiðni í biðröðina, keyra verkið, lesa svarið.

## Síður

| Síða | Lýsing |
| --- | --- |
| [Uppsetning Íslands](/help/iceland/iceland-setup/) | Auðkenni og tegundir biðlara fyrir Umsjá, SMS, Skattinn, Skilagrein og Já Gagnatorg. |
| [Einingar þjóðskrár](/help/iceland/iceland-umsja-registry/) | Staðbundið afrit þjóðskrárgagna sem sótt eru gegnum Umsjá. |
| [Grunngögn skilagreinar](/help/iceland/iceland-skilagrein/) | Innheimtuaðilar, lífeyrissjóðir, stéttarfélög, endurhæfingarsjóðir og lífeyrisaukar. |

## Heimildasett

| Heimildasett | Veitir |
| --- | --- |
| BIFROST ISFull ori | Heimildasettsviðbót. Bætir öllum íslensku hlutunum við `BIFROST Full ori` — úthlutaðu því setti, ekki þessu. |
| BIFROST Umsja ori | Uppflettingar í Umsjá og þjóðskrárafritið. Ekki úthlutanlegt eitt og sér; fylgir BIFROST ISFull ori. |
| BIFROST NatReg ori | Samstillingu þjóðskrár. |
| BIFROST VAT ori | Virðisaukaskattsskil. |
| BIFROST Payroll ori | Staðgreiðsluskil. |
| BIFROST CapTax ori | Fjármagnstekjuskattsskil. |
| BIFROST Collect ori | Skil til innheimtuaðila Skilagreinar. |
| BIFROST SMS ori | SMS í íslensk símanúmer. |
| BIFROST SMS Fgn ori | SMS í erlend símanúmer. |
| BIFROST Ja ori | Já Gagnatorg leit, einstaklings- og fyrirtækjauppflettingar. |

## Skilaboðategundir eftir sviðum

### Efnisyfirlit

| Skilaboðategund | Lýsing |
| --- | --- |
| `Help.Iceland.Get` | Skilar Markdown-yfirliti yfir allar íslensku skilaboðategundirnar. |

### Umsjá — Þjóðskrá

Krefst auðkenna Umsjár og **BIFROST Umsja ori**.

| Skilaboðategund | Lýsing |
| --- | --- |
| `Iceland.NationalRegistry.Sync` | Samstillir alla þjóðskrána inn í staðbundna afritið (full endurnýjun). |
| `Iceland.NationalRegistryCheck.Get` | Athugar hvort heildarskrá þjóðskrár sé til og innihaldi gögn. |
| `Iceland.DeltaMonthly.Sync` | Samstillir mánaðarlegar breytingar inn í afritið eftir kennitölu. |
| `Iceland.Member.Get` | Sækir tiltekinn einstakling eða lögaðila úr þjóðskrá. |
| `Iceland.Search.Get` | Leit eftir leitarstreng, nafni, heimilisfangi eða póstfangi. |
| `Iceland.SearchByName.Get` | Leit eftir nafni. |
| `Iceland.SearchBySocialID.Get` | Leit eftir kennitölu. |
| `Iceland.Address.Get` | Allir einstaklingar og fyrirtæki skráð á heimilisfang. |
| `Iceland.AddressInfo.Get` | Upplýsingar um heimilisfang kennitölu. |
| `Iceland.Relations.Get` | Fjölskyldu- og fyrirtækjatengsl eftir auðkenni. |
| `Iceland.Roles.Get` | Hlutverk einstaklings í fyrirtækjum. |
| `Iceland.Parties.Get` | Aðilar fyrirtækis — stjórnarmenn, endurskoðendur, stofnendur. |
| `Iceland.Stakeholders.Get` | Hagsmunaaðilar fyrirtækis. |
| `Iceland.VatNumber.Get` | VSK-númer skráð á fyrirtæki. |
| `Iceland.Isat.Get` | ÍSAT-atvinnugreinaflokkun, í heild eða fyrir eina kennitölu. |

### Skatturinn — virðisaukaskattur

Krefst VSK-lykilorðs hjá RSK og **BIFROST VAT ori**.

| Skilaboðategund | Lýsing |
| --- | --- |
| `Iceland.VAT.GetPeriodEntries` | Sækir færslur VSK-tímabils. |
| `Iceland.VAT.Validate` | Villuprófar VSK-skýrslu fyrir skil. |
| `Iceland.VAT.Submit` | Skilar VSK-skýrslu til RSK. |
| `Iceland.VAT.Correct` | Leiðréttir áður innsenda VSK-skýrslu. |
| `Iceland.VAT.GetNumbers` | Sækir VSK-númer fyrirtækisins. |
| `Iceland.VAT.GetInfo` | Sækir upplýsingar um VSK-skráningu. |
| `Iceland.VAT.GetRSKDeclaration` | Sækir skýrsluna eins og RSK geymir hana. |
| `Iceland.VAT.Receipt` | Skilar PDF-kvittun fyrir innsent tímabil. |
| `Iceland.VAT.DeleteInTest` | Eyðir prófunarskilum. Aðeins með prófunarbiðlara. |

### Skatturinn — staðgreiðsla

Krefst staðgreiðslulykilorðs hjá RSK og **BIFROST Payroll ori**.

| Skilaboðategund | Lýsing |
| --- | --- |
| `Iceland.Payroll.GetPeriodPrereqs` | Sækir hlutföll og afslætti sem RSK birtir fyrir tímabilið. |
| `Iceland.Payroll.GetAllPeriods` | Listar öll staðgreiðslutímabil með stöðu. |
| `Iceland.Payroll.Validate` | Villuprófar staðgreiðsluskil gegn skema RSK. |
| `Iceland.Payroll.Send` | Sendir staðgreiðsluskil. |
| `Iceland.Payroll.Receipt` | Skilar PDF-kvittun fyrir innsent tímabil. |
| `Iceland.Payroll.Reopen` | Opnar villuprófað eða innsent tímabil aftur til leiðréttingar. |

### Skatturinn — fjármagnstekjuskattur

Krefst FTS-lykilorðs hjá RSK og **BIFROST CapTax ori**.

| Skilaboðategund | Lýsing |
| --- | --- |
| `Iceland.CapitalTax.Submit` | Skilar fjármagnstekjuskattsskýrslu. |
| `Iceland.CapitalTax.GetStatus` | Athugar stöðu skila. |
| `Iceland.CapitalTax.GetOverview` | Ársyfirlit yfir skil. |
| `Iceland.CapitalTax.GetTypes` | Gildar tekjutegundir. |
| `Iceland.CapitalTax.GetPeriods` | Gild tímabil. |
| `Iceland.CapitalTax.GetSubmittablePeriods` | Tímabil sem eru opin fyrir skil. |
| `Iceland.CapitalTax.GetExemptions` | Skráðar undanþágur. |
| `Iceland.CapitalTax.Reopen` | Opnar innsent tímabil aftur til leiðréttingar. |

### Virðisaukaskattur í Business Central (engin ytri þjónusta)

| Skilaboðategund | Lýsing |
| --- | --- |
| `Finance.VATStatement.Preview` | Reiknar línur VSK-skýrslu og skilar fjárhæð á hvern reit, tilbúið til vörpunar á RSK-reiti. |
| `Finance.VAT.CalcAndPostSettlement` | Keyrir uppgjör virðisaukaskatts í Business Central. |

### Seðlabanki Íslands

Opin gögn — engin auðkenni nauðsynleg.

| Skilaboðategund | Lýsing |
| --- | --- |
| `Iceland.CurrencyRates.Get` | Gengi gjaldmiðla fyrir dagsetningu eða tímabil. |
| `Iceland.Currency.Sync` | Skrifar gengið í gengistöflu Business Central. |
| `Iceland.InterestRates.Get` | Stýrivextir og vextir innlána- og lánafyrirgreiðslu. |
| `Iceland.IkonRates.Get` | IKON viðmiðunarvextir (daglegar skráningar). |
| `Iceland.InterbankRates.Get` | Millibankavextir (REIBID/REIBOR). |
| `Iceland.LoanTermRates.Get` | Ávöxtunarkrafa fastra lánstíma, verðtryggð og óverðtryggð. |
| `Iceland.PenaltyInterest.Get` | Lögbundnir dráttarvextir. |
| `Iceland.ConsumerPriceIndex.Get` | Vísitala neysluverðs og tólf mánaða verðbólga. |
| `Iceland.ExchangeRateIndex.Get` | Vísitölur gengis, vegnar eftir viðskiptum. |
| `Iceland.EconomicData.Get` | SDDS þjóðhagsgögn — peningamagn, gjaldeyrisforði og fleira. |
| `Iceland.Language.Get` | ISO 639-1 tungumálaskrá sem bankinn birtir með viðmiðunargögnum sínum. |

### Skilagrein

Skil krefjast **BIFROST Collect ori** og lykilorðs fyrir viðkomandi innheimtuaðila.

| Skilaboðategund | Lýsing |
| --- | --- |
| `Iceland.Collector.Get` | Sækir alla innheimtuaðila. |
| `Iceland.PensionFund.Get` | Sækir lífeyrissjóði. |
| `Iceland.Union.Get` | Sækir stéttarfélög. |
| `Iceland.RehabFund.Get` | Sækir endurhæfingarsjóði. |
| `Iceland.PensionSupplement.Get` | Sækir lífeyrisauka. |
| `Iceland.CollectorPayment.Send` | Sendir skilagrein iðgjalda til innheimtuaðila. |
| `Iceland.CollectorExtraAmount.Confirm` | Staðfestir eða hafnar aukagreiðslum sem fyrri skil kölluðu fram. |

### island.is

Opin gögn — engin auðkenni nauðsynleg.

| Skilaboðategund | Lýsing |
| --- | --- |
| `Iceland.Kennitala.Validate` | Sannreynir kennitölu og skilar tegund hennar og fæðingardegi. |
| `Iceland.Vehicle.Get` | Flettir upp ökutæki eftir skráningarnúmeri eða verksmiðjunúmeri. |
| `Iceland.Customs.Categories` | Flettir í tollskrárflokkum. |
| `Iceland.Customs.Calculate` | Reiknar aðflutningsgjöld fyrir sendingu. |
| `Iceland.Customs.Units` | Skilar þeim einingum sem tollskrárnúmer krefst. |
| `Iceland.Customs.CountryCurrencies` | Skilar vörpun landa á gjaldmiðla sem tollurinn notar. |

### SMS (Síminn og Nova)

| Skilaboðategund | Lýsing |
| --- | --- |
| `Iceland.SMS.Send` | Sendir SMS gegnum valda gátt — magnSMS Símans (REST eða SOAP) eða Nova. |
| `Iceland.SMS.Status` | Sækir sendingarstöðu skilaboða sem þegar voru send. |

### Frídagar, póstnúmer og ISO-gjaldmiðlar

Opin gögn — engin auðkenni nauðsynleg.

| Skilaboðategund | Lýsing |
| --- | --- |
| `Iceland.Holidays.Get` | Íslenskir frídagar fyrir ár eða mánuð. |
| `Iceland.Holidays.IsHoliday` | Athugar hvort tiltekin dagsetning sé íslenskur frídagur. |
| `Iceland.PostCode.Get` | Íslenska póstnúmeraskráin frá Byggðastofnun. |
| `Iceland.Currency.Get` | Útgefin ISO 4217 gjaldmiðlaskrá með bókstafa- og talnakóðum, heitum, löndum og aukastöfum. |

### Já Gagnatorg (api.ja.is)

Krefst heimildasettsins `BIFROST Ja ori` og leitar- eða skrár-API lykils á uppsetningarsíðu Íslands.

| Skilaboðategund | Lýsing |
| --- | --- |
| `Help.Ja.Get` | Efnisyfirlit Já Gagnatorg tengingarinnar. Öllum notendum opið. |
| `Ja.Search.Query` | Frjáls textaleit yfir einstaklinga, fyrirtæki og staði (Símaskrá Search v6). |
| `Ja.Person.Get` | Einstaklingsuppfletting eftir kennitölu, eða leit að einstaklingum (Þjóðskrá, Skrá v1). |
| `Ja.Company.Get` | Fyrirtækjauppfletting eftir kennitölu, eða leit að fyrirtækjum (Fyrirtækjaskrá, Skrá v1). |

## Beiðnaskrá

Hver útsend HTTP-beiðni er skráð í beiðnaskrá Bifrastar-grunnsins, merkt þeirri þjónustu sem hún fór til: island.is, Fjármagnstekjuskattur, VSK, Staðgreiðsla, Árstekjur, Fjársýsluskattur, Framtalsgögn, Skilagrein, Síminn SMS, Síminn SMS (SOAP), Nova SMS, Umsjá, Seðlabanki, ISO, Póstnúmer eða Já Gagnatorg. Lykilorð eru hulin áður en beiðnin er skráð; í svörum Já Gagnatorgs eru kennitölur einnig huldar.
