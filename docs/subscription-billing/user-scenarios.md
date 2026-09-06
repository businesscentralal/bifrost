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
**Test Environment:** A Business Central sandbox with Microsoft's **Subscription Billing** app and **Bifrost Foundation** installed. See "Test Credentials" and "Prerequisites" below.

---

## Test Credentials

| Field | Value |
| --- | --- |
| Environment | Sandbox with Subscription Billing enabled |
| Company | CRONUS, or any company with Subscription Billing set up |
| User | A user with SUPER, or with `BIFROST SubBil ori` plus a Bifröst Foundation permission set |

This extension holds no secrets of its own and calls no external service. Everything it does runs inside Business Central, against Microsoft's Subscription Billing app.

---

## Prerequisites

1. Install **Bifrost Foundation** and activate it — see the Foundation app's own setup guide.
2. Install **Subscription Billing** (Microsoft) and run its assisted setup, so that Subscription Contract Setup, number series and a Billing Template exist.
3. Install **Bifrost Subscription Billing**.
4. Assign the permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) to the test user, in addition to their Bifröst Foundation permissions.

### Company setup the later scenarios depend on

Scenarios 1 to 5 need nothing beyond the four steps above. The billing, deferral and usage scenarios post to the general ledger, so the company must also be set up for that. These are Microsoft's own Subscription Billing prerequisites rather than this app's, but they are easy to miss on a fresh sandbox — every one of them was hit while testing this release against a Business Central 28.4 container.

| Setup | Why it is needed | Symptom if missing |
| --- | --- | --- |
| **General Posting Setup** for the subscription item's posting group combination: *Cust. Sub. Contract Account*, *Cust. Sub. Contr. Def Account*, *Vend. Sub. Contract Account*, *Vend. Sub. Contr. Def. Account* | Contract deferrals post through these accounts | Posting a billing document fails with *"Cust. Sub. Contract Deferral Account must have a value in General Posting Setup..."* |
| **General Posting Setup**: sales and purchase line and invoice discount accounts, credit memo accounts | The deferral release journal needs them | `Subscription.Deferral.Release` fails with *"Sales Line Disc. Account must have a value..."* |
| **VAT Posting Setup** completed for the subscription item's VAT product posting group | Any posting | Posting fails with *"...VAT Posting Setup is blocked"* |
| **Source Code Setup → Sub. Contr. Deferrals Release** | Stamps the deferral release entries | `Subscription.Deferral.Release` fails with *"Subscription Contract Deferral must have a value in Source Code Setup"* |
| **Subscription Contract Setup → Def. Rel. Jnl. Template Name / Def. Rel. Jnl. Batch Name** | The journal the release posts through | `Subscription.Deferral.Release` cannot post |
| **Subscription Contract Setup → Vend. Sub. Contract Nos.** | Numbering vendor contracts | Creating a Vendor Subscription Contract fails |
| An **Item Unit of Measure** row for the subscription item, and the same code on the Subscription header | The invoicing item must share the subscription's unit | `Subscription.Contract.CreateInvoice` fails with *"The subscription's unit of measure contains a value that is not found in the item unit of measure..."* |
| **Currency Exchange Rates** covering the posting dates in use — including for the **Additional Reporting Currency**, if the company has one | Posting converts amounts to the additional reporting currency at the posting date | Posting fails with *"There is no Currency Exchange Rate within the filter"*. The reported currency code may be the **local** currency even when every document is in local currency and the missing rate belongs to the reporting currency, so check both |

### Extra setup for the usage-based billing scenarios

`Subscription.Usage.ImportData` parses the file through Microsoft's generic usage-data connector, which needs, in addition to the above:

- a **Usage Data Supplier** of type Generic;
- **Generic Import Settings** for that supplier, pointing at a **Data Exchange Definition** that maps the file's columns onto table 8018 *Usage Data Generic Import*;
- **Usage Data Supplier Reference**, **Usage Data Supp. Customer** and **Usage Data Supp. Subscription** rows linking the file's customer and subscription identifiers to the Business Central customer and the usage-based Subscription Line.

Without the Data Exchange Definition the import call still succeeds as a call and reports `processingStatus` of `Error` with Business Central's own reason — it does not throw.

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

## Scenario 2: Discovering the Message Types

**Area:** Core Functionality

### Steps
1. Invoke the Bifröst message type `Help.MessageTypes.Get` (Foundation).
2. Inspect the returned list.

### Expected Results
- The response includes 22 message types whose names begin with `Subscription.`
- Each has a non-empty `description`, a `messageDirection` of `Inbound`, and `isEnabled` of `true`.

---

## Scenario 3: Reading a Message Type's Help Document

**Area:** Core Functionality

### Steps
1. Invoke `Help.Implementation.Get` with the subject `Subscription.Billing.CreateProposal`.
2. Read the returned Markdown.
3. Repeat for any other `Subscription.*` type.

