---
id: vend-vat-gl-map
title: "Vendor VAT G/L Account Map"
sidebar_label: "Vendor VAT G/L Account Map"
sidebar_position: 4
---

The **Vendor VAT G/L Account Map** page decides which G/L account an incoming document line is posted to, per vendor and per VAT percentage. It is used when a received electronic invoice is turned into a purchase document and the line carries no other account assignment.

Open the page from the **VAT G/L Account Map** action on [Bifröst DocEx Setup](/help/iceland-docex/docex-setup/).

## Fields

| Field | Description |
| --- | --- |
| Vendor No. | The vendor the mapping applies to. |
| G/L Account No. | The G/L account used for incoming document lines with the calculated VAT %. The account must have **Gen. Posting Type** = Purchase, **Direct Posting** = Yes, and must not be blocked. |
| VAT % | Read-only. Calculated from the vendor's VAT Bus. Posting Group and the G/L account's VAT Prod. Posting Group. |
| Description | An optional description of the mapping entry. |

## Tips

-   Because the VAT % is derived, add one line per account rather than per rate: choosing a different G/L account is what changes the resulting VAT %.
-   If a vendor sends lines at several VAT rates, create one mapping line for each account that carries one of those rates.
