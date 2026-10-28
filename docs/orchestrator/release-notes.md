---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Orchestrator published on Microsoft AppSource."
---

# Bifröst Orchestrator release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Orchestrator published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.0.3 — 28 October 2026

### Added

- **Bifrost Playbooks** and **Playbook Execution Log** open directly from the Navigate area of **Bifrost Setup**. The **Bifrost Orchestrator Setup** action under Apps is unchanged, and the playbook list can now also be found with Tell Me.

### Changed

- Checking a playbook now reports separate counts of the errors and warnings that block it from running or being scheduled. Findings on disabled steps stay visible, but they no longer count as blocking. The existing totals are unchanged. The description of the check tells your AI assistant which counts to read.

### Fixed

- The description of getting a report now says that the call may create an empty preset for the calling user if none exists. It was described as read-only. Nothing in how it behaves has changed.

## 28.0.2 — 25 October 2026

### Changed

- Your AI assistant gets a fuller description of every Orchestrator operation: what it answers, the errors it can return and why, and what it changes in Business Central.
- Operations that never use a record now say so instead of describing a made-up form, and step-by-step guidance is added where an operation belongs to a sequence, such as run, register and schedule.
- Report layouts can be listed and read with their own descriptions and examples. The description of queuing a playbook now says that each call queues one more run and does not check the playbook, so run the check first.
- The description of scheduling an entry now says what it does: it rebuilds the Job Queue schedule from the recurrence settings. It does not run the entry immediately.

### Fixed

- Previewing a workspace is offered to assistants for both reading and writing, and getting a report states that it may insert a preset. Nothing in how these behave has changed; only the description was wrong.

## 28.0.1 — 21 October 2026

### Added

- Check a playbook before you run it. The check reads the whole playbook, including disabled steps, and lists its findings. Each finding has a severity (error or warning), the step it concerns, a message and a suggested next step, in the language of your session (English or Icelandic).
- The check catches broken playbooks early: an operation that does not exist or is not enabled, a next step that is missing, a reference to a step that has not run yet, a template that is not valid JSON, a check or action step without a success condition, and a language model role that does not exist.
- The check also warns about a write step that runs for every item of a list without the per-item guard that the earlier check step needs. Without the guard, the write would also run for items the check rejected.
- Run Now, running a playbook from an assistant or an integration, and scheduling a playbook now check it first. A playbook with an error, or with a warning you have not chosen to accept, is refused and nothing is written. The answer names the findings that block it.
- The built-in help has a new chapter on building a playbook safely, from design to schedule, a table of the finding codes and three worked examples: a per-record decision followed by a write, a read-only report, and one example of what to avoid. An assistant that builds a playbook with you follows the same steps.

### Changed

- The Orchestrator documentation and the help for each page are published on docs.bifrost.origo.is, and the app's help, privacy statement and Terms of Use links point there.

### Fixed

- A check step that fails for a technical reason, such as an error from the operation it calls, is now logged as failed. Before, the error was read as the answer "no", the step was logged as cancelled with no error text, and the run could finish as successful. The step log now shows the error text, and a genuine answer of "no" is logged as "Check answered no."
- The run summary counts failed check iterations separately from iterations that answered "no", so you can tell a broken check from a rejected item.
- A playbook's last run, last status and last run time are now updated by every kind of run: Run Now, a run started by an assistant or an integration, a queued run and a scheduled run. A run that is interrupted stays marked as running instead of showing the earlier successful run.

## 28.0.0 — 19 October 2026

### First version on Microsoft AppSource

- Chain Business Central operations into playbooks: a list of steps where the answer of one step feeds the next, with no code.
- Run a playbook with **Run Now**, on a schedule through the job queue, or when an assistant or another system asks for it. An assistant can also build a playbook with you in a conversation.
- Supervise job queue entries: Bifröst Orchestrator restarts failed entries and retries them by the rules you set.
- Be told when a job fails or is restarted, by e-mail or by Telegram message.
- See every playbook run step by step, with what each step sent and what it received.
- Run reports on request and save them as PDF, Excel, Word or XML, with a layout chosen for that run only.
