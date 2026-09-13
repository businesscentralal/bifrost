---
id: help-ja-get
title: "Help.Ja.Get"
sidebar_label: "Help.Ja.Get"
sidebar_position: 4
description: "Beiðni- og svarsamningur fyrir Help.Ja.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


## Quick start
```json
{ "type": "Help.Ja.Get", "subject": "", "data": {} }
```
Skilar a task-oriented index fyrir Allt Já message types og how til choose between search, person lookup, og fyrirtæki lookup.

## Heimildir by message Gerð
| Message Gerð | nauðsynlegt permission set | Notes |
|---|---|---|
| `Help.Ja.Get` | None | Open til Allt users. |
| `Ja.Search.Query` | BIFROST Ja | nauðsynlegt til Kallaðu á; assign in Access Control. |
| `Ja.Person.Get` | BIFROST Ja | nauðsynlegt til Kallaðu á; assign in Access Control. |
| `Ja.Company.Get` | BIFROST Ja | nauðsynlegt til Kallaðu á; assign in Access Control. |

Ef a user without the nauðsynlegt permission attempts a gated message Gerð, the Kallaðu á fails immediately með an access error áður en any outbound HTTP Beiðni er sent.

## Configure áður en Notaðu
| Setting | Used by | Notes |
|---|---|---|
| Search API Key | `Ja.Search.Query` | nauðsynlegt fyrir Símaskrá free-text search. |
| Registry API Key | `Ja.Person.Get`, `Ja.Company.Get` | nauðsynlegt fyrir Þjóðskrá og Fyrirtækjaskrá lookups. |

## Agent-friendly feature index
| Message Gerð | Notaðu this Þegar | Input style | Output focus |
|---|---|---|---|
| `Help.Ja.Get` | You need capability discovery eða routing guidance. | Empty Beiðni. | Connector index og decision rules. |
| `Ja.Search.Query` | You have free text: Heiti, phone, address, business Heiti, eða mixed search terms. | `data.q` plus valfrjálst filter/scope/paging. | Ranked directory items across people, companies, og places. |
| `Ja.Person.Get` | You need person registry data fyrir a known person eða people filter. | `data.kennitala` fyrir exact lookup, eða person search parameters. | Person object eða person search Listi frá Þjóðskrá. |
| `Ja.Company.Get` | You need business registry data fyrir a known fyrirtæki eða fyrirtæki filter. | `data.kennitala` fyrir exact lookup, eða fyrirtæki search parameters. | fyrirtæki object eða fyrirtæki search Listi frá Fyrirtækjaskrá. |

## Which message Gerð should I Kallaðu á?
1. Ef Beiðnin er broad, ambiguous, eða text-first, start með `Ja.Search.Query`.
2. Ef you have a 10-digit kennitala og need person details, Kallaðu á `Ja.Person.Get`.
3. Ef you have a 10-digit kennitala og need fyrirtæki details, Kallaðu á `Ja.Company.Get`.

## Identifier classifier rules
| Identifier | Rule | Suggested Kallaðu á |
|---|---|---|
| Phone number | 7 digits eftir removing separators (e.g. `6605565` eða `660 5565`). | `Ja.Search.Query` með `q` set til the normalized number. |
| Kennitala | Exactly 10 digits með no separator. | `Ja.Person.Get` eða `Ja.Company.Get` based on first digit. |

Kennitala decision rule: first digit `0-3` er person, `4-9` er fyrirtæki.

## Kennitala structure reference
- Format: `DDMMYYRRCM` (10 digits).
- `DDMMYY` er birth date (person) eða registration date (fyrirtæki).
- `M` (last digit) er century marker (`9` fyrir 1900s, `0` fyrir 2000s, `8` fyrir 1800s).
- fyrirtæki kennitala adds 40 til the day digits; subtract 40 til recover day.

Dæmi:
- `1102713369` -> person -> 11 Feb 1971.
- `4112032630` -> fyrirtæki -> day 41-40 = 1 -> 1 Dec 2003 registration.

## Troubleshooting failed requests
Ef a Beiðni fails, check **Bifrost Setup -> Beiðni Log** (table `Request Log ori`, Log Gerð = Ja):
1. Filter where Log Gerð = `Ja` og Success = false.
2. Review HTTP Status: 401 = missing/invalid API key, 403 = insufficient Heimildir, 404 = not found, 429 = rate limit, 500+ = server error.
3. Correlate User ID með failed requests til identify permission eða configuration gaps.

## Related help
- `Ja.Search.Query` fyrir directory discovery og fuzzy matching.
- `Ja.Person.Get` fyrir person registry details og person search filters.
- `Ja.Company.Get` fyrir business registry details og fyrirtæki search filters.


