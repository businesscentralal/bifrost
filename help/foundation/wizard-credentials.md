---
id: wizard-credentials
title: "Credentials"
sidebar_label: "Wizard credentials"
sidebar_position: 61
---

The **Credentials** list, on the optional credentials step of the [Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/),
shows the credentials every installed Bifröst application needs, so you can enter the ones that are
still missing. The values themselves are never shown.

| Field | Description |
| --- | --- |
| **Application** | The application that needs the credential. |
| **Description** | What the application uses it for. |
| **Scope** | Whether the value is shared by the whole company or entered by each user. |
| **Is Set** | Whether a value has been stored. |

| Action | Description |
| --- | --- |
| **Set value...** | Enter the value in the [Set Secret](/help/foundation/set-secret-dialog/) dialog. |
| **Clear** | Removes the stored value; the application keeps showing the credential as missing. |

You can skip this step and enter the values later from **Secrets** on Bifröst Setup - see
[Bifrost App Secrets](/help/foundation/bifrost-app-secrets/).
