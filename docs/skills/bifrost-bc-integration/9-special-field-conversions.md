---
id: 9-special-field-conversions
title: "9. Special Field Conversions"
sidebar_label: "9. Special Field Conversions"
sidebar_position: 11
---

### Currency Code (blank = LCY)

BC stores blank `Currency Code` to mean Local Currency.

- **Get** → blank is returned as the LCY currency code from G/L Setup, e.g. `"ISK"` or `"USD"`
- **Set** → send that same LCY code string back; API converts it to blank automatically
- Round-trip safe: use the value you received from Get directly in Set

### Dimension Set ID (field 480)

- **Get** → integer is expanded to an array:
  ```json
  "DimensionSetID": [
    { "DimensionCode": "DEPT", "DimensionValueCode": "SALES" }
  ]
  ```
- **Set** → send the same array back; API resolves it to the integer automatically
- Empty array = blank (0) dimension set

### BLOB Fields

- **Get** → plain Base64 string: `"ValueBLOB": "dGhpcyBpcyB0ZXN0..."`
- **Set** → send the same Base64 string

### Media (single image)

- **Get** → `{ "Id": "{GUID}", "Value": "base64string" }`
- **Set** → send the same object

### MediaSet (multiple images)

- **Get** → `{ "Id": "{GUID}", "Media": [{ "Id": "…", "Value": "…" }] }`
- **Set** → send the same object

---
