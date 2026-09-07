---
id: index
title: "Bifröst Foundation — Help"
sidebar_label: "Bifröst Foundation — Help"
sidebar_position: 1
slug: /
---

**Bifröst Foundation** is a Business Central extension by Origo that provides a bifrost messaging framework. External systems can send structured messages to Business Central through a REST API, and the extension processes them either synchronously (immediate response) or asynchronously (queued for background processing).

The extension supports a wide range of built-in message types for retrieving customer credit information, checking item availability and prices, working with sales documents, synchronising data, and discovering API metadata. It is fully extensible – partners can add new message types and implementation strategies without modifying the base code.

## Pages

| Page | Description |
| --- | --- |
| [Bifrost Setup](/help/foundation/bifrost-setup/) | Central configuration page for implementation strategies, credit-limit tolerance, and default language. |
| [Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/) | Assisted setup that walks through outbound HTTP, credentials, trial activation, the MCP server connection and Entra enterprise app authorization for every installed Bifröst application. |
| [Bifrost Messages](/help/foundation/bifrost-messages/) | List of all bifrost messages with their processing status, request/response data, and task actions. |
| [Bifrost Integration](/help/foundation/bifrost-integration/) | Operational log of bifrost integration activities, showing the source system, table, and timestamp for each event. Supports flagging records as reversed. |
| [Bifrost Storage](/help/foundation/bifrost-storage/) | View and manage stored blob content associated with bifrost. Supports file import and export. |
| [Bifrost Message Editor](/help/foundation/bifrost-message-editor/) | Inline editor for viewing and modifying the request payload of a bifrost message. |
| [Bifrost Request](/help/foundation/bifrost-request/) | FactBox that displays the incoming request data of the selected bifrost message. |
| [Bifrost Response](/help/foundation/bifrost-response/) | FactBox that displays the response data produced after a bifrost message has been processed. |
| [Bifrost Translations](/help/foundation/bifrost-translations/) | Manage translation entries used by external systems to retrieve translated text for messages. |
| [Bifrost Field Accesses](/help/foundation/bifrost-field-accesses/) | Define and manage field-level read/write restrictions for users and Entra ID applications accessing the Bifrost API. |
| [Select Field](/help/foundation/bifrost-field-lookup/) | Lookup page for browsing and selecting a table field when setting up field access restrictions. |
| [Select User or Application](/help/foundation/user-app-lookup/) | Lookup page for selecting a Business Central user or Entra ID application when managing field access restrictions. |
| [Select Translation Source](/help/foundation/translation-src-lookup/) | Lookup page for selecting a translation source to filter the Bifrost Translations list. |
| [Bifrost Delete Setup](/help/foundation/bifrost-delete-setup/) | Configure which tables have their deleted records captured to the delete log, with optional JSON snapshots. |
| [Bifrost Delete Log](/help/foundation/bifrost-delete-log/) | Read-only audit log of all deletions from tracked tables, including table, SystemId, timestamp, and user. |
| [Bifrost User Setup](/help/foundation/bifrost-user-setup-list/) | Per-user configuration including system prompts and linked-record overrides for AI-powered message types. |
| [User Setup Editor](/help/foundation/bifrost-user-setup-editor/) | Detailed editor for viewing and modifying a user's JSON configuration in the Bifrost system. |
| [User Setup Preview](/help/foundation/bifrost-user-setup-fact-box/) | FactBox showing a quick overview of the current user's Bifrost configuration. |
| [Caller Identity](/help/foundation/caller-identity/) | Displays the identity and authentication details of the current API caller or user session. |
| [Bifrost notes](/help/foundation/bifrost-notes/) | List of all notification and note records in the Bifrost system. |
| [Bifrost Note Card](/help/foundation/bifrost-note-card/) | Card page for viewing and editing a single bifrost notification or note. |
| [Note Thread](/help/foundation/bifrost-note-fact-box/) | FactBox showing the message thread associated with a bifrost notification. |
| [Note Message](/help/foundation/bifrost-note-message/) | Page for composing or viewing a single message within a bifrost notification thread. |
| [Bifrost Memory](/help/foundation/bifrost-memory/) | Company-level memory storage shared across all users in the Bifrost system. |
| [Bifrost User Memory](/help/foundation/bifrost-user-memory/) | Personal memory storage for the current user, not visible to other users. |

## API Pages

