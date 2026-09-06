---
id: 20-7-using-field-captions-as-column-headers
title: "20.7 Using Field Captions as Column Headers"
sidebar_label: "20.7 Using Field Captions as Column Headers"
sidebar_position: 7
---

After calling `Help.Fields.Get` with a `lcid`, the `caption` for each field is the
localised column header. This means column headers in your UI automatically match the
BC field label in the user's language:

```javascript
async function buildTableHeaders(companyId, tableName, fieldNumbers, lcid) {
  const meta = await getFieldMeta(companyId, tableName, lcid, fieldNumbers);
  
  // meta[i].caption is already in the user's language
  return fieldNumbers
    .map(no => meta.find(f => f.id === no))
    .filter(Boolean)
    .map(f => ({ fieldNo: f.id, jsonName: f.jsonName, caption: f.caption }));
}

// Example output for Customer fields [1, 2, 7, 102] with lcid=1039 (Icelandic):
// [
//   { fieldNo: 1,   jsonName: "No_",  caption: "Nr." },
//   { fieldNo: 2,   jsonName: "Name", caption: "Heiti" },
//   { fieldNo: 7,   jsonName: "City", caption: "Bær" },
//   { fieldNo: 102, jsonName: "EMail", caption: "Tölvupóstur" }
// ]
```

---
