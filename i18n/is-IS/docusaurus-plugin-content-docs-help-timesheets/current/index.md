---
id: index
title: "Bifröst Timesheets — Hjálp"
sidebar_label: "Bifröst Timesheets — Hjálp"
sidebar_position: 1
slug: /
---

**Bifröst Timesheets** er Clockify-tenging Bifrastar, viðbót við Business Central frá Origo. Hún birtir Clockify REST-viðmótið fyrir tímaskráningu sem Bifröst-skilaboðategundir. Ytri kerfi fá þannig beinan les- og skrifaðgang að Clockify-vinnusvæðum, viðskiptavinum, verkefnum, verkþáttum, merkimiðum og tímafærslum gegnum Bifröst-vefþjónustuna.

Umfram beina miðlun færir tengingin loknar Clockify-tímafærslur inn í Business Central — sem verkbókarlínur með vörn gegn tvítekningu og bókun leiðréttinga, eða sem undirfærslur á opnu tímablaði starfsmannsins — og stýrir lífsferli tímablaðanna frá stofnun um samþykkt til bókunar og geymslu. Skráðir Clockify-vefkrókar halda samstillingunni í rauntíma. Clockify API lykillinn er geymdur í IsolatedStorage á sviði fyrirtækisins, aldrei í reit í töflu.

## Síður

| Síða | Lýsing |
| --- | --- |
| [Uppsetning Clockify](/help/timesheets/timesheets-setup/) | Uppsetningarspjald tengingarinnar: API lykill, sjálfgefið vinnusvæði, verkbók, vefkrókar og leiðin að listunum. |
| [Slá inn Clockify API lykil](/help/timesheets/timesheets-set-secret-dialog/) | Falinn gluggi til að slá inn Clockify API lykilinn. |
| [Clockify vinnusvæði](/help/timesheets/timesheets-workspace-lookup/) | Uppfletting á vinnusvæðunum sem geymdi API lykillinn nær til, notuð til að velja sjálfgefið vinnusvæði. |
| [Clockify tengingar](/help/timesheets/timesheets-integration-list/) | Tengingarnar milli BC-færslna og Clockify-hluta. |
| [Clockify vefkrókar](/help/timesheets/timesheets-webhooks/) | Clockify-vefkrókarnir sem þetta fyrirtæki hefur skráð fyrir rauntímasamstillingu tímafærslna. |

## Skilaboðategundir

