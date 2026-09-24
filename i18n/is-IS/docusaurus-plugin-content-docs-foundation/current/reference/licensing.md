---
id: licensing
title: "Leyfisveitingar"
sidebar_position: 7
---

Þessi síða lýsir samningnum sem kallandi sér: hvaða köll eru talin, villunum sem kalli getur verið
hafnað með, viðvörununum sem árangursríkt svar getur borið og gögnum leyfisstöðunnar. Um sjálft
leyfislíkanið - fyrirframgreitt leyfi og áskrift, prufuleyfið, hlutverk söluaðila, samstarfsaðila
og viðskiptavinar og hver rukkar hvern - sjá [Leyfi og samstarfsáætlun](/foundation/licensing).

## Hvað er talið

Skilaboð draga **eina** einingu úr potti kallandans þegar **allt** eftirfarandi á við:

- Skilaboðategundin er **ekki undanþegin**. `Help.*` og `Webhook.*` tegundir eru undanþegnar - þær
  draga aldrei af kvóta og þeim er aldrei hafnað vegna kvóta.
- Skilaboðin voru unnin **með árangri** (JSON-svar þar sem `status` er annað en `Success` er ekki
  talið; svör sem eru ekki JSON, t.d. PDF/CSV, teljast hafa tekist).

Það er ekkert gjaldvægi og ekkert verð á hverja tegund: hvert gjaldskylt kall kostar nákvæmlega eina
einingu, og potturinn sem gjaldfært var á er skráður í reitinn **Gjaldtegund** (Charge Type) á
skilaboðunum. Talning og höfnun fara fram á einum miðlægum stað; einstakar skilaboðategundir
framkvæma ekki leyfisathuganir.

| Pottur | Notaður af |
|--------|------------|
| **Notandi** (User) | Skilaboðum sem unnin eru undir venjulegum notanda (gagnvirkt eða gegnum vefþjónustu). |
| **Forritsskráning** (App Registration) | Skilaboðum sem Microsoft Entra forrit (þjónustuaðili) vinnur. |

Skilaboðategund getur fengið að vita að kallað hafi verið á hana: `Msg Metering ori` er krókur sem
Foundation kallar á eftir hvert árangursríkt kall sem er ekki undanþegið, svo gjaldtökulausn geti
haldið eigið bókhald. Krókurinn hefur engin áhrif á talninguna. Sjá
[mælingaviðmótið](/foundation/reference/metering-interface/) og
[Mæling skilaboðategundar](/extensibility/metering).

## Hvers vegna kalli getur verið hafnað

Athuganirnar eru gerðar í þessari röð; sú fyrsta sem á við svarar kallinu með `"status": "Error"`,
og kallið er hvorki unnið né talið.

| Röð | Skilyrði | Á við um | Svar |
|---|---|---|---|
| 1 | Fyrirtækið hefur ekki samþykkt notendaleyfissamninginn | Öll köll, líka `Help.*` | `code: "EULA_REQUIRED"`, `setupUrl`, `setupWizardUrl` |
| 2 | Útleið HTTP-beiðnir eru ekki leyfðar fyrir Bifröst Foundation | Gjaldskyld köll, utan sandkassa | Villan nefnir uppsetningarsíðuna |
| 3 | Prufuleyfið hefur ekki verið virkjað | Gjaldskyld köll, utan sandkassa | `activationMethod: "Setup"`, `requestUrl` |
| 4 | Mánaðarlegum kvóta notandans er náð | Báðar tegundir leyfa, utan sandkassa | `quotaScope: "user"`, `requestUrl` |
| 5 | Mánaðarlegum kvóta fyrirtækisins er náð | Báðar tegundir leyfa, utan sandkassa | `quotaScope: "company"`, `requestUrl` |
| 6 | Pottur kallandans er tæmdur og potturinn lokar | Fyrirframgreitt leyfi, utan sandkassa | `requestUrl` |

Engu er hafnað vegna kvóta í SaaS-**sandkassa**.

```json
{ "status": "Error", "error": "Message quota for the User pool is exhausted. Visit … to request additional licenses.", "requestUrl": "…" }
```

```json
{ "status": "Error", "error": "User monthly message quota is exhausted. Visit … to review quotas or request a higher limit.", "requestUrl": "…", "quotaScope": "user" }
```

### Fyrirframgreiddir pottar, vikmörk og lokun

Leyfisþjónustan heldur utan um eftirstöðvar hvers potts (keypt magn að frádreginni tilkynntri
notkun), og dagleg samstilling geymir þær í skyndiminni.

