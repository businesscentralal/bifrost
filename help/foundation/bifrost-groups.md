---
id: bifrost-groups
title: "Bifrost Groups"
---

Use **Bifrost Groups** to give users and application accounts shared field-access rules, disabled operations and system instructions. A group is a set of Bifröst settings for its members. Administrators manage groups; each member can belong to one group.

## Open groups

1. Open **Bifrost Setup**.
2. Choose **Groups** in the **Setup** actions.
3. Open a group to see its **Bifrost Group** card. The **Group Field Access** and **Disabled Message Types** lists are on the card.

You need permission to administer Bifröst groups. If the page refuses access, ask your Bifröst administrator to make the change.

## Create a group

1. On **Bifrost Groups**, choose **New**.
2. Enter a unique **Code** and a descriptive **Name**.
3. Set up field access, disabled operations and any shared **System Prompt** on the card.

| Field | Use |
| --- | --- |
| **Code** | Identifies the group. To use another code, create another group and move its members. |
| **Name** | Describes who the group is for. |
| **Default** | Selects the fallback group. Selecting another group clears this setting on the previous default. |
| **System Prompt** | Shared instructions for the assistant. A member's own instructions take precedence; when those are blank, the assigned group's instructions are used, followed by the default group's instructions. |

## Assign members

1. Return to **Bifrost Setup** and choose **User Setup**.
2. Open the user or application account's setup card.
3. Select the group's code in **Group Code**.

To move a member, select another group. Leave **Group Code** blank to use the default group. Membership is set on the account's setup card, not on the group card.

## Set field access

In **Group Field Access**, add a line for each scope you want to control:

1. Select **Table No.** and **Field No.** Use field `0` for every field in that table, or table `0` and field `0` for every table.
2. Select **Restriction Type**.

| Restriction type | Effect |
| --- | --- |
| **Read** | Restricts reading at the selected scope. |
| **Write** | Restricts writing at the selected scope. |
| **Both** | Restricts both reading and writing. |
| **None** | Removes the field-access restriction at this scope and can reopen default restrictions. Other checks still apply. |
| **Bypass** | Also bypasses the change-log write guard at this scope. It does not grant Business Central permissions or remove protected restrictions. |

A member with their own field-access entries uses those entries instead of group rules. Otherwise, default-group rules apply, with assigned-group rules replacing the scopes they cover. An assigned rule for a whole table replaces that table's default-group rules; an assigned rule for all tables replaces all default-group rules. Within the resulting rules, the most specific scope applies.

Review the member's own [field access](/help/foundation/bifrost-field-accesses/) if a group change has no effect. Group rules do not grant Business Central permissions.

## Disable or restore an operation

In **Disabled Message Types**, select an operation to make it unavailable to the group's members. To remove that group restriction, delete its line.

The list belongs to the assigned group, or to the default group when the member has no group. An assigned group's disabled list is not combined with the default group's list. Removing a line does not make an operation available if another requirement or permission still prevents it.

## Remove a group

1. Move its users and application accounts to another group, or clear their **Group Code** to use the default.
2. If it is the default group, select **Default** on another group first.
3. Delete the unused group from **Bifrost Groups**.

The group's field-access and disabled-operation lines are removed with it. You cannot delete a group while it has assigned members or is the default.

After changing a group, check the affected account on [Bifrost User Setup](/help/foundation/bifrost-user-setup-list/) and confirm that its assignment and individual settings are as intended.
