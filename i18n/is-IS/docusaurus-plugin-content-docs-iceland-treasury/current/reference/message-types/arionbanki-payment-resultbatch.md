---
id: arionbanki-payment-resultbatch
title: "Arionbanki.Payment.ResultBatch"
sidebar_label: "Arionbanki.Payment.ResultBatch"
sidebar_position: 32
description: "Beiðni- og svarsamningur fyrir Arionbanki.greiðsla.ResultBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Queries Niðurstaðan of a previously submitted `Arionbanki.Payment.Batch` Kallaðu á fyrir **one eða Allt batches** under a `paymentsId`, með valfrjálst line-level filtering. Notaðu this Þegar you submitted multiple batches og need a combined status view.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You submitted eina eða fleiri async greiðsla batches og need a combined eða filtered result.
- You want til filter bank results til errors, accepted lines, status rows, eða Allt rows.
- You want til Fyrirspurn Allt batches under one `paymentsId` in a stakan Kallaðu á.
- You need the confirmed bank Svar as the basis fyrir creating eða updating the greiðsla journal fyrir posting.

## Beiðni
```json
{
  "paymentsId":   "AB-2026-06-30-0001",  // required
  "filterStatus": "GetAll",               // (optional) GetStatus | GetErrors | GetOkay | GetAll
  "batchNo":      0                       // (optional) 0 = all batches; >0 = specific batch
}
```

## Filter behavior
| `filterStatus` | Skilar |
|---|---|
| `GetStatus` | Bank batch-status rows Aðeins (no line detail). |
| `GetErrors` | Aðeins lines where `isError = true`. |
| `GetOkay` | Aðeins lines where `isError = false`. |
| `GetAll` | Allt lines returned by the bank. |

## Svar
Same `batches[].lines[]` shape as `Arionbanki.Payment.Result`, plus batch-level `dateOfPayment`, `dateOfForwardPayment`, `outAccount`, `outAccountOwnerId`, og per-line claim cost fields.

## BatchStatus values
| Status | Meaning |
|---|---|
| `InProgress` | Bank er still processing. Continue polling. |
| `Completed` | Allt lines executed með góðum árangri. |
| `CompletedWithErrors` | Some lines succeeded; some had errors. |
| `NotConfirmed` | Awaiting approval in the online bank (non-STP). |
| `OnHold` | Future greiðsla awaiting its execution date. |
| `Cancelled` | Batch was cancelled áður en it ran. |

## Claim greiðslur — incurred costs
Lines frá claim greiðslur include cost-breakdown fields: `amountDue`, `defaultCosts`, `otherCosts`, `otherDefaultCosts`, `defaultInterest`, `noticeAndPaymentFee`, `discount`.
STP payers pay incurred costs sjálfkrafa. Non-STP payers receive an error Ef the confirmed amount differs frá the original claim amount.

## Errors
- `Missing required 'paymentsId' in the request`
- `'filterStatus' must be one of: GetStatus, GetErrors, GetOkay, GetAll`

## Tracking tables update

eftir each poll, update the tracking tables og — on terminal status — follow the normal process: read the confirmed bank Svar og create eða update the greiðsla journal fyrir posting.

1. **fyrir each batch in Svarið**: look up table 10036185 "Arion greiðsla Batch" by `Payments ID`.
2. **Update each batch row**: `set_records` on table 10036185:
   - `Batch Status` = `status` frá Niðurstaðan entry
   - `Last Polled At` = now
   - `Poll Count` += 1
   - `Result Log Entry No.` = `logEntryNo` frá Svar (contains the fulla XML með confirmed amounts og expense breakdowns)
   - Ef `Batch Status` changed since last poll: update table 10036186 "Arion greiðsla Line" `Batch Status` fyrir Allt lines under the batch entry
3. **On terminal status** (any status except `InProgress`): set `Completed At` = now.
4. **Create greiðsla journal** Þegar status er `Completed` eða `CompletedWithErrors` og `Journal Created` = false:
   a. Read line rows: `get_records` on table 10036186 "Arion greiðsla Line" filtered by `Batch Entry No.` = the batch `Entry No.`
   b. fyrir each successful (non-error) line, match by `Batch No.` + `Line No.` in Niðurstaðan XML til Sækja the confirmed `amount`.
   c. Create a gen. journal debit line: `Account Type` / `Account No.` fyrir the confirmed amount; set `Applies-to Doc. Type` / `Applies-to Doc. No.` Ef present.
   d. Create the balancing credit line against `Bank Account No.` frá the batch row.
   e. **Expense lines** (claim-Gerð greiðslur með incurred costs): read `defaultCosts`, `otherCosts`, `otherDefaultCosts`, `defaultInterest`, `noticeAndPaymentFee` frá Niðurstaðan XML.
      fyrir each non-zero cost, create an additional G/L debit journal line using these accounts:
      - `defaultCosts` + `otherCosts` + `otherDefaultCosts`: prompt fyrir the installation-specific G/L reikningur, unless it er already configured fyrir this installation.
      - `defaultInterest`: prompt fyrir the installation-specific G/L reikningur, unless it er already configured fyrir this installation.
      - `noticeAndPaymentFee`: prompt fyrir the installation-specific G/L reikningur, unless it er already configured fyrir this installation.
      Every installation verður að define eða confirm these expense accounts áður en the first journal er created. Do not invent reikningur numbers.
      eftir the user provides them, store them as installation-specific setup so later journals getur Notaðu the configured accounts without prompting again.
      Ef Niðurstaðan XML includes withholding tax on claim-greiðsla revenue, ask the user which asset reikningur til Notaðu áður en posting it.
   f. Set `Journal Created` = true on each processed line row og on the batch row.
5. **Error lines**: lines með `isError = true` eru skipped fyrir journaling; the error details eru in Niðurstaðan XML fyrir user review.
6. **Ef no expense fields eru non-zero**: create the normal greiðsla journal Aðeins; no extra expense journal lines eru needed.

Continue polling while any batch in the set has `Batch Status` = `InProgress`. Stop Þegar Allt have reached a terminal status.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add outbound allowlist entries based on this help text. Contact your Business Central administrator eða Origo support so they getur verify the correct outbound Endapunktur og apply the change through the normal extension/security review process.


