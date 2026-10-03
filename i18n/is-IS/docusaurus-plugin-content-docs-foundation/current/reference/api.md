---
id: api
title: "API reference"
sidebar_position: 2
---

## Yfirlit

Origo Bifröst-endingurinn veitir API-endapunkta til að stjórna og vinna með skilaboð í samræmi við Bifröst-staðalinn. Þetta skjal lýsir API-endapunktunum, skilaboðaumslaginu og formi svaranna.

**API-útgefandi:** `origo`  
**API-hópur:** `bifrost`  
**API-útgáfa:** `v1.0`

---

## API-endapunktar

### 1. Bifröst Data API — Svarsgögn {#bifrost-data-api-response-data}

**Tilgangur:** Skilar svarsgagnasniðið fyrir tiltekin skilaboð.

**Endapunktsupplýsingar:**

- **Einingaheiti:** `response`
- **Einingasettaheiti:** `responses`
- **Grunnslóð:** `/api/origo/bifrost/v1.0/responses`
- **Aðgangur:** Eingöngu lestur (engar setja-inn eða breyta-aðgerðir)

**Reitir:**

| Reitnafn | Tegund | Lýsing |
|---|---|---|
| `id` | Guid | Einkvæmt auðkenni skilaboðanna |
| `data` | Blob | Svarsgagnasniðið |

**Studdar aðgerðir:**

- **GET** (ein): Sækir svarsgögn fyrir tiltekin skilaboð eftir auðkenni
- **GET** (safn): Sækir öll svarsgagnagildi

**Dæmi um beiðni:**

```http
GET /api/origo/bifrost/v1.0/responses('{message-id}')
```

---

### 1b. Request Data API ori — Upprunalegar beiðnigögn

**Tilgangur:** Skilar upprunalegar beiðnigögn fyrir tiltekin skilaboð. Gagnlegt til að skoða eða endursenda beiðni.

**Endapunktsupplýsingar:**

- **Einingaheiti:** `request`
- **Einingasettaheiti:** `requests`
- **Grunnslóð:** `/api/origo/bifrost/v1.0/requests`
- **Aðgangur:** Eingöngu lestur

**Reitir:**

| Reitnafn | Tegund | Lýsing |
|---|---|---|
| `id` | Guid | Einkvæmt auðkenni skilaboðanna |
| `data` | Blob | Upprunaleg beiðnifærmibreyta (JSON, XML eða venjulegur texti) |

**Sækja gögn beint (ráðlæg leið):**

```http
GET /api/origo/bifrost/v1.0/requests('{message-id}')/data
Authorization: Bearer {token}
```

**Öryggi:** Niðurstöður takmarkast við skilaboð sem kallandi auðkenni stofnaði.

---

### 2. Queue API ori {#queue-api-ori}

**Tilgangur:** Stofna skilaboðabeiðnir og fá stöður fyrir í biðröð (ósamstillt) skilaboð.

**Endapunktsupplýsingar:**

- **Einingaheiti:** `queue`
- **Einingasettaheiti:** `queues`
- **Grunnslóð:** `/api/origo/bifrost/v1.0/queues`
- **Vinnsluháttur:** Ósamstilltur (skilaboð eru tímasett fyrir bakgrunnsvinnslu)

**Reitir:**

| Reitnafn | Tegund | Lýsing | Nauðsynlegt |
|---|---|---|---|
| `specversion` | Text | Bifröst-staðal útgáfa | Já |
| `type` | Enum | Skilaboðategundarauðkenni | Já |
| `source` | Text | Lýsing forrita (t.d., "MyApp v1.2.3") | Já |
| `id` | Guid | Einkvæmt auðkenni (sjálfkrafa búið til) | Nei |
| `time` | DateTime | Viðburðartímastimpill | Nei |
| `subject` | Text | Efni viðburðar | Nei |
| `continueFromRecordId` | Guid | SystemId færslu til að halda áfram frá (t.d. í stórum CSV-útflutningi). Slepptu fyrir fyrstu beiðni. | Nei |
| `lcid` | Integer | Windows Language ID (t.d. 1033 = Enska, 1039 = Íslenska). Sjálfgefið: Default Language Code úr Bifröst Setup. | Nei |
| `datacontenttype` | Text | Efnistegund gagna (application/json, application/xml, text/plain) | Nei |
| `data` | BigText | Beiðnifæribreytur (JSON, XML eða texti) | Nei |

**Studdar aðgerðir:**

#### POST — Stofna biðraðarskilaboð

Stofnar nýja skilaboðabeiðni sem verður unnin ósamstillt.

**Dæmi um beiðnisniðmát:**

```json
{
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0",
  "lcid": 1033
}
```

