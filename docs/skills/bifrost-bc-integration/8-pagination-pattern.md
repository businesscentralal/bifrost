---
id: 8-pagination-pattern
title: "8. Pagination Pattern"
sidebar_label: "8. Pagination Pattern"
sidebar_position: 10
---

`noOfRecords` always equals the **total records matching all filters** regardless of `skip`/`take`. Never changes between pages — use it once to calculate total pages.

```javascript
const take = 100;
let skip = 0;

const first = await cePost(companyId, {
  type: "Data.Records.Get",
  data: JSON.stringify({ tableName: "Customer", skip, take })
});

const totalPages = Math.ceil(first.noOfRecords / take);

// Page N:
skip = pageIndex * take;
```

---
