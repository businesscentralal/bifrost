---
id: bifrost-setup
title: "Bifrost Setup"
sidebar_label: "Setup"
sidebar_position: 22
---

The **Bifrost Setup** page is the central configuration point for the Bifrost extension. Use it to select which implementation strategy is used for each business feature, set the credit-limit tolerance percentage, and choose the default language for message processing.

## Fields

| Field | Description |
| --- | --- |
| **Customer Credit Limit Type** | Selects the implementation used when the `Customer.CreditLimit.Get` message type is processed. The default implementation uses standard Business Central credit-limit calculations. Partners can add alternative implementations by extending the enum. |
| **Credit Limit Tolerance %** | A percentage (0–100) that adds a buffer on top of the customer's credit limit. For example, with a 10 % tolerance and a credit limit of 10,000 LCY, the customer may use up to 11,000 LCY before being flagged as having exceeded the limit. This helps reduce manual intervention for borderline cases. |
| **Item Calc. Availability Type** | Selects how item availability is calculated for the `Item.Availability.Get` message type.
-   **Physical Inventory** – returns the on-hand inventory quantity from Item Ledger Entries. Fast and simple.
-   **Calculated Quantity** – returns projected available balance taking into account reserved quantities, gross requirements, scheduled and planned receipts.

 |
| **Item Price Calculation Type** | Selects how item prices are retrieved for the `Item.Price.Get` message type. The default implementation retrieves active sales-price-list lines, supports customer-specific and all-customer price lists, and includes VAT calculations. |
| **Default Language Code** | The language used when processing bifrost messages that return language-specific text (captions, descriptions, field labels). If a message does not include a `lcid` value, this language is used as the fallback. If the field is empty, English (1033) is used. |
| **ChangeLog Write Guard** | Controls which fields are allowed to be written by the `Data.Records.Set` message type based on Change Log coverage.

-   **Open** (default) – all fields are allowed; no Change Log check is performed.
-   **Blocked** – only fields covered for modification logging in Change Log Setup are permitted. Uncovered fields are rejected.
-   **Via force** – same as Blocked, but a caller may bypass the guard by passing `"force": true` in the request. Requires the `BIFROST Force ori` permission set. Without that permission the bypass is silently refused.

The guard is extensible via the `ChangeLog Write Guard Type` enum (65308) and the `ChangeLog Write Guard` interface. |
| **Export Company Name Type** | Selects which company name is written to the `$Company` column of `CSV.Records.Get` and `CSV.DeletedRecords.Get` exports.

-   **Company Name** (default) – uses the technical `Company.Name`. Stable across renames of the display name; recommended when downstream systems key on company identity.
-   **Company Display Name** – uses `Company."Display Name"`. Falls back to `Company.Name` when the display name is blank. Recommended when CSV output is read by humans or shown in reports.

Extensible via the `Company Name Type` enum (65601) and the `Company Name` interface — partners can register additional providers (for example, a localised legal name). |
| **Default Email Scenario** | The default `Email Scenario` used to resolve the sending email account when a request does not specify one explicitly. |

## Navigation Actions

| Action | Description |
| --- | --- |
| **Bifrost Messages** | Opens the list of all bifrost messages in the queue. |
| **Bifrost Integration** | Opens the [Bifrost Integration](/help/foundation/bifrost-integration/) log, where you can review integration events by source, table, and timestamp, and mark records as reversed. |
| **Bifrost Storage** | Opens the [Bifrost Storage](/help/foundation/bifrost-storage/) page, where you can view, import, and export stored blob content associated with bifrost. |
| **Field Access** | Opens the [Bifrost Field Accesses](/help/foundation/bifrost-field-accesses/) page, where you can define field-level read/write restrictions for users and Entra ID applications. |
| **Languages** | Opens the Windows Languages page so you can view available language codes. |
| **Bifrost Translations** | Opens the translations list for managing source/target text pairs used by external systems. |
| **Retention Policies** | Opens the Retention Policy Setup so you can configure automatic cleanup of old bifrost messages and integration records. |

## Tips

-   The setup record is created automatically when you open the page for the first time.
-   Changing the **Default Language Code** takes effect immediately for all subsequent message processing – no restart is required.
-   Common language codes: `ENU` (English), `ISL` (Icelandic), `DEU` (German), `FRA` (French).
