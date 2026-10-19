---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Publisher:** Origo
**Test Environment:** Requires a Telegram bot token for the notification scenarios, and an AI assistant connected to Bifröst. See "Test Credentials" and "AI assistant" below.

---

## Test Credentials

This extension uses the Telegram Bot API to deliver notifications.

**Provide:** A Telegram bot token (from @BotFather) and a Telegram chat ID for a test user.
The bot token is entered with **Set Telegram Bot Token** on the "Bifrost Orchestrator Setup" page and is
kept in the Bifröst secret store in Business Central; the page shows only whether it is set.
The chat ID is entered per user in the **Telegram Chat ID** field of the user's Bifröst user setup
(Bifrost User Setup, Bifrost Foundation).

For the e-mail notification scenarios, a Business Central e-mail account must be set up.

---

## AI assistant

Some scenarios are run through an AI assistant (for example Copilot, ChatGPT or Claude)
connected to the sandbox through the Bifröst MCP server, as described in
[Connect your assistant](/setup/connect-your-ai/). Every request the assistant makes is
logged on the **Bifrost Messages** page in Business Central, where the tester can check its
status and result.

---

## Scenario 1: Extension Installation and Setup Wizard

**Area:** Installation & Activation

### Setup
1. Start with a clean Business Central sandbox (demo company)
2. Install the "Bifrost Foundation" extension (dependency)
3. Install the "Bifrost Orchestrator" extension

### Steps
1. Open the "Bifrost Setup" page from the search bar
2. If the page shows the notification about HTTP client requests, choose "Start setup wizard" on it and complete the wizard
3. Open the "Assisted Setup" page from the search bar and start "Bifrost Orchestrator Setup"
4. Verify that step 1 (Welcome to Bifrost Orchestrator) is shown, choose "Next"
5. Verify that step 2 (Enable HTTP Client Requests) shows the current status
6. If it is not enabled, choose "Enable HTTP Client Requests" and then "Verify"
7. Choose "Next" to step 3 (Job Queue Orchestrator), which shows the job queue status
8. Choose "Start Job Queue" to start the management job queue entry
9. Choose "Next" to step 4 (Setup Complete), then "Finish"
10. Open "Bifrost Setup" again, and choose "Bifrost Orchestrator Setup" in the "Apps" group

### Expected Results
- The Bifröst setup wizard allows HTTP client requests for the installed Bifröst apps
- The "Bifrost Orchestrator Setup" assisted setup guides through 4 steps; step 2 shows HTTP client requests as enabled, or lets you enable them
- The management job queue entry starts
- Step 10: "Bifrost Setup" no longer shows the HTTP notification; "Bifrost Orchestrator Setup" opens and "Job Queue Orchestrator Status" shows the job queue running

---

## Scenario 2: Supervise a Job Queue Entry and Run It

**Area:** Core Functionality — Entry Management

### Setup
1. Complete Scenario 1
2. Ensure at least one job queue entry exists besides the app's own management entry

### Steps
1. Open the "Bifrost Orchestrator Setup" page
2. Look at the "Orchestrator Entries" part
3. Choose "Job Queue Entries" and note the description of a job queue entry
4. Ask the assistant: "Put the job queue entry [description from step 3] under Bifrost Orchestrator."
5. Ask the assistant: "Run that orchestrator entry once now."

### Expected Results
- Step 4: The assistant confirms that the entry was registered
- Step 5: The assistant reports that the entry ran
- The entry appears in the "Orchestrator Entries" part of the setup page, and "Scheduler Enabled" is selected for the job queue entry on "Job Queue Entries"

---

## Scenario 3: Telegram Notification on an Orchestrator Entry

**Area:** Notifications — Telegram

### Setup
1. Complete Scenario 1
2. Open "Bifrost Orchestrator Setup", choose "Set Telegram Bot Token" and enter the bot token
3. Enter a Telegram chat ID for the current user in their Bifröst user setup
4. Use the orchestrator entry from Scenario 2

### Steps
1. Open the "Job Queue Orchestrator Entry Card" for the entry
2. Set "Notification Type" to "Telegram"
3. Verify that "Notification Recipient" is filled in with the chat ID from step 3 of the setup
4. Choose the assist button (…) of "Notification Recipient" to send a test notification
5. Check the Telegram chat for the message

### Expected Results
- Step 2: "Telegram Bot Token" on the setup page shows "Set"
- Step 4: No error; the test notification is sent
- Step 5: A message with the entry's description appears in the Telegram chat
- If HTTP client requests are not enabled, a clear error message is shown

---

## Scenario 4: Send a Telegram Message from the Assistant

**Area:** Delivery — Telegram

