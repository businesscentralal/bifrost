---
id: email-draft-set
title: "Email.Draft.Set"
sidebar_label: "Email.Draft.Set"
sidebar_position: 31
description: "Beiðni- og svarsamningur fyrir Email.Draft.Set Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Býr til an email draft in the Business Central Email Outbox. This skilaboðategund NEVER Sendir the
message: it resolves an Email Scenario, builds the message, adds hvaða attachments, saves the draft,
og Skilar the outbox URL. A person verður að opið the Email Outbox in the BC client og press Send.
There er no send flag og no other skilaboðategund in this API Sendir free-form email.

## Prerequisite
An email account verður að be configured in Business Central (Email Accounts page) og be reachable með
the resolved Email Scenario. án one the call fails með "The specified email account does ekki
exist". The Villa er raised með the platform og er returned in the language of the calling session.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| til | Text eða fylki of Text | Yes | Recipient(s); strings may be `;` eða `,` separated |
| subject | Text | Yes | Email subject |
| htmlBody | Text | No | HTML body (alias: `body`) |
| cc | Text eða fylki of Text | No | CC recipients |
| bcc | Text eða fylki of Text | No | BCC recipients |
| emailScenario | Text | No | Heiti of an `Email Scenario` enum Gildi |
| relatedTableId | heiltala | No | notað til infer scenario þegar `emailScenario` er omitted |
| attachments | fylki of objects | No | Zero eða more attachments; Sjá **Attachments** below |

## Attachments

`attachments` er valfrjálst og accepts zero eða more færslur. hver færsla er a JSON hlutur that verður að
contain `fileName` plus **exactly one** content Uppruni.

| Reitur | áskilið | Lýsing |
|-------|----------|-------------|
| fileName | Yes | Attachment file Heiti þar á meðal extension, max 250 characters. notað verbatim. |
| contentBase64 | One of the two | Raw base64 of the file bytes. Decoded server-side í the attachment. |
| url / contentUrl | One of the two | An `http` eða `https` address that BC downloads server-side. |
| contentType | No | MIME Gerð. Defaults til `application/octet-stream`. Set it so the recipient's mail client renders the file correctly, fyrir example `application/pdf`, `image/png`, `text/csv`. |

### Which Uppruni til nota

nota `contentBase64` whenever the bytes already exist somewhere you getur lesa, which er the normal
case þegar the file lives inside Business Central. nota `url` aðeins fyrir files that eru published on a
web address the Business Central service itself getur reach.

### contentBase64 rules
- Supply standard base64 text aðeins. Do ekki wrap it in a data URI: `data:application/pdf;base64,...`
  er rejected, because the prefix er ekki gilt base64.
- Do ekki URL-encode it og do ekki add quotes beyond normal JSON strengur quoting.
- Base64 inflates the payload með roughly 33 percent over the raw file size. Keep the whole request
  inside the gateway payload limit; fyrir very large files publish them og nota `url` instead.
- ógilt base64 fails fast með a message naming the attachment.

### url / contentUrl rules
- BC performs a plain server-side HTTP GET. **No authentication headers eru sent.**
- The address verður að therefore be publicly reachable úr the Business Central service. These all
  fail: `data:` URIs, `file:` paths, UNC paths, `localhost`, private network addresses, og hvaða
  BC eða Graph API endpoint that requires a token.
- A non-2xx response fails með the HTTP status code in the Villa message.

### Getting base64 out of Business Central
Anything stored in BC as a BLOB eða Media Reitur, eða returned með another skilaboðategund as base64, getur
be attached directly:
- `Data.Records.Get` með `fieldNumbers` on a BLOB eða Media Reitur Skilar that Reitur base64-encoded.
  Request the single Reitur you need so Svarið stays small.
- Message types that return a base64 payload, fyrir example `Sales.SalesInvoice.Pdf`,
  `Sales.SalesCreditMemo.Pdf`, `Sales.SalesShipment.Pdf` og `Customer.Statement.Pdf`. Look fyrir a
  `dataBase64` eða equivalent property in Svarið.

Pass the returned Gildi í `contentBase64` unchanged. No decoding, re-encoding eða hosting step er
needed.

