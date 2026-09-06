---
id: 22-duplicate-existence-checking-pattern
title: "22. Duplicate / Existence Checking Pattern"
sidebar_label: "22. Duplicate / Existence Checking Pattern"
sidebar_position: 24
---

Before inserting, check whether a record with the same unique identifier already exists:

```javascript
async function recordExists(companyId, tableName, tableView) {
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableName,
      tableView,
      fieldNumbers: [1],  // Only PK — minimal payload
      take: 1
    })
  });
  return (res.result?.length ?? 0) > 0;
}

// Check customer by registration number
const exists = await recordExists(
  companyId,
  'Customer',
  `WHERE(Registration Number=CONST(${regNo}))`
);
if (exists) {
  showError(`A customer with registration number ${regNo} already exists.`);
  return;
}
```

---
