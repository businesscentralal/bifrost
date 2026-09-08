---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Publisher:** Origo
**Version:** 28.0.0.0
**Submission Date:** 2026-09-06
**Test Environment:** An Icelandic Business Central sandbox (Cronus IS) with the Bifrost Foundation extension installed. The extension connects to the B2B web services of five Icelandic banks over signed SOAP and REST; there is no mock or offline mode for a live bank call. See "Test Credentials" below.

---

## Test Credentials

This extension talks to five separate banks, each of which issues its own credentials. Bank services are not public: none of them can be reached without an agreement and an issued identity, so the scenarios that call a bank need credentials supplied with the submission.

| Service | Purpose | What the connector needs |
|---------|---------|--------------------------|
| Landsbankinn | Claims, cards, accounts, portfolios, payments, statements, electronic documents | B2B user name, company password, client signing certificate with its password, REST API key |
| Arion banki | Accounts, statements, bills, credit cards, claims, payments, electronic documents | B2B user name, company password, client signing certificate with its password |
| Íslandsbanki | Statements, claims, payments, securities, presentment files | B2B user name, company password, the bank's own public certificate |
| Kvika banki | Claims, statements, payments, currency rates | B2B user name, company password, client signing certificate with its password |
| Sparisjóðir | Statements, claims, payments, accounts, bills, cards | B2B user name, company password, client signing certificate with its password |

**Origo supplies test credentials with the submission**, valid for at least four weeks, for whichever banks the validation team intends to exercise. The credentials are provided through the submission channel and are deliberately not published here or anywhere in the product documentation.

Every scenario below except the ones that call a bank (5 and 6) can be executed without any bank credentials at all. Scenario 8 requires that a bank has **no** credentials stored, which is the state a fresh install is in.

---

## Scenario 1: Installation and Activation

**Area:** Installation & Activation

### Setup
1. Start with a clean Business Central sandbox with the IS localization (Cronus IS company).
2. Install the **Bifrost Foundation** extension (dependency).

### Steps
1. Install **Bifrost Iceland Treasury**.
2. Open **Extension Management**, select Bifrost Iceland Treasury and confirm **Allow HttpClient Requests** is ticked. Tick it if it is not — the bank connectors call the banks over HTTPS and Business Central blocks outbound calls from an extension until an administrator allows them.
3. Search for **Bifrost Setup** and open it.
4. On the **Apps** group, confirm an **Iceland Treasury** entry appears with an action that opens the treasury setup page.
5. Invoke `Help.MessageTypes.Get` over the queue API and confirm the bank message types are registered.

### Expected Results
- The extension installs without error and without disturbing existing functionality.
- Outgoing HTTP client requests can be allowed for the extension.
- The Bifrost Setup page gains exactly one Iceland Treasury action under **Apps**; no bank-specific fields are added to that page.
- The message type list contains the Landsbankinn, Arion banki, Íslandsbanki, Kvika banki and Sparisjóðir types.

---

## Scenario 2: Guided Setup with the Treasury Setup Wizard

**Area:** Assisted Setup

### Setup
1. Complete Scenario 1.

### Steps
1. Search for **Assisted Setup** and locate **Set up Bifrost Iceland Treasury**. Start it.
2. Step through **Welcome**, then the **Allow outbound HTTP** step and confirm the status reads *Allowed*.
3. Continue to the **Landsbankinn** step. Leave **Enabled** on and enter the company-default B2B user name.
4. Use **Set Company Password** and enter the supplied password in the masked dialog.
5. Use **Set Certificate**, upload the supplied `.pfx` and enter its password.
6. Continue through the remaining bank steps without entering anything, then choose **Finish**.
7. Reopen the wizard and confirm the Landsbankinn step still shows the user name and *Stored* for the password and certificate.

### Expected Results
- One assisted setup covers all five banks — there is one row in the Assisted Setup list, not five.
- The **Certificate** and **API Key** rows appear only for the banks that use them: no certificate row on the Íslandsbanki step, an API key row only on Landsbankinn.
- Secret dialogs are masked and name the bank and the secret being asked for.
- A certificate is verified against the entered password before either value is stored; a wrong password is refused at that point.
- Leaving the wizard early loses nothing, and re-running it does not reset a bank that is already configured.
- After **Finish**, the assisted setup is marked complete.

