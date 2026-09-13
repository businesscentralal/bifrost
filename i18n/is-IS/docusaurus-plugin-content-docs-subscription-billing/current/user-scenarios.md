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
**Test Environment:** A Business Central sandbox með Microsoft's **Subscription Billing** app og **Bifrost Foundation** installed. See "Test Credentials" og "Prerequisites" below.

---

## Test Credentials

| Field | Value |
| --- | --- |
| Environment | Sandbox með Subscription Billing enabled |
| Company | CRONUS, eða any company með Subscription Billing set up |
| Notaður | A notandi með SUPER, eða með `BIFROST SubBil ori` plus a Bifröst Foundation permission set |

This extension holds no secrets of its own og calls no external service. Everything it does runs inside Business Central, against Microsoft's Subscription Billing app.

---

## Prerequisites

1. Install **Bifrost Foundation** og activate it — see the Foundation app's own setup guide.
2. Install **Subscription Billing** (Microsoft) og run its assisted setup, so that Subscription Contract Stilltuup, number series og a Billing Template exist.
3. Install **Bifrost Subscription Billing**.
4. Assign the permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) to the test notandi, in addition to their Bifröst Foundation permissions.

### Company setup the later scenarios depend on

Scenarios 1 to 5 need nothing beyond the four steps above. The billing, deferral og usage scenarios post to the general ledger, so the company verður also be set up fyrir that. These eru Microsoft's own Subscription Billing prerequisites rather than this app's, but they eru easy to miss on a fresh sandbox — every one of them was hit while testing this release against a Business Central 28.4 container.

| Stilltuup | Why it er needed | Symptom ef missing |
| --- | --- | --- |
| **General Posting Stilltuup** fyrir the subscription vara's posting group combination: *Cust. Sub. Contract Account*, *Cust. Sub. Contr. Def Account*, *Vend. Sub. Contract Account*, *Vend. Sub. Contr. Def. Account* | Contract deferrals post through these accounts | Posting a billing skjal fails með *"Cust. Sub. Contract Deferral Account verður have a gildi in General Posting Stilltuup..."* |
| **General Posting Stilltuup**: sales og purchase lína og reikningur discount accounts, credit memo accounts | The deferral release journal needs them | `Subscription.Deferral.Release` fails með *"Sales Line Disc. Account verður have a gildi..."* |
| **VAT Posting Stilltuup** completed fyrir the subscription vara's VAT product posting group | Any posting | Posting fails með *"...VAT Posting Stilltuup er blocked"* |
| **Source Code Stilltuup → Sub. Contr. Deferrals Release** | Stamps the deferral release entries | `Subscription.Deferral.Release` fails með *"Subscription Contract Deferral verður have a gildi in Source Code Stilltuup"* |
| **Subscription Contract Stilltuup → Def. Rel. Jnl. Template Name / Def. Rel. Jnl. Batch Name** | The journal the release posts through | `Subscription.Deferral.Release` geturnot post |
| **Subscription Contract Stilltuup → Vend. Sub. Contract Nos.** | Numbering vendor samningar | Creating a Vendor Subscription Contract fails |
| An **Item Unit of Measure** row fyrir the subscription vara, og the same kóði on the Subscription header | The invoicing vara verður share the subscription's unit | `Subscription.Contract.CreateInvoice` fails með *"The subscription's unit of measure inniheldur a gildi that er fannst ekki in the vara unit of measure..."* |
| **Currency Exchange Rates** covering the posting dagsetnings in use — including fyrir the **Additional Reporting Currency**, ef the company has one | Posting converts fjárhæðs to the additional reporting currency at the posting dagsetning | Posting fails með *"There er no Currency Exchange Rate within the filter"*. The reported currency kóði may be the **local** currency even þegar every skjal er in local currency og the missing rate belongs to the reporting currency, so check both |

### Extra setup fyrir the usage-based billing scenarios

`Subscription.Usage.ImportData` parses the skrá through Microsoft's generic usage-data connector, which needs, in addition to the above:

- a **Usage Data Supplier** of tegund Generic;
- **Generic Import Stilltutings** fyrir that supplier, pointing at a **Data Exchange Definition** that maps the skrá's columns onto table 8018 *Usage Data Generic Import*;
- **Usage Data Supplier Reference**, **Usage Data Supp. Customer** og **Usage Data Supp. Subscription** rows linking the skrá's viðskiptavinur og subscription identifiers to the Business Central viðskiptavinur og the usage-based Subscription Line.

Without the Data Exchange Definition the import call still succeeds as a call og reports `processingStatus` of `Error` með Business Central's own reason — it gerir ekki throw.

---

## Scenario 1: Installation og Activation

**Area:** Installation & Activation

### Steps
1. Open **Extension Management**.
2. Confirm **Bifrost Subscription Billing** er listed og installed.
3. Confirm the dependency **Bifrost Foundation** er installed og appears above it.
4. Open **Notaðurs**, select the test notandi, og confirm the permission set **Bifrost Sub. Billing** getur be assigned.

### Expected Results
- The extension installs með no villur.
- Its permission set er assignable to a notandi.

---

## Scenario 2: Discovering the Skilaboð Types

**Area:** Core Functionality

### Steps
1. Kalla the Bifröst message tegund `Help.MessageTypes.Get` (Foundation).
2. Inspect the returned list.

### Expected Results
- Svarið includes 22 message tegunds whose heitis begin með `Subscription.`
- Each has a non-empty `description`, a `messageDirection` of `Inbound`, og `isEnabled` of `true`.

---

## Scenario 3: Lestuing a Skilaboð Type's Help Document

