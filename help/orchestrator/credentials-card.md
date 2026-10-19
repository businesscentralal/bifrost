---
id: credentials-card
title: "Client Credentials Card"
sidebar_label: "Client Credentials Card"
sidebar_position: 2
---

Use the **Client Credentials Card** to create and maintain one client credential pair: the OAuth 2.0
client ID and client secret that Bifrost Orchestrator uses when an orchestrator entry calls an external
service. Open it from [Client Credentials](/help/orchestrator/credentials-list/).

The two values are not fields on the card. They are kept in the Bifröst secret store, for this company
only, and are never shown again. The card shows only whether each value has been entered.

## General

| Field | Description |
| --- | --- |
| **Code** | The unique code of this credential pair. Mandatory. Orchestrator entries refer to it in **Client Credentials Code**. |
| **Description** | What the credential pair is used for. |

## Secrets

| Field | Description |
| --- | --- |
| **Client ID** | **Set** when the client ID has been entered, **Not set** when it has not. |
| **Client Secret** | **Set** when the client secret has been entered, **Not set** when it has not. |

## Actions

| Action | Description |
| --- | --- |
| **Set Client ID** | Opens the [Set Secret](/help/foundation/set-secret-dialog/) dialog, where you enter the client ID issued by the external service. Enter a **Code** first. |
| **Set Client Secret** | Opens the same dialog for the client secret. |
| **Clear Secrets** | Removes both stored values after you confirm. The card then shows **Not set** for both. |

## Good to know

- Renaming the record moves both stored values to the new code; deleting the record removes them.
- Both values are also listed, by status only, on [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/).
  **App Secrets** on [Bifrost Orchestrator Setup](/help/orchestrator/orchestrator-setup/) opens that
  list filtered to this app.
- Select the credential pair for an orchestrator entry in **Client Credentials Code** on the
  [Job Queue Orchestrator Entry Card](/help/orchestrator/scheduled-entry-card/).