### Setup
1. Complete the setup of Scenario 3 (bot token set, chat ID in the user's Bifröst user setup)

### Steps
1. Ask the assistant: "Send me a Telegram message saying: Hello from Business Central!"
2. Check the Telegram chat for the message

### Expected Results
- Step 1: The assistant confirms that the message was sent
- Step 2: "Hello from Business Central!" appears in the user's Telegram chat
- The chat ID is taken from the calling user's Bifröst user setup

### Error Cases
- No bot token: "Telegram Bot Token is not configured in Orchestrator Setup."
- No chat ID for the user: "No Telegram Chat ID configured for the current user. Set it in Bifrost User Setup."
- HTTP not enabled: "HTTP client requests are not enabled for this extension. …"

---

## Scenario 5: Create and Run a Playbook

**Area:** Core Functionality — Playbooks

### Setup
1. Complete Scenario 1

### Steps
1. Open "Bifrost Playbooks" (from "Bifrost Orchestrator Setup")
2. Create a playbook with Code = "TEST-SCENARIO" and Description = "AppSource Test Playbook"
3. Add step 10: in "Message Type", choose the operation that reads the Bifrost Orchestrator status; set "Next Step No. (Success)" = 20
4. Add step 20: in "Message Type", choose the operation that sends a Telegram message (if Telegram is set up)
5. In step 20's request template ("Edit" on the "Request Template" FactBox opens the "Playbook Template Editor"), enter the text "Orchestrator status check complete" as the message
6. Choose "Run Now" on the playbook card

### Expected Results
- Step 6: The run completes and a message gives its status
- The playbook runs both steps in order; the "Last Run" column shows ✓ for both
- The "Playbook Execution Log" shows the run with status Completed, 2 steps executed and 0 steps failed

### Notes
- The operations a step can call, and what each one accepts, are listed in "Available Message Types" on "Bifrost Setup"

---

## Scenario 6: Schedule a Playbook

**Area:** Core Functionality — Playbook Scheduling

### Setup
1. Complete Scenario 5 (playbook "TEST-SCENARIO" exists)
2. On "Job Queue Recurring Templates" (from "Bifrost Orchestrator Setup"), choose "Insert Sample Templates"

### Steps
1. Open the "Bifrost Playbook" card for "TEST-SCENARIO"
2. Choose "Schedule"; the "Schedule Playbook" dialog opens
3. Choose a "Recurring Template Code", for example "DAILY", choose a "Notification Type", and confirm with OK
4. Verify that "Scheduled" on the playbook card is now Yes
5. Choose "Orchestrator Entry" to open the orchestrator entry that was created
6. Delete the orchestrator entry and verify that "Scheduled" on the playbook card returns to No

### Expected Results
- Step 3: The playbook is scheduled through an orchestrator entry that is not blocked
- Step 5: The "Job Queue Orchestrator Entry Card" opens on the entry created for the playbook
- Step 6: Removing the entry removes the schedule

---

## Scenario 7: Playbook with Iteration

**Area:** Core Functionality — Playbooks (Advanced)

### Setup
1. Complete Scenario 1
2. Ensure there are at least 2 customers

### Steps
1. Create a playbook "TEST-FOREACH" with:
   - Step 10: the operation that reads records, with a request template that asks for up to 5 customers
   - Step 20: the operation that reads the Bifrost Orchestrator status, repeated over step 10's answer ("Iterate Array Path" = "result", "Iterate Source Step No." = 10)
   - Step 30: the operation that sends a Telegram message, with a completion message
2. Choose "Run Now" on the playbook card, or ask the assistant: "Run the playbook TEST-FOREACH."

### Expected Results
- Step 20 runs once per customer returned by step 10
- Step 30 sends a Telegram message after all iterations
- "Playbook Execution Detail" shows more than 2 steps executed, and "Items Processed" matches the number of customers

---

## Scenario 8: Bifrost Orchestrator Status

**Area:** Status & Monitoring

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "What is the status of Bifrost Orchestrator?"
2. Ask the assistant: "Restart Bifrost Orchestrator if it needs it."
3. Ask the assistant for the status again, and open "Bifrost Orchestrator Setup"

### Expected Results
- Step 1: The answer gives the status, the job queue category and how many entries there are in total, blocked and active
- Step 2: The assistant reports whether a restart was needed and done
- Step 3: The status matches "Job Queue Orchestrator Status" on the setup page

---

## Scenario 9: Run a Report on Request

**Area:** Reporting

### Setup
1. Complete Scenario 1

### Steps
1. Ask the assistant: "Which reports can you run?"
2. Ask the assistant to describe one of the reports from step 1, including its layouts
3. Ask the assistant to save that report as a PDF, with filters given in the chat
4. Ask the assistant to save the same report again with another of its layouts

### Expected Results
- Step 1: The answer lists the available reports, without obsolete reports
- Step 2: The answer gives the report's details and its layouts, and a link to the "Report Request Preset" card where the user can save request page options
- Step 3: The assistant returns the report, which opens as a PDF with the expected content
- Step 4: The second PDF uses the chosen layout; the report's default layout in Business Central is unchanged

---

## Permission Sets

The scenarios above use one or more of these assignable permission sets, in addition to the Bifrost Foundation sets:

| Permission set | Grants |
| --- | --- |
| `BIFROST Orchestr ori` | Full use of Bifrost Orchestrator |
| `BIFROST OrchSet ori` | The setup, client credentials, recurring templates, the setup wizard and the app's secrets |
| `BIFROST OrchMgt ori` | Monitoring, running and restarting orchestrator entries, and reading the setup |
| `BIFROST PlaybAdm ori` | Building, running and scheduling playbooks, their execution log and report request presets |
| `BIFROST PlaybVw ori` | Viewing playbooks and their execution log |
