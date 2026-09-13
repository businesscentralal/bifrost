---
id: documentexchange-advania-getattachments
title: "DocumentExchange.Advania.GetAttachments"
sidebar_label: "DocumentExchange.Advania.GetAttachments"
sidebar_position: 5
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetAttachments Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


> **Availability:** Advania Aðeins. On Unimaze, attachments eru embedded in the UBL XML.

Lists Allt attachments in a skjal (external links og BASE64 embedded).

## Beiðni
| Reitur | Gerð | nauðsynlegt |
|-------|------|----------|
| messageId | string | **Yes** |

## Svar
Paged envelope: `{ count, hasMore, items[] }`.

### Item fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| uuid | string | Parent skjal UUID |
| id | string | Attachment identifier |
| document_type | string | MIME Gerð Lýsing (nullable) |
| filename | string | Original filename (nullable) |
| mimecode | string | MIME code e.g. application/pdf (nullable) |
| binary_object | string | BASE64-encoded content (nullable, getur be large) |
| uri | string | External link URL (nullable) |

## Note
Many invoices have no real attachments — items may appear með null fields.


