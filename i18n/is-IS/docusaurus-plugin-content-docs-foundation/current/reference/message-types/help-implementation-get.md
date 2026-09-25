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
Skilar keyrsluhjálp á Markdown-sniði fyrir hvaða skilaboðategund sem er. Settu heiti skilaboðategundarinnar, til dæmis `Help.Tables.Get`, í Bifröst `subject` reitinn. Útfærslan finnur samsvarandi enum-gildi og kallar `GetMessageHelpAsMarkdownDocument` á viðeigandi útfærslukóðaeiningu.

## Stefna
Útlæg

## Svarstegund
`text/markdown`

## Beiðnibreytur
| Reitur | Tegund | Nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| subject | Text | Já | Heiti skilaboðategundar, t.d. `Help.Tables.Get` |

## Dæmi um beiðni
```json
{ "type": "Help.Implementation.Get", "subject": "Help.Tables.Get" }
```

## Uppbygging svars
Hrátt Markdown (án JSON-umslags). Nákvæmlega sá Markdown-texti sem hjálparkóðaeining viðkomandi skilaboðategundar skilar.

## Tungumál
Keyrslu-Markdown er tækniskjölun fyrir forritara á ensku. `lcid` staðfærir Business Central birtitexta sem lýsigagnaendapunktar eins og `Help.Tables.Get` og `Help.Fields.Get` skila, en þýðir ekki Markdown-textann sem `Help.Implementation.Get` skilar.

## Villur
| Skilyrði | Villuboð |
|-----------|---------------|
| `subject` er tómt | `Subject field must contain the message type name (e.g., "Help.Tables.Get")` |
| `subject` er ekki þekkt enum-gildi | `Message type "{name}" is not valid or not found.` |

## Tengdar skilaboðategundir
- `Help.MessageTypes.Get`

