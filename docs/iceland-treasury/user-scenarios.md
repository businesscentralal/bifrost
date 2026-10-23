---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Publisher:** Origo
**Test Environment:** Most scenarios need no bank credentials. Scenarios 6 and 7 need test credentials for
one bank and an AI assistant connected to Bifröst. See "Test Credentials" and "AI assistant" below.

---

## Test Credentials

This extension calls the web services of Arion banki, Íslandsbanki and Landsbankinn.

**Provide:** Origo supplies, with the submission, a user name, password, client certificate (`.pfx`) and
certificate password for one bank, and the account number of a test account at that bank. They are
entered on **Bifrost Iceland Treasury Setup** with **Set Company Password** and **Set Certificate** and
kept in protected storage; the page shows only whether they are stored.

Scenarios 1 to 5 and 8 need no credentials.

---

## AI assistant

Scenario 7 is run through an AI assistant (for example Copilot, ChatGPT or Claude) connected to the
sandbox through the Bifröst MCP server, as described in [Connect your assistant](/setup/connect-your-ai/).
Every request the assistant makes is logged on the **Bifrost Messages** page in Business Central, where
the tester can check its status and result. Every call to a bank is also logged on the **Bifrost Request
Log**, with the passwords masked.

---

## Scenario 1: Installation and setup page

**Area:** Installation & Activation

### Setup
1. Start with a clean Business Central sandbox (demo company)
2. Install the "Bifrost Foundation" extension (dependency) and complete its setup
3. Install the "Bifrost Iceland Treasury" extension
4. Assign the permission set "BIFROST TAdmin ori" to the test user

### Steps
1. Open the "Bifrost Setup" page from the search bar
2. If the page shows the notification about HTTP client requests, choose "Start setup wizard" on it and complete the wizard
3. Choose "Iceland Treasury" in the "Apps" group

### Expected Results
- The extension installs without errors
- "Bifrost Iceland Treasury Setup" opens with one row each for "Arion banki", "Íslandsbanki" and "Landsbankinn"
- Each row is enabled and shows "Missing" under "Secrets"

---

## Scenario 2: Guided setup

**Area:** Setup

### Setup
1. Complete Scenario 1

### Steps
1. Open "Assisted Setup" from the search bar
2. Start "Set up Bifrost Iceland Treasury banks"
3. Choose "Next" on the welcome step
4. On the "Arion banki" step, enter a user name in "Username"
5. Choose "Next" until the "Landsbankinn" step, then choose "Finish"
6. Open "Bifrost Iceland Treasury Setup" again

### Expected Results
- The guide shows one step per bank, each with "Enabled", "Username", "Company Password" and "Certificate"; only the Landsbankinn step shows "API Key"
- "Company Password" and "Certificate" show "Not stored"
- After "Finish", the guide is marked as completed in "Assisted Setup"
- The Arion banki row shows the user name entered in step 4

---

## Scenario 3: Store and clear a secret

**Area:** Setup / Security

### Setup
1. Complete Scenario 1

### Steps
1. On "Bifrost Iceland Treasury Setup", select the "Landsbankinn" row
2. Choose "Set Company Password", type any value in "Value" and choose "OK"
3. Choose "Set API Key", type any value and choose "OK"
4. Select the "Arion banki" row and look at the actions
5. Select the "Landsbankinn" row again and choose "Clear Company Secrets", then confirm

### Expected Results
- The value is masked while typing and is never shown on the page afterwards
- "Set API Key" is available for Landsbankinn and not for Arion banki
- The "Certificate" FactBox says that no certificate is stored
- After step 5 nothing is stored for Landsbankinn, and "Secrets" shows "Missing"

---

## Scenario 4: Setup is read-only without the setup permission set

**Area:** Permissions

### Setup
1. Complete Scenario 1
2. Sign in as a second test user who has "BIFROST Full ori" but not "BIFROST TAdmin ori"

### Steps
1. Open "Bifrost Setup" and choose "Iceland Treasury"
2. Try to change "Username" on a row and look at "Set Company Password"

### Expected Results
- The page opens read-only: "Username" cannot be changed
- "Set Company Password", "Set Certificate" and "Clear Company Secrets" are not available

---

## Scenario 5: The tracking pages

**Area:** Usability

### Setup
1. Complete Scenario 1

### Steps
1. On "Bifrost Iceland Treasury Setup", choose "Bank Payment Batches"
2. Close it and choose "Bank Claims", "Bank Claim Batches", "Bank Claim Payments" and "Bank Tracking Log" in turn

### Expected Results
- Each page opens without errors and is read-only (no new, edit or delete)
- "Bank Payment Batches" shows the parts "Payments" and "Payment Charges"; "Bank Claims" shows "Ledger Entries" and "Claim Payments"
- On a new company the lists are empty

---

## Scenario 6: Import a bank statement into bank reconciliation

**Area:** Core Functionality

### Setup
1. Complete Scenario 1, and store the test credentials from "Test Credentials" on the bank's row with "Set Company Password" and "Set Certificate", and the user name in "Username"
2. On a Business Central bank account, set "Bank Account No." to the test account number and "Bank Statement Import Format" to the bank's format: "ARION-FEED-IN", "ISB-FEED-IN" or "LBI-FEED-IN"

### Steps
1. Open "Bank Account Reconciliations" and create a new reconciliation for that bank account, with yesterday as the statement date
2. Choose "Import Bank Statement"
3. In "Select Start Date", enter a date one month back and choose "OK"

### Expected Results
- The bank's row shows "Complete" under "Secrets" before the import
- The "Statement Import Summary" opens, showing the bank account, the number of lines imported and the balances
- The reconciliation has a line for each transaction of the period
- The call is logged on the "Bifrost Request Log" with the password masked

---

## Scenario 7: Ask the assistant about the bank

**Area:** Core Functionality

### Setup
1. Complete Scenario 6
2. Connect the AI assistant as described in "AI assistant"

### Steps
1. Ask the assistant: "What are today's currency rates at the bank?" (name the bank whose credentials are stored)
2. Ask the assistant whether the test account number from "Test Credentials" is a valid account at the bank

### Expected Results
- The assistant answers with the bank's rates for today
- The assistant answers whether the account exists
- Both requests are logged on "Bifrost Messages" with status "Processed"

---

## Scenario 8: A bank without secrets is not called

**Area:** Error Handling

### Setup
1. Complete Scenario 1, with no secrets stored for "Íslandsbanki"

### Steps
1. On a Business Central bank account, set "Bank Account No." to any 12-digit account number and "Bank Statement Import Format" to "ISB-FEED-IN"
2. Create a bank account reconciliation for it and choose "Import Bank Statement"

### Expected Results
- The import stops with an error that names Íslandsbanki and the missing user name or password
- No reconciliation lines are created
- Business Central stays usable

---

## Cleanup

1. On "Bifrost Iceland Treasury Setup", choose "Clear Company Secrets" on each bank row that has secrets
2. Delete the test bank account reconciliations
3. Uninstall "Bifrost Iceland Treasury", then "Bifrost Foundation", if the sandbox is reused
