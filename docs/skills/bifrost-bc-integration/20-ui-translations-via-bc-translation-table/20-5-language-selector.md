---
id: 20-5-language-selector
title: "20.5 Language Selector"
sidebar_label: "20.5 Language Selector"
sidebar_position: 5
---

Use the **`Allowed Language`** table (3563) — not the `Language` table — to get the
languages that are enabled for use in this BC environment.

| Field No. | BC Field Name | `jsonName` | Description |
|---|---|---|---|
| 1 | `Language Id` | `LanguageId` | Windows Language ID (LCID integer) — matches `Windows Language ID` on the Language table |
| 2 | `Language` | `Language` | Display name (e.g. `"English"`, `"Icelandic"`) |

```javascript
async function loadLanguages(companyId) {
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableNumber: 3563,   // Allowed Language
      fieldNumbers: [1, 2] // Language Id (LCID), Language (display name)
    })
  });

  return (res.result || []).map(rec => ({
    lcid: rec.primaryKey.LanguageId ?? parseInt(rec.fields.LanguageId, 10),
    name: rec.fields.Language ?? ''
  }));
}
```

> The `Language Id` value from `Allowed Language` is the Windows Language ID (LCID)
> and maps directly to the `lcid` field used in Bifrost message envelopes and to
> the `Windows Language ID` field on the `Language` table (8).
```
