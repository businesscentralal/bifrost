---
id: help-messagetypes-get
title: "Help.MessageTypes.Get"
sidebar_label: "Help.MessageTypes.Get"
sidebar_position: 64
description: "Beiðni- og svarsamningur fyrir Help.MessageTypes.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar every Gildi of the `Bifrost Message Type` enum together með its filter tafla númer, Lýsing, og Stefna. nota this til discover what message types eru available in the current deployment, þar á meðal extensions that have added their own values.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Færibreyta | Location | Gerð | áskilið | Lýsing |
|-----------|----------|------|----------|-------------|
| subject | Bifrost Reitur | Text | No | þegar set, Skilar aðeins the skilaboðategund matching this Heiti. Omit til return all. |
| onlyEnabled | data (JSON body) | sanngildi | No | þegar `true`, Skilar aðeins message types enabled fyrir the current user. Sjálfgefið: `false`. |

## Request Examples

**All message types:**
```json
{ "type": "Help.MessageTypes.Get" }
```

**Single skilaboðategund með Heiti:**
```json
{ "type": "Help.MessageTypes.Get", "subject": "Data.Records.Get" }
```

**aðeins enabled types:**
```json
{ "type": "Help.MessageTypes.Get", "data": { "onlyEnabled": true } }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "result": [
    {
      "name": "Help.Tables.Get",
      "isEnabled": true,
      "filterTableNo": 0,
      "description": "Returns a list of all available tables in the database with their ID and name.",
      "messageDirection": "Outbound"
    }
  ]
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| Heiti | Text | Enum Gildi Heiti, notað as the message `type` (e.g. `Help.Tables.Get`) |
| isEnabled | sanngildi | `true` ef the current user has heimild til nota this skilaboðategund |
| filterTableNo | heiltala | 0 þegar generic, otherwise the BC tafla the skilaboðategund operates on |
| Lýsing | Text | Short Lýsing úr the implementation codeunit |
| messageDirection | Text | `Inbound` (skrifa) eða `Outbound` (lesa) |

## Tengdar skilaboðategundir
- `Help.Implementation.Get`
- `Help.Tables.Get`

