---
id: bifrost-user-setup-editor
title: "User Setup Editor"
---

The **User Setup Editor** allows you to configure per-user settings for Bifröst. This includes the user's group, charge type and session source approval, a monthly message quota, linking your user to specific business records and defining a custom system prompt.

## General

| Field | Description |
| --- | --- |
| **User** | The user whose setup you are editing. |
| **Group Code** | The group of this user or application. Empty uses the default group. Only a user who may change groups can change it. |
| **Has Field Access Entry** | Read-only. Whether the user has Field Access lines of its own. Own lines replace all the field access rules of the group. |
| **Effective Prompt Source** | Read-only. Whether the system prompt comes from the user, from the user's group or from the default group. |
| **Charge Type** | Read-only. What this user's messages are charged as: **User**, **App Registration**, **Internal**, **Demo** or **Support**. Set when the user is set up and updated by **Sync** on Bifröst Setup and by the daily usage sync. A delegated partner user is **Support** on every license type; otherwise only **User** and **App Registration** are used on Trial. See [Charge types on Subscription](/licensing/license-types/#charge-types). |
| **Approval Type** | Whether message sources are accepted automatically or need approval for this user. When approval is required, a new source must be approved on [Approve Session Source](/help/foundation/session-source-approval/) before its messages are accepted. |
| **Language Model Code** | Shown when [Bifröst Language Models](/language-models/) is installed: the language model this user chats with in [Chat via Bifrost](/help/language-models/bifrost-chat/). When it is empty, the chat is not available to this user. |

## Monthly Quota

| Field | Description |
| --- | --- |
| **User Monthly Message Quota** | The most chargeable messages this user may use in a calendar month, on either license type. `0` means no limit. When it is reached, the user's calls are refused until the next month. Counts every charge type of the user's messages in the month - see [How the monthly quotas are counted](/licensing/license-types/#how-monthly-quotas-are-counted). |

## Linked Records

These fields link your user to specific business entities, enabling the system to identify your context automatically.

| Field | Description |
| --- | --- |
| **G/L Account No.** | The general ledger account associated with this user. |
| **Employee No.** | The employee record linked to this user. |
| **Customer No.** | The customer record linked to this user. |
| **Vendor No.** | The vendor record linked to this user. |
| **Resource No.** | The resource record linked to this user. |
| **Salesperson Code** | The salesperson/purchaser code linked to this user. |
| **Contact No.** | The contact record linked to this user. |
| **Location Code** | The default location (warehouse) for this user. |

## System Prompt

A custom markdown text that gives the AI additional instructions in chat conversations, when an app that provides a chat, such as [Bifröst Language Models](/language-models/), is installed and set up. Use this to tailor the AI's behavior, add company-specific context, or restrict responses to certain domains.

The [User Setup Preview](/help/foundation/bifrost-user-setup-fact-box/) FactBox shows this user's chargeable messages this month and last month, and the names of the linked records.

## See Also

-   [User Setup List](/help/foundation/bifrost-user-setup-list/) – View all user configurations
-   [Approve Session Source](/help/foundation/session-source-approval/) – Approve a message source for your user
-   [Monthly quotas](/licensing/license-types/#monthly-quotas) – Company and user monthly quotas
-   [Bifrost Setup](/help/foundation/bifrost-setup/) – Global extension settings
