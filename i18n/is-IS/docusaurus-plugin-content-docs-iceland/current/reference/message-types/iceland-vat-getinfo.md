---
id: iceland-vat-getinfo
title: "Iceland.VAT.GetInfo"
sidebar_label: "Iceland.VAT.GetInfo"
sidebar_position: 64
description: "Beiðni- og svarsamningur fyrir Iceland.VAT.GetInfo Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Imports a VAT period frá Skatturinn (RSK). This er the **entry point** fyrir the VAT lifecycle.
Always calls RSK til Sækja fresh data, but Aðeins Býr til a local færsla Ef one does not already exist.

**Stefna:** Outbound
**RSK Operation:** `NaIVSKUpplysingar`

## fulla VAT Return Verkflæði

### Yfirlit
```
1. Setup VAT Statement (one-time)
2. GetInfo          → imports RSK period + category structure
3. Calculate        → run VAT Statement for period dates
4. Map amounts      → Box No. on VAT Statement Line = RSK Category Id
5. Validate         → RSK validates the amounts
6. Submit           → RSK accepts the return
```

### Step 1: VAT Statement Setup (one-time)

Configure a BC **VAT Statement** með lines that match the RSK tax categories.
The `Box No.` Reitur on each VAT Statement Line stores the **RSK Category Id**.

RSK Skilar these categories (frá GetInfo Svar `entries[].categoryId`):

| Box No. | RSK Lýsing | Rate | Gerð |
|---------|----------------|------|------|
| 46 | Tapaðar viðskiptakröfur | 25.5% | Turnover |
| 35 | Samtals útskattur | 25.5% | Output tax |
| 47 | Tapaðar viðskiptakröfur | 24.5% | Turnover |
| 38 | Samtals útskattur | 24.5% | Output tax |
| 48 | Tapaðar viðskiptakröfur | 14% | Turnover |
| 49 | Tapaðar viðskiptakröfur | 7% | Turnover |
| 40 | Samtals útskattur | 7% | Output tax |
| 53 | Samtals undanþegin | 0% | Exempt |
| 64 | Samtals velta | 11% | Turnover |
| 66 | Tapaðar viðskiptakröfur | 11% | Turnover |
| 83 | Samtals innskattur | 11% | Input tax |
| 65 | Samtals útskattur | 11% | Output tax |
| 67 | Samtals velta | 24% | Turnover |
| 69 | Tapaðar viðskiptakröfur | 24% | Turnover |
| 84 | Samtals innskattur | 24% | Input tax |
| 68 | Samtals útskattur | 24% | Output tax |

**Setup procedure:**
1. Open VAT Statements page (page 317).
2. Create/Notaðu a VAT Statement template (e.g. "VAT") með a statement Heiti (e.g. "RSK").
3. fyrir each RSK category that applies til your business, create a VAT Statement Line:
   - Set `Type` = "VAT Entry Totaling"
   - Set `VAT Bus. Posting Group` + `VAT Prod. Posting Group` til match the rate
   - Set `Amount Type` = "Amount" fyrir turnover lines, "Amount" fyrir tax lines
   - Set `Box No.` = the RSK Category Id frá the table above
4. Not Allt categories need lines — Aðeins those relevant til your fyrirtæki.
   RSK Skilar Allt possible categories; zero-amount ones eru harmless.

**Dæmi VAT Statement Lines:**
```
Row  Description                    Type               Bus.Grp  Prod.Grp  AmtType  Box No.
───  ─────────────────────────────  ─────────────────  ───────  ────────  ───────  ───────
010  Sala 25,5% velta               VAT Entry Totaling INNL     V25       Base     46
020  Sala 25,5% VSK                 VAT Entry Totaling INNL     V25       Amount   35
030  Sala 11% velta                 VAT Entry Totaling INNL     V11       Base     64
040  Sala 11% VSK                   VAT Entry Totaling INNL     V11       Amount   65
050  Innskattur 25,5%               VAT Entry Totaling INNL     V25       Amount   83
060  Innskattur 11%                 VAT Entry Totaling INNL     V11       Amount   84
```

### Step 2: GetInfo — Import Period

Kallaðu á `Iceland.VAT.GetInfo` til import the period structure frá RSK.
This Býr til the local period færsla (status Open) og entry lines með `categoryId` values.

### Step 3: Calculate VAT Statement

Run the VAT Statement calculation in BC fyrir the period date range
(Notaðu `startDate`..`endDate` frá the GetInfo Svar).
This populates the VAT Statement með amounts frá posted VAT entries.

### Step 4: Map Amounts til RSK Entries

Read the calculated VAT Statement Lines og match `Box No.` til `categoryId`:

```
For each VAT Statement Line WHERE Box No. <> '':
  Find Iceland VAT Period Entry ori WHERE Category Id = Box No.
  Set Entry.Amount := VAT Statement Line calculated amount
```

Notaðu `set_records` on table Iceland VAT Period Entry ori (10077149), Reitur 15 (Amount),
til write the calculated amounts. Aðeins works Þegar period Status = Open.

### Step 5: Validate

Kallaðu á `Iceland.VAT.Validate` — RSK checks the amounts og Skilar assessment/penalty.
Period transitions til Validated Ef RSK accepts.

### Step 6: Submit

Kallaðu á `Iceland.VAT.Submit` — RSK accepts the return, Býr til a claim, Skilar receipt PDF.
Period transitions til Submitted.

### Corrections

