---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Orchestrator published on Microsoft AppSource."
---

# Bifröst Orchestrator release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Orchestrator published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.0.4 — DATE (set by the release manager)

### Added

- **Confirm from the preview.** A playbook step that does something irreversible can now confirm the number of records from the preview the operation gives, up to a limit you set. The step has a new **Max Count** field. If the previewed count is above the limit, or there is no limit, the step fails and nothing is changed. The step log shows the previewed and the confirmed count, or the refusal. Checking a playbook reports a step that asks for the preview without a limit and a limit without the preview.
- **Print and send more documents.** Your AI assistant can print a purchase order, a sales quote or a sales order confirmation as a PDF, using the report that Report Selection names for the document. The file has a stable name. It can also send each of the three through the Document Sending Profile, the same way a sales invoice is sent. A document that does not exist, a profile that does not exist or is tied to a client, and a missing e-mail address are refused before anything is sent.
- **Table data.** Administrators can open a table's rows in **Table Data**, filter them, page through them and change a single field value. The table can be exported to a JSON file and a file can be imported, with a dry run and a confirmation first. Fields that Bifröst restricts are not shown or changed, and a table that is restricted for reading is refused. These pages are for playbook administrators only.
- **Copy plans.** A copy plan lists the tables to copy and how fields map. Bifröst generates a playbook from it that reads in pages and writes each row. Parents are copied before their children, and the plan only replaces the playbook it generated earlier.
- **Transform steps.** A playbook step can now change data without calling an operation: copy a value, set a constant, negate a number or replace text. A copy plan can use the same transformations on a field.
- **Convert a text reply to data.** A transform step can turn text that holds JSON, such as an AI reply that is wrapped in a Markdown code fence, into real data. A later step can then pass it on to an operation that expects an object or a list. Text that is not valid JSON fails the step with a clear message and nothing is passed on. A playbook check warns when a text value is sent where an object or a list is expected.
- **Chat on the playbook card.** When Bifröst Chat is turned on, the **Bifrost Chat** FactBox appears on the **Playbook Card**, with the playbook as its context.
- **Report layouts from a staged file.** A report layout can be uploaded from a file that another Bifröst app has staged, as an alternative to sending the layout itself.
- **A worked example.** The built-in help has a new example playbook that audits the posting setup of customers with an AI model.
- **Set or clear the default report layout.** Your AI assistant can make an uploaded layout, or an existing layout picked by name, the default layout of a report in the company. It can also clear the default. Clearing removes the company's own override and restores the all-companies default, or the report's built-in layout when no such default exists. The answer names the layout that was the default before, so it can be restored in one call.
- **Export and import a playbook.** The **Playbooks** page has new **Export Playbook** and **Import Playbook** actions. The file holds the playbook with its steps, conditions and transform rows. Import asks for confirmation first and stops at the first row that cannot be imported.
- **Tools on Bifröst Setup and Playbooks.** Bifröst Setup and the Playbooks list have a new **Tools** group that opens Table Data and Copy Plans. Users who may not read those pages do not see the links.
- **More checks before a run.** Checking a playbook now also warns about:
  - an AI question that goes through an unbounded list of records
  - a question about data without a response schema
  - a discarded trace in an app without Language Models
  - an irreversible operation without a confirmed count while confirmation is required
  - a request key that the operation does not accept
  - a list position written the wrong way, such as `result.0.id` instead of `result[0].id`
  - a success condition that reads a value the operation does not answer with
  - a reference to the current item in a step that does not repeat over a list
  - an AI step with success conditions but none on how the answer ended
  - a list path that the earlier step does not return

### Changed

