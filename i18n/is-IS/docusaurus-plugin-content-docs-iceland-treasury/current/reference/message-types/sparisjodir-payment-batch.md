---
id: sparisjodir-payment-batch
title: "Sparisjodir.Payment.Batch"
sidebar_label: "Sparisjodir.Payment.Batch"
sidebar_position: 156
description: "Beiðni- og svarsamningur fyrir Sparisjodir.greiðsla.Batch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir eina eða fleiri greiðsla batches til Sparisjóður **asynchronously** via the B2B `DoPayments` Kallaðu á. Svarið Skilar a `paymentsId`; Notaðu `Sparisjodir.Payment.Result` eða `Sparisjodir.Payment.ResultBatch` til poll fyrir per-line results.

**Stefna:** Inbound  
**Efnisgerð:** text/json

## Notað þegar
- You need til submit eina eða fleiri greiðsla batches og poll fyrir results later.
- The greiðsla run may take longer than the caller getur wait synchronously.
- You need a `paymentsId` that getur be stored og queried by a later process.

## Pre-greiðsla verification (do this áður en building lines)
Resolve og verify every destination against the bank áður en constructing lines — never guess a destination reikningur eða a slip amount.

- **Transfer lines (`kind = Transfer`)** — verify the destination reikningur og its owner með `Sparisjodir.Account.Verify` (`{bank, ledger, accountNumber, ownerPersonId}`) áður en adding the line. Aðeins add the transfer Þegar Svarið er `verified: true`. Confirm/normalize the source `outAccount` með `Sparisjodir.Account.Get` eða `Sparisjodir.Account.GetByOwner`.
- **greiðsla-slip lines (`kind = PaymentSlip`)** — look up the claim með `Sparisjodir.Bill.Get` (Listi outstanding bills) og `Sparisjodir.Bill.GetDetails` (fulla slip incl. the payable amount) til confirm the amount og exact key áður en adding the line. Pay what the bank reports — do not compute the amount yourself.

