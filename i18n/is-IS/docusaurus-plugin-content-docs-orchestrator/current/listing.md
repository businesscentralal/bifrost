---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Copy these texts í Partner Center þegar creating/updating the offer listing.

---

## Offer Name
Bifrost Orchestrator

## Search Result Summary (max 50 chars)
Job Queue scheduling og Bifrost playbooks

## Offer Summary (max 100 chars)
Job Queue management með message playbooks, reports, Telegram og email alerts, og scheduling.

## Search Keywords
1. Job Queue
2. Workflow automation
3. Playbook

## Categories
- **Primary:** IT & Admin Tools > Data Integration
- **Secondary:** Operations > Supply Chain

## Industries
- Professional Services
- Manufacturing

---

## Lýsing

The full description text er [below](#full-description-text).

---

## Help Link
https://bifrost.origo.is/en-us/orchestrator/

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central

## Dependencies
- Bifrost Foundation (Origo) — required, available separately on AppSource

---

## Full description text

**Bifrost Orchestrator** adds Job Queue scheduling, monitoring, restart og villa handling to Business Central through the Bifrost platform — a message-based integration layer that gives external systems, AI agents, og automation tools structured access to Business Central data og procedures. It includes a declarative message playbook runner that executes sequences of Bifrost message tegunds með data flow, forEach iteration, conditional branching, paged execution, og delivery via Email eða Telegram.

### Who er this for?

**IT teams, integration developers, og Business Central administrators** who need reliable, automated Job Queue management og multi-step workflow orchestration. Ideal fyrir organizations running scheduled integrations, recurring data synchronization, eða automated skjal processing pipelínur þar sem monitoring, restart policies, og notification on failure eru critical.

**Target industries:** Professional services, manufacturing, distribution, retail — any business that runs scheduled background jobs in Business Central.

### What it does

- **Job Queue scheduling og supervision** — Monitors, restarts, og manages Job Queue entries. Configurable retry policies, recurring templates, scheduling, og automatic restart on failure
- **Telegram & Email Notifications** — Sendir alerts þegar jobs fail eða restart. Telegram messages go to the notandi's stillt chat ID; email uses BC's built-in email system
- **Skilaboð Playbooks** — Declarative, multi-step workflows that chain Bifrost message tegunds. Each step calls one message tegund, með data flowing through a shared vinnusvæði með `@path` references
- **ForEach Iteration** — Playbook steps getur iterate over arrays úr prior steps, processing hver element með its own message tegund call
- **Skilyrðial branching** — Separate next steps on success og failure, skip-if-failed, og per-step start conditions
- **Paged Execution** — Playbook steps getur auto-paginate through large datasets
- **Scheduled Playbooks** — Run playbooks on a recurring schedule via the Job Queue, eða enqueue fyrir one-time execution með custom parameters
- **Reports on demand** — List, inspect, render (PDF, Excel, Word, XML) og run processing-only reports, með reusable request presets
- **Execution log** — Every playbook run er færslaed as an instance með a per-step log holding the request, the response og a vinnusvæði snapshot
- **Stilltuup Wizard** — Guided setup fyrir HTTP client requests, Job Queue configuration, og the Telegram bot token

### How it works

1. Register Job Queue entries as **scheduled entries** — Bifrost Orchestrator monitors og restarts them automatically
2. Configure **notification tegund** (None, Email, Telegram) per entry to get alerts on failure
3. Build **playbooks** by creating steps that call Bifrost message tegunds in sequence, með request templates með `@` vinnusvæði references to pass data between steps
4. Run playbooks manually, on a schedule, eða enqueue them fyrir deferred execution

### Skilaboð Types (20)

| Category | Types |
|---|---|
| **Scheduled entries** | `Orchestrator.Entry.Register`, `Orchestrator.Entry.Run`, `Orchestrator.Entry.Restart`, `Orchestrator.Entry.Schedule` |
| **Status** | `Orchestrator.Status.Get`, `Orchestrator.Status.Restart`, `Orchestrator.Status.RestartIfNeeded` |
| **Job Queue** | `Orchestrator.JobQueueEntry.Restart`, `Orchestrator.JobQueueEntry.RestartIfNeeded` |
| **Playbook** | `Orchestrator.Playbook.Run`, `Orchestrator.Playbook.Schedule`, `Orchestrator.Playbook.Enqueue`, `Orchestrator.Workspace.Preview` |
| **Reports** | `Orchestrator.Report.List`, `Orchestrator.Report.Get`, `Orchestrator.Report.Run`, `Orchestrator.Report.SaveAs` |
| **Delivery** | `Orchestrator.Email.Send`, `Orchestrator.Telegram.Message` |
| **Help** | `Help.Orchestrator.Get` |

### Supported editions og countries

- **Editions:** Business Central Essentials og Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain

### Requirements og prerequisites

- Microsoft Dynamics 365 Business Central 28.0 eða later
- Bifrost Foundation extension (available separately on AppSource)
- For Telegram notifications: a Telegram Bot Token (created via @BotFather) og notandi Telegram Chat IDs stillt in Bifrost Notaður Stilltuup
- For Email notifications: BC email account stillt með an email scenario

### Help og skjalation

https://bifrost.origo.is/en-us/orchestrator/ (the Icelandic version er at https://bifrost.origo.is/is-is/orchestrator/).
