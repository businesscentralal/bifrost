---
id: clockify-set-secret-dialog
title: "Enter Clockify API Key"
sidebar_label: "Enter API Key"
sidebar_position: 6
---

**Enter Clockify API Key** is the dialog that the **Set Company API Key** action on [Clockify Setup](/help/clockify/clockify-setup/) opens. It is the only place the Clockify API key is typed into Business Central.

The field is masked while you type, and the value is not echoed back afterwards. Once you confirm, the key goes straight into IsolatedStorage at company scope — it is never written to a table field, never included in a request log body and never shown again.

## Fields

| Field | Description |
| --- | --- |
| API Key | The Clockify API key to store. The value is masked while you type. |

## Where to get the key

In Clockify, open **Profile Settings** and go to the **API** section. Generate a key there and paste it here.

The key carries the permissions of the Clockify user who created it. Everything the connector does in Clockify — reading workspaces, writing projects, registering webhooks — happens as that user, so use an account with the access the integration actually needs.

## Replacing or removing the key

Run the action again to overwrite the stored key; there is no need to clear it first. To remove it altogether, use **Clear Company API Key** on [Clockify Setup](/help/clockify/clockify-setup/). With no key stored, every message type that calls Clockify answers with a handled error saying the key is missing, rather than failing outright.
