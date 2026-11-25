---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Foundation published on Microsoft AppSource."
---

# Bifröst Foundation release notes

This page is for Business Central administrators and users who want to know what changed in Bifröst Foundation. It lists the versions published on Microsoft AppSource, newest first. To see which version you have installed, open **Extension Management** in Business Central and look for **Bifrost Foundation**.

## 28.0.16 — date set on release day

### Added
- **My Bifröst Dashboards.** Each user can keep a personal list of favourite dashboards, in their own order, and open them from one place.
- **Save dashboards as PDF.** The dashboard viewer and full screen have **Save as PDF**. The PDF shows the current dashboard in A4 landscape and carries the data behind it as attached JSON and CSV files, with the refresh time and parameters.
- **Dashboard-only permission set.** A new permission set lets a user view and refresh dashboards with their own business-data permissions, without access to Bifrost Setup or the request log pages.
- **Bifrost Chat on the Dashboards list.** Users with Chat permission and a configured provider see the chat next to the Dashboards list, with the selected dashboard as context.
- **App identity in status answers.** The status that Bifröst reports about itself now includes the installed app id of Foundation and of each Bifröst app, so an assistant can match it to the published versions list.
- **Shared field-read rules for Bifröst apps.** Other Bifröst apps can now apply the same field-read restrictions and field references as Foundation, so a refusal looks the same in every app.

### Changed
- **Sync enables Vendor and Partner roles.** Running **Sync** on Bifrost Setup enables the Vendor role, the Partner role and the license configuration of the company that runs it when the registration records for that tenant and company are found. A background license refresh does not switch these roles off.
- **Permission reports explain indirect writes.** The permissions answer now lists insert, modify and delete separately, from the user's effective permissions and license limits, and explains that Bifröst operations can create or change records through their own indirect permissions even when direct writing is not allowed.
- **Icelandic wording.** A production environment is called *raunumhverfi* in Icelandic, and the usage filter shows **Raunumhverfi** and **Sandkassi**.

### Fixed
- **Writes with the Change Log turned on.** Bifröst operations that change business data no longer fail when the Business Central Change Log records the change.
- **Personal identifiers are not echoed.** When a request is refused because of an unknown parameter, the value of a personal identifier such as a national ID number is hidden in the answer and the log.
- **Write permissions with license limits.** A user who may only modify records is no longer reported as unable to write.
- **Group field access.** The group field access page now works like the user field access page, with table and field names and the same lookups.
- **"All fields" in one language.** Guard exceptions and field access rules created in different languages now show the same *All Fields* text.

## 28.0.15 — 23 November 2026

### Added
- **Copy sales and purchase documents.** You can copy an unposted or posted sales document, or a purchase document, into a new document or into an existing open one. Lines already on the target are kept, and a copy onto itself or into a target that already has a header is refused. A request is checked before anything is written, and a refusal says how to recover.
- **Cancel posted credit memos.** A posted sales credit memo and a posted purchase credit memo can be cancelled when the credit memo itself cancelled an invoice. Any other credit memo is refused with an explanation.
- **Suggest vendor payments.** Bifröst can fill a payment journal with suggested vendor payments, filtered by vendor.
- **Fixed asset depreciation.** Depreciation can be calculated into the fixed asset journal or the general journal.
- **Year-end close.** Bifröst can run the income statement close into a general journal.
- **Recurring journals.** Recurring general journals can be posted.
- **Deferrals.** Deferral schedules on documents and journal lines can be read and set.
- **Number series.** The next number in a number series can be previewed and, after confirmation, taken.
- **Active and Inactive users.** The Bifrost User Setup now has an Active/Inactive status for users and app registrations.
- **Administrators can add user setup in advance.** An administrator can add a user to Bifrost User Setup with **New** before the user first connects. The help describes when the row is otherwise created.
- **Usage filters.** The licensing usage view can be filtered by environment type, Production or Sandbox, and the filters work in the web client.

### Changed
- **Longer MCP tool results.** Content that the chat tools hand over is now kept per user in temporary storage with a size limit of 25 MiB and an expiry of 24 hours. It survives a chat reset, and existing tool names and references keep working.
- **Confirmation counts only for posting.** Only operations that post, and so cannot be undone, ask for the confirmation count. Eight other operations that create or change data without posting now run without it, and a count that is still sent is ignored. The help says which is which.
- **Licensing messages.** After a trial has expired, the License FactBox and the menu point to **Request License** instead of **Activate Trial**. The license type, dates and the Sync failure warning are shown with clearer wording in English and Icelandic, and trial lines are hidden where they no longer apply.
- **Icelandic wording.** Icelandic texts were aligned with the review made for the previous version.
- **Help.** The help explains when each Bifrost User Setup row is created and limits the confirmation count guidance to posting.

