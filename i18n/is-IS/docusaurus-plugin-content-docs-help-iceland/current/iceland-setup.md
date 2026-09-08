---
id: iceland-setup
title: "Uppsetning Bifröst Ísland"
sidebar_label: "Uppsetning Bifröst Ísland"
sidebar_position: 2
---

Spjaldið **Uppsetning Bifröst Ísland** (`Iceland Setup ori`) geymir allar stillingar tenginga Bifröst Ísland — Umsjár, SMS, Skattsins, Skilagreinar og Já Gagnatorgs. Það er opnað með aðgerðinni **Uppsetning Bifröst Ísland** í flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar, þar sem hún er einnig sett fram sem flýtiaðgerð, eða með því að leita að *Uppsetning Bifröst Ísland*. Það er nákvæmlega ein uppsetningarfærsla í hverju fyrirtæki.

Ekkert sem varðar Ísland er lengur stillt á uppsetningarspjaldi Bifrastar-grunnsins. Uppsetningarsíða grunnsins ber eina íslenska aðgerð og allt annað er hér, svo hægt sé að setja viðbótina upp, stilla hana og fjarlægja án þess að snerta grunninn.

Leiðsögnin **Setja upp tengingar Bifröst Ísland** (`Iceland Setup Wizard ori`) fer í gegnum val á biðlaraútfærslu tenginganna skref fyrir skref. Hún er ræst úr **Aðstoðaðri uppsetningu** (Assisted Setup). Aðgerðin **Uppsetningarleiðsögn** á þessari síðu opnar hins vegar **Uppsetningarleiðsögn Bifröst** hjá Bifrastar-grunninum: útleið HTTP og allar innskráningarupplýsingar á þessari síðu eru stilltar þar einu sinni, fyrir öll uppsett Bifröst-forrit - leiðsögn þessa forrits endurtekur hvorugt skrefið.

## Tilkynningar

Þessi síða birtir engar tilkynningar sjálf. Eina uppsetningartilkynningin í Bifröst-fjölskyldunni - HTTP-biðlarabeiðnir sem eru ekki enn virkar fyrir eitt eða fleiri Bifröst-forrit - birtist á síðunni [Uppsetning Bifröst](/help/foundation/bifrost-setup/) hjá Bifrastar-grunninum, og eina aðgerð hennar, **Hefja uppsetningarleiðsögn**, opnar Uppsetningarleiðsögn Bifröst sem virkjar HTTP fyrir öll skráð forrit í einu skrefi. Innskráningarupplýsingar sem vantar valda engri tilkynningu: skilaboðategund sem hefur ekki fengið sínar upplýsingar svarar einfaldlega með villu þar til þær eru skráðar, og þessi síða sýnir fyrir hvert svið hvort gildi sé geymt.

## Umsjá

Uppflettingar í þjóðskrá gegnum Umsjár-þjónustuna.

| Reitur | Lýsing |
| --- | --- |
| Tegund Umsjár-biðlara | Hvaða Umsjár-biðlari er notaður — raunþjónustan eða prófunar-/enginn biðlari. |
| Leyfisnúmer Umsjár | Leyfisnúmer Umsjár sem fyrirtækinu var úthlutað. |
| Innskráningarupplýsingar | Hvort notandanafn og lykilorð Umsjár séu geymd. Ekki breytanlegt — notaðu aðgerðirnar til að skrá þau eða eyða. |

| Aðgerð | Lýsing |
| --- | --- |
| Skrá notandanafn | Biður um notandanafn fyrir vefþjónustu Umsjár í sameiginlega hulda glugganum. |
| Skrá lykilorð | Biður um lykilorð fyrir vefþjónustu Umsjár í sameiginlega hulda glugganum. |
| Hreinsa innskráningarupplýsingar | Fjarlægir geymt notandanafn og lykilorð Umsjár. |

Innskráningarupplýsingar Umsjár opna á `Iceland.NationalRegistry.*`, `Iceland.Search*`, `Iceland.Parties.Get`, `Iceland.Relations.Get` og skyldar uppflettingar. Hlutirnir falla undir **BIFROST Umsja ori**, sem er ekki úthlutanlegt eitt og sér — það fylgir **BIFROST ISFull ori**. Samstilling þjóðskrár er varin sérstaklega af hinu úthlutanlega **BIFROST NatReg ori**.

