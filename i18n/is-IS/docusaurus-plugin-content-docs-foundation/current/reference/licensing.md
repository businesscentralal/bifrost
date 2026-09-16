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

## Sandkassi

Í **SaaS sandkassa**umhverfi hefur Bifröst sjálft **engin skilaboðatakmörk** — Notanda- /
Forritsskráningarpottarnir eru ekki framfylgdir þar. Það er aðskilið frá **opinbera
MCP-þjóninum**, sem takmarkar sandkassaumferð samt við **1.000 skilaboð á 24 klukkustundum**.

Fyrir ótakmarkaða sandkassanotkun á móti eigin umhverfi skaltu nota **staðbundinn MCP**-þjón
úr [businesscentralal/origo-bc-mcp](https://github.com/businesscentralal/origo-bc-mcp).

Uppsetningarleiðsögnin birtir þetta á Ljúka-skrefinu sem hópinn **Sandkassaleyfi** (aðeins
sýnilegur þegar umhverfið er sandkassi). Sjá
[Uppsetningarleiðsögn Bifröst — Ljúkaskref (sandkassi)](/help/foundation/bifrost-setup-wizard/#ljúkaskref-sandkassi).

## Framfylgd

Áður en gjaldfært skilaboð er unnið er pottur kallandans athugaður:

- Lítil umlíðun getur gilt umfram keypt magn. Nákvæm stærð umlíðunar og tengd bilunarhegðun
  tilheyra viðskiptasamningi viðskiptavinar; þær eru ekki birtar hér.
- Þegar potturinn er uppurinn **og** potturinn er stilltur til að loka eru skilaboðin
  **ekki unnin** og skilað er formuðu villusvari:

  ```json
  { "status": "Error", "error": "Message quota for the User pool is exhausted. Visit … to request additional licenses.", "requestUrl": "…" }
  ```

- Þegar eftirstöðvar eru óþekktar (t.d. fyrir fyrstu samstillingu) getur varan samt leyft
  vinnslu. Lítið á það sem rekstrarlega smáatriði leyfisþjónustunnar, ekki sem tryggingu
  fyrir að köll takist alltaf án kvóta.

### Lokun eða viðvörun

Það sem gerist við uppurinn pott ræðst fyrir hvern pott. Virka gildið fyrir hvorn pott birtist
sem `blockOnMissingQuota` í JSON-leyfisstöðunni (sjá
[Að skoða stöðu](#að-skoða-stöðu)):

| Gildi | Áhrif |
|-------|-------|
| `true` (venjulega sjálfgefið) | Kallinu er hafnað með villunni um uppurinn kvóta hér að ofan. |
| `false` | Kallið keyrir. Það er eftir sem áður gjaldfært á pottinn og svarið ber áfram kvótaviðvörunina — leigjandinn heldur einfaldlega áfram að vinna umfram keyptan kvóta. |

Kallarar eiga að lesa `blockOnMissingQuota` úr opinbera stöðusvarinu frekar en að gera ráð
fyrir tiltekinni geymslu eða stjórnunarviðmóti.

## Viðvaranir um lágan kvóta

Árangursrík JSON-svör bera `warnings` fylki þegar pottur kallandans er að klárast.
Alvarleikagildi sem þú gætir séð:

| Alvarleiki | Merking |
|------------|---------|
| `approaching` | Kvótinn er við það að klárast. |
| `grace` | Kvótinn er uppurinn; lítil umlíðun getur enn gilt. |
| `exhausted` | Potturinn er fullnýttur. Næst aðeins fyrir pott þar sem `blockOnMissingQuota` er `false` — annars var kallinu hafnað í stað þess að vara við. |

```json
{
  "status": "Success",
  "result": { "...": "..." },
  "warnings": [
    { "code": "LicenseQuota", "severity": "approaching", "message": "…", "pool": "User", "remaining": 420, "requestUrl": "…" }
  ]
}
```

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
- `Help.License.Get` skilar leyfis- og reikningsfærslum og ber sama `licenseStatus` hlut,
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
| `valid` | boolean | Ósatt um leið og potturinn er kominn fram úr umlíðun og telst ekki lengur innan kvóta. |
| `blockOnMissingQuota` | boolean | `true` (sjálfgefið) hafnar köllum um leið og potturinn er uppurinn; `false` lætur þau keyra, gjaldfærir þau eftir sem áður og skilar áfram kvótaviðvöruninni. Skrifvarið frá sjónarhóli kallanda — endurnýjað við leyfissamstillingu. |

## Að óska eftir leyfum

Notaðu **Óska eftir leyfi** á uppsetningarsíðu Bifröst (eða aðgerð tilkynningar um lágan kvóta)
til að opna drög að tölvupósti til Origo. Tölvupósturinn er forútfylltur með heiti fyrirtækisins,
**tætigildi leigjandakennis**, tætigildi fyrirtækjakennis og **raunverulegt leigjandakenni** svo
hægt sé að afgreiða beiðnina. Þar er einnig staðargeymir þar sem þú ættir að bæta við
viðeigandi upplýsingum um þig og fyrirtækið þitt áður en þú sendir.
