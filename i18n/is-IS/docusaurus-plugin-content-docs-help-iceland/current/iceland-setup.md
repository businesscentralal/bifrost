---
id: iceland-setup
title: "Uppsetning Íslands"
sidebar_label: "Uppsetning Íslands"
sidebar_position: 2
---

Bifröst Ísland er stillt í flokknum **Ísland** á síðunni **Uppsetning Bifrastar**, sem viðbótin bætir við með síðuviðbótinni `Iceland Setup Ext ori`. Leiðsagnarsíðan **Uppsetning Bifröst Ísland** (`Iceland Setup Wizard ori`) opnast við fyrstu uppsetningu og fer í gegnum sömu stillingar skref fyrir skref.

Allar stillingar eru vistaðar á hvert fyrirtæki. Lykilorð eru aldrei skrifuð í uppsetningartöfluna heldur geymd í Isolated Storage; þau má aðeins yfirskrifa, ekki lesa til baka.

## Skref 1 — HTTP-biðlarabeiðnir

Allar tengingar í viðbótinni kalla á ytri vefþjónustu. Business Central lokar á útsendar HTTP-beiðnir frá viðbót þar til þær eru heimilaðar, því athugar leiðsögnin þetta fyrst og býður **Virkja HTTP-biðlarabeiðnir** og **Opna stillingar viðbótar**. Ekkert annað virkar fyrr en þetta er kveikt.

## Skref 2 — Umsjá (þjóðskrá)

| Reitur | Lýsing |
| --- | --- |
| Tegund Umsja biðlara fyrir Ísland | Hvaða Umsjár-biðlari er notaður — raunþjónustan eða innbyggður prófunar-/enginn biðlari. |
| Leyfisnúmer | Leyfisnúmer Umsjár sem fyrirtækinu var úthlutað. |
| Notandanafn | Notandanafn fyrir vefþjónustu Umsjár. Geymt í Isolated Storage. |
| Lykilorð | Lykilorð fyrir vefþjónustu Umsjár. Geymt í Isolated Storage og birt hulið. |
| Innskráningarupplýsingar geymdar | Skrifvarin vísbending á uppsetningarsíðunni um hvort notandanafn og lykilorð séu til staðar. |

Innskráningarupplýsingar Umsjár opna á skilaboðategundirnar `Iceland.NationalRegistry.*`, `Iceland.Search*`, `Iceland.Parties.Get`, `Iceland.Relations.Get` og skyldar tegundir. Umsjár-hlutirnir falla undir **BIFROST Umsja ori**, sem er ekki úthlutanlegt eitt og sér — það fylgir **BIFROST ISFull ori**. Samstilling þjóðskrár er varin sérstaklega af hinu úthlutanlega **BIFROST NatReg ori**.

## Skref 3 — SMS

| Reitur | Lýsing |
| --- | --- |
| Tegund SMS biðlara | Hvaða gátt afgreiðir `Iceland.SMS.Send` — Síminn, Síminn (SOAP), Nova eða engin. |
| Síminn — Sjálfgefið sendandanúmer | Sendandi sem viðtakandi sér þegar beiðnin tilgreinir hann ekki. |
| Síminn — Notandanafn / Lykilorð | Innskráningarupplýsingar fyrir magnSMS-vefþjónustu Símans. Geymt í Isolated Storage. |
| Nova — Sjálfgefið sendandanúmer | Sendandi sem notaður er fyrir Nova-gáttina. |
| Nova — Notandanafn / Lykilorð | Innskráningarupplýsingar fyrir SMS-vefþjónustu Nova. Geymt í Isolated Storage. |

Sendingar í íslensk símanúmer krefjast **BIFROST SMS ori**; sendingar í erlend númer krefjast auk þess **BIFROST SMS Fgn ori**.

## Skref 4 — Skatturinn (RSK)