### Fixed
- **Keys keep their meaning in every language.** When a record is read, option and enum values in its key are answered as language-independent names, so the key can be reused in another language. Names of keys are no longer confused with field captions.
- **Setup Mode and generic readers.** While Setup Mode is on, the generic readers can open the setup tables that Setup Mode allows. On-premises installations name the one read exception and keep other failures to open a table distinct.
- **Usage filter values.** The expected environment values in the usage filters are translated, and the filter offers only Production and Sandbox.
- **Cancelling a purchase credit memo.** A failure when cancelling a purchase credit memo and the checks that protect the ledger entries involved were corrected.
- **Depreciation messages.** A depreciation calculation that fails keeps its failure, shows guidance in the user's language, and names the lines that were inserted.

## 28.0.14 — 20 November 2026

This version also includes the changes made since 28.0.12, including those of version 28.0.13, which was not published on AppSource.

### Added
- **Dashboards.** Bifröst can now store a dashboard, an HTML page that shows data read from other operations, and show it in Business Central. A new **Dashboards** list, also reachable from a **Dashboards** action in Bifrost Setup, opens a viewer with **Refresh**, **Full Screen** and **Data Sources**. The viewer runs the page in a sandbox with no network access of its own, refreshes on request or on a timer of at least 30 seconds, and can copy the first chart or table. Today's date and the work date can be used in a data source request, and the viewer has ready-made helpers for aging reports by calendar period. When a data source returns only part of the data, the viewer says which one. Anyone with read access can view a dashboard. Creating, changing and removing dashboards needs the new **BIFROST Dash** permission set. The Dashboards pages now open their own help.
- **Bifröst Groups.** Administrators can create groups in Business Central, mark one as the default, and give each group its own assistant prompt, field access rules and a list of disabled operations. Each user picks one group on the user setup. A rule set on the user itself always takes priority over group rules, and the setup shows which prompt source applies.
- **Setup Mode wizard.** Setup Mode is now switched on for the whole company from a short wizard where you choose a duration of up to eight hours (two hours by default) and the Bifröst apps that should take part. You no longer choose a session source. While Setup Mode is on, every new session needs manual approval, and only an approval given in that window allows setup changes. When Setup Mode is stopped or runs out, the normal approval policy applies again. The status and the end time appear in the License FactBox in every deployment type, and other Bifröst apps can show the same status and record the setup changes they allow.
- **Approved callers.** A new **Callers** list in Bifrost Setup holds the AI hosts that may be approved as a session source. When a caller name is sent with an approval, it is checked against the list, and an unknown caller can be refused or added as new. Callers that send no name are not affected.
- **Usage counts on the user setup.** The user setup list and editor show each user's chargeable message counts for this month to date and for the whole previous month, with drill-down to the messages.
- **Customer Management shows Terms of Use approval.** Two new columns, **EULA Approved At** and **EULA Approved By**, show when and by whom a customer's Terms of Use were approved, separately from the partner relationship. A customer with no friendly name shows the name from another configuration of the same tenant where one is available.
- **Security filters are reported.** When a security filter limits what a user can read from a table, the answer now says so, with a low-severity warning, so an assistant does not take a filtered list for the whole table.
- **Staged text for memory.** Company and user memory entries can be sent through temporary file storage instead of inline text, which allows longer texts.
- **Trial progress in the License FactBox.** For a trial that runs on the installation itself, the FactBox shows the end date and the number of messages used out of the 1,000 included, and says which limit ended the trial: messages, days, both, or an unreadable counter.
- **Licensing answers say why a message is refused.** The licensing status now shows the verdict that decides whether messages are accepted, with the reason (trial messages used up, trial days elapsed, trial counter changed, license expired, grace period over or user limit) and what to do next. A refusal because of a license limit gives the same reason and next step.
- **Dashboards in Bifrost Setup.** Bifrost Setup has a **Dashboards** action (**Mælaborð** in Icelandic) next to the other navigation actions.
- **Left-out fields are named.** When a read leaves out a requested field because the caller may not read it, the answer names the field and says why and what to do, instead of leaving it out silently. Purchase posting previews do the same for fields they omit because of read restrictions.
- **Group pages have their own help.** The pages for groups, group field access and group operations open a help topic about groups instead of the Bifrost Setup help.

