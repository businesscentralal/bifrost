---
id: 20-2-fetching-ui-translations
title: "20.2 Fetching UI Translations"
sidebar_label: "20.2 Fetching UI Translations"
sidebar_position: 2
---

```javascript
const UI_STRINGS = [
  'Loading...',
  'Customers',
  'Customer Number',
  'Name',
  'City',
  'Balance',
  'Blocked',
  'Active',
  'Save',
  'Cancel',
  'Search...',
  'No records found',
  // add all UI labels here
];

let uiTranslations = {};

async function loadUiTranslations(companyId, lcid, appSource = 'MyApp') {
  uiTranslations = {};
  if (lcid === 1033) return;  // English — no translation needed
  
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableName: 'Translation ori',
      tableView: `WHERE(Windows Language ID=CONST(${lcid}),Source=CONST(${appSource}))`,
      take: UI_STRINGS.length + 50
    })
  });
  
  for (const rec of (res.result || [])) {
    const src = rec.primaryKey?.SourceText;
    const tgt = rec.fields?.TargetText;
    if (src && tgt) uiTranslations[src] = tgt;
  }
}

// Translation helper with English fallback
function t(s) {
  return uiTranslations[s] || s;
}
```
