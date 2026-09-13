---
id: help-implementation-get
title: "Help.Implementation.Get"
sidebar_label: "Help.Implementation.Get"
sidebar_position: 54
description: "Beiðni- og svarsamningur fyrir Help.Implementation.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar the runtime help markdown skjal fyrir hvaða skilaboðategund. Pass the skilaboðategund Heiti (e.g. `Help.Tables.Get`) in the Bifrost `subject`. The implementation looks up the enum Gildi og calls `GetMessageHelpAsMarkdownDocument` on the matching implementation codeunit.

## Stefna
Útgående

## Response Content Gerð
`text/markdown`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| subject | Text | Yes | skilaboðategund Heiti, e.g. `Help.Tables.Get` |

## Dæmi um beiðni
```json
{ "type": "Help.Implementation.Get", "subject": "Help.Tables.Get" }
```

## Uppbygging svars
Raw markdown text (no JSON envelope). The exact markdown returned með the target implementation help codeunit.

## Villur
| Condition | Villa message |
|-----------|---------------|
| subject er empty | `Subject field must contain the message type name (e.g., "Help.Tables.Get")` |
| subject ekki a known enum Gildi | `Message type "{name}" is not valid or not found.` |

## Tengdar skilaboðategundir
- `Help.MessageTypes.Get`