| Tegund | Lýsing |
| --- | --- |
| Help.Clockify.Get | Skilar Markdown-yfirliti yfir tenginguna og allar skilaboðategundir hennar. |
| Clockify.Workspace.List | Listar vinnusvæðin sem geymdi API lykillinn nær til. |
| Clockify.User.GetCurrent | Skilar Clockify-notandanum sem API lykillinn tilheyrir. |
| Clockify.User.List | Listar notendur á vinnusvæði. |
| Clockify.UserGroup.List | Listar notendahópa á vinnusvæði, með auðkennunum sem þarf fyrir aðgang að verkefnum og úthlutanir. |
| Clockify.Currency.List | Listar gjaldmiðla vinnusvæðis, með gjaldmiðlaauðkennunum sem þarf þegar viðskiptavinir eru skrifaðir. |
| Clockify.CustomField.List | Listar skilgreiningar sérsniðinna reita á vinnusvæðinu, með auðkennunum sem þarf til að skrifa gildi í þá. |
| Clockify.Client.List | Listar viðskiptavini á vinnusvæði. |
| Clockify.Client.Get | Sækir einn viðskiptavin eftir auðkenni. |
| Clockify.Client.Create | Býr til viðskiptavin á vinnusvæði. |
| Clockify.Client.Update | Uppfærir viðskiptavin. |
| Clockify.Client.Delete | Eyðir viðskiptavini. |
| Clockify.Project.List | Listar verkefni á vinnusvæði. |
| Clockify.Project.Get | Sækir eitt verkefni eftir auðkenni. |
| Clockify.Project.Create | Býr til verkefni á vinnusvæði. |
| Clockify.Project.Update | Uppfærir verkefni. |
| Clockify.Project.Delete | Eyðir verkefni. |
| Clockify.Task.List | Listar verkþætti verkefnis. |
| Clockify.Task.Create | Býr til verkþátt í verkefni. |
| Clockify.Task.Update | Uppfærir verkþátt. |
| Clockify.Task.Delete | Eyðir verkþætti. |
| Clockify.Tag.List | Listar merkimiða á vinnusvæði. |
| Clockify.Tag.Create | Býr til merkimiða á vinnusvæði. |
| Clockify.Tag.Update | Uppfærir merkimiða. |
| Clockify.Tag.Delete | Eyðir merkimiða. |
| Clockify.TimeEntry.List | Listar tímafærslur notanda á vinnusvæði. |
| Clockify.TimeEntry.Get | Sækir eina tímafærslu eftir auðkenni. |
| Clockify.TimeEntry.Create | Býr til tímafærslu fyrir notanda. |
| Clockify.TimeEntry.Update | Uppfærir tímafærslu. |
| Clockify.TimeEntry.Delete | Eyðir tímafærslu. |
| Clockify.TimeEntry.Sync | Samstillir eina lokna Clockify-tímafærslu við verkbókarlínu, með vörn gegn tvítekningu, greiningu breytinga og bókun leiðréttinga. |
| Clockify.TimeEntry.SyncRange | Samstillir allar loknar tímafærslur notanda á dagsetningarbili við verkbókarlínur í einu kalli. |
| Clockify.TimeEntry.SyncAllUsers | Samstillir loknar færslur á dagsetningarbili fyrir alla tengda notendur, við verkbók eða tímablöð. |
| Clockify.TimeEntry.SyncToTimeSheet | Samstillir eina lokna tímafærslu við opið tímablað starfsmannsins, sem línu ásamt undirfærslum hennar. |
| Clockify.TimeEntry.SyncRangeToTimeSheet | Samstillir allar loknar tímafærslur notanda á dagsetningarbili við opin tímablöð hans. |
| Clockify.TimeSheet.Create | Býr til tímablöð komandi vikna fyrir alla starfsmenn sem nota tímablöð. |
| Clockify.TimeSheet.Approve | Sendir inn og samþykkir opnar tímablaðslínur fram að tilteknum degi. |
| Clockify.TimeSheet.Reject | Hafnar innsendum tímablaðslínum fram að tilteknum degi. |
| Clockify.TimeSheet.Reopen | Opnar innsendar eða samþykktar tímablaðslínur að nýju. |
| Clockify.TimeSheet.Post | Flytur samþykktar tímablaðsundirfærslur í verkbókarflokk og bókar þær. |
| Clockify.TimeSheet.Archive | Setur fullbókuð tímablöð í geymslu og fjarlægir tóm bókuð blöð. |

Sendið `Help.Clockify.Get` til að fá heildarskrána á Markdown-formi, eða biðjið einstaka skilaboðategund um hjálparskjal hennar til að sjá nákvæmlega hvaða viðföng, svarreiti og villur hún styður.

Færsla sem er enn í gangi í Clockify hefur engan lokatíma og því enga tímalengd til að bóka. Allar samstillingartegundir hafna slíkri færslu vísvitandi.

## Hafist handa

1.  Búðu til API lykil í Clockify undir **Profile Settings → API**.
2.  Opnaðu [Uppsetningu Clockify](/help/timesheets/timesheets-setup/) — aðgerðina **Clockify** í flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar.
3.  Veldu **Skrá API lykil fyrirtækis** og límdu lykilinn inn í [falda gluggann](/help/timesheets/timesheets-set-secret-dialog/).
4.  Flettu upp **Sjálfgefnu vinnusvæði** og veldu vinnusvæði úr [vinnusvæðalistanum](/help/timesheets/timesheets-workspace-lookup/).
5.  Ef tímafærslur eiga að rata í verkbók skaltu fylla út verkbókarlýsingu, verkbókarflokk og sjálfgefna vinnutegund.
6.  Fyrir rauntímasamstillingu skaltu slá inn **Móttökuslóð vefkróka**, velja **Skrá vefkróka** og stilla undirritunarlyklana sem aðgerðin birtir á móttakaranum.
7.  Sendu Bifröst-skilaboð sem nefna Clockify-skilaboðategund, til dæmis `Clockify.Workspace.List`.
