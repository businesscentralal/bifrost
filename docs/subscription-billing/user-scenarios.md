---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Publisher:** Origo
**App:** Bifrost Subscription Billing (`dd7b8bd8-f93e-4ac4-a251-1a132a14ef3d`)
**Version:** 29.0.0.0
**Submission Date:** 2026-09-06
**Test Environment:** A Business Central sandbox with Microsoft's **Subscription Billing** app and **Bifrost Foundation** installed, and an AI assistant connected to Bifröst. See "Test Credentials" and "Prerequisites" below.

---

## Test Credentials

| Field | Value |
| --- | --- |
| Environment | Sandbox with Subscription Billing enabled |
| Company | The demo company, or any company with Subscription Billing set up |
| User | A user with SUPER, or with `BIFROST SubBil ori` plus a Bifröst Foundation permission set |

This extension holds no secrets of its own and calls no external service. Everything it does runs inside Business Central, against Microsoft's Subscription Billing app.

---

## Prerequisites

1. Install **Bifrost Foundation** and activate it — see the Foundation app's own setup guide.
2. Install **Subscription Billing** (Microsoft) and run its assisted setup, so that Subscription Contract Setup, number series and a Billing Template exist.
3. Install **Bifrost Subscription Billing**.
4. Assign the permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) to the test user, in addition to their Bifröst Foundation permissions.
5. Connect an AI assistant (for example Copilot, ChatGPT or Claude) to the sandbox through the Bifröst MCP server, as described in [Connect your AI assistant](/setup/connect-your-ai/). Every request the assistant makes is logged on the **Bifrost Messages** page in Business Central.

### Company setup the later scenarios depend on

Scenarios 1 to 5 need nothing beyond the steps above. The billing, deferral and usage scenarios post to the general ledger, so the company must also be set up for that. These are Microsoft's own Subscription Billing prerequisites rather than this app's, but they are easy to miss on a fresh sandbox.

| Setup | Why it is needed | Symptom if missing |
| --- | --- | --- |
| **General Posting Setup** for the subscription item's posting group combination: *Cust. Sub. Contract Account*, *Cust. Sub. Contr. Def Account*, *Vend. Sub. Contract Account*, *Vend. Sub. Contr. Def. Account* | Contract deferrals post through these accounts | Posting a billing document fails with *"Cust. Sub. Contract Deferral Account must have a value in General Posting Setup..."* |
| **General Posting Setup**: sales and purchase line and invoice discount accounts, credit memo accounts | The deferral release journal needs them | Releasing deferrals fails with *"Sales Line Disc. Account must have a value..."* |
| **VAT Posting Setup** completed for the subscription item's VAT product posting group | Any posting | Posting fails with *"...VAT Posting Setup is blocked"* |
| **Source Code Setup → Sub. Contr. Deferrals Release** | Stamps the deferral release entries | Releasing deferrals fails with *"Subscription Contract Deferral must have a value in Source Code Setup"* |
| **Subscription Contract Setup → Def. Rel. Jnl. Template Name / Def. Rel. Jnl. Batch Name** | The journal the release posts through | Releasing deferrals cannot post |
| **Subscription Contract Setup → Vend. Sub. Contract Nos.** | Numbering vendor contracts | Creating a Vendor Subscription Contract fails |
| An **Item Unit of Measure** row for the subscription item, and the same code on the Subscription header | The invoicing item must share the subscription's unit | Billing a contract fails with *"The subscription's unit of measure contains a value that is not found in the item unit of measure..."* |
| **Currency Exchange Rates** covering the posting dates in use — including for the **Additional Reporting Currency**, if the company has one | Posting converts amounts to the additional reporting currency at the posting date | Posting fails with *"There is no Currency Exchange Rate within the filter"*. The reported currency code may be the **local** currency even when every document is in local currency and the missing rate belongs to the reporting currency, so check both |

### Extra setup for the usage-based billing scenarios

Importing usage data parses the file through Microsoft's generic usage-data connector, which needs, in addition to the above:

- a **Usage Data Supplier** of type Generic;
- **Generic Import Settings** for that supplier, pointing at a **Data Exchange Definition** that maps the file's columns onto the table *Usage Data Generic Import*;
- **Usage Data Supplier Reference**, **Usage Data Supp. Customer** and **Usage Data Supp. Subscription** rows linking the file's customer and subscription identifiers to the Business Central customer and the usage-based Subscription Line.

Without the Data Exchange Definition the import still completes as a request and reports a processing status of Error with Business Central's own reason — it does not throw.

---

## Scenario 1: Installation and Activation

**Area:** Installation & Activation

### Steps
1. Open **Extension Management**.
2. Confirm **Bifrost Subscription Billing** is listed and installed.
3. Confirm the dependency **Bifrost Foundation** is installed and appears above it.
4. Open **Users**, select the test user, and confirm the permission set **Bifrost Sub. Billing** can be assigned.

### Expected Results
- The extension installs with no errors.
- Its permission set is assignable to a user.

---

## Scenario 2: Discovering the Operations

**Area:** Core Functionality

### Steps
1. Open the **Bifrost Message Types** page in Business Central.
2. Ask the assistant: "What can you do with Subscription Billing?"

