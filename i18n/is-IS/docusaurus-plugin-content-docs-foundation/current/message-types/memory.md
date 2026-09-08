---
id: memory
title: "Memory message types"
sidebar_position: 12
---

Þetta skjal lýsir minnistengdum skilaboðategundum í Bifröst Foundation.

## Yfirlit

Minnisskilaboðategundir veita varanlega lykil-gildi Blob-geymslu fyrir Bifröst-samþættingar. Færslur geyma GUID-auðkenni, lýsingu og frjálsan UTF-8 texta í Blob-reit. Tveir umfangshópar eru í boði:

- **Fyrirtækjasviðs** (`Memory.Company.*`) — samnýtt á milli allra auðkenndra notenda innan fyrirtækis. Einangrun er sjálfvirk með `DataPerCompany = true`.
- **Notandasviðs** (`Memory.User.*`) — einkagögn hvers notanda. Framfylgt með `FilterGroup(2)` á `User Name`-reitnum, þannig að hver notandi sér aðeins sínar eigin færslur.

## Listi yfir skilaboðategundir

| Skilaboðategund | Stefna | Tilgangur |
|-----------------|--------|-----------|
| [Memory.Company.Get](#memorycompanyget) | Útlæg | Sækir minnisfærslur á fyrirtækjasvið |
| [Memory.Company.List](#memorycompanylist) | Útlæg | Listar minnisfærslur á fyrirtækjasvið (aðeins auðkenni og lýsing) |
| [Memory.Company.Set](#memorycompanyset) | Innlæg | Setur inn eða uppfærir minnisfærslur á fyrirtækjasvið |
| [Memory.User.Get](#memoryuserget) | Útlæg | Sækir minnisfærslur á notandasvið (einkagögn) |
| [Memory.User.List](#memoryuserlist) | Útlæg | Listar minnisfærslur á notandasvið (aðeins auðkenni og lýsing) |
| [Memory.User.Set](#memoryuserset) | Innlæg | Setur inn eða uppfærir minnisfærslur á notandasvið |

---

## Memory.Company.Get

**Stefna**: Útlæg (Svar við beiðni)

**Tilgangur**: Sækir minnisfærslur á fyrirtækjasvið. Allir auðkenndir notendur í fyrirtækinu geta lesið þessar færslur.

### Beiðnisnið

Bifröst-færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Memory.Company.Get",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

#### Gagnafæribreytur beiðni

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
|------------|--------|------------|--------|
| `skip` | Integer | Nei | Fjöldi færslna til að sleppa (síðuskipting). Sjálfgefið 0. |
| `take` | Integer | Nei | Hámarksfjöldi færslna. Sjálfgefið 100. 0 = allar. |
| `tableView` | String | Nei | BC-töflusýn-síunarsjóður. |

#### Dæmi — Síðuskipt beiðni

```json
{
  "skip": 0,
  "take": 10
}
```

#### Dæmi — Sía eftir Id

```json
{
  "tableView": "WHERE(Id=FILTER(a1b2c3d4-e5f6-7890-abcd-ef1234567890))"
}
```

### Svarsnið

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | String | `"Success"` eða `"Error"` |
| `noOfRecords` | Integer | Heildarfjöldi færslna sem uppfylla síu (fyrir skip/take) |
| `result` | Array | Fylki af færslum |

Hver færsla:

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `id` | GUID | Auðkenni minnisfærslu (aðallykill) |
| `description` | String | Lýsing (hámark 2048 stafir) |
| `memory` | String | UTF-8 textainnihald úr Blob-reit |

#### Svardæmi

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Sameiginleg fyrirtækjastilling",
      "memory": "{\"theme\":\"dark\"}"
    }
  ]
}
```

### Töflutilvísun

**Tafla**: Bifröst Memory (10077904)

| Nr. | Heiti | Tegund | Í aðallykli |
|-----|-------|--------|-------------|
| 4 | Id | GUID | Já |
| 5 | Description | Text[2048] | Nei |
| 6 | Memory | Blob (UTF-8 texti) | Nei |

### Aðgangsreglur

- Allir auðkenndir notendur geta lesið fyrirtækjasviðs-færslur.
- Fyrirtækjaeinangrun er sjálfvirk með `DataPerCompany = true`.

---

## Memory.Company.List

**Stefna**: Útlæg (Svar við beiðni)

**Tilgangur**: Listar minnisfærslur á fyrirtækjasvið og skilar aðeins `id` og `description`. Minnisblobbinnihald er útilokað til að auðvelda létta uppflettingu. Notaðu `Memory.Company.Get` til að sækja fullt minnisinnihald.

### Beiðnisnið

Bifröst-færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Memory.Company.List",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

#### Gagnafæribreytur beiðni

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
|------------|--------|------------|--------|
| `skip` | Integer | Nei | Fjöldi færslna til að sleppa (síðuskipting). Sjálfgefið 0. |
| `take` | Integer | Nei | Hámarksfjöldi færslna. Sjálfgefið 100. 0 = allar. |
| `tableView` | String | Nei | BC-töflusýn-síunarsjóður. |

#### Dæmi — Síðuskipt beiðni

```json
{
  "skip": 0,
  "take": 10
}
```

### Svarsnið

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | String | `"Success"` eða `"Error"` |
| `noOfRecords` | Integer | Heildarfjöldi færslna sem uppfylla síu (fyrir skip/take) |
| `result` | Array | Fylki af færslum |

Hver færsla:

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `id` | GUID | Auðkenni minnisfærslu (aðallykill) |
| `description` | String | Lýsing (hámark 2048 stafir) |

> **Athugið**: Minnisblobreiturinn er viljandi undanskilinn. Notaðu `Memory.Company.Get` til að sækja fullt innihald.

#### Svardæmi

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Sameiginleg fyrirtækjastilling"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "description": "Samþættingarstillingar"
    }
  ]
}
```

### Töflutilvísun

**Tafla**: Bifröst Memory (10077904)

| Nr. | Heiti | Tegund | Í aðallykli | Innifalið |
|-----|-------|--------|-------------|----------|
| 4 | Id | GUID | Já | Já |
| 5 | Description | Text[2048] | Nei | Já |
| 6 | Memory | Blob (UTF-8 texti) | Nei | **Nei** |

### Aðgangsreglur

- Allir auðkenndir notendur geta lesið fyrirtækjasviðs-færslur.
- Fyrirtækjaeinangrun er sjálfvirk með `DataPerCompany = true`.

---

## Memory.Company.Set

**Stefna**: Innlæg (Skrifaðgerð)

**Tilgangur**: Setur inn eða uppfærir minnisfærslur á fyrirtækjasvið. Ef færsla með tilgreindu `id` er til er hún uppfærð; annars er ný færsla sett inn með sjálfvirkri GUID.

### Beiðnisnið

Bifröst-færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Memory.Company.Set",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{\"data\":[{\"description\":\"stilling\",\"memory\":\"{}\"}]}"
}
```

#### Gagnafæribreytur beiðni

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
|------------|--------|------------|--------|
| `data` | Array | Já | Fylki af færslum til að setja inn eða uppfæra |

Hver færsla:

| Eiginleiki | Tegund | Nauðsynlegur | Lýsing |
|------------|--------|--------------|--------|
| `id` | GUID | Nei | Auðkenni minnisfærslu. Ef til staðar og til, uppfærir. Ef sleppt, setur inn nýja færslu. |
| `description` | String | Nei | Lýsing (hámark 2048 stafir) |
| `memory` | String | Nei | UTF-8 texti til að geyma í Blob-reit |

#### Dæmi — Setja inn nýja færslu

```json
{
  "data": [
    {
      "description": "Sameiginleg fyrirtækjastilling",
      "memory": "{\"settings\": {}}"
    }
  ]
}
```

#### Dæmi — Uppfæra fyrirliggjandi færslu

```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Uppfærð fyrirtækjastilling",
      "memory": "{\"settings\": {\"updated\": true}}"
    }
  ]
}
```

### Svarsnið

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | String | `"Success"` eða `"Error"` |
| `insertedCount` | Integer | Fjöldi nýrra færslna |
| `modifiedCount` | Integer | Fjöldi uppfærðra færslna |
| `result` | Array | Fylki af unnum færslum (sama snið og Memory.Company.Get) |

#### Svardæmi

```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Sameiginleg fyrirtækjastilling",
      "memory": "{\"settings\": {}}"
    }
  ]
}
```

### Töflutilvísun

**Tafla**: Bifröst Memory (10077904)

| Nr. | Heiti | Tegund | Skrifanlegt |
|-----|-------|--------|-------------|
| 4 | Id | GUID | Já (sjálfvirkt ef sleppt) |
| 5 | Description | Text[2048] | Já |
| 6 | Memory | Blob | Já (UTF-8 texti) |

### Aðgangsreglur

- **Nýjar færslur**: Allir auðkenndir notendur geta stofnað.
- **Fyrirliggjandi færslur**: Allir auðkenndir notendur í sama fyrirtæki geta uppfært.

---

## Memory.User.Get

**Stefna**: Útlæg (Svar við beiðni)

**Tilgangur**: Sækir minnisfærslur á notandasvið. Aðeins stofnandinn getur lesið sínar eigin færslur.

### Beiðnisnið

Bifröst-færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Memory.User.Get",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

#### Gagnafæribreytur beiðni

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
|------------|--------|------------|--------|
| `skip` | Integer | Nei | Fjöldi færslna til að sleppa (síðuskipting). Sjálfgefið 0. |
| `take` | Integer | Nei | Hámarksfjöldi færslna. Sjálfgefið 100. 0 = allar. |
| `tableView` | String | Nei | BC-töflusýn-síunarsjóður. |

#### Dæmi — Síðuskipt beiðni

```json
{
  "skip": 0,
  "take": 10
}
```

### Svarsnið

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | String | `"Success"` eða `"Error"` |
| `noOfRecords` | Integer | Heildarfjöldi færslna sem uppfylla síu (fyrir skip/take) |
| `result` | Array | Fylki af færslum |

Hver færsla:

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `id` | GUID | Auðkenni minnisfærslu |
| `description` | String | Lýsing (hámark 2048 stafir) |
| `memory` | String | UTF-8 textainnihald úr Blob-reit |

#### Svardæmi

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Mínar persónulegu stillingar",
      "memory": "{\"theme\":\"dark\"}"
    }
  ]
}
```

