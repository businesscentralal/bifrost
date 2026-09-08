# Special field conversions and enums

Field types whose JSON shape is not what a caller would guess — currency code, dimension set id, BLOB, Media and MediaSet — and how option and enum values are read and written.

[← back to SKILL.md](../SKILL.md) · originally sections 9, 10 of the single-file skill.

---

## 9. Special Field Conversions

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

## 10. Enum / Option Handling

**Get** returns the **display caption** for the requested `lcid`.  
Set accepts **any** of:
- AL name (always English): `"Ship"`, `"Invoice"`, `"All"`
- Display caption (localised): `"Afhenda"` (Icelandic for Ship)
- Ordinal as string: `"1"`

Use `Help.Fields.Get` to discover valid values. `enum[].value` = AL name, `enum[].caption` = localised caption.

`Customer.Blocked` example: `" "` (single space string) = not blocked (blank option).
