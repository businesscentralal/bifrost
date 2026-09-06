---
id: index
title: "Bifröst Foundation — Help"
sidebar_label: "Bifröst Foundation — Help"
sidebar_position: 1
slug: /
---

**Bifröst Foundation** er viðbót fyrir Business Central frá Origo sem veitir umgjörð fyrir Bifröst skilaboðavinnslu. Ytri kerfi geta sent skipulögð skilaboð til Business Central í gegnum REST API og viðbótin vinnur úr þeim annað hvort samstillt (svörun strax) eða ósamstillt (sett í biðröð til bakgrunnsvinnslu).

Viðbótin styður fjölda innbyggðra skilaboðagerða til að sækja lánamarksupplýsingar viðskiptamanna, athuga birgðastöðu og verð vara, vinna með söluskjöl, samstilla gögn og uppgötva lýsigögn API. Hún er fullkomlega stækkanleg – samstarfsaðilar geta bætt við nýjum skilaboðagerðum og útfærsluaðferðum án þess að breyta grunnkóðanum.

## Síður

| Síða | Lýsing |
| --- | --- |
| [Bifröst uppsetning](/help/foundation/bifrost-setup/) | Miðlæg uppsetningarsíða fyrir útfærsluaðferðir, vikmörk lánamarks og sjálfgefið tungumál. |
| [Bifröst skilaboð](/help/foundation/bifrost-messages/) | Listi yfir öll Bifröst skilaboð með vinnslustöðu, beiðni-/svargögnum og vinnsluvalkostum. |
| [Bifröst samþætting](/help/foundation/bifrost-integration/) | Rekstrarlegar skrár yfir samþættingaratburði, sem sýna upprunakerfi, töflu og tímastimpil fyrir hvern atburð. Styður merkingu færslna sem bakfærðar. |
| [Bifröst geymsla](/help/foundation/bifrost-storage/) | Skoðaðu og stjórnaðu geymdu tvíundarefni sem tengist Bifröst. Styður inn- og útflutning skráa. |
| [Ritill Bifröst skilaboða](/help/foundation/bifrost-message-editor/) | Innbyggður ritill til að skoða og breyta gagnafarm beiðni Bifröst skilaboða. |
| [Bifröst beiðni](/help/foundation/bifrost-request/) | Upplýsingareitur sem sýnir komandi beiðnigögn valins Bifröst skilaboðs. |
| [Bifröst svar](/help/foundation/bifrost-response/) | Upplýsingareitur sem sýnir svargögnin sem búin voru til eftir vinnslu Bifröst skilaboðs. |
| [Bifröst þýðingar](/help/foundation/bifrost-translations/) | Stjórna þýðingarfærslum sem ytri kerfi nota til að sækja þýddan texta fyrir skilaboð. |
| [Bifröst svæðisaðgangar](/help/foundation/bifrost-field-accesses/) | Skilgreindu og stjórnaðu aðgangstakmörkunum á svæðastigi fyrir lestri og skráningu notenda og Entra ID forrita í gegnum Bifröst API. |
| [Velja svæði](/help/foundation/bifrost-field-lookup/) | Uppflettingarsíða til að finna og velja töflusvæði þegar svæðisaðgangstakmarkanir eru settar upp. |
| [Velja notanda eða forrit](/help/foundation/user-app-lookup/) | Uppflettingarsíða til að velja Business Central notanda eða Entra ID forrit þegar svæðisaðgangstakmarkanir eru stjórnaðar. |
| [Velja upprunakerfi þýðingar](/help/foundation/translation-src-lookup/) | Uppflettingarsíða til að velja upprunakerfi til að sía lista yfir Bifröst þýðingar. |
| [Uppsetning eyðingarskráningar](/help/foundation/bifrost-delete-setup/) | Stilltu hvaða töflur skrá eyddar færslur í eyðingaskrána, með valfrjálsri JSON-mynd. |
| [Bifröst eyðingaskrá](/help/foundation/bifrost-delete-log/) | Lesskráð eftirlitsskrá yfir allar eyðingar úr röktum töflum, þ.m.t. tafla, SystemId, tímastimpill og notandi. |
| [Bifröst notandauppsetning](/help/foundation/bifrost-user-setup-list/) | Uppsetning á hvern notanda þ.m.t. kerfisleiðbeiningar og tengdar færslur fyrir AI-knúnar skilaboðategundir. |
| [Ritill notandauppsetningar](/help/foundation/bifrost-user-setup-editor/) | Ítarlegur ritill til að skoða og breyta JSON-uppsetningu notanda í Bifröst kerfinu. |
| [Forskoðun notandauppsetningar](/help/foundation/bifrost-user-setup-fact-box/) | Upplýsingareitur sem sýnir fljótlegt yfirlit yfir stillingar núverandi notanda. |
| [Auðkenni kallara](/help/foundation/caller-identity/) | Sýnir auðkenni og sannvottunarupplýsingar núverandi API-kallara eða notandalotur. |
| [Bifröst tilkynningar](/help/foundation/bifrost-notes/) | Listi yfir allar tilkynningar og athugasemdir í Bifröst kerfinu. |
| [Bifröst tilkynningaspjald](/help/foundation/bifrost-note-card/) | Spjaldsíða til að skoða og breyta einni tilkynningu eða athugasemd í Bifröst kerfinu. |
| [Skilaboð](/help/foundation/bifrost-note-message/) | Síða til að skrifa eða skoða eitt skilaboð innan Bifröst tilkynningaþráðs. |
| [Bifröst minni](/help/foundation/bifrost-memory/) | Fyrirtækjaminni samnýtt af öllum notendum í Bifröst kerfinu. |
| [Bifröst notandaminni](/help/foundation/bifrost-user-memory/) | Persónulegt minni núverandi notanda, ekki sýnilegt öðrum. |

