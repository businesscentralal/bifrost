---
id: 10-enum-option-handling
title: "10. Enum / Option Handling"
sidebar_label: "10. Enum / Option Handling"
sidebar_position: 12
---

**Get** returns the **display caption** for the requested `lcid`.  
Set accepts **any** of:
- AL name (always English): `"Ship"`, `"Invoice"`, `"All"`
- Display caption (localised): `"Afhenda"` (Icelandic for Ship)
- Ordinal as string: `"1"`

Use `Help.Fields.Get` to discover valid values. `enum[].value` = AL name, `enum[].caption` = localised caption.

`Customer.Blocked` example: `" "` (single space string) = not blocked (blank option).

---