### Expected Results
- A Markdown document headed `Subscription.Billing.CreateProposal`, containing the sections Overview, Request Parameters, Request Example, Response Shape, Errors, Safety and Related Message Types.
- Every other `Subscription.*` type returns the same structure.

---

## Scenario 4: Core Functionality — Create a Billing Proposal

**Area:** Core Functionality

### Setup
1. In the client, open **Billing Templates** and note the code of an existing template, or create one for the Customer partner.

### Steps
1. Invoke `Subscription.Billing.CreateProposal` with a body such as:

   ```json
   { "billingTemplateCode": "MONTHLY", "billingDate": "2026-08-31" }
   ```

2. Open **Recurring Billing** in the client and filter on the same template.

### Expected Results
- The response has `"status": "Success"` and reports `proposalLinesCreated`.
- The same number of billing proposal lines is visible in Recurring Billing.
- If nothing was due, the call still succeeds with `proposalLinesCreated` of 0 — this is not an error.

---

## Scenario 5: Core Functionality — Bill a Contract to an Unposted Invoice

**Area:** Core Functionality

### Setup
1. Choose a Customer Subscription Contract with subscription lines due for billing.

### Steps
1. Invoke `Subscription.Contract.CreateInvoice` with the contract number as the message subject, or:

   ```json
   { "contractNo": "CC000010", "billingDate": "2026-08-31" }
   ```

2. Open **Sales Invoices** in the client.

### Expected Results
- The response lists the created document under `documents`.
- An **unposted** sales invoice with that number exists for the contract's customer. Nothing is posted.
- If the contract had nothing due, the response succeeds with an empty `documents` array and an explanatory `message`.

---

## Scenario 6: Preview Writes Nothing

**Area:** Core Functionality

### Setup
1. Note the number of unposted sales invoices for a customer, and the number of billing lines on one of that customer's contracts.

### Steps
1. Invoke `Subscription.Contract.PreviewInvoice` for that contract.
2. Re-check the sales invoice list and the contract's billing lines.

### Expected Results
- The response has `"status": "Success"`, `"preview": true` and `"rollback": true`, and describes what would be created.
- **No new invoice and no new billing line exists** — both counts are unchanged.

---

## Scenario 7: Error Handling — Invalid Input

**Area:** Error Handling

### Steps
1. Invoke `Subscription.Billing.CreateProposal` with a template code that does not exist:

   ```json
   { "billingTemplateCode": "DOES-NOT-EXIST" }
   ```

2. Invoke `Subscription.Contract.CreateInvoice` with no `contractNo` and no subject.

### Expected Results
- Both return `"status": "Error"` with a readable `error` message — the first naming the missing Billing Template, the second naming the missing required parameter.
- Nothing is written in either case.
- The response includes a `hint` pointing at `Help.Implementation.Get`.
- No unhandled exception or raw Business Central error dialog reaches the caller.

---

## Scenario 8: Documented Limitations Return a Clear Error

**Area:** Error Handling

### Steps
1. Invoke `Subscription.PriceUpdate.CreateProposal`.

### Expected Results
- The response is `"status": "Error"`.
- The message states that Microsoft has not exposed a public API for this operation in this version, names the Microsoft procedure concerned, and directs the user to the **Contract Price Update** page in the client.
- This is the documented, intended behaviour — see the [message type guide](/subscription-billing/message-types) and the app's changelog.

---

## Scenario 9: Data Integrity — No Deletions

**Area:** Core Functionality

### Steps
1. Review the message type list from Scenario 2.

### Expected Results
- No message type name ends in `.Delete`.
- The app never deletes subscription, contract or billing records.

---

## Scenario 10: Permission Verification

**Area:** Permission Verification

### Setup
1. Create a user **without** the `BIFROST SubBil ori` permission set, holding Bifröst Foundation access only.

### Steps
1. Sign in as that user and attempt to invoke `Subscription.Billing.CreateProposal`.
2. Assign `BIFROST SubBil ori` and retry.

### Expected Results
- Without the permission set, the call fails with a clear permission error and nothing is written.
- With it, the call succeeds — subject to the user's own permissions on the Subscription Billing tables, which this extension does not widen.

---

## Scenario 11: Extension Uninstallation

**Area:** Uninstallation

### Steps
1. Open **Extension Management**.
2. Uninstall **Bifrost Subscription Billing**.
3. Invoke `Help.MessageTypes.Get` again.

### Expected Results
- The extension uninstalls without error.
- The `Subscription.*` message types no longer appear.
- Bifröst Foundation and Microsoft's Subscription Billing continue to work normally, and no Subscription Billing data is removed by the uninstall.

---

## Cleanup

After all scenarios are complete:

1. Delete or post the unposted sales invoice created in Scenario 5.
2. Clear any billing proposal lines left standing under the template used in Scenario 4.
3. Remove the test user created in Scenario 10.
4. Uninstall the extension, if that was not already done in Scenario 11.
