# Selecting only the fields you need

Why `fieldNumbers` is not optional in practice, patterns for declaring field lists as constants, loading records and field metadata in parallel, building a form from metadata, and the JSON shape of the three binary field types on read and on write.

[← back to SKILL.md](../SKILL.md) · originally sections 18 of the single-file skill.

---

## 18. Selecting Only the Fields You Need

Always specify `fieldNumbers` instead of requesting all fields. Benefits:
- Dramatically reduces response payload size
- Enables FlowField calculation (FlowFields are **only calculated** when `fieldNumbers` is specified)
- Improves BC-side performance (fewer field reads)
- Reduces transfer time

### Pattern: Declare field lists as named constants

```javascript
// Declare once — use everywhere
const CUSTOMER_LIST_FIELDS   = [2, 7, 35, 39, 59, 83, 102, 140];
// Field 2  = Name
// Field 7  = City
// Field 35 = Country/Region Code
// Field 39 = Blocked (enum — fetch metadata for caption)
// Field 59 = Balance (LCY)  [FlowField — only returned when fieldNumbers present]
// Field 83 = Location Code
// Field 102 = E-Mail
// Field 140 = Image (Media)

const CUSTOMER_DETAIL_FIELDS = [2, 4, 5, 7, 8, 9, 10, 17, 21, 27, 30, 35, 38, 39,
                                 54, 59, 61, 82, 84, 85, 86, 91, 92, 95, 102, 107,
                                 108, 110, 116, 140];

const POST_CODE_FIELDS       = [1, 2, 4, 5];
// Field 1 = Code (PK)
// Field 2 = City
// Field 4 = Country/Region Code
// Field 5 = County

const CUST_LEDGER_FIELDS     = [4, 5, 6, 7, 13, 14, 36];
```

### Pattern: Parallel loading of records + field metadata

Load data and field metadata simultaneously so captions are ready when data arrives:

```javascript
const [recordsRes, fieldMetaRes] = await Promise.all([
  cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableName: 'Customer',
      fieldNumbers: CUSTOMER_LIST_FIELDS,
      skip: 0,
      take: 50
    })
  }),
  getFieldMeta(companyId, 'Customer', userLcid, [39])  // Only need Blocked enum captions
]);

// Map enum ordinal → caption for the Blocked field
const blockedField = fieldMetaRes.find(f => f.id === 39);
const blockedCaption = val => blockedField?.enum?.find(e => e.value === val)?.caption ?? val;

// Render
for (const rec of recordsRes.result) {
  const name    = rec.fields.Name;
  const blocked = blockedCaption(rec.fields.Blocked);  // " " → "Not blocked" in user's language
  const balance = rec.fields.BalanceLCY;               // FlowField — present because fieldNumbers was set
}
```

### Pattern: Build a generic field-driven form from metadata

```javascript
async function buildForm(companyId, tableName, lcid) {
  const fields = await getFieldMeta(companyId, tableName, lcid);
  
  for (const field of fields) {
    if (field.isPartOfPrimaryKey) continue;  // PK fields shown separately
    if (field.class === 'FlowField') continue;  // Read-only calculated fields
    
    const label = field.caption;  // Localised
    let control;
    
    switch (field.type) {
      case 'Option':
        // Build <select> from enum[]
        control = buildSelect(field.enum.map(e => ({ value: e.value, label: e.caption })));
        break;
      case 'Boolean':
        control = buildCheckbox();
        break;
      case 'Date':
        control = buildDateInput();
        break;
      case 'Decimal':
      case 'Integer':
      case 'BigInteger':
        control = buildNumberInput();
        break;
      case 'Blob':
        // BLOB — file upload; value is a plain Base64 string
        control = buildFileInput({ encoding: 'base64', returnAs: 'string' });
        break;
      case 'Media':
        // Single image — value is { Id: "{GUID}", Value: "base64string" }
        control = buildFileInput({ encoding: 'base64', returnAs: 'mediaObject' });
        break;
      case 'MediaSet':
        // Multiple images — value is { Id: "{GUID}", Media: [{ Id: "…", Value: "…" }] }
        control = buildFileInput({ encoding: 'base64', returnAs: 'mediaSetObject', multiple: true });
        break;
      default:
        // Text, Code
        control = buildTextInput(field.len);
    }
    
    addFormRow(label, control, field.jsonName);
  }
}
```

