---
id: changelog-guard-exceptions
title: "ChangeLog Guard Exceptions"
sidebar_label: "ChangeLog Guard Exceptions"
sidebar_position: 56
---

**ChangeLog Guard Exceptions** lists the tables and fields that `Data.Records.Set` may write even when
the **ChangeLog Write Guard** on [Bifrost Setup](/help/foundation/bifrost-setup/) is **Blocked** or
**Via force** and the field is not covered by the change log.

| Field | Description |
| --- | --- |
| **Table No.** / **Table Name** | The table the exception applies to. |
| **Field No.** / **Field Name** | The field the exception applies to. Use **0** for every field of the table. |

Bifröst Foundation adds a few exceptions of its own when it is installed. Add an exception only for
data that does not need a change-log trail.
