---
id: index
title: "Bifröst Nornir — Help"
sidebar_label: "Bifröst Nornir — Help"
sidebar_position: 1
slug: /
---

**Bifrost Nornir** is a Business Central extension by Origo that takes charge of scheduled work. It supervises job queue entries – recreating and restarting them according to a retry policy, notifying you by email or Telegram when something goes wrong – and it runs _playbooks_: declarative chains of Bifrost message types in which the response of one step drives the request of the next.

Schedules are described once as recurring templates and reused across jobs. Reports can be run unattended from a saved request-page preset, and the whole orchestrator is reachable through a small REST API for external monitoring.

## Pages

| Page | Description |
| --- | --- |
| [Bifrost Nornir Setup](/help/nornir/scheduler-setup-wizard/) | Assisted setup wizard: enable outbound HTTP and start the management job queue. |
| [Bifrost Setup – Nornir](/help/nornir/setup-jq/) | The Orchestrator action group added to Bifrost Setup, and the readiness notification. |
| [Job Queue Orchestrator Setup](/help/nornir/scheduler-setup/) | Central configuration: management job queue, telemetry, Telegram bot token, and the list of orchestrator entries. |
| [Job Queue Orchestrator Entry Card](/help/nornir/scheduled-entry-card/) | One supervised job: what to run, when, retry policy and notification. |
| [Job Queue Recurring Templates](/help/nornir/recurring-templates/) | List of reusable schedule patterns. |
| [Job Queue Recurring Template](/help/nornir/recurring-template/) | One reusable schedule: weekdays, time window, interval and time zone. |
| [Client Credentials](/help/nornir/credentials-list/) | List of credential pairs used to authenticate against external services. |
| [Client Credentials Card](/help/nornir/credentials-card/) | Create and maintain one client ID / client secret pair. |
| [Bifrost Playbooks](/help/nornir/playbooks/) | List of playbooks with the outcome of their most recent run. |
| [Bifrost Playbook](/help/nornir/playbook-card/) | Define the steps, conditions and initial request of a playbook. |
| [Schedule Playbook](/help/nornir/schedule-playbook/) | Dialog that turns a playbook into a recurring scheduled job. |
| [Playbook Execution Log](/help/nornir/playbook-instances/) | Every playbook run, newest first. |
| [Playbook Execution Detail](/help/nornir/playbook-instance-card/) | One run in full: timings, counters, error and the step log. |
| [Report Request Preset](/help/nornir/report-preset-card/) | Store report request page filters so a report can be run unattended. |
| [Job Queue Entries](/help/nornir/job-queue-entries/) | The orchestrator field and action added to the standard job queue list. |
| [Job Queue Entry Card](/help/nornir/job-queue-entry-card/) | The orchestrator field and action added to the standard job queue card. |

## API Pages

The following API pages are used programmatically by external integrations and are not opened directly by users:

| API page | Description |
| --- | --- |
| [Job Queue Orchestrator API](/help/nornir/scheduled-entry-api/) | Read and write orchestrator entries, job queue entries, log entries, status and categories under `origo/jobQueueOrchestrator/v1.0`. |

## Getting Started

1.  Run the **Bifrost Nornir Setup** wizard from Assisted Setup to enable outbound HTTP and start the management job queue.
2.  Open **Job Queue Orchestrator Setup** and set the job queue category, and the Telegram bot token if you use Telegram notifications.
3.  Insert the sample **recurring templates**, or create your own schedule pattern.
4.  Add an existing job queue entry to the orchestrator, or define a new entry on the orchestrator entry card.
5.  Build a **playbook**, run it once from the card, then schedule it when the run looks right.
