---
id: index
title: "Bifröst Nornir"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Job Queue scheduling, monitoring and restart for Business Central, plus declarative playbooks that chain Bifröst message types."
---

Bifröst Nornir manages scheduled work in Business Central. It monitors, restarts and supervises Job Queue entries, and it runs **playbooks** — declarative, multi-step sequences of message types where the response of one step feeds the request of the next. It builds on Bifröst Foundation, so everything the app does is also reachable as a message type over the Bifröst queue API, and an external system or an AI agent can drive a playbook the same way a scheduled Job Queue entry does.

## What it does

- **Job Queue scheduling and supervision** — monitors, restarts and manages Job Queue entries, with configurable retry policies, recurring templates, scheduling and automatic restart on failure.
- **Telegram and email notifications** — alerts when a job fails or restarts; Telegram messages go to the user's configured chat ID, email uses the built-in Business Central email system.
- **Message playbooks** — declarative, multi-step workflows that chain Bifröst message types, with data flowing through a shared workspace using `@path` references.
- **Step control** — forEach iteration over arrays produced by earlier steps, separate next steps on success and failure, skip-if-failed, per-step start conditions, and paged execution through large datasets.
- **Scheduled playbooks** — run a playbook on a recurring schedule through the Job Queue, or enqueue it once with custom parameters.
- **Reports on demand** — list, inspect, render (PDF, Excel, Word, XML) and run processing-only reports, with reusable request presets.
- **Execution log** — every playbook run is recorded as an instance with a per-step log holding the request, the response and a workspace snapshot.
- **Setup wizard** — guided setup for HTTP client requests, Job Queue configuration and the Telegram bot token.

## How it works

1. Register Job Queue entries as **scheduled entries**; Nornir monitors and restarts them automatically.
2. Configure the **notification type** (None, Email, Telegram) per entry to get alerts on failure.
3. Build **playbooks** by creating steps that call Bifröst message types in sequence, with request templates using `@` workspace references to pass data between steps.
4. Run playbooks manually, on a schedule, or enqueue them for deferred execution.

## Message types

| Category | Types |
| --- | --- |
| Scheduled entries | `Orchestrator.Entry.Register`, `Orchestrator.Entry.Run`, `Orchestrator.Entry.Restart`, `Orchestrator.Entry.Schedule` |
| Status | `Orchestrator.Status.Get`, `Orchestrator.Status.Restart`, `Orchestrator.Status.RestartIfNeeded` |
| Job Queue | `Orchestrator.JobQueueEntry.Restart`, `Orchestrator.JobQueueEntry.RestartIfNeeded` |
| Playbook | `Orchestrator.Playbook.Run`, `Orchestrator.Playbook.Schedule`, `Orchestrator.Playbook.Enqueue`, `Orchestrator.Workspace.Preview` |
| Reports | `Orchestrator.Report.List`, `Orchestrator.Report.Get`, `Orchestrator.Report.Run`, `Orchestrator.Report.SaveAs` |
| Delivery | `Orchestrator.Email.Send`, `Orchestrator.Telegram.Message` |
| Help | `Help.Orchestrator.Get` |

`Help.Orchestrator.Get` is the API directory: it returns the Markdown contract of every type above.

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later, Essentials or Premium.
- Bifröst Foundation, available separately on AppSource.
- For Telegram notifications: a Telegram bot token created through `@BotFather`, and a Telegram chat ID per user on Bifrost User Setup.
- For email notifications: a Business Central email account configured with an email scenario.

## Where to go next

- [In-product help](/help/nornir/)
- [Message type reference](./reference/message-types/) — the request and response contract for every type, generated from the app itself
- [AppSource user scenarios](./user-scenarios)
- [Partner Center listing](./listing)
- [Build on Bifröst](/extensibility/)