| Reitur | Lýsing |
| --- | --- |
| Tegund Skatturinn biðlara | Framleiðsla eða Prófun. Prófun sendir í sandkassa RSK (`vefurp.rsk.is`) án raunverulegra skattaáhrifa. |
| VSK lykilorð | Lykilorð fyrir vefþjónustu virðisaukaskatts. Geymt í Isolated Storage. |
| Staðgreiðslu lykilorð | Lykilorð fyrir vefþjónustu staðgreiðslu. Geymt í Isolated Storage. |
| FTS lykilorð | Valkvætt. Lykilorð fyrir vefþjónustu fjármagnstekjuskatts. |
| VSK / Staðgreiðslu / FTS lykilorð geymt | Skrifvarnar vísbendingar á uppsetningarsíðunni um hvaða lykilorð eru til staðar. |

Kennitala fyrirtækisins sem notuð er til auðkenningar hjá Skattinum er lesin úr **Fyrirtækjaupplýsingum**, ekki af þessari síðu — skráðu kennitöluna þar áður en nokkuð er sent.

Heimildasett: **BIFROST VAT ori** fyrir VSK, **BIFROST Payroll ori** fyrir staðgreiðslu og **BIFROST CapTax ori** fyrir fjármagnstekjuskatt.

## Skref 5 — Skilagrein

| Reitur | Lýsing |
| --- | --- |
| Tegund Skilagrein biðlara | Hvaða vefbiðlari Skilagreinar er notaður. |

Lykilorð Skilagreinar eru _ekki_ skráð á uppsetningarsíðunni. Hver innheimtuaðili hefur sitt eigið lykilorð fyrir vefþjónustu, sem skráð er á síðunni [Innheimtuaðilar skilagreinar](/help/iceland/iceland-skilagrein/) með aðgerðinni **Skrá lykilorð vefþjónustu**. Skil til innheimtuaðila krefjast **BIFROST Collect ori**.

## Skref 6 — Já Gagnatorg

| Reitur | Lýsing |
| --- | --- |
| Leitar-API lykill | Já Search v6 (Símaskrá) API lykill, notaður af `Ja.Search.Query`. Geymdur í Isolated Storage, birtur duldur. |
| Leitar-API lykill skráður | Skrifvarin vísbending um hvort leitarlykillinn sé til staðar. |
| Skrár-API lykill | Já Skrá v1 (Þjóðskrá / Fyrirtækjaskrá) API lykill, notaður af `Ja.Person.Get` og `Ja.Company.Get`. Geymdur í Isolated Storage, birtur duldur. |
| Skrár-API lykill skráður | Skrifvarin vísbending um hvort skrárlykillinn sé til staðar. |

Til að kalla einhverja af hinum þremur raunverulegu Já Gagnatorg skilaboðategundum þarf auk þess heimildasettið **BIFROST Ja ori**. `Help.Ja.Get` er öllum notendum opið.

## Tengdar aðgerðir á uppsetningarsíðunni

Ísland-flokkurinn á uppsetningarsíðu Bifrastar tengir einnig í grunngagnasíðurnar: Innheimtuaðilar, Lífeyrissjóðir, Stéttarfélög, Endurhæfingarsjóðir, Lífeyrisaukar og [Einingar þjóðskrár](/help/iceland/iceland-umsja-registry/).

## Athugasemdir

-   Öll lykilorð eru geymd í Isolated Storage og birtast hvorki í annálum, beiðnaskrá né í svörum vefþjónustunnar.
-   Lykilorð flytjast ekki frá fyrri viðbót. Bifröst Ísland er sjálfstæð viðbót og Isolated Storage er einkageymsla hverrar viðbótar, því þarf að slá öll lykilorð inn aftur hér eftir uppsetningu.
-   Notaðu prófunarbiðlara Skattsins fyrir fyrstu skil og skiptu yfir í Framleiðslu þegar sendingarnar standast villuprófun.
-   Skilaboðategundir sem þurfa engin auðkenni — frídagar, póstnúmer, ISO-gjaldmiðlar, gengi Seðlabankans og uppflettingar hjá island.is — virka um leið og HTTP-biðlarabeiðnir eru virkjaðar.
-   **BIFROST ISFull ori** er heimildasettsviðbót: hún bætir öllum íslensku hlutunum við **BIFROST Full ori** úr Bifrastar-grunninum. Úthlutaðu **BIFROST Full ori** — íslensku hlutirnir fylgja með.
