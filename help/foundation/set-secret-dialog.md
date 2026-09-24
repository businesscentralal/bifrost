---
id: set-secret-dialog
title: "Set Secret"
sidebar_label: "Set Secret"
sidebar_position: 63
---

The **Set Secret** dialog is where you enter the value of a secret for a Bifröst application. It
opens from [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/), from the wizard's
[credentials](/help/foundation/wizard-credentials/) step, or from an application's setup page.

| Field | Description |
| --- | --- |
| **Secret** / **Description** | The secret you are entering and what it is used for. |
| **Value** | The secret value. It is masked while you type. |
| **Confirm Value** | Shown for passwords: type the value again; both must match. |
| **Value (Base64)** | Shown for long values such as a base-64 encoded certificate. |

Choose **OK** to store the value. It goes to protected storage and is never shown again, never
written to a table and never sent in telemetry.
