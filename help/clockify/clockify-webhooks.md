---
id: clockify-webhooks
title: "Clockify Webhooks"
sidebar_label: "Webhooks"
sidebar_position: 4
---

The **Clockify Webhooks** page lists the webhooks the connector has registered in Clockify for this company. They are what makes the time-entry synchronisation real-time: when someone starts, changes or deletes an entry in Clockify, Clockify calls the receiver, and the receiver forwards the event into Business Central.

The page is read-only. Webhooks are created and removed with the **Register Webhooks** and **Remove Webhooks** actions on [Clockify Setup](/help/clockify/clockify-setup/), and the list is reached from the **Registered Webhooks** action on the same card.

## Fields

| Field | Description |
| --- | --- |
| Event | The Clockify event the webhook fires on. |
| Webhook Name | The name the connector gave the webhook in Clockify. |
| Webhook Id | The identifier Clockify assigned to the webhook. |
| Workspace Id | The Clockify workspace the webhook belongs to. |
| Url | The receiver URL the webhook posts to. |
| Registered At | When the connector registered the webhook. |

## The three events

Registering creates one webhook per event:

| Clockify event | What it means for Business Central |
| --- | --- |
| `NEW_TIME_ENTRY` | An entry was created. It is synced once it is finished — a running entry has no duration to post. |
| `TIME_ENTRY_UPDATED` | An entry changed. The connector detects that it was already synced and posts a correction rather than a duplicate. |
| `TIME_ENTRY_DELETED` | An entry was removed in Clockify. |

The receiver URL carries the target company, and the connector appends the workspace to it when registering, so the receiver can tell which workspace an event came from.

## Signing tokens

Clockify generates a signing token for each webhook when it is created. The receiver uses those tokens to verify that a call really came from Clockify. They are shown once by **Register Webhooks**, and can be fetched again with **Show Signing Tokens** on [Clockify Setup](/help/clockify/clockify-setup/). They are not stored in Business Central and are not shown on this page.