---

## Scenario 3: Configuring a Bank on the Treasury Setup List

**Area:** Setup

### Setup
1. Complete Scenario 1.

### Steps
1. From **Bifrost Setup** → **Apps**, open the Iceland Treasury setup page.
2. Confirm the page lists five rows, one per bank, showing **Bank**, **Enabled**, **Username** and **Secrets**.
3. Select **Arion banki**, leave **Enabled** on and enter the company-default B2B user name.
4. Run **Set Company Password** and enter the supplied password.
5. Run **Set Certificate**, upload the supplied client signing certificate and enter its password.
6. Read the certificate FactBox on the right.
7. Select **Íslandsbanki** and inspect the available actions and the FactBox.
8. Select a configured bank and run **Clear Company Secrets**, confirming the prompt.

### Expected Results
- Step 2: all five banks are configured from this one page. The **Secrets** column shows *Complete* or *Missing* per bank.
- Step 5: the certificate is validated against the password before either is stored.
- Step 6: the FactBox shows the certificate's subject, issuer, thumbprint and validity dates, with the expiry date coloured red once expired and amber in its final 30 days.
- Step 7: for Íslandsbanki the certificate action is disabled and the FactBox states the bank uses no client signing certificate; a **Set Bank Certificate** action is offered instead. The API key action is enabled only for Landsbankinn.
- Step 8: the confirmed clear removes the bank's stored company secrets and the **Secrets** column returns to *Missing*. **Enabled** is unaffected.
- No secret value is ever displayed back on the page — only whether one is present.

---

## Scenario 4: Per-User Bank Credentials

**Area:** Setup — Personal Credentials

### Setup
1. Complete Scenario 3 for at least one bank, so a company default exists.

### Steps
1. Search for **Bifrost User Setup** and select the current user.
2. Locate the group for the configured bank and enter a personal B2B user name.
3. Run the **Set My … Password** action for that bank and enter the personal password.
4. Confirm **User Password Stored** now reads as stored.
5. Run the matching **Clear My … Password** action.

### Expected Results
- The page carries one group per bank connector, each with the same shape.
- A personal user name overrides the company default for that user only; other users are unaffected.
- The stored indicator reports presence only — the password is never displayed again.
- User name and password are resolved as a pair: with a personal user name set, the user's own password is used and never the company password.
- Clearing removes the personal value and the user falls back to the company default.

---

## Scenario 5: Query a Bank over the Queue API

**Area:** Core Functionality — Bank Query

### Setup
1. Complete Scenario 3 for one bank, with credentials supplied by Origo.
2. Confirm the bank's row shows **Enabled** and **Secrets** = *Complete*.

### Steps
1. POST a Bifrost message via the Queue API naming the bank's currency rate type, for example `Arionbanki.CurrencyRates.Get`, with the request body described by its help contract.
2. Process the task via the Task API.
3. Retrieve the response from the Data API.
4. Repeat with an account or statement type for the same bank, for example `Landsbankinn.Account.List` or `Sparisjodir.Statement.Get`.
5. Invoke `Help.Implementation.Get` for one of the types used.

### Expected Results
- Step 3: the response is structured JSON containing the bank's published rates; content type is `application/json`.
- Step 4: the response contains the requested accounts or statement lines for the given account and date range.
- Step 5: the help response documents that message type's exact request and response contract.
- The whole exchange runs through the standard Queue → Task → Data pattern; no Business Central page interaction is required.

---

## Scenario 6: Bank Statement Import into Bank Acc. Reconciliation

**Area:** Core Functionality — Statement Import

### Setup
1. Complete Scenario 3 for Landsbankinn, Arion banki or Sparisjóðir (the three banks that import statements).
2. Open a Business Central bank account and set **Bank Statement Import Format** to the Data Exchange definition the module installed for that bank. For Sparisjóðir, choose the definition of the savings bank the company banks with — that choice selects the savings bank.

