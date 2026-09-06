---
id: 20-6-full-language-change-workflow
title: "20.6 Full Language-Change Workflow"
sidebar_label: "20.6 Full Language-Change Workflow"
sidebar_position: 6
---

```javascript
let selectedLcid = 1033;
let fieldMetaCache = {};
let uiTranslations = {};

async function onLanguageChange(newLcid, companyId) {
  selectedLcid = newLcid;
  
  // Clear caches — captions and translations are language-specific
  fieldMetaCache = {};
  uiTranslations = {};
  
  // Reload translations and refresh UI
  await loadUiTranslations(companyId, newLcid);
  await ensureTranslationPlaceholders(companyId, newLcid);
  applyUiTranslations();
  
  // Reload any data that shows captions (e.g. enum fields, table captions)
  await refreshCurrentView();
}
```