## SMS

| Reitur | Lýsing |
| --- | --- |
| Tegund SMS-biðlara | Hvaða gátt afgreiðir `Iceland.SMS.Send` — Síminn, Síminn (SOAP) eða Nova. Undirflokkarnir hér að neðan fylgja þessu vali. |

### Síminn

Birtist þegar biðlarategundin er Síminn eða Síminn (SOAP).

| Reitur | Lýsing |
| --- | --- |
| Sjálfgefið sendandaauðkenni Símans | Sendandi sem viðtakandi sér þegar beiðnin tilgreinir hann ekki. Að hámarki 11 stafir. |
| Innskráningarupplýsingar | Hvort notandanafn og lykilorð Símans séu geymd. Ekki breytanlegt. |

| Aðgerð | Lýsing |
| --- | --- |
| Skrá notandanafn Símans | Biður um notandanafn fyrir magnSMS-þjónustu Símans. |
| Skrá lykilorð Símans | Biður um lykilorð fyrir magnSMS-þjónustu Símans. |
| Hreinsa innskráningarupplýsingar Símans | Fjarlægir geymt notandanafn og lykilorð Símans. |

### Nova

Birtist þegar biðlarategundin er Nova.

| Reitur | Lýsing |
| --- | --- |
| Sjálfgefið sendandaauðkenni Nova | Sendandi sem notaður er fyrir Nova-gáttina þegar beiðnin tilgreinir hann ekki. |
| Innskráningarupplýsingar | Hvort notandanafn og lykilorð Nova séu geymd. Ekki breytanlegt. |

| Aðgerð | Lýsing |
| --- | --- |
| Skrá notandanafn Nova | Biður um notandanafn fyrir SMS-þjónustu Nova. |
| Skrá lykilorð Nova | Biður um lykilorð fyrir SMS-þjónustu Nova. |
| Hreinsa innskráningarupplýsingar Nova | Fjarlægir geymt notandanafn og lykilorð Nova. |

Sendingar í íslensk símanúmer krefjast **BIFROST SMS ori**; sendingar í erlend númer krefjast auk þess **BIFROST SMS Fgn ori**.

## Skatturinn

| Reitur | Lýsing |
| --- | --- |
| Tegund biðlara Skattsins | Raunumhverfi eða Prófun. Prófun sendir í sandkassa RSK án raunverulegra skattaáhrifa. |
| Lykilorð VSK | Hvort lykilorð virðisaukaskatts sé geymt. Ekki breytanlegt. |
| Lykilorð staðgreiðslu | Hvort lykilorð staðgreiðslu sé geymt. Ekki breytanlegt. |
| Lykilorð fjármagnstekjuskatts | Hvort lykilorð fjármagnstekjuskatts sé geymt. Ekki breytanlegt. |

| Aðgerð | Lýsing |
| --- | --- |
| Skrá lykilorð VSK | Biður um lykilorð vefþjónustu virðisaukaskatts. |
| Skrá lykilorð staðgreiðslu | Biður um lykilorð vefþjónustu staðgreiðslu. |
| Skrá lykilorð fjármagnstekjuskatts | Biður um lykilorð vefþjónustu fjármagnstekjuskatts. |
| Hreinsa lykilorð Skattsins | Fjarlægir öll þrjú geymdu lykilorð Skattsins. |

Kennitalan sem notuð er til auðkenningar gagnvart Skattinum er lesin úr **Upplýsingum fyrirtækis → Kennitala**. Hún er aldrei skráð á þessari síðu, svo skráðu hana þar áður en nokkuð er sent.

Sé ekkert lykilorð fjármagnstekjuskatts geymt er lykilorð staðgreiðslu notað fyrir fjármagnstekjuskatt líka. Skráðu sérstakt lykilorð aðeins þegar RSK hefur gefið út annað lykilorð fyrir þá þjónustu.

