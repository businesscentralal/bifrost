---
id: iceland-sms-status
title: "Iceland.SMS.Status"
sidebar_label: "Iceland.SMS.Status"
sidebar_position: 59
description: "Beiðni- og svarsamningur fyrir Iceland.SMS.Status Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Queries delivery status fyrir a previously sent SMS.
Poll this eftir calling `Iceland.SMS.Send` með `deliveryReport: true`.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Authentication:** Síminn magnSMS API credentials — configure via **Bifrost Iceland Setup**.

## Notað þegar
- Confirming delivery of a transactional notification (order confirmation, alert).
- Determining whether til retry a failed send.
- Cleaning up recipient lists (remove UNDELIVERABLE numbers).
- Aðeins meaningful Ef `deliveryReport: true` was passed til `Iceland.SMS.Send`.

## Beiðni

- **Subject** (nauðsynlegt): The `messageId` returned by `Iceland.SMS.Send`.
- **Body**: Not used. Leave empty eða pass `{}`.

## Svar

| Reitur | Lýsing |
|-------|-------------|
| `messageId` | The queried message ID |
| `deliveryStatus` | Current delivery state (see below) |
| `errorCode` | Carrier error code (0 = no error) |
| `timestamp` | UTC timestamp of the status event |

## Delivery Status Values

| Status | Meaning | Action |
|--------|---------|--------|
| ACCEPTED | Received by carrier, pending delivery | Poll again later |
| DELIVERED | með góðum árangri delivered til handset | Final — success |
| EXPIRED | Carrier retries exhausted (device off/unreachable) | Final — consider retry |
| UNDELIVERABLE | Invalid number, disconnected, eða landline | Final — remove frá Listi |
| REJECTED | Blocked by carrier (content/spam filter) | Final — review content |

## Leiðbeiningar fyrir gervigreind/umboð
1. Aðeins Kallaðu á this Ef `deliveryReport: true` was set during the send — otherwise status mun not be available.
2. ACCEPTED er a transient state — poll again eftir 30–60 seconds.
3. DELIVERED, EXPIRED, UNDELIVERABLE, og REJECTED eru terminal states — stop polling.
4. On UNDELIVERABLE: remove the number frá the send Listi (likely landline eða disconnected).
5. On REJECTED: review the message content — carrier spam eða content filter triggered.
6. Typical delivery time: &lt;30 seconds fyrir online devices.
Capability boundary: read-Aðeins status check; no message er modified eða re-sent.

## Notes

- Status er available Aðeins Ef `deliveryReport: true` was set on send.
- UNDELIVERABLE fyrir 4xx/5xx prefixes means landline (cannot receive SMS).
- Iceland carriers: Síminn, Nova, Sýn. Number portability er automatic.
- Errors: `Subject is required. Provide the messageId from Iceland.SMS.Send.` — subject missing.


