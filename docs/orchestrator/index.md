---
id: index
title: "Bifröst Orchestrator"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Job Queue scheduling, monitoring and restart for Business Central, plus declarative playbooks that chain Bifröst message types."
---

# Bifröst Orchestrator

**Routines that run themselves, and a job queue that looks after itself.** Chain Bifröst's
operations into a playbook, run it on a schedule, and hear about it when something fails.

{/* OPEN-21 */}

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Turn a routine into a playbook.** A playbook is a list of steps, each one a message type, where
  one step's answer feeds the next: list the orders past their date, then release them, then tell
  the right person. No code.
- **Run it when it should run.** By hand, on a schedule through the Job Queue, or when an assistant
  or another system asks for it.
- **Stop babysitting the Job Queue.** Orchestrator watches Job Queue entries, restarts them when
  they fail and retries by the rules you set.
- **Be told when it matters.** An email or a Telegram message when a job fails or restarts.
- **See what happened.** Every playbook run is kept, step by step, with what each step was sent and
  what it answered.
- **Run reports on demand.** List, run and save reports as PDF, Excel or Word, with saved request
  presets.

Playbooks can use message types from any Bifröst app, so every app you add gives your routines more
to work with. An assistant can also build playbooks for you by conversation; see
[Skills for AI agents](/skills/).

## Get it

Install **Bifrost Orchestrator** next to Bifröst Foundation, from AppSource or through your
partner. It needs Business Central 28.0 or later, Essentials or Premium.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | On **Bifrost Setup**, run the Orchestrator **setup wizard**: allow HTTP requests for the app and start its management job queue. | Business Central administrator |
| 2 | For Telegram alerts, add a bot token (from Telegram's `@BotFather`) in the wizard, and each person's chat ID on **Bifrost User Setup**. For email alerts, set up a Business Central email account. | Business Central administrator |
| 3 | Register the Job Queue entries Orchestrator should watch, and choose how each one notifies. | Business Central administrator |
| 4 | Build or import playbooks, try them, then schedule the ones that should run by themselves. | Whoever owns the routine |

The step-by-step guides are in the in-product help: [Orchestrator setup](/help/orchestrator/orchestrator-setup/)
and [Playbooks](/help/orchestrator/playbooks/).

## Good to know

- **A playbook runs with the permissions of whoever starts it**; a scheduled one, with those of the
  user its Job Queue entry runs as. {/* OPEN-22 */} Every step is logged on **Bifrost Messages** as well as in the
  playbook run.
- **Try a playbook before you schedule it**, in a sandbox, with a case where there is work to do,
  one where there is none, and one with a bad input.
- **The Telegram bot token** is stored encrypted in Business Central.

## Capabilities and reference

Capability: **`Orchestrator`**. What each message
type does, in plain words: [Capabilities](./capabilities).

- [Message type reference](./reference/message-types/): the contract of every type, generated from the app itself
- [AppSource listing text](./listing) · [AppSource validation scenarios](./user-scenarios)
- [What makes a good playbook step](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/Bifrost%20Reference%20Playbooks/README.md), in the partner reference repository
