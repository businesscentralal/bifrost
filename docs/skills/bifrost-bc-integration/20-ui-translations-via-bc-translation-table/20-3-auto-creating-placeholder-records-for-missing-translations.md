---
id: 20-3-auto-creating-placeholder-records-for-missing-translations
title: "20.3 Auto-Creating Placeholder Records for Missing Translations"
sidebar_label: "20.3 Auto-Creating Placeholder Records for Missing Translations"
sidebar_position: 3
---

When a language is selected but some strings are not yet translated in BC, create
placeholder records automatically. Business users can then fill them in via the standard
BC UI.

```javascript
async function ensureTranslationPlaceholders(companyId, lcid, appSource = 'MyApp') {
  // Find which strings are missing
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableName: 'Translation ori',
      tableView: `WHERE(Windows Language ID=CONST(${lcid}),Source=CONST(${appSource}))`,
      take: UI_STRINGS.length + 50
    })
  });
  
  const existing = new Set((res.result || []).map(r => r.primaryKey?.SourceText));
  const missing  = UI_STRINGS.filter(s => !existing.has(s));
  
  if (!missing.length) return;
  
  // Insert placeholder records with empty TargetText
  await cePost(companyId, {
    type: 'Data.Records.Set',
    subject: 'Translation ori',
    data: JSON.stringify({
      data: missing.map(s => ({
        primaryKey: {
          Source: appSource,
          WindowsLanguageID: String(lcid),
          SourceText: s
        },
        fields: { TargetText: '' }
      }))
    })
  });
}
```
