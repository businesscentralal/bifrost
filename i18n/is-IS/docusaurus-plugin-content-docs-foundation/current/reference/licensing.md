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

## Prufuútgáfa

Við uppsetningu er útvegaður prufukvóti upp á **1.000 Notanda + 1.000 Forritsskráningar** skilaboð
fyrir leigjandann.

## Framfylgd

Áður en gjaldfært skilaboð er unnið er pottur kallandans athugaður:

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
- Verkið tilkynnir gjaldfærða talningu hvers liðins dags eftir potti, endurnýjar eftirstöðvar
  beggja potta og núllstillir tilkynntu skilaboðin.
- Notkun er tilkynnt eftir **tætigildi fyrirtækis** undir **tætigildi leigjanda**.

## Að skoða stöðu

- `Help.Bifrost.Get` skilar núverandi leyfisstöðu (tætigildi leigjanda og fyrirtækis, ásamt
  eftirstöðvum og gildi hvers potts).
- `Help.License.Sync` (aðeins stjórnandi) þvingar samstillingu strax og skilar uppfærðri stöðu.
- **Leyfi**-staðreyndareiturinn á uppsetningarsíðunni sýnir sömu upplýsingar auk fjölda óskráðra
  skilaboða og dagsetningar síðustu samstillingar.

## Að óska eftir leyfum

Notaðu **Óska eftir leyfi** á uppsetningarsíðu Bifröst (eða aðgerð tilkynningar um lágan kvóta)
til að opna drög að tölvupósti til Origo. Tölvupósturinn er forútfylltur með heiti fyrirtækisins,
**tætigildi leigjandakennis**, tætigildi fyrirtækjakennis og **raunverulegt leigjandakenni** svo
hægt sé að afgreiða beiðnina. Þar er einnig staðargeymir þar sem þú ættir að bæta við
viðeigandi upplýsingum um þig og fyrirtækið þitt áður en þú sendir.