## Scenario Forgangsröð úrlausnar
1. Explicit `emailScenario` Gildi.
2. Inferred úr `relatedTableId`:
   - viðskiptamanni (18), Sales Header (36), Sales reikningur Header (112), Sales Cr.Memo Header (114) -> `Sales`
   - birgi (23), Purchase Header (38), Purch. Inv. Header (122), Purch. Cr. Memo Hdr. (124) -> `Purchasing`
   - Approval færsla (454) -> `Approvals`
3. `Default` scenario.
4. `Bifrost Setup`.`Default Email Scenario` ef set.
5. fyrsta available scenario.

## Dæmi um beiðni: attach a PDF that lives in BC
```json
{
  "type": "Email.Draft.Set",
  "data": {
    "to": "jane@example.com",
    "subject": "Invoice copy",
    "htmlBody": "<p>A copy of the posted invoice is attached.</p>",
    "attachments": [
      {
        "fileName": "invoice-103045.pdf",
        "contentType": "application/pdf",
        "contentBase64": "JVBERi0xLjQKJeTjz9IK..."
      }
    ]
  }
}
```

## Dæmi um beiðni: attach úr a opinbert URL
```json
{
  "type": "Email.Draft.Set",
  "data": {
    "to": "jane@example.com",
    "cc": ["lead@example.com"],
    "subject": "Order confirmation",
    "htmlBody": "<p>Hi Jane,</p><p>Please find the order confirmation attached.</p>",
    "relatedTableId": 36,
    "attachments": [
      { "url": "https://example.com/files/SO-1023.pdf", "fileName": "SO-1023.pdf", "contentType": "application/pdf" }
    ]
  }
}
```

## Dæmi um beiðni: several attachments, mixed sources
```json
{
  "type": "Email.Draft.Set",
  "data": {
    "to": "jane@example.com;john@example.com",
    "subject": "Month end package",
    "htmlBody": "<p>Two files attached.</p>",
    "attachments": [
      { "fileName": "receipt.pdf", "contentType": "application/pdf", "contentBase64": "JVBERi0..." },
      { "fileName": "summary.csv", "contentType": "text/csv", "url": "https://example.com/summary.csv" }
    ]
  }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "messageId": "...",
  "outboxSystemId": "...",
  "outboxUrl": "https://businesscentral.../...",
  "emailScenarioResolved": "Sales"
}
```

## Villur
| Condition | Villa message |
|-----------|---------------|
| vantar til | `Missing required field 'to' in request.` |
| vantar subject | `Missing required field 'subject' in request.` |
| Unknown scenario | `Email scenario '{name}' is not supported in this environment.` |
| Attachment færsla er ekki an hlutur | `Each entry in 'attachments' must be a JSON object.` |
| Attachment vantar fileName | `Attachment entry must include 'fileName'.` |
| Attachment has no content Uppruni | `Attachment '{fileName}' must include exactly one content source: 'contentBase64' with raw base64 bytes, or 'url' / 'contentUrl' with an http or https address. Data URIs are not supported.` |
| Attachment has both sources | `Attachment '{fileName}' specifies both 'contentBase64' and 'url' / 'contentUrl'. Supply exactly one content source.` |
| Attachment base64 er ógilt | `Attachment '{fileName}' has invalid 'contentBase64' content. Supply standard base64 text without a data URI prefix.` |
| Attachment download mistókst | `Failed to download attachment from URL '{url}' (HTTP {status}).` |

A mistókst attachment aborts the whole call: no draft er saved, so nothing needs cleaning up.

## Agent Playbook
1. Decide the Uppruni fyrsta. ef the file er already in BC eða er returned með another skilaboðategund as
   base64, nota `contentBase64`. Reach fyrir `url` aðeins fyrir genuinely opinbert web addresses.
2. Do ekki try til smuggle bytes through `url` með a data URI. It er rejected með design.
3. eftir a tókst call, tell the user the draft er waiting og give them `outboxUrl`: this
   skilaboðategund does ekki send, og no other skilaboðategund mun send it fyrir them.

## Tengdar skilaboðategundir
- `User.Notification.Send`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