- Þegar pottur nær núlli er enn hægt að nota **100 skilaboð í vikmörk**.
- Þegar vikmörkin eru uppurin er potturinn tæmdur. Hvort tæmdur pottur hafnar köllum er samið um
  fyrir hvern leigjanda og birtist sem `blockOnMissingQuota` (sjá
  [Staða skoðuð](#checking-status)):

| Gildi | Áhrif |
|-------|-------|
| `true` (venjulega sjálfgefið) | Kallinu er hafnað með villunni um uppurinn kvóta hér að ofan. |
| `false` | Kallið keyrir. Það er áfram talið og svarið ber áfram kvótaviðvörunina. |

- Fyrir fyrstu samstillingu, á meðan eftirstöðvarnar eru enn óþekktar, eru köll leyfð.

### Mánaðarlegir kvótar

Hvaða leigjandi sem er getur sett **Mánaðarlegan skilaboðakvóta fyrirtækis** (Uppsetning Bifröst) og
**mánaðarlegan skilaboðakvóta** fyrir hvern notanda (Uppsetning notanda Bifröst) - á áskrift eru
þeir einu takmörkin. `0` þýðir engin takmörk. Þegar kvóta er náð er köllum hafnað fram að næsta
almanaksmánuði. Kvóti notanda er athugaður á undan kvóta fyrirtækis.

## Viðvaranir

Árangursríkt JSON-svar ber `warnings` fylki þegar kvóti sem á við um kallandann á **100 eða færri**
skilaboð eftir - fyrirframgreiddur pottur eða mánaðarlegur kvóti.

| Alvarleiki | Merking |
|------------|---------|
| `approaching` | 100 eða færri skilaboð eftir. |
| `grace` | Fyrirframgreiddi potturinn er uppurinn; verið er að nota vikmörkin upp á 100 skilaboð. |
| `exhausted` | Fyrirframgreiddi potturinn og vikmörk hans eru uppurin. Næst aðeins þegar `blockOnMissingQuota` er `false` - annars hefði kallinu verið hafnað. |

```json
{
  "status": "Success",
  "result": { "...": "..." },
  "warnings": [
    { "code": "LicenseQuota", "severity": "approaching", "message": "Message quota is running low. Visit … to review quotas or request a higher limit.", "requestUrl": "…" }
  ]
}
```

Síðan Uppsetning Bifröst sýnir einnig tilkynningu þegar annar hvor fyrirframgreiddi potturinn fer
undir 1.000.

## Dagleg samstilling notkunar

Notkun er tilkynnt til leyfisþjónustunnar einu sinni á dag **fyrir hvert fyrirtæki**. Fyrstu
gjaldskyldu skilaboð dagsins setja af stað bakgrunnsverk sem tilkynnir gjaldskyld skilaboð hvers
liðins dags eftir potti og endurnýjar eftirstöðvarnar í skyndiminni. **Samstilla** á síðunni
Uppsetning Bifröst gerir það sama strax, að meðtöldum skilaboðum dagsins, og virkjar auk þess boð og
uppsagnir - sjá [Úrsögn og uppsögn](/foundation/licensing/leaving-and-cancelling/). Notkun er
tilkynnt eftir **tætigildi fyrirtækis** undir **tætigildi leigjanda**.

## Staða skoðuð {#checking-status}

- `Help.Bifrost.Get` skilar núverandi leyfisstöðu sem `licenseStatus`.
- [`Bifrost.Subscription.GetStatus`](/foundation/reference/message-types/bifrost-subscription-getstatus/)
  skilar stillingum leigjandans, leyfisstöðu og notkun yfirstandandi mánaðar.
- Upplýsingareiturinn **Leyfi** á síðunni Uppsetning Bifröst sýnir sömu upplýsingar auk fjölda
  ótilkynntra skilaboða og dagsetningar síðustu samstillingar.

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
| `remaining` | heiltala / null | Skilaboð sem eftir eru í pottinum; `null` á meðan ekkert gildi hefur verið samstillt. Neikvætt á meðan verið er að nota vikmörkin. |
| `valid` | boolean | Ósatt þegar potturinn er kominn fram úr vikmörkunum og er ekki lengur innan kvóta. |
| `blockOnMissingQuota` | boolean | `true` (sjálfgefið) hafnar köllum þegar potturinn er tæmdur; `false` lætur þau keyra, telur þau áfram og skilar áfram viðvöruninni. Skrifvarið - endurnýjað við leyfissamstillingu. |

## Meiri kvóti keyptur

Fyrirframgreiddur skilaboðakvóti er keyptur frá Origo, fyrir hvern pott. Eftir kaup endurnýjar
næsta samstilling eftirstöðvarnar sem birtast í `licenseStatus` og í upplýsingareitnum Leyfi.
