---
id: bifrost-field-accesses
title: "Bifrost Field Access"
---

Field Access lets an administrator decide, per user or Microsoft Entra application, which tables and fields Bifröst may
read and change for them. It applies only to what Bifröst reads and writes; the Business Central client is not affected.
This help covers three pages: **Bifrost Field Access Overview**, **Bifrost Field Accesses** (the lines of one user) and
**Bifrost Field Sensitivities**. For the whole picture, with examples, see
[Control what agents read and change](/documentation/end-customers/data-access/).

## Bifrost Field Access Overview {#overview}

**Field Access** on [Bifrost Setup](/help/foundation/bifrost-setup/) opens this page: every Field Access line of every
user and application in the company, read-only. All columns can be sorted and filtered.

| Field | Description |
| --- | --- |
| **User Name** / **Full Name** | The user or application the line applies to. For an application, **Full Name** is its description. |
| **Source Type** | **User** or **AAD Application**. |
| **Table No.** / **Table Name** | The table. **0** means all tables. |
| **Field No.** / **Field Name** | The field. **0** means all fields of the table. |
| **Restriction Type** | See [Restriction types](#restriction-types). |

| Action | Description |
| --- | --- |
| **Edit** | Opens the lines of the user on the selected line, to change them. The overview is refreshed when you close it. |
| **New for User...** | Choose a user or application and open its lines, to add new ones. |

## Bifrost Field Accesses {#lines-of-one-user}

The lines of one user or application. The **User Name** at the top shows whose lines they are.

| Field | Description |
| --- | --- |
| **Table No.** / **Table Name** | The table. **0** means all tables. |
| **Field No.** / **Field Name** | The field. **0** means all fields of the table. |
| **Restriction Type** | See [Restriction types](#restriction-types). |

| Action | Description |
| --- | --- |
| **Apply Recommended Template...** | Choose one or more users or applications. Bifröst adds **Read** lines for the phone numbers, e-mail addresses, registration numbers and bank account fields of customers, vendors, contacts, sales documents and bank accounts. A line that already exists is never changed, and a user who has a line for a whole table or for all tables is left alone for that scope. Safe to run again. |
| **Delete All for User** | Deletes every line of the user, after a confirmation. |
| **Delete All for Table** | Deletes every line for the table of the selected line, after a confirmation. |

## Restriction types {#restriction-types}

| Restriction Type | Read | Change | ChangeLog Write Guard |
| --- | --- | --- | --- |
| **Both** | No | No | - |
| **Read** | No | Yes | Applies |
| **Write** | Yes | No | - |
| **None** | Yes | Yes | Applies |
| **Bypass** | Yes | Yes | Skipped for this user |

- **The most specific line decides.** A line for the field wins over a line for the table, which wins over a line for
  all tables. Only that one line is used, so a **None** line on a table opens it again under a **Write** line for all
  tables.
- **None** also opens, for that user, the fields Bifröst hides or closes by default (bank details, employee personal
  data, and fields hidden by **Respect Data Sensitivity**). **Bypass** opens the fields closed by default for changes.
  Neither opens what Bifröst always protects.
- A user with any **Read** or **Both** line gets no FlowField values through Bifröst, because Bifröst cannot see which
  fields a FlowField reads.
- Lines take effect immediately for the next request.

## Bifrost Field Sensitivities {#field-sensitivities}

**Field Sensitivities** on Bifrost Setup opens the company's own classification of fields. Each line marks a field
**Sensitive** or **Personal**. When **Respect Data Sensitivity** on Bifrost Setup is **Sensitive**, the Sensitive fields
are hidden from every user; with **Sensitive + Personal**, the Personal fields are hidden too. With **Off** (the default)
nothing is hidden. A **None** line on Bifrost Field Accesses opens a hidden field for one user.

| Field | Description |
| --- | --- |
| **Table No.** / **Table Name** | The table of the field. |
| **Field No.** / **Field Name** | The field. |
| **Sensitivity** | **Sensitive** or **Personal**. |

| Action | Description |
| --- | --- |
| **Apply Recommended Classification** | Adds the recommended Sensitive employee fields, and the phone, mobile phone, e-mail and registration number of customers, vendors and contacts as Personal. A field that already has a line keeps it. |

The list is changed on this page only, never through Bifröst itself.
