---
id: iceland-umsja-registry
title: "National Registry Entries"
sidebar_position: 3
---

**National Registry Entries** lists the local copy of the Icelandic national registry (Þjóðskrá) that
Bifrost Iceland keeps in Business Central. It is for the administrator or accountant who needs to see what
has been loaded from Umsjá, or to clear it before a new load.

Open it with **National Registry Entries** on [Bifrost Iceland Setup](/help/iceland/iceland-setup/), or
search for it. The copy is **shared by every company in the environment**, so each company sees the same
entries. The list is filled by loading the registry from Umsjá, which needs the Umsjá license and
credentials from [Bifrost Iceland Setup](/help/iceland/iceland-setup/) and the permission set
`BIFROST NatReg ori`.

A full load downloads a very large file and takes several minutes, so it is started through the Bifröst
queue rather than as a direct call. Monthly changes are loaded the same way.

Each line is a person or a company, so the list holds **personal data**. Give access to the page only to
those who need it.

## Fields

| Field | Description |
| --- | --- |
| **Social ID** | The 10-digit kennitala. |
| **Record Type** | Whether the line is a person or a company. |
| **Name** | The full name of the person or the company. |
| **Old Social ID** | The previous kennitala, if it has changed. |
| **Family ID** | The identifier of the family group. |
| **Community** | The community (sveitarfélag) code. |
| **Street** | The street code. |
| **House** | The house number code. |
| **Address** | The address text. |
| **Post Code** | The postal code. |
| **Born Date** | The date of birth. |
| **Gender** | The registered gender. |
| **Marital Status** | The marital status. |
| **Spouse** | The kennitala of the spouse, if married. |
| **State Ship** | The citizenship (ríkisfang) code. |
| **Born Place** | The birthplace code. |
| **Address Changed** | The date the address last changed. |
| **Registred** | The registration date. |
| **Last Known Community**, **Last Known Street**, **Last Known House** | The last known community, street and house codes. |
| **Agent** | The kennitala of the agent. |
| **Address Nt** | The address note. |
| **Fade** | The fade (útfall) code, for a record that has faded out of the registry. The reason is listed on the fade reasons page. |
| **Fade Date** | The date of the fade. |
| **Prohibet** | Whether access to the record is prohibited. |

## Actions

| Action | Description |
| --- | --- |
| **Delete All** | After you confirm, deletes all entries **for every company** in the environment. Use it before a full load when the whole copy should be replaced. |

## Good to know

- **Delete All** cannot be undone, and it empties the registry for every company, not only the one you
  are in. Load the registry again afterwards.
- The list of fade reasons (**Umsja Fade Reasons**), which explains the **Fade** codes, shows a **Code** and a **Description** for each reason and uses this help page too.
- Entries are data from Umsjá. Treat them under the same rules as other personal data in Business
  Central, and see the [privacy statement](/licensing/privacy/).