### Expected Results
- The page lists the Subscription Billing operations of this app, each with a description, as inbound and enabled.
- The assistant describes the same operations — contracts, billing proposals, previews, usage data, deferrals, renewals and import — read from Business Central itself.

---

## Scenario 3: Reading an Operation's Help

**Area:** Core Functionality

### Steps
1. Ask the assistant: "Show me the help for the operation that creates a billing proposal." (The assistant reads it with `Help.Implementation.Get`.)
2. Repeat for any other Subscription Billing operation.

### Expected Results
- A help document for the operation, with the sections Overview, Request Parameters, Request Example, Response Shape, Errors, Safety and Related Message Types.
- Every other Subscription Billing operation returns the same structure.

---

## Scenario 4: Core Functionality — Create a Billing Proposal

**Area:** Core Functionality

### Setup
1. In the client, open **Billing Templates** and note the code of an existing template, or create one for the Customer partner.

### Steps
1. Ask the assistant: "Create a billing proposal for billing template MONTHLY with billing date 31 August 2026." (Use the template code from the setup step.)
2. Open **Recurring Billing** in the client and filter on the same template.

### Expected Results
- The assistant reports success and how many proposal lines were created.
- The same number of billing proposal lines is visible in Recurring Billing.
- If nothing was due, the request still succeeds with 0 lines created — this is not an error.

---

## Scenario 5: Core Functionality — Bill a Contract to an Unposted Invoice

**Area:** Core Functionality

### Setup
1. Choose a Customer Subscription Contract with subscription lines due for billing.

### Steps
1. Ask the assistant: "Create an invoice for customer subscription contract CC000010 with billing date 31 August 2026." (Use the contract number from the setup step.)
2. Open **Sales Invoices** in the client.

### Expected Results
- The assistant reports the number of the created document.
- An **unposted** sales invoice with that number exists for the contract's customer. Nothing is posted.
- If the contract had nothing due, the request succeeds, no document is created and the assistant explains why.

---

## Scenario 6: Preview Writes Nothing

**Area:** Core Functionality

### Setup
1. Note the number of unposted sales invoices for a customer, and the number of billing lines on one of that customer's contracts.

### Steps
1. Ask the assistant: "Preview the invoice for that contract, without creating anything."
2. Re-check the sales invoice list and the contract's billing lines.

### Expected Results
- The assistant reports a successful preview that was rolled back, and describes what would be created.
- **No new invoice and no new billing line exists** — both counts are unchanged.

---

## Scenario 7: Error Handling — Invalid Input

**Area:** Error Handling

### Steps
1. Ask the assistant: "Create a billing proposal for billing template DOES-NOT-EXIST."
2. Ask the assistant to create a contract invoice without naming a contract, and tell it to send the request as it is.
3. Open **Bifrost Messages** and find both requests.

### Expected Results
- Both requests end with an error status and a readable message — the first naming the missing Billing Template, the second naming the missing contract.
- Nothing is written in either case.
- Each answer points to `Help.Implementation.Get` for the correct request.
- No unhandled exception or raw Business Central error dialog reaches the user.

---

## Scenario 8: Documented Limitations Return a Clear Error

**Area:** Error Handling

### Steps
1. Ask the assistant: "Create a price update proposal for Subscription Billing."

### Expected Results
- The request ends with an error status.
- The message states that Microsoft has not exposed a public API for this operation in this version, names the Microsoft procedure concerned, and directs the user to the **Contract Price Update** page in the client.
- This is the documented, intended behaviour — see the app's changelog.

---

## Scenario 9: Data Integrity — No Deletions

**Area:** Core Functionality

### Steps
1. Review the Subscription Billing operations on the **Bifrost Message Types** page from Scenario 2.

### Expected Results
- None of the operations deletes records.
- The app never deletes subscription, contract or billing records.

---

## Scenario 10: Permission Verification

**Area:** Permission Verification

### Setup
1. Create a user **without** the `BIFROST SubBil ori` permission set, holding Bifröst Foundation access only.

### Steps
1. Connect the AI assistant as that user and ask it to create a billing proposal for an existing billing template.
2. Assign `BIFROST SubBil ori` and retry.

### Expected Results
- Without the permission set, the request fails with a clear permission error and nothing is written.
- With it, the request succeeds — subject to the user's own permissions on the Subscription Billing tables, which this extension does not widen.

---

## Scenario 11: Extension Uninstallation

**Area:** Uninstallation

### Steps
1. Open **Extension Management**.
2. Uninstall **Bifrost Subscription Billing**.
3. Open the **Bifrost Message Types** page again.

### Expected Results
- The extension uninstalls without error.
- The Subscription Billing operations no longer appear.
- Bifröst Foundation and Microsoft's Subscription Billing continue to work normally, and no Subscription Billing data is removed by the uninstall.

---

## Cleanup

After all scenarios are complete:

1. Delete or post the unposted sales invoice created in Scenario 5.
2. Clear any billing proposal lines left standing under the template used in Scenario 4.
3. Remove the test user created in Scenario 10.
4. Uninstall the extension, if that was not already done in Scenario 11.
