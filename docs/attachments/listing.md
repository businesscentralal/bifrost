---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Copy these texts into Partner Center when creating/updating the offer listing.

---

## Offer Name
Bifröst Attachments

## Search Result Summary (max 50 chars)
Cloud storage for Business Central

## Offer Summary (max 100 chars)
Azure Blob, File Share and SharePoint storage for Business Central files and attachments.

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

## Description

The full description text is [below](#full-description-text).

---

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central

---

## Full description text

**Bifröst Attachments** connects Business Central to cloud storage through the Bifröst platform — a message-based integration layer that gives external systems, AI agents, and automation tools structured access to Business Central data and procedures via OData. It puts the standard BC external file storage connectors — Azure Blob Storage, Azure File Share, and SharePoint — within reach of any MCP-compatible client, REST caller, or BC process, through the same Queue → Task → Data API used across the entire Bifröst ecosystem.

### Who is this for?

**IT teams and integration developers** who need to connect Business Central to cloud storage for document management, archival, and file exchange workflows. Ideal for organizations that want to reduce database size by offloading attachments to cloud storage, or need external systems to read and write files through a unified API without building custom integrations.

**Target industries:** Professional services, manufacturing, distribution, retail — any business that handles documents, attachments, or file-based data exchange alongside Business Central.

### What it does

- **File operations** — List, download, upload, copy, move, delete, and check existence of files in any configured storage connection
- **Directory operations** — List, create, delete, and check existence of directories
- **Chunked uploads** — Upload large files in pieces: start an upload, send the pieces, then finish or cancel it, and check its progress at any time. Ideal for files too large for a single API call
- **Attachment offloading** — Move BC document attachments to cloud storage to reduce database size, and restore them on demand
- **Linked attachments** — Attach files already in storage to incoming documents, or create a document attachment on any record, without re-uploading

### How it works

1. Configure storage connections in **Bifrost Storage Setup**, binding a short code to a BC file account
2. External systems and AI assistants name the storage connection by its code
3. All operations route through the standard BC External File Storage facade — secrets are managed by the connector apps, never by this extension

### Supported connectors

Any connector registered with BC's External File Storage system:
- Azure Blob Storage
- Azure File Share
- SharePoint

### Supported editions and countries

- **Editions:** Business Central Essentials and Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain

### Requirements and prerequisites

- Microsoft Dynamics 365 Business Central 28.0 or later
- Bifrost Foundation extension by Origo (available separately on AppSource)
- At least one BC file storage connector app installed and configured (e.g., Azure Blob Storage Connector by Microsoft)