Heimildasett: **BIFROST VAT ori** fyrir VSK, **BIFROST Payroll ori** fyrir staðgreiðslu og **BIFROST CapTax ori** fyrir fjármagnstekjuskatt.

## Skilagrein

| Reitur | Lýsing |
| --- | --- |
| Tegund biðlara Skilagreinar | Hvaða vefbiðlari Skilagreinar er notaður. |

Ekkert lykilorð Skilagreinar er á þessari síðu. Hver innheimtuaðili auðkennir sig með eigin lykilorði fyrir vefþjónustu, sem skráð er á síðunni [Innheimtuaðilar skilagreinar](/help/iceland/iceland-skilagrein/) með aðgerðinni **Skrá lykilorð vefþjónustu**. Skil til innheimtuaðila krefjast **BIFROST Collect ori**.

## Já Gagnatorg

| Reitur | Lýsing |
| --- | --- |
| Tegund Já-biðlara | Hvaða Já Gagnatorg biðlari er notaður. |
| Leitar-API lykill | Hvort lykill Já Search v6 (Símaskrár), sem `Ja.Search.Query` notar, sé geymdur. Ekki breytanlegt. |
| Skrár-API lykill | Hvort lykill Já Skrár v1 (Þjóðskrár / Fyrirtækjaskrár), sem `Ja.Person.Get` og `Ja.Company.Get` nota, sé geymdur. Ekki breytanlegt. |

| Aðgerð | Lýsing |
| --- | --- |
| Skrá leitar-API lykil | Biður um API lykil Já fyrir leit. |
| Skrá skrár-API lykil | Biður um API lykil Já fyrir skrár. |
| Hreinsa API lykla Já | Fjarlægir báða geymdu API lykla Já. |

Til að kalla einhverja af hinum þremur raunverulegu Já Gagnatorg skilaboðategundum þarf auk þess **BIFROST Ja ori**. `Help.Ja.Get` er öllum notendum opið.

## Aðrar aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| Leyndarmál forrits | Opnar lista Bifrastar-grunnsins yfir leyndarmál, síaðan á Bifröst Ísland, sem sýnir hvert skráð leyndarmál og hvort það sé skráð. |
| Uppsetningarleiðsögn | Opnar **Uppsetningarleiðsögn Bifröst** hjá Bifrastar-grunninum, sem virkjar HTTP-biðlarabeiðnir fyrir öll uppsett Bifröst-forrit og fer yfir innskráningarupplýsingar þeirra. Tengingaleiðsögnin **Setja upp tengingar Bifröst Ísland** er ræst úr Aðstoðaðri uppsetningu. |
| Innheimtuaðilar skilagreinar | Opnar grunngagnasíðuna [Innheimtuaðilar skilagreinar](/help/iceland/iceland-skilagrein/). |
| Einingar þjóðskrár | Opnar afritið [Einingar þjóðskrár](/help/iceland/iceland-umsja-registry/). |

## Hvar innskráningarupplýsingarnar liggja

Öll leyndarmál eru geymd í **leyndarmálageymslu** Bifrastar-grunnsins, hvorki á þessari síðu né í uppsetningartöflunni. Hver **Skrá …** aðgerð opnar sama sameiginlega hulda gluggann: gildið er hulið meðan það er slegið inn, fer beint í geymsluna og er aldrei birt aftur. Reitirnir á spjaldinu segja aðeins til um hvort gildi sé til staðar.

