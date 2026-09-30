---
id: data-setup
title: "Step 4: Set up your data"
sidebar_label: "4. Set up your data"
sidebar_position: 5
description: "Choose which fields agents should not get, go through the setup page, and set how long logs are kept."
---

# Step 4: Set up your data

**Who is needed:** The Business Central administrator, with whoever owns the data.

Each setting below takes a minute to change. What to weigh before you choose is in
[Documentation for administrators](/documentation/end-customers/administrators/).

## Restrict fields agents should not get

Search for **Field Access** with *Tell me*, or open it from **Bifrost Setup**. For a user or Entra application, add the table and
field and choose **Both**, **Read** or **Write**. Restrictions take effect immediately.
Details: [Bifrost Field Accesses](/help/foundation/bifrost-field-accesses/). Before you choose:
[Field Access](/documentation/end-customers/administrators/#field-access).

![Bifrost Field Accesses: here the whole Customer table is restricted for one user. Usually you restrict single fields.](/img/setup/field-access.png)

## Go through the setup page

Every field on **Bifrost Setup** is described in [Bifrost Setup](/help/foundation/bifrost-setup/).
Decide **ChangeLog Write Guard** and **Request Debug Mode** deliberately; see
[The setup page](/documentation/end-customers/administrators/#the-setup-page).

![The General section of Bifrost Setup, with ChangeLog Write Guard and Request Debug Mode](/img/setup/bifrost-setup-general.png)

## Set how long logs are kept

On **Bifrost Setup**, open **Retention Policies** and set a period for the Bifröst logs, starting
with **Bifrost Messages**. Before you choose:
[Logs and retention](/documentation/end-customers/administrators/#logs-and-retention).

**Next:** [Step 5: Make the first call](/setup/first-call/)
