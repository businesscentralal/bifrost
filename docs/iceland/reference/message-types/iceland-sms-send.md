---
id: iceland-sms-send
title: "Iceland.SMS.Send"
sidebar_label: "Iceland.SMS.Send"
sidebar_position: 58
description: "Request and response contract for the Iceland.SMS.Send Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Sends SMS via the Síminn magnSMS API to Icelandic mobile numbers.

**Direction:** Outbound  
**Content-Type:** text/json  
**Authentication:** Síminn magnSMS API credentials — configure via **Bifrost Iceland Setup**.

## Use when
- Sending transactional notifications to Icelandic mobile numbers (order confirmations, reminders, alerts).
- Sending marketing SMS to opted-in recipients.
- Scheduling a future SMS delivery.
- Sending to a named recipient group defined in magnSMS.

## Request

- **Subject**: Recipient MSISDN(s), comma-separated.
  - Icelandic mobile: 7 digits starting with 6, 7, or 8 (e.g. `8881234`).
  - International: full number with country code (e.g. `003548881234`).
  - Cannot send to landlines (prefixes 4xx, 5xx — will fail).
  - Mutually exclusive with `group` in data.

- **Body** (JSON object):

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `text` | Yes | — | Message body |
| `sender` | No | Setup value | Alphanumeric sender ID, max 11 chars |
| `group` | No | — | Named recipient group (instead of Subject) |
| `unicode` | No | true | UCS-2 encoding for Icelandic chars (á,ð,é,í,ó,ú,ý,þ,æ,ö) |
| `deliveryReport` | No | false | Enable delivery status tracking |
| `scheduled` | No | — | ISO-8601 datetime for future send |
| `reference` | No | — | Custom tracking reference |

## Response

| Field | Description |
|-------|-------------|
| `messageId` | Síminn message ID (use with `Iceland.SMS.Status`) |
| `recipients` | The MSISDN(s) sent to |
| `group` | The group name (if group send) |

## AI/Agent playbook
1. For delivery tracking, set `deliveryReport: true` and store the returned `messageId`.
2. Poll `Iceland.SMS.Status` with the `messageId` to confirm delivery.
3. Always set `unicode: true` (default) when the message may contain Icelandic characters.
4. For bulk sends, use a named `group` defined in magnSMS rather than a long comma-separated subject list.
5. For scheduled sends, format `scheduled` as ISO-8601 with timezone offset (Iceland is UTC+0 year-round, no DST).
6. Marketing sends require explicit prior consent — always check opt-in status before calling.
Capability boundary: outbound SMS only; no inbound (two-way SMS not supported in Iceland).

## Character Limits & Billing

| Encoding | Single SMS | Per segment (concatenated) |
|----------|-----------|---------------------------|
| Unicode/UCS-2 (default) | 70 chars | 67 chars |
| GSM-7 (unicode=false) | 160 chars | 153 chars |

Messages exceeding single-SMS length split automatically.
Each segment is billed as one SMS.
Use unicode=true (default) whenever text contains Icelandic characters.

## Iceland SMS Regulations

### Sending Hours
Marketing SMS: 09:00–20:00 UTC+0 only. Iceland has no daylight saving time.
Transactional/emergency SMS may be sent outside these hours.
Avoid Sundays and public holidays for marketing.

### Consent (GDPR + ePrivacy Directive 2002/58/EC)
- Marketing: requires explicit prior consent (double opt-in recommended).
- Transactional: permitted without marketing consent.
- Existing customers: may message about similar products/services if opt-out is offered.

### Opt-Out Requirements
Marketing messages MUST include an opt-out mechanism.
Support keywords: STOP, STOPP (Icelandic), HELP, HJÁLP (Icelandic).
Honor opt-outs within 24 hours.

### Content Restrictions
- URLs are carrier-filtered unless whitelisted with Síminn/Nova/Sýn.
- Gambling keywords trigger automatic blocks.
- ALL CAPS or excessive punctuation (!!!) may trigger spam filters.
- Prohibited: unlicensed gambling, adult content, unauthorized financial schemes.

### Sender ID
Alphanumeric sender IDs supported without pre-registration.
Max 11 characters. Use brand name for recognition. Avoid special characters.

### Technical Notes
- Two-way SMS is NOT supported in Iceland (outbound only).
- Number portability is fully supported (routing is automatic).
- Carriers: Síminn, Nova, Sýn (formerly Vodafone Iceland).
- Country code: +354, MCC: 274.

