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
**Test Environment:** Requires a configured Telegram Bot Token for notification scenarios, and an AI assistant connected to Bifröst. See "Test Credentials" and "AI assistant" below.

---

## Test Credentials

This extension uses the Telegram Bot API for notification delivery.

**Provide:** A Telegram Bot Token (from @BotFather) and a Telegram Chat ID for a test user.
The Bot Token is entered on the "Job Queue Orchestrator Setup" page and stored encrypted in Business Central.
The Chat ID is stored per user in "Bifrost User Setup" (Bifrost Foundation).

For email notification scenarios, a BC email account must be configured.

---

## AI assistant

Some scenarios are run through an AI assistant (for example Copilot, ChatGPT or Claude)
connected to the sandbox through the Bifröst MCP server, as described in
[Connect your AI assistant](/setup/connect-your-ai/). Every request the assistant makes is
logged on the **Bifrost Messages** page in Business Central, where the tester can check its
status and result.

---

## Scenario 1: Extension Installation and Setup Wizard

**Area:** Installation & Activation

### Setup
1. Start with a clean BC sandbox (demo company)
2. Install the "Bifrost Foundation" extension (dependency)
3. Install the "Bifrost Orchestrator" extension

### Steps
1. Open the "Bifrost Setup" page from the BC search bar
2. If the page shows the notification about HTTP client requests, click "Start setup wizard" on it and complete the wizard
3. Open the "Assisted Setup" page from the BC search bar and start "Bifrost Orchestrator Setup"
4. Verify Step 1 (Welcome to Bifrost Orchestrator) displays, click "Next"
5. Verify Step 2 (Enable HTTP Client Requests) shows the current status
6. If not enabled, click "Enable HTTP Client Requests" and then "Verify"
7. Click "Next" to Step 3 (Job Queue Orchestrator), which shows the job queue status
8. Click "Start Job Queue" to start the management job queue
9. Click "Next" to Step 4 (Setup Complete), click "Finish"
10. Re-open "Bifrost Setup"

### Expected Results
- The Bifröst setup wizard turns on HTTP client requests for the installed Bifröst apps
- The "Bifrost Orchestrator Setup" assisted setup opens and guides through 4 steps; Step 2 shows HTTP client requests as enabled, or lets you enable them
- The management job queue starts successfully
- Step 10: "Bifrost Setup" no longer shows the HTTP notification

---

## Scenario 2: Register and Run a Scheduled Entry

**Area:** Core Functionality — Entry Management