### 17.6 Binary Field Types — Blob, Media, MediaSet

These three field types carry binary content (files, images). They are handled
differently from all other field types — each has its own JSON shape on read and write.

#### Blob

A raw binary field (e.g. `Value BLOB` on table 823 Name/Value Buffer). Identified in
`Help.Fields.Get` response as `"type": "Blob"`.

**Read (`Data.Records.Get`):**
Returned as a plain Base64-encoded string.
```json
"ValueBLOB": "dGhpcyBpcyB0ZXN0IGRhdGE="
```

**Write (`Data.Records.Set`):**
Send the same plain Base64 string back in the `fields` object.
```json
"fields": {
  "ValueBLOB": "dGhpcyBpcyB0ZXN0IGRhdGE="
}
```

**JavaScript — encode a file for write:**
```javascript
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);  // strip data-URL prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const base64 = await fileToBase64(fileInputElement.files[0]);
// Send: fields: { ValueBLOB: base64 }
```

**JavaScript — decode a Blob value for display/download:**
```javascript
function base64ToBlob(base64, mimeType = 'application/octet-stream') {
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return new Blob([bytes], { type: mimeType });
}

const blob = base64ToBlob(rec.fields.ValueBLOB, 'application/pdf');
const url  = URL.createObjectURL(blob);
```

---

#### Media (single image)

A single image field (e.g. `Image` on table 18 Customer). Identified as `"type": "Media"`.

**Read (`Data.Records.Get`):**
Returned as a JSON object with a GUID identifier and the Base64-encoded image.
```json
"Image": {
  "Id": "{D6E0EA8A-88A5-4F03-BC75-A5FBC2806FB1}",
  "Value": "/9j/4AAQSkZJRgABAQAA..."
}
```
- `Id` — the media GUID in BC (curly-braced uppercase)
- `Value` — Base64-encoded image bytes

**Write (`Data.Records.Set` — update existing):**
Send the same object back. BC replaces the image.
```json
"fields": {
  "Image": {
    "Id": "{D6E0EA8A-88A5-4F03-BC75-A5FBC2806FB1}",
    "Value": "/9j/4AAQ..."  
  }
}
```

**Write (`Data.Records.Set` — new image, no existing GUID):**
Generate a new GUID and supply it as `Id`. Use all uppercase and include curly braces.
```javascript
function newMediaGuid() {
  // Generate RFC4122 v4 UUID wrapped in braces, uppercase
  return '{' + crypto.randomUUID().toUpperCase() + '}';
}

const base64Image = await fileToBase64(fileInputElement.files[0]);
const imageField  = { Id: newMediaGuid(), Value: base64Image };
// Send: fields: { Image: imageField }
```

**Display in browser:**
```javascript
function mediaToDataUrl(mediaObj, mimeType = 'image/jpeg') {
  if (!mediaObj?.Value) return null;
  return `data:${mimeType};base64,${mediaObj.Value}`;
}

imgElement.src = mediaToDataUrl(rec.fields.Image);
```

---

#### MediaSet (multiple images)

A collection of images (rare on standard tables). Identified as `"type": "MediaSet"`.

**Read (`Data.Records.Get`):**
Returned as a JSON object with a set GUID and an array of individual media items.
```json
"Pictures": {
  "Id": "{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}",
  "Media": [
    { "Id": "{GUID-1}", "Value": "base64string1" },
    { "Id": "{GUID-2}", "Value": "base64string2" }
  ]
}
```

**Write (`Data.Records.Set`):**
Send the same object back. Each item in `Media` needs its own GUID and Base64 value.
To add a new image, append a new entry to `Media` with a freshly generated GUID.
To replace all images, reconstruct the `Media` array.
```javascript
const existingSet = rec.fields.Pictures; // from a prior Data.Records.Get

// Add a new image to the set
const newFile = fileInputElement.files[0];
const newBase64 = await fileToBase64(newFile);
existingSet.Media.push({ Id: newMediaGuid(), Value: newBase64 });

// Send back
// fields: { Pictures: existingSet }
```

**Round-trip rule:** Always read the current value first, then modify and send it back.
Never send a partial `Media` array unless you intentionally want to remove entries.