### Changed
- **Terms of Use and trial exemption.** Outside Production, a company is exempt from the Terms of Use and trial checks only when it is marked as an evaluation company and its name is that of a Microsoft demonstration company. A company that has only the flag or only the name now needs the Terms of Use approved and an active trial, except in a Business Central online (SaaS) sandbox. Installations that are not Business Central online, including on-premises and container sandboxes, are no longer exempt.
- **The sandbox rate limit is retired.** Bifröst no longer limits messages per day in sandboxes. The **Configure Rate Limit** action and its dialog are hidden, the setup wizard no longer mentions a limit. Monthly license quotas are unchanged.
- **Trial instead of Prepaid.** Licensing setup, the wizard, the License FactBox, user setup and partner and customer messages now say **Trial** (**Prufuleyfi**), and explain the trial message quota without suggesting a purchase.
- **Delegated partner users count as Support on every license.** A delegated partner user, such as a delegated admin or helpdesk agent, is Support on a Trial as well as on a Subscription. Other users keep their charge type.
- **License display follows the deployment.** The License FactBox and the licensing actions in Bifrost Setup show what applies: on-premises installations show the license type, state, validity, user count and Terms of Use, and hide usage and connection actions; Business Central online shows usage and hides the non-SaaS details.
- **On-premises installations are licensed locally.** Installations that are not Business Central online, such as on-premises, track the trial and its limits themselves, show the license state on Bifrost Setup, offer **Activate Trial** as the last step of the setup wizard, and warn before a grace period ends. The trial starts on the installation itself, without a network call, and keeps its limits of 90 days and 1,000 messages. A subscription is requested explicitly from Bifrost Setup, shows as pending until it is approved, and is checked on **Sync**; while a request is pending, refused or cannot be checked, a valid trial keeps running. Syncing and the setup wizard never fail because of the license check. These installations no longer read or use the online licensing and billing connection settings, and an upgrade removes the stored ones.
- **The setup wizard says what is sent for licensing.** On installations that are not Business Central online, the first wizard step lists the data that the license activation and check send, says which of it is personal data, and states that no usage, secret, private key or business data is sent. Business Central online shows the existing storage text.
- **Clearer answers and help.** A confirmation preview for an empty request no longer reads "1 (record )". Requests that miss a table name are answered as a missing parameter. Budget import checks the target budget and every row together. A blank document number in a resource journal batch is named. Statement PDFs refuse an invalid date choice. Quote and blanket order conversions name the document key you sent. Posted-document PDFs are no longer treated as irreversible. The help for invoicing project lines explains how many hours are billed, with an example, and the help for the operations that read data explains how a security filter can hide rows.
- **Setup Mode can change the approved setup tables.** While Setup Mode is active, a session approved in that window can write to the setup tables listed in the wizard and in the Setup Mode help. Secrets, media security tokens and authentication fields stay closed, the change log can only be added to, and a user cannot change their own access or groups. Credential fields are never read or written, in any mode.
- **Confirmation counts are explained.** The help for every operation that cannot be undone says what the confirmation count counts, for example the journal lines in the selected batch for a journal posting, and how to read the count without changing anything: send the request without the count and read the expected value.
- **Blanket order conversion and incoming document processing need no count.** Converting a sales or purchase blanket order to an order and processing an incoming document create documents and do not post, so they now run without the confirmation count, also when confirmation is required. A count that is still sent is ignored.
- **Project invoicing confirms the invoiced quantity.** Creating a sales invoice from project lines now asks you to confirm the quantity for lines that are both Budget and Billable, as Business Central bills the planned quantity to invoice independently of posted usage.
- **Approval is not needed for help and internal calls.** While Setup Mode is on, the help, Bifröst information and memory operations, and approving a session source, no longer need session approval. Operations that Bifröst itself starts, such as a dashboard refresh, the chat tools, playbook steps and calls from other Bifröst apps, never need it either. Calls made by tasks, queues and direct callers are unchanged.
- **Approval cancellation count is defined.** The count of cancelled entries in an approval cancellation is the number of approval entries that became Canceled, both open and created ones, and the help says so.
- **Refusals carry a code and a next step.** Refusals because a monthly license quota is used up (company, user or pool) and refusals of a session source approval now carry a stable code and a translated next step.
- **Sales documents.** The help for sending a sales invoice or credit memo now names the fields that show whether the document was printed or sent, and explains that they do not confirm e-mail delivery. The help for adding to Memory states that positions in error messages count from 1. The help for changing item journal lines says it deletes selected lines and renumbers document numbers without changing other fields.

