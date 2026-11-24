---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Publisher:** Origo
**App:** Bifrost Manufacturing (`bd08a710-8845-4316-a53b-afd28f21f75a`)
**Test Environment:** A Business Central Premium sandbox with **Bifrost Foundation** installed, the demo company, and an AI assistant connected to Bifröst. See "Test Credentials" and "Prerequisites" below.

---

## Test Credentials

| Field | Value |
| --- | --- |
| Environment | Premium sandbox |
| Company | The demo company, or any company with manufacturing set up |
| User | A user with SUPER, or with `BIFROST Mfg ori` and `BIFROST MfgPost ori` plus a Bifröst Foundation permission set |

This extension holds no secrets of its own and calls no external service. Everything it does runs inside Business Central.

---

## Prerequisites

1. Install **Bifrost Foundation** and activate it — see the Foundation app's own setup guide.
2. Use a company with manufacturing set up: an item whose replenishment system is Prod. Order, with a certified production BOM and routing, and a production order number series. The demo company has these.
3. Install **Bifrost Manufacturing**.
4. Assign the permission sets **Bifrost Manufacturing** (`BIFROST Mfg ori`) and **Bifrost Manufacturing Posting** (`BIFROST MfgPost ori`) to the test user, in addition to their Bifröst Foundation permissions.
5. Connect an AI assistant (for example Copilot, ChatGPT or Claude) to the sandbox through the Bifröst MCP server, as described in [Connect your AI assistant](/setup/connect-your-ai/). Every request the assistant makes is logged on the **Bifrost Messages** page in Business Central.

---

## Scenario 1: Installation and Activation

**Area:** Installation & Activation

### Steps
1. Open **Extension Management**.
2. Confirm **Bifrost Manufacturing** is listed and installed.
3. Confirm the dependency **Bifrost Foundation** is installed.
4. Open **Users**, select the test user, and confirm the permission sets **Bifrost Manufacturing** and **Bifrost Manufacturing Posting** can be assigned.

### Expected Results
- The extension installs with no errors.
- Its permission sets are assignable to a user.

---

## Scenario 2: Discovering the Operations

**Area:** Core Functionality

### Steps
1. Open the **Bifrost Message Types** page in Business Central.
2. Ask the assistant: "What can you do with manufacturing?"

### Expected Results
- The page lists the Manufacturing operations of this app, each with a description, as inbound and enabled.
- The assistant describes the same operations — production orders, statuses, production BOMs and routings, where-used, availability, the production journal and corrections — read from Business Central itself.

---

## Scenario 3: Create and Refresh a Production Order

**Area:** Core Functionality

### Steps
1. Ask the assistant: "Create a planned production order for 10 pieces of a production item in the demo company, then refresh it."
2. Open **Planned Production Orders** in the client and open the new order.

### Expected Results
- The assistant reports the new order number and that the refresh succeeded.
- The order is on the page with a line for the item, and with components and routing lines calculated from its certified BOM and routing.

---

## Scenario 4: Certify a Production BOM Version

**Area:** Core Functionality

### Steps
1. In the client, create a new version of a production BOM with a line and leave it Under Development.
2. Ask the assistant: "Certify that production BOM version."
3. Open the version in the client.

### Expected Results
- The assistant reports that the version is certified.
- The version shows status Certified.
- A version that cannot be certified, for example one with a blank component, is refused with a clear reason in the session language, and its status does not change.

---

## Scenario 5: Check Availability and Statistics

**Area:** Core Functionality

### Steps
1. Ask the assistant: "Do we have all the components for the production order you created?"
2. Ask: "Show me the cost and quantity statistics of that order."

### Expected Results
- The assistant lists each component with the quantity needed, the quantity available and any shortage.
- The statistics match the figures in the order's statistics page in the client.
- Nothing is changed.

---

## Scenario 6: Preview and Post the Production Journal

**Area:** Core Functionality

### Steps
1. Release the order from Scenario 3 (ask the assistant to change its status to Released and confirm the count it reports).
2. Ask the assistant: "Preview posting output and consumption for that order."
3. Check the **Item Ledger Entries** page. Then ask the assistant to post the same journal, confirming the count it reports.
4. Check the **Item Ledger Entries** page again.

### Expected Results
- The preview reports the entries a posting would create, and the ledger entries are unchanged after it.
- Without a confirmed count the post is refused and nothing is posted.
- After the confirmed post, the output and consumption entries are on the page.

---

## Scenario 7: Finish and Reopen an Order

**Area:** Core Functionality

### Steps
1. Ask the assistant: "Can that production order be finished?"
2. Ask the assistant to finish it, confirming the count it reports.
3. Ask the assistant to reopen it, confirming the count it reports.

### Expected Results
- The check reports any findings, such as missing output, and changes nothing.
- The finished order is on **Finished Production Orders**.
- Reopening moves it back, once. A second reopen is refused.

---

## Scenario 8: Reverse a Posting

**Area:** Core Functionality

### Steps
1. Ask the assistant: "Reverse the output entry we just posted." Confirm the count it reports.
2. Check the **Item Ledger Entries** page.

### Expected Results
- A correcting entry for the whole output entry appears with the original entry marked as reversed.
- Without a confirmed count nothing is reversed.

---

## Scenario 9: Permissions

**Area:** Security

### Steps
1. Sign in as a user who has `BIFROST Mfg ori` but not `BIFROST MfgPost ori`.
2. Ask the assistant to change the status of a production order.

### Expected Results
- The operation is not offered, or it is refused with a message that names the missing permission.
- No order is changed.

---

## Scenario 10: Icelandic

**Area:** Localization

### Steps
1. Set the language of the session to Icelandic.
2. Ask the assistant to certify a production BOM version that has a blank component.

### Expected Results
- The refusal is returned in Icelandic and the status of the version does not change.
