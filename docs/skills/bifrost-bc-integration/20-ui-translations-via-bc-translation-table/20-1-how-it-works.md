---
id: 20-1-how-it-works
title: "20.1 How It Works"
sidebar_label: "20.1 How It Works"
sidebar_position: 1
---

The translation table has three primary key fields:
- `Source` — identifies the application (e.g. `"BC Portal"`, `"MyWebApp v1"`)
- `Windows Language ID` — the LCID integer as a `Code[10]` string (e.g. `"1039"`)
- `Source Text` — the English string to translate

And one value field:
- `Target Text` — the translated string

Business users fill in translations directly in BC. Your app reads them at runtime.