### Fixed
- **Boolean filters work in every language.** In a table view, Yes, No, true, false, 1 and 0 are accepted for Boolean fields in English and Icelandic, and the caption of the current language still works.
- **A reliable Success answer.** Foundation now checks every answer from every Bifröst app and supplies a missing status or error code, and write operations refuse a parameter they do not declare.
- **Setup wizard no longer fails on an unreadable secret.** On Business Central online, finishing the wizard and syncing continue when the licensing connection secrets cannot be read. The trial is not started in that case.
- **Setup wizard finishes with tenant encryption.** On installations that are not Business Central online, finishing the setup wizard works when encryption is turned on, and a retry after a refused activation keeps the installation's identity.
- **Default Language Code is optional.** Bifrost Setup no longer marks **Default Language Code** as required. When it is blank, the company's default language is used, and English after that.
- **Help keeps the count text of other Bifröst apps.** The help for operations of other Bifröst apps that cannot be undone keeps the app's own description of the confirmation count in English and Icelandic.
- **License administrators can open Setup.** The License Admin role includes the permission needed to read the current user when a company opens, and the app information that Setup reads can be used without extra grants, so the Setup, License FactBox and licensing actions open for users with only that role.
- **Reading the environment under restricted roles.** The tool that tells who you are and which environment you are in works for the Read and Full roles after the stricter exemption rule.
- **Approving sources without a caller.** A session source can still be approved without a caller name. The caller already recorded on a pending or approved source is kept and checked, so a disabled or revoked caller is refused as before.
- **Callers are easier to reach.** **Callers** is in the Bifrost Setup navigation, and a new manual session source keeps its allowed caller so the approval page shows it.
- **Uploaded file details are safer.** The content type and file name stored with an upload are normalized, and an app that reads them can opt into an allow-list and a cleaned display name. The language of a session is restored after a failed operation.
- **Group safeguards.** A stale page can no longer delete the default group, group changes log the right values, and the Field Access Overview shows translated **All tables** and **All fields** for wildcard rules.
- **Faster refresh of the prompt source.** The effective prompt source updates immediately after a group or prompt edit.
- **Reviewed Icelandic texts.** The Icelandic texts added or changed since 28.0.12, including those for Dashboards, Groups, Setup Mode, Callers and the setup wizard, have been reviewed and corrected.
- **A vendor that deregistered is no longer a vendor.** After a deregistration the vendor role is gone, vendor-only operations are refused, and a second deregistration is refused as not registered.
- **Vendor usage for subscription customers.** A partner or vendor reading the usage of an open subscription customer sees the customer's own usage and total, whatever the caller's own license state is.
- **A completed answer is kept.** When an operation has already made its changes and a later step fails, such as storing the answer or the usage count, the success answer is kept and the failure is added as a warning that says not to repeat the call. A stale message record no longer replaces a completed answer with a record-change error.
- **Journal posting answers.** Posting a general journal returns its register and entry range also when the posting changes the message itself. A successful journal check that is not ready no longer carries a top-level error code, and an empty bank reconciliation is refused with a clear message before any confirmation is offered.
- **Clearer refusals for ids and keys.** A posted-document PDF or send request with an id that is not a valid identifier is answered as an invalid format and names the key, instead of as not found, and a plain id is accepted. Restoring a changed field with an unknown entry number answers not found with guidance. A next line number request for a journal batch or document without lines answers with the key you sent, ready to paste into a write, and a too long key value is refused with the parameter named.
- **Deleted records with dimensions.** Reading deleted records whose stored snapshot holds dimensions now returns them instead of an error.

## 28.0.12 — 9 November 2026

This version also includes the changes made since 28.0.10.

### Added
- **Find Apps.** Bifrost Setup now opens a read-only list of Bifröst apps. It shows the apps that are installed, which version each one has, and whether an update is available, with safe links to each app's page and release notes. If the list cannot be refreshed, it falls back to showing only the installed apps. Users with read-only or full access can see it.
- **Confirmation for irreversible operations is on by default.** For new and upgraded companies, operations that cannot be undone, such as posting, applying entries, reversing and adjusting exchange rates, now first show a preview and need the caller to send back the number of records the preview reported. Administrators can turn this off per company in Bifrost Setup. A count that is sent is always checked. Previews that do not post anything, such as an exchange rate adjustment that is not posted, run without the count. Converting a purchase quote to an order follows the same rule as converting a sales quote. If you have an integration that posts through Bifröst, preview first and send the count, or ask an administrator to turn the setting off.
- **Initial monthly quota for new users.** Administrators can set a default monthly message quota in Bifrost Setup. New users get it automatically. Existing users and quotas that were set explicitly do not change, and zero still means unlimited.
- **The assistant knows the date and time.** Bifröst now gives the assistant the current date, time, weekday and your work date at the start of a conversation, so relative periods such as "last month" are read correctly. Other Bifröst apps can reuse the same information.
- **Version information in Help.** The help for who you are and for Bifröst itself now lists the installed Bifröst apps with their versions and how each one was published.
- **Usage by environment.** Subscription usage, partner billing summaries and license usage can be limited to one environment type and name, such as Production or Sandbox. Without a filter, billing is unchanged, and Production includes older documents that have no environment recorded.
- **Temporary storage for uploaded files.** Bifröst apps can now hold an uploaded file for the company until another Bifröst app picks it up. Only the user who uploaded a file can read or collect it. Files are removed after one week by default, and a retention policy that an administrator has set or deleted is respected.
- **Partners can rename pending customers.** A partner with the License Admin role can change or clear the friendly name of a customer whose invitation is still open, from Customer Management.
- **A shared JSON helper for other Bifröst apps.** Foundation now offers other Bifröst apps a documented way to convert records to and from JSON.

