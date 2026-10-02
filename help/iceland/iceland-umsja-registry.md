---
id: iceland-umsja-registry
title: "National Registry Entries"
sidebar_label: "National Registry Entries"
sidebar_position: 4
---

The **National Registry Entries** page shows the local copy of national registry data retrieved from Þjóðskrá Íslands through the Umsjá service. Open it from the [Bifrost Iceland Setup](/help/iceland/iceland-setup/) card.

## What the page shows

One row per person or entity, keyed by social ID (kennitala). Besides the name and record type, each row carries the registered address (community, street, house, post code), family ID, birth date and place, gender, marital status and spouse, citizenship, the last known address, agent, the fade flag with its date, and the registry prohibition flag. A previous kennitala is kept in **Old Social ID**.

## How the data gets there

The page is a cache, not a data-entry form. Every row is written when Bifröst queries Umsjá: a full
synchronisation of the register, the monthly update of changed entries, a check of a single kennitala,
or a search by kennitala, name or address.

**Delete All** clears the cache. It removes only the local copy; nothing is sent to Þjóðskrá. The next sync repopulates the page.

## Permissions and setup

Reading the page and running registry lookups is covered by **BIFROST Umsja ori**, which arrives with **BIFROST ISFull ori**; synchronising the register additionally requires the assignable **BIFROST NatReg ori**. Umsjá licence, user name and password must be configured first — see [Bifrost Iceland Setup](/help/iceland/iceland-setup/).

Registry data is personal data. Keep the permission sets narrow, and clear the cache when the company no longer has a lawful basis for holding it.
