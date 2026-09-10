---
id: index
title: "Bifröst Orchestrator — Help"
sidebar_label: "Bifröst Orchestrator — Help"
sidebar_position: 1
slug: /
---

**Bifrost Orchestrator** is a Business Central extension by Origo that takes charge of scheduled work. It supervises job queue entries – recreating and restarting them according to a retry policy, notifying you by email or Telegram when something goes wrong – and it runs _playbooks_: declarative chains of Bifrost message types in which the response of one step drives the request of the next.

Schedules are described once as recurring templates and reused across jobs. Reports can be run unattended from a saved request-page preset, and the whole orchestrator is reachable through a small REST API for external monitoring.

## Pages

| Page | Description |
| --- | --- |
| [Bifrost Orchestrator Setup](/help/orchestrator/scheduler-setup-wizard/) | Assisted setup wizard: enable outbound HTTP and start the management job queue. |
| [Bifröst Orchestrator Setup](/help/orchestrator/orchestrator-setup/) | The app setup page, opened from the Apps group on Bifröst Setup: management job queue, telemetry, secrets, the readiness notification, and the list of orchestrator entries. |
| [Job Queue Orchestrator Entry Card](/help/orchestrator/scheduled-entry-card/) | One supervised job: what to run, when, retry policy and notification. |
| [Job Queue Recurring Templates](/help/orchestrator/recurring-templates/) | List of reusable schedule patterns. |
| [Job Queue Recurring Template](/help/orchestrator/recurring-template/) | One reusable schedule: weekdays, time window, interval and time zone. |
| [Client Credentials](/help/orchestrator/credentials-list/) | List of credential pairs used to authenticate against external services. |
| [Client Credentials Card](/help/orchestrator/credentials-card/) | Create and maintain one client ID / client secret pair. |
| [Bifrost Playbooks](/help/orchestrator/playbooks/) | List of playbooks with the outcome of their most recent run. |
| [Bifrost Playbook](/help/orchestrator/playbook-card/) | Define the steps, conditions and initial request of a playbook. |
| [Schedule Playbook](/help/orchestrator/schedule-playbook/) | Dialog that turns a playbook into a recurring scheduled job. |
| [Playbook Execution Log](/help/orchestrator/playbook-instances/) | Every playbook run, newest first. |
| [Playbook Execution Detail](/help/orchestrator/playbook-instance-card/) | One run in full: timings, counters, error and the step log. |
| [Report Request Preset](/help/orchestrator/report-preset-card/) | Store report request page filters so a report can be run unattended. |
| [Job Queue Entries](/help/orchestrator/job-queue-entries/) | The orchestrator field and action added to the standard job queue list. |
| [Job Queue Entry Card](/help/orchestrator/job-queue-entry-card/) | The orchestrator field and action added to the standard job queue card. |

## API Pages

The following API pages are used programmatically by external integrations and are not opened directly by users:

| API page | Description |
| --- | --- |
| [Job Queue Orchestrator API](/help/orchestrator/scheduled-entry-api/) | Read and write orchestrator entries, job queue entries, log entries, status and categories under `origo/jobQueueOrchestrator/v1.0`. |

## Getting Started

1.  Run the **Bifrost Orchestrator Setup** wizard from Assisted Setup to enable outbound HTTP and start the management job queue.
2.  Open **Job Queue Orchestrator Setup** and set the job queue category, and the Telegram bot token if you use Telegram notifications.
3.  Insert the sample **recurring templates**, or create your own schedule pattern.
4.  Add an existing job queue entry to the orchestrator, or define a new entry on the orchestrator entry card.
5.  Build a **playbook**, run it once from the card, then schedule it when the run looks right.