### Changed
- **Update notices reach every Bifröst user.** The notice that an installed app has a newer version on AppSource now appears every session for all users, not only for administrators, regardless of earlier notification settings. One action, **Show new versions**, opens the list of updates, with links to the release notes and to the app's AppSource listing, or to an AppSource search when no listing link is known.
- **Retention policies are set up from Bifrost Setup.** Installing or upgrading no longer creates retention policies, which avoided failed upgrades for users without the license rights. Opening Retention Policies from Bifrost Setup creates the missing defaults once: one week for staged uploads and one month for the request log. Policies that administrators changed or deleted are kept as they are.
- **Company quota stays read-only for license administrators.** Only the Full role or SUPER can change the company's monthly quota, even when the card is in edit mode.
- **Help texts stay in English.** Help chapters are English at every language, including the text that Foundation adds to other apps. Catalogue descriptions, keywords and the error and refusal texts you see at run time are still translated.
- **Clearer help.** The help for creating sales documents now shows the order of the steps and how to recover if a step fails. The help for the Response Data page explains that **Download File** gives the exact stored response. Help no longer mentions internal implementation names or object numbers. Several operations give clearer answers: e-mail profiles that prompt before sending are refused with an explanation, and budget copy, field history, fixed asset posting, purchase approval and missing delete setup now say what to do next. Approval delegation to yourself is refused, and the examples for the CSV and Memory tools are corrected.
- **Write operations report when a retry is safe.** Operations that change data now state that a call that failed because of a lock can be retried, and recognized English and Icelandic lock errors are answered with the existing translated retry message.
- **Exchange rate adjustment counts every account type.** The confirmation count includes customer, vendor, bank, employee and G/L accounts that are enabled for the adjustment, with a summary per type, and G/L accounts do not depend on the currency code. Bank accounts are selected as Business Central does, by the currency on the bank card, including accounts with no entries.

### Fixed
- **Test operations are checked like any other.** An operation used only for testing and that declares its parameters now refuses an unknown parameter, like every other operation. Operations that declare no parameters are unaffected.
- **License administrators can open Setup.** Users who have only the License Admin role can open the read-only Setup card, the quota and the licensing connection check without extra permission sets.
- **Tool calls work for restricted roles.** Calls made as the API, Read or Full role together with the Chat role, including who-am-I and request debug logging, succeed, and who-am-I works even when the user cannot read the company list.
- **Posting and journal confirmation is more reliable.** The recount of records now happens inside the same protected transaction as the posting, for general, item, fixed asset and project journals, customer and vendor applications and unapplications, bank reconciliation, reversals and approvals, so a count that changed in the meantime is refused with a clear answer. Journal posting still returns the register numbers. Malformed request data no longer causes a runtime error in the confirmation check; the operation answers with its own refusal.
- **Writing records with several key fields.** Key fields are now set and checked in the order of the table's key, so conditional relations such as Service Item Line Orders work.
- **Uploaded files are claimed safely.** Two users cannot claim the same uploaded file at the same time. Files uploaded by someone else behave as if they did not exist, also for SUPER.
- **Complete Icelandic texts** for the new customer name dialog and for the environment filter in usage reports.

## 28.0.10 — 28 October 2026

### Changed
- **Unknown parameters are refused before anything runs.** When a request that writes data or performs an action contains a parameter name the operation does not know, Bifröst now refuses the whole request with an unknown parameter error and executes nothing. Before, the extra parameter could be ignored. Requests that only read data still go ahead and return a warning about the unknown parameter. Incoming webhooks are not affected: they keep passing everything they receive on unchanged, and the receiving app checks the content. If you have an integration that writes through Bifröst, make sure it sends only the parameters the operation's help describes before you update.

### Fixed
- **Subscription tenants no longer need a trial.** On a Business Central SaaS environment with a Subscription license, calls were refused with a message saying that the Bifröst trial had not been started, although a trial does not apply to Subscription. Calls now continue to the monthly user and company quota checks. Prepaid and on-premises environments still need an active trial or purchased calls, as before. The setup wizard also explains that Subscription needs no trial, and it no longer offers a trial or shows a trial activation status for it.
- **Help works for users whose permissions come from another Bifröst app.** Users who received their Bifröst permissions only through another Bifröst app could be refused when they opened help chapters. They can now read help again. Nothing else in the permission sets changes.
- **Complete Icelandic texts.** The texts of webhook errors and of change log write-guard refusals now have Icelandic translations, so these messages no longer appear in English in an Icelandic client.
## 28.0.9 — 27 October 2026

### Added
- **Update notices for administrators.** Administrators now see a notice in Bifrost Setup and on the role center when an installed Bifröst app has a newer version on Microsoft AppSource. The notice links to the release notes and to manual update guidance, and a details page lists every app that has an update. Each administrator can turn the notice off under My Notifications. Bifröst only informs you; it does not install or update anything. On-premises environments and failed checks stay silent.
- **See how a call arrived.** The Bifrost Messages page has a read-only **Invocation Source** column that shows whether a call came through the queue, through the task endpoint, from a call made inside Bifröst, or directly, such as the **Run Task** action. Foundation sets the value itself, so a request cannot change it. Other Bifröst apps can use it to allow an operation only on the queue.

