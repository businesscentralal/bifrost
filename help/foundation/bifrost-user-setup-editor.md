---
id: bifrost-user-setup-editor
title: "User Setup Editor"
sidebar_label: "User Setup Editor"
sidebar_position: 27
---

The **User Setup Editor** allows you to configure per-user settings for the Bifrost extension. This includes linking your user to specific business records, setting a monthly message quota and defining a custom system prompt.

## Monthly Quota

| Field | Description |
| --- | --- |
| **User Monthly Message Quota** | The most chargeable messages this user may use in a calendar month, on either license type. `0` means no limit. When it is reached, the user's calls are refused until the next month. Not enforced in a sandbox. Counts every charge type of the user's messages in the month - see [How the monthly quotas are counted](/foundation/licensing/license-types/#how-monthly-quotas-are-counted). |
| **Charge Type** | Read-only. What this user's messages are charged as: **User**, **App Registration**, and on Subscription **Internal**, **Demo** or **Support**. Set when the user is set up and updated by **Sync** on Bifröst Setup and by the daily usage sync. See [Charge types on Subscription](/foundation/licensing/license-types/#charge-types). |

## Session Source

| Field | Description |
| --- | --- |
| **Session Source Approval Type** | Whether message sources are accepted automatically or need approval for this user. |

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

A custom markdown text that provides additional instructions to the AI model in Bifrost Language Models (chat) conversations. Use this to tailor the AI's behavior, add company-specific context, or restrict responses to certain domains.

## See Also

-   [User Setup List](/help/foundation/bifrost-user-setup-list/) – View all user configurations
-   – Configure language models and skills
-   [Bifrost Setup](/help/foundation/bifrost-setup/) – Global extension settings
