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
**Test Environment:** Requires a configured Azure Blob Storage account or SharePoint document library accessible from the BC sandbox, and an AI assistant connected to Bifröst. See "Test Credentials" and "AI assistant" below.

---

## Test Credentials

This extension connects to external cloud storage via the standard Business Central
External File Storage connectors (Azure Blob Storage, Azure File Share, SharePoint).

**Option:** Provide a test Azure Blob Storage account with a container pre-created.
Include the storage account name, container name, and a SAS token or access key
valid for at least 4 weeks from submission date.

The extension itself does not store secrets — it delegates to the BC connector apps
(e.g., "Azure Blob Storage Connector" from Microsoft). The validator must install the
appropriate connector app and configure it before testing.

---

## AI assistant

The scenarios below are run through an AI assistant (for example Copilot, ChatGPT or Claude)
connected to the sandbox through the Bifröst MCP server, as described in
[Connect your AI assistant](/setup/connect-your-ai/). Every request the assistant makes is
logged on the **Bifrost Messages** page in Business Central, where the tester can check its
status and result.

---

## Scenario 1: Extension Installation and Setup

**Area:** Installation & Activation

### Setup
1. Start with a clean BC sandbox (demo company)
2. Install the "Bifrost Foundation" extension (dependency)
3. Install the "Bifrost Attachments" extension

### Steps
1. Search for "Bifrost Storage Setup" in the BC search bar
2. Verify the list page opens without error
3. Choose "New" to create a new storage connection
4. Enter "TEST" in the "Code" field
5. Enter "Test Storage Connection" in the "Description" field
6. Set the "Connector" field to the installed connector (e.g., "Azure Blob Storage")
7. Choose the "Select File Account" action and pick the configured file account
8. Set "Enabled" to true
9. Choose "Test Connection" and confirm the success message
10. Close the card page

### Expected Results
- The "Bifrost Storage Setup" page opens and is editable
- A new storage connection record is saved with Code = "TEST"
- The connection appears in the list page
- "Test Connection" reports that the connection is reachable

### Notes
- The "Connector" dropdown shows only connectors from installed BC connector apps
- The "Select File Account" lookup shows accounts registered by the selected connector
- "Base Path" may be left blank to address the account root

---

## Scenario 2: List the Storage Connections

**Area:** Core Functionality

### Setup
1. Complete Scenario 1 (storage connection "TEST" exists)
2. Connect the AI assistant to the sandbox

### Steps
1. Ask the assistant: "Which storage connections are set up in Business Central?"
2. Open **Bifrost Messages** in Business Central and find the request

### Expected Results
- The answer lists the connection "TEST" and its connector type
- No secrets (keys, tokens) are included in the answer
- The request is shown on **Bifrost Messages** as completed

---

## Scenario 3: List Files in a Directory

**Area:** Core Functionality

### Setup
1. Complete Scenario 1 (storage connection "TEST" exists)
2. Ensure the connected storage account contains at least 2 files in the root or a known directory

### Steps
1. Ask the assistant: "List the files in the root of storage connection TEST."

### Expected Results
- The answer lists the files with name, path and size
- At least 2 files are listed, matching the files in storage

---

## Scenario 4: Upload and Download a File

**Area:** Core Functionality

### Setup
1. Complete Scenario 1 (storage connection "TEST" exists)

### Steps
1. Ask the assistant: "Create a file test-upload.txt in storage connection TEST with the text Hello World."
2. Check in the storage account (for example in the Azure portal) that the file exists
3. Ask the assistant: "Read the file test-upload.txt from storage connection TEST and show me its content."

### Expected Results
- Step 1: The assistant reports that the file was created, without error
- Step 2: The file "test-upload.txt" is in the storage account
- Step 3: The content shown is "Hello World"

---

## Scenario 5: Check File Existence

**Area:** Core Functionality

### Setup
1. Complete Scenario 4 (file "test-upload.txt" exists in storage)

### Steps
1. Ask the assistant: "Does the file test-upload.txt exist in storage connection TEST?"
2. Ask the assistant: "Does the file nonexistent-file.txt exist in storage connection TEST?"

### Expected Results
- Step 1: The answer is that the file exists
- Step 2: The answer is that the file does not exist

---

## Scenario 6: Copy and Move a File

**Area:** Core Functionality

### Setup
1. Complete Scenario 4 (file "test-upload.txt" exists in storage)

### Steps
1. Ask the assistant: "Copy test-upload.txt to test-copy.txt in storage connection TEST."
2. Ask the assistant whether "test-copy.txt" exists
3. Ask the assistant: "Move test-copy.txt to test-moved.txt in storage connection TEST."
4. Check in the storage account that "test-copy.txt" no longer exists and "test-moved.txt" does

### Expected Results
- Step 1: Copy completes without error
- Step 2: The copied file exists
- Step 3: Move completes without error
- Step 4: The original path is gone, the new path exists

---

## Scenario 7: Directory Operations

**Area:** Core Functionality

### Setup
1. Complete Scenario 1 (storage connection "TEST" exists)

