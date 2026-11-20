---
id: bifrost-user-setup-list
title: "Bifrost User Setup"
---

The **Bifrost User Setup** page lists the Bifröst setup of each user: the group the user belongs to, where the
user's system prompt comes from, and what the user's messages are charged as. Open a line to change it in the
[User Setup Editor](/help/foundation/bifrost-user-setup-editor/). The
[User Setup Preview](/help/foundation/bifrost-user-setup-fact-box/) FactBox shows the selected user's system prompt,
Bifröst usage and linked records.

## Fields

| Field | Description |
| --- | --- |
| **User Security ID** | The unique security identifier of the Business Central user. |
| **User Name** / **Full User Name** | The user (read-only, derived from the User Security ID). |
| **Group Code** | The group of this user or application. Empty uses the default group. Only a user who may change groups can change it. |
| **Has Field Access Entry** | Read-only. Whether the user has Field Access lines of its own. Own lines replace all the field access rules of the group. |
| **Effective Prompt Source** | Read-only. Whether the system prompt comes from the user, from the user's group or from the default group. |
| **Charge Type** | Read-only. What this user's messages are charged as: **User**, **App Registration**, **Internal**, **Demo** or **Support**. Set when the user is set up and updated by **Sync** on Bifröst Setup and by the daily usage sync. A delegated partner user is **Support** on every license type; otherwise only **User** and **App Registration** are used on Trial. See [Charge types on Subscription](/licensing/license-types/#charge-types). |

## Tips

-   Non-administrator users see only their own record on this page.
-   The linked records (G/L account, employee, customer, vendor, resource, salesperson, contact, location) and the system prompt are set in the [User Setup Editor](/help/foundation/bifrost-user-setup-editor/). The user profile an assistant reads uses them.
-   When a link field is empty, the response falls back to standard Business Central resolution (for example Time Sheet Owner for Resource, User Setup for Salesperson).
