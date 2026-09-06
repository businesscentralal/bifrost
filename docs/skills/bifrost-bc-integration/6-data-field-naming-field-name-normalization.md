---
id: 6-data-field-naming-field-name-normalization
title: "6. Data Field Naming — Field Name Normalization"
sidebar_label: "6. Data Field Naming — Field Name Normalization"
sidebar_position: 8
---

BC field names are normalized to JSON keys using two steps applied in order:

1. Replace each of `` % . " \ / ' `` with `_`
2. Strip every remaining character that is **not** `_`, a letter (`A–Z`, `a–z`), or a digit (`0–9`)

```
BC field name          → JSON key
──────────────────────────────────
No.                    → No_
Phone No.              → PhoneNo_
E-Mail                 → EMail
Credit Limit (LCY)     → CreditLimitLCY
G/L Account No.        → G_LAccountNo_
Sell-to Customer No.   → SelltoCustomerNo_
Dimension Set ID       → DimensionSetID
Unit Price             → UnitPrice
Document Type          → DocumentType
```

**Golden rule: call `Help.Fields.Get` on the table to get the exact `jsonName` for any field. Do not guess.**

- `name` → original BC field name (use in `tableView` WHERE clauses)
- `jsonName` → normalized JSON key (use in `Data.Records.Get` / `Data.Records.Set` field objects)
- `caption` → localised display label (use for UI only, not in queries)

---
