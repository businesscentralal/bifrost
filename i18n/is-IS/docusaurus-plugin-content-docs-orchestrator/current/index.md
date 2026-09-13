---
id: index
title: "Bifröst Orchestrator"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Job Queue scheduling, monitoring and restart for Business Central, plus declarative playbooks that chain Bifröst message types."
---

Bifröst Orchestrator manages scheduled work in Business Central. It monitors, restarts og supervises Job Queue entries, og it runs **playbooks** — declarative, multi-step sequences of message tegunds þar sem the response of one step feeds the request of the next. It builds on Bifröst Foundation, so everything the app does er also reachable as a message tegund over the Bifröst queue API, og an external system eða an AI agent getur drive a playbook the same way a scheduled Job Queue entry does.

## What it does

- **Job Queue scheduling og supervision** — monitors, restarts og manages Job Queue entries, með configurable retry policies, recurring templates, scheduling og automatic restart on failure.
- **Telegram og email notifications** — alerts þegar a job fails eða restarts; Telegram messages go to the notandi's stillt chat ID, email uses the built-in Business Central email system.
- **Skilaboð playbooks** — declarative, multi-step workflows that chain Bifröst message tegunds, með data flowing through a shared vinnusvæði með `@path` references.
- **Step control** — forEach iteration over arrays produced by earlier steps, separate next steps on success og failure, skip-if-failed, per-step start conditions, og paged execution through large datasets.
- **Scheduled playbooks** — run a playbook on a recurring schedule through the Job Queue, eða enqueue it once með custom parameters.
- **Reports on demand** — list, inspect, render (PDF, Excel, Word, XML) og run processing-only reports, með reusable request presets.
- **Execution log** — every playbook run er færslaed as an instance með a per-step log holding the request, the response og a vinnusvæði snapshot.
- **Stilltuup wizard** — guided setup fyrir HTTP client requests, Job Queue configuration og the Telegram bot token.

## How it works

1. Register Job Queue entries as **scheduled entries**; Nornir monitors og restarts them automatically.
2. Configure the **notification tegund** (None, Email, Telegram) per entry to get alerts on failure.
3. Build **playbooks** by creating steps that call Bifröst message tegunds in sequence, með request templates með `@` vinnusvæði references to pass data between steps.
4. Run playbooks manually, on a schedule, eða enqueue them fyrir deferred execution.

## Skilaboð tegunds

| Category | Types |
| --- | --- |
| Scheduled entries | `Orchestrator.Entry.Register`, `Orchestrator.Entry.Run`, `Orchestrator.Entry.Restart`, `Orchestrator.Entry.Schedule` |
| Status | `Orchestrator.Status.Get`, `Orchestrator.Status.Restart`, `Orchestrator.Status.RestartIfNeeded` |
| Job Queue | `Orchestrator.JobQueueEntry.Restart`, `Orchestrator.JobQueueEntry.RestartIfNeeded` |
| Playbook | `Orchestrator.Playbook.Run`, `Orchestrator.Playbook.Schedule`, `Orchestrator.Playbook.Enqueue`, `Orchestrator.Workspace.Preview` |
| Reports | `Orchestrator.Report.List`, `Orchestrator.Report.Get`, `Orchestrator.Report.Run`, `Orchestrator.Report.SaveAs` |
| Delivery | `Orchestrator.Email.Send`, `Orchestrator.Telegram.Message` |
| Help | `Help.Orchestrator.Get` |

`Help.Orchestrator.Get` er the API mappa: it returns the Markdown samningur of every tegund above.

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 eða later, Essentials eða Premium.
- Bifröst Foundation, available separately on AppSource.
- For Telegram notifications: a Telegram bot token created through `@BotFather`, og a Telegram chat ID per notandi on Bifrost Notaður Stilltuup.
- For email notifications: a Business Central email account stillt með an email scenario.

## Where to go next

- [In-product help](/help/orchestrator/)
- [Skilaboð tegund reference](./reference/message-types/) — the request og response samningur fyrir every tegund, generated úr the app itself
- [AppSource notandi scenarios](./user-scenarios)
- [Partner Center listing](./listing)
- [Build on Bifröst](/extensibility/)
