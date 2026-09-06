---
id: index
title: "Bifröst Clockify"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Clockify tímaskráningarviðmótið birt sem skilaboðategundir Bifrastar, með samstillingu tímafærslna í verkbækur og tímablöð Business Central."
---

Bifröst Clockify tengir Business Central við [Clockify](https://clockify.me), þjónustu fyrir tímaskráningu. Hún byggir á Bifröst Foundation og birtir Clockify REST-viðmótið sem 41 skilaboðategund, svo ytra kerfi, MCP-biðlari eða ferli í Business Central geti lesið og skrifað Clockify-gögn gegnum sama biðraðar-, verk- og gagnamynstur og aðrar einingar Bifrastar nota. Ofan á þá beinu miðlun færir tengingin loknar Clockify-tímafærslur inn í Business Central sem verkbókarlínur eða tímablaðsfærslur, og stýrir lífsferli tímablaðanna.

## Hvað hún gerir

- **Uppfletting vinnusvæða** — listar vinnusvæðin sem API lykillinn nær til, notandann sem lykillinn tilheyrir, notendur og notendahópa vinnusvæðisins, gjaldmiðla þess og skilgreiningar sérsniðinna reita. Gjaldmiðla-, notendahópa- og sérsniðnu reitalistarnir eru til vegna þess að skrifaðgerðir í Clockify þurfa þessi innri auðkenni.
- **Viðskiptavinir, verkefni, verkþættir og merkimiðar** — lista, sækja, búa til, uppfæra og eyða á vinnusvæðinu, svo ferli í Business Central geti haldið Clockify-hlið verkefnis í takt.
- **Tímafærslur** — lista, sækja, búa til, uppfæra og eyða tímafærslum notanda í Clockify.
- **Samstilling við verkbók** — færðu lokna Clockify-tímafærslu inn sem verkbókarlínu í Business Central, eina í einu, fyrir dagsetningarbil eða fyrir alla tengda notendur í einu. Samstillingin kemur í veg fyrir tvítekningu, greinir breytingar á færslu sem þegar var samstillt og bókar leiðréttingu í stað tvítekningar.
- **Samstilling við tímablað** — skrifaðu sömu loknu færslurnar í opið tímablað starfsmannsins í staðinn, sem línu ásamt undirfærslum hennar.
- **Lífsferill tímablaða** — búðu til tímablöð komandi vikna, sendu þau inn og samþykktu, hafnaðu eða opnaðu innsendar línur að nýju, flyttu samþykktar undirfærslur í verkbók og bókaðu þær, og settu loks fullbókuð tímablöð í geymslu.
- **Rauntíma vefkrókar** — skráðu Clockify-vefkrókana `NEW_TIME_ENTRY`, `TIME_ENTRY_UPDATED` og `TIME_ENTRY_DELETED` á móttökuslóð, svo samstillingin fylgi klukkunni í stað áætlunar.
- **Tengingar** — hver Business Central færsla sem bundin er Clockify-hlut er skráð í tengitöflu. Tengingum er aldrei eytt, þær eru aðeins merktar afturkallaðar og hreinsaðar af varðveislureglu um mánuði síðar.
- **API lykillinn fer aldrei í gagnagrunninn** — hann er geymdur í IsolatedStorage á sviði fyrirtækisins og sleginn inn í földum glugga. Hann er hvorki skrifaður í reit í töflu né birtur í beiðnaskrá.
- **Sjálflýsandi viðmót** — `Help.Clockify.Get` skilar Markdown-yfirliti yfir tenginguna og hver skilaboðategund svarar eigin hjálparskjali.

## Hvernig hún virkar

1. Búðu til Clockify API lykil í Clockify undir **Profile Settings → API**.
2. Opnaðu **Uppsetningu Clockify** í Business Central — ein aðgerð í flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar — og geymdu lykilinn með **Skrá API lykil fyrirtækis**.
3. Veldu sjálfgefið vinnusvæði úr uppflettingunni, svo beiðnir sem tilgreina ekki `workspaceId` finni samt vinnusvæði.
4. Bentu verkbókarlýsingu, verkbókarflokki og sjálfgefinni vinnutegund á það sem samstilltur tími á að lenda í, ef samstillt er við verkbók.
5. Ytri kerfi senda Bifröst-skilaboð sem nefna Clockify-skilaboðategund; tengingin kallar á Clockify með geymda lyklinum og svarar gegnum gagnaviðmót Bifrastar.
6. Fyrir rauntímasamstillingu skaltu skrá móttökuslóð vefkróka og velja **Skrá vefkróka**, og stilla síðan undirritunarlyklana sem aðgerðin birtir á móttakaranum.

## Skilaboðategundir

| Svið | Skilaboðategundir |
| --- | --- |
| Uppfletting | `Help.Clockify.Get` |
| Vinnusvæði | `Clockify.Workspace.List`, `Clockify.User.GetCurrent`, `Clockify.User.List`, `Clockify.UserGroup.List`, `Clockify.Currency.List`, `Clockify.CustomField.List` |
| Viðskiptavinir | `Clockify.Client.List`, `Clockify.Client.Get`, `Clockify.Client.Create`, `Clockify.Client.Update`, `Clockify.Client.Delete` |
| Verkefni | `Clockify.Project.List`, `Clockify.Project.Get`, `Clockify.Project.Create`, `Clockify.Project.Update`, `Clockify.Project.Delete` |
| Verkþættir | `Clockify.Task.List`, `Clockify.Task.Create`, `Clockify.Task.Update`, `Clockify.Task.Delete` |
| Merkimiðar | `Clockify.Tag.List`, `Clockify.Tag.Create`, `Clockify.Tag.Update`, `Clockify.Tag.Delete` |
| Tímafærslur | `Clockify.TimeEntry.List`, `Clockify.TimeEntry.Get`, `Clockify.TimeEntry.Create`, `Clockify.TimeEntry.Update`, `Clockify.TimeEntry.Delete` |
| Samstilling við verkbók | `Clockify.TimeEntry.Sync`, `Clockify.TimeEntry.SyncRange`, `Clockify.TimeEntry.SyncAllUsers` |
| Samstilling við tímablað | `Clockify.TimeEntry.SyncToTimeSheet`, `Clockify.TimeEntry.SyncRangeToTimeSheet` |
| Tímablöð | `Clockify.TimeSheet.Create`, `Clockify.TimeSheet.Approve`, `Clockify.TimeSheet.Reject`, `Clockify.TimeSheet.Reopen`, `Clockify.TimeSheet.Post`, `Clockify.TimeSheet.Archive` |

Lyklarnir eru útgefið viðmót og breytast aldrei. Hver tegund lýsir eigin beiðni og svari meðan á keyrslu stendur: sendu `Help.Clockify.Get` fyrir heildarskrá tengingarinnar, eða spurðu `Help.Implementation.Get` um eina tegund.

Clockify-færsla sem er enn í gangi — búið að hefja hana en ekki stöðva — er vísvitandi hafnað af öllum samstillingartegundum. Aðeins lokin færsla hefur tímalengd til að bóka.

## Kröfur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrri, Essentials eða Premium.
- Bifröst Foundation, fáanleg sér á AppSource.
- Clockify-aðgangur með API lykli. Samstilling við verkbók krefst auk þess verkbókarlýsingar og verkbókarflokks; samstilling við tímablað krefst starfsmanna sem eru settir upp fyrir tímablöð.
- Rauntíma vefkrókar krefjast móttökuslóðar sem er aðgengileg utan frá og áframsendir Clockify-atburði í Business Central.

## Hvert skal halda næst

- [Hjálp í kerfinu](/help/clockify/)
- [Uppflettirit skilaboðategunda](./reference/message-types/) — beiðni og svar fyrir hverja tegund, búið til beint úr forritinu
- [Byggja á Bifröst](/extensibility/)