Ef you need til correct a submitted return:
1. Kallaðu á `Iceland.VAT.Correct` → Býr til new revision (status Open), old revision → Reversed
2. Repeat steps 3-6 on the new revision
3. Submit auto-detects Rev > 1 og uses the correction RSK operation (LeidrettaVSKSkyrslu)

---

## Beiðni
```json
{
  "vat": {
    "vskNumer": "101067",
    "ar": 2026,
    "timabil": "08"
  }
}
```
- `vskNumer` — nauðsynlegt. The fyrirtæki's VSK number frá fyrirtæki Information.
- `ar`, `timabil` — valfrjálst. Ef omitted, RSK Skilar current open period.

## Svar
```json
{
  "period": {
    "vskNumber": "101067", "year": 2026, "period": "08", "revisionNo": 1,
    "kennitala": "4112032630", "name": "Kappi ehf.",
    "dueDate": "2026-04-07", "startDate": "2026-01-01", "endDate": "2026-02-28",
    "status": "Open"
  },
  "entries": [
    { "entryType": "7", "level": "0", "categoryId": "46", "description": "Tapaðar viðskiptakröfur", "rskAmount": 0, "amount": 0 },
    { "entryType": "22", "level": "0", "categoryId": "35", "description": "Samtals útskattur", "rskAmount": 0, "amount": 0 }
  ]
}
```

## Agent playbook
1. **Start here** — always Kallaðu á GetInfo áður en Validate eða Submit.
2. Omit `ar`/`timabil` til discover the current open period sjálfkrafa.
3. eftir GetInfo, read VAT Statement Lines WHERE Box No. &lt;> '' til Sækja the mapping.
4. Calculate the VAT Statement fyrir startDate..endDate.
5. Write calculated amounts til Iceland VAT Period Entry ori (Reitur 15) matching by categoryId = Box No.
6. Kallaðu á `Iceland.VAT.Validate` til validate með RSK.
7. Kallaðu á `Iceland.VAT.Submit` til file the return.
8. Notaðu `Iceland.VAT.GetNumbers` first Ef you don't know the VSK number.

## Tracking tables (read-Aðeins fyrir agents)

The VAT lifecycle writes til two local tables. **Allt fields eru write-protected** — direct
writes via `set_records` mun error. Notaðu the VAT message types instead.
Reading via `get_records` er always allowed.

### Table: Iceland VAT Period ori (10077148)
**PK:** VSK Number, Year, Period, Revision No.

| Fields | Written by | Lýsing |
|---|---|---|
| 10-24 (Kennitala..Import Error) | GetInfo | fyrirtæki/period metadata frá RSK |
| 30-33 (Assessment..Validation Error) | Validate | Validation result frá RSK |
| 40-55 (Submission..PDF Receipt) | Submit | Submission result, claim, greiðsla, PDF |
| 60-64 (Status..Reversed At) | Allt operations | State machine + timestamps |

**Status enum:** Open → Validated → Submitted → (Correct Býr til new rev) → Reversed (old rev)

### Table: Iceland VAT Period Entry ori (10077149)
**PK:** VSK Number, Year, Period, Revision No., Line No.

| Reitur | Writable? | Lýsing |
|---|---|---|
| Entry Gerð (10) | No | RSK entry Gerð code (e.g. 7, 22, 86) |
| Level (11) | No | VAT rate level frá RSK |
| Category Id (12) | No | RSK category — maps til VAT Statement Line Box No. |
| Lýsing (13) | No | Entry Lýsing frá RSK |
| RSK Amount (14) | No | Original amount frá RSK (frozen at import) |
| **Amount (15)** | **Yes** | Set frá calculated VAT Statement. Editable Þegar Status = Open. |

### How til work með tracking data
1. **Read current state:** `get_records` on table 10077148, filter by VSK Number + Year + Period.
2. **Read entries:** `get_records` on table 10077149, same filter.
3. **Edit amounts:** `set_records` on table 10077149, Reitur 15 (Amount) Aðeins, Þegar Status = Open.
4. **Never write other fields** — they eru write-protected og mun error.
5. **Never insert/delete rows** — Notaðu the message types which manage the fulla lifecycle.

## VAT Statement til RSK Category Mapping

The mapping between BC og RSK uses the **Box No.** Reitur on VAT Statement Lines:

```
┌─────────────────────┐         ┌──────────────────────────┐
│ VAT Statement Line  │         │ Iceland VAT Period Entry ori│
├─────────────────────┤         ├──────────────────────────┤
│ Box No. = "46"      │────────▶│ Category Id = "46"        │
│ Calculated Amount   │────────▶│ Amount (field 15)         │
└─────────────────────┘         └──────────────────────────┘
```

## Errors
- Missing `vat` object eða `vskNumer` → error.
- RSK status 999 "Kerfi ekki skráð eða ekki virkt" → the `KerfiUtgafa` software identifier er not registered með Skatturinn.
- RSK status 999 "VSK númer er ekki til eða er ekki opið" → wrong VSK number eða no open period.
- HTTP non-200 → Skilar `success: false` með `error` og `responseXml`.

## Troubleshooting
- The `KerfiUtgafa` identifier verður að be registered með RSK áður en any calls work.
- Check Beiðnin Log (table Beiðni Log ori, LogType=VAT) fyrir fulla SOAP payloads.
- RSK always Skilar **current open period** regardless of ar/timabil in Beiðnin.
- Ef a local period already exists (same VSK/Year/Period), Skilar cached data.
- The VSK number comes frá fyrirtæki Information → VAT Registration No.
- The kennitala comes frá fyrirtæki Information → Registration No.


