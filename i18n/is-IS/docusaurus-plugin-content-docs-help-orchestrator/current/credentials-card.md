---
id: credentials-card
title: "Spjald auðkenni biðlara"
sidebar_label: "Spjald auðkenni biðlara"
sidebar_position: 2
---

Á **Spjald auðkenni biðlara** stofnar þú og viðheldur einu auðkennispari biðlara: OAuth 2.0
biðlaraauðkenninu og leyniorðinu sem Bifröst stjórnandi notar þegar vinnsluraðarfærsla kallar á ytri
þjónustu. Opnaðu spjaldið af listanum [Auðkenni biðlara](/help/orchestrator/credentials-list/).

Gildin tvö eru ekki reitir á spjaldinu. Þau eru geymd í leyndarmálageymslu Bifröst, aðeins fyrir þetta
fyrirtæki, og eru aldrei sýnd aftur. Spjaldið sýnir aðeins hvort hvort gildi hafi verið skráð.

## Almennt {#general}

| Reitur | Lýsing |
| --- | --- |
| **Kóði** | Einstæður kóði auðkennisparsins. Skyldureitur. Vinnsluraðarfærslur vísa í hann í reitnum **Kóði biðlaraauðkenningar**. |
| **Lýsing** | Til hvers auðkennisparið er notað. |

## Leyndarmál {#secrets}

| Reitur | Lýsing |
| --- | --- |
| **Auðkenni biðlara** | **Skráð** þegar biðlaraauðkennið hefur verið skráð, annars **Ekki skráð**. |
| **Leyniorð biðlara** | **Skráð** þegar leyniorð biðlara hefur verið skráð, annars **Ekki skráð**. |

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Skrá auðkenni biðlara** | Opnar gluggann [Skrá leyndarmál](/help/foundation/set-secret-dialog/) þar sem þú slærð inn biðlaraauðkennið sem ytri þjónustan gaf út. Fylltu fyrst út **Kóði**. |
| **Skrá leyniorð biðlara** | Opnar sama glugga fyrir leyniorð biðlara. |
| **Hreinsa leyndarmál** | Fjarlægir bæði geymdu gildin þegar þú hefur staðfest. Spjaldið sýnir þá **Ekki skráð** fyrir bæði. |

## Gott að vita {#good-to-know}

- Ef kóða færslunnar er breytt flytjast bæði gildin á nýja kóðann; ef færslunni er eytt eru þau fjarlægð.
- Bæði gildin eru líka sýnd, aðeins sem staða, á [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/).
  **Leyndarmál forrits** á [Uppsetning Bifröst stjórnanda](/help/orchestrator/orchestrator-setup/) opnar
  þann lista síaðan á þetta forrit.
- Veldu auðkennisparið fyrir vinnsluraðarfærslu í reitnum **Kóði biðlaraauðkenningar** á
  [Spjald vinnsluraðarafærslu](/help/orchestrator/scheduled-entry-card/).
