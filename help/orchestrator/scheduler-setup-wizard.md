---
id: scheduler-setup-wizard
title: "Bifrost Orchestrator Setup"
sidebar_label: "Bifrost Orchestrator Setup wizard"
sidebar_position: 16
---

The **Bifrost Orchestrator Setup** assisted setup gets Bifrost Orchestrator ready to supervise jobs. It
takes four steps: a short introduction, allowing HTTP requests for the app, starting the management job
queue entry that Bifrost Orchestrator depends on, and a confirmation.

Start it from the **Assisted Setup** list. Once it has been finished, it opens on the last step. If the
[Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/) has already allowed HTTP requests for the
Bifröst apps, step 2 shows them as enabled.

## Steps

| Step | What happens |
| --- | --- |
| **1. Welcome to Bifrost Orchestrator** | Says what the app does: scheduling, monitoring and restarting job queue entries, with error handling, and running playbooks of Bifröst operations. A management job queue entry must be running for monitoring and restarts to work. |
| **2. Enable HTTP Client Requests** | Bifrost Orchestrator needs to make HTTP requests to send notifications and reach external services. **HTTP Client Requests** shows whether they are allowed. You cannot go on to step 3 until they are. |
| **3. Job Queue Orchestrator** | **Job Queue Orchestrator Status** shows whether the management job queue entry is running. Start it here, or open the setup page for the full settings. |
| **4. Setup Complete** | Setup is done. Every setting can be changed later on [Bifrost Orchestrator Setup](/help/orchestrator/orchestrator-setup/), which you open from Bifrost Setup. |

## Actions

| Action | Description |
| --- | --- |
| **Back** / **Next** | Move between the steps. **Next** is unavailable on step 2 until HTTP requests are allowed. |
| **Enable HTTP Client Requests** | Allows HTTP requests for Bifrost Orchestrator. Shown on step 2 when they are not allowed and you may change extension settings. |
| **Open Extension Settings** | Opens **Extension Settings**, where an administrator can allow HTTP requests. Shown on step 2 instead of the action above when you may not change extension settings. |
| **Verify** | Checks the status again, on step 2 and step 3. |
| **Start Job Queue** | Creates and starts the management job queue entry. Shown on step 3 when it is not running. |
| **Open Orchestrator Setup** | Opens [Bifrost Orchestrator Setup](/help/orchestrator/orchestrator-setup/). |
| **Finish** | Marks the assisted setup as completed and closes it. |
