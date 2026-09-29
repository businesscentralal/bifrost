# Message-type docs from AL source: findings

Notes behind `tools/generate-message-type-docs-from-source.mjs`: where the
message-type contract lives in an app's AL code, and what only exists at runtime.

## Where the data lives

| What the page shows | Where it comes from in source |
| --- | --- |
| The list of types | `enumextension <id> "<name>" extends "Message Type ori"` (Foundation: the `enum` itself). One `value(<ordinal>; "<Type.Key>")` per type; `Caption` is locked and equals the key. |
| Which code answers a type | `Implementation = "Msg Interface ori" = "<codeunit>"` on each enum value. |
| The help text (the whole page body) | The codeunit's `GetMessageHelpAsMarkdownDocument(var Argument)`. Apps route it to one help codeunit per domain (`GetHelp(MessageType, Argument)` with a `case` on the type), which builds Markdown with `TextBuilder`, locked labels or a small builder codeunit, and ends in `Argument.SetResponseMarkdown(...)`. |
| Request/response schema | There is no separate schema file. Parameters, response fields, examples and errors are part of the help Markdown (parameter tables, JSON examples). |
| Short description, direction | `GetDescription()` and `GetMessageDirection()` on the same codeunit (used by `--list-only`). |
| Version shown in help | `NavApp.GetCurrentModuleInfo` in the help code. `app.json` says `x.y.0.0`; AL-Go stamps the real build number, so it is passed with `--version`. |
| Owning app and docs route | The app whose source declares the enum value (its `app.json` name `Bifrost <Title>`), mapped to the route id as in `apps.ts`. The prefix table is kept only as a cross-check and warns when it disagrees. |
| The shared "Errors and warnings" section | Not in the app: Foundation's `Help.Implementation.Get` appends it to every non-`Help.*` type. The generator adds the same link the API tool writes. |
| `help-documents` files | None of the Bifröst apps ship Markdown help files; all help is AL code. |

## What cannot be derived from source

- **Anything read at runtime**: records (`Get`, `FindSet`, setup rows), the
  current user, company or session, `NavApp.GetCallerModuleInfo`, permissions.
  Help that uses them fails with file and line instead of guessing.
- **The installed catalogue**: `Enum::"Message Type ori".Names()` depends on which
  apps are installed, so a help type that lists "every type" (Foundation's
  `Help.MessageTypes.Get`) cannot be rendered from one repository.
- **The released version number**: see `--version`.
- **`IsEnabled()`**: it usually checks read permission on a setup table, so whether a
  type is enabled for a given user is a runtime answer. All declared, non-test types
  are documented, as the API tool does.
- **Cross-app help code**: when an app's help calls a codeunit in another repository,
  pass that repository with another `--source`.

## Behaviour notes

- AL string literals decode no escapes, so `\u2192`, `\n` or a `'\'` "line break" in a
  label reach the API, and the site, literally. They are source defects, not artefacts
  of the API path; the generator reproduces them faithfully and lists them as warnings.
- Output is deterministic: files are read in sorted order, pages are ordered like
  PowerShell's `Sort-Object`, and nothing depends on time or the network.
- Checked against the API generator: run on the Attachments source that produced
  the pages on `main`, the output is identical except for the generator name in the
  info box and the shared errors link, which Foundation added after those pages were
  generated.
