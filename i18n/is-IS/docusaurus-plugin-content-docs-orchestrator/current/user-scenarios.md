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
**Test Environment:** Requires a stillt Telegram Bot Token fyrir notification scenarios. See "Test Credentials" section below.

---

## Test Credentials

This extension uses the Telegram Bot API fyrir notification delivery.

**Provide:** A Telegram Bot Token (from @BotFather) og a Telegram Chat ID fyrir a test notandi.
The Bot Token er stored in the "Job Queue Orchestrator Stilltuup" page via Isolated Storage (encrypted at rest).
The Chat ID er stored per notandi in "Bifrost Notaður Stilltuup" (Bifrost Foundation).

For email notification scenarios, a BC email account verður að vera stillt.

---

## Scenario 1: Extension Installation og Stilltuup Wizard

**Area:** Installation & Activation

### Stilltuup
1. Start með a clean BC sandbox (Cronus company)
2. Install the "Bifrost Foundation" extension (dependency)
3. Install the "Bifrost Orchestrator" extension

### Steps
1. Open the "Bifrost Stilltuup" page úr the BC search bar
2. Observe the notification banner, fyrir example "HTTP client requests eru not enabled fyrir this extension. Run the setup wizard to enable."
3. Click "Run Stilltuup Wizard" on the notification
4. Staðfestu Step 1 (Welcome to Bifrost Orchestrator) displays, click "Next"
5. Staðfestu Step 2 (Enable HTTP Client Beiðnis) shows the current status
6. Ef not enabled, click "Enable HTTP Client Beiðnis" og then "Staðfestu"
7. Click "Next" to Step 3 (Job Queue Orchestrator), which shows the job queue status
8. Click "Start Job Queue" to start the management job queue
9. Click "Next" to Step 4 (Stilltuup Complete), click "Finish"
10. Re-open "Bifrost Stilltuup" — the notification should no longer appear

### Expected Results
- The "Bifrost Orchestrator Stilltuup" wizard opens og guides through 4 steps
- HTTP client requests getur be enabled úr within the wizard
- The management job queue starts successfully
- After completing the wizard, the notification gerir ekki appear again

---

## Scenario 2: Register og Run a Scheduled Entry

**Area:** Core Functionality — Entry Management

