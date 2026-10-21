---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Publisher:** Origo
**Test Environment:** Requires test credentials for a document exchange network, and an AI assistant
connected to Bifröst. See "Test Credentials" and "AI assistant" below.

---

## Test Credentials

This extension exchanges documents through the Advania and Unimaze networks.

**Provide:** Test credentials for the Unimaze test environment for two test parties, a sender and a
receiver, each with the kennitala the party is registered with. Origo supplies them with the submission.
The credentials are entered with **Set Username** and **Set Password or API Key** on the **Document
Exchange Setup** page and kept in the Bifröst secret store; the page shows only whether they are stored.
The network finds the company by the **Registration No.** on **Company Information**, so the scenarios
switch it between the two test parties.

The Peppol code lists need no credentials.

---

## AI assistant

Most scenarios are run through an AI assistant (for example Copilot, ChatGPT or Claude) connected to the
sandbox through the Bifröst MCP server, as described in [Connect your assistant](/setup/connect-your-ai/).
Every request the assistant makes is logged on the **Bifrost Messages** page in Business Central, where
the tester can check its status and result. Every call to a network is also logged on the **Bifrost
Request Log**, with the credentials masked.

---

## Scenario 1: Installation and setup

**Area:** Installation & Activation

### Setup
1. Start with a clean Business Central sandbox (demo company)
2. Install the "Bifrost Foundation" extension (dependency) and complete its setup
3. Install the "Bifrost Iceland DocEx" extension

### Steps
1. Open the "Bifrost Setup" page from the search bar
2. If the page shows the notification about HTTP client requests, choose "Start setup wizard" on it and complete the wizard
3. Choose "Document Exchange Setup" in the "Apps" group

### Expected Results
- The extension installs without errors
- "Document Exchange Setup" opens with an "Advania" and a "Unimaze" group, each with an environment and a "Credentials" status of "Not set"

---

## Scenario 2: Test the connection

**Area:** Setup

### Setup
1. On "Company Information", set "Registration No." to the kennitala of the sending test party

### Steps
1. On "Document Exchange Setup", set "Unimaze Environment" to "Test"
2. Choose "Set Username" and "Set Password or API Key" and enter the sending party's test credentials
3. Choose "Test Unimaze Connection"
4. Choose "Clear Credentials", confirm, and choose "Test Unimaze Connection" again

### Expected Results
- After step 2 the "Credentials" status shows "Stored"; the values are never shown
- Step 3 shows the test party's name on the network and how many messages are in its inbox and unread
- Step 4 says that no credentials are stored and what to do, without an error dialog
- Enter the credentials again before the next scenario

---

## Scenario 3: Peppol code lists

**Area:** Reference data

### Steps
1. Ask the assistant: "List the Peppol BIS 3.0 unit codes for pieces and hours."
2. Ask the assistant: "Which Peppol document type code is a credit note?"

### Expected Results
- The answers list the codes with their names (for example `H87` piece, `381` credit note)
- No credentials are needed

---

## Scenario 4: Check a recipient

**Area:** Sales

### Steps
1. Ask the assistant: "Can the receiving test party [kennitala] receive e-invoices through Unimaze?"

### Expected Results
- The answer names the party and says that it can receive invoices

---

## Scenario 5: Send a posted sales invoice

**Area:** Sales

### Setup
1. A customer for the receiving test party, with its kennitala, in the demo company
2. A posted sales invoice for that customer

### Steps
1. Ask the assistant: "Send posted sales invoice [invoice no.] to the customer as an e-invoice through Unimaze."
2. Open the posted sales invoice and look at "Document Exchange Status"
3. After a minute, ask the assistant: "Update the delivery status of the invoices I sent through Unimaze."
4. Ask the assistant to send the same invoice again

### Expected Results
- Step 1 confirms that the invoice was sent and accepted by the network
- Step 2 shows "Sent to Document Exchange Service"
- Step 3 updates the posted invoice to "Delivered to Recipient"
- Step 4 is refused: the answer says the invoice has already been sent and how to send it again on purpose; nothing is sent

---

## Scenario 6: Receive an invoice into Business Central

**Area:** Purchase

### Setup
1. On "Company Information", set "Registration No." to the kennitala of the receiving test party, and enter the receiving party's credentials on "Document Exchange Setup"
2. On "Document Exchange Setup", choose "Update BII Data Exchange Definitions"
3. A vendor for the sending test party, with its kennitala in "Registration No."
4. In "BIS30 Code Map", an entry of type "Unit of Measure" from `H87` to your unit for a piece; in Business Central's "Text-to-Account Mapping" or the "VAT G/L Account Map", an account for the invoice's lines

### Steps
1. Ask the assistant: "Which invoices are waiting for me in Unimaze?"
2. Ask the assistant: "Bring the invoice [document no.] into Business Central as an incoming document and create the purchase invoice."
3. Open "Incoming Documents" and the purchase invoice that was created
4. Ask the assistant to bring in the same invoice again
5. Ask the assistant: "Mark that invoice as delivered in Unimaze."

### Expected Results
- Step 1 lists the received invoice with its sender and number
- Step 3 shows the incoming document with the e-invoice and its PDF attached, and a purchase invoice for the vendor whose total including VAT matches the received invoice
- Step 4 returns the same incoming document; no second one is created
- Step 5 confirms; the invoice no longer appears among the waiting invoices

---

## Scenario 7: Answer the supplier

**Area:** Purchase

### Steps
1. Ask the assistant: "Tell the supplier that invoice [document no.] has been paid."
2. Ask the assistant: "Reject invoice [another document no.] because the prices do not match the contract, and ask for a new invoice."

### Expected Results
- Each answer confirms that a response was sent to the supplier through the network

---

## Scenario 8: Wrong credentials

**Area:** Error Handling

### Steps
1. On "Document Exchange Setup", enter a wrong password with "Set Password or API Key"
2. Choose "Test Unimaze Connection"
3. Ask the assistant: "Which invoices are waiting for me in Unimaze?"

### Expected Results
- Step 2 says the network refused the credentials and what to check, without an error dialog
- Step 3 returns a clear error, not a raw exception; the error is logged on "Bifrost Messages"
- Enter the right password again afterwards

---

## Scenario 9: Permissions

**Area:** Security

### Setup
1. A test user with the "D365 Basic - Read" permission set and no Bifröst permission sets

### Steps
1. Sign in as the test user and ask the assistant to send a posted sales invoice
2. Assign `BIFROST Full ori` to the test user and repeat step 1 with another posted invoice

### Expected Results
- Step 1 is refused with a permission error; nothing is sent
- Step 2 sends the invoice

---

## Scenario 10: Uninstall

**Area:** Installation

### Steps
1. Open "Extension Management" and uninstall "Bifrost Iceland DocEx"
2. Install it again

### Expected Results
- The extension uninstalls and installs again without errors
- Bifrost Foundation and other Bifröst apps keep working
