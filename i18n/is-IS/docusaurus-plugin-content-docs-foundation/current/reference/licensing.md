---
id: licensing
title: "Licensing"
sidebar_position: 7
---

Bifröst notar leyfislíkan sem byggir á **skilaboðakvóta**. Engin úthlutun á einstaka notendur
og engin athugun á leyfisþrepum. Tveir kvótapottar eru mældir, hvor um sig í **skilaboðum**:

| Pottur | Notað af |
|--------|----------|
| **Notandi** (User) | Skilaboð unnin í samhengi venjulegs notanda (gagnvirkt eða vefþjónusta). |
| **Forritsskráning** (App Registration) | Skilaboð unnin af Microsoft Entra forriti (þjónustuaðila). |

## Hvað telur

Skilaboð draga **eina** einingu úr potti kallandans þegar allt eftirfarandi á við:

- Skilaboðategundin er **ekki undanþegin**. `Help.*` og `Webhook.*` tegundir eru undanþegnar — þær
  keyra alltaf, eru aldrei stöðvaðar og draga aldrei af kvóta.
- Skilaboðin voru unnin **með árangri** (JSON-svar með `status` annað en `Success` telur ekki;
  svör sem ekki eru JSON, t.d. PDF/CSV, teljast árangursrík).

Talning og framfylgd fara fram á einum miðlægum stað þegar skilaboð eru unnin; einstakar útfærslur
skilaboðategunda framkvæma ekki leyfisathuganir.

## Hvað skilaboð kosta

Ein skilaboð. Það er ekkert gjaldvægi, enginn mælir og ekkert verð á hverja tegund: hvert
gjaldskylt kall kostar nákvæmlega eina einingu úr pottinum, og potturinn sem gjaldfært var á
er skráður í reitinn **Gjaldtegund** (Charge Type) á `Message ori` færslunni.

Skilaboðategund má hins vegar fá að vita að kallað hafi verið á hana. `Msg Metering ori` er
krókur sem grunnurinn kallar á eftir hvert árangursríkt kall sem er ekki undanþegið, svo
gjaldtöku- eða mælingalausn geti haldið eigið bókhald. Krókurinn hefur engin áhrif á
talninguna hér að ofan. Sjá [mælingaviðmótið](/foundation/reference/metering-interface/)
fyrir samninginn, og [Mæling skilaboðategundar](/extensibility/metering) fyrir hvernig háð
forrit tekur hann upp.

## Prufuútgáfa

Við uppsetningu er útvegaður prufukvóti upp á **1.000 Notanda + 1.000 Forritsskráningar** skilaboð
fyrir leigjandann.

## Framfylgd

Áður en gjaldfært skilaboð er unnið er pottur kallandans athugaður:

- Föst **100 skilaboða umlíðun** gildir, þannig að pottur heldur áfram að virka örlítið
  umfram keypt magn. Pottur telst uppurinn þegar eftirstöðvar hans eru komnar meira en 100
  skilaboð undir núll.
- Þegar potturinn er uppurinn **og** potturinn lokar (sjá hér að neðan) eru skilaboðin
  **ekki unnin** og skilað er formuðu villusvari (`status` = `Error`) með `requestUrl`.
- Ef eftirstöðvar eru óþekktar (ný uppsetning fyrir fyrstu samstillingu, eða leyfisþjónustan er
  tímabundið ónáanleg) er vinnsla **leyfð** (fail-open).

### Lokun eða viðvörun

Það sem gerist við uppurinn pott ræðst fyrir hvern pott. Stillingin er uppsetning en ekki
auðkenni, svo hún býr í IsolatedStorage með **einingaumfangi** — eitt gildi fyrir allan
leigjandann frekar en eitt fyrir hvert fyrirtæki:

| Lykill | Gagnaumfang | Pottur |
|--------|-------------|--------|
| `BlockOnMissingQuota-User` | `DataScope::Module` | Notandi |
| `BlockOnMissingQuota-AppRegistration` | `DataScope::Module` | Forritsskráning |

| Gildi | Áhrif |
|-------|-------|
| `true`, **eða lykilinn vantar** | Kallinu er hafnað með villunni um uppurinn kvóta hér að ofan. Að lykilinn vanti er venjulega staðan, svo þetta er virka gildið nánast alls staðar. |
| `false` | Kallið keyrir. Það er eftir sem áður gjaldfært á pottinn og svarið ber áfram kvótaviðvörunina — leigjandinn heldur einfaldlega áfram að vinna umfram keyptan kvóta. |

Lyklarnir eru skrifaðir af **leyfissamstillingunni** (`Usage Sync ori`) og engu öðru: engin
síða og engin skilaboðategund vörunnar setur þá. Í samstillingarkóðanum er `TODO` sem markar
hvar gildin verða lesin úr uppsetningarskjali Entra-leigjandans í Azure Cosmos DB. Þangað til
það skjal er til vantar lyklana og báðir pottar loka, nákvæmlega eins og Bifröst hefur alltaf
gert.

