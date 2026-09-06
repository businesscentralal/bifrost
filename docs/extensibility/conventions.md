---
id: conventions
title: "Object and naming conventions"
sidebar_label: "Object and naming conventions"
sidebar_position: 7
description: "Object ID ranges, the ori affix, the 30-character limit, namespaces, bilingual captions, and where documentation lives."
---

# Object and naming conventions

These rules apply to every app in the Bifröst family. They are not style preferences: the
affix and the ID range are AppSource requirements, and the namespace and caption rules are
what keep several apps installable side by side in the same Icelandic tenant.

## Object ID ranges

**Every app has its own registered block.** Ranges are allocated in the shared object-range
workbook, and a block is registered there *before* any object uses it — for the product app
and, separately, for its test app.

| App | Product range | Test app range |
| --- | --- | --- |
| Bifrost Foundation | 10077885–10078384 | 98800–98999 |
| Bifrost Nornir | 10035535–10035634 | 96400–96499 |
| Bifrost Hnitbjorg | 10035635–10035684 | 96200–96299 |
| Bifrost Bragi | 10035335–10035484 | 96000–96199 |

The block goes into `app.json`:

```json
"idRanges": [
    {
        "from": 10035535,
        "to": 10035634
    }
]
```

Three rules govern the ranges.

**Never borrow from a neighbour.** When an app outgrows its block, the answer is to request
a new block, not to take the unused tail of the app next to it. A neighbour's spare
capacity is spare because that app will grow into it.

**Register the test app separately.** Test apps live in the 50000–99999 space and collide
easily — Nornir's test range was moved from 96300–96399 to 96400–96499 precisely because
another, unregistered app already occupied the first block on the shared containers. Check
the workbook, and check what is actually installed.

**A successor gets a new range.** An app replacing a published Cloud Events app does not
reuse the retired app's ids: the two are installed side by side while the take-over runs.
Nornir's range is the legacy Orchestrator range shifted by a fixed offset of −40500, which
is also why its install codeunit shifts stored object ids and enum ordinals by the same
amount — see [Install and upgrade](/extensibility/install-and-upgrade).

Message type enum values, request-log type values and every other extensible-enum value
your app registers come out of the same block.

## The ` ori` affix

`ori` is Origo's registered AppSource affix, and it is mandatory on **every** object — no
exceptions, in the product app and in the test app. It is used as a suffix:

```
Scheduled Entry ori          Storage File Get Impl ori       Msg Interface ori
Playbook Runner ori          Storage Type ori                Secret Store ori
```

`AppSourceCop.json` enforces it:

```json
{
  "mandatoryAffixes": ["ori"],
  "publisher": "Origo",
  "mandatorySuffix": "ori",
  "supportedCountries": ["IS", "GB", "DK", "NO", "SE", "FI", "DE", "FR", "NL", "AT", "CH", "IE", "PT", "ES"]
}
```

Note that the command-line compiler does not always raise the mandatory-affix rule
(`AS0011`); CI is the real gate. Check affixes yourself before pushing.

**The brand is not a prefix.** "Bifrost" belongs in the namespace, the app name, the
permission set names (`BIFROST Nornir ori`, `BIFROST PlaybAdm ori`) and in user-facing
captions — never in an object name. Objects are named after what they do:
`Scheduled Entry ori`, not `Bifrost Scheduled Entry ori`. Nor do apps carry a
customer-style three-letter prefix; the ` ori` suffix is the only affix.

## The 30-character limit

An AL object name is at most 30 characters, and the affix eats four of them. Plan for
26 characters of meaning.

This is why implementation codeunits are abbreviated the way they are:

```
"Storage File Get Impl ori"        instead of  Storage File Get Implementation
"Proj. Ledger Crt Inv Impl ori"    instead of  Project Ledger Create Invoice Implementation
"Req Log Default Masker ori"       instead of  Request Log Default Masker
```

Abbreviate consistently across an app — `Impl`, `Mgt`, `Msg`, `Reg`, `Ext` — and keep the
file name matching the object name. The dotted message type name is not subject to the
limit, so the enum value stays fully spelled out even when its implementation codeunit is
abbreviated.

## Namespaces

Every AL file declares a namespace on its first line. The pattern is
`Origo.Bifrost.<App>`, with `.Test` appended for the test app:

