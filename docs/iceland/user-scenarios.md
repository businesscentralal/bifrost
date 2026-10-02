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

The tester works through an AI assistant connected to Business Central with the Bifröst MCP server
(see [Connect your AI assistant](/setup/connect-your-ai/)), or calls Bifröst from any other client. Each step
says what to ask for and what to verify in Business Central or in the answer. The installed operations
and their contracts can be listed at any time with the MCP tools `list_message_types` and
`describe_message_type`, or on the Bifrost Message Types page.

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
1. Start with a clean BC sandbox with IS Core localization installed (an Icelandic demo company)
2. Install the "Bifrost Foundation" extension (dependency)
3. Install the "Bifrost Iceland" extension

### Steps
1. Search for "Bifrost Iceland Setup" in the BC search bar, or open it from the **Apps** group of the Bifrost Setup page
2. Verify the setup card opens without error
3. Verify the Umsja, SMS, Skatturinn, Skilagrein and Ja Gagnatorg FastTabs appear on the card
4. Open the Bifrost Message Types page and verify that Iceland operations are listed

### Expected Results
- The extension installs without error
- The Bifrost Iceland Setup card shows the client type and credential status fields of every domain
- The Iceland operations are registered and can be called

---

## Scenario 2: Discover the Iceland operations

**Area:** Core Functionality

### Setup
1. Complete Scenario 1 (extension installed)

### Steps
1. Ask the assistant: "Which Icelandic services can you use in Business Central?"

### Expected Results
- The assistant lists the Iceland operations grouped by service (Seðlabanki, Skatturinn, island.is, SMS, and so on)
- Each operation comes with a short description of what it does

---

## Scenario 3: Icelandic Holidays

**Area:** Core Functionality — Public Data

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "List the Icelandic public holidays in 2026."
2. Ask: "Is 25 December 2026 a public holiday in Iceland?"

### Expected Results
- Step 1: The answer lists the Icelandic public holidays for 2026, with their Icelandic names
- Step 2: The answer confirms that 25 December 2026 is a holiday

---

## Scenario 4: Postal Code Registry

**Area:** Core Functionality — Public Data

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "Get the Icelandic postal code list."

### Expected Results
- The answer contains the full Icelandic postal code registry from Byggðastofnun
- Each entry includes postal code, place name, and municipality
- Well-known codes are present (e.g., 101 = Reykjavík)

---

## Scenario 5: ISO Currency List

**Area:** Core Functionality — Public Data

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "Get the ISO 4217 currency list."

### Expected Results
- The answer includes ISK (Icelandic Króna), EUR, USD, and other standard currencies
- Each entry has code, name, and numeric code

---

## Scenario 6: Central Bank Currency Rates

**Area:** Core Functionality — Seðlabanki

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "What were Seðlabanki's exchange rates on 1 July 2026?"
2. Ask: "Show the daily rates for June 2026."

### Expected Results
- Step 1: The answer contains exchange rates for that date (EUR, USD, GBP, etc. against ISK)
- Step 2: The answer contains daily rates for the full month of June 2026

---

## Scenario 7: Currency Sync to BC

**Area:** Core Functionality — Seðlabanki

### Setup
1. Complete Scenario 1
2. Verify the "Currencies" and "Currency Exchange Rates" pages open in BC

### Steps
1. Ask the assistant: "Update the Business Central exchange rates from Seðlabanki for 1 July 2026."
2. Open "Currency Exchange Rates" in BC
3. Verify rates were updated for that date

### Expected Results
- Step 1: The assistant confirms the update and says how many currencies were updated
- Step 3: The Currency Exchange Rates page shows fresh rates from Seðlabanki for that date

---

## Scenario 8: Central Bank Interest Rates and CPI

**Area:** Core Functionality — Seðlabanki

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "What are Seðlabanki's current interest rates?"
2. Ask: "What is the latest consumer price index?"
3. Ask: "What is the current penalty interest rate (dráttarvextir)?"

### Expected Results
- Step 1: The answer contains the current policy rate and facility rates
- Step 2: The answer contains the current CPI level and the 12-month inflation rate
- Step 3: The answer contains the current penalty interest rate

---

## Scenario 9: Kennitala Validation (island.is)

**Area:** Core Functionality — island.is

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "Is 4502692829 a valid kennitala?"
2. Ask: "Is 1234567890 a valid kennitala?"

### Expected Results
- Step 1: The answer confirms the kennitala is valid and says whether it belongs to an individual or a company
- Step 2: The answer says the kennitala is invalid, with a clear explanation

---

## Scenario 10: Vehicle Registry Lookup (island.is)

**Area:** Core Functionality — island.is

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "Look up the vehicle with plate number AA001."

### Expected Results
- The answer contains vehicle information (make, model, year, registration details)
- If the plate is not found, the answer says so clearly rather than failing

---

## Scenario 11: VAT Return Validation (Skatturinn)

**Area:** Core Functionality — Tax

### Setup
1. Complete Scenario 1
2. Set the test company kennitala in Company Information and store the RSK test passwords with the Set VAT Password / Set Payroll Password actions on Bifrost Iceland Setup, with the Skatturinn client type set to Test

### Steps
1. Ask the assistant: "Which VAT numbers does Skatturinn have for this company?"
2. Ask: "Show the VAT period details for January 2026."
3. Ask the assistant to validate a VAT return for that test period with Skatturinn

