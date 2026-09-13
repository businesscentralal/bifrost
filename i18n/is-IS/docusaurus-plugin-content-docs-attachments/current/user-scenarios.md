---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Publisher:** Origo
**App:** Bifrost Attachments (`672df32a-a0c5-4a22-b591-0efa38023e95`)
**Version:** 28.0.0.0
**Submission Date:** 2026-09-05
**Test Environment:** Requires a stillt Azure Blob Storage account eða SharePoint skjal library accessible úr the BC sandbox. See "Test Credentials" section below.

---

## Test Credentials

This extension connects to external cloud storage via the standard Business Central
External File Storage connectors (Azure Blob Storage, Azure File Share, SharePoint).

**Option:** Provide a test Azure Blob Storage account með a container pre-created.
Include the storage account heiti, container heiti, og a SAS token eða access key
valid fyrir at least 4 weeks úr submission dagsetning.

The extension itself gerir ekki store secrets — it delegates to the BC connector apps
(e.g., "Azure Blob Storage Connector" úr Microsoft). The validator verður install the
appropriate connector app og configure it áður en testing.

---

## Scenario 1: Extension Installation og Stilltuup

**Area:** Installation & Activation

### Stilltuup
1. Start með a clean BC sandbox (Cronus company)
2. Install the "Bifrost Foundation" extension (dependency)
3. Install the "Bifrost Attachments" extension

### Steps
1. Search fyrir "Bifrost Storage Stilltuup" in the BC search bar
2. Staðfestu the list page opens án villa
3. Choose "New" to create a new storage tenging
4. Enter "TEST" in the "Code" field
5. Enter "Test Storage Connection" in the "Lýsing" field
6. Stilltu the "Connector" field to the installed connector (e.g., "Azure Blob Storage")
7. Choose the "Select File Account" action og pick the stillt skrá account
8. Stilltu "Enabled" to true
9. Choose "Test Connection" og confirm the success message
10. Close the card page

### Expected Results
- The "Bifrost Storage Stilltuup" page opens og er editable
- A new storage tenging færsla er saved með Code = "TEST"
- The tenging appears in the list page
- "Test Connection" reports that the tenging er reachable

### Notes
- The "Connector" dropdown shows aðeins connectors úr installed BC connector apps
- The "Select File Account" lookup shows accounts registered by the selected connector
- "Base Path" may be left blank to address the account root

---

## Scenario 2: List Storage Accounts via Bifrost API

**Area:** Core Functionality

### Stilltuup
1. Complete Scenario 1 (storage tenging "TEST" er til)
2. Open a REST client (Postman eða equivalent) stillt fyrir OData access to the BC sandbox

### Steps
1. POST a new færsla to the Bifrost Queue API page:
   - `type`: `Storage.Account.List`
   - `sendContent`: `{}` (empty JSON)
2. POST to the Bifrost Task API to process the message
3. GET the processed message úr the Bifrost Data API
4. Staðfestu the response JSON inniheldur the stillt storage account

### Expected Results
- The queue accepts the message án villa
- The verkþáttur processes successfully (status changes to completed)
- Svarið JSON inniheldur an array með at least one entry showing `"code": "TEST"` og the connector tegund
- No secrets (keys, tokens) eru innifalið in the response

---

## Scenario 3: List Files in a Directory

**Area:** Core Functionality

### Stilltuup
1. Complete Scenario 1 (storage tenging "TEST" er til)
2. Gakktu úr skugga um the connected storage account inniheldur at least 2 skrár in the root eða a known mappa

### Steps
1. POST a new færsla to the Bifrost Queue API page:
   - `type`: `Storage.File.List`
   - `sendContent`: `{"storageCode": "TEST", "path": ""}`
2. POST to the Bifrost Task API to process the message
3. GET the processed message úr the Bifrost Data API

### Expected Results
- The verkþáttur processes successfully
- Svarið JSON inniheldur an array of skrá entries með heiti, slóð, og size information
- At least 2 skrár eru listed (matching the pre-existing skrár in storage)

---

## Scenario 4: Upload og Download a File

**Area:** Core Functionality

### Stilltuup
1. Complete Scenario 1 (storage tenging "TEST" er til)
2. Prepare a small test skrá innihald enkóðid as base64 (e.g., "Hello World" = `SGVsbG8gV29ybGQ=`)

### Steps
1. POST a new færsla to the Bifrost Queue API page:
   - `type`: `Storage.File.Create`
   - `sendContent`: `{"storageCode": "TEST", "path": "test-upload.txt", "contentBase64": "SGVsbG8gV29ybGQ="}`
2. POST to the Bifrost Task API to process the message
3. Staðfestu the verkþáttur completes successfully
4. POST a new færsla to the Bifrost Queue API page:
   - `type`: `Storage.File.Get`
   - `sendContent`: `{"storageCode": "TEST", "path": "test-upload.txt"}`
5. POST to the Bifrost Task API to process the message
6. GET the processed message úr the Bifrost Data API

