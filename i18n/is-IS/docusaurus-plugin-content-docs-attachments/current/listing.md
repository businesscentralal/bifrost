---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Copy these texts í Partner Center þegar creating/updating the offer listing.

---

## Offer Name
Bifröst Attachments

## Search Result Summary (max 50 chars)
Cloud storage fyrir Business Central

## Offer Summary (max 100 chars)
Azure Blob, File Share og SharePoint as Bifröst message tegunds fyrir BC skrá operations.

## Search Keywords
1. Cloud storage
2. Azure Blob
3. File management

## Categories
- **Primary:** IT & Admin Tools > Data Integration
- **Secondary:** Operations > Supply Chain

## Industries
- Professional Services
- Manufacturing

---

## Lýsing

The full description text er [below](#full-description-text).

---

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central

---

## Full description text

**Bifröst Attachments** connects Business Central to cloud storage through the Bifröst platform — a message-based integration layer that gives external systems, AI agents, og automation tools structured access to Business Central data og procedures via OData. It exposes the standard BC external skrá storage connectors — Azure Blob Storage, Azure File Share, og SharePoint — as message tegunds that any MCP-compatible client, REST caller, eða BC process getur invoke through the same Queue → Task → Data API pattern used across the entire Bifröst ecosystem.

### Who er this for?

**IT teams og integration developers** who need to connect Business Central to cloud storage fyrir skjal management, archival, og skrá exchange workflows. Ideal fyrir organizations that want to reduce database size by offloading attachments to cloud storage, eða need external systems to read og write skrár through a unified API án building custom integrations.

**Target industries:** Professional services, manufacturing, distribution, retail — any business that handles skjöl, attachments, eða skrá-based data exchange alongside Business Central.

### What it does

- **File operations** — List, download, upload, copy, move, delete, og check existence of skrár in any stillt storage tenging
- **Directory operations** — List, create, delete, og check existence of directories
- **Chunked uploads** — Upload large skrár in pieces með session management (begin, append, commit, abort, status). Ideal fyrir skrár too large fyrir a single API call
- **Attachment offloading** — Move BC skjal attachments to cloud storage to reduce database size, og restore them on demand
- **Linked attachments** — Attach skrár already in storage to incoming skjöl, eða create a skjal attachment on any færsla, án re-uploading

### How it works

1. Configure storage tengingar in **Bifrost Storage Stilltuup**, binding a short kóði to a BC skrá account
2. External systems send Bifröst messages með the storage kóði to target specific tengingar
3. All operations route through the standard BC External File Storage facade — secrets eru managed by the connector apps, never by this extension

### Supported connectors

Any connector registered með BC's External File Storage system:
- Azure Blob Storage
- Azure File Share
- SharePoint

### Supported editions og countries

- **Editions:** Business Central Essentials og Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain

### Requirements og prerequisites

- Microsoft Dynamics 365 Business Central 28.0 eða later
- Bifrost Foundation extension by Origo (available separately on AppSource)
- At least one BC skrá storage connector app installed og stillt (e.g., Azure Blob Storage Connector by Microsoft)
