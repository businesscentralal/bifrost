---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Copy these texts into Partner Center when creating or updating the offer listing.

---

## Offer Name
Bifrost Orchestrator

## Search Result Summary (max 50 chars)
Job queue supervision and Bifrost playbooks

## Offer Summary (max 100 chars)
Supervise the job queue, run playbooks and reports on a schedule, get e-mail or Telegram alerts.

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

## Description

The full description text is [below](#full-description-text).

---

## Help Link
https://docs.bifrost.origo.is/en-us/orchestrator/

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central

## Dependencies
- Bifrost Foundation (Origo), required, available separately on AppSource

---

## Full description text

**Bifrost Orchestrator** keeps the Business Central job queue running and turns routines into
playbooks that run themselves. It supervises job queue entries, restarts them when they fail and tells
you when it matters. Its playbooks chain Bifröst operations, the complete Business Central tasks that
Bifrost Foundation and the other Bifröst apps provide, into routines that run on request or on a
schedule. Bifröst takes Business Central out to the assistant your people already use, so an assistant
can run, schedule and help build those routines too.

### Who is this for?

**Business Central administrators, IT teams and the people who own recurring routines**: anyone who
runs scheduled background jobs in Business Central and needs them supervised, restarted and reported
on, or who wants a recurring task done the same way every time.

**Target industries:** Professional services, manufacturing, distribution, retail: any business that
runs scheduled jobs in Business Central.

### What it does

- **Job queue supervision** — Monitors job queue entries and restarts them when they fail, by a retry
  policy per entry (always, up to three times, or never). Reusable recurring templates hold the schedule.
- **E-mail and Telegram notifications** — Sends an alert when a job fails or is restarted. Telegram
  messages go to each user's chat ID; e-mail uses Business Central's own e-mail accounts.
- **Playbooks** — Routines of steps, each one a Bifröst operation in Business Central. A step can use
  values from earlier steps, repeat for every element of a list, and go one way on success and another
  on failure, with conditions that decide whether a step runs.
- **Scheduled playbooks** — Run a playbook on a recurring schedule through the job queue, run it once in
  the background with its own input, or start it from an assistant.
- **Reports on request** — Find a report, run it with explicit options or with the user's saved request
  page options, and save it as PDF, Excel, Word or XML, with a layout chosen for that run only. Report
  layouts can be listed, exported and imported.
- **Execution log** — Every playbook run is kept with a log per step: what the step sent, what it
  received and how long it took.
- **Assisted setup** — Guided setup of HTTP requests and the management job queue entry. Secrets such
  as the Telegram bot token are kept in Bifröst's secret store.

### How it works

1. Put job queue entries under Bifrost Orchestrator — it supervises them and restarts them when they fail.
2. Choose a **notification type** (None, EMail, Telegram) per entry to be alerted when a job fails or
   is restarted.
3. Build **playbooks** from steps that call Bifröst operations in order, passing values between steps.
4. Run playbooks by hand, on a schedule, or from an assistant.

### Supported editions and countries

- **Editions:** Business Central Essentials and Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain

### Requirements and prerequisites

- Microsoft Dynamics 365 Business Central 28.0 or later
- Bifrost Foundation (available separately on AppSource)
- For Telegram notifications: a Telegram bot token (created with @BotFather) and each user's Telegram chat ID in their Bifröst user setup
- For e-mail notifications: a Business Central e-mail account

### Help and documentation

https://docs.bifrost.origo.is/en-us/orchestrator/ (the Icelandic version is at https://docs.bifrost.origo.is/is-is/orchestrator/).
