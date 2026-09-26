---
id: errors
title: "Errors and warnings"
sidebar_position: 2.5
description: "The error and warning shape of every Bifröst message type: stable codes, the parameter concerned, what was received and expected, what to do next, and all problems at once."
---

Every Bifröst message type reports problems the same way. An error tells you which part of the
request was wrong, what Bifröst received, what it expected and what to do next - and when a request
has several problems, it lists **all of them at once**, so the next call can fix everything.

## An error

```json
{
  "status": "Error",
  "code": "RecordNotFound",
  "error": "Vendor \"99999\" was not found (from subject).",
  "parameter": "subject",
  "received": "99999",
  "nextStep": "Check the number with Data.Records.Get on table Vendor.",
  "hint": "For usage details, call the \"Help.Implementation.Get\" message type with subject \"Purchase.Document.Create\"."
}
```

| Field | Meaning |
|---|---|
| `status` | `Error`. |
| `code` | A stable, language-neutral code - see [Codes](#codes). Branch on this, not on the text. |
| `error` | The message for a person. It may be translated. |
| `parameter` | The request part the error is about: `subject`, a JSON key such as `entryNo`, or a path such as `lines[2].no`. |
| `received` | The value Bifröst received (at most 250 characters). |
| `expected` | What was expected, for example `number`, `GUID` or `integer`. |
| `nextStep` | What to do now for this error. |
| `hint` | Where to read more: the message type's own help. Not given for the `Help.*` types. |

Fields that do not apply are left out.

## Several errors

When a request has more than one problem, all of them are listed in `errors`, each with the fields
above, under a top-level `code` (usually `MultipleErrors`) and a summary:

```json
{
  "status": "Error",
  "code": "InvalidLine",
  "error": "3 problems in the request. Nothing was created.",
  "errors": [
    { "code": "RecordNotFound", "error": "Item \"1896-X\" was not found.", "parameter": "lines[2].no", "received": "1896-X",
      "nextStep": "Check the item number with Data.Records.Get on table Item." },
    { "code": "InvalidParameterFormat", "error": "\"abc\" is not a valid number.", "parameter": "lines[3].quantity", "received": "abc", "expected": "number" },
    { "code": "MissingParameter", "error": "Required parameter \"quantity\" is missing.", "parameter": "lines[4].quantity" }
  ],
  "hint": "For usage details, call the \"Help.Implementation.Get\" message type with subject \"Purchase.Document.Create\"."
}
```

Fix them all before calling again.

## Warnings

A successful response can carry `warnings`: problems that did not stop the call.

```json
{
  "status": "Success",
  "warnings": [
    { "code": "LinesSkipped", "message": "Line 2 was skipped.", "parameter": "lines[2]", "nextStep": "Fix line 2 and send it again." }
  ]
}
```

Each warning has `code` and `message`, and `parameter` and `nextStep` when they apply. Licence
warnings use the same array - see [Licensing](./licensing.md#warnings).

## Codes {#codes}

| Code | Meaning |
|---|---|
| `MissingParameter` | A required parameter or identifier is missing. |
| `InvalidParameterFormat` | A value has the wrong format - text where a number, date or GUID is expected. |
| `InvalidParameter` | A value is not allowed. |
| `RecordNotFound` | The record the request names does not exist. `parameter` and `received` say which identifier. |
| `AmbiguousRecord` | The identifier matches more than one record - for example a document number that exists as both an order and an invoice. Send it in the key of the type you mean. |
| `ConflictingIdentifiers` | Two identifiers were given that point to different records. Send only one. |
| `InvalidFilterField` | A filter names a field that does not exist. |
| `InvalidLine` | One or more document or journal lines are invalid. |
| `NothingToPreview` | There is nothing to preview. |
| `LinesSkipped` | Warning: some lines were skipped. |
| `BlockedByWriteGuard` | The change-log write guard blocks the write. |
| `PreconditionFailed` | The data is not in the state the operation needs - for example an unbalanced journal. |
| `PermissionDenied` | The caller lacks the permission the operation needs, or the table is restricted. |
| `LimitExceeded` | The request exceeds a limit. |
| `BusinessCentralError` | Business Central refused the operation; `error` is its own message. |
| `MultipleErrors` | The top-level code of a response that lists several errors in `errors`. |

Applications built on Bifröst Foundation can add codes of their own. An error without a `code` comes
from an application that does not use the codes yet.

## Record identifiers

A message type that works on one record - a customer, a document, a ledger entry - finds it from the
`subject` or from JSON keys such as `no`, `systemId` or `orderNo` (each type's help lists them).
Every identifier you send is tried, and the answer tells the cases apart:

- nothing given → `MissingParameter`, listing the accepted keys;
- given but not found → `RecordNotFound`, naming the value and where it came from;
- given but malformed → `InvalidParameterFormat`;
- two identifiers for different records → `ConflictingIdentifiers`;
- a plain document number that matches several document types → `AmbiguousRecord`.

## No call stack

Error responses never contain a call stack. Origo receives it through telemetry when a message type
fails, together with the message id - quote the message id when you report a problem.