### Steps
1. Create a new **Bank Acc. Reconciliation** for that bank account.
2. Choose **Import Bank Statement**.
3. In the **Select Start Date** dialog, enter a date in the past and confirm.
4. Review the **Statement Import Summary** that opens.
5. Close the summary and inspect the reconciliation lines.
6. Repeat the import on the same account and observe that the start date dialog no longer appears.

### Expected Results
- Step 3: the dialog appears because there is no earlier posted statement to continue from. An empty or future date is refused with a clear message.
- Step 4: the read-only summary reports the bank account, the statement number, the number of lines imported, the calculated starting and ending balances, the bank-reported balance and the account details returned in the statement header. A warning band appears only when the balances do not agree.
- Step 5: reconciliation lines carry transaction date, amount, description and running balance, mapped through the standard Data Exchange mapping.
- Step 6: with a previous statement in place the date window is derived automatically and the dialog is skipped.
- Closing the summary does not undo the import.

---

## Scenario 7: Permission Sets — Statement Reads Without Payment Execution

**Area:** Permission Verification

### Setup
1. Complete Scenario 3 for one bank.
2. Create a test user with **D365 BASIC** plus only that bank's statement permission set — for example `BIFROST SPStmt ori` for Sparisjóðir or `BIFROST LBStmt ori` for Landsbankinn. Do not grant the bank's payment set or a full set.

### Steps
1. Sign in as the test user.
2. Invoke the bank's statement or account message type over the Queue API and process the task.
3. Invoke the bank's payment batch message type and process the task.

### Expected Results
- Step 2: the statement or account call succeeds and returns data.
- Step 3: the call is refused because the caller is not through the payment access gate. The refusal is a clear, structured permission error; no payment is submitted to the bank and no data is modified.
- Each money- or state-moving domain sits behind its own gate, so read access can be granted independently of execution rights.
- A user holding Bifrost Foundation's `BIFROST Full ori` reaches the whole integration, because each bank's full set extends it.

---

## Scenario 8: Error Handling — Bank Called with a Missing Secret

**Area:** Error Handling

### Setup
1. Complete Scenario 1 only, or run **Clear Company Secrets** for the bank under test so its **Secrets** column reads *Missing*.
2. Leave the bank's row **Enabled**.

### Steps
1. POST a Bifrost message naming any message type of that bank, for example its currency rate or statement type.
2. Process the task via the Task API.
3. Retrieve the response from the Data API.
4. Repeat with a personal user name set on **Bifrost User Setup** but no personal password stored.

### Expected Results
- The task completes with an error status; it does not crash, hang or return an HTTP 5xx.
- The response is a structured error stating that the connector is not configured, naming what is missing. The message type reports itself as unavailable and refuses to run rather than calling the bank and failing there.
- No raw SOAP fault, stack trace or partial response reaches the caller.
- No credential value, certificate content or endpoint detail appears in the error text or in the request log.
- Step 4: the mismatched pair is reported as such — the connector states that a personal password is missing instead of quietly falling back to the company password.

---

## Cleanup

After all scenarios are complete:
1. Run **Clear Company Secrets** for every bank configured during testing, and clear any personal secrets from Bifrost User Setup.
2. Delete the test bank reconciliations created in Scenario 6.
3. Uninstall Bifrost Iceland Treasury and confirm Bifrost Foundation continues to work — the Bifrost Setup page opens, and the bank message types are gone while Foundation's own types remain.

---

## Related documentation

- [Bifröst Iceland Treasury overview](/iceland-treasury/)
- [Message type reference](/iceland-treasury/reference/message-types/) — the request and response contract for every type
- [Draupnir signer framework](./reference/draupnir-signers.md)
- In-product help: [Treasury Setup](/help/iceland-treasury/treasury-setup/), [Setup Wizard](/help/iceland-treasury/treasury-setup-wizard/), [Bank secrets](/help/iceland-treasury/treasury-secrets/), [Your bank credentials](/help/iceland-treasury/bank-user-setup/), [Select Start Date](/help/iceland-treasury/date-input-dialog/), [Statement Import Summary](/help/iceland-treasury/statement-import-summary/)
