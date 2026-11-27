---
id: user-scenarios
title: "Service Management user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 5
description: "Follow service work from quote and allocation to posting, loaners and contract billing."
---

# Service Management user scenarios

These scenarios help a service coordinator or service administrator work through service tasks with an assistant or integration and review the result in Business Central. Complete the [prerequisites](./index.md#before-you-start) first. The examples describe the outcome to request; your assistant reads the available operations from your installed environment.

## Turn a quote into an allocated order

1. Select the service quote and ask your assistant to convert it into a service order. Review the new order in Business Central.
2. Ask for suggested resources for a service item line. The ranking uses skills, service zone and free hours in the period you give.
3. Ask the assistant to allocate the chosen resource, or a resource group, to the line. If the resource is outside the order's service zone, the request is refused unless you explicitly accept that.
4. Release the order when it is ready for work.

**Result:** a released service order with allocations. Suggestions change nothing; the conversion and allocation do.

## Post and bill service work

1. Ask the assistant to preview the posting of the order. Check the quantities, the posting option and the entries it would create. A preview changes nothing.
2. Confirm the posting option you want: ship, invoice, ship and invoice, or ship and consume. You need the posting permission.
3. For work billed later, ask for the shipments to be collected on one invoice, preview it, then post the invoice or a credit memo.
4. Review the posted documents on the standard service pages.

**Result:** posted service documents. A posting cannot be reversed by repeating the request. To correct posted shipment or consumption lines, ask for an undo; lines whose shipment created service items are refused.

## Lend a loaner

1. Select the open order line, posted shipment line or loaner number.
2. Ask the assistant to lend the loaner, then to receive it when the customer returns it.
3. Review the loaner and its loan history in Business Central.

**Result:** the loaner is lent and received through Business Central's own process, and the loan history is kept. Changing the loaner number directly is not the way to lend; use the lend request.

## Adjust prices from a price group

1. Select the service item line on an order or quote and ask the assistant to preview the price adjustment from its service price group.
2. Check the fixed, maximum or minimum price result. A preview changes nothing.
3. Apply the adjustment, or ask for a reset to return to the standard prices.

**Result:** the service lines carry the adjusted prices. Lines that are already invoiced are refused.

## Run service contract billing

1. Convert a contract quote into a contract, sign it, and lock it when its terms should no longer change. Unlock it to change them.
2. State which contracts to include and how many you expect. If the number does not match, nothing is created.
3. Ask for invoices, service orders or a credit memo. The documents are created unposted.
4. Review and post them through your usual process.

**Result:** unposted documents for the chosen contracts; the contract lines are kept. Check for existing documents before asking again.

For changes included in the app, see the [release notes](./release-notes.md).
