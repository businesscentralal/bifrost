---
id: usage-and-billing
title: "Usage and billing"
sidebar_position: 8
description: "Who invoices your tenant, how its usage is reported, and where you see it in Business Central."
---

## Who invoices you

| License type | Invoiced by | Based on |
|---|---|---|
| **Prepaid** | Origo | The message quota you buy, per pool. |
| **Subscription** | Your Bifröst **Partner** | The messages your tenant used in the month, per [charge type](./license-types.md#charge-types), plus a rate-limit tier above Free if you chose one - at the prices agreed with your Partner. |

## How usage is reported

Every company reports its chargeable messages to the licensing service once a day, per day and
charge type, in a background task started by the first chargeable call of the day. **Sync** on
Bifrost Setup reports all pending messages immediately (except those of the last five minutes).
Until a message is reported, it is counted as *unreported* in the License fact box. Usage from
sandbox environments is reported separately and is not billed.

Each report adds new usage entries; an entry is never changed afterwards. A day can therefore have
several entries of the same charge type - one per report - and its usage is the sum of their
quantities. A message is reported exactly once, even when a report is interrupted and retried.

Usage is reported a day or more after it was used when a company makes no call on the next day or
the report fails. Every usage entry therefore carries two dates: the **usage date** (the day the
messages were used) and the **reporting date** (the day the entry was reported).

## Where to see usage

| Page | What it shows |
|---|---|
| [License Usage](/help/foundation/license-usage/) | The usage entries of your own companies |
| [License fact box](/help/foundation/license-fact-box/) on Bifrost Setup | The license type, the remaining quota of each pool, the messages not yet reported and the last sync |

Both require licence administration permission (the `BIFROST LicAdm ori` permission set). An AI
assistant can read the same figures through Bifröst; the installed message types and their
contracts are read from Business Central itself: the MCP tools `list_message_types` and
`describe_message_type`, or the Bifrost Message Types page.