- Every Orchestrator operation now checks the app version and then the license before it does any work.
- Operations that cannot be undone say what their expected count counts, for example one document, one message or one playbook run, and how to see the count without any change before confirming it.
- Playbook check findings are listed by step number first, then errors before warnings. Findings about the playbook as a whole come last. The finding for an unknown request key names the keys in their real spelling and now also covers operations that only read data.
- A reference to an unknown field of the current item is an error in a playbook check. AI playbooks that only check for success now carry a warning, which blocks running and scheduling unless warnings are accepted.
- Icelandic texts for playbooks, copy plans, table data, document sending, PDF and report layouts were reviewed and corrected.
- A stored field that does not exist is an error in a playbook check, not a warning. It blocks running and scheduling even when warnings are accepted, so a playbook that only warned before can be refused until its references are corrected.
- The answers of a playbook check explain what happens at run time for a missing step or field: the step fails before anything is sent, and the failed log entry names the reference.
- The built-in help for the PDF operations says what is written as a side effect. Printing a purchase order or a sales quote can add an entry to the interaction log, and a sales quote or sales order confirmation can be stored as an archived document version when archiving is turned on for it.
- The AI answers in a playbook run no longer keep the trace in the Orchestrator log or in what later steps read.
- Administrators of licenses can open Bifrost Setup and register Orchestrator without being given the Orchestrator administration role.
- Report layout operations are easier to use. A caller can see a layout's company restriction before choosing it, gets the correct file type when downloading a layout, and gets stable error codes for a missing layout name or a staging id that is already used. The built-in help, in English and Icelandic, now names the option to set a layout as the default, gives the all-zero GUID example for user-defined layouts, and states that deleting a layout is deliberately not available to your AI assistant. The help for saving a report as a file adds guidance on the document filter, inline output and the timeout.
- The built-in help for Orchestrator lists the operations correctly: it shows the real number of operations, includes the operation that sets a report layout, and has a new **Required parameters** column for every operation.

### Fixed

- A schedule that has never run now runs in its first allowed slot. A daily schedule keeps its next configured start time when a run is delayed past midnight, and applying a recurring template keeps the existing job instead of replacing it. Changing the starting time keeps the reference time in step.
- Playbook references to a record's primary key, such as `@_current.primaryKey.No_`, are checked before a step runs. A reference that points nowhere fails the step with a clear message instead of sending the reference text. The check also warns when a primary key field is read from the wrong place.
- A whole-value reference keeps the type of its source. A number-like code such as `1001` stays text and is no longer sent as a number.
- The **Exists** condition is false for a missing value, an empty text, an empty list and an empty object, so a missing chat id no longer counts as present. Numbers and the values `0` and `false` still exist.
- A failed step always has an error text. A step that gets an error answer shows it, and a success condition that does not hold names what it expected and what it got. A failed run names the first step that failed, in the language of the run.
- The text shown for a forEach item that was skipped because an earlier step failed is translated into Icelandic.
- A playbook check no longer warns about the envelope keys that an operation accepts, such as the expected count, the subject or strict mode.
- A transform step shows a blank operation in the log instead of `0`, and the operation left on a transform step can be cleared. The check names the step to clear.
- The step log shows the error text of every refused call, including a call that needed confirmation.
- A sales quote PDF returns its file name in the same way as a purchase order PDF.
- The description of the sales quote and sales order confirmation send operations names the PDF operation that now exists.
- The Orchestrator wizard is registered in Assisted Setup for users who have no business permissions, without giving them more access.
- The preview of a workspace no longer repeats the direction of the operation in its notes.
- The shared description of who you are no longer names Orchestrator in apps that do not use it.
- A transform step can read the matching item of an earlier step that repeats over a list, in the same way request values already can.
- A playbook run that points at a step that does not exist now ends as **Failed** with the error text. Before, it could stay **Running** forever. A scheduled playbook that fails is no longer started again three times within seconds by the job queue. The restart rules of the schedule decide.
- The **Playbook Execution Log** has a new action, **Close Abandoned Runs**. It closes runs that have been Running for more than 24 hours as Failed and deletes nothing.
- Every failed step and run has an error text, including a repeating step where some items failed. The response in the step log is always JSON, also when the answer was plain text.
- A check that answers no is shown in a separate **Outcome Note** column of the step log and no longer as an error text.
- The saved snapshot of a failed step no longer keeps the user and the user id, which are replaced by a placeholder, and values with names such as password or secret are masked. Step inputs and results are kept for debugging and can still contain personal data, so treat the snapshot as sensitive.
- Importing a playbook from the **Playbooks** page no longer fails when the company's Change Log guard is set to Blocked and no Change Log coverage exists. The import runs under the administrator's own permissions and validates every field. Export and the other imports keep their guards. The misleading hint to set up Change Log is gone.
- Setting a report layout by name no longer replaces or re-scopes a user-defined layout that is limited to another company. The request is refused with a message that asks for another layout name, and nothing is changed. Looking up or setting as default such a layout still answers that it was not found, so the other company is not disclosed.

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
