---
id: bifrost-messages
title: "Bifröst skilaboð"
sidebar_label: "Bifröst skilaboð"
sidebar_position: 12
---

Síðan **Bifröst skilaboð** sýnir öll Bifröst skilaboð sem kerfið hefur móttekið. Skilaboð eru raðuð eftir dagsetningu/tíma í lækkandi röð (nýjust fyrst). Héðan getur þú fylgst með vinnslustöðu, sótt beiðni- og svargögn, reynt aftur eða hætt við bakgrunnsverkefni og breytt gagnafarm beiðna.

## Dálkar

| Dálkur | Lýsing |
| --- | --- |
| **Kenni** | Einkvæmt auðkenni (GUID) skilaboðanna. |
| **Útgáfa** | Útgáfa Bifröst forskriftar (t.d. 1.0). |
| **Tegund** | Skilaboðagerð sem ákvarðar hvernig unnið er úr skilaboðunum (t.d. `Customer.CreditLimit.Get`). |
| **Staða** | Núverandi vinnslustaða: _Vinnslu lokið_, _Vinnsla í gangi_, _Vinnsla ekki í gangi_, eða _Engin vinnsla áætluð_. |
| **Uppruni** | Ytra kerfið eða forritið sem sendi skilaboðin. |
| **Efni** | Frjáls texti sem lýsir innihaldi skilaboðanna. |
| **Tungumál** | Tungumálið sem skilaboðin verða unnin á. |
| **Dagsetning og tími** | Hvenær skilaboðin voru móttekin. |
| **Síðast breytt** | Hvenær skilaboðin voru síðast uppfærð í kerfinu. |
| **Efnistegund gagna** | MIME-tegund gagnafarms (t.d. `application/json`). |
| **Lengd gagna beiðni** | Stærð (bæti) komandi gagnafarms. Falið sjálfgefið. |
| **Lengd svargagna** | Stærð (bæti) svargagna eftir vinnslu. Falið sjálfgefið. |
| **Kenni verks** | Auðkenni bakgrunnsverksins. Falið sjálfgefið. |

## Aðgerðir

### Vinnsla

| Aðgerð | Lýsing |
| --- | --- |
| **Reyna vinnslu aftur** | Enduráætlar bakgrunnsvinnsluna til að vinna aftur úr völdum skilaboðum. Notaðu þegar vinnsla hefur mistókst. |
| **Keyra vinnslu** | Vinnur úr völdum skilaboðum samstillt í núverandi lotu í stað þess að bíða eftir áætluðu bakgrunnsvinnslunni. |
| **Hætta við vinnslu** | Hættir við áætlaða bakgrunnsvinnslu. Verkefnið er fjarlægt úr verkáætlun. |

### Beiðni

| Aðgerð | Lýsing |
| --- | --- |
| **Sækja skrá** | Sækir gagnafarm beiðni sem skrá (JSON, XML eða TXT eftir efnistegund). |
| **Breyta** | Opnar [Ritil Bifröst skilaboða](/help/foundation/bifrost-message-editor/) svo þú getir skoðað eða breytt beiðnigögnunum. |

### Svar

| Aðgerð | Lýsing |
| --- | --- |
| **Sækja skrá** | Sækir niðurstöðu vinnslu / svargögn sem skrá. |

## Upplýsingareitir

-   **Gögn beiðni** – sýnir komandi gagnafarm valins skilaboðs. Sjá [Bifröst beiðni](/help/foundation/bifrost-request/).
-   **Svargögn** – sýnir svargögnin eftir vinnslu. Sjá [Bifröst svar](/help/foundation/bifrost-response/).
