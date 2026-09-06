---
id: projects
title: "Projects message types"
sidebar_position: 7
---

Þetta skjal lýsir skilaboðategundum tengdum verkefnum (Jobs) í Bifröst Foundation.

## Yfirlit

Skilaboðategundir fyrir verkefni bjóða upp á virkni til að vinna með verkefnadagbækur, þar með talið stofnun lína, sannvottun og bókun.

## Listi yfir skilaboðategundir

| Skilaboðategund | Stefna | Tilgangur |
|----------------|--------|-----------|
| [Projects.ProjectJournal.SetupNewLine](#projectsprojectjournalsetupnewline) | Innlæg | Stofnar nýja verkefnadagbókarlínu með sjálfgefnum gildum |
| [Projects.ProjectJournal.Check](#projectsprojectjournalcheck) | Útlæg | Sannvirðir verkefnadagbókarrunu |
| [Projects.ProjectJournal.Post](#projectsprojectjournalpost) | Innlæg | Bókar verkefnadagbókarrunu |
| [Projects.ProjectJournal.PreviewPost](#projectsprojectjournalpreviewpost) | Innlæg | Hermir bókun á verkefnadagbókarrunu og skilar spáðum færslum (afturkallað) |

---

## Projects.ProjectJournal.SetupNewLine

**Stefna**: Innlæg

**Tilgangur**: Stofnar og setur inn nýja verkefnadagbókarlínu með sjálfgefnum gildum úr BC `SetUpNewLine` ferli. Sjálfgefin gildi (verkefnisnúmer, bókunardagsetning, sviðsgildi) erfast frá sniðmáti og runu. Skjalanúmer er fyllt út úr númeraröð runu ef stillt er.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Projects.ProjectJournal.SetupNewLine",
  "source": "MyIntegrationApp v1.0",
  "subject": "PROJECT|DEFAULT",
  "data": {}
}
```

#### Auðkenning verkefnadagbókarrunu

1. **Rör-aðskilið í subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId í subject**: `"subject": "guid-without-braces"`
3. **JSON-gagnafæribreytur**: `templateName` + `batchName` (forgangur)

#### Valkvæðar færibreytur

| Færibreyta | Tegund | Sjálfgefið | Lýsing |
|-----------|--------|-----------|--------|
| `fieldNumbers` | int[] | öll svið | Svið sem á að taka með í svari |
| `noOfLines` | integer | 1 | Fjöldi lína sem á að stofna (1–100) |
| `clearExistingLines` | boolean | false | Þegar `true`, eyðir öllum línum í runu fyrst |

### Snið svars

Notar sama snið og `Data.Records.Get`. `primaryKey` inniheldur `JournalTemplateName`, `JournalBatchName`, `LineNo_`.

### Tengdar skilaboðategundir

- [Projects.ProjectJournal.Check](#projectsprojectjournalcheck)
- [Projects.ProjectJournal.Post](#projectsprojectjournalpost)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)

---

## Projects.ProjectJournal.Check

**Stefna**: Útlæg (eingöngu sannvottun)

**Tilgangur**: Sannvirðir verkefnadagbókarrunu án þess að bóka.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Projects.ProjectJournal.Check",
  "source": "dynamics365/businesscentral",
  "subject": "PROJECT|DEFAULT",
  "data": {}
}
```

### Snið svars

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "PROJECT",
  "batchName": "DEFAULT",
  "batchDescription": "Default Project Batch",
  "lineCount": 3,
  "totalQuantity": 12.5,
  "totalLineAmount": 4500.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

### Sviðin í svari

| Svið | Tegund | Lýsing |
|------|--------|--------|
| `validationResult` | string | "Ready", "ReadyWithWarnings" eða "NotReady" |
| `templateName` / `batchName` / `batchDescription` | string | Auðkenni runu |
| `lineCount` | integer | Fjöldi lína |
| `totalQuantity` | decimal | Samtala magns |
| `totalLineAmount` | decimal | Samtala línuupphæða |
| `errorCount` / `warningCount` | integer | Fjöldi villna/viðvarana |
| `errors` / `warnings` | array | Skilaboðafylki |

### Sannvottunarreglur

- Nauðsynleg svið: bókunardagsetning, verkefnisnúmer, magn ≠ 0 (þar sem við á)
- Verkefni og verkáfangi verða að vera til og ekki læst
- Bókunartímabil sannvottað
- Framtíðar bókunardagsetningar gefa viðvörun (hindra ekki bókun)

### Tengdar skilaboðategundir

- [Projects.ProjectJournal.SetupNewLine](#projectsprojectjournalsetupnewline)
- [Projects.ProjectJournal.Post](#projectsprojectjournalpost)

---

## Projects.ProjectJournal.Post

**Stefna**: Innlæg (breytir gögnum)

**Tilgangur**: Bókar sannvottaða verkefnadagbókarrunu og býr til verkefnafærslur (Job Ledger Entries).

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Projects.ProjectJournal.Post",
  "subject": "PROJECT|BATCH001",
  "data": {}
}
```

### Snið svars

#### Árangur
```json
{
  "status": "Success",
  "templateName": "PROJECT",
  "batchName": "BATCH001",
  "batchDescription": "Default Project Batch",
  "linesPosted": 3,
  "postingDate": "2026-04-15",
  "totalQuantity": 12.5,
  "totalLineAmount": 4500.0,
  "jobRegisterNo": 7,
  "jobRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 101,
  "toEntryNo": 103
}
```

#### Villa
```json
{
  "status": "Error",
  "error": "Error message text",
  "callstack": "Full error callstack from posting"
}
```

### Athugasemdir

- Notar BC "Job Jnl.-Post Batch" einingu.
- Línur eru hreinsaðar eftir vel heppnaða bókun.
- Bókun er pakkað í einangraða einingu — villur skila byggðu svari með `callstack`.

### Tengdar skilaboðategundir

- [Projects.ProjectJournal.SetupNewLine](#projectsprojectjournalsetupnewline)
- [Projects.ProjectJournal.Check](#projectsprojectjournalcheck)

---

## Projects.ProjectJournal.PreviewPost

**Stefna**: Innlæg (hermir bókun, engin gögn breytast)

**Tilgangur**: Hermir bókun á verkefnadagbókarrunu og skilar þeim færslum sem **myndu** verða til — án þss að vista neitt í gagnagrunninn. Beitir BC `Gen. Jnl.-Post Preview.SetContext + Run()` höfuðlausu flæði gegn `Job Jnl.-Post` áskrifanda. Töflur sem oftast eru fangaðar: `Job Ledger Entry`, og fyrir runur sem skila fjárhagsáhrifum: `G/L Entry`, `VAT Entry`, `Item Ledger Entry`, `Value Entry` (þe gar Línutegund er `Item`).

### Innlögð gildi

Auðkenning runu (fyrsta samsvarandi vinnur):

| Aðferð | Subject-svið | Data-svið |
|--------|--------------|-----------|
| Lóðrétt-strik | `TEMPLATE\|BATCH` | — |
| SystemId GUID | `<guid>` (án sviga) | — |
| Sniðmát + runa | — | `templateName` + `batchName` |

### Svarsnið

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting project journal batch PROJECT|BATCH001 (2 lines) would create 4 ledger entries across 2 tables. G/L impact is balanced.",
  "templateName": "PROJECT",
  "batchName": "BATCH001",
  "batchDescription": "Default Project Batch",
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "ISK",
  "predictedDocumentNos": ["***"],
  "totals": { "balanced": true, "totalDebitLCY": 4500.0, "totalCreditLCY": 4500.0 },
  "preview": [
    {
      "tableId": 169,
      "tableName": "Job Ledger Entry",
      "tableCaption": "Project Ledger Entry",
      "entryCount": 2,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": {
            "JobNo_": "PROJ001",
            "Type": "Resource",
            "No_": "LIFTER",
            "Quantity": "5",
            "DocumentNo_": "***",
            "DimensionSetID": [
              { "DimensionCode": "DEPARTMENT", "DimensionValueCode": "SALES" }
            ]
          }
        }
      ]
    }
  ]
}
```

### Svarsvið

Sami umslag og aðrar PreviewPost-gerðir (`rollback`, `summary`, `totals`, `preview[]` með `tableCaption` + `id`/`primaryKey`/`fields` á hvert atriði). Sérstakt:

| Svið | Lýsing |
|------|--------|
| `DimensionSetID` | Skilað sem fylki `{DimensionCode, DimensionValueCode}` hluta, ekki sem heiltala. Verkefnafærslur fanga oft Öll víðunarmerki. |
| `predictedDocumentNos` | Getur innihaldið `"***"` þe gar BC felður ekki-úthlutað sniglaröð. |

### Rekstraráminningar

- **`Line Type` má ekki vera autt.** Verkefnadagbókarlínur þarfnast `Line Type` reits sem er **ekki autt** (`Schedule`, `Billable` eða `Both Schedule and Contract`). Þýtt lína stofnuð með `SetupNewLine` byrjar með autu `Line Type`; setja það áður en forskoun er keyrð.
- **Lúðann vörulínur eyk færslur í `Item Ledger Entry`/`Value Entry` töflum.**
- Forskoun afturkallar færslur en endurkallað ekki sniðgjöf á lyklum (t.d. lýsing runu).

### Villur

BC sannvottunarvillur skila sér orðrétt. Algengar villur:
- `Project journal batch must be identified via subject (TEMPLATE|BATCH or SystemId) or data parameters (templateName, batchName).`
- `Project journal batch {template}|{batch} not found.`
- `Project journal batch {template}|{batch} has no lines to post.`
- `Line Type must have a value in Job Journal Line: ...` — `Line Type` reitur er aut. Setjaðu `Schedule`, `Billable` eða `Both Schedule and Contract` áður en forskoun er keyrð.
- `Posting preview failed and no entries were captured. The project journal cannot be posted in its current state.` — sjaldgæf heildarvilla.

### Tengdar skilaboðategundir

- [Projects.ProjectJournal.Check](#projectsprojectjournalcheck) - Sannvottaðu án þss að herma bókun.
- [Projects.ProjectJournal.Post](#projectsprojectjournalpost) - Raunveruleg bókun.
- [Finance.GeneralJournal.PreviewPost](/foundation/message-types/finance/#financegeneraljournalpreviewpost) - Sama múnstur fyrir aðalfærslukókvarinn.

---

## Útfærsluupplýsingar

### Hlutarauðkenni

| Tegund hlutar | Auðkenni | Heiti |
|---------------|----------|-------|
| Enum-gildi | 10078091 | Projects.ProjectJournal.SetupNewLine |
| Implementation Codeunit | 10078178 | Proj. Jnl. SetupLine Impl ori |
| Help Codeunit | 10078017 | Proj. Jnl. SetupLine Help ori |
| Enum-gildi | 10078092 | Projects.ProjectJournal.Check |
| Implementation Codeunit | 10078179 | Project Journal Check Impl ori |
| Help Codeunit | 10078018 | Project Journal Check Help ori |
| Enum-gildi | 10078093 | Projects.ProjectJournal.Post |
| Implementation Codeunit | 10078180 | Project Journal Post Impl ori |
| Help Codeunit | 10078019 | Project Journal Post Help ori |
| Enum-gildi | 10078125 | Projects.ProjectJournal.PreviewPost |
| Implementation Codeunit | 10078177 | Proj. Jnl. Prev. Post Impl ori |
| Help Codeunit | 10078016 | Proj. Jnl. Prev. Post Help ori |
