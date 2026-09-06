---
id: 20-4-applying-translations-to-html
title: "20.4 Applying Translations to html"
sidebar_label: "20.4 Applying Translations to html"
sidebar_position: 4
---

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
