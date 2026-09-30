---
id: storage-file-create
title: "Storage.File.Create"
sidebar_label: "Storage.File.Create"
sidebar_position: 18
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.File.Create."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Hleður einni lítilli base64-skrá upp á slóð. Fyrir stærri skrár skaltu nota Storage.Upload.Begin/Append/Commit.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.File.Create` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `CreateFile`
- **Beining:** `storageCode` beiðninnar velur línu í `Bifrost Storage Setup` og aðgerðin keyrir á skráarreikningi þeirrar línu. Finndu kóðana með `Storage.Account.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `storageCode` | **Já** | string | Uppsetta geymslutengingin sem á að nota. Finndu hana með Storage.Account.List. |
| `path` | **Já** | string | Áfangaslóð skrárinnar (miðað við grunnslóð tengingarinnar). |
| `contentBase64` | **Já** | base64 string | Allt innihald skrárinnar, base64-kóðað. Hafðu upphleðslur í einu kalli litlar; notaðu Storage.Upload.Begin fyrir stærri skrár. |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "notes/hello.txt", "contentBase64": "SGVsbG8gd29ybGQ=" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur `path` og `contentLength` (fjölda geymdra bæta).

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Ógilt base64-innihald | Gakktu úr skugga um að contentBase64 sé gilt base64 án bila í kring eða data-URI-forskeytis. |
| Slóð fannst ekki | Búðu fyrst til yfirmöppuna með Storage.Directory.Create ef tengillinn krefst þess. |

## Hliðarverkanir

Skrifar (og getur skrifað yfir) skrá í ytri geymslu þótt Direction sé Outbound. Líttu á það sem skrift þegar beðið er um staðfestingu.

## Athugasemdir
Notaðu þessa skilaboðategund fyrir litlar skrár sem rúmast vel í einni Bifrost-beiðni. Fyrir fyrirsjáanlegar upphleðslur stórra skráa skaltu nota `Storage.Upload.Begin`, bæta við bútum sem eru í mesta lagi 49152 RAW-bæti hver (um 64 KB í base64) og kalla svo á `Storage.Upload.Commit`. Ef skrá er búin til á slóð sem þegar er til er skrifað yfir hana hjá tenglum sem styðja yfirskrift (t.d. Azure Blob).

## Tengdar aðgerðir
- **Hlaða upp stærri skrá í hlutum:** `Storage.Upload.Begin`\- **Sækja skrána:** `Storage.File.Get`\- **Eyða skránni:** `Storage.File.Delete`

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

