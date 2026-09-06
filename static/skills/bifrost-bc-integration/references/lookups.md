# Reference data and lookups

The tables behind the dropdowns — countries, post codes, payment terms, posting groups and the rest — and the auto-fill chains a client is expected to reproduce.

[← back to SKILL.md](../SKILL.md) · originally sections 21 of the single-file skill.

---
## 21. Looking Up Reference Data (Dropdowns / Lookup Tables)

Many BC fields have table relations — the field value is a code that references another
table. Use `Data.Records.Get` with specific `fieldNumbers` to populate dropdowns.

### Common Lookup Table Reference

```javascript
const LOOKUP_TABLES = {
  paymentTerms: { tableNo: 3,   fields: [1, 5],        pkField: 'Code',        labelField: 'Description' },
  currency:     { tableNo: 4,   fields: [1, 15],       pkField: 'Code',        labelField: 'Description' },
  language:     { tableNo: 8,   fields: [1, 2, 3],     pkField: 'Code',        labelField: 'Name' },
  salesperson:  { tableNo: 13,  fields: [1, 2],        pkField: 'Code',        labelField: 'Name' },
  location:     { tableNo: 14,  fields: [1, 2],        pkField: 'Code',        labelField: 'Name' },
  customerPostingGroup: { tableNo: 92,  fields: [1, 20], pkField: 'Code',      labelField: 'Description' },
  postCode:     { tableNo: 225, fields: [1, 2, 4, 5],  pkField: 'Code',        labelField: 'City' },
  genBusPostingGroup: { tableNo: 250, fields: [1, 2, 3], pkField: 'Code',      labelField: 'Description' },
  paymentMethod: { tableNo: 289, fields: [1, 2],       pkField: 'Code',        labelField: 'Description' },
  vatBusPostingGroup: { tableNo: 323, fields: [1, 2],  pkField: 'Code',        labelField: 'Description' },
};

async function loadLookup(companyId, def) {
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({ tableNumber: def.tableNo, fieldNumbers: def.fields, take: 500 })
  });
  return (res.result || []).map(rec => ({
    value: rec.primaryKey[def.pkField] ?? rec.primaryKey[Object.keys(rec.primaryKey)[0]],
    label: rec.fields[def.labelField] ?? '',
    raw: rec
  }));
}

// Load all lookups in parallel
const [payTerms, currencies, locations] = await Promise.all([
  loadLookup(companyId, LOOKUP_TABLES.paymentTerms),
  loadLookup(companyId, LOOKUP_TABLES.currency),
  loadLookup(companyId, LOOKUP_TABLES.location),
]);
```

### Post Code Auto-Fill Pattern

```javascript
async function onPostCodeBlur(companyId, postCode) {
  if (!postCode) return;
  
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableNumber: 225,  // Post Code
      fieldNumbers: [1, 2, 4, 5],  // Code, City, Country/Region Code, County
      tableView: `WHERE(Code=CONST(${postCode}))`
    })
  });
  
  if (res.result?.length) {
    const rec = res.result[0];
    return {
      city:          rec.fields.City2 ?? rec.fields.City ?? '',   // check jsonName via Help.Fields.Get
      countryCode:   rec.fields.CountryRegionCode ?? '',
      county:        rec.fields.County ?? ''
    };
  }
  return null;
}
```

### Gen. Bus. Posting Group → VAT Bus. Posting Group Auto-Fill

```javascript
// Load Gen. Bus. Posting Groups with field 3 (Def. VAT Bus. Posting Group)
const genBusGroups = await loadLookup(companyId, LOOKUP_TABLES.genBusPostingGroup);
const genBusToVATMap = Object.fromEntries(
  genBusGroups.map(g => [g.value, g.raw.fields.Def_VATBusPostingGroup ?? ''])
);

function onGenBusChange(selectedCode) {
  const vatCode = genBusToVATMap[selectedCode] || '';
  document.getElementById('vat-bus-posting-group').value = vatCode;
}
```
