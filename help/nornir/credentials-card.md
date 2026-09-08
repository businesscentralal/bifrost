---
id: credentials-card
title: "Client Credentials Card"
sidebar_label: "Client Credentials Card"
sidebar_position: 2
---

The **Client Credentials Card** is where one credential pair is created and maintained. The client identifier and the client secret are not fields on the card — they live in the Bifröst secret store, so they cannot be read back afterwards. The card shows only whether each value has been entered.

## Fields

| Field | Description |
| --- | --- |
| **Code** | The unique code of this credential pair. Mandatory. |
| **Description** | A description of what the credentials are used for. |
| **Client ID** | Read-only status: whether a client identifier has been stored. |
| **Client Secret** | Read-only status: whether a client secret has been stored. |

## Actions

| Action | Description |
| --- | --- |
| **Set Client ID** | Opens the shared masked dialog and stores the client identifier issued by the external service. |
| **Set Client Secret** | Stores the client secret issued by the external service. |
| **Clear Secrets** | Removes both stored values. The registrations stay, so the card keeps showing that values are expected. |

## Secrets

| Secret code | Scope |
| --- | --- |
| `CREDENTIAL-<Code>-CLIENT-ID` | Company |
| `CREDENTIAL-<Code>-CLIENT-SECRET` | Company |

`<Code>` is the record code uppercased. A code long enough to overflow is shortened deterministically, so two similar codes never share a secret. Deleting the record clears both values.

## Tips

-   Business Central keeps stored secrets separate per extension, so values from the published Origo Cloud Events orchestrator cannot be carried over. Enter them once.
-   Reference the credential pair from an orchestrator entry through the **Client Credentials Code** field on the [entry card](/help/nornir/scheduled-entry-card/).
