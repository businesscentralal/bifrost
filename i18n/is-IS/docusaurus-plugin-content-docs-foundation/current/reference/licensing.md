---
id: licensing
title: "Licensing"
sidebar_position: 7
---

Bifröst notar leyfislíkan sem byggir á **skilaboðakvóta**. Engin úthlutun á einstaka notendur
og engin athugun á leyfisþrepum. Tveir kvótapottar eru mældir, hvor um sig í **leyfiseiningum**:

| Pottur | Notað af |
|--------|----------|
| **Notandi** (User) | Skilaboð unnin í samhengi venjulegs notanda (gagnvirkt eða vefþjónusta). |
| **Forritsskráning** (App Registration) | Skilaboð unnin af Microsoft Entra forriti (þjónustuaðila). |

## Hvað telur

Skilaboð draga einingar úr potti kallandans þegar allt eftirfarandi á við:

- Skilaboðategundin er **ekki undanþegin**. `Help.*` og `Webhook.*` tegundir eru undanþegnar — þær
  keyra alltaf, eru aldrei stöðvaðar og draga aldrei af kvóta.
- Skilaboðin voru unnin **með árangri** (JSON-svar með `status` annað en `Success` telur ekki;
  svör sem ekki eru JSON, t.d. PDF/CSV, teljast árangursrík).

Talning og framfylgd fara fram á einum miðlægum stað þegar skilaboð eru unnin; einstakar útfærslur
skilaboðategunda framkvæma ekki leyfisathuganir.

## Hvað skilaboð kosta

Hversu margar einingar árangursrík skilaboð nýta ræðst af skilaboðategundinni sjálfri, í gegnum
viðmótið `Msg Metering ori` á enuminu `Message Type ori`. Viðmótið svarar þremur spurningum fyrir
hverja tegund: **gjaldvægi** (einingar á hvert árangursríkt kall), hvort tegundin er **undanþegin**,
og valfrjálsa **mælinum** sem notkunin er tilkynnt undir.

Skilaboðategund sem útfærir það ekki — sem eru allar tegundir sem hafa ekki tekið það upp, þar með
taldar enum-viðbótargildi háðra forrita — fellur aftur á `Default Metering ori`: vægi **1**, `Help.*`
og `Webhook.*` undanþegnar eftir nafnforskeyti, enginn mælir. Það er nákvæmlega hegðunin sem lýst er
hér að ofan, óbreytt.

Hver unnin skilaboð skrá því tvo reiti á `Message ori` færsluna til viðbótar við gjaldtegundina:

| Reitur | Tegund | Merking |
|--------|--------|---------|
| **Gjaldvægi** (Charge Weight) | Heiltala, `1` sjálfgefið | Leyfiseiningarnar sem þessi skilaboð nýttu. |
| **Mælir** (Meter) | Code[50] | Valfrjálsi mælirinn sem skilaboðin voru tilkynnt undir. Autt þýðir eingöngu heildartala pottsins. |

Færslur sem voru gjaldfærðar fyrir þessa útgáfu bera ekkert vægi; uppfærslueiningin fyllir þær út með
vægi 1, þannig að söguleg notkun telst nákvæmlega eins og hún var tilkynnt.

Sjá [mælingaviðmótið](/foundation/reference/metering-interface/) fyrir samninginn, og
[Mæling skilaboðategundar](/extensibility/metering) fyrir hvernig háð forrit tekur það upp.

## Prufuútgáfa

Við uppsetningu er útvegaður prufukvóti upp á **1.000 Notanda + 1.000 Forritsskráningar** skilaboð
fyrir leigjandann.

## Framfylgd

Áður en gjaldfært skilaboð er unnið er pottur kallandans athugaður fyrir þann fjölda eininga sem
skilaboðategundin biður um:

- Ef eftirstöðvar pottsins eru **0 eða minna** eru skilaboðin **ekki unnin** og skilað er
  formuðu villusvari (`status` = `Error`) með `requestUrl`.
