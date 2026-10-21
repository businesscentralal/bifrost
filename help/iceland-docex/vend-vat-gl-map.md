---
id: vend-vat-gl-map
title: "Vendor VAT G/L Account Map"
sidebar_label: "Vendor VAT G/L Account Map"
sidebar_position: 4
---

The **Vendor VAT G/L Account Map** decides which G/L account a line of a received e-invoice is posted to,
per vendor and per VAT percentage, so that each line lands on an account with the right VAT.

When a received document becomes a purchase invoice or journal lines, every line that is not an item gets
its G/L account here first: the entry for the vendor and the line's VAT %, or else the vendor's entry for
0 %. Only when the vendor has no matching entry does Business Central's **Text-to-Account Mapping** decide.

Open the page from the **VAT G/L Account Map** action on [Document Exchange Setup](/help/iceland-docex/docex-setup/),
or from the vendor card, the vendor list and the incoming documents, where it opens filtered to the vendor.

## Fields

| Field | Description |
| --- | --- |
| **Vendor No.** | The vendor the entry applies to. |
| **G/L Account No.** | The G/L account for lines with this VAT %. The account must have **Gen. Posting Type** Purchase and **Direct Posting** on, and must not be blocked. |
| **VAT %** | Read-only. Calculated from the vendor's **VAT Bus. Posting Group** and the G/L account's **VAT Prod. Posting Group**. |
| **Description** | An optional description. |

## Tips

- The VAT % follows from the account you choose, so add one entry per account: choosing another G/L
  account is what gives another VAT %.
- If a vendor sends lines at several VAT rates, add an entry for an account at each rate.
- For vendors without entries here, map lines by their text with Business Central's
  **Text-to-Account Mapping**. Choose an account whose VAT matches the line's VAT %, or Business Central
  refuses the document.
- Whether a vendor's documents become a purchase invoice or general journal lines is set in
  **Incoming Doc. Posting Mode** on the vendor card.

![The Invoicing FastTab of a vendor card, with Incoming Doc. Posting Mode set to Purchase Document](/img/iceland-docex/en-us/vendor-posting-mode.png)
