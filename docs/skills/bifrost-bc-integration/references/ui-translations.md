---
id: ui-translations
title: "UI translations"
sidebar_label: "UI translations"
sidebar_position: 22
description: "Driving the labels of your own interface from the Translation ori table in Business Central: how the table works, fetching a language, creating placeholder records for missing keys, applying them to HTML, the language selector, and using BC field captions as column headers."
---

Driving the labels of your own interface from the `Translation ori` table in Business Central: how the table works, fetching a language, creating placeholder records for missing keys, applying them to HTML, the language selector, and using BC field captions as column headers.

[← back to SKILL.md](../index.md) · originally sections 20 of the single-file skill.

---

## 20. UI Translations via BC Translation Table

The Bifrost extension includes a `Translation ori` table that enables
**web or integration UIs to store and retrieve their own translatable strings directly
in Business Central**. This means your integration can be fully multi-lingual without
maintaining a separate translation file or service.

### 20.1 How It Works

The translation table has three primary key fields:
- `Source` — identifies the application (e.g. `"BC Portal"`, `"MyWebApp v1"`)
- `Windows Language ID` — the LCID integer as a `Code[10]` string (e.g. `"1039"`)
- `Source Text` — the English string to translate

And one value field:
- `Target Text` — the translated string

Business users fill in translations directly in BC. Your app reads them at runtime.

### 20.2 Fetching UI Translations

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

### 20.3 Auto-Creating Placeholder Records for Missing Translations

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

### 20.4 Applying Translations to HTML

Use `data-t` and `data-tp` (placeholder) attributes on HTML elements:

```html
<!-- Text content -->
<span data-t="Customers">Customers</span>
<button data-t="Save">Save</button>
<h2 data-t="Customer Number">Customer Number</h2>

<!-- Input placeholder -->
<input data-tp="Search..." placeholder="Search...">
```

Apply after loading:
```javascript
function applyUiTranslations() {
  document.querySelectorAll('[data-t]').forEach(el => {
    el.textContent = t(el.dataset.t);
  });
  document.querySelectorAll('[data-tp]').forEach(el => {
    el.placeholder = t(el.dataset.tp);
  });
}
```

### 20.5 Language Selector

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

### 20.6 Full Language-Change Workflow

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

### 20.7 Using Field Captions as Column Headers

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
