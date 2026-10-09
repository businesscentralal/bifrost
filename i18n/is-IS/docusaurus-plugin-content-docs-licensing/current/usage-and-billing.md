---
id: usage-and-billing
title: "Notkun og reikningsfærsla"
sidebar_position: 8
description: "Hver rukkar leigjandann þinn, hvernig notkun hans er tilkynnt og hvar þú sérð hana í Business Central."
---

## Hver rukkar þig

| Tegund leyfis | Rukkað af | Byggir á |
|---|---|---|
| **Fyrirframgreitt** | Origo | Skilaboðakvótanum sem þú kaupir, fyrir hvern pott. |
| **Áskrift** | **Samstarfsaðila** þínum hjá Bifröst | Skilaboðunum sem leigjandinn þinn notaði í mánuðinum, eftir [gjaldfærslutegund](./license-types.md#charge-types), auk þreps álagsþaks ofan við Frítt fyrir sandkassanotkun á opinbera MCP-þjóninum ef þú valdir slíkt - á því verði sem samið var um við samstarfsaðilann. |

## Hvernig notkun er tilkynnt

Hvert fyrirtæki tilkynnir gjaldskyld skilaboð sín til leyfisþjónustunnar einu sinni á dag, fyrir
hvern dag og hverja gjaldfærslutegund, í bakgrunnsverki sem fyrsta gjaldskylda kall dagsins ræsir.
**Samstilla** á Uppsetningu Bifröst tilkynnir öll óafgreidd skilaboð strax (nema skilaboð síðustu
fimm mínútna). Þar til skilaboð hafa verið tilkynnt eru þau talin sem *ótilkynnt* í upplýsingareitnum
Leyfi. Notkun úr sandkassaumhverfum er tilkynnt sérstaklega og er ekki rukkuð.

Hver tilkynning bætir við nýjum notkunarfærslum; færslu er aldrei breytt eftir á. Dagur getur því
haft nokkrar færslur af sömu gjaldfærslutegund - eina fyrir hverja tilkynningu - og notkun dagsins er
summa magns þeirra. Hvert skilaboð er tilkynnt nákvæmlega einu sinni, líka þegar tilkynning rofnar
og er reynd aftur.

Notkun er tilkynnt degi eða meira eftir að hún varð þegar fyrirtæki kallar ekkert daginn eftir eða
tilkynningin mistekst. Hver notkunarfærsla ber því tvær dagsetningar: **notkunardag** (daginn sem
skilaboðin voru notuð) og **skráningardag** (daginn sem færslan var tilkynnt).

## Hvar notkun er skoðuð

| Síða | Hvað hún sýnir |
|---|---|
| [Leyfisnotkun](/help/foundation/license-usage/) | Notkunarfærslur eigin fyrirtækja |
| [Upplýsingareiturinn Leyfi](/help/foundation/license-fact-box/) á Uppsetningu Bifröst | Tegund leyfis, eftirstöðvar kvóta hvors potts, skilaboð sem enn hafa ekki verið tilkynnt og síðustu samstillingu |

Hvort tveggja krefst heimildar til leyfisstjórnunar (heimildasafnið `BIFROST LicAdm ori`).
Gervigreindaraðstoðarmaður getur lesið sömu tölur í gegnum Bifröst; uppsettar skilaboðategundir og
samningar þeirra eru lesnir úr Business Central sjálfu: með MCP-tólunum `describe_domains` og
`describe_message_type` eða á síðunni Bifrost Message Types.