| Kóði leyndarmáls | Geymir | Umfang |
| --- | --- | --- |
| `UMSJA-USERNAME` | Notandanafn fyrir vefþjónustu Umsjár | Fyrirtæki |
| `UMSJA-PASSWORD` | Lykilorð fyrir vefþjónustu Umsjár | Fyrirtæki |
| `SIMINN-USERNAME` | Notandanafn magnSMS hjá Símanum | Fyrirtæki |
| `SIMINN-PASSWORD` | Lykilorð magnSMS hjá Símanum | Fyrirtæki |
| `NOVA-USERNAME` | Notandanafn SMS hjá Nova | Fyrirtæki |
| `NOVA-PASSWORD` | Lykilorð SMS hjá Nova | Fyrirtæki |
| `RSK-VAT-PASSWORD` | Lykilorð virðisaukaskatts hjá Skattinum | Fyrirtæki |
| `RSK-PAYROLL-PASSWORD` | Lykilorð staðgreiðslu hjá Skattinum | Fyrirtæki |
| `RSK-FTS-PASSWORD` | Lykilorð fjármagnstekjuskatts hjá Skattinum | Fyrirtæki |
| `RSK-TEST-VAT-PASSWORD` | Lykilorð virðisaukaskatts hjá Skattinum - prófunarumhverfi (notað þegar tegund Skatturinn biðlara er Prófun) | Fyrirtæki |
| `RSK-TEST-PAYROLL-PASSWORD` | Lykilorð staðgreiðslu hjá Skattinum - prófunarumhverfi | Fyrirtæki |
| `RSK-TEST-FTS-PASSWORD` | Lykilorð fjármagnstekjuskatts hjá Skattinum - prófunarumhverfi | Fyrirtæki |
| `JA-SEARCH-API-KEY` | API lykill Já Search v6 | Fyrirtæki |
| `JA-REGISTRY-API-KEY` | API lykill Já Skrár v1 | Fyrirtæki |
| `SKG-COLLECTOR-<númer innheimtuaðila>-PASSWORD` | Eitt á hvern innheimtuaðila skilagrein.is, skráð á innheimtuaðilasíðunni | Fyrirtæki |

Gildin eru skrifuð í IsolatedStorage sem tilheyrir Bifrastar-grunninum, aldrei í reit í töflu, aldrei í fjarmælingar og aldrei í beiðnaskrána.

## Athugasemdir

-   **Innskráningarupplýsingar flytjast ekki frá Origo Cloud Events Iceland.** IsolatedStorage er einkageymsla hverrar viðbótar, svo ekkert sem fyrri viðbótin geymdi er lesanlegt hér. Kerfisstjóri þarf að slá öll leyndarmál inn einu sinni eftir uppsetningu Bifröst Ísland.
-   Stillingar sem eru ekki leyndarmál — val á biðlarategundum, leyfisnúmer Umsjár og sendandaauðkennin — flytjast sjálfkrafa við uppsetningu og uppfærslu. Aðeins leyndarmálin þarf að skrá aftur.
-   Notaðu prófunarbiðlara Skattsins fyrir fyrstu skil og skiptu yfir í raunumhverfi þegar sendingarnar standast villuprófun.
-   Skilaboðategundir sem þurfa engin auðkenni — frídagar, póstnúmer, ISO-gjaldmiðlar, gengi Seðlabankans og uppflettingar hjá island.is — virka um leið og HTTP-biðlarabeiðnir eru virkjaðar.
-   **BIFROST ISFull ori** er heimildasettsviðbót: hún bætir öllum íslensku hlutunum við **BIFROST Full ori** úr Bifrastar-grunninum. Úthlutaðu **BIFROST Full ori** — íslensku hlutirnir fylgja með.

## Leiðsögnin

**Setja upp tengingar Bifröst Ísland** (`Iceland Setup Wizard ori`) fer yfir val á biðlaraútfærslu í þremur skrefum.

| Skref | Nær yfir |
| --- | --- |
| Velkomin | Hvað leiðsögnin stillir, og bendir á Uppsetningarleiðsögn Bifröst fyrir HTTP og innskráningarupplýsingar. |
| Biðlarar tenginga | Biðlarategund hvers sviðs — Umsjár, SMS, Skattsins, Skilagreinar og Já Gagnatorgs — auk leyfisnúmers Umsjár og sendandaauðkenna SMS. |
| Lok | Vistar stillingarnar. |

Þessi leiðsögn hvorki virkjar HTTP né skráir innskráningarupplýsingar. Hvort tveggja er stillt einu sinni, fyrir öll uppsett Bifröst-forrit, í **Uppsetningarleiðsögn Bifröst** hjá Bifrastar-grunninum (Uppsetning Bifröst, aðgerðin **Ræsa uppsetningarleiðsögn**) - keyrðu hana fyrst ef tengingarnar hér ná ekki til íslensku þjónustanna.
