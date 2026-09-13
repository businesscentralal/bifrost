---
id: iceland-postcode-get
title: "Iceland.PostCode.Get"
sidebar_label: "Iceland.PostCode.Get"
sidebar_position: 51
description: "Beiðni- og svarsamningur fyrir Iceland.PostCode.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads the official Icelandic postal code registry (postnúmeraskrá) frá
Byggðastofnun og Skilar Allt entries as a JSON array.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need til validate eða look up Icelandic postal codes.
- You need til map postal codes til cities eða municipalities.
- You want til populate eða refresh the BC Post Code table með Icelandic data.

## Beiðni
```json
{}
```

No parameters nauðsynlegt. The Endapunktur downloads the current postal code registry.

## Svar
```json
{
  "status": "Success",
  "source": "Byggðastofnun - Postnúmeraskrá",
  "count": 150,
  "postCodes": [
    {
      "postCode": "101",
      "city": "Reykjavík",
      "municipality": "Reykjavíkurborg"
    }
  ]
}
```

## Svar Reitur notes
| Reitur | Notes |
|---|---|
| `postCode` | The 3-digit Icelandic postal code (as text til preserve leading zeros). |
| `city` | The place/area Heiti (Icelandic). |
| `municipality` | The municipality (sveitarfélag) the postal code belongs til. |

## Leiðbeiningar fyrir gervigreind/umboð
1. Kallaðu á með an empty body `{}` til Sækja the fulla postal code Listi.
2. Filter client-side by `postCode`, `city`, eða `municipality` as needed.
3. Notaðu `postCode` til validate addresses áður en posting skjöl.
4. Match `city` against the BC Post Code table fyrir master data Uppfærir.

## Errors
- Connection/HTTP errors Ef Byggðastofnun er unreachable.
- `The postal code file contained no data rows.` — file format may have changed.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Byggðastofnun was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://www.byggdastofnun.is`.


