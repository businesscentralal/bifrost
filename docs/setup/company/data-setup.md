---
id: data-setup
sidebar_position: 4
slug: /data-setup
title: "Step 4: Set up your data"
sidebar_label: "4. Set up your data"
description: "Choose which fields agents should not get, go through the setup page, and set how long logs are kept."
---

# Step 4: Set up your data

**Who is needed:** The Business Central administrator, with whoever owns the data.

Each setting below takes a minute to change. What to weigh before you choose is in
[Documentation for administrators](/documentation/end-customers/administrators/).

## Restrict fields agents should not get

On **Bifrost Setup**, choose **Setup › Field Access**, then **New for User...** to add rows for a user or Entra
application. Which kind of row to choose, and what each does:
[Field Access](/documentation/end-customers/data-access/#field-access).

![Bifrost Field Access Overview](/img/guides/en-us/field-access-overview.png)

## Go through the setup page

Every field on **Bifrost Setup** is described in [Bifrost Setup](/help/foundation/bifrost-setup/).
Decide **ChangeLog Write Guard** deliberately, together with the change log (**Setup › Change Log Setup**): see
[The ChangeLog Write Guard](/documentation/end-customers/data-access/#the-changelog-write-guard).

![The General section of Bifrost Setup](/img/guides/en-us/setup-general.png)

## Set how long logs are kept

On **Bifrost Setup**, open **Setup › Retention Policies** and set a period for the Bifröst logs, starting
with **Bifrost Messages**. Before you choose:
[Logs and retention](/documentation/end-customers/administrators/#logs-and-retention).

![Retention Policies](/img/guides/en-us/retention-policies.png)

**Next:** [Step 5: Check it and invite your users](/setup/first-call/)