### Changed
- **Source approval and posting previews are classified correctly.** Approving a session source, and the posting previews for sales, purchases, general journals, item journals, fixed asset journals and project journals, are now reported as both reading and changing. Clients that go by this classification treat source approval as a write and the six previews as previews. What the operations do is unchanged, and the help for each operation still says whether data changes.

### Fixed
- **Media values are checked before anything is written.** When you write records with picture or media values, every base64 value and object shape in the call is checked first. A call with an unreadable value is refused as a whole and nothing is saved. Single media values that are valid are now imported instead of being silently dropped.
- **Field errors name the row and the field.** When a value is refused while writing records, the answer names the row and field, the expected value and a translated next step, and the call is still rolled back as a whole. An error raised by a record's own validation names only the record.
- **Journal checks name the right line.** A journal check names the line that has the problem, or the batch when no line applies, and no longer points at a blank line by mistake. A refusal raised by Business Central during a resource journal check is kept as a finding with the same recovery guidance, and refused general journal postings carry that guidance too.
- **Budget comparison help matches how requests are read.** The help now states the order in which a budget comparison request is read, followed by the range and filter syntax, budget lookup, account selection and dimensions. For example, an invalid income or balance choice is reported before an invalid date.

## 28.0.8 — 21 October 2026

### Added
- **Recovery guidance for unexpected errors.** When a Bifröst app meets an unexpected Business Central error, it can now add a translated explanation of what was expected and what to do next. The guidance survives the rollback of the failed operation, so the assistant or system that made the call can act on it.
- **Budget comparison by statement type.** Comparing a budget with actual figures can be limited to the income statement or the balance sheet, next to the existing account and dimension filters. Leaving the choice out keeps both, as before.

### Fixed
- **Journal checks match posting.** Checking a general journal now reports, per line and field, every purchase document problem that posting would refuse, such as a missing mandatory External Document No. or a duplicate document. A journal is reported as ready only after a posting preview that is rolled back.
- **Posting previews keep Business Central's own errors.** All posting previews keep the errors Business Central logs during the preview. One error is answered as a Business Central error, and several errors are answered together with each message, its record and field, and the document or journal line. The help keeps request validation and logged refusals apart.
- **Journal preview refusals name the right line.** Item and general journal previews name a line only when it exists and is not blank. Otherwise they name the batch and give translated recovery guidance.
- **Clearer value errors when writing records.** Invalid values, including malformed base64 data for a BLOB field, are found before anything is written. The answer names the field, the expected format and a translated next step.
- **Better suggestions for misspelled parameters.** The suggestion for an unknown request key now prefers the closest declared key and keeps the declared spelling.
- **Budget comparison reports every problem at once.** Independent problems in a request are reported together, in a fixed order, instead of one at a time.
- **Approving a session source with restricted permission sets.** Approving works for users with restricted permission sets. API integrations keep their existing access.
- **User Setup Editor shows whose setup it is.** The user name and full name appear in the page caption and in the first field, with a fallback for deleted users. The User Setup action in the chat FactBox opens the current user's own setup.
- **Old help text removed.** The English help for creating and updating journal lines no longer shows an outdated sentence.

## 28.0.7 — 19 October 2026

### Added
- **Deleting journal lines and renumbering.** General, item and project journals can now delete selected lines, or whole documents, within one existing batch. Afterwards Business Central's own document renumbering can be run. Everything happens in one rollback boundary, and the answer shows the surviving lines with their document numbers.
- **Help for calculated totals on master records.** The help now explains how to read calculated totals (FlowFields) on G/L accounts, customers, vendors, bank accounts, items, resources, projects, employees and fixed asset depreciation books, including the filters that apply, when to use which approach and what to watch for.

### Changed
- **Journal help explains replacing a line.** Replacing a journal line is done by deleting it and creating it again. The help says so, warns that renumbering can give documents the same number, and shows the surviving lines in its combined example.

### Fixed
- **Production companies always need approval of the Terms of Use.** An evaluation company in a production environment needs Terms of Use approval, trial activation and Foundation HTTP like any other company. Outside production nothing changes.
- **Sandboxes and evaluation companies process local operations without a trial.** Evaluation companies and all sandboxes, including on-premises development environments, no longer need trial activation or Foundation HTTP to process operations. Ordinary companies keep their checks.
- **Budget refusals are clearer.** Refusals keep the first error per field, repeat the submitted value, suggest ISO dates, and name the right line in single-entry requests. Partial budget updates keep the fields that were left out.
- **Renumbering without a number series is refused up front.** A request to renumber a journal whose batch has no number series is refused before anything is deleted, and the refusal names the batch.
- **Field Access restrictions apply when deleting journal lines.** Table and field restrictions you have set are honored before a line is deleted or renumbered.
- **Permission refusals name the table.** When a table permission is missing, the refusal now identifies the table directly.

## 28.0.6 — 18 October 2026

