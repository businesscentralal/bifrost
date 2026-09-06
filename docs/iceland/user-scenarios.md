---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Publisher:** Origo
**Version:** 28.0.0.0
**Submission Date:** 2026-09-05
**Test Environment:** Requires an Icelandic BC sandbox with the IS Core localization installed. The extension connects to Icelandic government web services (Skatturinn, Seðlabanki, Skilagrein, island.is). See "Test Credentials" section below.

---

## Test Credentials

This extension connects to multiple Icelandic external services:

| Service | Purpose | Test Environment |
|---------|---------|-----------------|
| Seðlabanki Íslands (Central Bank) | Currency rates, interest rates, CPI, economic data | Public API — no credentials needed |
| island.is | Vehicle registry, customs, kennitala validation | Public API — no credentials needed |
| Skatturinn (RSK / IRS) | VAT submission, payroll tax, capital income tax | RSK test environment — requires test company kennitala + credentials |
| Skilagrein | Pension fund / union / collector submissions | Skilagrein test environment — requires test credentials |
| Síminn magnSMS | SMS gateway | Test account credentials needed |
| Byggðastofnun | Postal code registry | Public data — no credentials needed |

**For Skatturinn/Skilagrein/SMS:** Provide test credentials in the submission. These services offer dedicated test environments that accept dummy data without real tax consequences.

---

## Scenario 1: Extension Installation and Setup

**Area:** Installation & Activation

### Setup
1. Start with a clean BC sandbox with IS Core localization installed (Cronus IS company)
2. Install the "Bifrost Foundation" extension (dependency)
3. Install the "Bifrost Iceland" extension

### Steps
1. Search for "Bifrost Setup" in the BC search bar
2. Verify the setup page opens without error
3. Verify the Iceland-specific settings appear on the setup page (RSK credentials section)
4. Search for "Help.Iceland.Get" — verify it appears in the message type list

### Expected Results
- The extension installs without error
- The Bifrost Setup page shows Iceland-specific configuration fields
- The Help.Iceland.Get message type is registered and callable

---

## Scenario 2: Help Overview

**Area:** Core Functionality

### Setup
1. Complete Scenario 1 (extension installed)

### Steps
1. POST a Bifrost message via the Queue API:
   - `type`: `Help.Iceland.Get`
   - `sendContent`: `{}`
2. Process the task via the Task API
3. Retrieve the response from the Data API

### Expected Results
- The response contains a Markdown-formatted help document
- The document lists all Iceland message types grouped by domain (Seðlabanki, Skatturinn, island.is, SMS, etc.)
- Each message type includes a description and usage example

---

## Scenario 3: Icelandic Holidays

**Area:** Core Functionality — Public Data

### Setup
1. Complete Scenario 1

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.Holidays.Get`
   - `sendContent`: `{"year": 2026}`
2. Process and retrieve the response
3. POST another message:
   - `type`: `Iceland.Holidays.IsHoliday`
   - `sendContent`: `{"date": "2026-12-25"}`
4. Process and retrieve the response

### Expected Results
- Step 2: Response contains an array of Icelandic public holidays for 2026 (including names in Icelandic)
- Step 4: Response confirms December 25 is a holiday (`"isHoliday": true`)

---

## Scenario 4: Postal Code Registry

**Area:** Core Functionality — Public Data

### Setup
1. Complete Scenario 1

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.PostCode.Get`
   - `sendContent`: `{}`
2. Process and retrieve the response

### Expected Results
- Response contains the full Icelandic postal code registry from Byggðastofnun
- Each entry includes postal code, place name, and municipality
- Well-known codes are present (e.g., 101 = Reykjavík)

---

## Scenario 5: ISO Currency List

**Area:** Core Functionality — Public Data

### Setup
1. Complete Scenario 1

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.Currency.Get`
   - `sendContent`: `{}`
2. Process and retrieve the response

### Expected Results
- Response contains the ISO 4217 currency list as JSON
- Includes ISK (Icelandic Króna), EUR, USD, and other standard currencies
- Each entry has code, name, and numeric code

---

## Scenario 6: Central Bank Currency Rates

**Area:** Core Functionality — Seðlabanki

### Setup
1. Complete Scenario 1

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.CurrencyRates.Get`
   - `sendContent`: `{"date": "2026-07-01"}`
2. Process and retrieve the response
3. POST another message:
   - `type`: `Iceland.CurrencyRates.Get`
   - `sendContent`: `{"dateFrom": "2026-06-01", "dateTo": "2026-06-30"}`
4. Process and retrieve the response

### Expected Results
- Step 2: Response contains exchange rates for the specified date (EUR, USD, GBP, etc. against ISK)
- Step 4: Response contains daily rates for the full month of June 2026

---

## Scenario 7: Currency Sync to BC

**Area:** Core Functionality — Seðlabanki