### Stilltuup
1. Complete Scenario 1 (setup wizard finished)
2. Gakktu úr skugga um at least one Job Queue Entry er til (for example the app's own management entry)

### Steps
1. Open the "Job Queue Orchestrator Stilltuup" page
2. Observe the "Orchestrator Entries" subpage
3. Navigate to "Job Queue Entries" via the action menu
4. Note the ID of any Job Queue Entry
5. Kalla the `Orchestrator.Entry.Register` message tegund via the Bifrost API:
   - `type`: `Orchestrator.Entry.Register`
   - `data`: `{"jobQueueEntryId": "<ID from step 4>"}`
6. Kalla `Orchestrator.Entry.Run` með the returned SystemId:
   - `type`: `Orchestrator.Entry.Run`
   - `subject`: `<id from step 5 response>`

### Expected Results
- Step 5: Skilar `{"status": "Success", "id": "<guid>", "blocked": false, "message": "..."}`
- Step 6: The entry executes successfully og returns a success response
- The scheduled entry appears in the "Orchestrator Entries" subpage of the setup page

---

## Scenario 3: Telegram Notification on a Scheduled Entry

**Area:** Notifications — Telegram

### Stilltuup
1. Complete Scenario 1
2. Open "Job Queue Orchestrator Stilltuup" og enter a Telegram Bot Token
3. Open "Bifrost Notaður Stilltuup" og enter a Telegram Chat ID fyrir the current notandi
4. Create eða use an existing scheduled entry

### Steps
1. Open the "Job Queue Orchestrator Entry Card" fyrir the entry
2. Stilltu "Notification Type" to "Telegram"
3. Stilltu "Notification Recipient" to the test Telegram Chat ID
4. Click the "Send Test Notification" action
5. Check the Telegram chat fyrir the received message

### Expected Results
- Step 4: No villa — the test notification er sent
- Step 5: A message appears in the Telegram chat með the entry description
- Ef HTTP client requests eru not enabled, a clear villa message er shown

---

## Scenario 4: Send Telegram Skilaboð via Skilaboð Type

**Area:** Delivery — Telegram Skilaboð Type

### Stilltuup
1. Complete Scenario 3 setup (Bot Token stillt, Chat ID on Bifrost Notaður Stilltuup)

### Steps
1. Kalla the `Orchestrator.Telegram.Message` message tegund:
   - `type`: `Orchestrator.Telegram.Message`
   - `data`: `{"message": "Hello from Business Central!"}`
2. Check the Telegram chat fyrir the received message

### Expected Results
- Step 1: Skilar `{"status": "Success", "chatId": "<chat-id>"}`
- Step 2: The message "Hello úr Business Central!" appears in the notandi's Telegram chat
- The chat ID er resolved automatically úr the calling notandi's Bifrost Notaður Stilltuup

### Villa Cases
- Ef no Bot Token: villa "Telegram Bot Token er not stillt in Orchestrator Stilltuup."
- Ef no Chat ID on notandi: villa "No Telegram Chat ID stillt fyrir the current notandi. Stilltu it in Bifrost Notaður Stilltuup."
- Ef `message` er missing úr the request: villa "\"message\" er required in the request data."
- Ef HTTP er not enabled: villa "HTTP client requests eru not enabled fyrir this extension. …"

---

## Scenario 5: Create og Run a Playbook

**Area:** Core Functionality — Playbook Engine

### Stilltuup
1. Complete Scenario 1

### Steps
1. Open the "Bifrost Playbooks" list page
2. Create a new playbook með Code = "TEST-SCENARIO" og Lýsing = "AppSource Test Playbook"
3. Add Step 10: Skilaboð Type = "Orchestrator.Status.Get", Next Step No. (Tókst) = 20
4. Add Step 20: Skilaboð Type = "Orchestrator.Telegram.Skilaboð" (if Telegram er stillt) eða leave empty
5. Stilltu Step 20's request template to `{"message": "Orchestrator status check complete"}` (the Beiðni Template FactBox eða the "Playbook Template Editor" page)
6. Kalla the `Orchestrator.Playbook.Run` message tegund:
   - `type`: `Orchestrator.Playbook.Run`
   - `subject`: `TEST-SCENARIO`

### Expected Results
- Step 6: Skilar `{"status": "Success", "instanceId": "<guid>", "playbookCode": "TEST-SCENARIO", "playbookStatus": "Completed", "stepsExecuted": 2, "stepsFailed": 0, "itemsProcessed": 0}`
- The playbook executes both steps sequentially
- An execution instance færsla er created og visible on the "Playbook Execution Log" page

---

## Scenario 6: Schedule a Playbook

**Area:** Core Functionality — Playbook Scheduling

### Stilltuup
1. Complete Scenario 5 (playbook "TEST-SCENARIO" er til)

### Steps
1. Open the "Bifrost Playbook" card fyrir "TEST-SCENARIO"
2. Click the "Schedule" action — the "Schedule Playbook" page opens
3. Stilltu a recurring template eða a "No. of Minutes between Keyrir" gildi, choose a Notification Type, og confirm með OK
4. Staðfestu "Scheduled" on the playbook card er now Yes
5. Click the "Orchestrator Entry" action to open the scheduled entry that was created
6. Delete the scheduled entry og verify "Scheduled" on the playbook card returns to No

### Expected Results
- Step 3: The playbook er scheduled through a scheduled entry með a recurring Job Queue Entry
- Step 5: The "Job Queue Orchestrator Entry Card" opens on the entry created fyrir the playbook
- Step 6: Removing the entry clears the schedule

---

## Scenario 7: Playbook með ForEach Iteration

**Area:** Core Functionality — Playbook Engine (Advanced)

### Stilltuup
1. Complete Scenario 1
2. Gakktu úr skugga um the Customer table has at least 2 færslur

### Steps
1. Create a playbook "TEST-FOREACH" with:
   - Step 10: `Data.Records.Get` — query Customers (template: `{"tableName":"Customer","fieldNumbers":[1,2],"take":5}`)
   - Step 20: `Orchestrator.Status.Get` — forEach over Step 10's niðurstaða array (Iterate Array Path = "niðurstaða", Iterate Source Step No. = 10)
   - Step 30: `Orchestrator.Telegram.Message` — send completion message
2. Run the playbook via `Orchestrator.Playbook.Run` með subject = "TEST-FOREACH"

### Expected Results
- Step 20 executes once per viðskiptavinur færsla returned by Step 10
- Step 30 sends a Telegram message eftir allir iterations complete
- The playbook completes með `stepsExecuted` > 2 og `itemsProcessed` matching the viðskiptavinur count

---

## Scenario 8: Orchestrator Status og Health Check

**Area:** Status & Monitoring

### Stilltuup
1. Complete Scenario 1

### Steps
1. Kalla `Orchestrator.Status.Get`:
   - `type`: `Orchestrator.Status.Get`
2. Kalla `Orchestrator.Status.RestartIfNeeded`:
   - `type`: `Orchestrator.Status.RestartIfNeeded`
3. Kalla `Orchestrator.Status.Get` again

### Expected Results
- Step 1: Skilar `orchestratorStatus`, `jobQueueCategoryCode`, `logJobQueueActivity` og an `entries` object með `total`, `blocked` og `active` counts
- Step 2: Skilar `{"status": "Success", "message": "...", "restarted": true|false}`
- Step 3: Shows updagsetningd status reflecting any restart

---

## Scenario 9: Run a Report through a Skilaboð Type

**Area:** Reporting

### Stilltuup
1. Complete Scenario 1

### Steps
1. Kalla `Orchestrator.Report.List` to list the available reports með their metadata
2. Kalla `Orchestrator.Report.Get` með the ID of one report úr step 1
3. Kalla `Orchestrator.Report.SaveAs` fyrir that report, með a saved request preset eða inlína parameters

### Expected Results
- Step 1: Skilar the available reports með metadata, excluding obsolete reports
- Step 2: Skilar the report metadata, its available layouts og the saved request page preset
- Step 3: Skilar the report output (PDF, Excel, Word eða XML). When a playbook step calls it, binary output er base64-enkóðid in a JSON envelope með `contentType`, `size` og `base64`

---

## Permission Stilltus

The scenarios above require one eða more of the following assignable permission sets, in addition to the Bifrost Foundation sets:

| Permission set | Grants |
| --- | --- |
| `BIFROST Nornir ori` | Lestu access to scheduled entries, scheduler setup, recurring templates og client credentials |
| `BIFROST NrnSetup ori` | Stilltuup access — scheduler setup, recurring templates, client credentials |
| `BIFROST NrnMgt ori` | Management access — maintain scheduled entries |
| `BIFROST PlaybAdm ori` | Full administration of playbooks, steps, conditions, instances og report presets |
| `BIFROST PlaybVw ori` | Lestu-only access to playbooks og execution logs |