## API-síður

Eftirfarandi API-síður eru notaðar forritunarlega af ytri samþættingum og eru ekki opnaðar beint af notendum:

| API-síða | Endapunktur | Lýsing |
| --- | --- | --- |
| [Bifrost Request Data API](/help/foundation/bifrost-request-data-api/) | `/api/origo/bifrost/v1.0/requests` | Skrifvarinn endapunktur sem skilar upprunalegu beiðnigögnum fyrir send skilaboð. Notaðu sama skilaboðaauðkenni og í tasks/queues. |
| [Bifrost Task API](/help/foundation/bifrost-task-api/) | `/api/origo/bifrost/v1.0/tasks` | Samstillt vinnsla – býr til og vinnur úr skilaboðum strax og skilar niðurstöðu í einu kalli. |
| [Bifrost Queue API](/help/foundation/bifrost-queue-api/) | `/api/origo/bifrost/v1.0/queues` | Ósamstillt vinnsla – setur skilaboð í biðröð til bakgrunnsvinnslu; notaðu _GetStatus_ til að kanna stöðu eða gerast áskrifandi að vefkrókum. |
| [Bifrost Response Data API](/help/foundation/bifrost-response-data-api/) | `/api/origo/bifrost/v1.0/responses` | Skrifvarinn endapunktur sem skilar svargögnum fyrir unnin skilaboð. |

## Skjölun

Öll vöruskjölun liggur við hliðina á þessari hjálp — hún er skrifuð einu sinni og
sameiginleg fyrir bæði tungumál.