### Töflutilvísun

**Tafla**: User Memory ori (10077905)

| Nr. | Heiti | Tegund | Í aðallykli |
|-----|-------|--------|-------------|
| 1 | User Name | Code[50] | Já |
| 2 | Id | GUID | Já |
| 3 | Description | Text[2048] | Nei |
| 4 | Memory | Blob (UTF-8 texti) | Nei |

### Aðgangsreglur

- Aðeins stofnandinn getur lesið sínar eigin notandasviðs-færslur.
- Færslum er sjálfkrafa síað eftir `User Name = núverandi notandi` með `FilterGroup(2)`.
- `User Name` er sjálfkrafa sett á innlögn frá núverandi notendaauðkenni.

---

## Memory.User.List

**Stefna**: Útlæg (Svar við beiðni)

**Tilgangur**: Listar minnisfærslur á notandasvið og skilar aðeins `id` og `description`. Minnisblobbinnihald er útilokað til að auðvelda létta uppflettingu. Aðeins stofnandinn getur séð sínar eigin færslur. Notaðu `Memory.User.Get` til að sækja fullt minnisinnihald.

### Beiðnisnið

Bifröst-færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Memory.User.List",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

#### Gagnafæribreytur beiðni

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
|------------|--------|------------|--------|
| `skip` | Integer | Nei | Fjöldi færslna til að sleppa (síðuskipting). Sjálfgefið 0. |
| `take` | Integer | Nei | Hámarksfjöldi færslna. Sjálfgefið 100. 0 = allar. |
| `tableView` | String | Nei | BC-töflusýn-síunarsjóður. |