| App | Product namespace | Test namespace |
| --- | --- | --- |
| Bifrost Foundation | `Origo.Bifrost` | — |
| Bifrost Nornir | `Origo.Bifrost.Nornir` | `Origo.Bifrost.Nornir.Test` |
| Bifrost Hnitbjorg | `Origo.Bifrost.Hnitbjorg` | `Origo.Bifrost.Hnitbjorg.Test` |
| Bifrost Bragi | `Origo.Bifrost.Bragi` | `Origo.Bifrost.Bragi.Test` |

Foundation's public objects are all in `Origo.Bifrost`, so a dependent app's files that
touch them start:

```al
namespace Origo.Bifrost.Nornir;

using Origo.Bifrost;
```

A test app that reaches into its product app's internals needs `internalsVisibleTo` in the
product `app.json`:

```json
"internalsVisibleTo": [
    {
        "id": "194ecd04-5688-4af6-94bc-732c714251fc",
        "name": "Bifrost Nornir - Tests",
        "publisher": "Origo"
    }
]
```

## Bilingual captions

Every user-facing string carries the English text plus the Icelandic translation in a
`Comment`:

```al
Caption = 'Client Credentials', Comment = 'is-IS=Auðkenni biðlara';
ToolTip = 'Manage client credentials for external service authentication.', Comment = 'is-IS=Stjórna auðkennum biðlara fyrir ytri þjónustuvottun.';
```

This applies to captions, tooltips, labels and error messages — anything a user reads. Apps
declare both locales in `app.json`:

```json
"supportedLocales": ["en-US", "is-IS"]
```

and build with the `TranslationFile` feature so the XLIFF is generated.

Two things are **not** translated:

- **Message type identifiers.** They are the wire contract, so their captions repeat the
  name verbatim with `Locked = true`.
- **Technical tokens** — storage keys, telemetry event ids, JSON property names — which are
  also `Locked = true`.

### "Bifröst" in Icelandic

The Icelandic brand form is **Bifröst**, with the ö. English text uses "Bifrost" (the app
names on AppSource are `Bifrost Foundation`, `Bifrost Nornir` and so on), and every
Icelandic caption uses "Bifröst":

```al
Caption = 'Bifrost Setup', Comment = 'is-IS=Uppsetning Bifröst';
Caption = 'Bifrost Storage', Comment = 'is-IS=Bifröst geymsla';
```

Inflect it as Icelandic requires — `Uppsetning Bifröst`, `skráarbeiðnum Bifrastar`.

## Documentation

**Public documentation for every Bifröst app lives in the `businesscentralal/bifrost`
repository** — this site. That covers product documentation, context-sensitive help,
extensibility guidance and agent skills.

**An app repository keeps only `README.md`, `CHANGELOG.md` and code.** Nothing
customer-facing is written into an app repo, because it would then have to be found,
versioned and translated twice.

The help URL is a contract between an app and this site. Each app sets, in `app.json`:

```json
"contextSensitiveHelpUrl": "https://bifrost.origo.is/{0}/help/nornir/",
"supportedLocales": ["en-US", "is-IS"]
```

Business Central replaces `{0}` with the user's locale and appends the page's
`ContextSensitiveHelpPage` slug, so both locales sit behind a locale prefix. The route
segment (`nornir` above) is the app's id in the site's app list, and it is stable forever.

The in-product Markdown served by your help codeunits is separate from all of this, and is
covered in [Help codeunits](/extensibility/help-codeunits).

## Other `app.json` requirements

- `"publisher": "Origo"` and `"target": "Cloud"`.
- `application` and `platform` set to the target BC version.
- `brief`, `description`, `url`, `help`, `privacyStatement`, `EULA` and `logo` filled in —
  AppSource rejects a submission without them.
- `applicationInsightsConnectionString` set, so telemetry from the app is collected.
- The Foundation dependency, and any other Bifröst app you build on, listed explicitly.

## Checklist

- [ ] Range registered in the workbook, for the app and its test app, before any object uses it
- [ ] Every object name ends in ` ori` and is at most 30 characters
- [ ] `AppSourceCop.json` declares the affix, the publisher and the supported countries
- [ ] Every file declares `Origo.Bifrost.<App>`
- [ ] No brand name and no customer prefix in an object name
- [ ] Every user-facing string has an `is-IS` comment; Icelandic uses "Bifröst"
- [ ] Message type captions repeat the identifier with `Locked = true`
- [ ] Documentation written in `businesscentralal/bifrost`, not in the app repository