| Skjal | Lýsing |
| --- | --- |
| [Yfirlit](/foundation/) | Hvað Bifröst Foundation er, hvað það gerir og hvernig það virkar. |
| [API-tilvísun](/foundation/reference/api/) | Endapunktar, CloudEvents-umslagið, auðkenning og form svara. |
| [Uppsetningartilvísun](/foundation/reference/setup/) | Uppsetningarsíða Bifrastar, útfærsluaðferðirnar og stækkunarpunktarnir að baki. |
| [Aðgangstakmarkanir á svæðastigi](/foundation/reference/field-access-restrictions/) | Takmarkanir á lestri og skrifum einstakra svæða fyrir `Data.Records.Get` og `Data.Records.Set`. |
| [Atburðir og vefkrókar](/foundation/reference/events-and-webhooks/) | Ytri viðskiptaatburðir, vefkróka-tilkynningar og samþættingaratburðir. |
| [Leyndarmál](/foundation/reference/secrets/) | Sameiginlega leyndarmálageymslan sem öll Bifrastar-forrit skrá aðgangsupplýsingar sínar í. |
| [Leyfi](/foundation/reference/licensing/) | Leyfislíkanið sem byggir á skilaboðakvóta. |
| [Gagnaskilaboðagerðir](/foundation/message-types/data/) | `Data.Records.Get`, `Data.Records.Set`, `Data.RecordIds.Get`, `CSV.Records.Get` og `Data.Totals.Get`. |
| [Lýsigagna- og hjálparskilaboðagerðir](/foundation/message-types/metadata/) | `Help.*` gerðirnar — MessageTypes, Implementation, Tables, Fields, Permissions. |
| [Sölu-, viðskiptamanna- og vöruskilaboðagerðir](/foundation/message-types/sales/) | Lánamark, söluferill, birgðastaða og verð vöru, og lífsferill söluskjala. |
| [Innkaupaskilaboðagerðir](/foundation/message-types/purchase/) | Lífsferill innkaupapöntunar — Release, Reopen, Statistics og Post. |
| [Fjármálaskilaboðagerðir](/foundation/message-types/finance/) | Bókun almennrar færslubókar, bókhaldslyklar, fjárhagsáætlun og fyrirspurnir um fjárhagsfærslur. |
| [Birgðaskilaboðagerðir](/foundation/message-types/inventory/) | Vöruskrá, birgðastaða og vöruhúsafyrirspurnir. |
| [Verkefnaskilaboðagerðir](/foundation/message-types/projects/) | Verkbækur og aðgerðir á verkfærslum. |
| [Tilfangaskilaboðagerðir](/foundation/message-types/resources/) | Uppflettingar á tilföngum og aðgerðir á tilfangafærslum. |
| [Samþykktarskilaboðagerðir](/foundation/message-types/approval/) | Senda skjöl í samþykkt og bregðast við samþykktarfærslum. |
| [Breytingaskrárskilaboðagerðir](/foundation/message-types/change-log/) | `ChangeLog.Field.History`, `ChangeLog.Field.Restore` og `ChangeLog.Field.Enabled`, þar með taldar stillingar skrifvarnarinnar. |
| [Skilaboðagerðir fyrir skjöl á innleið](/foundation/message-types/incoming-documents/) | Búa til, tengja, vinna úr og sækja skjöl á innleið. |
| [Minnisskilaboðagerðir](/foundation/message-types/memory/) | Minni á fyrirtækis- og notandastigi. |
| [Notenda- og tilkynningaskilaboðagerðir](/foundation/message-types/user/) | `User.Notification` og skyldar gerðir. |
| [Skilaboðagerðatilvísun](/foundation/reference/message-types/) | Sjálfvirkt myndaður beiðni- og svarsamningur fyrir hverja einustu skilaboðagerð. |

Hjálparsíður einstakra skilaboðagerða sem Business Central tengir beint í:
[CSV.Records.Get](/help/foundation/csv-records-get/),
[Data.Totals.Get](/help/foundation/data-totals-get/),
[Help.NextLineNo.Get](/help/foundation/help-next-line-no-get/),
[ChangeLog.Field.History](/help/foundation/change-log-field-history/),
[ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/),
[ChangeLog.Field.Enabled](/help/foundation/change-log-field-enabled/).

## Fyrstu skref

1.  Opnaðu **Bifröst uppsetningu** og stilltu útfærslugerðir og sjálfgefið tungumál.
2.  Sendu prufuskilaboð í gegnum Task API til að staðfesta tengingu.
3.  Notaðu **Bifröst skilaboð** listann til að fylgjast með vinnsluniðurstöðum.
