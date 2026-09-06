---
id: credentials-card
title: "Client Credentials Card"
sidebar_label: "Client Credentials Card"
sidebar_position: 2
---

The **Client Credentials Card** is where one credential pair is created and maintained. The client identifier and the client secret are stored in isolated storage, not in a normal table field, so they cannot be read back afterwards.

Once a value has been saved the field shows `***`. Typing a new value replaces the stored secret; leaving `***` untouched keeps it.

## Fields

| Field | Description |
| --- | --- |
| **Code** | The unique code of this credential pair. Mandatory. |
| **Description** | A description of what the credentials are used for. |
| **Client ID** | The client identifier issued by the external service. Mandatory and masked. |
| **Client Secret** | The client secret issued by the external service. Mandatory and masked. |

## Tips

-   If you close the card before both the client ID and the client secret have been provided, you are asked to confirm that you want to leave the record incomplete.
-   Reference the credential pair from an orchestrator entry through the **Client Credentials Code** field on the [entry card](/help/nornir/scheduled-entry-card/).
