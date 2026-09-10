---
id: timesheets-setup
title: "Timesheets Setup"
sidebar_label: "Timesheets Setup"
sidebar_position: 2
---

The **Timesheets Setup** card holds every setting of the Bifröst Timesheets connector. It is reached from the **Timesheets** action in the **Apps** group of the Bifröst **Setup** page, or by searching for *Timesheets Setup*. There is exactly one setup record per company.

Nothing about the Clockify integration is configured on Bifröst Foundation's own setup card — the connector keeps its settings here so it can be installed, configured and removed on its own.

## Fields

### General

| Field | Description |
| --- | --- |
| Clockify API Version | Which Clockify API implementation the connector uses. The default, Version 1, is fixed on the public Clockify v1 endpoint. |
| Default Workspace ID | The Clockify workspace used when a message request does not name one. Use the lookup to pick a workspace by name from the [workspace list](/help/timesheets/timesheets-workspace-lookup/). |
| Default Workspace | The name of the selected workspace, captured when it is picked. Read-only. |
| Company API Key Stored | Whether a company Clockify API key is stored. Every connector call authenticates with that key. Read-only — use the actions to set or clear it. |

### Job Journal

| Field | Description |
| --- | --- |
| Job Journal Template | The Job Journal template that synced Clockify time entries are written to, by both the sync message types and the real-time webhook handler. |
| Job Journal Batch | The Job Journal batch that synced time entries are written to. It must belong to the selected template. |
| Default Work Type | The Work Type put on a synced Job Journal line when the Clockify time entry has no tag linked to a Work Type. A linked Clockify tag takes precedence over this value; leaving it blank leaves the line's Work Type empty. |

### Webhooks

| Field | Description |
| --- | --- |
| Webhook Receiver URL | The URL of the receiver that forwards Clockify events into Business Central, including the target company. It has to be filled in before webhooks can be registered. |
| Webhooks Registered | Whether real-time time-entry webhooks are registered in Clockify. Read-only — use the actions to register or remove them. |

## Actions

| Action | Description |
| --- | --- |
| Set Company API Key | Prompts for the Clockify API key in a [masked dialog](/help/timesheets/timesheets-set-secret-dialog/) and stores it in IsolatedStorage at company scope. |
| Clear Company API Key | Removes the stored company Clockify API key after a confirmation. |
| Register Webhooks | Registers the real-time time-entry webhooks in Clockify against the receiver URL, and shows the signing tokens to configure on the receiver. |
| Remove Webhooks | Removes the registered Clockify time-entry webhooks. |
| Show Signing Tokens | Fetches the signing tokens of the registered webhooks from Clockify again, so they can be configured on the receiver. |
| Integration Links | Opens the [Clockify Integration](/help/timesheets/timesheets-integration-list/) list of links between Business Central records and Clockify objects. |
| Registered Webhooks | Opens the [Clockify Webhooks](/help/timesheets/timesheets-webhooks/) list of webhooks registered from this company. |

## Notes on the API key

The key is never written to a table field and never appears in the request log. It is stored in IsolatedStorage at company scope, so each company in the tenant has its own key. **Company API Key Stored** is read live from storage every time the card is refreshed, which is why it cannot be edited directly.

Create the key in Clockify under **Profile Settings → API**. The connector sends it as the `X-Api-Key` header on every call.

## Notes on webhooks

Registering webhooks needs three things in place first: a stored API key, a default workspace, and the receiver URL. The connector then creates three webhooks in Clockify — for a new time entry, an updated time entry and a deleted time entry — and reports the signing tokens Clockify generated for them. Configure those tokens on the receiver so it can verify that an incoming call really came from Clockify; the connector cannot fetch them again after registration without the **Show Signing Tokens** action.

If webhooks are already registered, register again only after removing them.