### Setup
1. Complete Scenario 1
2. Verify the "Currencies" and "Currency Exchange Rates" tables exist in BC

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.Currency.Sync`
   - `sendContent`: `{"date": "2026-07-01"}`
2. Process and retrieve the response
3. Navigate to "Currency Exchange Rates" in BC
4. Verify rates were updated for the specified date

### Expected Results
- Step 2: Response confirms sync completed with count of currencies updated
- Step 4: BC Currency Exchange Rate table contains fresh rates from Seðlabanki for the sync date

---

## Scenario 8: Central Bank Interest Rates and CPI

**Area:** Core Functionality — Seðlabanki

### Setup
1. Complete Scenario 1

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.InterestRates.Get`
   - `sendContent`: `{"latest": true}`
2. Process and retrieve the response
3. POST a Bifrost message:
   - `type`: `Iceland.ConsumerPriceIndex.Get`
   - `sendContent`: `{"latest": true}`
4. Process and retrieve the response
5. POST a Bifrost message:
   - `type`: `Iceland.PenaltyInterest.Get`
   - `sendContent`: `{"latest": true}`
6. Process and retrieve the response

### Expected Results
- Step 2: Response contains current policy rate and facility rates
- Step 4: Response contains current CPI index level and 12-month inflation rate
- Step 6: Response contains current penalty interest rate (dráttarvextir)

---

## Scenario 9: Kennitala Validation (island.is)

**Area:** Core Functionality — island.is

### Setup
1. Complete Scenario 1

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.Kennitala.Validate`
   - `sendContent`: `{"kennitala": "4502692829"}`
2. Process and retrieve the response
3. POST with an invalid kennitala:
   - `type`: `Iceland.Kennitala.Validate`
   - `sendContent`: `{"kennitala": "1234567890"}`
4. Process and retrieve the response

### Expected Results
- Step 2: Response confirms valid kennitala, returns type (individual/company) and derived birth date
- Step 4: Response indicates the kennitala is invalid with clear explanation

---

## Scenario 10: Vehicle Registry Lookup (island.is)

**Area:** Core Functionality — island.is

### Setup
1. Complete Scenario 1

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.Vehicle.Get`
   - `sendContent`: `{"plateNumber": "AA001"}`
2. Process and retrieve the response

### Expected Results
- Response contains vehicle information (make, model, year, registration details)
- If the plate is not found, a clear "not found" response is returned (not an error)

---

## Scenario 11: VAT Return Validation (Skatturinn)

**Area:** Core Functionality — Tax

### Setup
1. Complete Scenario 1
2. Configure RSK test credentials in Bifrost Setup (kennitala + password for test environment)

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.VAT.GetNumbers`
   - `sendContent`: `{}`
2. Process and retrieve — note the VAT number returned
3. POST a Bifrost message:
   - `type`: `Iceland.VAT.GetPeriodEntries`
   - `sendContent`: `{"period": "2026-01"}`
4. Process and retrieve the response
5. POST a Bifrost message:
   - `type`: `Iceland.VAT.Validate`
   - `sendContent`: (a valid VAT return structure for the test period)
6. Process and retrieve the response

### Expected Results
- Step 2: Response contains the company's VAT registration number(s)
- Step 4: Response contains period details and prerequisites
- Step 6: Response contains validation result (pass/fail with itemized messages)

---

## Scenario 12: VAT Return Submission and Receipt (Skatturinn)

**Area:** Core Functionality — Tax

### Setup
1. Complete Scenario 11 (validation passed)

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.VAT.Submit`
   - `sendContent`: (the validated VAT return from Scenario 11)
2. Process and retrieve the response
3. POST a Bifrost message:
   - `type`: `Iceland.VAT.Receipt`
   - `sendContent`: `{"period": "2026-01"}`
4. Process and retrieve the response

### Expected Results
- Step 2: Submission succeeds with confirmation number from RSK
- Step 4: Response contains the PDF receipt from the submitted period (base64-encoded)

### Cleanup
- Use `Iceland.VAT.DeleteInTest` to remove the test submission (test environment only)

---

## Scenario 13: Payroll Tax Return (Skatturinn — Staðgreiðsla)

**Area:** Core Functionality — Tax

### Setup
1. Complete Scenario 1
2. Configure RSK test credentials

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.Payroll.GetAllPeriods`
   - `sendContent`: `{}`
2. Process and retrieve — note available periods
3. POST a Bifrost message:
   - `type`: `Iceland.Payroll.Validate`
   - `sendContent`: (a payroll return for a test period)
4. Process and retrieve the response

### Expected Results
- Step 2: Response lists payroll tax periods with prerequisites and status
- Step 4: Validation returns pass/fail with itemized feedback

---

## Scenario 14: Capital Income Tax Information (Skatturinn — FTS)

**Area:** Core Functionality — Tax

### Setup
1. Complete Scenario 1
2. Configure RSK test credentials

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.CapitalTax.GetPeriods`
   - `sendContent`: `{}`