### Added
- **Budget export and import.** Budget entries can be exported in filtered pages and imported into a target budget. An import is atomic, reports errors per row, creates new identities, checks dimension compatibility, and can carry an optional closing date marker so dates are preserved exactly.
- **Field Sensitivity for a whole table.** A Field Sensitivity row with Field No. 0 applies to every field in that table. A row for a single field can only raise the class, never lower it. The Field Sensitivities page shows such rows as **(All fields)**, and the Field Access overview shows them too.

### Changed
- **CSV exports continue from the last record.** CSV exports of records and of deleted records continue from the last record returned, not with skip and take paging. The deleted-records export resumes at the next visible Delete Log entry and keeps its table and date filters. Skip and take now give the standard warning for unknown parameters.
- **One policy for evaluation companies.** The dispatcher, the setup wizard and the license panel use the same Terms of Use policy for evaluation companies.

### Fixed
- **Deleted-records refusals repeat what you sent.** When the Store Record setting is off, the refusal repeats the table exactly as you sent it, in English and in Icelandic, instead of the translated caption.
- **Malformed paging values in budget names.** A malformed value for the number of rows to return now gives one clear format error instead of a range error.
- **No misleading suggestion for a document number.** When a request for sales or purchase document statistics names a document number under the wrong key, the next step no longer suggests the document type.

## 28.0.5 — 17 October 2026

### Added
- **Budget operations.** Foundation can read and write G/L budget entries, with atomic batches, automatic entry numbers and dimensions. It can manage budget names, including descriptions, blocking and the four budget dimensions, and it can copy a budget from another budget or from G/L entries with a date formula, a factor and rounding. Generic writes to the budget tables are refused with a pointer to these operations.
- **Budget compared with actual.** A budget can be compared with actual net change per posting G/L account and period, with global and budget dimension filters, stable refusals and paging.
- **Flexible table names.** When a table name does not match exactly, Foundation tries a normalized name (case, spaces, dots and punctuation ignored), the caption in your session language, the English caption and a set of common aliases. An exact name always wins, and an ambiguous name is refused with the candidates.

### Changed
- **Posting requires approval first.** Posting a sales or purchase document that needs workflow approval is refused with a clear explanation, even before an approval request exists. The refusal names the document and the next steps.
- **No trial gate in SaaS sandboxes.** A company in a SaaS sandbox no longer needs the Bifröst trial after the setup wizard. This fixes the refusal "Bifrost trial has not been started" and works after upgrading without any action. The Terms of Use check is unchanged.
- **The license panel shows when the trial has not started.** The panel shows **Trial not started** instead of a valid license when the trial still applies. The **Activate trial** action opens the setup wizard at the trial step.
- **Setup wizard shows the connection details everywhere.** Steps 5 and 6 show the connection address and the authorization link in every environment, including environments installed for testing.
- **Paging keys on customer sales history.** Reading a customer's sales history still returns the full list. Skip and take give a low-severity warning, and a strict request refuses them.

### Fixed
- **Primary-key fields in a write request.** When a write request includes primary-key fields, they are ignored with a low-severity warning and the update still succeeds. The refusal hint mentions the force option only when it was requested and the user holds the force permission.
- **Values that look like secrets are not echoed.** If a refused request contains a value that looks like a secret, the refusal names the key and shows the value as redacted. The stored copy of the request is redacted too.
- **Metadata lookups for restricted users.** Table name resolution and table metadata readers work for users with restricted permission sets, without giving them access to customer data.
- **Icelandic wording.** Several refusal messages and operation descriptions were corrected to consistent Icelandic terms.

## 28.0.4 — 15 October 2026

### Changed
- **Posting always commits.** Posting, converting blanket orders and quotes into orders, and cancelling or correcting posted invoices always commit their result, and the help says so. Posting and conversion no longer depend on the caller's transaction.
- **Setup wizard explains quotas.** The wizard separates the sandbox default from the production monthly quota guidance, names the **Configure Rate Limit** action in any production environment of the same Microsoft Entra tenant, and shows the exact quota captions.
- **Only administrators open the setup wizard.** The wizard opens only for a Bifröst administrator. Others get a clear message and nothing is changed.
- **HTTP settings stay as you set them.** Foundation no longer changes **Allow HttpClient Requests** on its own. A new installation sets it only if it is missing, and an administrator's choice to turn it off is kept.
- **Narrower change log permissions.** The `BIFROST API ori` permission set no longer includes the broad **Changelog - Read** permission. The change log operations read what they need on their own.
- **Webhooks are forwarded as received.** Receiving a webhook now forwards the body and headers as JSON text of any shape, and accepts an empty subject. Checking the content and the sender is left to the app that subscribes.
- **Evaluation sandboxes.** An evaluation company in a SaaS sandbox does not need Terms of Use approval or an active trial to process operations.
- **Database lock errors can be retried.** A lock or deadlock timeout is answered with a new **Retryable** code and translated guidance, in English and in Icelandic.

