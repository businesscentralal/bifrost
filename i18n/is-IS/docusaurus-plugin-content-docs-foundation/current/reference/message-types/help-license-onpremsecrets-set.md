---
id: help-license-onpremsecrets-set
title: "Help.License.OnPremSecrets.Set"
sidebar_label: "Help.License.OnPremSecrets.Set"
sidebar_position: 58
description: "Beiðni- og svarsamningur fyrir Help.License.OnPremSecrets.Set Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skrifar eða hreinsar tengiefni fyrir leyfi á eigin umhverfi fyrir núverandi fyrirtæki.

Viðskiptavinir með leyfi á eigin umhverfi fá nauðsynleg leyndarmál frá **Origo** með
leyfinu. Ekki búa til eða birta reikningsnöfn, lykla, gagnagrunnsauðkenni eða önnur
tengigildi á opinberu vefsvæði — límdu aðeins gildin sem Origo afhenti inn í þessa
skilaboðategund (eða hreinsaðu þau með `clearAll`).

### Hreinsa öll geymd leyndarmál fyrir eigin umhverfi
```json
{ "clearAll": true }
```

### Setja leyndarmál sem Origo afhenti

Sendu reitina sem Origo skráði fyrir leyfið þitt á eigin umhverfi. Heiti reita og lögun
þeirra tilheyra þeirri einkaaðfærslu, ekki þessari opinberu samningssíðu.
