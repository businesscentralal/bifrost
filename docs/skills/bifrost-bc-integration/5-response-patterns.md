---
id: 5-response-patterns
title: "5. Response Patterns"
sidebar_label: "5. Response Patterns"
sidebar_position: 7
---

### Pattern A — Two-step (most data operations)

1. POST returns `{ …, "data": "<url>" }`
2. GET the URL → result JSON

### Pattern B — Direct response (some operations)

PDF types and some inbound operations embed status/error directly in the POST response.
No `data` URL. Check `response.status === "Error"` immediately.

### Error handling order

```
POST /tasks
  ├─ if response.status === "Error"   → direct error (no data URL)
  └─ if response.data exists
       └─ GET response.data
            ├─ if result.status === "Error"   → task execution error
            └─ if result.status === "Success" → use result
```

Error shape:
```json
{
  "status": "Error",
  "error": "Human-readable error message",
  "callStack": "Codeunit.Method line N — ..."
}
```

---