#### Dæmi — Síðuskipt beiðni

```json
{
  "skip": 0,
  "take": 10
}
```

### Svarsnið

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | String | `"Success"` eða `"Error"` |
| `noOfRecords` | Integer | Heildarfjöldi færslna sem uppfylla síu (fyrir skip/take) |
| `result` | Array | Fylki af færslum |

Hver færsla:

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `id` | GUID | Auðkenni minnisfærslu |
| `description` | String | Lýsing (hámark 2048 stafir) |

> **Athugið**: Minnisblobreiturinn er viljandi undanskilinn. Notaðu `Memory.User.Get` til að sækja fullt innihald.

#### Svardæmi

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Mínar persónulegu stillingar"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "description": "Vistaðar leitarsíur"
    }
  ]
}
```

### Töflutilvísun

**Tafla**: User Memory ori (10077905)

| Nr. | Heiti | Tegund | Í aðallykli | Innifalið |
|-----|-------|--------|-------------|----------|
| 1 | User Name | Code[50] | Já | Nei |
| 2 | Id | GUID | Já | Já |
| 3 | Description | Text[2048] | Nei | Já |
| 4 | Memory | Blob (UTF-8 texti) | Nei | **Nei** |

### Aðgangsreglur

- Aðeins stofnandinn getur lesið sínar eigin notandasviðs-færslur.
- Færslum er sjálfkrafa síað eftir `User Name = núverandi notandi` með `FilterGroup(2)`.
- `User Name` er sjálfkrafa sett á innlögn frá núverandi notendaauðkenni.

---

## Memory.User.Set

**Stefna**: Innlæg (Skrifaðgerð)

**Tilgangur**: Setur inn eða uppfærir minnisfærslur á notandasvið. Aðeins stofnandinn getur lesið og breytt sínum eigin færslum.

### Beiðnisnið

Bifröst-færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Memory.User.Set",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{\"data\":[{\"description\":\"mínar stillingar\",\"memory\":\"{}\"}]}"
}
```

