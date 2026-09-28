---
id: projects
title: "Projects message types"
sidebar_position: 7
---

Þetta skjal lýsir skilaboðategundum tengdum verkefnum (Jobs) í Bifröst Foundation.

Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](../reference/errors.md). Villusvör innihalda aldrei kallastafla.

## Yfirlit

Skilaboðategundir fyrir verkefni bjóða upp á virkni til að vinna með verkefnadagbækur, þar með talið stofnun lína, sannvottun og bókun.

## Listi yfir skilaboðategundir

| Skilaboðategund | Stefna | Tilgangur |
|----------------|--------|-----------|
| [Projects.ProjectJournal.Create](#projectsprojectjournalcreate) | Innlæg | Bætir línum í fyrirliggjandi runu, með gildum eða auðar |
| [Projects.ProjectJournal.Check](#projectsprojectjournalcheck) | Útlæg | Sannvirðir verkefnadagbókarrunu |
| [Projects.ProjectJournal.Post](#projectsprojectjournalpost) | Innlæg | Bókar verkefnadagbókarrunu |
| [Projects.ProjectJournal.PreviewPost](#projectsprojectjournalpreviewpost) | Innlæg | Hermir bókun á verkefnadagbókarrunu og skilar spáðum færslum (afturkallað) |

---

## Projects.ProjectJournal.Create

**Stefna**: Innlæg

Bætir línum í fyrirliggjandi verkefnadagbókarrunu í einu kalli. Með `lines` er hver lína yfirfarin áður en nokkuð er skráð og öll vandamál koma í einu svari, svo ekkert er stofnað ef ein lína er röng (mest 200 línur). Án `lines` eru `noOfLines` auðar línur settar inn með sjálfgefnum gildum BC. `clearExistingLines` eyðir fyrst línum runnunnar og er óafturkræft. Kallið stofnar aldrei runu.

```json
{
  "type": "Projects.ProjectJournal.Create",
  "subject": "PROJECT|DEFAULT",
  "data": {
    "lines": [
      { "jobNo": "JOB00010", "jobTaskNo": "1000", "type": "Resource", "no": "LINDA", "quantity": 2 }
    ]
  }
}
```

### Dæmigert verkflæði

1. `Projects.ProjectJournal.Create` með `lines`.
2. `Projects.ProjectJournal.Check` til að yfirfara rununa.
3. `Projects.ProjectJournal.Post` til að bóka.

Færibreytur, reitir línanna (skyldu- og valkvæðir), röð prófana og villur eru á tilvísunarsíðunni: [Projects.ProjectJournal.Create](/foundation/reference/message-types/projects-projectjournal-create/).

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

- [Projects.ProjectJournal.Create](#projectsprojectjournalcreate)
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
  "code": "BusinessCentralError",
  "error": "Error message text"
}
```

### Athugasemdir

- Notar BC "Job Jnl.-Post Batch" einingu.
- Línur eru hreinsaðar eftir vel heppnaða bókun.
- Bókun er pakkað í einangraða einingu — villur skila skipulegu villusvari (kóði `BusinessCentralError`); kallastaflinn fer eingöngu í fjarmælingar.

### Tengdar skilaboðategundir

- [Projects.ProjectJournal.Create](#projectsprojectjournalcreate)
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

- **`Line Type` má ekki vera autt.** Verkefnadagbókarlínur þarfnast `Line Type` reits sem er **ekki autt** (`Budget`, `Billable` eða `Both Budget and Billable`). Sendið `lineType` á hverri línu `Projects.ProjectJournal.Create`; auð lína sem er stofnuð án `lines` þarf að fá það með `Data.Records.Set` áður en forskoðun er keyrð.
- **Lúðann vörulínur eyk færslur í `Item Ledger Entry`/`Value Entry` töflum.**
- Forskoun afturkallar færslur en endurkallað ekki sniðgjöf á lyklum (t.d. lýsing runu).

### Villur

BC sannvottunarvillur skila sér orðrétt. Algengar villur:
- `Project journal batch must be identified via subject (TEMPLATE|BATCH or SystemId) or data parameters (templateName, batchName).`
- `Project journal batch {template}|{batch} not found.`
- `Project journal batch {template}|{batch} has no lines to post.`
- `Line Type must have a value in Job Journal Line: ...` — `Line Type` reiturinn er auður. Setjið `Budget`, `Billable` eða `Both Budget and Billable` áður en forskoðun er keyrð.
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
| Enum-gildi | 10078091 | Projects.ProjectJournal.Create |
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