### Fixed
- **Journal totals per currency.** Check, post and preview of general journals return totals per currency, and no total when currencies are mixed.
- **Checks sum Balance (LCY).** Checking a general journal sums Balance (LCY) for readiness, so lines with balancing accounts balance themselves.
- **Clearer refusals.** Approval, invoice e-mail, bank statement date and project VAT refusals now say what to do. Journal previews keep the source document numbers, report skipped and processed line counts, and list each duplicate item once.
- **Posting subscription items.** Posting a sales document that contains contract-only subscription items is refused with an explanation, because Business Central's subscription billing posts them.
- **Setting fields in the right order.** Writing sales lines and purchase lines applies the fields in dependency order, so a quantity and a price set before the item number keep their values.
- **Quota checks for API callers.** The monthly quota per user is checked correctly for callers who hold only the API permission set.
- **Fewer extra permissions.** Standard Business Central actions that Foundation reacts to, such as approvals, notifications and incoming documents, work for ordinary users without extra Bifröst execute permissions.
- **More accurate help.** The help for generic data operations, the change log, purchase posting and exchange rate adjustment describes the real preconditions and the two-step validation.

## 28.0.3 — 7 October 2026

### Changed
- **Help for the memory operations.** The help recommends the array form for saving memory entries, keeps the other accepted forms, warns about parenthesized comparisons, and shows insert and update by id.

### Fixed
- **Delete logging and message protection for ordinary users.** The automatic checks that log deletions and protect unreported messages now work for ordinary Business Central users who hold no Bifröst execute permission. Deletion logging, protection and data permissions are unchanged.

## 28.0.2 — 7 October 2026

### Added
- **Licensing panel with monthly usage.** The license panel shows **This Month** and **Last Month**, headed by the charge types, with the usage the licensing service has received from your company. The quota groups appear only where a quota applies. The former **Usage** group is now **Status**, with unreported messages and the last time the company was synced.
- **More tables for guarded writes.** Users who hold the force permission can write to more Business Central tables through the guarded write path. Existing read restrictions are unchanged.
- **Warning when Business Central changes a value.** When a write request sets a field and Business Central later changes it during validation, the answer succeeds and warns, so you can compare the returned values.

### Changed
- **Licensing actions in one place.** Bifrost Setup lists all licensing actions in the **Licensing** group, ordered by role, with **Revoke EULA Approval** last.
- **Optional paging in help lists.** Help lists accept skip and take, with sensible defaults and a maximum. Help for reading and writing records says that field values are returned as strings and that decimals use a dot.
- **Consistent record identifiers.** Every operation that targets a record reads its identifier from the same set of keys, and a strict request refuses unknown keys before anything runs.

### Fixed
- **Sync in a sandbox.** **Sync** on Bifrost Setup no longer fails in a SaaS sandbox with "The licensing connection material is not valid". Sync stays available there and verifies the setup and reports sandbox usage.
- **Open approval requests are respected.** Posting, releasing or reopening a sales or purchase document that has an open approval request is refused with an explanation, as in Business Central. Sending a document for approval lists every problem at once, and reading the approval log for one document returns only that document's rows.
- **Sent fields are validated in order.** Writing records validates the fields in the order you send them, as Business Central does. Changing the quantity or amount on a released or pending approval sales or purchase line is refused, and the refusal names the document status.
- **Notes stay in the current company.** Reading and writing notes no longer reaches notes of another company. The generic data operations refuse the Record Link table and point to the dedicated note operations.
- **Setting a default incoming document.** Choosing the default attachment of an incoming document no longer loses attachments if something fails halfway.
- **Cancelling an invoice keeps the reason.** When cancelling or correcting an invoice fails, the answer keeps every reason Business Central gave.
- **CSV export of deleted records.** Company-scoped exports of deleted records always include the company column, and the help explains technical and display names and empty results.
- **Project credit memo help.** The help shows positive credit memo amounts and describes which planning lines are eligible.

## 28.0.0 — 4 October 2026

### First version on Microsoft AppSource
- **Your Business Central, available to the AI you already use.** Foundation lets AI assistants and other systems answer from live data, carry out tasks and run routines in Business Central, as the signed-in user and within that user's permissions.
- **Operations that do the work.** Each operation is a complete Business Central task built on Business Central's own logic: sales and purchase documents from the first line to posting, payments applied to customer and vendor entries, journals, bank reconciliation, financial reports, projects, approvals and more.
- **Operations explain themselves.** Each operation tells the assistant what it is for, what it needs, what it changes and what can go wrong. The installed operations are listed by the MCP tools and by the help operations `Help.MessageTypes.Get` and `Help.Implementation.Get`.
- **Control made for agents.** Posting gates, fields hidden from agents, the change log guard, monthly quotas, and one log of every call in your own company.
- **One setup for the whole family.** The setup page and setup wizard, the secret store, permission sets, licensing, the message log and the help work the same way for every Bifröst app.
- **Any assistant and any connection.** Use your own assistant, integrations and automation, online and on-premises. Foundation needs Business Central 28.0 or later.