2. Process and retrieve the response
3. POST a Bifrost message:
   - `type`: `Iceland.CapitalTax.GetTypes`
   - `sendContent`: `{}`
4. Process and retrieve the response

### Expected Results
- Step 2: Response lists valid capital income tax periods
- Step 4: Response lists valid income types for capital tax reporting

---

## Scenario 15: SMS Sending (Síminn)

**Area:** Core Functionality — Communication

### Setup
1. Complete Scenario 1
2. Configure SMS gateway credentials in Bifrost Setup (Síminn magnSMS test account)

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.SMS.Send`
   - `sendContent`: `{"to": "+3548001234", "message": "Test message from Bifrost"}`
2. Process and retrieve the response — note the message ID
3. POST a Bifrost message:
   - `type`: `Iceland.SMS.Status`
   - `sendContent`: `{"messageId": "<id-from-step-2>"}`
4. Process and retrieve the response

### Expected Results
- Step 2: Response confirms the SMS was queued/sent with a message ID
- Step 4: Response contains delivery status for the message

### Notes
- Use a test number that does not deliver actual SMS (Síminn provides these for testing)

---

## Scenario 16: Pension/Union Information (Skilagrein)

**Area:** Core Functionality — Payroll Services

### Setup
1. Complete Scenario 1
2. Configure Skilagrein test credentials

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.PensionFund.Get`
   - `sendContent`: `{}`
2. Process and retrieve the response
3. POST a Bifrost message:
   - `type`: `Iceland.Union.Get`
   - `sendContent`: `{}`
4. Process and retrieve the response
5. POST a Bifrost message:
   - `type`: `Iceland.Collector.Get`
   - `sendContent`: `{}`
6. Process and retrieve the response

### Expected Results
- Step 2: Response contains list of Icelandic pension funds with codes and names
- Step 4: Response contains list of Icelandic unions with codes and names
- Step 6: Response contains list of collectors (innheimtumenn) with codes

---

## Scenario 17: Error Handling — Invalid RSK Credentials

**Area:** Error Handling

### Setup
1. Complete Scenario 1
2. Configure INVALID RSK credentials (wrong password)

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.VAT.GetNumbers`
   - `sendContent`: `{}`
2. Process and retrieve the response

### Expected Results
- The task completes with an error status
- The response contains a structured error message indicating authentication failed
- No raw SOAP fault or stack trace is exposed to the caller

---

## Scenario 18: Error Handling — Service Unavailable

**Area:** Error Handling

### Setup
1. Complete Scenario 1
2. Configure an unreachable URL or invalid endpoint for RSK (if configurable)

### Steps
1. POST a Bifrost message:
   - `type`: `Iceland.VAT.GetNumbers`
   - `sendContent`: `{}`
2. Process and retrieve the response

### Expected Results
- The task completes with an error status
- The error message clearly indicates the external service is unreachable
- The error is structured JSON, not a raw exception

---

## Scenario 19: Permission Verification — Minimal Permissions

**Area:** Permission Verification

### Setup
1. Create a test user with the "BIFROST Full ori" permission set from Bifrost Foundation (plus D365 BASIC). "BIFROST ISFull ori" is a permission set extension that adds the Iceland objects to it, so it is granted automatically and is not assigned separately.
2. Complete Scenario 1 as admin

### Steps
1. Sign in as the test user
2. POST a Bifrost message via the Queue API:
   - `type`: `Iceland.Holidays.Get`
   - `sendContent`: `{"year": 2026}`
3. Process and retrieve the response

### Expected Results
- The test user can submit and process Iceland-related Bifrost messages
- Holiday data is returned successfully

---

## Scenario 20: Permission Verification — No Permission

**Area:** Permission Verification

### Setup
1. Create a test user with only D365 BASIC (none of the BIFROST permission sets)

### Steps
1. Sign in as the test user
2. Attempt to invoke a Bifrost message type that requires Iceland permissions

### Expected Results
- The operation fails with a clear permission error
- No data is exposed or modified

---

## Scenario 21: Extension Uninstallation

**Area:** Uninstallation

### Setup
1. Complete Scenario 1

### Steps
1. Navigate to "Extension Management" in the BC search bar
2. Find "Bifrost Iceland" in the list
3. Choose "Uninstall"
4. Confirm the uninstallation
5. Verify the extension is removed
6. Verify "Bifrost Foundation" still functions (search for "Bifrost Setup")

### Expected Results
- Uninstallation completes without error
- The Iceland message types are no longer available
- Bifrost Foundation continues to work normally
- Standard BC operations are unaffected

---

## Cleanup

After all scenarios are complete:
1. Delete any test VAT submissions in the RSK test environment using `Iceland.VAT.DeleteInTest`
2. Remove test credentials from Bifrost Setup
3. Uninstall the extension (if not already done in Scenario 21)
