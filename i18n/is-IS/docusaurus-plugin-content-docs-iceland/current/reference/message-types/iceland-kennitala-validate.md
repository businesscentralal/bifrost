---
id: iceland-kennitala-validate
title: "Iceland.Kennitala.Validate"
sidebar_label: "Iceland.Kennitala.Validate"
sidebar_position: 35
description: "Beiðni- og svarsamningur fyrir Iceland.Kennitala.Validate Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Staðfestir an Icelandic kennitala (national ID number) using checksum og date rules.
Pure local computation — no external API Kallaðu á eða authentication nauðsynlegt.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- Validating a viðskiptavinur eða vendor kennitala áður en saving til BC.
- Determining whether a kennitala belongs til a person, fyrirtæki, eða temporary entity.
- Pre-validating áður en calling `Iceland.Member.Get` eða `Iceland.Stakeholders.Get` (avoid unnecessary API calls með invalid inputs).

## Beiðni

- **Subject** (nauðsynlegt): A kennitala til validate.
  - Accepts: `0811536049`, `081153-6049`, `081153 6049`
  - Spaces og dashes eru stripped sjálfkrafa.
- **Body**: Not used. Leave empty eða pass `{}`.

## Svar

| Reitur | Lýsing |
|-------|-------------|
| `kennitala` | Formatted kennitala (NNNNNN-NNNN) |
| `valid` | `true`/`false` — checksum validation (+ date validation fyrir persons) |
| `type` | `person`, `company`, eða `temporary` |
| `birthDate` | Birth date (YYYY-MM-DD) — **persons Aðeins**. Not returned fyrir companies. |
| `temporary` | `true` Ef this er a kerfiskennitala (short-term ID) |

## Leiðbeiningar fyrir gervigreind/umboð
1. Always validate áður en using a kennitala in downstream API calls.
2. Check `type` til distinguish persons frá companies — determines which fields til populate in BC (e.g., VAT registration number fyrir companies).
3. Ef `valid = false`, reject the input og prompt the user fyrir correction. Do not Kallaðu á further Iceland APIs með an invalid kennitala.
4. `temporary = true` indicates a system-generated ID (kerfiskennitala); treat með caution in long-lived færslur.
5. `birthDate` er Aðeins returned fyrir persons. fyrir companies, Notaðu `Iceland.Member.Get` til Sækja founding date frá the registry.
Capability boundary: pure local checksum/date computation; no external Kallaðu á er made.

## How Kennitala Works

**Persons:** `DDMMYY-NNCC` — digits 1-2 = birth day, 3-4 = month, 5-6 = year.
**Companies:** digits 1-2 eru arbitrary (assigned by registry), digits 3-6 often but NOT always encode month+year of founding. Day 41-71 in digit positions 1-2 signals fyrirtæki Gerð (subtract 40 til Sækja the encoded value, but it may not be a valid calendar day).
**Temporary:** Day >= 80 indicates a kerfiskennitala.

- Digit 9: check digit (modulus 11 með weights [3,2,7,6,5,4,3,2])
- Digit 10: century (9=1900s, 0=2000s, 8=1800s)

**Validation rules:**
- Allt types: checksum verður að pass (modulus 11)
- Persons: date (DDMMYY) verður að be a valid calendar date
- Companies: date validation er skipped (digits 1-2 may not form a valid day)

## Dæmi

- `1102713369` — person born 1971-02-11 → `valid: true, type: person, birthDate: 1971-02-11`
- `7102693869` — fyrirtæki (Þór hf.) → `valid: true, type: company` (no birthDate — digits 1-2 encode day 31 which er invalid fyrir Feb)
- `6306251060` — fyrirtæki → `valid: true, type: company`

## Errors
- `Subject is required.` — subject missing.
- `valid = false` — bad checksum (modulus 11 failed) eða invalid date (persons Aðeins).


