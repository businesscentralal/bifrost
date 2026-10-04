---
id: changelog-guard-exceptions
title: "ChangeLog Guard Exceptions"
---

**ChangeLog Guard Exceptions** lists the tables and fields that Bifröst's general record write may write even when
the **ChangeLog Write Guard** on [Bifrost Setup](/help/foundation/bifrost-setup/) is **Blocked** or
**Via force** and the field is not covered by the change log.

| Field | Description |
| --- | --- |
| **Table No.** / **Table Name** | The table the exception applies to. |
| **Field No.** / **Field Name** | The field the exception applies to. Use **0** for every field of the table. |

Bifröst adds four exceptions when it is installed: **Applies-to ID** and **Amount to Apply** on customer and vendor
ledger entries, which applying payments needs. Add an exception only for a field every user may change without a
change-log trail. To let one user or application change a field without the change log, give that user a **Bypass**
line in [Field Access](/help/foundation/bifrost-field-accesses/) instead.

See [The ChangeLog Write Guard](/documentation/end-customers/data-access/#the-changelog-write-guard).
