---
id: iceland-vat-getinfo
title: "Iceland.VAT.GetInfo"
sidebar_label: "Iceland.VAT.GetInfo"
sidebar_position: 64
description: "Request and response contract for the Iceland.VAT.GetInfo Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Imports a VAT period from Skatturinn (RSK). This is the **entry point** for the VAT lifecycle.
Always calls RSK to get fresh data, but only creates a local record if one does not already exist.

**Direction:** Outbound
**RSK Operation:** `NaIVSKUpplysingar`

## Full VAT Return Workflow

### Overview
```
1. Setup VAT Statement (one-time)
2. GetInfo          → imports RSK period + category structure
3. Calculate        → run VAT Statement for period dates
4. Map amounts      → Box No. on VAT Statement Line = RSK Category Id
5. Validate         → RSK validates the amounts
6. Submit           → RSK accepts the return
```

### Step 1: VAT Statement Setup (one-time)

Configure a BC **VAT Statement** with lines that match the RSK tax categories.
The `Box No.` field on each VAT Statement Line stores the **RSK Category Id**.

RSK returns these categories (from GetInfo response `entries[].categoryId`):

| Box No. | RSK Description | Rate | Type |
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
2. Create/use a VAT Statement template (e.g. "VAT") with a statement name (e.g. "RSK").
3. For each RSK category that applies to your business, create a VAT Statement Line:
   - Set `Type` = "VAT Entry Totaling"
   - Set `VAT Bus. Posting Group` + `VAT Prod. Posting Group` to match the rate
   - Set `Amount Type` = "Amount" for turnover lines, "Amount" for tax lines
   - Set `Box No.` = the RSK Category Id from the table above
4. Not all categories need lines — only those relevant to your company.
   RSK returns all possible categories; zero-amount ones are harmless.

**Example VAT Statement Lines:**
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

Call `Iceland.VAT.GetInfo` to import the period structure from RSK.
This creates the local period record (status Open) and entry lines with `categoryId` values.

### Step 3: Calculate VAT Statement

Run the VAT Statement calculation in BC for the period date range
(use `startDate`..`endDate` from the GetInfo response).
This populates the VAT Statement with amounts from posted VAT entries.

### Step 4: Map Amounts to RSK Entries

Read the calculated VAT Statement Lines and match `Box No.` to `categoryId`:

```
For each VAT Statement Line WHERE Box No. <> '':
  Find Iceland VAT Period Entry ori WHERE Category Id = Box No.
  Set Entry.Amount := VAT Statement Line calculated amount
```

Use `set_records` on table Iceland VAT Period Entry ori (10077149), field 15 (Amount),
to write the calculated amounts. Only works when period Status = Open.

### Step 5: Validate

Call `Iceland.VAT.Validate` — RSK checks the amounts and returns assessment/penalty.
Period transitions to Validated if RSK accepts.

### Step 6: Submit

Call `Iceland.VAT.Submit` — RSK accepts the return, creates a claim, returns receipt PDF.
Period transitions to Submitted.

### Corrections

If you need to correct a submitted return:
1. Call `Iceland.VAT.Correct` → creates new revision (status Open), old revision → Reversed
2. Repeat steps 3-6 on the new revision
3. Submit auto-detects Rev > 1 and uses the correction RSK operation (LeidrettaVSKSkyrslu)

---

## Request
```json
{
  "vat": {
    "vskNumer": "101067",
    "ar": 2026,
    "timabil": "08"
  }
}
```
- `vskNumer` — required. The company's VSK number from Company Information.
- `ar`, `timabil` — optional. If omitted, RSK returns the current open period.

## Response
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
1. **Start here** — always call GetInfo before Validate or Submit.
2. Omit `ar`/`timabil` to discover the current open period automatically.
3. After GetInfo, read VAT Statement Lines WHERE Box No. &lt;> '' to get the mapping.
4. Calculate the VAT Statement for startDate..endDate.
5. Write calculated amounts to Iceland VAT Period Entry ori (field 15) matching by categoryId = Box No.
6. Call `Iceland.VAT.Validate` to validate with RSK.
7. Call `Iceland.VAT.Submit` to file the return.
8. Use `Iceland.VAT.GetNumbers` first if you don't know the VSK number.

## Tracking tables (read-only for agents)

The VAT lifecycle writes to two local tables. **All fields are write-protected** — direct
writes via `set_records` will error. Use the VAT message types instead.
Reading via `get_records` is always allowed.

### Table: Iceland VAT Period ori (10077148)
**PK:** VSK Number, Year, Period, Revision No.

| Fields | Written by | Description |
|---|---|---|
| 10-24 (Kennitala..Import Error) | GetInfo | Company/period metadata from RSK |
| 30-33 (Assessment..Validation Error) | Validate | Validation result from RSK |
| 40-55 (Submission..PDF Receipt) | Submit | Submission result, claim, payment, PDF |
| 60-64 (Status..Reversed At) | All operations | State machine + timestamps |

**Status enum:** Open → Validated → Submitted → (Correct creates new rev) → Reversed (old rev)

### Table: Iceland VAT Period Entry ori (10077149)
**PK:** VSK Number, Year, Period, Revision No., Line No.

| Field | Writable? | Description |
|---|---|---|
| Entry Type (10) | No | RSK entry type code (e.g. 7, 22, 86) |
| Level (11) | No | VAT rate level from RSK |
| Category Id (12) | No | RSK category — maps to VAT Statement Line Box No. |
| Description (13) | No | Entry description from RSK |
| RSK Amount (14) | No | Original amount from RSK (frozen at import) |
| **Amount (15)** | **Yes** | Set from calculated VAT Statement. Editable when Status = Open. |

### How to work with tracking data
1. **Read current state:** `get_records` on table 10077148, filter by VSK Number + Year + Period.
2. **Read entries:** `get_records` on table 10077149, same filter.
3. **Edit amounts:** `set_records` on table 10077149, field 15 (Amount) only, when Status = Open.
4. **Never write other fields** — they are write-protected and will error.
5. **Never insert/delete rows** — use the message types which manage the full lifecycle.

## VAT Statement to RSK Category Mapping

The mapping between BC and RSK uses the **Box No.** field on VAT Statement Lines:

```
┌─────────────────────┐         ┌──────────────────────────┐
│ VAT Statement Line  │         │ Iceland VAT Period Entry ori│
├─────────────────────┤         ├──────────────────────────┤
│ Box No. = "46"      │────────▶│ Category Id = "46"        │
│ Calculated Amount   │────────▶│ Amount (field 15)         │
└─────────────────────┘         └──────────────────────────┘
```

## Errors
- Missing `vat` object or `vskNumer` → error.
- RSK status 999 "Kerfi ekki skráð eða ekki virkt" → the `KerfiUtgafa` software identifier is not registered with Skatturinn.
- RSK status 999 "VSK númer er ekki til eða er ekki opið" → wrong VSK number or no open period.
- HTTP non-200 → returns `success: false` with `error` and `responseXml`.

## Troubleshooting
- The `KerfiUtgafa` identifier must be registered with RSK before any calls work.
- Check the Request Log (table Request Log ori, LogType=VAT) for full SOAP payloads.
- RSK always returns the **current open period** regardless of ar/timabil in the request.
- If a local period already exists (same VSK/Year/Period), returns cached data.
- The VSK number comes from Company Information → VAT Registration No.
- The kennitala comes from Company Information → Registration No.