**Svar:** Skilar stofnuðum skilaboðum með úthlutaðri auðkenni og tímastimpli. Þegar vinnsla er lokið mun `data` reiturinn innihalda niðurhalsslóð til að sækja svarsgögnin.

#### GET — Sækja biðraðarskilaboð

```http
GET /api/origo/bifrost/v1.0/queues
```

---

### Queue API-aðgerðir

#### RetryTask

Reynir aftur vinnslu skilaboða í Bifröst.

**Endapunktur:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.RetryTask
```

**HTTP-stöðugildi:**

| Merkingarleg staða | HTTP-stöðukóði | Lýsing |
|---|---|---|
| Created | 201 Created | Verk er þegar í gangi og ekki hægt að reyna aftur |
| Updated | 200 OK | Verk var endurræst |
| None | 204 No Content | Mistókst að stofna nýtt bakgrunnsverk |

---

#### CancelTask

Hættir við tímasett verk fyrir skilaboð í Bifröst.

**Endapunktur:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.CancelTask
```

**HTTP-stöðugildi:**

| Merkingarleg staða | HTTP-stöðukóði | Lýsing |
|---|---|---|
| Deleted | 204 No Content | Ekkert verk var tímasett |
| Updated | 200 OK | Verki var aflýst |
| None | 204 No Content | Aflýsing verks mistókst |

---

#### GetStatus

Sækir stöðu skilaboða í Bifröst.