### Expected Results
- Step 1: The answer contains the company's VAT registration number(s)
- Step 2: The answer contains the period details and prerequisites
- Step 3: The answer contains the validation result (pass or fail, with itemized messages)

---

## Scenario 12: VAT Return Submission and Receipt (Skatturinn)

**Area:** Core Functionality — Tax

### Setup
1. Complete Scenario 11 (validation passed)

### Steps
1. Ask the assistant to submit the validated VAT return from Scenario 11 to Skatturinn's test service
2. Ask: "Get the receipt for the January 2026 VAT return."

### Expected Results
- Step 1: The submission succeeds with a confirmation number from RSK
- Step 2: The receipt for the submitted period is returned as a PDF

### Cleanup
- Ask the assistant to delete the test submission (possible in the test environment only)

---

## Scenario 13: Payroll Tax Return (Skatturinn — Staðgreiðsla)

**Area:** Core Functionality — Tax

### Setup
1. Complete Scenario 1
2. Configure RSK test credentials

### Steps
1. Ask the assistant: "Which payroll tax periods are open with Skatturinn?"
2. Ask the assistant to validate a payroll return for one of the test periods

### Expected Results
- Step 1: The answer lists payroll tax periods with prerequisites and status
- Step 2: The validation returns pass or fail with itemized feedback

---

## Scenario 14: Capital Income Tax Information (Skatturinn — FTS)

**Area:** Core Functionality — Tax

### Setup
1. Complete Scenario 1
2. Configure RSK test credentials

### Steps
1. Ask the assistant: "Which capital income tax periods can be reported?"
2. Ask: "Which income types are used for capital income tax?"

### Expected Results
- Step 1: The answer lists valid capital income tax periods
- Step 2: The answer lists valid income types for capital tax reporting

---

## Scenario 15: SMS Sending (Síminn)

**Area:** Core Functionality — Communication

### Setup
1. Complete Scenario 1
2. Store the Síminn magnSMS test account credentials with the Set Síminn User Name / Set Síminn Password actions on Bifrost Iceland Setup

### Steps
1. Ask the assistant: "Send the SMS 'Test message from Bifrost' to +3548001234."
2. Ask: "Was that SMS delivered?"

### Expected Results
- Step 1: The assistant confirms the SMS was queued or sent and gives its message ID
- Step 2: The answer contains the delivery status of the message

### Notes
- Use a test number that does not deliver actual SMS (Síminn provides these for testing)

---

## Scenario 16: Pension/Union Information (Skilagrein)

**Area:** Core Functionality — Payroll Services

### Setup
1. Complete Scenario 1
2. Configure Skilagrein test credentials

### Steps
1. Ask the assistant: "Fetch the pension funds, unions and collectors from Skilagrein."
2. Open the Skilagrein master data pages from Bifrost Iceland Setup

### Expected Results
- Step 1: The answer lists Icelandic pension funds, unions and collectors (innheimtumenn) with codes and names
- Step 2: The same data appears on the Skilagrein master data pages

---

## Scenario 17: Error Handling — Invalid RSK Credentials

**Area:** Error Handling

### Setup
1. Complete Scenario 1
2. Configure INVALID RSK credentials (wrong password)

### Steps
1. Ask the assistant: "Which VAT numbers does Skatturinn have for this company?"

### Expected Results
- The request completes with an error status
- The answer explains that authentication failed
- No raw SOAP fault or stack trace is exposed to the caller

---

## Scenario 18: Error Handling — Service Unavailable

**Area:** Error Handling

### Setup
1. Complete Scenario 1
2. Make the RSK service unreachable (for example, disallow outgoing HTTP requests for the extension in Extension Management)

### Steps
1. Ask the assistant: "Which VAT numbers does Skatturinn have for this company?"

### Expected Results
- The request completes with an error status
- The error message clearly indicates the external service could not be reached
- The error is structured, not a raw exception

---

## Scenario 19: Permission Verification — Minimal Permissions

**Area:** Permission Verification

### Setup
1. Create a test user with the "BIFROST Full ori" permission set from Bifrost Foundation (plus D365 BASIC). "BIFROST ISFull ori" is a permission set extension that adds the Iceland objects to it, so it is granted automatically and is not assigned separately.
2. Complete Scenario 1 as admin

### Steps
1. Connect the assistant as the test user
2. Ask: "List the Icelandic public holidays in 2026."

### Expected Results
- The test user can call the Iceland operations
- Holiday data is returned successfully

---

## Scenario 20: Permission Verification — No Permission

**Area:** Permission Verification

### Setup
1. Create a test user with only D365 BASIC (none of the BIFROST permission sets)

### Steps
1. Connect the assistant as the test user
2. Ask for an operation that requires Iceland permissions, for example "Which VAT numbers does Skatturinn have for this company?"

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
- The Iceland operations are no longer listed on the Bifrost Message Types page
- Bifrost Foundation continues to work normally
- Standard BC operations are unaffected

---

## Cleanup

After all scenarios are complete:
1. Delete any test VAT submissions in the RSK test environment (ask the assistant to delete the test submission)
2. Remove test credentials with the Clear actions on Bifrost Iceland Setup
3. Uninstall the extension (if not already done in Scenario 21)
