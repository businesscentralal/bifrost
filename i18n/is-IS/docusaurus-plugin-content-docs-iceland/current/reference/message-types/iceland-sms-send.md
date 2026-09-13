---
id: iceland-sms-send
title: "Iceland.SMS.Send"
sidebar_label: "Iceland.SMS.Send"
sidebar_position: 58
description: "Beiðni- og svarsamningur fyrir Iceland.SMS.Send Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sends SMS via the Síminn magnSMS API til Icelandic mobile numbers.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Authentication:** Síminn magnSMS API credentials — configure via **Bifrost Iceland Setup**.

## Notað þegar
- Sending transactional notifications til Icelandic mobile numbers (order confirmations, reminders, alerts).
- Sending marketing SMS til opted-in recipients.
- Scheduling a future SMS delivery.
- Sending til a named recipient group defined in magnSMS.

## Beiðni

- **Subject**: Recipient MSISDN(s), comma-separated.
  - Icelandic mobile: 7 digits starting með 6, 7, eða 8 (e.g. `8881234`).
  - International: fulla number með country code (e.g. `003548881234`).
  - Cannot send til landlines (prefixes 4xx, 5xx — mun fail).
  - Mutually exclusive með `group` in data.

- **Body** (JSON object):

| Reitur | nauðsynlegt | Default | Lýsing |
|-------|----------|---------|-------------|
| `text` | Yes | — | Message body |
| `sender` | No | Setup value | Alphanumeric sender ID, max 11 chars |
| `group` | No | — | Named recipient group (instead of Subject) |
| `unicode` | No | true | UCS-2 encoding fyrir Icelandic chars (á,ð,é,í,ó,ú,ý,þ,æ,ö) |
| `deliveryReport` | No | false | Enable delivery status tracking |
| `scheduled` | No | — | ISO-8601 datetime fyrir future send |
| `reference` | No | — | Custom tracking reference |

## Svar

| Reitur | Lýsing |
|-------|-------------|
| `messageId` | Síminn message ID (Notaðu með `Iceland.SMS.Status`) |
| `recipients` | The MSISDN(s) sent til |
| `group` | The group Heiti (Ef group send) |

## Leiðbeiningar fyrir gervigreind/umboð
1. fyrir delivery tracking, set `deliveryReport: true` og store the returned `messageId`.
2. Poll `Iceland.SMS.Status` með the `messageId` til confirm delivery.
3. Always set `unicode: true` (default) Þegar the message may contain Icelandic characters.
4. fyrir bulk sends, Notaðu a named `group` defined in magnSMS rather than a long comma-separated subject Listi.
5. fyrir scheduled sends, format `scheduled` as ISO-8601 með timezone offset (Iceland er UTC+0 year-round, no DST).
6. Marketing sends require explicit prior consent — always check opt-in status áður en calling.
Capability boundary: outbound SMS Aðeins; no inbound (two-way SMS not supported in Iceland).

## Character Limits & Billing

| Encoding | stakan SMS | Per segment (concatenated) |
|----------|-----------|---------------------------|
| Unicode/UCS-2 (default) | 70 chars | 67 chars |
| GSM-7 (unicode=false) | 160 chars | 153 chars |

Messages exceeding stakan-SMS length split sjálfkrafa.
Each segment er billed as one SMS.
Notaðu unicode=true (default) whenever text contains Icelandic characters.

## Iceland SMS Regulations

### Sending Hours
Marketing SMS: 09:00–20:00 UTC+0 Aðeins. Iceland has no daylight saving time.
Transactional/emergency SMS may be sent outside these hours.
Avoid Sundays og public holidays fyrir marketing.

### Consent (GDPR + ePrivacy Directive 2002/58/EC)
- Marketing: requires explicit prior consent (double opt-in recommended).
- Transactional: permitted without marketing consent.
- Existing customers: may message about similar products/services Ef opt-out er offered.

### Opt-Out Kröfur
Marketing messages verður að include an opt-out mechanism.
Support keywords: STOP, STOPP (Icelandic), HELP, HJÁLP (Icelandic).
Honor opt-outs within 24 hours.

### Content Restrictions
- URLs eru carrier-filtered unless whitelisted með Síminn/Nova/Sýn.
- Gambling keywords trigger automatic blocks.
- Allt CAPS eða excessive punctuation (!!!) may trigger spam filters.
- Prohibited: unlicensed gambling, adult content, unauthorized financial schemes.

### Sender ID
Alphanumeric sender IDs supported without pre-registration.
Max 11 characters. Notaðu brand Heiti fyrir recognition. Avoid special characters.

### Technical Notes
- Two-way SMS er NOT supported in Iceland (outbound Aðeins).
- Number portability er fully supported (routing er automatic).
- Carriers: Síminn, Nova, Sýn (formerly Vodafone Iceland).
- Country code: +354, MCC: 274.