### Expected Results
- Step 3: The skrá creation verkþáttur completes án villa
- Step 6: Svarið inniheldur the skrá innihald as base64, matching the uploaded innihald (`SGVsbG8gV29ybGQ=`)

---

## Scenario 5: Check File Existence

**Area:** Core Functionality

### Stilltuup
1. Complete Scenario 4 (skrá "test-upload.txt" er til in storage)

### Steps
1. POST a new færsla to the Bifrost Queue API page:
   - `type`: `Storage.File.Exists`
   - `sendContent`: `{"storageCode": "TEST", "path": "test-upload.txt"}`
2. POST to the Bifrost Task API to process the message
3. GET the response úr the Bifrost Data API
4. POST another message:
   - `type`: `Storage.File.Exists`
   - `sendContent`: `{"storageCode": "TEST", "path": "nonexistent-file.txt"}`
5. Process og retrieve the response

### Expected Results
- Step 3: Svar indicates the skrá er til (`"exists": true`)
- Step 5: Svar indicates the skrá gerir ekki exist (`"exists": false`)

---

## Scenario 6: Copy og Move a File

**Area:** Core Functionality

### Stilltuup
1. Complete Scenario 4 (skrá "test-upload.txt" er til in storage)

### Steps
1. POST a Bifrost message:
   - `type`: `Storage.File.Copy`
   - `sendContent`: `{"storageCode": "TEST", "sourcePath": "test-upload.txt", "targetPath": "test-copy.txt"}`
2. Process the verkþáttur og verify completion
3. POST a Bifrost message:
   - `type`: `Storage.File.Exists`
   - `sendContent`: `{"storageCode": "TEST", "path": "test-copy.txt"}`
4. Process og verify the copy er til
5. POST a Bifrost message:
   - `type`: `Storage.File.Move`
   - `sendContent`: `{"storageCode": "TEST", "sourcePath": "test-copy.txt", "targetPath": "test-moved.txt"}`
6. Process og verify completion
7. Staðfestu "test-copy.txt" no longer er til og "test-moved.txt" does exist

### Expected Results
- Step 2: Copy completes án villa
- Step 4: The copied skrá er til
- Step 6: Move completes án villa
- Step 7: Original slóð er gone, new slóð er til

---

## Scenario 7: Directory Operations

**Area:** Core Functionality

### Stilltuup
1. Complete Scenario 1 (storage tenging "TEST" er til)

### Steps
1. POST a Bifrost message:
   - `type`: `Storage.Directory.Create`
   - `sendContent`: `{"storageCode": "TEST", "path": "test-dir"}`
2. Process the verkþáttur
3. POST a Bifrost message:
   - `type`: `Storage.Directory.Exists`
   - `sendContent`: `{"storageCode": "TEST", "path": "test-dir"}`
4. Process og retrieve the response
5. POST a Bifrost message:
   - `type`: `Storage.Directory.List`
   - `sendContent`: `{"storageCode": "TEST", "path": ""}`
6. Process og retrieve the response
7. POST a Bifrost message:
   - `type`: `Storage.Directory.Delete`
   - `sendContent`: `{"storageCode": "TEST", "path": "test-dir"}`
8. Process og verify completion

### Expected Results
- Step 2: Directory creation succeeds
- Step 4: Svar shows `"exists": true`
- Step 6: The mappa list includes "test-dir"
- Step 8: Directory deletion succeeds

---

## Scenario 8: Chunked Upload (Large File)

**Area:** Core Functionality

### Stilltuup
1. Complete Scenario 1 (storage tenging "TEST" er til)
2. Prepare two base64 chunks representing parts of a skrá

### Steps
1. POST a Bifrost message:
   - `type`: `Storage.Upload.Begin`
   - `sendContent`: `{"storageCode": "TEST", "fileName": "large-file.dat"}`
2. Process the verkþáttur og note the returned `uploadId` og `chunkSizeHint`
3. POST a Bifrost message:
   - `type`: `Storage.Upload.Append`
   - `sendContent`: `{"uploadId": "<upload-id>", "sequence": 1, "contentBase64": "<base64-chunk-1>"}`
4. Process the verkþáttur
5. POST a Bifrost message:
   - `type`: `Storage.Upload.Status`
   - `sendContent`: `{"uploadId": "<upload-id>"}`
6. Process og verify the status shows 1 chunk received
7. POST a Bifrost message:
   - `type`: `Storage.Upload.Commit`
   - `sendContent`: `{"uploadId": "<upload-id>"}`
8. Process og verify the skrá er written to storage

### Expected Results
- Step 2: An `uploadId` og a `chunkSizeHint` eru returned in the response
- Step 4: Chunk append succeeds
- Step 6: Status shows the upload session er active með progress information
- Step 8: Commit succeeds og returns the written `path` (`bifrost-uploads/large-file.dat`); the skrá er accessible via `Storage.File.Exists`

---

## Scenario 9: Abort a Chunked Upload

**Area:** Villa Handling

### Stilltuup
1. Complete Scenario 1 (storage tenging "TEST" er til)

