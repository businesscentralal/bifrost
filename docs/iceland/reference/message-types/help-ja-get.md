---
id: help-ja-get
title: "Help.Ja.Get"
sidebar_label: "Help.Ja.Get"
sidebar_position: 4
description: "Request and response contract for the Help.Ja.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Quick start
```json
{ "type": "Help.Ja.Get", "subject": "", "data": {} }
```
Returns a task-oriented index for all Já message types and how to choose between search, person lookup, and company lookup.

## Permissions by message type
| Message type | Required permission set | Notes |
|---|---|---|
| `Help.Ja.Get` | None | Open to all users. |
| `Ja.Search.Query` | BIFROST Ja | Required to call; assign in Access Control. |
| `Ja.Person.Get` | BIFROST Ja | Required to call; assign in Access Control. |
| `Ja.Company.Get` | BIFROST Ja | Required to call; assign in Access Control. |

If a user without the required permission attempts a gated message type, the call fails immediately with an access error before any outbound HTTP request is sent.

## Configure before use
| Setting | Used by | Notes |
|---|---|---|
| Search API Key | `Ja.Search.Query` | Required for Símaskrá free-text search. |
| Registry API Key | `Ja.Person.Get`, `Ja.Company.Get` | Required for Þjóðskrá and Fyrirtækjaskrá lookups. |

## Agent-friendly feature index
| Message type | Use this when | Input style | Output focus |
|---|---|---|---|
| `Help.Ja.Get` | You need capability discovery or routing guidance. | Empty request. | Connector index and decision rules. |
| `Ja.Search.Query` | You have free text: name, phone, address, business name, or mixed search terms. | `data.q` plus optional filter/scope/paging. | Ranked directory items across people, companies, and places. |
| `Ja.Person.Get` | You need person registry data for a known person or people filter. | `data.kennitala` for exact lookup, or person search parameters. | Person object or person search list from Þjóðskrá. |
| `Ja.Company.Get` | You need business registry data for a known company or company filter. | `data.kennitala` for exact lookup, or company search parameters. | Company object or company search list from Fyrirtækjaskrá. |

## Which message type should I call?
1. If the request is broad, ambiguous, or text-first, start with `Ja.Search.Query`.
2. If you have a 10-digit kennitala and need person details, call `Ja.Person.Get`.
3. If you have a 10-digit kennitala and need company details, call `Ja.Company.Get`.

## Identifier classifier rules
| Identifier | Rule | Suggested call |
|---|---|---|
| Phone number | 7 digits after removing separators (e.g. `6605565` or `660 5565`). | `Ja.Search.Query` with `q` set to the normalized number. |
| Kennitala | Exactly 10 digits with no separator. | `Ja.Person.Get` or `Ja.Company.Get` based on first digit. |

Kennitala decision rule: first digit `0-3` is person, `4-9` is company.

## Kennitala structure reference
- Format: `DDMMYYRRCM` (10 digits).
- `DDMMYY` is birth date (person) or registration date (company).
- `M` (last digit) is century marker (`9` for 1900s, `0` for 2000s, `8` for 1800s).
- Company kennitala adds 40 to the day digits; subtract 40 to recover day.

Examples:
- `1102713369` -> person -> 11 Feb 1971.
- `4112032630` -> company -> day 41-40 = 1 -> 1 Dec 2003 registration.

## Troubleshooting failed requests
If a request fails, check **Bifrost Setup -> Request Log** (table `Request Log ori`, Log Type = Ja):
1. Filter where Log Type = `Ja` and Success = false.
2. Review HTTP Status: 401 = missing/invalid API key, 403 = insufficient permissions, 404 = not found, 429 = rate limit, 500+ = server error.
3. Correlate User ID with failed requests to identify permission or configuration gaps.

## Related help
- `Ja.Search.Query` for directory discovery and fuzzy matching.
- `Ja.Person.Get` for person registry details and person search filters.
- `Ja.Company.Get` for business registry details and company search filters.

