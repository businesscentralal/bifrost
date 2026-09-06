---
id: bifrost-field-accesses
title: "Bifrost Field Accesses"
sidebar_label: "Bifrost Field Accesses"
sidebar_position: 6
---

The **Bifrost Field Accesses** page allows administrators to define field-level access restrictions for individual users and Entra ID (AAD) applications. These restrictions control which fields can be read or written through the Bifrost API (`Data.Records.Get` and `Data.Records.Set` message types).

Restrictions are user-specific and field-specific, providing fine-grained data protection without modifying existing security roles or permissions. Only fields that have explicit restrictions are affected – all other fields continue to behave normally.

## Page Layout

### User Filter

At the top of the page is a **User Name** filter. Select the user or application whose restrictions you want to view or manage. The list below is then filtered to show only that user's restrictions. Use the lookup button (…) to browse available users and applications. When no user is selected, the restrictions list is read-only.

### Restrictions List

Displays every field restriction defined for the selected user. Each row identifies one restricted field on a specific table and defines what kind of access is blocked.

## Fields

| Field | Description |
| --- | --- |
| **User Name** | The name of the user or Entra ID application whose restrictions are being managed. Use the lookup to select a different user or application. |
| **Table No.** | The number of the Business Central table to which the restriction applies. Use the lookup to browse all available tables. |
| **Table Name** | The name of the table (read-only, populated automatically from Table No.). |
| **Field No.** | The number of the field within the table. Use the lookup to browse available fields for the selected table. |
| **Field Name** | The name of the field (read-only, populated automatically from Field No.). |
| **Restriction Type** | Specifies what kind of access is restricted:
-   **Both** – The field is excluded from read responses and cannot be modified. Most restrictive option.
-   **Read** – The field is excluded from `Data.Records.Get` responses but can still be modified via `Data.Records.Set`.
-   **Write** – The field appears in read responses but cannot be modified via `Data.Records.Set`.
-   **Bypass** – The field is excluded from restriction checks entirely. The ChangeLog Write Guard will allow writes to this field regardless of Change Log coverage. This entry does not block read or write access; it only affects the Write Guard evaluation.

 |

## Actions

| Action | Description |
| --- | --- |
| **Delete All for User** | Removes all field access restrictions for the currently selected user. A confirmation dialog is shown before proceeding. |
| **Delete All for Table** | Removes all field access restrictions that apply to the table of the currently selected line. A confirmation dialog is shown before proceeding. |

## How to Add a Restriction

1.  Select a user or application using the **User Name** lookup at the top of the page.
2.  Click **New** (or press F3) to add a new line in the restrictions list.
3.  Enter or look up a **Table No.** to identify the table containing the field.
4.  Enter or look up a **Field No.** to identify the specific field within that table.
5.  Select the appropriate **Restriction Type**: _Both_, _Read_, _Write_, or _Bypass_. Use _Bypass_ to allow the ChangeLog Write Guard to pass writes for this field even without Change Log coverage.
6.  The record is saved automatically when you move to the next line or close the page.

## Tips

-   The restrictions list is only editable when a user or application is selected in the **User Name** filter at the top.
-   A restriction is uniquely identified by the combination of User, Table No., and Field No. – duplicate entries are not allowed.
-   Restrictions take effect immediately for subsequent API calls; no restart is required.
-   These restrictions apply only to the Bifrost API and do not affect standard Business Central UI access or existing permission sets.
-   Fields without a restriction entry behave normally and are fully accessible through the API.