#### Gagnafæribreytur beiðni

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
|------------|--------|------------|--------|
| `data` | Array | Já | Fylki af færslum til að setja inn eða uppfæra |

Hver færsla:

| Eiginleiki | Tegund | Nauðsynlegur | Lýsing |
|------------|--------|--------------|--------|
| `id` | GUID | Nei | Auðkenni minnisfærslu. Ef til staðar og til, uppfærir. Ef sleppt, setur inn nýja færslu. |
| `description` | String | Nei | Lýsing (hámark 2048 stafir) |
| `memory` | String | Nei | UTF-8 texti til að geyma í Blob-reit |

#### Dæmi — Setja inn nýja færslu

```json
{
  "data": [
    {
      "description": "Mínar persónulegu stillingar",
      "memory": "{\"theme\":\"dark\"}"
    }
  ]
}
```

#### Dæmi — Uppfæra fyrirliggjandi færslu

```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Uppfærðar persónulegar stillingar",
      "memory": "{\"theme\":\"light\"}"
    }
  ]
}
```

### Svarsnið

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | String | `"Success"` eða `"Error"` |
| `insertedCount` | Integer | Fjöldi nýrra færslna |
| `modifiedCount` | Integer | Fjöldi uppfærðra færslna |
| `result` | Array | Fylki af unnum færslum (sama snið og Memory.User.Get) |

#### Svardæmi

```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Mínar persónulegu stillingar",
      "memory": "{\"theme\":\"dark\"}"
    }
  ]
}
```

### Töflutilvísun

**Tafla**: User Memory ori (10077905)

| Nr. | Heiti | Tegund | Skrifanlegt |
|-----|-------|--------|-------------|
| 1 | User Name | Code[50] | Nei (sjálfvirkt sett á núverandi notanda) |
| 2 | Id | GUID | Já (sjálfvirkt ef sleppt) |
| 3 | Description | Text[2048] | Já |
| 4 | Memory | Blob | Já (UTF-8 texti) |

### Aðgangsreglur

- **Nýjar færslur**: Aðeins sýnilegar stofnanda.
- **Fyrirliggjandi færslur**: Aðeins upprunalegi stofnandinn getur uppfært (framfylgt með `User Name`-samsvörun).
- `User Name` er sjálfkrafa sett á innlögn frá núverandi notendaauðkenni.
- Aðrir notendur geta ekki séð né breytt þessum færslum.

---

## Heimildarsett

| Heimildarsett | Auðk. | Lýsing |
|---|---|---|
| Bifröst Company Memory | 10077891 | Veitir RIMD-aðgang að Bifröst Memory- og Translation ori-töflum. Úthlutaðu notendum sem þurfa fulla minnistjórnun. |

---

## Tengd skjöl

- [API-tilvísun](/foundation/reference/api/) — Heildar API-endapunktaskjöl
- [Uppsetningartilvísun](/foundation/reference/setup/) — Stilling og heimildarsett
- [Gagnaskilaboðategundir](/foundation/message-types/data/) — Almennar aðgerðir gagnaferla