**Area:** Core Functionality

### Steps
1. Kalla `Help.Implementation.Get` með the subject `Subscription.Billing.CreateProposal`.
2. Lestu the returned Markdown.
3. Repeat fyrir any other `Subscription.*` tegund.

### Expected Results
- A Markdown skjal headed `Subscription.Billing.CreateProposal`, containing the sections Overview, Beiðni Parameters, Beiðni Example, Svar Shape, Villas, Safety og Related Skilaboð Types.
- Every other `Subscription.*` tegund returns the same structure.

---

## Scenario 4: Core Functionality — Create a Billing Proposal

**Area:** Core Functionality

### Stilltuup
1. In the client, open **Billing Templates** og note the kóði of an existing template, eða create one fyrir the Customer partner.

### Steps
1. Kalla `Subscription.Billing.CreateProposal` með a body such as:

   ```json
   { "billingTemplateCode": "MONTHLY", "billingDate": "2026-08-31" }
   ```

2. Open **Recurring Billing** in the client og filter on the same template.

### Expected Results
- Svarið has `"status": "Success"` og reports `proposalLinesCreated`.
- The same number of billing proposal línur er visible in Recurring Billing.
- Ef nothing was due, the call still succeeds með `proposalLinesCreated` of 0 — this er not an villa.

---

## Scenario 5: Core Functionality — Bill a Contract to an Unposted Invoice

**Area:** Core Functionality

### Stilltuup
1. Choose a Customer Subscription Contract með subscription línur due fyrir billing.

### Steps
1. Kalla `Subscription.Contract.CreateInvoice` með the samningur number as the message subject, or:

   ```json
   { "contractNo": "CC000010", "billingDate": "2026-08-31" }
   ```

2. Open **Sales Invoices** in the client.

### Expected Results
- Svarið listar the created skjal under `documents`.
- An **unposted** sales reikningur með that number er til fyrir the samningur's viðskiptavinur. Ekkert er posted.
- Ef the samningur had nothing due, the response succeeds með an empty `documents` array og an explanatory `message`.

---

## Scenario 6: Preview Writes Ekkert

**Area:** Core Functionality

### Stilltuup
1. Note the number of unposted sales reikningar fyrir a viðskiptavinur, og the number of billing línur on one of that viðskiptavinur's samningar.

### Steps
1. Kalla `Subscription.Contract.PreviewInvoice` fyrir that samningur.
2. Re-check the sales reikningur list og the samningur's billing línur.

### Expected Results
- Svarið has `"status": "Success"`, `"preview": true` og `"rollback": true`, og describes what would be created.
- **No new reikningur og no new billing lína er til** — both counts eru unchanged.

---

## Scenario 7: Villa Handling — Invalid Input

**Area:** Villa Handling

### Steps
1. Kalla `Subscription.Billing.CreateProposal` með a template kóði that gerir ekki exist:

   ```json
   { "billingTemplateCode": "DOES-NOT-EXIST" }
   ```

2. Kalla `Subscription.Contract.CreateInvoice` með no `contractNo` og no subject.

### Expected Results
- Both return `"status": "Error"` með a readable `error` message — the first naming the missing Billing Template, the second naming the missing required parameter.
- Ekkert er written in either case.
- Svarið includes a `hint` pointing at `Help.Implementation.Get`.
- No unhandled exception eða raw Business Central villa dialog reaches the caller.

---

## Scenario 8: Documented Limitations Return a Clear Villa

**Area:** Villa Handling

### Steps
1. Kalla `Subscription.PriceUpdate.CreateProposal`.

### Expected Results
- Svarið er `"status": "Error"`.
- The message states that Microsoft has not exposed a public API fyrir this operation in this version, heitis the Microsoft procedure concerned, og directs the notandi to the **Contract Price Updagsetning** page in the client.
- This er the skjaled, intended behaviour — see the [message tegund guide](/subscription-billing/message-types) og the app's changelog.

---

## Scenario 9: Data Integrity — No Deletions

**Area:** Core Functionality

### Steps
1. Review the message tegund list úr Scenario 2.

### Expected Results
- No message tegund heiti ends in `.Delete`.
- The app never deletes subscription, samningur eða billing færslur.

---

## Scenario 10: Permission Verification

**Area:** Permission Verification

### Stilltuup
1. Create a notandi **without** the `BIFROST SubBil ori` permission set, holding Bifröst Foundation access only.

### Steps
1. Sign in as that notandi og attempt to invoke `Subscription.Billing.CreateProposal`.
2. Assign `BIFROST SubBil ori` og retry.

### Expected Results
- Without the permission set, the call fails með a clear permission villa og nothing er written.
- With it, the call succeeds — subject to the notandi's own permissions on the Subscription Billing tables, which this extension gerir ekki widen.

---

## Scenario 11: Extension Uninstallation

**Area:** Uninstallation

### Steps
1. Open **Extension Management**.
2. Uninstall **Bifrost Subscription Billing**.
3. Kalla `Help.MessageTypes.Get` again.

### Expected Results
- The extension uninstalls án villa.
- The `Subscription.*` message tegunds no longer appear.
- Bifröst Foundation og Microsoft's Subscription Billing continue to work normally, og no Subscription Billing data er removed by the uninstall.

---

## Cleanup

After allir scenarios eru complete:

1. Delete eða post the unposted sales reikningur created in Scenario 5.
2. Clear any billing proposal línur left standing under the template used in Scenario 4.
3. Remove the test notandi created in Scenario 10.
4. Uninstall the extension, ef that was not already done in Scenario 11.