The following API pages are used programmatically by external integrations and are not opened directly by users:

| API Page | Endpoint | Description |
| --- | --- | --- |
| [Bifrost Request Data API](/help/foundation/bifrost-request-data-api/) | `/api/origo/bifrost/v1.0/requests` | Read-only endpoint that returns the original request payload for a processed message. Use the same message ID as tasks/queues. |
| [Bifrost Task API](/help/foundation/bifrost-task-api/) | `/api/origo/bifrost/v1.0/tasks` | Synchronous processing – creates and processes a message immediately, returning the result in one call. |
| [Bifrost Queue API](/help/foundation/bifrost-queue-api/) | `/api/origo/bifrost/v1.0/queues` | Asynchronous processing – queues a message for background processing; use _GetStatus_ to poll or subscribe to webhooks. |
| [Bifrost Response Data API](/help/foundation/bifrost-response-data-api/) | `/api/origo/bifrost/v1.0/responses` | Read-only endpoint that returns the response data content for a processed message. |

## Documentation

The full product documentation lives beside this help — it is written once and
shared by every locale.

| Document | Description |
| --- | --- |
| [Overview](/foundation/) | What Bifröst Foundation is, what it does and how it works. |
| [API reference](/foundation/reference/api/) | Endpoints, the CloudEvents envelope, authentication and response shapes. |
| [Setup reference](/foundation/reference/setup/) | The Bifröst Setup page, the implementation strategies and the extension points behind it. |
| [Field access restrictions](/foundation/reference/field-access-restrictions/) | Field-level read and write restrictions for `Data.Records.Get` and `Data.Records.Set`. |
| [Events and webhooks](/foundation/reference/events-and-webhooks/) | External business events, webhook notifications and integration events. |
| [Secrets](/foundation/reference/secrets/) | The shared secret store every Bifröst app registers its credentials with. |
| [Licensing](/foundation/reference/licensing/) | The message-quota licence model. |
| [Data message types](/foundation/message-types/data/) | `Data.Records.Get`, `Data.Records.Set`, `Data.RecordIds.Get`, `CSV.Records.Get` and `Data.Totals.Get`. |
| [Metadata and help message types](/foundation/message-types/metadata/) | The `Help.*` types — MessageTypes, Implementation, Tables, Fields, Permissions. |
| [Sales, customer and item message types](/foundation/message-types/sales/) | Credit limit, sales history, item availability and price, and the sales document lifecycle. |
| [Purchase message types](/foundation/message-types/purchase/) | The purchase order lifecycle — Release, Reopen, Statistics and Post. |
| [Finance message types](/foundation/message-types/finance/) | General journal posting, chart of accounts, G/L budget and G/L entry queries. |
| [Inventory message types](/foundation/message-types/inventory/) | Item ledger, stock and warehouse queries. |
| [Projects message types](/foundation/message-types/projects/) | Project journals and project ledger operations. |
| [Resources message types](/foundation/message-types/resources/) | Resource lookups and resource ledger operations. |
| [Approval message types](/foundation/message-types/approval/) | Sending documents for approval and acting on approval entries. |
| [Change log message types](/foundation/message-types/change-log/) | `ChangeLog.Field.History`, `ChangeLog.Field.Restore` and `ChangeLog.Field.Enabled`, including the write guard modes. |
| [Incoming document message types](/foundation/message-types/incoming-documents/) | Create, attach, process and retrieve incoming documents. |
| [Memory message types](/foundation/message-types/memory/) | Company and user memory storage. |
| [User and notification message types](/foundation/message-types/user/) | `User.Notification` and related types. |
| [Message type reference](/foundation/reference/message-types/) | The generated request and response contract for every single message type. |

Single-type help pages that Business Central links directly:
[CSV.Records.Get](/help/foundation/csv-records-get/),
[Data.Totals.Get](/help/foundation/data-totals-get/),
[Help.NextLineNo.Get](/help/foundation/help-next-line-no-get/),
[ChangeLog.Field.History](/help/foundation/change-log-field-history/),
[ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/),
[ChangeLog.Field.Enabled](/help/foundation/change-log-field-enabled/).

## Getting Started

1.  Open **Bifrost Setup** and configure the implementation types and default language.
2.  Send a test message via the Task API to verify connectivity.
3.  Use the **Bifrost Messages** list to monitor processing results.
