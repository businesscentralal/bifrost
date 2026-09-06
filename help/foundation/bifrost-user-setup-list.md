---
id: bifrost-user-setup-list
title: "Bifrost User Setup"
sidebar_label: "Bifrost User Setup"
sidebar_position: 29
---

The **Bifrost User Setup** page displays per-user configuration for the Bifrost extension. Each record stores a system prompt and optional linked-record overrides that control how AI-powered message types (such as `Help.WhoAmI.Get`) resolve user context.

## Fields

| Field | Description |
| --- | --- |
| **User Security ID** | The unique security identifier of the Business Central user. |
| **User Name** | The display name of the user (read-only, derived from the User Security ID). |
| **System Prompt** | Prompt text appended to AI context for this user. Managed through the `User Setup Mgt ori` codeunit or the User Setup Editor card. |
| **G/L Account No.** | Optional G/L account override used by `Help.WhoAmI.Get` for balance reporting. |
| **Employee No.** | Optional employee override for the user's identity context. |
| **Customer No.** | Optional customer override linked to this user. |
| **Vendor No.** | Optional vendor override linked to this user. |
| **Resource No.** | Optional resource override for the user's identity context. |
| **Salesperson Code** | Optional salesperson/purchaser override for the user's identity context. |
| **Contact No.** | Optional contact override linked to this user. |
| **Location Code** | Optional default location code for the user. |

## Tips

-   Non-administrator users see only their own record on this page.
-   The `Help.WhoAmI.Get` message type uses these fields to resolve linked records and the system prompt.
-   When a link field is empty, the response falls back to standard BC resolution (e.g. Time Sheet Owner for Resource, User Setup for Salesperson).
