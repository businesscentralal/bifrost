# Worked examples

Two end-to-end examples: creating a sales order header, lines and release through the generic data message types, and a small JavaScript/TypeScript helper that wraps the envelope, the polling and the error order.

[← back to SKILL.md](../SKILL.md) · originally sections 12, 15 of the single-file skill.

---

## 12. Creating Sales Orders Workflow

There is no dedicated "create order" message type. Use `Data.Records.Set` for all steps.

### Step 1 — Create Sales Header

### Step 2 — Add Sales Lines (one call per line)

Increment `LineNo_` by 10000 for each additional line.

### Step 3 — Release

For a ready-to-use workflow description pre-populated with the live `jsonName` values and
field table for *this* BC instance, invoke the MCP prompt `sales_order_creation_workflow`.
It calls `get_table_fields` for both `Sales Header` and `Sales Line` and injects the results
into a step-by-step guide.

---

## 15. JavaScript/TypeScript Helper Pattern

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