- Ef eftirstöðvar eru óþekktar (ný uppsetning fyrir fyrstu samstillingu, eða leyfisþjónustan er
  tímabundið ónáanleg) er vinnsla **leyfð** (fail-open).

Föst **100 skilaboða umlíðun** er beitt af leyfisþjónustunni, þannig að pottur heldur áfram að virka
örlítið umfram keypt magn áður en hann er stöðvaður.

## Viðvaranir um lágan kvóta

Árangursrík JSON-svör bera `warnings` fylki þegar pottur kallandans er að klárast:

| Eftirstöðvar | Alvarleiki |
|--------------|------------|
| undir 1.000 | `approaching` |
| 100 eða minna | `grace` |

Uppsetningarsíða Bifröst sýnir einnig tilkynningu þegar annar potturinn fer undir 1.000.

## Dagleg samstilling notkunar

Notkun er tilkynnt til leyfisþjónustunnar einu sinni á dag **fyrir hvert fyrirtæki**:

- Fyrstu gjaldfæru skilaboð dagsins áætla bakgrunnsverk.
- Verkið **leggur saman gjaldvægi** gjaldfærðra skilaboða hvers liðins dags eftir potti (það telur
  ekki lengur færslur), endurnýjar eftirstöðvar beggja potta og núllstillir tilkynntu skilaboðin.
- Notkun er tilkynnt eftir **tætigildi fyrirtækis** undir **tætigildi leigjanda**.

Þegar notkun dagsins skiptist á nefnda mæla ber notkunarskjalið valfrjálsa `meters` sundurliðun við
hliðina á `quantity`. Sundurliðunin er viðbót og afturvirkt samhæf: hún vantar þegar enginn mælir er
notaður, og samtala mælanna er aldrei hærri en `quantity`.

```json
{
  "docType": "usage",
  "tenantId": "…",
  "companyId": "…",
  "date": "2026-09-05",
  "licenseType": "User",
  "quantity": 412,
  "meters": { "PLAYBOOK": 180, "LLM": 96 }
}
```

## Að skoða stöðu

- `Help.Bifrost.Get` skilar núverandi leyfisstöðu (tætigildi leigjanda og fyrirtækis, ásamt
  eftirstöðvum og gildi hvers potts).
- `Help.License.Get` skilar leyfis- og reikningsskjölunum, ásamt valfrjálsum `pendingMeters` hlut með
  einingum á hvern mæli sem hafa verið gjaldfærðar staðbundið en ekki enn tilkynntar. Eigindin er
  aðeins skrifuð þegar að minnsta kosti ein mæld skilaboð bíða, þannig að svör hjá leigjendum sem
  nota enga mæla eru óbreytt.
- `Help.MessageTypes.Get` skilar `exempt`, `chargeWeight` og `meter` fyrir hverja skilaboðategund,
  svo kallandi getur verðlagt kall áður en hann gerir það. Tegundin er sitt eigið dæmi: hún lýsir
  yfir undanþágu sinni í gegnum mælingaviðmótið í stað þess að reiða sig á `Help.*` nafnforskeytið.
- `Help.License.Sync` (aðeins stjórnandi) þvingar samstillingu strax og skilar uppfærðri stöðu.
- **Leyfi**-staðreyndareiturinn á uppsetningarsíðunni sýnir sömu upplýsingar auk fjölda óskráðra
  skilaboða og dagsetningar síðustu samstillingar.

## Að óska eftir leyfum

Notaðu **Óska eftir leyfi** á uppsetningarsíðu Bifröst (eða aðgerð tilkynningar um lágan kvóta)
til að opna drög að tölvupósti til Origo. Tölvupósturinn er forútfylltur með heiti fyrirtækisins,
**tætigildi leigjandakennis**, tætigildi fyrirtækjakennis og **raunverulegt leigjandakenni** svo
hægt sé að afgreiða beiðnina. Þar er einnig staðargeymir þar sem þú ættir að bæta við
viðeigandi upplýsingum um þig og fyrirtækið þitt áður en þú sendir.
