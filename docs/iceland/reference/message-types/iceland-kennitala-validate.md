---
id: iceland-kennitala-validate
title: "Iceland.Kennitala.Validate"
sidebar_label: "Iceland.Kennitala.Validate"
sidebar_position: 35
description: "Request and response contract for the Iceland.Kennitala.Validate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Validates an Icelandic kennitala (national ID number) using checksum and date rules.
Pure local computation — no external API call or authentication required.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- Validating a customer or vendor kennitala before saving to BC.
- Determining whether a kennitala belongs to a person, company, or temporary entity.
- Pre-validating before calling `Iceland.Member.Get` or `Iceland.Stakeholders.Get` (avoid unnecessary API calls with invalid inputs).

## Request

- **Subject** (required): A kennitala to validate.
  - Accepts: `0811536049`, `081153-6049`, `081153 6049`
  - Spaces and dashes are stripped automatically.
- **Body**: Not used. Leave empty or pass `{}`.

## Response

| Field | Description |
|-------|-------------|
| `kennitala` | Formatted kennitala (NNNNNN-NNNN) |
| `valid` | `true`/`false` — checksum validation (+ date validation for persons) |
| `type` | `person`, `company`, or `temporary` |
| `birthDate` | Birth date (YYYY-MM-DD) — **persons only**. Not returned for companies. |
| `temporary` | `true` if this is a kerfiskennitala (short-term ID) |

## AI/Agent playbook
1. Always validate before using a kennitala in downstream API calls.
2. Check `type` to distinguish persons from companies — determines which fields to populate in BC (e.g., VAT registration number for companies).
3. If `valid = false`, reject the input and prompt the user for correction. Do not call further Iceland APIs with an invalid kennitala.
4. `temporary = true` indicates a system-generated ID (kerfiskennitala); treat with caution in long-lived records.
5. `birthDate` is only returned for persons. For companies, use `Iceland.Member.Get` to get founding date from the registry.
Capability boundary: pure local checksum/date computation; no external call is made.

## How Kennitala Works

**Persons:** `DDMMYY-NNCC` — digits 1-2 = birth day, 3-4 = month, 5-6 = year.
**Companies:** digits 1-2 are arbitrary (assigned by registry), digits 3-6 often but NOT always encode month+year of founding. Day 41-71 in digit positions 1-2 signals company type (subtract 40 to get the encoded value, but it may not be a valid calendar day).
**Temporary:** Day >= 80 indicates a kerfiskennitala.

- Digit 9: check digit (modulus 11 with weights [3,2,7,6,5,4,3,2])
- Digit 10: century (9=1900s, 0=2000s, 8=1800s)

**Validation rules:**
- All types: checksum must pass (modulus 11)
- Persons: date (DDMMYY) must be a valid calendar date
- Companies: date validation is skipped (digits 1-2 may not form a valid day)

## Examples

- `1102713369` — person born 1971-02-11 → `valid: true, type: person, birthDate: 1971-02-11`
- `7102693869` — company (Þór hf.) → `valid: true, type: company` (no birthDate — digits 1-2 encode day 31 which is invalid for Feb)
- `6306251060` — company → `valid: true, type: company`

## Errors
- `Subject is required.` — subject missing.
- `valid = false` — bad checksum (modulus 11 failed) or invalid date (persons only).