Map a confirmed bill (frá `Sparisjodir.Bill.GetDetails`) onto a `PaymentSlip` line:
| PaymentSlip line Reitur | Source bill Reitur |
|---|---|
| `recipientAccount` | `bank` + `ledger` + `number` (digits Aðeins, keep leading zeros) |
| `recipientAccountOwnerId` | `claimantId` |
| `personId` | `payorId` |
| `dueDate` | `dueDate` (the slip's gjalddagi; confirm against `Sparisjodir.Bill.GetDetails`) |
| `amount` | `amountDue` / details `amount` |

> `Sparisjodir.Bill.GetDetails` requires BOTH `payorId` og `claimantId` (take them frá the `Sparisjodir.Bill.Get` row); see that Gerð's help.

## STP — Straight Through Processing
STP (Straight Through Processing) batches eru **not allowed** by this connector. Any batch whose `nameOfBatch` starts með `STP` (case-insensitive) er rejected með an error áður en it reaches the bank.

## Approval process
Allt batches submitted through this connector require manual approval in the online bank áður en the bank processes them.
- **A-users**: getur create og pay batches that have already been approved by a B-user.
- **B-users**: getur approve batches submitted by others but cannot approve their own batches.
A batch með `NotConfirmed` status verður að be approved áður en the bank processes it.

## Beiðni
```json
{
  "batches": [
    {
      "outAccount":           "0133260195661234",   // (required) Spar source account (no separators)
      "outAccountOwnerId":    "1234567890",          // (optional) kennitala of account owner
      "dateOfForwardPayment": "2026-06-30",          // (optional) ISO date for future payment; defaults to today if omitted
      "nameOfBatch":          "*Salaries June",      // (optional) prefix * = visible to all company users
      "isOneToMany":          true,                  // (recommended) true = one withdrawal per batch
      "rollbackOnError":      false,                 // (optional) true = reject whole batch on first error
      "lines": [
        { /* line object: use kind = Transfer or PaymentSlip */ }
      ]
    }
  ]
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu this sequence Þegar constructing calls programmatically:
0. **Execution mode defaults til stakan-Kallaðu á production mode**: create exactly one `Sparisjodir.Payment.Batch` Kallaðu á fyrir one user Beiðni unless the user explicitly asks fyrir testing, retries, eða multiple batches.
1. Choose `isOneToMany` deliberately: `true` = one total withdrawal frá `outAccount` fyrir the sum of Allt lines; `false` = one withdrawal per line.
2. Set `outAccount` til an Spar source reikningur without separators.
3. Include eina eða fleiri line objects in `lines`.
4. Omit `dateOfForwardPayment` fyrir immediate processing; connector defaults it til today.
5. fyrir scheduled processing, set `dateOfForwardPayment` explicitly (ISO `YYYY-MM-DD`).
6. Choose `rollbackOnError` deliberately: `true` = reject/roll back the fulla batch Ef any line fails; `false` = keep partial success og inspect Svarið fyrir which lines failed.
7. Save `paymentsId` + `logEntryNo` frá Svar og poll með `Sparisjodir.Payment.ResultBatch`.

### Production safety guard (verður að follow)
- Do **not** run exploratory/test submissions against the bank til discover formats in production mode.
- Ef a nauðsynlegt input er ambiguous eða likely invalid, stop og ask one targeted clarification question áður en sending.
- Ef the bank rejects Beiðnin, report the error og wait fyrir user confirmation áður en retrying.
- Aðeins send additional calls sjálfkrafa Þegar the user explicitly requested a retry strategy beforehand.
- Always include a unique `subject` og `nameOfBatch` that references the user intent fyrir traceability.

### Preflight checks áður en send
- Normalize Allt reikningur numbers til digits Aðeins (remove separators og spaces).
- Normalize kennitala values til digits Aðeins (remove hyphens/spaces).
- Normalize numeric amounts til integer JSON numbers (Dæmi: `10714`, not `10.714` text).
- Normalize dates til ISO `YYYY-MM-DD` áður en send (Dæmi: `2026-06-24`, not `24.06.2026`).
- fyrir mixed batches, verify whether the business expects one total withdrawal eða one withdrawal per line, then set `isOneToMany` accordingly.
- Decide whether partial success er acceptable; Ef yes, Notaðu `rollbackOnError = false` og read line-level results frá Svarið/polling flow.
- Validate transfer references against bank max length (keep short; e.g. `TRF1M`).
- Confirm greiðsla slip `recipientAccount` uses bank-accepted claim reikningur format.
- Confirm line count in payload equals requested operations (fyrir this scenario: one batch með two lines).

### Claim reikningur format note (greiðsla slip)
- Send `recipientAccount` as digits Aðeins; do not include separators.
- Keep leading zeros exactly as present eftir normalization.
- Ef the bank rejects a claim reikningur format, stop og ask the user til re-confirm the exact slip reikningur áður en retrying.

### Transfer line (`kind = Transfer`)
Notaðu fyrir reikningur-til-reikningur transfer. nauðsynlegt fields in practice:
- `recipientAccount` (destination reikningur)
- `amount`
- valfrjálst but recommended: `recipientAccountOwnerId`, `recipientReference`, `description`, `bookingId`

```json
{
  "kind": "Transfer",
  "recipientAccount": "031026009009",
  "recipientAccountOwnerId": "1102713369",
  "recipientReference": "TEST-200",
  "amount": 200,
  "description": "Transfer test 200 ISK",
  "bookingId": "XFER200"
}
```

### greiðsla slip line (`kind = PaymentSlip`)
Notaðu fyrir claim/slip greiðslur. JSON fields map til bank Claim XML as follows:
- `recipientAccount` -> `Claim/Account`
- `recipientAccountOwnerId` -> `Claim/Claimant`
- `personId` -> `Claim/PayorID`
- `dueDate` -> `Claim/DueDate`
- `isDeposit` -> `Claim/IsDeposit`

```json
{
  "kind": "PaymentSlip",
  "recipientAccount": "000166320770",
  "recipientAccountOwnerId": "6811023020",
  "personId": "4112032630",
  "dueDate": "2026-06-15",
  "isDeposit": false,
  "amount": 432640,
  "description": "Stadgreidsluskattur",
  "bookingId": "320770"
}
```

### fulla mixed-batch Dæmi (transfer + greiðsla slip)
```json
{
  "batches": [
    {
      "outAccount": "031026000336",
      "outAccountOwnerId": "4112032630",
      "nameOfBatch": "*TEST Mixed Batch",
      "isOneToMany": true,
      "rollbackOnError": false,
      "lines": [
        {
          "kind": "PaymentSlip",
          "recipientAccount": "000166320770",
          "recipientAccountOwnerId": "6811023020",
          "personId": "4112032630",
          "dueDate": "2026-06-15",
          "isDeposit": false,
          "amount": 432640,
          "description": "Stadgreidsluskattur",
          "bookingId": "320770"
        },
        {
          "kind": "Transfer",
          "recipientAccount": "031026009009",
          "recipientAccountOwnerId": "1102713369",
          "recipientReference": "TEST-200",
          "amount": 200,
          "description": "Transfer test 200 ISK",
          "bookingId": "XFER200"
        }
      ]
    }
  ]
}
```

### One Beiðni = one submission Dæmi
fyrir a Beiðni like "create one batch með two lines", the agent verður að send exactly one `Sparisjodir.Payment.Batch` Kallaðu á containing both lines.
Do not split í separate test calls fyrir transfer og greiðsla slip unless the user explicitly asks fyrir that behavior.

## Key batch fields
| Reitur | Notes |
|---|---|
| `isOneToMany` | Controls how the debit happens on `outAccount`: `true` = one total withdrawal fyrir the whole batch sum; `false` = one withdrawal per line. Dæmi: two lines totaling `1010714` með `true` produce one withdrawal fyrir `1010714`. |
| `nameOfBatch` | Default: visible Aðeins til the creator. Prefix með `*` til make visible til Allt fyrirtæki users. |
| `dateOfForwardPayment` | Future greiðsla date. Status becomes `OnHold` until the date arrives. Not supported fyrir reikningur types 36/38. |
| `rollbackOnError` | Controls atomicity: `true` = roll back the entire batch Ef any line has an error; `false` = keep successful lines og inspect Svarið/poll result til see which lines failed og which succeeded. |

## Async flow
1. Kallaðu á `Sparisjodir.Payment.Batch` með eina eða fleiri batch objects.
2. Store the returned `paymentsId`.
3. Kallaðu á `Sparisjodir.Payment.Result` fyrir one specific batch, eða `Sparisjodir.Payment.ResultBatch` fyrir Allt batches under the `paymentsId` (með valfrjálst filter).
4. Continue polling while `status` er `InProgress`; stop at a terminal status.

## Svar
```json
{
  "status": "Success",
  "paymentsId": "AB-2026-06-30-0001",
  "logEntryNo": 42
}
```

Svarið contains **Aðeins** the `paymentsId`. fulla per-line results eru available via `Sparisjodir.Payment.ResultBatch`.

## BatchStatus values (returned Þegar polling)
| Status | Meaning |
|---|---|
| `InProgress` | Bank er still processing. Keep polling. |
| `Completed` | Allt lines executed með góðum árangri. |
| `CompletedWithErrors` | Some lines succeeded; some had errors. |
| `NotConfirmed` | Awaiting approval in the online bank (non-STP). |
| `OnHold` | Future greiðsla awaiting its execution date. |
| `Cancelled` | Batch was cancelled áður en it ran. |

## Errors
- `Missing required 'batches' array (must contain at least one batch object)`
- `Invalid batch at index N: <reason>` — raised Þegar a batch entry cannot be parsed.

## Tracking tables Verkflæði

### áður en sending
Determine the BC debit-side context fyrir every greiðsla line:
- Which BC reikningur (`Account Type` + `Account No.`) mun be debited (Vendor, viðskiptavinur, G/L reikningur, eða bankareikningur).
- Which open ledger entry the greiðsla closes (`Applies-to Doc. Type` + `Applies-to Doc. No.`). Leave blank fyrir greiðslur not applied til a specific skjal.
- Which BC bankareikningur (`Bank Account No.`) matches the Spar source reikningur (`outAccount`) — this er the credit leg fyrir the journal.

### eftir receiving Svarið
1. **Write batch row**: `set_records` on table 10035960 "Spar greiðsla Batch":
   - `Payments ID` = `paymentsId` frá Svar
   - `Batch Status` = `InProgress`
   - `Batch Count` = number of batch objects submitted
   - `Line Count` = total greiðsla lines across Allt batches
   - `Bank Account No.` = the BC bankareikningur that corresponds til the Spar source reikningur
   - `Out Account` = `outAccount` frá the batch
   - `Date Of Forward Payment` = `dateOfForwardPayment`, Ef any
   - `Name Of Batch` = `nameOfBatch`, Ef any
   - `Submitted At` = now
   - `Request Log Entry No.` = `logEntryNo` frá Svar
2. **Write line rows**: `set_records` on table 10035961 "Spar greiðsla Line" — one row per submitted line:
   - `Batch Entry No.` = `Entry No.` frá step 1
   - `Batch No.` = 1-based index of the batch within the submission
   - `Line No.` = 1-based index of the line within the batch
   - `Account Type` = BC reikningur Gerð fyrir the debit leg
   - `Account No.` = BC reikningur no. fyrir the debit leg
   - `Applies-to Doc. Type` / `Applies-to Doc. No.` = open entry being paid (Ef applicable)
3. **Store** the `paymentsId` fyrir later polling með `Sparisjodir.Payment.Result` eða `Sparisjodir.Payment.ResultBatch`.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Sparisjóður was blocked by the Business Central environment...`, verify permission til change `Allow HttpClient Requests` og then enable it in Extension Management.

### Check permission áður en changing the setting
- Verify you have permission til update table **NAV App Setting** (AppID = 0FB9B76C-D2BE-462D-B026-D490D0724164) og til manage extension settings.
- Ef you do not have permission, ask a BC administrator til perform the change.

### Steps til resolve
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Spar Banki** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://<bank>-iobs.heimabanki.is`.


