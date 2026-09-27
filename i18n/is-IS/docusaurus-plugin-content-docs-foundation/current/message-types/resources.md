---
id: resources
title: "Resources message types"
sidebar_position: 8
---

Þetta skjal lýsir skilaboðategundum tengdum auðlindum (Resources) í Bifröst Foundation.

Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](../reference/errors.md). Villusvör innihalda aldrei kallastafla.

## Yfirlit

Skilaboðategundir fyrir auðlindir bjóða upp á virkni til að vinna með auðlindadagbækur, þar með talið stofnun lína, sannvottun og bókun.

## Listi yfir skilaboðategundir

| Skilaboðategund | Stefna | Tilgangur |
|----------------|--------|-----------|
| [Resources.ResourceJournal.Create](#resourcesresourcejournalcreate) | Innlæg | Bætir línum í fyrirliggjandi runu, með gildum eða auðar |
| [Resources.ResourceJournal.Check](#resourcesresourcejournalcheck) | Útlæg | Sannvirðir auðlindadagbókarrunu |
| [Resources.ResourceJournal.Post](#resourcesresourcejournalpost) | Innlæg | Bókar auðlindadagbókarrunu |

---

## Resources.ResourceJournal.Create

**Stefna**: Innlæg

Bætir línum í fyrirliggjandi aðfangadagbókarrunu í einu kalli. Með `lines` er hver lína yfirfarin áður en nokkuð er skráð og öll vandamál koma í einu svari, svo ekkert er stofnað ef ein lína er röng (mest 200 línur). Án `lines` eru `noOfLines` auðar línur settar inn með sjálfgefnum gildum BC. `clearExistingLines` eyðir fyrst línum runnunnar og er óafturkræft. Kallið stofnar aldrei runu.

```json
{
  "type": "Resources.ResourceJournal.Create",
  "subject": "RESOURCE|DEFAULT",
  "data": {
    "lines": [
      { "resourceNo": "LINDA", "quantity": 2 }
    ]
  }
}
```

### Dæmigert verkflæði

1. `Resources.ResourceJournal.Create` með `lines`.
2. `Resources.ResourceJournal.Check` til að yfirfara rununa.
3. `Resources.ResourceJournal.Post` til að bóka.

Færibreytur, reitir línanna (skyldu- og valkvæðir), röð prófana og villur eru á tilvísunarsíðunni: [Resources.ResourceJournal.Create](/foundation/reference/message-types/resources-resourcejournal-create/).

---

## Resources.ResourceJournal.Check

**Stefna**: Útlæg (eingöngu sannvottun)

**Tilgangur**: Sannvirðir auðlindadagbókarrunu án þess að bóka.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Resources.ResourceJournal.Check",
  "source": "dynamics365/businesscentral",
  "subject": "RESOURCE|DEFAULT",
  "data": {}
}
```

### Snið svars

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "RESOURCE",
  "batchName": "DEFAULT",
  "batchDescription": "Default Resource Batch",
  "lineCount": 2,
  "totalQuantity": 16.0,
  "totalCost": 2400.0,
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
| `totalCost` | decimal | Samtala kostnaðar |
| `errorCount` / `warningCount` | integer | Fjöldi villna/viðvarana |
| `errors` / `warnings` | array | Skilaboðafylki |

### Sannvottunarreglur

- Nauðsynleg svið: bókunardagsetning, auðlindarnúmer, magn ≠ 0
- Auðlindir verða að vera til og ekki læstar
- Bókunartímabil sannvottað
- Framtíðar bókunardagsetningar gefa viðvörun

### Tengdar skilaboðategundir

- [Resources.ResourceJournal.Create](#resourcesresourcejournalcreate)
- [Resources.ResourceJournal.Post](#resourcesresourcejournalpost)

---

## Resources.ResourceJournal.Post

**Stefna**: Innlæg (breytir gögnum)

**Tilgangur**: Bókar sannvottaða auðlindadagbókarrunu og býr til auðlindafærslur (Resource Ledger Entries).

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Resources.ResourceJournal.Post",
  "subject": "RESOURCE|BATCH001",
  "data": {}
}
```

### Snið svars

#### Árangur (með skráningu)
```json
{
  "status": "Success",
  "templateName": "RESOURCE",
  "batchName": "BATCH001",
  "batchDescription": "Default Resource Batch",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 16.0,
  "totalCost": 2400.0,
  "resourceRegisterNo": 5,
  "resourceRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 101,
  "toEntryNo": 102
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

### Skráningarsvið — skilyrt

Reitirnir `resourceRegisterNo`, `resourceRegisterId`, `fromEntryNo` og `toEntryNo` eru **eingöngu með í svarinu þegar bókunin býr til auðlindaskráningu (Resource Register)**. Bókun sem framleiðir engar færslur (sjaldgæft) sleppir þessum reitum.

Allir aðrir reitir (`status`, `templateName`, `batchName`, `batchDescription`, `linesPosted`, `postingDate`, `totalQuantity`, `totalCost`) eru alltaf til staðar.

### Athugasemdir

- Notar BC "Res. Jnl.-Post Batch" einingu.
- Línur eru hreinsaðar eftir vel heppnaða bókun.
- Bókun er pakkað í einangraða einingu — villur skila skipulegu villusvari (kóði `BusinessCentralError`); kallastaflinn fer eingöngu í fjarmælingar.

### Tengdar skilaboðategundir

- [Resources.ResourceJournal.Create](#resourcesresourcejournalcreate)
- [Resources.ResourceJournal.Check](#resourcesresourcejournalcheck)

---

## Útfærsluupplýsingar

### Hlutarauðkenni

| Tegund hlutar | Auðkenni | Heiti |
|---------------|----------|-------|
| Enum-gildi | 10078094 | Resources.ResourceJournal.Create |
| Implementation Codeunit | 10078197 | Res. Jnl. SetupLine Impl ori |
| Help Codeunit | 10078032 | Res. Jnl. SetupLine Help ori |
| Enum-gildi | 10078095 | Resources.ResourceJournal.Check |
| Implementation Codeunit | 10078198 | Resource Jnl. Check Impl ori |
| Help Codeunit | 10078033 | Resource Jnl. Check Help ori |
| Enum-gildi | 10078096 | Resources.ResourceJournal.Post |
| Implementation Codeunit | 10078199 | Resource Journal Post Impl ori |
| Help Codeunit | 10078034 | Resource Journal Post Help ori |
