---
id: scheduler-setup-wizard
title: "Bifrost Orchestrator Setup"
sidebar_label: "Orchestrator Setup"
sidebar_position: 16
---

The **Bifrost Orchestrator Setup** wizard is the assisted setup for this extension. It takes you through four steps: a short introduction, enabling outbound HTTP, starting the management job queue that the orchestrator depends on, and a confirmation that setup is complete.

The wizard is offered from the Assisted Setup list, and from the notification shown on [Bifröst Orchestrator Setup](/help/orchestrator/orchestrator-setup/) when HTTP is blocked or the management job queue is not running.

## Steps

| Step | What happens |
| --- | --- |
| **1\. Welcome** | Explains what the extension does: automated job queue scheduling, monitoring, restart and error handling, plus a declarative playbook runner that executes sequences of Bifrost message types. It also points out that a management job queue entry must be running for monitoring and restart to work. |
| **2\. Enable HTTP Client Requests** | The extension needs outbound HTTP to send notifications and to talk to external services. The **HTTP Client Requests** field shows _Enabled_ or _Not Enabled_. You cannot continue to step 3 until it is enabled. |
| **3\. Job Queue Orchestrator** | The **Job Queue Orchestrator Status** field shows whether the management job queue entry is running. Start it here, or open the full setup page for detailed configuration. |
| **4\. Setup Complete** | Confirms that setup is done. Every setting can be changed later on the [Job Queue Orchestrator Setup](/help/orchestrator/scheduler-setup/) page, which is reached from Bifrost Setup. |

## Actions

| Action | Description |
| --- | --- |
| **Back / Next** | Move between the wizard steps. **Next** is disabled on step 2 until HTTP client requests are enabled. |
| **Enable HTTP Client Requests** | Sets _Allow HttpClient Requests_ for this extension. Shown on step 2 only when HTTP is not yet enabled and you have permission to change extension settings. |
| **Open Extension Settings** | Opens the Extension Settings page so an administrator can allow HTTP client requests. Shown instead of the button above when you lack write permission. |
| **Verify** | Re-reads the current status on step 2 and step 3. |
| **Start Job Queue** | Creates and starts the management job queue entry. Shown on step 3 when the queue is not running. |
| **Open Orchestrator Setup** | Opens the [Job Queue Orchestrator Setup](/help/orchestrator/scheduler-setup/) page for detailed configuration. |
| **Finish** | Marks the assisted setup as complete and closes the wizard. |