### Steps
1. Ask the assistant: "Create a folder test-dir in storage connection TEST."
2. Ask the assistant whether the folder "test-dir" exists
3. Ask the assistant to list the folders in the root of storage connection TEST
4. Ask the assistant: "Delete the folder test-dir in storage connection TEST."

### Expected Results
- Step 1: The folder is created
- Step 2: The answer is that the folder exists
- Step 3: The list includes "test-dir"
- Step 4: The folder is deleted

---

## Scenario 8: Upload a Large File in Pieces

**Area:** Core Functionality

### Setup
1. Complete Scenario 1 (storage connection "TEST" exists)
2. Have a file of a few megabytes ready that the assistant can read (for example attached to the chat)

### Steps
1. Ask the assistant: "Upload this file to storage connection TEST as large-file.dat, in pieces."
2. While the upload runs, ask the assistant for its progress
3. Check in the storage account that the file is there

### Expected Results
- Step 1: The assistant starts an upload, sends the pieces and finishes it, without error
- Step 2: The progress shows how many pieces have been received
- Step 3: The complete file is in storage, with the size of the original

---

## Scenario 9: Cancel an Upload

**Area:** Error Handling

### Setup
1. Complete Scenario 1 (storage connection "TEST" exists)

### Steps
1. Ask the assistant to start uploading a file named "cancelled-file.dat" in pieces to storage connection TEST, and to cancel the upload before it is finished
2. Check in the storage account that no file "cancelled-file.dat" was written

### Expected Results
- Step 1: The upload is cancelled without error
- Step 2: The file does not exist in storage

---

## Scenario 10: Error Handling — Invalid Storage Code

**Area:** Error Handling

### Setup
1. Ensure no storage connection with code "INVALID" exists

### Steps
1. Ask the assistant: "List the files in storage connection INVALID."
2. Open **Bifrost Messages** and find the request

### Expected Results
- The assistant reports a clear error saying the storage connection was not found
- The request is shown with an error status and a readable message
- No unhandled exception or stack trace is shown to the user

---

## Scenario 11: Error Handling — Invalid Path

**Area:** Error Handling

### Setup
1. Complete Scenario 1 (storage connection "TEST" exists)

### Steps
1. Ask the assistant: "Read the file this/path/does/not/exist.txt from storage connection TEST."

### Expected Results
- The assistant reports a clear error saying the file was not found
- The request is shown on **Bifrost Messages** with an error status, not as a raw BC error dialog

---

## Scenario 12: Permission Verification — Minimal Permissions

**Area:** Permission Verification

### Setup
1. Create a test user in the BC sandbox
2. Assign only the "BIFROST Attach ori" permission set to the user (plus D365 BASIC)
3. Complete Scenario 1 as an admin user

### Steps
1. Connect the AI assistant as the test user
2. Ask the assistant: "List the files in the root of storage connection TEST."

### Expected Results
- The file list is returned successfully
- No permission errors occur for standard storage read operations

---

## Scenario 13: Permission Verification — No Permission

**Area:** Permission Verification

### Setup
1. Create a test user with only D365 BASIC (no "BIFROST Attach ori" permission set)

### Steps
1. Connect the AI assistant as the test user
2. Ask the assistant to list the files in storage connection TEST

### Expected Results
- The request fails with a clear permission error
- No data is exposed or modified

---

## Scenario 14: Delete a File

**Area:** Core Functionality

### Setup
1. Complete Scenario 4 (file "test-upload.txt" exists)

### Steps
1. Ask the assistant: "Delete the file test-upload.txt in storage connection TEST."
2. Ask the assistant whether "test-upload.txt" still exists

### Expected Results
- Step 1: Deletion completes without error
- Step 2: The answer is that the file does not exist

---

## Scenario 15: Extension Uninstallation

**Area:** Uninstallation

### Setup
1. Complete Scenario 1 (at least one storage connection configured)

### Steps
1. Navigate to "Extension Management" in the BC search bar
2. Find "Bifrost Attachments" in the list
3. Choose "Uninstall"
4. Confirm the uninstallation
5. Verify the extension is removed from the list
6. Search for "Bifrost Storage Setup" in the BC search bar

### Expected Results
- Step 4: Uninstallation completes without error
- Step 5: The extension no longer appears in the installed extensions list
- Step 6: The search returns no results (setup page is gone)
- Standard BC functionality continues to work normally

---

## Scenario 16: Discover the Storage Operations

**Area:** Core Functionality

### Setup
1. Complete Scenario 1 (extension installed)

### Steps
1. Ask the assistant: "What can you do with files in Business Central storage?"
2. Open the **Bifrost Message Types** page in Business Central

### Expected Results
- The assistant describes the storage operations (files, folders, uploads, attachments), read from Business Central itself
- The **Bifrost Message Types** page lists the storage operations of Bifrost Attachments with a description of each

---

## Cleanup

After all scenarios are complete:
1. Delete test files from storage: `test-upload.txt`, `test-moved.txt`, `large-file.dat`
2. Delete test directory: `test-dir`
3. Remove the "TEST" storage connection from Bifrost Storage Setup
4. Uninstall the extension (if not already done in Scenario 15)