Virka gildi hvors potts sést á tveimur stöðum:

- skrifvarið í hópnum **Lokun við uppurinn kvóta** á síðunni **Tengingastaða Bifröst**, sem er
  aðgengileg úr **Leyfi**-hópnum á uppsetningarsíðu Bifröst. Gildi sem aldrei hefur verið
  samstillt er sýnt sem innbyggða sjálfgefna gildið frekar en sem geymd stilling;
- sem `blockOnMissingQuota` fyrir hvorn pott í JSON-leyfisstöðunni, sem lýst er undir
  [Að skoða stöðu](#að-skoða-stöðu).

## Viðvaranir um lágan kvóta

Árangursrík JSON-svör bera `warnings` fylki þegar pottur kallandans er að klárast:

| Eftirstöðvar | Alvarleiki | Merking |
|--------------|------------|---------|
| 1 til 100 | `approaching` | Kvótinn er við það að klárast. |
| 0 eða minna | `grace` | Kvótinn er uppurinn; potturinn gengur á 100 skilaboða umlíðunina. |
| meira en 100 undir núlli | `exhausted` | Umlíðunin er líka fullnýtt. Næst aðeins fyrir pott þar sem `blockOnMissingQuota` er `false` — annars var kallinu hafnað í stað þess að vara við. |

Uppsetningarsíða Bifröst sýnir einnig tilkynningu þegar annar potturinn fer undir 1.000.

## Dagleg samstilling notkunar

Notkun er tilkynnt til leyfisþjónustunnar einu sinni á dag **fyrir hvert fyrirtæki**:

- Fyrstu gjaldfæru skilaboð dagsins áætla bakgrunnsverk.
- Verkið telur gjaldfærð skilaboð hvers liðins dags eftir potti, endurnýjar eftirstöðvar
  beggja potta og núllstillir tilkynntu skilaboðin.
- Notkun er tilkynnt eftir **tætigildi fyrirtækis** undir **tætigildi leigjanda**.

```json
{
  "docType": "usage",
  "tenantId": "…",
  "companyId": "…",
  "date": "2026-09-05",
  "licenseType": "User",
  "quantity": 412
}
```

## Að skoða stöðu

- `Help.Bifrost.Get` skilar núverandi leyfisstöðu sem `licenseStatus`.
- `Help.License.Get` skilar leyfis- og reikningsskjölunum og ber nú sama `licenseStatus` hlut,
  svo kallandi sem les leyfisfærslur hvort eð er þarf ekki aðra ferð fram og til baka.
- `Help.License.Sync` (aðeins stjórnandi) þvingar samstillingu strax og skilar uppfærðri stöðu.
- **Leyfi**-staðreyndareiturinn á uppsetningarsíðunni sýnir sömu upplýsingar auk fjölda óskráðra
  skilaboða og dagsetningar síðustu samstillingar.

Leyfisstöðuhluturinn lítur svona út:

```json
"licenseStatus": {
  "tenantIdHash": "a7f3c1…",
  "companyIdHash": "b2d4e6…",
  "companyName": "CRONUS International Ltd.",
  "user":            { "remaining": 812, "valid": true, "blockOnMissingQuota": true },
  "appRegistration": { "remaining": -40, "valid": true, "blockOnMissingQuota": false }
}
```

| Reitur | Tegund | Merking |
|--------|--------|---------|
| `remaining` | heiltala / null | Skilaboð sem eftir eru í pottinum; `null` meðan ekkert gildi hefur verið samstillt. |
| `valid` | boolean | Ósatt um leið og potturinn er kominn fram úr 100 skilaboða umlíðuninni. |
| `blockOnMissingQuota` | boolean | `true` (sjálfgefið) hafnar köllum um leið og potturinn er uppurinn; `false` lætur þau keyra, gjaldfærir þau eftir sem áður og skilar áfram kvótaviðvöruninni. Skrifvarið — aðeins leyfissamstillingin skrifar það. |

## Að óska eftir leyfum

Notaðu **Óska eftir leyfi** á uppsetningarsíðu Bifröst (eða aðgerð tilkynningar um lágan kvóta)
til að opna drög að tölvupósti til Origo. Tölvupósturinn er forútfylltur með heiti fyrirtækisins,
**tætigildi leigjandakennis**, tætigildi fyrirtækjakennis og **raunverulegt leigjandakenni** svo
hægt sé að afgreiða beiðnina. Þar er einnig staðargeymir þar sem þú ættir að bæta við
viðeigandi upplýsingum um þig og fyrirtækið þitt áður en þú sendir.