### Setup
1. Complete Scenario 1 (setup wizard finished)
2. Ensure at least one Job Queue Entry exists (for example the app's own management entry)

### Steps
1. Open the "Job Queue Orchestrator Setup" page
2. Observe the "Orchestrator Entries" subpage
3. Navigate to "Job Queue Entries" via the action menu and note the description of any Job Queue Entry
4. Ask the assistant: "Put the Job Queue entry [description from step 3] under Orchestrator supervision."
5. Ask the assistant: "Run that Orchestrator entry now."

### Expected Results
- Step 4: The assistant confirms that the entry was registered and is not blocked
- Step 5: The entry runs successfully; the run shows in the entry's **Activity Log**
- The scheduled entry appears in the "Orchestrator Entries" subpage of the setup page

---

## Scenario 3: Telegram Notification on a Scheduled Entry

**Area:** Notifications — Telegram

### Setup
1. Complete Scenario 1
2. Open "Job Queue Orchestrator Setup" and enter a Telegram Bot Token
3. Open "Bifrost User Setup" and enter a Telegram Chat ID for the current user
4. Create or use an existing scheduled entry

### Steps
1. Open the "Job Queue Orchestrator Entry Card" for the entry
2. Set "Notification Type" to "Telegram"
3. Set "Notification Recipient" to the test Telegram Chat ID
4. Click the "Send Test Notification" action
5. Check the Telegram chat for the received message

### Expected Results
- Step 4: No error — the test notification is sent
- Step 5: A message appears in the Telegram chat with the entry description
- If HTTP client requests are not enabled, a clear error message is shown

---

## Scenario 4: Send a Telegram Message from the Assistant

**Area:** Delivery — Telegram

### Setup
1. Complete Scenario 3 setup (Bot Token configured, Chat ID on Bifrost User Setup)

### Steps
1. Ask the assistant: "Send me a Telegram message saying: Hello from Business Central!"
2. Check the Telegram chat for the received message

### Expected Results
- Step 1: The assistant confirms that the message was sent
- Step 2: The message "Hello from Business Central!" appears in the user's Telegram chat
- The chat ID is resolved automatically from the calling user's Bifrost User Setup

### Error Cases
- If no Bot Token: error "Telegram Bot Token is not configured in Orchestrator Setup."
- If no Chat ID on user: error "No Telegram Chat ID configured for the current user. Set it in Bifrost User Setup."
- If HTTP is not enabled: error "HTTP client requests are not enabled for this extension. …"

---

## Scenario 5: Create and Run a Playbook

**Area:** Core Functionality — Playbook Engine

### Setup
1. Complete Scenario 1

### Steps
1. Open the "Bifrost Playbooks" list page
2. Create a new playbook with Code = "TEST-SCENARIO" and Description = "AppSource Test Playbook"
3. Add Step 10: in "Message Type", choose the operation that reads the Orchestrator status; set Next Step No. (Success) = 20
4. Add Step 20: in "Message Type", choose the operation that sends a Telegram message (if Telegram is configured), or leave it empty
5. In Step 20's request template (the Request Template FactBox or the "Playbook Template Editor" page), enter the text "Orchestrator status check complete" as the message
6. Choose "Run Now" on the playbook card

### Expected Results
- Step 6: The run completes and a message reports the outcome
- The playbook executes both steps sequentially
- The "Playbook Execution Log" shows the run with status Completed, 2 steps executed and 0 steps failed

### Notes
- The operations available to a step, and what each accepts, are listed on the **Bifrost Message Types** page

---

## Scenario 6: Schedule a Playbook

**Area:** Core Functionality — Playbook Scheduling

### Setup
1. Complete Scenario 5 (playbook "TEST-SCENARIO" exists)

### Steps
1. Open the "Bifrost Playbook" card for "TEST-SCENARIO"
2. Click the "Schedule" action — the "Schedule Playbook" page opens
3. Set a recurring template or a "No. of Minutes between Runs" value, choose a Notification Type, and confirm with OK
4. Verify "Scheduled" on the playbook card is now Yes
5. Click the "Orchestrator Entry" action to open the scheduled entry that was created
6. Delete the scheduled entry and verify "Scheduled" on the playbook card returns to No

### Expected Results
- Step 3: The playbook is scheduled through a scheduled entry with a recurring Job Queue Entry
- Step 5: The "Job Queue Orchestrator Entry Card" opens on the entry created for the playbook
- Step 6: Removing the entry clears the schedule

---

## Scenario 7: Playbook with Iteration

**Area:** Core Functionality — Playbook Engine (Advanced)

### Setup
1. Complete Scenario 1
2. Ensure the Customer table has at least 2 records

### Steps
1. Create a playbook "TEST-FOREACH" with:
   - Step 10: the operation that reads records, with a request template that asks for up to 5 customers
   - Step 20: the operation that reads the Orchestrator status, iterating over Step 10's result (Iterate Array Path = "result", Iterate Source Step No. = 10)
   - Step 30: the operation that sends a Telegram message — a completion message
2. Choose "Run Now" on the playbook card, or ask the assistant: "Run the playbook TEST-FOREACH."

### Expected Results
- Step 20 executes once per customer record returned by Step 10
- Step 30 sends a Telegram message after all iterations complete
- The "Playbook Execution Detail" shows more than 2 steps executed and Items Processed matching the customer count

---

## Scenario 8: Orchestrator Status and Health Check

**Area:** Status & Monitoring

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "What is the status of the Orchestrator?"
2. Ask the assistant: "Restart the Orchestrator if it needs it."
3. Ask the assistant for the status again, and open "Job Queue Orchestrator Setup"

### Expected Results
- Step 1: The answer gives the Orchestrator status, the job queue category and how many entries there are in total, blocked and active
- Step 2: The assistant reports whether a restart was needed and done
- Step 3: The status reflects any restart, and matches **Job Queue Orchestrator Status** on the setup page

---

## Scenario 9: Run a Report on Demand

**Area:** Reporting

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "Which reports can you run?"
2. Ask the assistant to describe one of the reports from step 1, including its layouts
3. Ask the assistant to save that report as a PDF, with a saved request preset or with filters given in the chat

### Expected Results
- Step 1: The answer lists the available reports, without obsolete reports
- Step 2: The answer gives the report's details, its available layouts and the saved request preset
- Step 3: The assistant returns the report output, which opens as a PDF with the expected content

---

## Permission Sets

The scenarios above require one or more of the following assignable permission sets, in addition to the Bifrost Foundation sets:

| Permission set | Grants |
| --- | --- |
| `BIFROST Orchestr ori` | Read access to scheduled entries, scheduler setup, recurring templates and client credentials |
| `BIFROST OrchSet ori` | Setup access — scheduler setup, recurring templates, client credentials |
| `BIFROST OrchMgt ori` | Management access — maintain scheduled entries |
| `BIFROST PlaybAdm ori` | Full administration of playbooks, steps, conditions, instances and report presets |
| `BIFROST PlaybVw ori` | Read-only access to playbooks and execution logs |
