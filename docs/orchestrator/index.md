---
id: index
title: "Bifröst Orchestrator"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Job queue scheduling, monitoring and restart for Business Central, plus playbooks that chain Business Central operations into routines."
---

# Bifröst Orchestrator

**Routines that run themselves, and a job queue that looks after itself.** Bifrost Orchestrator chains
Bifröst's operations into playbooks, runs them on a schedule, supervises your job queue entries and
tells you when something fails.

This page is for the people who decide on the app and set it up. Bifrost Orchestrator is an additional
app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).

## What you can do

- **Turn a routine into a playbook.** A playbook is a list of steps, each one an operation in Business
  Central, where one step's answer feeds the next: list the orders past their date, release them, then
  tell the right person. No code.
- **Run it when it should run.** With **Run Now**, on a schedule through the job queue, or when an
  assistant or another system asks for it.
- **Stop watching the job queue.** Bifrost Orchestrator supervises job queue entries, restarts them when
  they fail and retries by the rules you set.
- **Be told when it matters.** An e-mail or a Telegram message when a job fails or is restarted, and a
  Telegram message from an assistant when you ask for one.
- **See what happened.** Every playbook run is kept, step by step, with what each step sent and what it
  received.
- **Run reports on request.** An assistant or a playbook can find a report, run it with the options it
  gives or with your saved request page options, and save it as PDF, Excel, Word or XML, with a layout
  chosen for that run only. Report layouts can be listed, exported and imported.

Playbooks can call the operations of every installed Bifröst app, so each app you add gives your
routines more to work with. An assistant can also build a playbook with you in a conversation.

## Capabilities

| Domain | Capabilities |
|---|---|
| **Orchestrator** | Supervising and restarting job queue entries, running and scheduling playbooks, running and saving reports and managing their layouts, and sending Telegram messages and e-mails |

## Get it

Install **Bifrost Orchestrator** next to Bifröst Foundation, from AppSource or through your Business
Central partner. It needs Business Central 28.0 or later. For the price, contact your Business Central
partner.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | On **Bifrost Setup**, run the setup wizard if a notification asks you to. It allows the Bifröst apps to make HTTP requests, which notifications and external services need. | Business Central administrator |
| 2 | Run the **Bifrost Orchestrator Setup** assisted setup to start the management job queue entry. | Business Central administrator |
| 3 | For Telegram notifications, enter the bot token (from Telegram's `@BotFather`) with **Set Telegram Bot Token** on **Bifrost Orchestrator Setup**, and each person's Telegram chat ID on their Bifröst user setup. For e-mail notifications, set up a Business Central e-mail account. | Business Central administrator |
| 4 | Put the job queue entries Bifrost Orchestrator should supervise under it with **Add to Bifrost Orchestrator**, and choose how each one notifies. | Business Central administrator |
| 5 | Build playbooks, try them with **Run Now**, then schedule the ones that should run by themselves. | Whoever owns the routine |

The help of each page has the details:
[Bifrost Orchestrator Setup](/help/orchestrator/orchestrator-setup/),
[the assisted setup](/help/orchestrator/scheduler-setup-wizard/),
[Bifrost Playbooks](/help/orchestrator/playbooks/) and
[Job Queue Orchestrator Entry Card](/help/orchestrator/scheduled-entry-card/).

### Permission sets

| Set | For |
|---|---|
| `BIFROST Orchestr ori` | Full use of the app: everything below |
| `BIFROST OrchSet ori` | The administrators who maintain the setup, the client credentials, the recurring templates and the app's secrets |
| `BIFROST OrchMgt ori` | The people who monitor, run and restart supervised jobs, without changing the setup |
| `BIFROST PlaybAdm ori` | The people who build, run and schedule playbooks |
| `BIFROST PlaybVw ori` | The people who only view playbooks and their execution log |

Assign them together with the Bifröst sets people use Bifröst with; see
[Permission sets and gates](/documentation/end-customers/permissions/). Scheduling jobs also needs the
standard Business Central job queue permissions.

## Good to know

- **A playbook runs with the permissions of the user who runs it**; a scheduled playbook, with those of
  the user its job queue entry runs as. Every step is logged on **Bifrost Messages** as well as in the
  playbook's execution log.
- **Try a playbook before you schedule it**, in a sandbox, with a case where there is work to do, one
  where there is none, and one with a bad input.
- **Secrets stay in Bifröst's secret store.** The Telegram bot token and the client ID and secret of each
  client credential pair are never shown on a page or kept in a table.
- **Who a job runs as, and where its notifications go, are set in Business Central.** An AI agent cannot
  change the user of a job queue entry or the recipient of its notifications through Bifröst's general
  data operations; they are changed on the entry card and the setup page.
- **Notifications appear on Bifrost Setup only.** Bifrost Orchestrator's own pages show no setup
  banners.
- **Message types.** The operations this app adds are listed with all the others by the MCP tools
  (`list_domains`, `describe_domains`, `describe_message_type`) and on Bifrost Setup, and each explains
  itself through `Help.Implementation.Get`.

[AppSource listing text](./listing) · [AppSource validation scenarios](./user-scenarios)
