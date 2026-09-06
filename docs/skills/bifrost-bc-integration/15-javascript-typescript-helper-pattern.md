---
id: 15-javascript-typescript-helper-pattern
title: "15. JavaScript/TypeScript Helper Pattern"
sidebar_label: "15. JavaScript/TypeScript Helper Pattern"
sidebar_position: 17
---

```typescript
const BASE = `https://api.businesscentral.dynamics.com/v2.0/${TENANT}/${ENV}/api/origo/bifrost/v1.0`;

async function cePost(companyId: string, message: object, token: string) {
  const res = await fetch(`${BASE}/companies(${companyId})/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ specversion: '1.0', source: 'MyApp v1.0', ...message }),
  });
  const task = await res.json();
  // Direct error (PDF types, some inbound)
  if (task.status === 'Error') throw new Error(task.error);
  // Two-step: fetch the data URL
  if (task.data) {
    const dataRes = await fetch(task.data, { headers: { Authorization: `Bearer ${token}` } });
    const result = await dataRes.json();
    if (result.status === 'Error') throw new Error(`${result.error}\n${result.callStack}`);
    return result;
  }
  return task;
}

// Read records example
const customers = await cePost(companyId, {
  type: 'Data.Records.Get',
  data: JSON.stringify({ tableName: 'Customer', fieldNumbers: [1, 2, 5, 7], take: 100 }),
}, token);

// Write record example
await cePost(companyId, {
  type: 'Data.Records.Set',
  subject: 'Customer',
  data: JSON.stringify({ data: [{ id: systemId, fields: { Address: 'New Road 1' } }] }),
}, token);

// Get field metadata
const fields = await cePost(companyId, {
  type: 'Help.Fields.Get',
  data: JSON.stringify({ tableName: 'Customer' }),
  lcid: 1033,
}, token);
```

---
