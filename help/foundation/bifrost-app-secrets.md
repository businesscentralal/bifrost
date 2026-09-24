---
id: bifrost-app-secrets
title: "Bifrost App Secrets"
sidebar_label: "App Secrets"
sidebar_position: 62
---

**Bifrost App Secrets** lists the secrets - passwords, keys, tokens - that the installed Bifröst
applications need, and whether a value is stored. The value itself is never shown. Open it from
**Secrets** on the [Bifrost Setup](/help/foundation/bifrost-setup/) page for every application, or from
an application's own setup page for that application only.

| Field | Description |
| --- | --- |
| **App Name** | The application that needs the secret. |
| **Secret Code** | The code the application uses for the secret. |
| **Description** | What the application uses the secret for. |
| **Scope** | **Company** - one value for the whole company; **Company and User** - each user enters their own. |
| **Is Set** | Whether a value has been stored. |
| **Set On** / **Set By Name** | When and by whom the value was last entered. |

| Action | Description |
| --- | --- |
| **Set...** | Enter the value in the [Set Secret](/help/foundation/set-secret-dialog/) dialog. |
| **Clear** | Removes the stored value but keeps the secret registered, so the application still shows it as missing. |

Secret values are kept in protected storage, per company; they are never copied between companies.
A message type that needs a missing secret is disabled until the value is entered.