**Endapunktur:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.GetStatus
```

**Stöðugildi:**

- **Created**: Skilaboðin eru enn í vinnslu
- **Deleted**: Ekki er tímasett verk
- **Updated**: Vinnslu er lokið og niðurstöður eru tiltækar
- **None**: Staða skilaboðanna er óþekkt

---

### 3. Task API ori {#task-api-ori}

**Tilgangur:** Stofna og vinna skilaboð í Bifröst samstillt (bein vinnsla).

**Endapunktsupplýsingar:**

- **Einingaheiti:** `task`
- **Einingasettaheiti:** `tasks`
- **Grunnslóð:** `/api/origo/bifrost/v1.0/tasks`
- **Vinnsluháttur:** Samstilltur (skilaboð eru unnin samstundis við stofnun)

**Reitir:** Sömu reitir og Queue API. `lcid` er **ekki** stutt í Task API — notaðu Queue API fyrir tungumálsstillt svör.

**Studdar aðgerðir:**

#### POST — Stofna og vinna verk

Stofnar ný skilaboð og vinnur þau samstundis. Svarið mun innihalda niðurhalsslóð að svarsgögnunum í `data` reitnum.

**Dæmi um beiðnisniðmát:**

```json
{
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

---

## Skilaboðategundir

Hver aðgerð er **skilaboðategund** sem er nefnd í `type` reit umslagsins. Uppsettar skilaboðategundir
og samningar þeirra eru lesnir úr Business Central sjálfu: MCP-tólin `list_message_types` og
`describe_message_type`, eða síðan Bifrost Message Types. Í gegnum API-ið skilar
`Help.MessageTypes.Get` listanum og `Help.Implementation.Get` (með heiti tegundarinnar sem `subject`)
skilar fullum beiðni- og svarsamningi einnar tegundar. Allar innbyggðar skilaboðategundir taka
færibreytur sínar sem JSON í `data` reitnum.

Önnur Bifröst-forrit bæta eigin skilaboðategundum í sama safn; þær eru taldar upp og þeim lýst á sama hátt.

---

## Viðburðir og vefkrókar

Bifröst-endingurinn veitir **ytri viðskiptaviðburði** sem gera ytri kerfum kleift að fá vefkrókstilkynningar þegar skilaboð líkja eða mistakast við vinnslu. Þetta eyðir þörfina fyrir samfellda könnun og gerir kleift að nota sanna viðburðsdrifna skipan.

### Vefkrókstilkynningar

**Viðburðamynstur:** Lágmarks-tilkynning + API-sæki

1. Ytri kerfi sendir skilaboð í Queue API eða Task API
2. Business Central vinnur skilaboðin ósamstillt (Queue API) eða samstillt (Task API)
3. Þegar vinnslu er lokið eða mistakast, heldur BC uppi ytri viðskiptaviðburðinum
4. Áskrifaðir endapunktar fá lágmarkstilkynningu (MessageId, MessageType, Timestamp)
5. Ytri kerfi kallar á Data API með MessageId til að sækja fullt svar

### Tiltækir viðburðir

| Viðburðarheiti | Þegar haldið uppi | Vefkróksgreiðsla | Notkunartilvik |
|---|---|---|---|
| **BifrostMessageCompleted** | Vinnsla skilaboða tekst | `{ MessageId, MessageType, ResponseContentLink, Timestamp }` | Tilkynna ytri kerfum um farsæla lok |
| **BifrostMessageFailed** | Vinnsla skilaboða mistekst | `{ MessageId, MessageType, ResponseContentLink, Timestamp }` | Viðvara um vinnslubilun |

### Uppsetning

Stilltu vefkrókáskriftir í gegnum **Event Subscriptions** síðu í Business Central:

1. Farðu í **Event Subscriptions**
2. Stofnaðu nýja áskrift
3. Veldu viðburð: `BifrostMessageCompleted` eða `BifrostMessageFailed`
4. Stilltu **Event Category**: "Origo Bifröst"
5. Stilltu endapunktsslóð og auðkenningu
6. Virkjaðu áskrift

Nánar um uppsetningu vefkróka, öryggi og kóðadæmi: **[Atburðir og vefkrókar](/foundation/reference/events-and-webhooks/)**

---

## Auðkenning

Allir API-endapunktar krefjast auðkenningar með OAuth 2.0 eða Basic Authentication eins og stillt er í Business Central.

**Nauðsynlegar heimildir:**

- Notendur verða að hafa viðeigandi heimildir skilgreindar í `BIFROST Full ori` heimildarsetti.

### Gagnaeinangrun — Entra-forritamarkur

Allir Bifröst-endapunktar (`/tasks`, `/queues`, `/responses`, `/requests`) framfylgja **strangri gagnaeinangrun á Entra-forritastigi**.

Hvert svar takmarkast við skilaboð sem auðkennið sem auðkenndi beiðnina stofnaði: fyrir samþættingu er það **Entra-forrit** hennar.

**Afleiðingar:**

| Atvik | Niðurstaða |
|---|---|
| Forrit A sækir `/queues` | Skilar aðeins skilaboðum sem Forrit A sendi |
| Forrit A biður um `/responses({id})` stofnað af Forriti B | Skilar tómt — engin gagnaleki |
| Forrit A biður um `/requests({id})` stofnað af Forriti B | Skilar tómt — engin gagnaleki |
| Tvö forrit deila sama fyrirtæki + umhverfi | Sérhvert sér aðeins eigin skilaboðaferil |

Þessi einangrun er **skilyrðislaus** — hana er ekki hægt að víkka með OData síum.

---

## Notkunardæmi

### Dæmi 1: Sækja lista yfir skilaboðategundir (samstillt)

**Beiðni:**

```http
POST /api/origo/bifrost/v1.0/tasks
Content-Type: application/json

{
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

**Svar:**

```json
{
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0",
  "id": "12345678-1234-1234-1234-123456789abc",
  "time": "2026-02-19T10:30:00Z",
  "datacontenttype": "text/json",
  "data": "/api/origo/bifrost/v1.0/responses(12345678-1234-1234-1234-123456789abc)"
}
```

---

### Dæmi 2: Sækja hjálp einnar skilaboðategundar (ósamstillt)

**Skref 1: Setja í biðröð**

```http
POST /api/origo/bifrost/v1.0/queues
Content-Type: application/json

{
  "specversion": "1.0",
  "type": "Help.Implementation.Get",
  "subject": "{message-type}",
  "source": "MyIntegrationApp v1.0",
  "datacontenttype": "application/json"
}
```

**Skref 2a: Valinn — Kanna stöðu (könnun)**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.GetStatus
```

**Skref 2b: Ráðlægt — Vefkrókstilkynning**

Gerast áskrifandi að `BifrostMessageCompleted` viðburðinum og fáðu sjálfvirka tilkynningu:

```json
{
  "MessageId": "{message-id}",
  "MessageType": "Help.Implementation.Get",
  "ResponseContentLink": "/api/origo/bifrost/v1.0/responses({message-id})/data",
  "Timestamp": "2026-03-08T14:30:22Z"
}
```

**Skref 3: Sækja niðurstöður**

```http
GET /api/origo/bifrost/v1.0/responses('{message-id}')/data
Authorization: Bearer {token}
```

Svarsgögnin eru hjálp skilaboðategundarinnar sem nefnd er í `subject`, á Markdown-sniði.

---

## Tengd skjöl

- **[Atburðir og vefkrókar](/foundation/reference/events-and-webhooks/)**: vefkrókar og ytri viðskiptaatburðir
- **[Uppsetningarviðmiðun](/foundation/reference/setup/)**: uppsetningarsíða Bifröst og stillingarnar að baki henni
- **[Aðgangur að svæðum](/foundation/reference/field-access-restrictions/)**: takmarkanir á lestri og skrifum einstakra svæða