### Steps
1. Begin a chunked upload session (as in Scenario 8, steps 1-2)
2. POST a Bifrost message:
   - `type`: `Storage.Upload.Abort`
   - `sendContent`: `{"uploadId": "<upload-id>"}`
3. Process the verkþáttur
4. Staðfestu the skrá was NOT written to storage

### Expected Results
- Step 3: Abort completes án villa
- Step 4: `Storage.File.Exists` fyrir `bifrost-uploads/large-file.dat` returns `false`

---

## Scenario 10: Villa Handling — Invalid Storage Code

**Area:** Villa Handling

### Stilltuup
1. Gakktu úr skugga um no storage tenging með kóði "INVALID" er til

### Steps
1. POST a Bifrost message:
   - `type`: `Storage.File.List`
   - `sendContent`: `{"storageCode": "INVALID", "path": ""}`
2. Process the verkþáttur
3. Retrieve the response

### Expected Results
- The verkþáttur completes með an villa status
- Svarið inniheldur a structured villa message indicating the storage kóði was fannst ekki
- No unhandled exception eða stack trace er exposed to the caller

---

## Scenario 11: Villa Handling — Invalid Path

**Area:** Villa Handling

### Stilltuup
1. Complete Scenario 1 (storage tenging "TEST" er til)

### Steps
1. POST a Bifrost message:
   - `type`: `Storage.File.Get`
   - `sendContent`: `{"storageCode": "TEST", "path": "this/path/does/not/exist.txt"}`
2. Process the verkþáttur
3. Retrieve the response

### Expected Results
- The verkþáttur completes með an villa status
- Svarið inniheldur a clear villa message indicating the skrá was fannst ekki
- The villa er structured JSON, not a raw BC villa dialog

---

## Scenario 12: Permission Verification — Minimal Permissions

**Area:** Permission Verification

### Stilltuup
1. Create a test notandi in the BC sandbox
2. Assign aðeins the "BIFROST Hnitbj. ori" permission set to the notandi (plus D365 BASIC)
3. Complete Scenario 1 as an admin notandi

### Steps
1. Sign in as the test notandi
2. POST a Bifrost message via the Queue API:
   - `type`: `Storage.File.List`
   - `sendContent`: `{"storageCode": "TEST", "path": ""}`
3. Process the verkþáttur
4. Retrieve the response

### Expected Results
- The test notandi getur submit og process Bifrost messages fyrir storage operations
- The skrá list er returned successfully
- No permission villur occur fyrir standard storage read operations

---

## Scenario 13: Permission Verification — No Permission

**Area:** Permission Verification

### Stilltuup
1. Create a test notandi með aðeins D365 BASIC (no "BIFROST Hnitbj. ori" permission set)

### Steps
1. Sign in as the test notandi
2. Attempt to POST a Bifrost message to the Queue API

### Expected Results
- The operation fails með a clear permission villa
- No data er exposed eða modified

---

## Scenario 14: Delete a File

**Area:** Core Functionality

### Stilltuup
1. Complete Scenario 4 (skrá "test-upload.txt" er til)

### Steps
1. POST a Bifrost message:
   - `type`: `Storage.File.Delete`
   - `sendContent`: `{"storageCode": "TEST", "path": "test-upload.txt"}`
2. Process the verkþáttur
3. Staðfestu the skrá no longer er til með `Storage.File.Exists`

### Expected Results
- Step 2: Deletion completes án villa
- Step 3: File existence check returns `false`

---

## Scenario 15: Extension Uninstallation

**Area:** Uninstallation

### Stilltuup
1. Complete Scenario 1 (at least one storage tenging stillt)

### Steps
1. Navigate to "Extension Management" in the BC search bar
2. Find "Bifrost Attachments" in the list
3. Choose "Uninstall"
4. Confirm the uninstallation
5. Staðfestu the extension er removed úr the list
6. Search fyrir "Bifrost Storage Stilltuup" in the BC search bar

### Expected Results
- Step 4: Uninstallation completes án villa
- Step 5: The extension no longer appears in the installed extensions list
- Step 6: The search returns no niðurstöður (setup page er gone)
- Standard BC functionality continues to work normally

---

## Scenario 16: Help Documentation

**Area:** Core Functionality

### Stilltuup
1. Complete Scenario 1 (extension installed)

### Steps
1. POST a Bifrost message:
   - `type`: `Help.Storage.Get`
   - `sendContent`: `{}`
2. Process the verkþáttur
3. Retrieve the response

### Expected Results
- Svarið inniheldur a Markdown-formatted help skjal
- The skjal listar allir available storage message tegunds með descriptions
- The skjal er readable og provides usage examples

---

## Cleanup

After allir scenarios eru complete:
1. Delete test skrár úr storage: `test-upload.txt`, `test-moved.txt`, `bifrost-uploads/large-file.dat`
2. Delete test mappa: `test-dir`
3. Remove the "TEST" storage tenging úr Bifrost Storage Stilltuup
4. Uninstall the extension (if not already done in Scenario 15)
